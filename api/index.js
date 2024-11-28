import { renderStatsCard } from "../src/cards/stats-card.js";
import { blacklist } from "../src/common/blacklist.js";
import {
  clampValue,
  CONSTANTS,
  parseArray,
  parseBoolean,
  renderError,
} from "../src/common/utils.js";
import { fetchStats } from "../src/fetchers/stats-fetcher.js";

export default async (req, res) => {
  const {
    username,
    hide,
    title,
    description,
    show_icons,
    include_all_commits,
    text_bold,
    theme,
    email,
    footer,
    exclude_repo,
    custom_title,
    locale,
    height,
    disable_animations,
    border_radius,
    number_format,
    hide_border,
    hide_title,
    dark_bg,
  } = req.query;
  res.setHeader("Content-Type", "image/svg+xml");

  if (blacklist.includes(username)) {
    return res.send(
      renderError("Something went wrong", "This username is blacklisted", {
        title_color,
        text_color,
        border_color,
        theme,
      }),
    );
  }

  try {
    const stats = await fetchStats(
      username,
      parseBoolean(include_all_commits),
      parseArray(exclude_repo),
    );

    let cacheSeconds = clampValue(
      parseInt(CONSTANTS.CARD_CACHE_SECONDS, 10),
      CONSTANTS.TWELVE_HOURS,
      CONSTANTS.TWO_DAY,
    );

    cacheSeconds = process.env.CACHE_SECONDS
      ? parseInt(process.env.CACHE_SECONDS, 10) || cacheSeconds
      : cacheSeconds;

    res.setHeader(
      "Cache-Control",
      `max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    );

    return res.send(
      renderStatsCard(stats, {
        hide: parseArray(hide),
        show_icons: parseBoolean(show_icons),
        hide_border: parseBoolean(hide_border),
        card_width: 10,
        include_all_commits: parseBoolean(include_all_commits),
        text_bold: parseBoolean(text_bold),
        hide_title: parseBoolean(hide_title),
        theme,
        email,
        custom_height: height,
        footer,
        title_text: title,
        description_text: description,
        custom_title,
        border_radius,
        number_format,
        locale: locale ? locale.toLowerCase() : null,
        disable_animations: parseBoolean(disable_animations),
        dark_bg,
      }),
    );
  } catch (err) {
    
    res.setHeader(
      "Cache-Control",
      `max-age=${CONSTANTS.ERROR_CACHE_SECONDS / 2}, s-maxage=${
        CONSTANTS.ERROR_CACHE_SECONDS
      }, stale-while-revalidate=${CONSTANTS.ONE_DAY}`,
    ); // Use lower cache period for errors.
    return res.send(
      renderError(err.message, err.secondaryMessage, {}),
    );
  }
};
