// @ts-check
import { Card } from "../common/Card.js";
import { icons, rankIcon } from "../common/icons.js";
import {
  CustomError,
  clampValue,
  flexLayout,
  getCardColors,
  kFormatter,
  measureText,
} from "../common/utils.js";

import { statCardLocales } from "../translations.js";
import { I18n } from "../common/I18n.js";

const CARD_LEFT_MIN_WIDTH = 250;
const CARD_DEFAULT_WIDTH = 250;
const RANK_CARD_LEFT_MIN_WIDTH = 756;
const RANK_CARD_DEFAULT_WIDTH = 810;
const CARD_RIGHT_MIN_WIDTH = 250;
const CARD_RIGHT_DEFAULT_WIDTH = 250;
const RANK_ONLY_CARD_MIN_WIDTH = 290;
const RANK_ONLY_CARD_DEFAULT_WIDTH = 290;

const createTextNode = ({
  icon,
  label,
  value,
  id,
  unitSymbol,
  index,
  showIcons,
  shiftValuePos,
  bold,
  number_format,
}) => {
  const kValue =
    number_format.toLowerCase() === "long" ? value : kFormatter(value);
  const staggerDelay = (index + 3) * 150;

  const labelOffset = showIcons ? `x="25"` : "";
  const iconSvg = showIcons
    ? `
    <svg data-testid="icon" class="icon" viewBox="0 0 16 16" version="1.1" width="16" height="16">
      ${icon}
    </svg>
  `
    : "";
  return `
    <g class="stagger" style="animation-delay: ${staggerDelay}ms" transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat ${bold ? " bold" : "not_bold"}" ${labelOffset} y="12.5">${label}:</text>
      <text
        class="stat ${bold ? " bold" : "not_bold"}"
        x="${(showIcons ? 140 : 120) + shiftValuePos}"
        y="12.5"
        data-testid="${id}"
      >${kValue}${unitSymbol ? ` ${unitSymbol}` : ""}</text>
    </g>
  `;
};

const calculateCircleProgress = (value) => {
  const radius = 40;
  const c = Math.PI * (radius * 2);

  if (value < 0) value = 0;
  if (value > 100) value = 100;

  return ((100 - value) / 100) * c;
};

const getProgressAnimation = ({ progress }) => {
  return `
    @keyframes rankAnimation {
      from {
        stroke-dashoffset: ${calculateCircleProgress(0)};
      }
      to {
        stroke-dashoffset: ${calculateCircleProgress(progress)};
      }
    }
  `;
};

const getStyles = ({
  titleColor,
  textColor,
  iconColor,
  ringColor,
  show_icons,
  progress,
}) => {
  return `
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; fill: ${textColor};
    }
    @supports(-moz-appearance: auto) {
      .stat { font-size:12px; }
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .rank-text {
      font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${textColor};
      animation: scaleInAnimation 0.3s ease-in-out forwards;
    }
    .rank-percentile-header {
      font-size: 14px;
    }
    .rank-percentile-text {
      font-size: 16px;
    }
    
    .not_bold { font-weight: 400 }
    .bold { font-weight: 700 }
    .icon {
      fill: ${iconColor};
      display: ${show_icons ? "block" : "none"};
    }

    .rank-circle-rim {
      stroke: ${ringColor};
      fill: none;
      stroke-width: 6;
      opacity: 0.2;
    }
    .rank-circle {
      stroke: ${ringColor};
      stroke-dasharray: 250;
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      opacity: 0.8;
      transform-origin: -10px 8px;
      transform: rotate(-90deg);
      animation: rankAnimation 1s forwards ease-in-out;
    }
    ${process.env.NODE_ENV === "test" ? "" : getProgressAnimation({ progress })}
  `;
};

const renderStatsCard = (stats, options = {}) => {
  const {
    name,
    totalStars,
    totalCommits,
    totalIssues,
    totalPRs,
    totalPRsMerged,
    contributedTo,
    rank,
  } = stats;
  const {
    hide = [],
    show_icons = false,
    hide_border = false,
    card_width,
    hide_rank = false,
    include_all_commits = false,
    line_height = 25,
    title_color,
    ring_color,
    icon_color,
    text_color,
    text_bold = true,
    bg_color,
    theme = "beach",
    dark_bg = 1,
    custom_title,
    border_radius,
    border_color,
    number_format = "short",
    locale,
    disable_animations = false,
    title_text,
    description_text,
    email,
  } = options;

  const lheight = parseInt(String(line_height), 10);

  const { titleColor, iconColor, textColor, bgColor, borderColor, ringColor } =
    getCardColors({
      title_color,
      text_color,
      icon_color,
      bg_color,
      border_color,
      ring_color,
      theme,
    });

  
  const apostrophe = ["x", "s"].includes(name.slice(-1).toLocaleLowerCase())
    ? ""
    : "s";
  const i18n = new I18n({
    locale,
    translations: statCardLocales({ name, apostrophe }),
  });


  const STATS = {
    stars: {
      icon: icons.star,
      label: i18n.t("statcard.totalstars"),
      value: totalStars,
      id: "stars",
    },
    commits: {
      icon: icons.commits,
      label: `${i18n.t("statcard.commits")}${
        include_all_commits ? "" : ` (${new Date().getFullYear()})`
      }`,
      value: totalCommits,
      id: "commits",
    },
    prs: {
      icon: icons.prs,
      label: i18n.t("statcard.prs"),
      value: totalPRs,
      id: "prs",
    },
    issues: {
      icon: icons.issues,
      label: i18n.t("statcard.issues"),
      value: totalIssues,
      id: "issues",
    },
    contribs: {
      icon: icons.contribs,
      label: i18n.t("statcard.contribs"),
      value: contributedTo,
      id: "contribs",
    },
  };

  STATS.prs_merged = {
    icon: icons.prs_merged,
    label: i18n.t("statcard.prs-merged"),
    value: totalPRsMerged,
    id: "prs_merged",
  };

  const statItemsLeft = Object.keys(STATS)
    .filter(
      (key) =>
        !hide.includes(key) &&
        key !== "issues" &&
        key !== "contribs" &&
        key !== "prs_merged",
    )
    .map((key, index) =>
      createTextNode({
        icon: STATS[key].icon,
        label: STATS[key].label,
        value: STATS[key].value,
        id: STATS[key].id,
        unitSymbol: STATS[key].unitSymbol,
        index,
        showIcons: show_icons,
        shiftValuePos: 50,
        bold: text_bold,
        number_format,
      }),
    );

  const statItemsRight = Object.keys(STATS)
    .filter(
      (key) =>
        !hide.includes(key) &&
        (key === "issues" || key === "contribs" || key === "prs_merged"),
    )
    .map((key, index) =>
      createTextNode({
        icon: STATS[key].icon,
        label: STATS[key].label,
        value: STATS[key].value,
        id: STATS[key].id,
        unitSymbol: STATS[key].unitSymbol,
        index,
        showIcons: show_icons,
        shiftValuePos: 50,
        bold: text_bold,
        number_format,
      }),
    );

  if (statItemsLeft.length === 0 && statItemsRight.length === 0 && hide_rank) {
    throw new CustomError(
      "Could not render stats card.",
      "Either stats or rank are required.",
    );
  }

  let height = Math.max(
    45 + (statItemsLeft.length + statItemsRight.length + 1) * lheight,
    hide_rank ? 0 : statItemsLeft.length || statItemsRight.length ? 150 : 180,
  );

  const progress = 100 - rank.percentile;
  const cssStyles = getStyles({
    titleColor,
    ringColor,
    textColor,
    iconColor,
    show_icons,
    progress,
  });

  const calculateTextWidth = () => {
    return measureText(custom_title ? custom_title : "Stats");
  };

  const iconWidth =
    show_icons && (statItemsLeft.length || statItemsRight.length) ? 16 + 1 : 0;
  const minLeftCardWidth =
    (hide_rank
      ? clampValue(50 + calculateTextWidth() * 2, CARD_LEFT_MIN_WIDTH, Infinity)
      : statItemsLeft.length
        ? RANK_CARD_LEFT_MIN_WIDTH
        : RANK_ONLY_CARD_MIN_WIDTH) + iconWidth;
  const defaultLeftCardWidth =
    (hide_rank
      ? CARD_DEFAULT_WIDTH
      : statItemsLeft.length
        ? RANK_CARD_DEFAULT_WIDTH
        : RANK_ONLY_CARD_DEFAULT_WIDTH) + iconWidth;
  const minRightCardWidth =
    (hide_rank
      ? clampValue(
          50 + calculateTextWidth() * 2,
          CARD_RIGHT_MIN_WIDTH,
          Infinity,
        )
      : statItemsRight.length
        ? CARD_RIGHT_MIN_WIDTH
        : RANK_ONLY_CARD_MIN_WIDTH) + iconWidth;
  const defaultRightCardWidth =
    (hide_rank
      ? CARD_RIGHT_DEFAULT_WIDTH
      : statItemsRight.length
        ? CARD_RIGHT_DEFAULT_WIDTH
        : RANK_ONLY_CARD_DEFAULT_WIDTH) + iconWidth;
  let leftWidth = card_width
    ? isNaN(card_width)
      ? defaultLeftCardWidth
      : card_width
    : defaultLeftCardWidth;
  let rightWidth = card_width
    ? isNaN(card_width)
      ? defaultRightCardWidth
      : card_width
    : defaultRightCardWidth;
  if (leftWidth < minLeftCardWidth) {
    leftWidth = minLeftCardWidth;
  }
  if (rightWidth < minRightCardWidth) {
    rightWidth = minRightCardWidth;
  }

  const cardWidth = leftWidth + rightWidth;
  const card = new Card({
    title: custom_title,
    width: cardWidth,
    height,
    border_radius,
    theme: theme,
    dark_bg: dark_bg,
  });

  card.setHideBorder(hide_border);
  card.setHideTitle(true);
  card.setCSS(cssStyles);

  if (disable_animations) {
    card.disableAnimations();
  }

  const labelsLeft = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && key !== "issues" && key !== "contribs",
    )
    .map((key) => {
      if (key === "commits") {
        return `${STATS[key].label} ${STATS[key].value}`;
      }
      return `${STATS[key].label}: ${STATS[key].value}`;
    })
    .join(", ");

  const labelsRight = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && (key === "issues" || key === "contribs"),
    )
    .map((key) => {
      return `${STATS[key].label}: ${STATS[key].value}`;
    })
    .join(", ");

  const title = `
  <text
    class="title fadeInAnimation"
    x="${cardWidth / 2}"
    y="25"
    text-anchor="middle"
    font-weight="600"
    font-size="40px"
    font-family="'Segoe UI', Ubuntu, Sans-Serif"
    fill="white"
  >
    ${title_text ? title_text : name}
  </text>
`;

  const description = `
  <text
    class="title fadeInAnimation"
    x="${cardWidth / 2}"
    y="60"
    text-anchor="middle"
    font-weight="600"
    font-size="15px"
    font-family="'Segoe UI', Ubuntu, Sans-Serif"
    fill="white"
  >
    ${description_text ? description_text : ""}
  </text>
`;

  const contact = `
  <text
    class="title fadeInAnimation"
    x="${cardWidth / 2}"
    y="150"
    text-anchor="middle"
    font-weight="600"
    font-size="13px"
    font-family="'Segoe UI', Ubuntu, Sans-Serif"
    fill="white"
  >
    ${email ? email : ""}
  </text>
`;

  card.setAccessibilityLabel({
    title: `${name}'s Stats`,
    desc: `${labelsLeft}, ${labelsRight}`,
  });

  return card.render(`
    ${title}
    ${description}
    ${contact}
    <svg x="0" y="0">
      ${flexLayout({
        items: statItemsLeft,
        gap: lheight,
        direction: "column",
      }).join("")}
      <g transform="translate(${leftWidth - 5}, 0)">
        ${flexLayout({
          items: statItemsRight,
          gap: lheight,
          direction: "column",
        }).join("")}
      </g>
    </svg>
  `);
};

export { renderStatsCard };
export default renderStatsCard;
