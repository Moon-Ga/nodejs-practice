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
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    list = list + "</ol>";
    return list;
  };

  const htmlTemplate = (content, update) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>문가네</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <h1><a href="/">문가네</a></h1>
        ${createList(dataList)}<br />
        <a href="/create">글 생성</a>
        ${update ? update : ""}<br/>
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
      const update = id
        ? `
      <a href="/update?id=${id}">글 수정</a>
      `
        : null;
      const template = htmlTemplate(data, update);
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
  } else if (pathname === "/update") {
    fs.readFile(`./data/${id}`, "utf-8", (err, data) => {
      const update = `
      <a href="/?id=${id}">수정 취소</a>
      `;

      const content = `
      <form action="${url.origin}/update_action" method="post">
        <input type="hidden" name="filename" value="${id}"
        <p><input type="text" name="title" placeholder="제목" value=${id} /></p>
        <p>
          <textarea name="content" placeholder="내용" style="resize:none">${data}</textarea>
        </p>
        <p>
          <input type="submit" />
        </p>
      </form>
      `;
      const template = htmlTemplate(content, update);
      res.writeHead(200);
      res.end(template);
    });
  } else if (pathname === "/update_action") {
    let body = "";
    req.on("data", (data) => {
      body = body + data;
    });
    req.on("end", () => {
      const post = new URLSearchParams(body);
      const filename = post.get("filename");
      const title = post.get("title");
      const content = post.get("content");
      fs.renameSync(`data/${filename}`, `data/${title}`);
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
