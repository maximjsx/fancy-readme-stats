// @ts-check
import { retryer } from "../common/retryer.js";
import { MissingParamError, request } from "../common/utils.js";
import { trackUsername, trackRepository } from "../common/db.js";

/**
 * @typedef {import('axios').AxiosRequestHeaders} AxiosRequestHeaders Axios request headers.
 * @typedef {import('axios').AxiosResponse} AxiosResponse Axios response.
 */

/**
 * Repo data fetcher.
 *
 * @param {AxiosRequestHeaders} variables Fetcher variables.
 * @param {string} token GitHub token.
 * @returns {Promise<AxiosResponse>} The response.
 */
const fetcher = (variables, token) => {
  return request(
    {
      query: `
      fragment RepoInfo on Repository {
        name
        nameWithOwner
        isPrivate
        isArchived
        isTemplate
        stargazers {
          totalCount
        }
        description
        primaryLanguage {
          color
          id
          name
        }
        forkCount
        watchers {
          totalCount
        }
        issues(states: OPEN) {
          totalCount
        }
      }
      query getRepo($login: String!, $repo: String!) {
        user(login: $login) {
          repository(name: $repo) {
            ...RepoInfo
          }
        }
        organization(login: $login) {
          repository(name: $repo) {
            ...RepoInfo
          }
        }
      }
    `,
      variables,
    },
    {
      Authorization: `token ${token}`,
    },
  );
};

const urlExample = "/api/pin?username=USERNAME&amp;repo=REPO_NAME";

/**
 * @typedef {import("./types").RepositoryData} RepositoryData Repository data.
 */


const repoCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch repository data.
 *
 * @param {string} username GitHub username.
 * @param {string} reponame GitHub repository name.
 * @returns {Promise<RepositoryData>} Repository data.
 */
const fetchRepo = async (username, reponame) => {
  if (!username && !reponame) {
    throw new MissingParamError(["username", "repo"], urlExample);
  }
  if (!username) {
    throw new MissingParamError(["username"], urlExample);
  }
  if (!reponame) {
    throw new MissingParamError(["repo"], urlExample);
  }


  const cacheKey = `${username}/${reponame}`;
  const cachedData = repoCache.get(cacheKey);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
    return cachedData.data;
  }

  try {

    Promise.all([
      trackUsername(username),
      trackRepository(username, reponame),
    ]).catch((error) => {
      console.error("Failed to track username or repository:", error);
    });

    const res = await retryer(fetcher, { login: username, repo: reponame });
    const data = res.data.data;

    if (!data.user && !data.organization) {
      throw new Error("Not found");
    }

    const isUser = data.organization === null && data.user;
    const isOrg = data.user === null && data.organization;

    let repoData;

    if (isUser) {
      if (!data.user.repository || data.user.repository.isPrivate) {
        throw new Error("User Repository Not found");
      }
      repoData = {
        ...data.user.repository,
        starCount: data.user.repository.stargazers.totalCount,
      };
    } else if (isOrg) {
      if (
        !data.organization.repository ||
        data.organization.repository.isPrivate
      ) {
        throw new Error("Organization Repository Not found");
      }
      repoData = {
        ...data.organization.repository,
        starCount: data.organization.repository.stargazers.totalCount,
      };
    } else {
      throw new Error("Unexpected behavior");
    }

  
    repoCache.set(cacheKey, {
      data: repoData,
      timestamp: Date.now(),
    });

    return repoData;
  } catch (error) {

    repoCache.set(cacheKey, {
      error,
      timestamp: Date.now(),
    });
    throw error;
  }
};


setInterval(() => {
  const now = Date.now();
  for (const [key, value] of repoCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      repoCache.delete(key);
    }
  }
}, CACHE_TTL);

export { fetchRepo };
export default fetchRepo;
