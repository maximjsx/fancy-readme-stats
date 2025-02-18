<div align="center"><sup>Based on <a href="https://github.com/anuraghazra/github-readme-stats">anuraghazra/github-readme-stats</a></sup></div>

[![Example card](https://fancy-readme-stats.vercel.app/api/pin-wide/?username=maximjsx&repo=fancy-readme-stats&dark_bg=3&theme=forest_winter&footer=Add%20this%20to%20your%20own%20readme%20:%29&title=✨%20𝕱𝖆𝖓𝖈𝖞%20𝕮𝖆𝖗𝖉𝖘%20✨&description=Animated%20GitHub%20profile%20cards%20displaying%20stats%2c%20custom%20text.%0A%208%20animated%20parallax%20backgrounds.)](https://github.com/maximjsx/fancy-readme-stats)

**What is different in this fork?**
- Animated parallax backgrounds for every card
- Additional query parameters like `dark_bg` or `footer` for the stats card
- A full-width version of the stats card

### Leave a **star** ⭐ if you want me to make more themes<img src="https://github.com/user-attachments/assets/ae25e4b9-c97e-4fe9-bb24-72cd4eb5b99b" width="50">

## Getting Started
To use this card in your GitHub profile README, add the following Markdown snippet to your README file:

```markdown
[![Fancy Profile Card](https://fancy-readme-stats.vercel.app/api?username=YOUR_GITHUB_USERNAME&theme=beach&footer=your@email.com&show_icons=true&title=Your%20name&description=Your%20description&include_all_commits=true&show_icons=true)](https://github.com/maximjsx/fancy-readme-stats)
```

### Special characters

| Character | URL Encoded      |
|-----------|----------------------------|
| Space     | `%20`                      |
| #         | `%23`                      |
| $         | `%24`                      |
| %         | `%25`                      |
| &         | `%26`                      |
| '         | `%27`                      |
| +         | `%2B`                      |
| <         | `%3C`                      |
| =         | `%3D`                      |
| _         | `%5F`                      |
| New line  | `%0A`                      |
| )         | `%29`                      |

### Global Parameters

| Parameter       | Type      | Description                                                        |
|-----------------|-----------|--------------------------------------------------------------------|
| `dark_bg`       | `number`  | Sets the background darkness level (e.g., `0` for light, `10` for pitch black). |
| `border_radius` | `number`  | Adjust the border's corner roundness! Use `5` for slight rounding and `15` for a more rounded effect. |
| `hide_border`   | `boolean` | Determines whether to hide the border (`true` to hide, `false` to show). |
| `theme`   | `boolean` | Choose from one of the themes below |

### Themes
- forest
- forest_winter
- forest_autumn
- beach
- city
- rain
- red_rain
- snow

[Here is a list of **all** themes](/themes/index.js) also the not animated ones.

### Preview:
[![Beach](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=beach&hide_border=true&description=beach&title=Theme&show_icons=true&include_all_commits=false&hide=stars,contribs,issues,commits,prs,prs_merged&height=170)](https://github.com/maximjsx/fancy-readme-stats)
[![City](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=city&hide_border=true&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&description=city&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)
[![Forest](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=forest&hide_border=true&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&description=forest&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)
[![Forest Winter](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=forest_winter&hide_border=true&description=forest%5Fwinter&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)
[![Forest Autumn](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=forest_autumn&hide_border=true&description=forest_autumn&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&title=Theme&show_icons=true&include_all_commits=false&u=1)](https://github.com/maximjsx/fancy-readme-stats)
[![Rain](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=rain&hide_border=true&description=rain&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)
[![Red Rain](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=red_rain&hide_border=true&description=red_rain&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)
[![Snow](https://fancy-readme-stats.vercel.app/api?card=1&username=maximjsx&theme=snow&hide_border=true&description=snow&hide=stars,contribs,issues,commits,prs,prs_merged&height=170&title=Theme&show_icons=true&include_all_commits=false)](https://github.com/maximjsx/fancy-readme-stats)

### Stats card Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `height` | `number` | Sets the height of the card (`230` is the default and `170` the min value). |
| `footer` | `string` | Sets the bottom text (Same as the legacy `email` parameter) |
| `hide` | `string[]` | Hides specified items. Available values: `stars`, `commits`, `prs`, `issues`, `contribs`, `prs_merged` |
| `show_icons` | `boolean` | Shows icons next to stats |
| `hide_title` | `boolean` | Hides the title/name |
| `include_all_commits` | `boolean` | Count total commits instead of just current year |
| `line_height` | `number\|string` | Sets the line height between text |
| `title` | `string` | Sets a custom title |
| `disable_animations` | `boolean` | Disables all animations in the card |
| `number_format` | `string` | Choose between `short` (1.2k) or `long` (1234) number formatting |
| `text_bold` | `boolean` | Makes text bold (`true` by default) |
| `description` | `string` | Adds a description text below the title |
| `exclude_repo` | `string` | Exclude repositories (comma-separated) - Example: `repo1,repo2,repo3` 


# Cards
There are also other cards than the stats card above.

### Repository
<a href="https://github.com/maximjsx/fancy-readme-stats">
  <img align="center" src="https://fancy-readme-stats.vercel.app/api/pin/?username=maximjsx&repo=fancy-readme-stats&theme=snow&dark_bg=7&show_icons=true&update=8" />
</a>

### Gists
<a href="https://gist.github.com/maximjsx/437532d7b08f7e54c2bb7147828ab0e7/">
  <img align="center" src="https://fancy-readme-stats.vercel.app/api/gist?id=437532d7b08f7e54c2bb7147828ab0e7&theme=snow&dark_bg=7&show_icons=true" />
</a>

<br><br>

<div align="center">
    <h2>Community & Support</h2>
    <a href="https://discord.gg/2UTkYj26B4">
        <img src="https://invidget.switchblade.xyz/2UTkYj26B4" alt="Discord Banner">
    </a>
    <h2>Contributing</h2>
    <p>Contributions are welcome!</p>
</div>

