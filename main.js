const http = require("http");
// const fs = require("fs");

const app = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;
  if (req.url === "/") {
    req.url = "/index.html";
  }
  res.writeHead(200);
  res.end(query.get("id"));
});

app.listen(3000);
