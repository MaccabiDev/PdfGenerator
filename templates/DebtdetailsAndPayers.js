//followed tests PDF
moment = require('moment');
const keys = require('../config/keys');




const createBody = (bodyData) => {
    const {payerArr = [],DebtArr = [],TotalDebts} = bodyData;
    const hasDebts = DebtArr.length > 0;
    const hasPayees = payerArr.length > 0;
    const payerMarkUp = hasPayees ? createPayermarkUp(payerArr,hasDebts) : "";
    const debtMarkUp = hasDebts ? createDebtmarkUp(DebtArr, TotalDebts) : "";
    return payerMarkUp + debtMarkUp;
}

const createNote = (TotalDebts) => {
    return TotalDebts > 0 ? createDebtNote(TotalDebts) :"";
}

const createPayermarkUp = (payerArr,needPageBreakAfter) => {
    return `<div class="contentPayer ${needPageBreakAfter ? "pb_after" : ""}">
    <div class="title font10">
        <span class="font12 medium">פרטי משולמים</span>
        <br/>
        התשלום באמצעות הוראת קבע יחול גם על בני המשפחה ו/או חברי מכבי עליהם אתה משלם
    </div>
    <div class="table font10">
        <div class="row title medium">
            <div class="name">שם המשולם</div>
            <div class="id">ת.ז המשולם</div>
        </div>
        ${payerArr.map(({payerName,payerId}) => 
            `<div class="row">
            <div class="name">${payerName}</div>
            <div class="id">${payerId}</div>
        </div>`
        ).join('')}
        </div>
    </div>`;
}

const createDebtNote = (TotalDebts) =>{
    return `
    <div class="kupaDebts font10">
        בהתאם להסכם שלך עם מכבי, בהוראת הקבע ייגבו חובות בגין דמי ביטוח בלבד. אם ברצונך לשלם את יתרת החוב בסך ${TotalDebts} ש"ח, ניתן לפנות למוקד השירות הטלפוני
    </div>`;
}

const createDebtmarkUp = (DebtArr,TotalDebts) => {
    let totalSum = DebtArr.reduce((acc,item) => {
        item.amounts.forEach(amount => acc+=amount);
        return acc;
    },0);
    return `
    <div class="contentDeb">
        <div class="title font10">
            <span class="font12 mainTitle medium">פרטי חוב</span>
            <br/>
            מחשבונך במכבי ייגבה חוב בסה״כ <strong class="bold "><span dir="ltr">${totalSum % 1 != 0 ? totalSum.toFixed(2) : totalSum.toFixed(0)}</span> ש״ח</strong> בגין אי תשלום:
        </div>

        <div class="table font10">
            <div class="row title medium">
                <div class="name col">שם המשולם</div>
                <div class="id col">ת.ז המשולם</div>
                <div class="debFor col">חוב עבור</div>
                <div class="datesOfDeb col">תקופת חוב</div>
                <div class="amount col">סכום החוב</div>
            </div>
            ${DebtArr.map((debt) => {
                return`
                <div class="row">
                    <div class="name col">${debt.name}</div>
                    <div class="id col">${debt.id}</div>
                    <div class="debFor col">
                        ${debt.debFor.map((text) => 
                            `<div>${text}</div>`
                        ).join('')}
                    </div>
                    <div class="datesOfDeb col">
                        ${debt.dates.map((item) => 
                            `<div>${item}</div>`
                        ).join('')}
                    </div>
                    <div class="amount col">
                        ${debt.amounts.map((amount) => 
                            `<div><span dir="ltr">${amount % 1 != 0 ? amount.toFixed(2) : amount.toFixed(0)}<span> ש"ח</div>`
                        ).join('')}
                    </div>
                </div>
                `;
            }).join('')}
        </div>
        <div class="approval font10">
        <div class="img">
            <img src="images/checkbox.svg"/>
        </div>
        אושרה גביית החוב בהוראת קבע
        </div>
        ${createNote(TotalDebts)}
    </div>`;
}

module.exports.createHeader = function(headerData){
    const moment = require('moment');
    return `
        <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
        <link href="${keys.basePath}css/directDebit/DebtdetailsAndPayers.css" rel="stylesheet" />
        <div class="header1 right">
            <div class="details right">
                <div class="data font8">תאריך : ${moment().format('DD/MM/YYYY')}</div>
                <div class="personDetail font8">
                    <span class="font12 medium">${headerData.memberFirstName} ${headerData.memberLastName}</span>
                    <br/>
                    ${headerData.memberId}
                </div>
            </div>
            <div class="logo">
                <img class="left" src="${keys.basePath}images/logo.svg">
            </div>
        </div>
    `;
}
module.exports.createFooter = function(){
    return '';
}
module.exports.createHtml= function(bodyData){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link href="css/directDebit/DebtdetailsAndPayers.css" rel="stylesheet" />
        <link href="css/fonts.css" rel="stylesheet" />
    </head>
    <body>
        <div class="body1 regular">
            ${createBody(bodyData)}

           
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
            <img  src="images/checkbox.svg">
        </div>
    </body>
    </html>
    `
};