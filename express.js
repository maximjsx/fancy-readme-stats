import "dotenv/config";
import statsCard from "./api/index.js";
import repoCard from "./api/pin.js";
import wideRepoCard from "./api/pin-wide.js";
import langCard from "./api/top-langs.js";
import wakatimeCard from "./api/wakatime.js";
import gistCard from "./api/gist.js";
import express from "express";

const app = express();
app.listen(process.env.port || 9000);

console.log("Server is running on port: " + (process.env.port || 9000));

app.get("/", statsCard);
app.get("/pin", repoCard);
app.get("/pin-wide", wideRepoCard);
app.get("/top-langs", langCard);
app.get("/wakatime", wakatimeCard);
app.get("/gist", gistCard);


