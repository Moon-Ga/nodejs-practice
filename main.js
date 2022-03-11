const http = require("http");
const fs = require("fs");

const app = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;
  const id = query.get("id");
  const pathname = url.pathname;

  if (pathname === "/") {
    let list = "<ol>";
    let filelist = fs.readdirSync("./data");
    for (let i = 0; i < filelist.length; i++) {
      list = list + `<li><a href="/?id=${filelist[i]}">${i + 1}번째</a></li>`;
    }
    list = list + "</ol>";
    fs.readFile(`./data/${id}`, "utf-8", (err, data) => {
      if (id === null) {
        data = "어서오세요 문가네입니다.";
      }
      const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>문가네</title>
          <meta charset="utf-8" />
        </head>
        <body>
          <h1><a href="/">문가네</a></h1>
          ${list}
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
