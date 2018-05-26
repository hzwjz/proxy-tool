/**
 * 默认配置
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
            "^\/api"
        ],
        "host" : "http://localhost",
        "queries" : {
            "format": "json"
        },
        "headers": {},
        "path": function (option) {
            
            
        }
    }
}