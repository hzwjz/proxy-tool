let Koa = require('koa');
let koaStatic = require('koa-static');
let _ = require('lodash');
let path = require('path');
let defaultConfig = require('./config');

class Server {
    constructor (config) {
        // 合并自定义配置
        this._config = _.defaultsDeep(config || {}, defaultConfig);

        this._app = new Koa();

        this._app.proxy = true;

        this._app.on('error', this._handleException.bind(this));

        this._initMiddleware();
    }

    _handleException (err) {
        console.error(err);
    }

    _initMiddleware () {
        const _middlewares = [
            // 静态文件
            koaStatic(path.join(this._config.projectPath, this._config.static.path), this._config.static.config),
            require('./middleware/error')(this._config), 
            require('./middleware/proxy')(this._config)
        ];

        _middlewares.forEach(w => {
            this._app.use(w);
        });
    }

    start () {
        if (!this._server) {
            console.log('start server at port:' + this._config.port);
            this._server = this._app.listen(this._config.port);
        }
    }

    stop () {
        if (this._server) {
            this._server.close();
            delete this._server;
        }
    }
}

module.exports = Server;