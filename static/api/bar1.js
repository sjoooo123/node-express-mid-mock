const Mock = require("mockjs");
module.exports = {
  "GET /echart/bar1": {
    code: "000000",
    msg: "请求成功",
    data: Mock.mock({
      "d|6": [
        {
          product: "@name",
          "2015|30-100.1-2": 2,
          "2016|30-100.1-2": 2,
          "2017|30-100.1-2": 2
        }
      ]
    }).d,
    totalItem: 6
  }
};
