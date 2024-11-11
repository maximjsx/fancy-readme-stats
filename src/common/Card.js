import { flexLayout } from "./utils.js";

class Card {
  constructor({
    width = 100,
    height = 100,
    border_radius = 4.5,
    theme = "beach",
    title = "Stats",
  }) {
    this.width = width;
    this.height = height;
    this.theme = theme;
    this.border_radius = border_radius;
    this.title = title;
    this.css = "";
    this.paddingX = 25;
    this.paddingY = 35;
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

  renderParallaxBackground() {
    const backgrounds = {
      beach: `
      <g class="parallax-background">
        <!-- Sky Layer with Gradient (Static) -->
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3a007b"/>
            <stop offset="100%" stop-color="#d46a00"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#skyGradient)" class="sky"/>

        <!-- Stars Layer with Blinking Effect -->
        <g class="stars">
          ${Array.from(
            { length: 20 },
            () => `
              <circle cx="${Math.random() * this.width}"
                      cy="${Math.random() * this.height * 0.3}"
                      r="1"
                      fill="white"
                      class="star"/>
            `,
          ).join("")}
        </g>

        <!-- Cloud Layer with Clouds -->
        <g class="clouds">
          <path d="M20,40 Q25,30 40,35 Q55,20 75,35 Q90,30 100,40 Q110,30 120,40"
                stroke="white" stroke-width="18" fill="none" opacity="0.4" class="cloud"/>
          <path d="M160,50 Q170,35 190,40 Q210,30 230,40 Q250,35 260,50"
                stroke="white" stroke-width="18" fill="none" opacity="0.4" class="cloud"/>
          <path d="M280,25 Q295,10 310,20 Q325,5 340,20 Q355,10 370,25"
                stroke="white" stroke-width="18" fill="none" opacity="0.4" class="cloud"/>
          <path d="M60,80 Q70,65 90,70 Q110,60 130,70 Q150,65 160,80"
                stroke="white" stroke-width="18" fill="none" opacity="0.4" class="cloud"/>
        </g>
<!-- Sea Layers -->

<!-- Top Wave Layer -->
<path d="M0,${this.height * 0.6}
         ${Array.from({
           length: 50,
         })
           .map((_, i) => {
             const x = (this.width / 40) * i;
             const y = this.height * 0.6 + Math.sin(x * 0.3) * 10;
             return `${i === 0 ? "M" : "L"}${x},${y}`;
           })
           .join(" ")} 
         L${this.width},${this.height} L0,${this.height} Z"
      fill="#0079a1" class="sea"/>


<path d="M0,${this.height * 0.8}
         ${Array.from({
           length: 35,
         })
           .map((_, i) => {
             const x = (this.width / 25) * i;
             const y = this.height * 0.8 + Math.sin(x * 0.2) * 5;
             return `${i === 0 ? "M" : "L"}${x},${y}`;
           })
           .join(" ")} 
         L${this.width},${this.height} L0,${this.height} Z"
      fill="#b68a00" class="sand"/>

        <!-- Sand Layer with Parallax Movement -->
        <path d="M0,${this.height}
                 L0,${this.height * 0.8}
                 Q${this.width * 0.5},${this.height * 0.75}
                 ${this.width},${this.height * 0.8}
                 L${this.width},${this.height}"
              fill="#b68a00" class="sand"/>
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
    @keyframes move {
      from { transform: translateX(-400px); }
      to { transform: translateX(${this.width + 20}px); }
    }

    @keyframes starTwinkle {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
    @keyframes sandFloat {
      0% { transform: translateX(0); }
      100% { transform: translateX(20px); }
    }

    /* Theme-specific styles */
    .cloud {
      animation: move 20s linear infinite;
    }
    .sea {
      animation: move 10s linear infinite;
    }
    .sand {
      animation: move 5s linear infinite;
    }
    .star {
      animation: starTwinkle 2s ease-in-out infinite;
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
            fill: white;
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

        ${this.renderParallaxBackground()}
        
        <rect
          data-testid="card-bg"
          x="0.5"
          y="0.5"
          rx="${this.border_radius}"
          height="99%"
          stroke="white"
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
