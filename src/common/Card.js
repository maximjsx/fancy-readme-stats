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

  renderParallaxBackground() {
    const maskId = `mask-${Math.random().toString(36).substring(7)}`;

    const starGroups = Array.from({ length: 3 }, (_, i) => {
      const stars = Array.from(
        { length: 20 },
        () => `
        <circle 
          cx="${Math.random() * this.width}"
          cy="${Math.random() * this.height * 0.3}"
          r="1"
          fill="white"
          class="star-group-${i + 1}"
        />
      `,
      ).join("");

      return `
        <g class="star-container-${i + 1}">
          ${stars}
          <g class="star-container-${i + 1}-duplicate" transform="translate(${this.width}, 0)">
            ${stars}
          </g>
        </g>
      `;
    }).join("");

    const backgrounds = {
      beach: `
        <defs>
          <mask id="${maskId}" x="0" y="0" width="${this.width}" height="${this.height}">
            <rect x="0" y="0" width="${this.width - 1}" height="${this.height - 1}" rx="${this.border_radius}" fill="white"/>
          </mask>
        </defs>

        <g class="parallax-background" mask="url(#${maskId})">
        <!-- Sky Layer with Gradient -->
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
            { length: 15 },
            () => `
              <circle cx="${Math.random() * this.width}"
                      cy="${Math.random() * this.height * 0.3}"
                      r="1"
                      fill="white"
                      class="star"/>
            `,
          ).join("")}
        </g>

                <g class="stars">
          ${Array.from(
            { length: 20 },
            () => `
              <circle cx="${Math.random() * this.width}"
                      cy="${Math.random() * this.height * 0.2}"
                      r="1"
                      fill="white"
                      class="star2"/>
            `,
          ).join("")}
        </g>

                        <g class="stars">
          ${Array.from(
            { length: 10 },
            () => `
              <circle cx="${Math.random() * this.width}"
                      cy="${Math.random() * this.height * 0.4}"
                      r="1"
                      fill="white"
                      class="star3"/>
            `,
          ).join("")}
        </g>

        <!-- Cloud Layers -->
  <path d="M30,40 Q40,30 55,35 Q70,20 90,35 Q110,30 120,40 Q130,35 140,40 Q150,30 160,40"
        stroke="white" stroke-width="20" fill="none" opacity="0.2" class="cloud"/>
  <path d="M180,50 Q190,35 205,40 Q220,30 240,40 Q260,35 270,50 Q280,45 290,50"
        stroke="white" stroke-width="20" fill="none" opacity="0.3" class="cloud"/>
  <path d="M310,25 Q325,10 340,20 Q355,10 370,20 Q385,5 400,20 Q415,10 430,25"
        stroke="white" stroke-width="20" fill="none" opacity="0.1" class="cloud"/>
  <path d="M80,80 Q95,65 115,70 Q135,60 155,70 Q175,65 185,80 Q195,70 205,80"
        stroke="white" stroke-width="20" fill="none" opacity="0.2" class="cloud"/>

  <path d="M470,40 Q480,30 495,35 Q510,20 530,35 Q550,30 560,40"
        stroke="white" stroke-width="20" fill="none" opacity="0.3" class="cloud"/>
  <path d="M490,80 Q500,65 520,70 Q540,60 560,70 Q580,65 590,80"
        stroke="white" stroke-width="20" fill="none" opacity="0.1" class="cloud"/>

<!-- Wave Layer -->
       <g class="sea-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.6}
                     ${Array.from({ length: 52 })
                       .map((_, i) => {
                         const x = offset + (this.width / 40) * i;
                         const y = this.height * 0.6 + Math.sin(x * 0.3) * 9;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#002d62" opacity="0.9" class="sea"/>
          `,
            )
            .join("")}
        </g>

               <g class="sea-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.6}
                     ${Array.from({ length: 52 })
                       .map((_, i) => {
                         const x = offset + (this.width / 30) * i;
                         const y = this.height * 0.6 + Math.sin(x * 0.3) * 8;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#001e42" opacity="0.9" class="sea2"/>
          `,
            )
            .join("")}
            
        </g>


        <!-- Sand Layer -->
        <g class="sand-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.8}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.8 + Math.sin(x * 0.2) * 3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#b68a00" class="sand"/>
          `,
            )
            .join("")}
        </g>
              </g>
      `,

      forest: `



        <defs>
          <mask id="${maskId}" x="0" y="0" width="${this.width}" height="${this.height}">
            <rect x="0" y="0" width="${this.width - 1}" height="${this.height - 1}" rx="${this.border_radius}" fill="white"/>
          </mask>
          <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#4CAF50"/>
            <stop offset="100%" stop-color="#1E88E5"/>
          </linearGradient>
        </defs>

        <g class="parallax-background" mask="url(#${maskId})">
          <!-- Sky Layer with Gradient -->
          <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#forestGradient)" class="sky"/>
          

          ${starGroups}

        <g class="dirt-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.8}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.6 + Math.sin(x * 0.2) * 1.5;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#3E2723" class="${"layer-3"}"/>
          `,
            )
            .join("")}
        </g>

        
        <g class="trees layer-4">
            ${Array.from(
              { length: 50 },
              (_, i) => `
              <g transform="translate(${(i * this.width) / 15}, ${this.height * 0.64})">
                <polygon points="0,0 15,-20 30,0" fill="#23471e" class="tree tree-very-small"/>
                <rect x="13" y="0" width="3" height="5" fill="#2b1b14" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>


          <g class="trees layer-3">
            ${Array.from(
              { length: 50 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 12)}, ${this.height * 0.68})">
                <polygon points="0,0 20,-30 40,0" fill="#2d5a27" class="tree tree-small"/>
                <rect x="18" y="0" width="4" height="10" fill="#4a2f23" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>

                          <g class="dirt-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.7 + Math.sin(x * 0.2) * 2.3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#5D4037" class="${"layer-2"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-2">
            ${Array.from(
              { length: 30 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 10)}, ${this.height * 0.75})">
                <polygon points="0,0 30,-50 60,0" fill="#4CAF50" class="tree tree-medium"/>
                <rect x="25" y="0" width="7" height="10" fill="#57392b" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>


                <g class="dirt-container">
          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.8}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.8 + Math.sin(x * 0.2) * 3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#6D4C41" class="${"layer-1"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-1">
            ${Array.from(
              { length: 10 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 5)}, ${this.height * 0.8})">
                <polygon points="0,0 40,-70 80,0" fill="#81C784" class="tree tree-large"/>
                <rect x="35" y="0" width="10" height="10" fill="#826457" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>

        </g>
      `,

      city: `
        <defs>
          <mask id="${maskId}" x="0" y="0" width="${this.width}" height="${this.height}">
            <rect x="0" y="0" width="${this.width - 1}" height="${this.height - 1}" rx="${this.border_radius}" fill="white"/>
          </mask>
          <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0010A8"/>
            <stop offset="100%" stop-color="#050036"/>
          </linearGradient>
        </defs>

        <g class="parallax-background" mask="url(#${maskId})">
          <!-- Sky Layer with Gradient -->
          <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#cityGradient)" class="sky"/>

          ${starGroups}

          <!-- Buildings-->
];
${[1, 2, 3, 4, 5, 6]
  .map(
    (layer) => `
      <g class="buildings layer-${-layer + 6}">
        ${Array.from({ length: 12 }, (_, i) => {
          const rectHeight =
            this.height * 0.3 + this.height * (0.2 + (-layer + 6) / 15);

          const colors = [
            "#0F154A",
            "#1F2660",
            "#303776",
            "#3F468A",
            "#4E558F",
            "#5F6599",
            "#717599",
            "#8C8FA8",
            "#CFD8DC",
            "#989AAB",
          ];
          const colorIndex = layer + 1;
          return `
              <rect x="${i * (this.width / 6)}"
                    y="${this.height * 1.37 - rectHeight}" 
                    width="${(this.width / ((-layer + 6) * 5)) * 2}"
                    height="${rectHeight}"
                    opacity="${0.8 + layer / 10}"
                    fill="${colors[colorIndex]}"
                    class="building"/>
            `;
        }).join("")}
      </g>
    `,
  )
  .join("")}

        </g>
      `,
    };

    return backgrounds[this.theme] || "";
  }

  getAnimations() {
    return `
    @keyframes scaleInAnimation {
      from { transform: translate(-5px, 5px) scale(0); }
      to { transform: translate(-5px, 5px) scale(1); }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
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
      from { transform: translateX(-700px); }
      to { transform: translateX(${this.width + 20}px); }
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
      animation: cloud 56s linear infinite;
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
