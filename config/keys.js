
if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV.trim() === "prod"){
    module.exports = require('./prod')
}else{
    module.exports = require('./dev')
}