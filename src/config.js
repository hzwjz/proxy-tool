/**
 * 默认配置
 */
let path =  require('path');

module.exports = {
    "port" : 8002,
    "https" : true,
    "projectPath" : path.join(__dirname, '../'), // 默认为本工程根路径
    "static" : {
        "path" : "./",
        "config" : {
            "defer" : false
        }
    },
    "proxy" : {
        "rules" : [
            "^\/api"
        ],
        "host" : "http://www.baidu.com",
        "queries" : {
            "format": "json"
        },
        "headers": {},
        "path": function (option) {
            
        }
    }
}