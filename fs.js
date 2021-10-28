const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const crypto = require('crypto');

// const fsPromises = require('fs/promises');
/**
 * 文件夹操作
  fs.mkdir("./test", (err) => {
    if (err) throw err;
    console.log("文件夹创建成功");
  })
  fs.rename("./test", "./test2", (err) => {
    if (err) throw err;
    console.log("文件夹重命名成功");
  })
  fs.rmdir("./test2", (err) => {
    if (err) throw err;
    console.log("删除文件夹成功");
  })
  fs.readdir("./test", (err, res) => {
    if (err) throw err;
    console.log(res);
  })
 */

/**
 * 文件操作
  fs.writeFile("./text.txt", "Hello World", (err) => {
    if (err) throw err;
    console.log("文件创建成功");
  })
  fs.appendFile("./text.txt", "!!!", (err) => {
    if (err) throw err;
    console.log("向文件中添加成功");
  })
  fs.unlink('./text.txt', (err) => {
    if (err) throw err;
    console.log("文件删除成功");
  });
  fs.readFile('./text.txt', (err, res) => {
    if (err) throw err;
    console.log(res.toString());
  })

  try {
    const res = fs.readFileSync("./text2.txt");
    console.log(res.toString());
  } catch (error) {
    console.log(error);
  }

  (async () => {
    try {
      const res = await fsPromises.readFile('./text.txt');
      console.log(res.toString());
    } catch (error) {
      console.log(error);
    }
  })();

  // 循环文件夹中的文件
  function readDirFile(dir) {
    fs.readdir(dir, {}, (err, fileDirs) => {
      if (err) throw err;
      fileDirs.forEach((item) => {
        const targetDir = `${dir}/${item}`;
        fs.stat(targetDir, (err, stats) => {
          if (err) throw err;
          if (stats.isDirectory()) {
            readDirFile(targetDir);
          } else {
            fs.readFile(targetDir, (err, res) => {
              if (err) throw err;
              console.log(res.toString());
            });
          }
        });
      });
    });
  }
  readDirFile('./test');


  fs.appendFile('./text.txt', '1234567890', (err) => {
    if (err) throw err;
  });
  //监听文件更改
  fs.watch('./text.txt', { encoding: 'buffer' }, (eventType, filename) => {
    console.log(eventType, filename.toString());
  });
 */

/**
 * gzip压缩
  const gzip = zlib.createGzip()
  const readstream = fs.createReadStream('./text.txt')
  const writestream = fs.createWriteStream('./tex2.txt')
  readstream
    .pipe(gzip)
    .pipe(writestream)
  writestream.write(readstream)
 */

/**
 * readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question('What do you think of Node.js? ', (answer) => {
    console.log(`Thank you for your valuable feedback: ${answer}`)
    rl.close()
  })
 */

/**
 * crypto 加密
  const secret = '123456';
  const hash = crypto
    .createHmac('sha256', secret)  //sha1,sha2,sha3,...,sha256,md5
    .update('I love you')
    .digest('hex');
  console.log(hash);
 */

const secret = '123456';
const hash = crypto
  .createHmac('sha256', secret) //sha1,sha2,sha3,...,sha256,md5
  .update('I love you')
  .digest('hex');
console.log(hash);
