//Terms of use bank PDF

const keys = require('../config/keys');




const createBody = (bodyData) => {
    const { TermstArr = [] } = bodyData;
    const TremsMarkUp = TermstArr.length > 0 ? createDebtmarkUp(TermstArr) : "";
    return TremsMarkUp;
}


const createDebtmarkUp = (TermstArr) => {
    return TermstArr.map((terms) => {
        return `
            <div class="text font10 regular">
                ${terms}
            </div>`

    }).join('')

}


module.exports.createHeader = function (headerData) {
    return(`
        <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
        <link href="${keys.basePath}css/directDebit/TermsOfUseDirectDebit.css" rel="stylesheet" />
        <div class="wrapTitle right">
            <div class="title1">${headerData.title}</div>
            <div class="logo">
                <img class="left" src="${keys.basePath}images/logo.svg">
            </div>
        </div>`);
}

module.exports.createFooter = function () {
    return '';
}
module.exports.createHtml = function (bodyData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link href="css/directDebit/TermsOfUseDirectDebit.css" rel="stylesheet" />
        <link href="css/fonts.css" rel="stylesheet" />
    </head>
    <body>
        <div>
            ${createBody(bodyData)}
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
        </div>
    </body>
    </html>
    `
};