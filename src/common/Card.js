import { encodeHTML, flexLayout } from "./utils.js";

class Card {
  constructor({
    width = 100,
    height = 100,
    border_radius = 4.5,
    theme = "beach",
    colors = {},
    title = "Stats",
    titlePrefixIcon = null,
  }) {
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.border_radius = border_radius;
    this.colors = colors;
    this.title = title;
    this.css = "";
    this.paddingX = 25;
    this.paddingY = 35;
    this.titlePrefixIcon = titlePrefixIcon;
    this.animations = true;
    this.a11yTitle = "";
    this.a11yDesc = "";
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
        x="${this.width / 2}"
        y="0"
        class="header"
        data-testid="header"
        dominant-baseline="auto"
        text-anchor="middle"
      >${this.title}</text>
    `;

    const prefixIcon = `
      <svg
        class="icon"
        x="0"
        y="-13"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
      >
        ${this.titlePrefixIcon}
      </svg>
    `;
    return `
      <g
        data-testid="card-title"
        transform="translate(${this.paddingX}, ${this.paddingY})"
      >
        ${flexLayout({
          items: [this.titlePrefixIcon && prefixIcon, titleText],
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
    const backgrounds = {
      beach: `
        <g class="parallax-background">
          <!-- Sky Layer -->
          <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#87CEEB" class="sky"/>
          
          <!-- Cloud Layer -->
          <g class="clouds">
            <path d="M20,40 Q30,35 40,40 Q50,35 60,40" stroke="white" stroke-width="15" fill="none" class="cloud"/>
            <path d="M80,30 Q90,25 100,30 Q110,25 120,30" stroke="white" stroke-width="15" fill="none" class="cloud"/>
          </g>
          
          <!-- Sea Layer -->
          <path d="M0,${this.height * 0.6} 
                   Q${this.width * 0.25},${this.height * 0.55} 
                   ${this.width * 0.5},${this.height * 0.6} 
                   Q${this.width * 0.75},${this.height * 0.65} 
                   ${this.width},${this.height * 0.6}" 
                fill="#0077be" class="sea"/>
          
          <!-- Sand Layer -->
          <path d="M0,${this.height} 
                   L0,${this.height * 0.7} 
                   Q${this.width * 0.5},${this.height * 0.65} 
                   ${this.width},${this.height * 0.7} 
                   L${this.width},${this.height}" 
                fill="#f4d03f" class="sand"/>
        </g>
      `,

      forest: `
        <g class="parallax-background">
          <!-- Sky Layer -->
          <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#a5d6a7" class="sky"/>
          
          <!-- Mountain Layer -->
          <path d="M0,${this.height * 0.6} 
                   L${this.width * 0.3},${this.height * 0.3} 
                   L${this.width * 0.6},${this.height * 0.6}" 
                fill="#4b6455" class="mountain"/>
          
          <!-- Trees Layer -->
          <g class="trees">
            ${Array.from(
              { length: 5 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 5)}, ${this.height * 0.6})">
                <polygon points="0,0 20,-30 40,0" fill="#2d5a27" class="tree"/>
                <rect x="18" y="0" width="4" height="10" fill="#4a2f23" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>
        </g>
      `,

      city: `
        <g class="parallax-background">
          <!-- Sky Layer -->
          <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#1a237e" class="sky"/>
          
          <!-- Stars Layer -->
          ${Array.from(
            { length: 20 },
            () => `
            <circle cx="${Math.random() * this.width}" 
                    cy="${Math.random() * this.height * 0.5}" 
                    r="1" 
                    fill="white" 
                    class="star"/>
          `,
          ).join("")}
          
          <!-- Buildings Layer -->
          <g class="buildings">
            ${Array.from(
              { length: 6 },
              (_, i) => `
              <rect x="${i * (this.width / 6)}" 
                    y="${this.height * 0.4}" 
                    width="${this.width / 8}" 
                    height="${Math.random() * this.height * 0.4 + this.height * 0.2}" 
                    fill="#263238" 
                    class="building"/>
            `,
            ).join("")}
          </g>
        </g>
      `,
    };

    return backgrounds[this.theme] || "";
  }

  getAnimations() {
    return `
      /* Base Animations */
      @keyframes scaleInAnimation {
        from { transform: translate(-5px, 5px) scale(0); }
        to { transform: translate(-5px, 5px) scale(1); }
      }
      @keyframes fadeInAnimation {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      /* Parallax Animations */
      @keyframes cloudFloat {
        from { transform: translateX(-10px); }
        to { transform: translateX(${this.width + 10}px); }
      }
      @keyframes wave {
        0% { transform: translateX(0) translateY(0); }
        50% { transform: translateX(-5px) translateY(2px); }
        100% { transform: translateX(0) translateY(0); }
      }
      @keyframes starTwinkle {
        0% { opacity: 1; }
        50% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      
      /* Theme-specific styles */
      .cloud {
        animation: cloudFloat 20s linear infinite;
      }
      .sea {
        animation: wave 5s ease-in-out infinite;
      }
      .star {
        animation: starTwinkle 2s ease-in-out infinite;
      }
      .tree {
        transition: transform 0.3s ease;
      }
      .tree:hover {
        transform: scale(1.05);
      }
      .building {
        transition: transform 0.3s ease;
      }
      .building:hover {
        transform: translateY(-5px);
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
          ${this.css}
          ${process.env.NODE_ENV === "test" ? "" : this.getAnimations()}
          ${this.animations === false ? `* { animation-duration: 0s !important; animation-delay: 0s !important; }` : ""}
        </style>

        ${this.renderParallaxBackground()}
        
        <rect
          data-testid="card-bg"
          x="0.5"
          y="0.5"
          rx="${this.border_radius}"
          height="99%"
          stroke="${this.colors.borderColor}"
          width="${this.width - 1}"
          fill="transparent"
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
