import { Card } from "../common/Card.js";
import { icons } from "../common/icons.js";
import {
  CustomError,
  clampValue,
  flexLayout,
  getCardColors,
  kFormatter,
  parseEmojis,
  wrapTextMultiline,
  encodeHTML,
} from "../common/utils.js";

import { I18n } from "../common/I18n.js";
import { repoCardLocales } from "../translations.js";

const CARD_LEFT_MIN_WIDTH = 740;
const CARD_RIGHT_MIN_WIDTH = 267;

const createTextNode = ({
  icon,
  label,
  value,
  id,
  unitSymbol,
  index,
  showIcons,
  right,
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
        x="${(right || showIcons ? 140 : 120) + shiftValuePos}"
        y="12.5"
        data-testid="${id}"
      >${kValue}${unitSymbol ? ` ${unitSymbol}` : ""}</text>
    </g>
  `;
};

const getStyles = ({ titleColor, textColor, iconColor, show_icons }) => {
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
    .not_bold { font-weight: 400 }
    .bold { font-weight: 700 }
    .stroke-path {
        stroke: ${iconColor}; 
    }
    .icon {
      fill: ${iconColor};
      display: ${show_icons ? "block" : "none"};
    }
  `;
};

const renderRepoCard = (repo, options = {}) => {
  const {
    name,
    nameWithOwner,
    description,
    primaryLanguage,
    starCount,
    forkCount,
    watchers,
    issues,
    isTemplate,
    isArchived,
  } = repo;
  const {
    hide = [],
    show_icons = true,
    hide_border = false,
    card_width,
    hide_title = false,
    line_height = 25,
    title_color,
    icon_color,
    text_color,
    text_bold = true,
    custom_height = 230,
    theme = "beach",
    dark_bg = 1,
    border_radius,
    border_color,
    number_format = "short",
    locale,
    disable_animations = false,
    title_text,
    description_text,
    footer,
    email,
  } = options;

  const lheight = parseInt(String(line_height), 10);

  const { titleColor, iconColor, textColor, bgColor, borderColor } =
    getCardColors({
      title_color,
      text_color,
      icon_color,
      border_color,
      theme,
    });

  const i18n = new I18n({
    locale,
    translations: repoCardLocales,
  });

  const STATS = {
    stars: {
      icon: icons.star,
      label: i18n.t("repocard.stars"),
      value: starCount,
      id: "stars",
    },
    forks: {
      icon: icons.fork,
      label: i18n.t("repocard.forks"),
      value: forkCount,
      id: "forks",
    },
    watchers: {
      icon: icons.eye,
      label: i18n.t("repocard.watchers"),
      value: watchers.totalCount || 0,
      id: "watchers",
    },
    issues: {
      icon: icons.issues,
      label: i18n.t("repocard.issues"),
      value: issues.totalCount || 0,
      id: "issues",
    },
  };

  const statItemsLeft = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && key !== "issues" && key !== "watchers",
    )
    .map((key, index) =>
      createTextNode({
        icon: STATS[key].icon,
        label: STATS[key].label,
        value: STATS[key].value,
        id: STATS[key].id,
        index,
        showIcons: show_icons,
        right: false,
        shiftValuePos: 50,
        bold: text_bold,
        number_format,
      }),
    );

  const statItemsRight = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && (key === "issues" || key === "watchers"),
    )
    .map((key, index) =>
      createTextNode({
        icon: STATS[key].icon,
        label: STATS[key].label,
        value: STATS[key].value,
        id: STATS[key].id,
        index,
        showIcons: show_icons,
        right: true,
        shiftValuePos: 50,
        bold: text_bold,
        number_format,
      }),
    );

  let height = custom_height < 170 ? 170 : custom_height;

  const cssStyles = getStyles({
    titleColor,
    textColor,
    iconColor,
    show_icons,
  });

  const minLeftCardWidth = CARD_LEFT_MIN_WIDTH;
  const minRightCardWidth = CARD_RIGHT_MIN_WIDTH;

  let leftWidth = card_width
    ? isNaN(card_width)
      ? minRightCardWidth
      : card_width
    : minRightCardWidth;
  let rightWidth = card_width
    ? isNaN(card_width)
      ? minRightCardWidth
      : card_width
    : minRightCardWidth;

  if (leftWidth < minLeftCardWidth) {
    leftWidth = minLeftCardWidth;
  }
  if (rightWidth < minRightCardWidth) {
    rightWidth = minRightCardWidth;
  }

  const cardWidth = leftWidth + rightWidth;
  const card = new Card({
    title: "",
    width: cardWidth,
    height,
    border_radius,
    theme: theme,
    dark_bg: dark_bg,
    colors: {
      titleColor,
      textColor,
      iconColor,
      bgColor,
      borderColor,
    },
  });

  card.setHideBorder(hide_border);
  card.setHideTitle(true);
  card.setCSS(cssStyles);

  if (disable_animations) {
    card.disableAnimations();
  }

  const labelsLeft = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && key !== "issues" && key !== "watchers",
    )
    .map((key) => `${STATS[key].label}: ${STATS[key].value}`)
    .join(", ");

  const labelsRight = Object.keys(STATS)
    .filter(
      (key) => !hide.includes(key) && (key === "issues" || key === "watchers"),
    )
    .map((key) => `${STATS[key].label}: ${STATS[key].value}`)
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
    fill="${textColor}"
  >
    ${hide_title ? "" : title_text ? title_text : name}
  </text>
`;

  const parsedDescription = parseEmojis(
    description || "No description provided",
  );
  const multiLineDescription = wrapTextMultiline(parsedDescription, 59, 3);

  const description_render = `
  <text
    class="title fadeInAnimation"
    x="${cardWidth / 2}"
    y="60"
    text-anchor="middle"
    font-weight="600"
    font-size="15px"
    font-family="'Segoe UI', Ubuntu, Sans-Serif"
    fill="${textColor}"
  >
    ${
      description_text
        ? decodeURIComponent(description_text)
            .split("\n")
            .map(
              (line, index) =>
                `<tspan x="${cardWidth / 2}" ${index > 0 ? `dy="1.2em"` : ""}>${encodeHTML(line)}</tspan>`,
            )
            .join("")
        : multiLineDescription
            .map(
              (line, index) =>
                `<tspan x="${cardWidth / 2}" ${index > 0 ? `dy="1.2em"` : ""}>${encodeHTML(line)}</tspan>`,
            )
            .join("")
    }
  </text>
`;

  const contact = `
  <text
    class="title fadeInAnimation"
    x="${cardWidth / 2}"
    y="${height - 75}"
    text-anchor="middle"
    font-weight="600"
    font-size="13px"
    font-family="'Segoe UI', Ubuntu, Sans-Serif"
    fill="white"
  >
    ${footer ? footer : email ? email : ""}
  </text>
`;

  card.setAccessibilityLabel({
    title: `${name} Repository Stats`,
    desc: `${labelsLeft}, ${labelsRight}`,
  });

  const badgeText = isTemplate
    ? i18n.t("repocard.template")
    : isArchived
      ? i18n.t("repocard.archived")
      : "";

  const badge = badgeText
    ? `
    <g data-testid="badge" class="badge" transform="translate(${cardWidth - 100}, 20)">
      <rect stroke="${textColor}" stroke-width="1" width="70" height="20" x="-12" y="-14" ry="10" rx="10"></rect>
      <text
        x="23" y="-5"
        alignment-baseline="central"
        dominant-baseline="central"
        text-anchor="middle"
        fill="${textColor}"
      >
        ${badgeText}
      </text>
    </g>
  `
    : "";

  return card.render(`
    ${badge}
    ${title}
    ${description_render}
    ${contact}
    <svg x="0" y="0">
      ${flexLayout({
        items: statItemsLeft,
        gap: lheight,
        direction: "column",
      }).join("")}
      <g transform="translate(${leftWidth}, 0)">
        ${flexLayout({
          items: statItemsRight,
          gap: lheight,
          direction: "column",
        }).join("")}
      </g>
    </svg>
  `);
};

export { renderRepoCard };
export default renderRepoCard;
