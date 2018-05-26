/**
 * 自定义配置文件模板
 */
module.exports = {
    "port" : 8002,
    "https" : true,
    "projectPath" : "/Users/wjz/work/edu-lib/module-live",
    "static" : {
        "path" : "./",
        "config" : {
            "defer" : false
        }
    },
    "proxy" : {
        "rules" : [
            "^\/login/mock"
        ],
        "host" : "http://fes1.study.163.com/",
        "queries" : {
            "format": "json"
        },
        "headers": {},
        "path": function (option) {
            
            
        }
    }
};