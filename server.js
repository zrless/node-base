const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');
const chalk = require('chalk');
const url = require('url');
const querystring = require('querystring');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cheerio = require('cheerio');
const EventEmitter = require('events');

const logger = require('./log');
logger.level = 'debug';
/**
 * 读写文件：
  fs.writeFile('./test.txt', 'Hello World!', (err) => {
    fs.readFile('./test.txt', (err2, data) => {
      if (err2) {
        console.log(err2);
      } else {
        console.log('data', data.toString());
      }
    });
  });
 */

/**
 * 获取进程
  console.log('process:', process.argv);
 */

class MyEventsEmitter extends EventEmitter {
  state = {
    name: 'Rico',
    age: 27,
  };
  sayName() {
    console.log("My Name is ",this.state.name)
  }
}
const myEventsEmitter = new MyEventsEmitter();
myEventsEmitter.on('doSometing', (value) => {
  console.log(value);
});
myEventsEmitter.emit('doSometing', 'Play game!');
myEventsEmitter.sayName()

const httpServer = http.createServer((request, response) => {
  const { pathname } = url.parse(request.url);
  /**
   * 直接输出html
    response.writeHead(200, {
      'content-type': 'text/html',
    });
    response.write(`<div style="color: red;">hello world!</div>`);
    response.end();
   */
  if (/^\/xmapi/.test(pathname)) {
    const xmapiProxy = createProxyMiddleware('/xmapi', {
      target: 'https://www.xiaomiyoupin.com',
      changeOrigin: true,
      pathRewrite: {
        '^/xmapi': '', //路由代理转发
      },
    });
    xmapiProxy(request, response);
  } else {
    switch (pathname) {
      case '/api/postData':
        doPost(response);
        return;
      case '/api/getHello':
        getHello(response);
        return;
      case '/api/spider':
        doSpider(response);
        return;
      default:
        response.write('Hello World!');
        response.end();
        break;
    }
  }
});

function doPost(response) {
  let data = '';
  const postData = [{}, {}];
  const options = {
    protocol: 'https:',
    hostname: 'www.xiaomiyoupin.com',
    port: 443,
    path: '/mtop/market/cat/list',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  logger.debug(postData);
  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('data', data);
      response.writeHead(200, {
        'Content-Type': 'application/json,charset=utf-8',
        'Access-Control-Allow-Origin': '*', // cors -> 跨域配置
      });
      response.write(data);
      response.end();
    });
  });
  req.write(querystring.stringify(postData));
  req.end();
}

function getHello(response) {
  response.writeHead(200, {
    'content-type': 'application/json,charset=utf-8',
  });
  // response.write(`{'code': 200, 'data': "Hello Node!"}`)
  response.write(JSON.stringify({ code: 200, data: 'Hello Node!' }));
  response.end();
}
// 爬虫抓取网页信息并处理，返回数据
function doSpider(response) {
  https.get('https://www.meizu.com', (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      let phoneInfo = [];
      let $ = cheerio.load(data);
      $('.index-container .section-phone-box .goods-box .box-img').each(
        (index, ele) => {
          phoneInfo.push({
            goodsName: $(ele)
              .children('.box-info')
              .children('.goods-name')
              .text(),
            goodsDesc: $(ele)
              .children('.box-info')
              .children('.goods-desc')
              .text(),
            goodImage: $(ele).children('.goods-img').attr('data-src'),
            beforePrice:
              $(ele)
                .children('.box-info')
                .children('.goods-price')
                .children('s')
                .text() || '',
            afterPrice:
              $(ele).children('.box-info').children('.goods-price').text() ||
              '',
          });
        },
      );
      response.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8',
      });
      response.write(
        JSON.stringify({
          code: 200,
          data: phoneInfo,
        }),
      );
      response.end();
    });
  });
}

// const urlString = "https://www.baidu.com:443/path/index.html?id=1#tag=2";
// console.log(url.parse(urlString));

httpServer.listen(8001, () => {
  console.log(chalk.green('=== localhost: 8001 ==='));
  /**
   * 获取网络接口
   * os.networkInterfaces()
   */
});
