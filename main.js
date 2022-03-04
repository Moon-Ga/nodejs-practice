const http = require("http");
const fs = require("fs");
const app = http.createServer((req, res) => {
  let url = req.url;
  if (req.url === "/") {
    url = "/index.html";
  }
  res.writeHead(200);
  res.end(fs.readFileSync(__dirname + url));
});

app.listen(3000);
