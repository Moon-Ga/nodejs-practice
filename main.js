const http = require("http");
const fs = require("fs");

const app = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;
  const id = query.get("id");
  const pathname = url.pathname;
  if (req.url === "/") {
    req.url = "/index.html";
  }

  if (pathname === "/") {
    fs.readFile(`data/${id}`, "utf-8", (err, data) => {
      const template = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>문가네</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1><a href="/">문가네</a></h1>
        <ol>
          <li><a href="/?id=1-first">첫번째</a></li>
          <li><a href="/?id=2-second">두번째</a></li>
          <li><a href="/?id=3-third">세번째</a></li>
        </ol>
        ${data}
      </body>
    </html>
    `;
      res.writeHead(200);
      res.end(template);
    });
  } else {
    res.writeHead(404);
    res.end("404(Not Found)");
  }
});

app.listen(3000);
