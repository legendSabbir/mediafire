const express = require("express");
const request = require("request");
const serverless = require('serverless-http');
const cheerio = require("cheerio");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  const url = req.query.url;
  request(url, (error, response, body) => {
    const $ = cheerio.load(body);
    let directLink;
    try {
      const downloadButton = $('#downloadButton');
      directLink = downloadButton.attr('href');
    } catch(err) {
      const script = $("script").get().find(s => s.children[0].data.includes("window.location.href"));
      directLink = script.children[0].data.match(/'(.*)'/)[1];
    }
    res.send(directLink);
  });
});


app.use('/', router);
module.exports.handler = serverless(app);