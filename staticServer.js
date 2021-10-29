const http = require('http');
// 获取静态资源服务
const path = require('path');
const mime = require('mime');
const fs = require('fs');

function getStaticUrl(url, response) {
  let filePath = path.resolve(__dirname, `./public${url}`);
  let ext = path.parse(filePath).ext;
  const type = mime.getType(ext);
  if (fs.existsSync(filePath)) {
    if (ext) {
      fs.readFile(filePath, (err, res) => {
        if (err) throw err;
        response.writeHead(200, {
          'Content-Type': type,
        });
        response.write(res.toString());
        response.end();
      });
    } else {
      response.end("not file");
    }
    
  } else {
    response.end("404");
  }
}

const app = http.createServer((request, response) => {
  let url = request.url === '/' ? '/index.html' : request.url;
  getStaticUrl(url, response);
});

app.listen(8002, () => {
  console.log('=== localhost: 8002 ===');
});
