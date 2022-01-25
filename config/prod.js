var path = require('path');

const base = path.dirname(__filename).replace(/\\/g,"/").replace('config','');

module.exports = {
    "basePath":`file:///${base}`,
    "createLocalPdf":false,
    "pdfAbsolutePath":'C:/pdfService/'
}
