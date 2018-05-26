/**
 * error middleware
 */

module.exports = function (config) {
    return async function (context, next) {
        try{
            await next();
        }catch(err){
            console.error('server error:' + err.message);

            context.status = 500;

            context.body = err.message;
        }
    };
};