var winston = require('winston');
const { combine, timestamp, json} = winston.format;
const hostName = process.env.hostname;

var logsPath= typeof hostName ==='undefined'? `logs/`:`logs/${hostName}_`;


var logger = winston.createLogger({
    level:'info',
    format:combine(timestamp(),json()),
    // defaultMeta:{ service: 'user-service' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: `${logsPath}error.log`,timestamp:true, level: 'error' }),
        // new winston.transports.File({ filename: 'info.log', level: 'info' }),
        new winston.transports.File({ filename: `${logsPath}combined.log`,timestamp:true ,level: 'info'}),
        new winston.transports.Console()
      ]
});

module.exports = logger;