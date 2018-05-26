/**
 * proxy middleware
 */
var requestp = require('request-promise');
var parse = require('co-body');
var fs = require('fs');
var formidable = require('formidable');

function multipart(req) {
    return new Promise(function(resolve, reject) {
        var data = {};
        var form = new formidable.IncomingForm();
        
        // form.parse(req, function(err, fields, files) {
        //     if(!err){
        //         resolve({

        //         });
        //     }else{
        //         reject(error);
        //     }
        // });

        form
        .on('field', function(name, value) {
            data[name] = value;
        })
        .on('file', function(name, file) {
            data[name] = fs.readFileSync(file.path)
        })
        .on('error', function(error) {
            reject(error);
        })
        .on('end', function() {
            resolve(data);
        });
        
        form.parse(req);
    });
}

function getUrl(context, config){
    return config.proxy.host + context.path;
}

function getHeaders(context, config){
    // 可以加上自定义的header
    return context.headers;
}

function getQueries(context, config){
    // 可以加上自定义的query
    return context.query;
}

function configRequestOptions(context, config) {
    var opts = {
        method: context.method,
        url: getUrl(context, config),
        headers: getHeaders(context, config),
        qs: getQueries(context, config),
        resolveWithFullResponse: true
    };
  
    switch (true) {
        case !context.request.body:
            break;
        case context.is('urlencoded') === 'urlencoded':
            opts.form = context.request.body;
            break;
        case context.is('multipart') === 'multipart':
            opts.formData = context.request.body;
            break;
        default:
            opts.body = context.request.body;
            opts.json = context.is('json') === 'json'
    }

    return opts;
};

async function parseBody(context) {
    if (!!context.is('json', 'text', 'urlencoded')) {
        return await parse(context.req);
    }
        
    if (!!context.is('multipart')) {
        return await multipart(context.req);
    }

    return '';
};


module.exports = function (config) {
    let rules = config.proxy.rules || [];

    return async function (context, next) {
        let upath = context.path;
        let match = false;

        rules.forEach(function(item){
            let pattern = new RegExp(item);

            if(pattern.test(upath)){
                match = true;
                console.log('macth path : '+ upath +', do proxy');
                return;
            }
        });

        if(match){
            // parse body
            if(!context.request.body){
                context.request.body = await parseBody(context);
            }

            try{
                let ropt = configRequestOptions(context, config);

                console.log('proxy request:' + JSON.stringify(ropt));

                let response = await requestp(ropt);

                console.log('proxy reponse success:' + JSON.stringify({
                    statusCode : response.statusCode,
                    headers : response.headers,
                    body : response.body                    
                }));

                context.status = response.statusCode;
                context.set(response.headers);
                context.body = response.body;

            }catch(err){
                console.error('proxy reponse error:' + err.message);
                context.status = err.statusCode || 500;
                context.body = err.message;
            }
        }
    };
};