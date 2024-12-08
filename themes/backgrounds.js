let width;
let height;
let border_radius;
let dark_bg;
let theme;

function getBackground(
  inputWidth,
  inputHeight,
  inputBorderRadius,
  inputDarkBg,
  inputTheme,
) {

  width = inputWidth;
  height = inputHeight;
  border_radius = inputBorderRadius;
  dark_bg = inputDarkBg;
  theme = inputTheme;

  const maskId = `mask-${Math.random().toString(36).substring(7)}`;

  const starGroups = Array.from({ length: 3 }, (_, i) => {
    const stars = Array.from(
      { length: 20 },
      () => `
      <circle 
        cx="${Math.random() * width}"
        cy="${Math.random() * height * 0.3}"
        r="1"
        fill="white"
        class="star-group-${i + 1}"
      />
    `,
    ).join("");

    return `
      <g class="star-container-${i + 1}">
        ${stars}
        <g class="star-container-${i + 1}-duplicate" transform="translate(${width}, 0)">
          ${stars}
        </g>
      </g>
    `;
  }).join("");

  const backgrounds = {
    beach: `
      <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
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
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#skyGradient)" class="sky"/>

        <!-- Stars Layer with Blinking Effect -->
        <g class="stars">
          ${Array.from(
            { length: 15 },
            () => `
              <circle cx="${Math.random() * width}"
                      cy="${Math.random() * height * 0.3}"
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
              <circle cx="${Math.random() * width}"
                      cy="${Math.random() * height * 0.2}"
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
              <circle cx="${Math.random() * width}"
                      cy="${Math.random() * height * 0.4}"
                      r="1"
                      fill="white"
                      class="star3"/>
            `,
          ).join("")}
        </g>

        <!-- Cloud Layers -->
        ${renderCloudLayers()}

        <!-- Wave Layer -->
        <g class="sea-container">
          ${renderSeaLayer()}
        </g>


        <!-- Sand Layer -->
        <g class="sand-container">
          ${renderSandLayer()}
        </g>

        <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
    `,

    forest_autumn: `
      <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
        <linearGradient id="autumnSkyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#D35400"/>
          <stop offset="100%" stop-color="#7D6608"/>
        </linearGradient>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <!-- Sky Layer with Gradient -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#autumnSkyGradient)" class="sky"/>


    <svg width="100" height="100" x="${width / 2 - 50}" y="100" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 111.69 111.69" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="sun"> <g> <g> <circle style="fill:#FCDD66;" cx="55.845" cy="55.845" r="55.845"></circle> </g> </g> <g> <g> <circle style="fill:#FBD009;" cx="55.845" cy="55.845" r="46.174"></circle> </g> </g> </g> </g></svg>

        ${renderCloudLayers()}

      ${renderScene("#6D3E2F", "#8B4513", "#D2691E", "#A0522D", "#B87333", "#CD853F", "#D2B48C", "#9E6642", "#C19A6B", "#556B2F", "#8FBC8F")}



      <g class="snow-container">
          ${renderLeaves([
            `
            <svg  id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#F7B239;" d="M386.305,375.436c-11.854,9.481-25.001,14.215-37.596,16.206 c-39.553,6.242-74.091,30.151-92.265,65.836l-0.439,0.877l-0.45-0.877c-18.163-35.685-52.7-59.594-92.254-65.836 c-12.607-1.991-25.754-6.725-37.596-16.206c11.842-7.895-28.959-27.643-35.538-73.708c13.158,9.222-1.316-34.211,9.211-53.96 c13.158,9.211,28.959-25.001,31.591-52.644c23.685,5.263,39.486-19.737,39.486-46.065c15.79,2.632,31.58-10.527,31.58-43.433 c7.906,7.895,26.328-14.474,25.012-36.854c9.211,9.211,17.106-17.106,11.842-42.117C249.427,33.233,256.006,0,256.006,0 s6.579,33.233,17.106,26.654c-5.263,25.012,2.632,51.328,11.842,42.117c-1.316,22.38,17.117,44.749,25.012,36.854 c0,32.907,15.79,46.065,31.591,43.433c0,26.328,15.79,51.328,39.486,46.065c2.632,27.643,18.421,61.855,31.58,52.644 c10.527,19.749-3.947,63.182,9.211,53.96C415.254,347.792,374.452,367.541,386.305,375.436z"></path> <path style="fill:#E09B2D;" d="M256.006,0v458.355l-0.45-0.877c-18.163-35.685-52.7-59.594-92.254-65.836 c-12.607-1.991-25.754-6.725-37.596-16.206c11.842-7.895-28.959-27.643-35.538-73.708c13.158,9.222-1.316-34.211,9.211-53.96 c13.158,9.211,28.959-25.001,31.591-52.644c23.685,5.263,39.486-19.737,39.486-46.065c15.79,2.632,31.58-10.527,31.58-43.433 c7.906,7.895,26.328-14.474,25.012-36.854c9.211,9.211,17.106-17.106,11.842-42.117C249.427,33.233,256.006,0,256.006,0z"></path> <path style="fill:#995C0D;" d="M354.966,289.653c-2.923-1.045-6.142,0.478-7.186,3.404c-12.266,34.347-61.38,62.868-83.343,74.178 V293.76c4.171-2.091,10.029-5.186,16.252-8.981c16.116-9.832,26.302-19.248,30.274-27.986c1.285-2.827,0.035-6.162-2.791-7.446 c-2.827-1.284-6.162-0.035-7.446,2.791c-4.685,10.306-22.932,21.845-36.288,28.981v-72.153l15.469-8.63 c2.713-1.513,3.684-4.938,2.171-7.65c-1.514-2.713-4.941-3.683-7.65-2.171l-9.99,5.574v-61.39c0-4.658-3.777-8.435-8.435-8.435 c-4.658,0-8.435,3.777-8.435,8.435v61.39l-9.99-5.574c-2.711-1.515-6.137-0.541-7.65,2.171c-1.514,2.713-0.541,6.137,2.171,7.65 l15.469,8.63v72.153c-13.355-7.137-31.602-18.674-36.287-28.981c-1.287-2.827-4.618-4.078-7.446-2.791 c-2.827,1.285-4.077,4.619-2.791,7.446c7.279,16.013,34.014,30.787,46.526,36.998v73.451 c-21.958-11.299-71.062-39.797-83.343-74.183c-1.044-2.925-4.263-4.451-7.186-3.404c-2.925,1.045-4.449,4.262-3.404,7.186 c7.411,20.753,26.602,41.555,57.04,61.83c15.143,10.087,29.175,17.401,36.894,21.177v123.719c0,4.658,3.777,8.435,8.435,8.435 c4.658,0,8.435-3.777,8.435-8.435V379.847c7.717-3.775,21.75-11.09,36.894-21.177c30.437-20.274,49.629-41.076,57.04-61.83 C359.416,293.916,357.892,290.698,354.966,289.653z"></path> </g></svg>
            `,
            `
            <svg  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#F4DE3B;" d="M432.714,215.329L321.63,309.264c-12.174,10.299-2.015,29.952,13.421,25.98l24.162-6.21 c21.762-5.592,36.616,21.529,20.19,36.849l-60.884,56.818c-8.481,7.91-18.314,14.073-28.916,18.256 c-10.613,4.182-21.995,6.384-33.599,6.384c-23.207,0-45.552-8.807-62.515-24.64l-60.895-56.818 c-16.427-15.32-1.561-42.441,20.19-36.849l24.174,6.21c15.436,3.973,25.584-15.681,13.421-25.98L79.284,215.329 c-31.374-26.539,2.179-75.703,38.317-56.165l32.702,17.673c13.479,7.281,26.958-9.635,16.846-21.145l-56.771-64.612 c-20.959-23.859,8.842-58.227,35.428-40.857l38.737,20.434c14.598,7.689,32.143-2.889,32.143-19.397V39.319 c0-10.858,4.404-20.691,11.522-27.809C235.314,4.404,245.147,0,256.005,0c21.716,0,39.319,17.603,39.319,39.319v11.941 c0,16.508,17.545,27.087,32.143,19.397l38.725-20.434c26.586-17.37,56.387,16.998,35.428,40.857l-56.771,64.612 c-10.112,11.51,3.379,28.426,16.858,21.145l32.69-17.673C430.547,139.627,464.088,188.79,432.714,215.329z"></path> <path style="fill:#E0C734;" d="M256.005,0v447.342c-23.207,0-45.552-8.807-62.515-24.64l-60.895-56.818 c-16.427-15.32-1.561-42.441,20.19-36.849l24.174,6.21c15.436,3.973,25.584-15.681,13.421-25.98L79.284,215.329 c-31.374-26.539,2.179-75.703,38.317-56.165l32.702,17.673c13.479,7.281,26.958-9.635,16.846-21.145l-56.771-64.612 c-20.959-23.859,8.842-58.227,35.428-40.857l38.737,20.434c14.598,7.689,32.143-2.889,32.143-19.397V39.319 c0-10.858,4.404-20.691,11.522-27.809C235.314,4.404,245.147,0,256.005,0z"></path> <path style="fill:#B27214;" d="M299.463,254.561c2.583-1.919,3.121-5.568,1.202-8.15c-1.918-2.582-5.566-3.121-8.149-1.202 l-27.777,20.635v-106.06l34.724-25.796c2.583-1.918,3.121-5.568,1.202-8.149c-1.918-2.582-5.566-3.121-8.149-1.202l-27.777,20.635 V73.395c0-4.825-3.911-8.738-8.738-8.738s-8.738,3.912-8.738,8.738v71.877l-27.779-20.635c-2.582-1.919-6.23-1.379-8.149,1.202 c-1.918,2.583-1.381,6.232,1.202,8.149l34.726,25.796v106.06l-27.779-20.636c-2.582-1.919-6.23-1.379-8.149,1.202 c-1.918,2.582-1.381,6.232,1.202,8.149l34.726,25.796v105.44l-27.779-20.635c-2.582-1.919-6.23-1.379-8.149,1.202 c-1.918,2.583-1.381,6.232,1.202,8.149l34.726,25.796v102.955c0,4.825,3.911,8.738,8.738,8.738c4.827,0,8.738-3.912,8.738-8.738 V400.308l34.724-25.796c2.583-1.918,3.121-5.568,1.202-8.149c-1.918-2.583-5.566-3.121-8.149-1.202l-27.777,20.635V280.357 L299.463,254.561z"></path> </g></svg>
            `,
            `,
            <svg  version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#CED663;" d="M512,241.696c-28.024,42.777-53.46,68.625-74.096,84.249c-25.165,19.059-39.024,49.331-38.354,80.908 c0.353,16.342,1.176,47.931-16.495,45.33c-121.967-17.895-127.05-96.708-127.05-96.708s-5.118,79.602-127.05,96.708 c-17.695,2.482-16.847-28.989-16.506-45.33c0.671-31.577-13.177-61.848-38.354-80.908C53.472,310.321,28.024,284.473,0,241.696 c0,0,49.86-63.06,113.473-66.66c16.424-0.929,30.46-12.059,35.013-27.859c14.671-50.907,38.177-107.85,107.52-142.521 c69.343,34.671,92.837,91.614,107.508,142.521c4.553,15.8,18.589,26.93,35.013,27.859C462.14,178.635,512,241.696,512,241.696z"></path> <path style="fill:#B2B548;" d="M256.006,4.655v350.82c0,0-5.118,79.602-127.05,96.708c-17.695,2.482-16.847-28.989-16.506-45.33 c0.671-31.577-13.177-61.848-38.354-80.908C53.472,310.321,28.024,284.473,0,241.696c0,0,49.86-63.06,113.473-66.66 c16.424-0.929,30.46-12.059,35.013-27.859C163.157,96.269,186.663,39.326,256.006,4.655z"></path> <path style="fill:#B27214;" d="M440.463,254.692c-0.844-3.137-4.073-4.995-7.21-4.151c-96.474,25.981-146.762,60.725-168.427,79.455 V211.063l57.421-53.114c2.384-2.206,2.529-5.928,0.324-8.312c-2.208-2.386-5.928-2.529-8.313-0.324l-49.432,45.723V42.584 c0-4.873-3.949-8.824-8.824-8.824s-8.824,3.951-8.824,8.824v152.453l-49.432-45.725c-2.382-2.206-6.106-2.061-8.313,0.324 c-2.206,2.385-2.061,6.106,0.324,8.312l57.421,53.114v118.933c-21.666-18.73-71.953-53.474-168.429-79.455 c-3.135-0.842-6.365,1.013-7.21,4.151c-0.845,3.138,1.013,6.365,4.151,7.21c108.994,29.352,157.766,70.652,171.487,84.202v152.419 c0,4.873,3.949,8.824,8.824,8.824s8.824-3.951,8.824-8.824V346.104c13.723-13.55,62.494-54.851,171.486-84.201 C439.45,261.058,441.308,257.83,440.463,254.692z"></path> </g></svg>
            `,
          ])}
      </g>

        <!-- Mist Overlay -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF" opacity="0.1" class="mist"/>

        <!-- Dark Overlay -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
    `,

    forest: `
      <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
        <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#4CAF50"/>
          <stop offset="100%" stop-color="#1E88E5"/>
        </linearGradient>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <!-- Sky Layer with Gradient -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#forestGradient)" class="sky"/>
        ${starGroups}

        ${renderScene("#3E2723", "#5D4037", "#6D4C41", "#2b1b14", "#4a2f23", "#57392b", "#826457", "#23471e", "#2d5a27", "#4CAF50", "#81C784")}
                <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
    `,

    forest_winter: `
    <defs>
      <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
        <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
      </mask>
      <linearGradient id="forestGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#041028"/>
        <stop offset="50%" stop-color="#2C4D7A"/>
      </linearGradient>
    </defs>

    <g class="parallax-background" mask="url(#${maskId})">
      <!-- Sky Layer with Gradient -->
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#forestGradient)" class="sky"/>
      ${starGroups}

    <g>
      <svg width="100" height="100" x="${width / 2 - 50}" y="5" viewBox="0 0 1278 1272" fill="none" xmlns="http://www.w3.org/2000/svg">
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


      ${renderScene("#DDDDDD", "#EEEEEE", "#FFFFFF", "#2b1b14", "#4a2f23", "#57392b", "#826457", "#23471e", "#2d5a27", "#4CAF50", "#81C784")}
              <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />

      <g class="snow-container">
          ${renderSnowflakes()}
      </g>

      <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${0.4}" />

    </g>
  `,

    city: `
      <defs>
         <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
        <linearGradient id="cityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0010A8"/>
          <stop offset="100%" stop-color="#050036"/>
        </linearGradient>
      </defs>
      
      

      <g class="parallax-background" mask="url(#${maskId})">
        <!-- Sky Layer with Gradient -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#cityGradient)" class="sky"/>
        ${starGroups}
        ${renderBuildingLayers()}
                <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
    `,

    rain: `

      <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#003e61"/>
            <stop offset="100%" stop-color="#00613f"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#rainGradient)" class="sky"/>

        <g class="rain-container">
          ${renderRainDrops()}
        </g>

                <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
      
      `,

    red_rain: `

      <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <defs>
          <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#003e61"/>
            <stop offset="100%" stop-color="#A13C5C"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#rainGradient)" class="sky"/>

        <g class="rain-container">
          ${renderRainDrops()}
        </g>

                <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
      
      `,
    snow: `
      
 <defs>
        <mask id="${maskId}" x="0" y="0" width="${width}" height="99%">
          <rect x="0" y="0" width="${width - 1}" height="99%" rx="${border_radius}" fill="white"/>
        </mask>
      </defs>

      <g class="parallax-background" mask="url(#${maskId})">
        <defs>
          <linearGradient id="snowGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0b0b0b"/>
            <stop offset="100%" stop-color="#324651"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#snowGradient)" class="sky"/>

        <g class="snow-container">
          ${renderSnowflakes()}
        </g>

                <rect x="0" y="0" width="${width}" height="${height}" fill="#000000" opacity="${dark_bg / 10}" />
      </g>
      
      `,
  };

  return backgrounds[theme] || backgrounds["beach"];
}

function renderRainDrops() {
  return Array.from({ length: 250 }, () => {
    const x = Math.random() * width;
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

function renderLeaves(leafIcons = []) {
  const defaultLeafIcon = `
    <svg class="static-rotate" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#CED663;" d="M512,241.696c-28.024,42.777-53.46,68.625-74.096,84.249c-25.165,19.059-39.024,49.331-38.354,80.908 c0.353,16.342,1.176,47.931-16.495,45.33c-121.967-17.895-127.05-96.708-127.05-96.708s-5.118,79.602-127.05,96.708 c-17.695,2.482-16.847-28.989-16.506-45.33c0.671-31.577-13.177-61.848-38.354-80.908C53.472,310.321,28.024,284.473,0,241.696 c0,0,49.86-63.06,113.473-66.66c16.424-0.929,30.46-12.059,35.013-27.859c14.671-50.907,38.177-107.85,107.52-142.521 c69.343,34.671,92.837,91.614,107.508,142.521c4.553,15.8,18.589,26.93,35.013,27.859C462.14,178.635,512,241.696,512,241.696z"></path> <path style="fill:#B2B548;" d="M256.006,4.655v350.82c0,0-5.118,79.602-127.05,96.708c-17.695,2.482-16.847-28.989-16.506-45.33 c0.671-31.577-13.177-61.848-38.354-80.908C53.472,310.321,28.024,284.473,0,241.696c0,0,49.86-63.06,113.473-66.66 c16.424-0.929,30.46-12.059,35.013-27.859C163.157,96.269,186.663,39.326,256.006,4.655z"></path> <path style="fill:#B27214;" d="M440.463,254.692c-0.844-3.137-4.073-4.995-7.21-4.151c-96.474,25.981-146.762,60.725-168.427,79.455 V211.063l57.421-53.114c2.384-2.206,2.529-5.928,0.324-8.312c-2.208-2.386-5.928-2.529-8.313-0.324l-49.432,45.723V42.584 c0-4.873-3.949-8.824-8.824-8.824s-8.824,3.951-8.824,8.824v152.453l-49.432-45.725c-2.382-2.206-6.106-2.061-8.313,0.324 c-2.206,2.385-2.061,6.106,0.324,8.312l57.421,53.114v118.933c-21.666-18.73-71.953-53.474-168.429-79.455 c-3.135-0.842-6.365,1.013-7.21,4.151c-0.845,3.138,1.013,6.365,4.151,7.21c108.994,29.352,157.766,70.652,171.487,84.202v152.419 c0,4.873,3.949,8.824,8.824,8.824s8.824-3.951,8.824-8.824V346.104c13.723-13.55,62.494-54.851,171.486-84.201 C439.45,261.058,441.308,257.83,440.463,254.692z"></path> </g></svg>
  `;

  const leafIconsToUse = leafIcons.length > 0 ? leafIcons : [defaultLeafIcon];

  return Array.from({ length: 40 }, () => {
    const x = Math.random() * width;
    const y = 0;
    const size = Math.random() * 12 + 6;
    const speed = Math.random() * 25 + 14;

    const leafIcon =
      leafIconsToUse[Math.floor(Math.random() * leafIconsToUse.length)];

    return `
      <g style="animation: leafFall ${speed}s linear infinite">
        <svg 
          x="${x}" 
          y="${y}" 
          height="${size}px" 
          width="${size}px"
        >
          ${leafIcon}
        </svg>
      </g>

      <g style="animation: leafFallMirrored ${speed}s linear infinite">
        <svg 
          x="${x}" 
          y="${y}" 
          height="${size}px" 
          width="${size}px"
          style="transform: rotate(180deg); transform-origin: center;"
        >
          ${leafIcon}
        </svg>
      </g>
      
    `;
  }).join("");
}

function renderSnowflakes() {
  return Array.from({ length: 100 }, () => {
    const x = Math.random() * width;
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

function renderCloudLayers() {
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

function renderSeaLayer() {
  return `

          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.57 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#043f85" class="${"layer-6"}"/>
          `,
            )
            .join("")}


          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.6 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#043875" class="${"layer-5"}"/>
          `,
            )
            .join("")}

          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.64 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#023066" class="${"layer-4"}"/>
          `,
            )
            .join("")}


          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.67 + Math.sin(x * 0.2) * 2.6;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#012652" class="${"layer-3"}"/>
          `,
            )
            .join("")}

          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.7 + Math.sin(x * 0.2) * 2.4;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#001e42" class="${"layer-2"}"/>
          `,
            )
            .join("")}


  `;
}

function renderSandLayer() {
  return `

    <g class="dirt-container">
          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.7 + Math.sin(x * 0.2) * 2.3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="#b68a00" class="${"sand"}"/>
          `,
            )
            .join("")}
        </g>

  `;
}

function renderScene(
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
          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.8}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.6 + Math.sin(x * 0.2) * 1.5;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="${groundColor1}" class="${"layer-3"}"/>
          `,
            )
            .join("")}
        </g>

        
        <g class="trees layer-4">
            ${Array.from(
              { length: 50 },
              (_, i) => `
              <g transform="translate(${(i * width) / 15}, ${height * 0.64})">
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
              <g transform="translate(${i * (width / 12)}, ${height * 0.68})">
                <polygon points="0,0 20,-30 40,0" fill="${treeLeavesColor2}" class="tree tree-small"/>
                <rect x="18" y="0" width="4" height="10" fill="${treeTrunkColor2}" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>

          <g class="dirt-container">
          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.7}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.7 + Math.sin(x * 0.2) * 2.3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="${groundColor2}" class="${"layer-2"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-2">
            ${Array.from(
              { length: 30 },
              (_, i) => `
              <g transform="translate(${i * (width / 10)}, ${height * 0.75})">
                <polygon points="0,0 30,-50 60,0" fill="${treeLeavesColor3}" class="tree tree-medium"/>
                <rect x="25" y="0" width="7" height="10" fill="${treeTrunkColor3}" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>


          <g class="dirt-container">
          ${[0, width]
            .map(
              (offset) => `
            <path d="M${offset},${height * 0.8}
                     ${Array.from({ length: 37 })
                       .map((_, i) => {
                         const x = offset + (width / 25) * i;
                         const y = height * 0.8 + Math.sin(x * 0.2) * 3;
                         return `${i === 0 ? "M" : "L"}${x},${y}`;
                       })
                       .join(" ")} 
                     L${offset + width},${height} L${offset},${height} Z"
                  fill="${groundColor3}" class="${"layer-1"}"/>
          `,
            )
            .join("")}
        </g>

          <g class="trees layer-1">
            ${Array.from(
              { length: 10 },
              (_, i) => `
              <g transform="translate(${i * (width / 5)}, ${height * 0.8})">
                <polygon points="0,0 40,-70 80,0" fill="${treeLeavesColor4}" class="tree tree-large"/>
                <rect x="35" y="0" width="10" height="10" fill="${treeTrunkColor4}" class="trunk"/>
              </g>
            `,
            ).join("")}
          </g>
  `;
}

function renderBuildingLayers() {
  return [1, 2, 3, 4, 5, 6]
    .map(
      (layer) => `
        <g class="buildings layer-${-layer + 6}">
          ${renderBuildings(layer)}
        </g>
      `,
    )
    .join("");
}

function renderBuildings(layer) {
  return Array.from({ length: 12 }, (_, i) => {
    const rectHeight = height * 0.3 + height * (0.2 + (-layer + 6) / 15);

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
        <rect x="${i * (width / 6)}"
              y="${height * 1.37 - rectHeight}" 
              width="${(width / ((-layer + 6) * 5)) * 2}"
              height="${rectHeight}"
              opacity="${0.8 + layer / 10}"
              fill="${colors[colorIndex]}"
              class="building"/>
      `;
  }).join("");
}

export { getBackground };
