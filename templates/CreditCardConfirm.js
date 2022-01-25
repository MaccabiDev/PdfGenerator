//CreditCard Confirm

const keys = require('../config/keys');



const createBody = (bodyData) => {
    const { TermstArr = []  } = bodyData;
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


module.exports.createHeader = function (bodyData) {
    const {creditCardType , lastFourDigitsCreditCard, memberId , date, creditCardTypePic} = bodyData;
    return(`
        <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
        <link href="${keys.basePath}css/directDebit/CreditCardConfirm.css" rel="stylesheet" />
        <div class="warpHeadLine">

    <table class="tblHeader" width="100%" celpadding="0" cellspacing="0">
        <tr>
            <td><div class="headDate font4">תאריך: ${date}</div>
                    <div>
                        <div class="title1 font8 bold">לכבוד</div>
                        <div class="title2 font4 regular"> קרן מכבי</div>
                    </div></td>
            <td align="left" class="pl-10"><img class="left" src="${keys.basePath}images/logo.svg"></td>
        </tr>
    </table>
   <div class="subTitleWarp">
      <div class="subTitle font10 bold">הוראה לחיוב באמצעות כרטיס אשראי</div>
      <div class="line">
         <Img class="cardImg" src="${keys.basePath}images/${creditCardTypePic}.svg" />
         <span class="item" >
            <div class="cardNumber">
               <span class="number bold">${lastFourDigitsCreditCard}</span>
               <span class="dotWrap">
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               </span>
               <span class="dotWrap">
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               </span>
               <span class="dotWrap">
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               <span class="dot" key={i}></span>
               </span>
               <div class="lastDigit font4 regular">4 ספרות אחרונות</div>
            </div>
         </span>
         <span class="item">
            <div class="brand regular bold">${creditCardType}</div>
            <div class="brandText font4 regular">סוג כרטיס</div>
         </span>
         <span class="item">
            <div class="id regular bold">${memberId}</div>
            <div class="idText font4 regular">ת.ז. בעל הכרטיס</div>
         </span>
      </div>
   </div>
</div>`);
}
module.exports.createFooter = function () {
    return '';
}
module.exports.createHtml = function (bodyData) {
    const {fullName , date, creditCardTypePic} = bodyData;
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link href="css/directDebit/CreditCardConfirm.css" rel="stylesheet" />
        <link href="css/fonts.css" rel="stylesheet" />
    </head>
    <body>
        <div class="warpText">
            <div class="text font8 regular">
                ${createBody(bodyData)}
            </div>
        </div>    
        <div class="ConfirmationWarp">
            <H6 class="titleJoiningConfirmation regular bold">אישור הרשאה לכרטיס אשראי</H6>
                        <div class="JoiningConfirmationArea">
                                    <img class="Checkbox" src="${keys.basePath}images/checkbox.svg"/>
                                    <div class="borderLeft"> 
                                        <div class="fullNameTtile font4 regular">שם מלא</div>   
                                        <div class="fullName regular">${fullName}</div>
                                    </div>
                                    <div class="dateWarp">
                                        <div class="dateTitle regular font4">תאריך</div>
                                        <div class="date regular">${date}</div>
                                    </div>    
                                </div>
                        </div>
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
            <img  src="images/${creditCardTypePic}.svg">
        </div>
        
    </body>
    </html>
    `
};