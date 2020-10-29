const request = require('request')
let express = require('express');
let bodyParser = require('body-parser');

let fs = require('fs'); // 引入fs模块

let port = process.env.PORT || 9999;
let app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let router = express.Router();
app.use(router);

// 转发请求
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})
app.use(function (req, res) {
    // 所有未处理的请求路径都会跑到这里
    // 404-请求外部接口
    // 分GET，其他，其他特殊接口，如文件上传等，谨慎使用
    var options = {
        // url: "http://localhost:89" + req.url.split('?')[0], // 本地
        url: "http://192.168.13.89:100" + req.url.split('?')[0], // 雷鸿宏
        // url: "http://192.168.8.109:9099" + req.url.split('?')[0], // 何发
        method: req.method,
        headers: {
          "content-type": "application/json",
          token: req.headers.token,
        },
        body: JSON.stringify(req.method == "GET" ? req.query : req.body),
    };
    request(options, function (error, response, body) {
      res.send(body);
      // 如果返回异常，则不记录
      if(body && body.indexOf('<!DOCTYPE html>') != -1)return;
      
      // fs.mkdirSync("./static/api"); // 创建文件夹
      // 保存数据供模拟调用
      let fileName = 'static/api/' + req.url.split('?')[0].replace(/\//g, '_') + "_" + req.method + ".js";
      let fileStr = `const Mock = require("mockjs"); module.exports = {"` + req.method + ` ` + req.url + `": Mock.mock(` + body + `)};`;
      fs.writeFile(fileName, fileStr, function(err) {
          if (err) {
              throw err;
          }
      });
      // 保存数据供线上静态使用
      let fileName1 = 'static/data/' + req.url.split('?')[0].replace(/\//g, '_') + "_" + req.method + ".js";
      let fileStr1 = `const Mock = require("mockjs"); Mock.mock("`+req.url+`",` + body + `);`;
      fs.writeFile(fileName1, fileStr1, function(err) {
        if (err) {
            throw err;
        }
      });
    })
})


app.listen(port, () => {
    console.log(`devServer start on port:${ port}`);
});