const http = require("http");
const fs = require("fs");

const app = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const query = url.searchParams;
  const id = query.get("id");
  const pathname = url.pathname;
  const dataList = fs.readdirSync("./data");

  const createList = (filelist) => {
    let list = "<ol>";
    for (let i = 0; i < filelist.length; i++) {
      list = list + `<li><a href="/?id=${filelist[i]}">${i + 1}번째</a></li>`;
    }
    list = list + "</ol>";
    return list;
  };

  const htmlTemplate = (content) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>문가네</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1><a href="/">문가네</a></h1>
        ${createList(dataList)}
        <a href="/create">글 생성</a>
        ${content}
      </body>
    </html>
    `;
  };

  if (pathname === "/") {
    fs.readFile(`./data/${id}`, "utf-8", (err, data) => {
      if (id === null) {
        data = "어서오세요 문가네입니다.";
      }
      const template = htmlTemplate(data);
      res.writeHead(200);
      res.end(template);
    });
  } else if (pathname === "/create") {
    const content = `
    <form action="${url.origin}/create_action" method="post">
      <p><input type="text" name="title" placeholder="제목" /></p>
      <p>
        <textarea name="content" placeholder="내용" style="resize:none"></textarea>
      </p>
      <p>
        <input type="submit" />
      </p>
    </form>
    `;
    const template = htmlTemplate(content);
    res.writeHead(200);
    res.end(template);
  } else if (pathname === "/create_action") {
    let body = "";
    req.on("data", (data) => {
      body = body + data;
    });
    req.on("end", () => {
      const post = new URLSearchParams(body);
      const title = post.get("title");
      const content = post.get("content");
      fs.writeFileSync(`data/${title}`, content);
      res.writeHead(303, { Location: encodeURI(`/?id=${title}`) });
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end("404(Not Found)");
  }
});

app.listen(3000);
