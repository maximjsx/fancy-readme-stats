import { getBackground } from "../../themes/backgrounds.js";
import { flexLayout } from "./utils.js";

class Card {
  constructor({
    width = 100,
    height = 100,
    border_radius = 4.5,
    theme = "beach",
    colors = {},
    title = "Stats",
    dark_bg = 1,
  }) {
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.border_radius = border_radius;
    this.title = title;
    this.css = "";
    this.colors = colors;
    this.paddingX = 25;
    this.paddingY = 35;
    this.animations = true;
    this.a11yTitle = "";
    this.a11yDesc = "";
    this.dark_bg = dark_bg;
  }

  /**
   * @returns {void}
   */
  disableAnimations() {
    this.animations = false;
  }

  /**
   * @param {Object} props The props object.
   * @param {string} props.title Accessibility title.
   * @param {string} props.desc Accessibility description.
   * @returns {void}
   */
  setAccessibilityLabel({ title, desc }) {
    this.a11yTitle = title;
    this.a11yDesc = desc;
  }

  /**
   * @param {string} value The CSS to add to the card.
   * @returns {void}
   */
  setCSS(value) {
    this.css = value;
  }

  /**
   * @param {boolean} value Whether to hide the border or not.
   * @returns {void}
   */
  setHideBorder(value) {
    this.hideBorder = value;
  }

  /**
   * @param {boolean} value Whether to hide the title or not.
   * @returns {void}
   */
  setHideTitle(value) {
    this.hideTitle = value;
    if (value) {
      this.height -= 30;
    }
  }

  /**
   * @param {string} text The title to set.
   * @returns {void}
   */
  setTitle(text) {
    this.title = text;
  }

  /**
   * @returns {string} The rendered card title.
   */
  renderTitle() {
    const titleText = `
      <text
        x="0"
        y="0"
        class="header"
        data-testid="header"
      >${this.title}</text>
    `;

    return `
      <g
        data-testid="card-title"
        transform="translate(${this.paddingX}, ${this.paddingY})"
      >
        ${flexLayout({
          items: [titleText],
          gap: 25,
        }).join("")}
      </g>
    `;
  }

  /**
   * @returns {string} The rendered card gradient.
   */
  renderGradient() {
    if (typeof this.colors.bgColor !== "object") {
      return "";
    }

    const gradients = this.colors.bgColor.slice(1);
    return typeof this.colors.bgColor === "object"
      ? `
        <defs>
          <linearGradient
            id="gradient"
            gradientTransform="rotate(${this.colors.bgColor[0]})"
            gradientUnits="userSpaceOnUse"
          >
            ${gradients.map((grad, index) => {
              let offset = (index * 100) / (gradients.length - 1);
              return `<stop offset="${offset}%" stop-color="#${grad}" />`;
            })}
          </linearGradient>
        </defs>
        `
      : "";
  }

  renderParallaxBackground() {
    if (this.colors.bgColor !== "transparent") {
      return "";
    }

    return getBackground(
      this.width,
      this.height,
      this.border_radius,
      this.dark_bg,
      this.theme,
    );
  }


  getAnimations() {
    return `

    @keyframes leafFall {
      0% { transform: translate(-70px, -100px) rotate(140deg); }
      100% { transform: translate(${this.width + 50}px, ${this.height + 100}px) rotate(0deg); }
    }

    @keyframes leafFallMirrored {
      0% { transform: translate(-500px, -140px) rotate(6deg); }
      100% { transform: translate(${this.width - 100}px, ${this.height + 100}px) rotate(20deg); }
    }

    @keyframes scaleInAnimation {
      from { transform: translate(-5px, 5px) scale(0); }
      to { transform: translate(-5px, 5px) scale(1); }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes rainFall {
        0% { transform: translateY(-100px); }
        100% { transform: translateY(${this.height + 300}px); }
    }
    .rain-drop {
        animation: rainFall 10s linear infinite;
    }

    @keyframes textInAnimation {
      from { transform: translate(0px, -50px); opacity: 0; }
      to { transform: translate(0px, 0px); opacity: 1; }
    }

    @keyframes move {
    from { transform: translateX(-${this.width}px); }
      to { transform: translateX(0); }
    }

    @keyframes move2 {
    from { transform: translateX(0); }
      to { transform: translateX(${this.width}px); }
    }

      @keyframes starMove {
        from { transform: translateX(-${this.width}px); }
        to { transform: translateX(0px); }
      }

      .star-container-1 { animation: starMove 40s linear infinite; }
      .star-container-2 { animation: starMove 50s linear infinite; }
      .star-container-3 { animation: starMove 70s linear infinite; }

    @keyframes cloud {
      from { transform: translateX(-550px); }
      to { transform: translateX(${this.width + 600}px); }
    }

    @keyframes starTwinkle {
      0% { opacity: 1; }
      50% { opacity: 0.1; }
      100% { opacity: 1; }
    }


    @keyframes floatAndMove {
    from { transform: translateX(-${this.width + 1}px) translateY(0); }
      to { transform: translateX(0) translateY(30px); }
    }

   @keyframes floatAndMove {
      0% { transform: translateX(-${this.width + 1}px) translateY(50px); }
      50% { transform: translateX(-${this.width / 2 + 1}px) translateY(0px); }
      100% { transform: translateX(0) translateY(50px); }
    }

    /* Theme-specific styles */
    .cloud {
      animation: cloud 130s linear infinite;
    }
    .sea {
      animation: floatAndMove 16s linear infinite;
    }
    .sea2 {
      animation: floatAndMove 10s linear infinite;
    }
    .sand {
      animation: move 7s linear infinite;
    }
    .star {
      animation: starTwinkle 1s ease-in-out infinite;
    }
    .star2 {
      animation: starTwinkle 3s ease-in-out infinite;
    }
    .star3 {
      animation: starTwinkle 2s ease-in-out infinite;
    }
    .textInAnimation {
      animation: textInAnimation 2s ease-out forwards;
    }

    .fadeInAnimation {
      animation: fadeInAnimation 4s ease-out forwards;
    }
      
    @keyframes treeScroll {
      from { transform: translateX(0); }
      to { transform: translateX(-${this.width / 2}px); }
    }

    .static-rotate {
      transform: rotate(180deg);
    }

    .layer-1 {
      animation: move 10s linear infinite;
    }
    .layer-2 {
      animation: move 14s linear infinite;
    }
    .layer-3 {
      animation: move 17s linear infinite;
    }
    .layer-4 {
      animation: move 20s linear infinite;
    }
    .layer-5 {
      animation: move 23s linear infinite;
    }
    .layer-6 {
      animation: move 25s linear infinite;
    }
  `;
  }

  render(body) {
    return `
      <svg
        width="${this.width}"
        height="${this.height}"
        viewBox="0 0 ${this.width} ${this.height}"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-labelledby="descId"
      >
        <title id="titleId">${this.a11yTitle}</title>
        <desc id="descId">${this.a11yDesc}</desc>
        <style>

          .header {
            font: 600 25px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: ${this.colors.titleColor};
            animation: fadeInAnimation 0.8s ease-in-out forwards;
          }
          @supports(-moz-appearance: auto) {
            /* Selector detects Firefox */
            .header { font-size: 15.5px; }
          }

          ${this.css}
          ${process.env.NODE_ENV === "test" ? "" : this.getAnimations()}
          ${this.animations === false ? `* { animation-duration: 0s !important; animation-delay: 0s !important; }` : ""}
        </style>

        ${this.renderGradient()}
        ${this.renderParallaxBackground()}

        
        <rect
          data-testid="card-bg"
          x="0.5"
          y="0.5"
          rx="${this.border_radius}"
          height="99%"
          stroke="white"
          width="${this.width - 1}"
          fill="${
            typeof this.colors.bgColor === "object"
              ? "url(#gradient)"
              : this.colors.bgColor
          }"
          stroke-opacity="${this.hideBorder ? 0 : 1}"
        />

        ${this.hideTitle ? "" : this.renderTitle()}

        <g
          data-testid="main-card-body"
          transform="translate(0, ${this.hideTitle ? this.paddingX : this.paddingY + 20})"
        >
          ${body}
        </g>
      </svg>
    `;
  }
}

export { Card };
export default Card;
