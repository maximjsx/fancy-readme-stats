import { flexLayout } from "./utils.js";

class Card {
  constructor({
    width = 100,
    height = 100,
    border_radius = 4.5,
    theme = "beach",
    title = "Stats",
    dark_bg = 1,
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
        <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
          <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
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
        ${this.renderCloudLayers()}

        <!-- Wave Layer -->
        <g class="sea-container">
          ${this.renderSeaLayer()}
        </g>


        <!-- Sand Layer -->
        <g class="sand-container">
          ${this.renderSandLayer()}
        </g>

        <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />
      </g>
    `,

      forest: `
      <defs>
        <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
          <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
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

        ${this.renderScene("#3E2723", "#5D4037", "#6D4C41", "#2b1b14", "#4a2f23", "#57392b", "#826457", "#23471e", "#2d5a27", "#4CAF50", "#81C784")}
                <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />
      </g>
    `,

      forest_winter: `
    <defs>
      <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
        <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
      </mask>
      <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#041028"/>
        <stop offset="50%" stop-color="#2C4D7A"/>
      </linearGradient>
    </defs>

    <g class="parallax-background" mask="url(#${maskId})">
      <!-- Sky Layer with Gradient -->
      <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#forestGradient)" class="sky"/>
      ${starGroups}

    <g>
      <svg width="100" height="100" x="452.5" y="5" viewBox="0 0 1278 1272" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="639" cy="636" rx="639" ry="636" fill="url(#paint0_radial_2_2)"/>
        <g clip-path="url(#clip0_2_2)">
        <path d="M380.909 330.387C545.869 186.175 794.947 211.638 939.159 376.597C1083.37 541.556 1070.62 786.419 905.666 930.633C740.706 1074.85 486.95 1062.97 342.738 898.011C198.525 733.053 215.95 474.6 380.909 330.387Z" fill="#F3ECDD"/>
        <path d="M407.284 375.58C563.406 239.092 796.07 259.68 928.883 411.597C1061.7 563.514 1046.68 791.886 890.558 928.372C734.436 1064.86 497.225 1057 364.413 905.077C231.6 753.158 251.163 512.067 407.284 375.58Z" fill="#ECE1D0"/>
        <path d="M620.303 457.216C592.303 515.452 521.814 537.438 463.578 509.438C405.342 481.438 380.397 413.566 408.397 355.33C436.397 297.094 506.578 270.881 564.814 298.881C623.05 326.881 648.303 398.98 620.303 457.216Z" fill="#D7D1C4"/>
        <path opacity="0.06" d="M439.139 388.714C467.139 330.478 537.32 304.266 595.556 332.266C602.005 335.366 608.048 339.009 613.659 343.114C602.198 324.506 585.611 308.881 564.814 298.881C506.578 270.881 436.397 297.094 408.397 355.33C383.702 406.694 400.198 465.547 444.391 497.934C424.883 465.967 421.488 425.428 439.139 388.714Z" fill="#040000"/>
        <path d="M578.259 577.338C576.431 568.38 582.494 559.872 591.45 558.044C600.408 556.216 609.025 561.73 610.853 570.688C612.681 579.645 607.016 588.603 598.058 590.431C589.102 592.258 580.088 586.295 578.259 577.338Z" fill="#D7D1C4"/>
        <path opacity="0.5" d="M806.436 387.611C804.608 378.653 810.67 370.145 819.627 368.317C828.583 366.489 837.202 372.003 839.03 380.961C840.858 389.919 835.192 398.877 826.234 400.705C817.277 402.533 808.262 396.569 806.436 387.611Z" fill="white"/>
        <path d="M680.809 858.628C694.389 846.756 714.892 848.853 726.764 862.431C738.636 876.011 737.586 896.167 724.006 908.039C710.427 919.911 689.538 918.933 677.666 905.353C665.795 891.777 667.23 870.5 680.809 858.628Z" fill="#D7D1C4"/>
        <path opacity="0.5" d="M330.138 581.392C328.309 572.434 334.372 563.927 343.328 562.098C352.286 560.27 360.903 565.784 362.731 574.742C364.559 583.7 358.894 592.658 349.936 594.486C340.98 596.313 331.966 590.35 330.138 581.392Z" fill="white"/>
        <path d="M971.745 676.3C965.925 733.566 913.531 773.331 856.266 767.509C799 761.689 757.548 712.384 763.37 655.119C769.191 597.853 820.047 554.641 877.312 560.461C934.578 566.283 977.567 619.034 971.745 676.3Z" fill="#D7D1C4"/>
        <path d="M509.692 753.544C532.553 793.119 517.297 843.069 477.722 865.93C438.147 888.791 388.547 876.308 365.686 836.731C342.825 797.156 355.489 745.702 395.064 722.841C434.639 699.978 486.83 713.967 509.692 753.544Z" fill="#D7D1C4"/>
        <path opacity="0.06" d="M415.281 742.908C444.131 726.242 479.673 729.178 505.681 747.314C481.161 712.566 432.481 701.225 395.063 722.839C355.488 745.7 342.823 797.155 365.684 836.73C371.997 847.656 380.353 856.506 389.967 863.128C388.538 861.098 387.172 858.997 385.902 856.797C363.042 817.223 375.706 765.769 415.281 742.908Z" fill="#040000"/>
        <path opacity="0.06" d="M785.419 676.913C791.239 619.647 842.094 576.434 899.361 582.255C918.45 584.195 935.948 591.355 950.584 602.155C933.386 579.445 907.311 563.513 877.311 560.464C820.045 554.644 769.191 597.856 763.37 655.122C759.519 693.009 776.364 727.406 804.787 748.036C790.225 728.423 782.714 703.53 785.419 676.913Z" fill="#040000"/>
        <path opacity="0.1" d="M637.15 832.562C472.525 832.562 327.114 751.211 239.141 626.848C234.917 782.664 325.942 930.503 479.672 996.766C680.884 1083.5 916.631 999.163 1003.36 797.95C1027.22 742.608 1037.2 684.28 1035.06 626.983C947.08 751.269 801.716 832.562 637.15 832.562Z" fill="#040000"/>
        </g>
        <defs>
        <radialGradient id="paint0_radial_2_2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(639 636) rotate(90) scale(636 639)">
        <stop stop-color="white" stop-opacity="0.25"/>
        <stop offset="1" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <clipPath id="clip0_2_2">
        <rect width="800" height="800" fill="white" transform="translate(239 236)"/>
        </clipPath>
        </defs>
      </svg>
    </g>


      ${this.renderScene("#DDDDDD", "#EEEEEE", "#FFFFFF", "#2b1b14", "#4a2f23", "#57392b", "#826457", "#23471e", "#2d5a27", "#4CAF50", "#81C784")}
              <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />

      <g class="snow-container">
          ${this.renderSnowflakes()}
      </g>

      <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${0.4}" />

    </g>
  `,

      city: `
      <defs>
         <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
          <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
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
        ${this.renderBuildingLayers()}
                <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />
      </g>
    `,

      rain: `

      <defs>
        <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
          <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
        </mask>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#003e61"/>
            <stop offset="100%" stop-color="#00613f"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#rainGradient)" class="sky"/>

        <g class="rain-container">
          ${this.renderRainDrops()}
        </g>

                <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />
      </g>
      
      `,
      snow: `
      
 <defs>
        <mask id="${maskId}" x="0" y="0" width="${this.width}" height="99%">
          <rect x="0" y="0" width="${this.width - 1}" height="99%" rx="${this.border_radius}" fill="white"/>
        </mask>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <defs>
          <linearGradient id="snowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0b0b0b"/>
            <stop offset="100%" stop-color="#324651"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="url(#snowGradient)" class="sky"/>

        <g class="snow-container">
          ${this.renderSnowflakes()}
        </g>

                <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#000000" opacity="${this.dark_bg / 10}" />
      </g>
      
      `,
    };

    return backgrounds[this.theme] || backgrounds["beach"];
  }

  renderRainDrops() {
    return Array.from({ length: 250 }, () => {
      const x = Math.random() * this.width;
      const y = -20;
      const size = Math.random() * 2.3;
      const speed = Math.random() * 20 + 5;
      return `
        <g>
          <rect x="${x}" y="${y}" opacity="0.9" width="${size}" height="${size * 5}" fill="#8ed4f9" class="rain-drop" style="animation: rainFall ${speed}s linear infinite"/>
        </g>
      `;
    }).join("");
  }
  renderSnowflakes() {
    return Array.from({ length: 100 }, () => {
      const x = Math.random() * this.width;
      const y = 0;
      const size = Math.random() * 8 + 4;
      const speed = Math.random() * 20 + 5;
      return `
        <g style="animation: rainFall ${speed}s linear infinite">
          <svg fill="#ffffff" class="rain-drop" x="${x}" y="${y}" height="${size}px" width="${size}px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 120 120" xml:space="preserve" stroke="#ffffff">
            <path d="M105,82.5l-13.7-7.9l12-7c1.3-0.8,1.8-2.5,1-3.8c-0.8-1.3-2.5-1.8-3.8-1l-14.8,8.6L65.8,59.9l19.9-11.5l14.8,8.6 c0.4,0.3,0.9,0.4,1.4,0.4c1,0,1.9-0.5,2.4-1.4c0.8-1.3,0.3-3-1-3.8l-12-7l13.7-7.9c1.3-0.8,1.8-2.5,1-3.8c-0.8-1.3-2.5-1.8-3.8-1 l-13.7,7.9V26.4c0-1.5-1.2-2.8-2.8-2.8c-1.5,0-2.8,1.2-2.8,2.8v17.1L63,55V32l14.8-8.6c1.3-0.8,1.8-2.5,1-3.8 c-0.8-1.3-2.5-1.8-3.8-1l-12,7V9.8C63,8.2,61.8,7,60.2,7c-1.5,0-2.8,1.2-2.8,2.8v15.8l-12-7c-1.3-0.8-3-0.3-3.8,1 c-0.8,1.3-0.3,3,1,3.8L57.5,32v23L37.5,43.5V26.4c0-1.5-1.2-2.8-2.8-2.8c-1.5,0-2.8,1.2-2.8,2.8v13.9l-13.7-7.9 c-1.3-0.8-3-0.3-3.8,1c-0.8,1.3-0.3,3,1,3.8l13.7,7.9l-12,7c-1.3,0.8-1.8,2.5-1,3.8c0.5,0.9,1.5,1.4,2.4,1.4c0.5,0,1-0.1,1.4-0.4 l14.8-8.6l19.9,11.5L34.7,71.4l-14.8-8.6c-1.3-0.8-3-0.3-3.8,1c-0.8,1.3-0.3,3,1,3.8l12,7l-13.7,7.9c-1.3,0.8-1.8,2.5-1,3.8 c0.5,0.9,1.5,1.4,2.4,1.4c0.5,0,1-0.1,1.4-0.4l13.7-7.9v13.9c0,1.5,1.2,2.8,2.8,2.8c1.5,0,2.8-1.2,2.8-2.8V76.2l19.9-11.5v23 l-14.8,8.6c-1.3,0.8-1.8,2.5-1,3.8c0.5,0.9,1.5,1.4,2.4,1.4c0.5,0,1-0.1,1.4-0.4l12-7v15.8c0,1.5,1.2,2.8,2.8,2.8 c1.5,0,2.8-1.2,2.8-2.8V94.2l12,7c0.4,0.3,0.9,0.4,1.4,0.4c1,0,1.9-0.5,2.4-1.4c0.8-1.3,0.3-3-1-3.8L63,87.7v-23L83,76.2v17.1 c0,1.5,1.2,2.8,2.8,2.8c1.5,0,2.8-1.2,2.8-2.8V79.4l13.7,7.9c0.4,0.3,0.9,0.4,1.4,0.4c1,0,1.9-0.5,2.4-1.4 C106.8,85,106.3,83.3,105,82.5z"/>
          </svg>
        </g>
      `;
    }).join("");
  }

  renderCloudLayers() {
    return `

    <g class="cloud">
    <svg fill="#ffffff" x="-392" y="40" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="-310" y="20" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M27.873 28c0 0 5.52 0.006 6.295-5.395 0.369-5.906-5.336-7.070-5.336-7.070s0.649-8.743-7.361-9.74c-6.865-0.701-8.954 5.679-8.954 5.679s-2.068-1.988-4.873-0.364c-2.511 1.55-2.067 4.388-2.067 4.388s-5.577 1.084-5.577 6.768c0.125 5.677 6.057 5.734 6.057 5.734">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="-206" y="27" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M402.019,199.463h-5.941c-5.517-39.132-41.718-66.389-80.851-60.864c-4.877,0.689-9.673,1.882-14.309,3.547 c-35.833-50.791-106.058-62.922-156.849-27.081c-28.106,19.826-45.602,51.415-47.5,85.759 c-59.655,6.702-102.583,60.488-95.88,120.143c6.238,55.531,53.569,97.29,109.445,96.553h291.885 c60.224,0.512,109.461-47.884,109.973-108.108s-47.884-109.461-108.108-109.973c-0.625-0.008-1.249-0.008-1.866,0V199.463z">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="-135" y="10" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="M210.4,116.8c-0.4,0-0.8,0.1-1.2,0.1c0.2-1.9,0.3-3.8,0.3-5.7c0-32.6-26.4-59-59-59c-29.8,0-54.4,22.1-58.3,50.8 c-4-1.3-8.1-2.1-12.4-2.1c-22.4,0-40.6,18.2-40.6,40.6c0,0.2,0.1,0.4,0.1,0.5c-1.8-0.3-3.7-0.5-5.6-0.5c-16,0-28.8,12.9-28.8,28.7 s12.8,28.7,28.7,28.7c0,0,175.5-0.9,176.7-0.9c22.4,0,40.6-18.2,40.6-40.6C251,135,232.8,116.8,210.4,116.8z">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="-70" y="-1" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z">
    </path> 
    </svg>
    </g>

        <g class="cloud">
    <svg fill="#ffffff" x="0" y="30" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M27.873 28c0 0 5.52 0.006 6.295-5.395 0.369-5.906-5.336-7.070-5.336-7.070s0.649-8.743-7.361-9.74c-6.865-0.701-8.954 5.679-8.954 5.679s-2.068-1.988-4.873-0.364c-2.511 1.55-2.067 4.388-2.067 4.388s-5.577 1.084-5.577 6.768c0.125 5.677 6.057 5.734 6.057 5.734">
    </path> 
    </svg>
    </g>
    <g class="cloud">
    <svg fill="#ffffff" x="140" y="0" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="250" y="41" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M27.873 28c0 0 5.52 0.006 6.295-5.395 0.369-5.906-5.336-7.070-5.336-7.070s0.649-8.743-7.361-9.74c-6.865-0.701-8.954 5.679-8.954 5.679s-2.068-1.988-4.873-0.364c-2.511 1.55-2.067 4.388-2.067 4.388s-5.577 1.084-5.577 6.768c0.125 5.677 6.057 5.734 6.057 5.734">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="350" y="10" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M402.019,199.463h-5.941c-5.517-39.132-41.718-66.389-80.851-60.864c-4.877,0.689-9.673,1.882-14.309,3.547 c-35.833-50.791-106.058-62.922-156.849-27.081c-28.106,19.826-45.602,51.415-47.5,85.759 c-59.655,6.702-102.583,60.488-95.88,120.143c6.238,55.531,53.569,97.29,109.445,96.553h291.885 c60.224,0.512,109.461-47.884,109.973-108.108s-47.884-109.461-108.108-109.973c-0.625-0.008-1.249-0.008-1.866,0V199.463z">
    </path> 
    </svg>
    </g>
        <g class="cloud">
    <svg fill="#ffffff" x="400" y="40" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="M210.4,116.8c-0.4,0-0.8,0.1-1.2,0.1c0.2-1.9,0.3-3.8,0.3-5.7c0-32.6-26.4-59-59-59c-29.8,0-54.4,22.1-58.3,50.8 c-4-1.3-8.1-2.1-12.4-2.1c-22.4,0-40.6,18.2-40.6,40.6c0,0.2,0.1,0.4,0.1,0.5c-1.8-0.3-3.7-0.5-5.6-0.5c-16,0-28.8,12.9-28.8,28.7 s12.8,28.7,28.7,28.7c0,0,175.5-0.9,176.7-0.9c22.4,0,40.6-18.2,40.6-40.6C251,135,232.8,116.8,210.4,116.8z">
    </path> 
    </svg>
    </g>

        <g class="cloud">
    <svg fill="#ffffff" x="432" y="6" width="64px" height="64px" viewBox="0 0 35.00 35.00" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00035">
    <path opacity="0.2" d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z">
    </path> 
    </svg>
    </g>
  `;
  }

  renderSeaLayer() {
    return `

          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.57 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#043f85" class="${"layer-6"}"/>
          `,
            )
            .join("")}


          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.6 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#043875" class="${"layer-5"}"/>
          `,
            )
            .join("")}

          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.64 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#023066" class="${"layer-4"}"/>
          `,
            )
            .join("")}


          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.67 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#012652" class="${"layer-3"}"/>
          `,
            )
            .join("")}

          ${[0, this.width]
            .map(
              (offset) => `
            <path d="M${offset},${this.height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (this.width / 25) * i;
                         const y = this.height * 0.7 + Math.sin(x * 0.2) * 2.4;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + this.width},${this.height} L${offset},${this.height} Z"
                  fill="#001e42" class="${"layer-2"}"/>
          `,
            )
            .join("")}


  `;
  }

  renderSandLayer() {
    return `

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
                  fill="#b68a00" class="${"sand"}"/>
          `,
            )
            .join("")}
        </g>

  `;
  }

  renderScene(
    groundColor1,
    groundColor2,
    groundColor3,
    treeTrunkColor1,
    treeTrunkColor2,
    treeTrunkColor3,
    treeTrunkColor4,
    treeLeavesColor1,
    treeLeavesColor2,
    treeLeavesColor3,
    treeLeavesColor4,
  ) {
    return `
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
                  fill="${groundColor1}" class="${"layer-3"}"/>
          `,
            )
            .join("")}
        </g>

        
        <g class="trees layer-4">
            ${Array.from(
              { length: 50 },
              (_, i) => `
              <g transform="translate(${(i * this.width) / 15}, ${this.height * 0.64})">
                <polygon points="0,0 15,-20 30,0" fill="${treeLeavesColor1}" class="tree tree-very-small"/>
                <rect x="13" y="0" width="3" height="5" fill="${treeTrunkColor1}" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>


          <g class="trees layer-3">
            ${Array.from(
              { length: 50 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 12)}, ${this.height * 0.68})">
                <polygon points="0,0 20,-30 40,0" fill="${treeLeavesColor2}" class="tree tree-small"/>
                <rect x="18" y="0" width="4" height="10" fill="${treeTrunkColor2}" class="trunk"/>
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
                  fill="${groundColor2}" class="${"layer-2"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-2">
            ${Array.from(
              { length: 30 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 10)}, ${this.height * 0.75})">
                <polygon points="0,0 30,-50 60,0" fill="${treeLeavesColor3}" class="tree tree-medium"/>
                <rect x="25" y="0" width="7" height="10" fill="${treeTrunkColor3}" class="trunk"/>
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
                  fill="${groundColor3}" class="${"layer-1"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-1">
            ${Array.from(
              { length: 10 },
              (_, i) => `
              <g transform="translate(${i * (this.width / 5)}, ${this.height * 0.8})">
                <polygon points="0,0 40,-70 80,0" fill="${treeLeavesColor4}" class="tree tree-large"/>
                <rect x="35" y="0" width="10" height="10" fill="${treeTrunkColor4}" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>
  `;
  }

  renderBuildingLayers() {
    return [1, 2, 3, 4, 5, 6]
      .map(
        (layer) => `
        <g class="buildings layer-${-layer + 6}">
          ${this.renderBuildings(layer)}
        </g>
      `,
      )
      .join("");
  }

  renderBuildings(layer) {
    return Array.from({ length: 12 }, (_, i) => {
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
    }).join("");
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
