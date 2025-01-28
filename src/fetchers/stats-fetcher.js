// @ts-check
import axios from "axios";
import * as dotenv from "dotenv";
import githubUsernameRegex from "github-username-regex";
import { calculateRank } from "../calculateRank.js";
import { retryer } from "../common/retryer.js";
import {
  CustomError,
  logger,
  MissingParamError,
  request,
  wrapTextMultiline,
} from "../common/utils.js";
import { trackUsername } from "../common/db.js";

dotenv.config();

const GRAPHQL_REPOS_FIELD = `
  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: $after) {
    totalCount
    nodes {
      name
      stargazers { totalCount }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`;

const GRAPHQL_REPOS_QUERY = `
  query userInfo($login: String!, $after: String) {
    user(login: $login) {
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;

const GRAPHQL_STATS_QUERY = `
  query userInfo($login: String!, $after: String, $includeMergedPullRequests: Boolean!, $includeDiscussions: Boolean!, $includeDiscussionsAnswers: Boolean!) {
    user(login: $login) {
      name
      login
      contributionsCollection {
        totalCommitContributions
        totalPullRequestReviewContributions
      }
      repositoriesContributedTo(first: 1) { totalCount }
      pullRequests(first: 1) { totalCount }
      mergedPullRequests: pullRequests(states: MERGED) @include(if: $includeMergedPullRequests) { totalCount }
      openIssues: issues(states: OPEN) { totalCount }
      closedIssues: issues(states: CLOSED) { totalCount }
      followers { totalCount }
      repositoryDiscussions @include(if: $includeDiscussions) { totalCount }
      repositoryDiscussionComments(onlyAnswers: true) @include(if: $includeDiscussionsAnswers) { totalCount }
      ${GRAPHQL_REPOS_FIELD}
    }
  }
`;

/**
 * @typedef {import('axios').AxiosResponse} AxiosResponse Axios response.
 */

/**
 * Stats fetcher object.
 *
 * @param {object} variables Fetcher variables.
 * @param {string} token GitHub token.
 * @returns {Promise<AxiosResponse>} Axios response.
 */
const fetcher = (variables, token) => {
  const query = variables.after ? GRAPHQL_REPOS_QUERY : GRAPHQL_STATS_QUERY;
  return request(
    {
      query,
      variables,
    },
    {
      Authorization: `bearer ${token}`,
      timeout: 10000, //10 second timeout
    },
  );
};

/**
 * Fetch stats information for a given username.
 *
 * @param {object} variables Fetcher variables.
 * @param {string} variables.username Github username.
 * @param {boolean} variables.includeMergedPullRequests Include merged pull requests.
 * @param {boolean} variables.includeDiscussions Include discussions.
 * @param {boolean} variables.includeDiscussionsAnswers Include discussions answers.
 * @returns {Promise<AxiosResponse>} Axios response.
 *
 * @description This function supports multi-page fetching if the 'FETCH_MULTI_PAGE_STARS' environment variable is set to true.
 */
const statsFetcher = async ({
  username,
  includeMergedPullRequests,
  includeDiscussions,
  includeDiscussionsAnswers,
}) => {
  const initialVariables = {
    login: username,
    first: 100,
    includeMergedPullRequests,
    includeDiscussions,
    includeDiscussionsAnswers,
  };

  let stats = await retryer(fetcher, initialVariables);
  if (stats.data.errors) {
    return stats;
  }

  if (process.env.FETCH_MULTI_PAGE_STARS === "true") {
    const pageInfo = stats.data.data.user.repositories.pageInfo;
    if (pageInfo.hasNextPage) {
      const promises = [];
      let currentCursor = pageInfo.endCursor;

      // Fetch all remaining pages in parallel
      while (currentCursor) {
        const variables = {
          login: username,
          after: currentCursor,
        };
        promises.push(retryer(fetcher, variables));
        currentCursor = null; // Will be updated if there are more pages
      }

      const results = await Promise.all(promises);

      // Merge results
      for (const res of results) {
        if (!res.data.errors) {
          const nodes = res.data.data.user.repositories.nodes;
          stats.data.data.user.repositories.nodes.push(...nodes);
        }
      }
    }
  }

  return stats;
};

/**
 * Fetch all the commits for all the repositories of a given username.
 *
 * @param {string} username GitHub username.
 * @returns {Promise<number>} Total commits.
 *
 * @description Done like this because the GitHub API does not provide a way to fetch all the commits. See
 * #92#issuecomment-661026467 and #211 for more information.
 */
const totalCommitsFetcher = async (username) => {
  if (!githubUsernameRegex.test(username)) {
    logger.log("Invalid username provided.");
    throw new Error("Invalid username provided.");
  }

  // https://developer.github.com/v3/search/#search-commits
  const fetchTotalCommits = (variables, token) => {
    return axios({
      method: "get",
      url: `https://api.github.com/search/commits?q=author:${variables.login}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
        Authorization: `token ${token}`,
      },
    });
  };

  let res;
  try {
    res = await retryer(fetchTotalCommits, { login: username });
  } catch (err) {
    logger.log(err);
    throw new Error(err);
  }

  const totalCount = res.data.total_count;
  if (!totalCount || isNaN(totalCount)) {
    throw new CustomError(
      "Could not fetch total commits.",
      CustomError.GITHUB_REST_API_ERROR,
    );
  }
  return totalCount;
};

/**
 * @typedef {import("./types").StatsData} StatsData Stats data.
 */

const statsCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; //60 minutes

/**
 * Fetch stats for a given username.
 *
 * @param {string} username GitHub username.
 * @param {boolean} include_all_commits Include all commits.
 * @param {string[]} exclude_repo Repositories to exclude.
 * @param {boolean} include_merged_pull_requests Include merged pull requests.
 * @param {boolean} include_discussions Include discussions.
 * @param {boolean} include_discussions_answers Include discussions answers.
 * @returns {Promise<StatsData>} Stats data.
 */
const fetchStats = async (
  username,
  include_all_commits = false,
  exclude_repo = [],
  include_merged_pull_requests = true,
  include_discussions = false,
  include_discussions_answers = false,
) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  const cacheKey = JSON.stringify({
    username,
    include_all_commits,
    exclude_repo,
    include_merged_pull_requests,
    include_discussions,
    include_discussions_answers,
  });

  const cachedData = statsCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.stats;
  }

  try {
    trackUsername(username).catch((error) => {
      console.error("Failed to track username:", error);
    });

    const stats = {
      name: "",
      totalPRs: 0,
      totalPRsMerged: 0,
      mergedPRsPercentage: 0,
      totalReviews: 0,
      totalCommits: 0,
      totalIssues: 0,
      totalStars: 0,
      totalDiscussionsStarted: 0,
      totalDiscussionsAnswered: 0,
      contributedTo: 0,
      rank: { level: "C", percentile: 100 },
    };

    const [statsRes, totalCommits] = await Promise.all([
      statsFetcher({
        username,
        includeMergedPullRequests: include_merged_pull_requests,
        includeDiscussions: include_discussions,
        includeDiscussionsAnswers: include_discussions_answers,
      }),
      include_all_commits ? totalCommitsFetcher(username) : Promise.resolve(0),
    ]);

    if (statsRes.data.errors) {
      logger.error(statsRes.data.errors);
      if (statsRes.data.errors[0].type === "NOT_FOUND") {
        throw new CustomError(
          statsRes.data.errors[0].message || "Could not fetch user.",
          CustomError.USER_NOT_FOUND,
        );
      }
      if (statsRes.data.errors[0].message) {
        throw new CustomError(
          wrapTextMultiline(statsRes.data.errors[0].message, 90, 1)[0],
          statsRes.statusText,
        );
      }
      throw new CustomError(
        "Something went wrong while trying to retrieve the stats data using the GraphQL API.",
        CustomError.GRAPHQL_ERROR,
      );
    }

    const user = statsRes.data.data.user;

    const repoToHide = new Set(exclude_repo);
    const totalStars = user.repositories.nodes
      .filter((data) => !repoToHide.has(data.name))
      .reduce((prev, curr) => prev + curr.stargazers.totalCount, 0);

    Object.assign(stats, {
      name: user.name || user.login,
      totalCommits: include_all_commits
        ? totalCommits
        : user.contributionsCollection.totalCommitContributions,
      totalPRs: user.pullRequests.totalCount,
      totalReviews:
        user.contributionsCollection.totalPullRequestReviewContributions,
      totalIssues: user.openIssues.totalCount + user.closedIssues.totalCount,
      contributedTo: user.repositoriesContributedTo.totalCount,
      totalStars,
    });

    if (include_merged_pull_requests) {
      stats.totalPRsMerged = user.mergedPullRequests.totalCount;
      stats.mergedPRsPercentage =
        (user.mergedPullRequests.totalCount / user.pullRequests.totalCount) *
        100;
    }

    if (include_discussions) {
      stats.totalDiscussionsStarted = user.repositoryDiscussions.totalCount;
    }

    if (include_discussions_answers) {
      stats.totalDiscussionsAnswered =
        user.repositoryDiscussionComments.totalCount;
    }

    stats.rank = calculateRank({
      all_commits: include_all_commits,
      commits: stats.totalCommits,
      prs: stats.totalPRs,
      reviews: stats.totalReviews,
      issues: stats.totalIssues,
      repos: user.repositories.totalCount,
      stars: stats.totalStars,
      followers: user.followers.totalCount,
    });

    statsCache.set(cacheKey, {
      stats,
      timestamp: Date.now(),
    });

    return stats;
  } catch (error) {
    statsCache.set(cacheKey, {
      error,
      timestamp: Date.now(),
    });
    throw error;
  }
};

//cache cleanup
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of statsCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      statsCache.delete(key);
    }
  }
}, CACHE_TTL);

export { fetchStats };
export default fetchStats;
