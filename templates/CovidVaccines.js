//Comparison PDF
moment = require("moment");
const keys = require("../config/keys");

module.exports.createHeader = function (headerData) {
  return `
        <div class="pdf-header">
        <link href="${keys.basePath}css/CovidStyles.css" rel="stylesheet" />
        <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
        <div class="print-date" >תאריך הדפסה : ${moment().format(
          "DD/MM/YY"
        )}</div>
        <img class="header-img" src="${keys.basePath}images/invalid-name.png"/>
            <div class="bold" style="font-size:28px;">אישור התחסנות</div>
            <div style="font-size:14px;">Certificate Of Vaccination</div>
        </div>`;
  // </body>
  // </html>`
};
module.exports.createFooter = function () {
  return `<div style="text-align: center;font-size: 8px;">
    <link href="${keys.basePath}css/CovidStyles.css" rel="stylesheet" />
    <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
    המסמך מכיל מידע המוגן על פי חוק הגנת הפרטיות ותקנותיו. המוסרו שלא כדין עובר עבירה.
    </div>`;
};
module.exports.createHtml = function ({ vaccineData, customerData }) {
  return /*html*/ `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="utf-8" />
      <title></title>
      <link href="css/CovidStyles.css" rel="stylesheet" />
      <link href="css/fonts.css" rel="stylesheet" />
  </head>
  
  <body>
      <div class="container body-content">
          <div class="box">
              <div class="box-header flex">
                  <div class="header-row">
                      <div class="header-col">
                          <div class="col-title font-sm">שם מלא</div>
                          <div class="col-desc bold font-md">${
                            customerData.first_name_hebrew
                          }
                              ${customerData.last_name_hebrew}</div>
                      </div>
                      <div class="header-col">
                          <div class="col-title font-sm">Full Name</div>
                          <div class="col-desc uppercase bold font-md">${
                            customerData.first_name_english
                          } ${customerData.last_name_english}</div>
                      </div>
                  </div>
                  <div class="header-row">
                      <div class="header-col">
                          <div class="col-title font-sm">תאריך לידה | Date of birth</div>
                          <div class="col-desc bold font-md">${
                            customerData.birth_date
                          }</div>
                      </div>
                      <div class="header-col">
                          <div class="col-title font-sm">מס. תעודת זהות | ID</div>
                          <div class="col-desc bold font-md">${
                            customerData.member_id
                          }</div>
                      </div>
                  </div>
                        <img class="img-wrapper" src="${
                          keys.basePath
                        }images/shield.png"/>
              </div>
              <div class="box-body">
                   ${vaccineData
                     .map(
                       (vaccine, index) =>
                         `<div class='body-vacc flex'>
                          <div class='vacc-col'>
                              <div class='font-sm'>מנה | Dose</div>
                              <div class='font-xl thin dose'>0${++index}</div>
                         </div>
                         <div class='vacc-col ml-40'>
                              <div class='font-sm bold mb-20'> ${
                                vaccine.VaccinationDate
                              }</div>
                              <div class='font-xs'>מכבי שירותי בריאות | ישראל</div>
                         </div>
                         <div class='vacc-col'>
                              <div class='font-sm bold mb-20'>${
                                vaccine.VaccineName
                              }</div>
                              <div class='font-xs'> Maccabi Health Services | Israel</div>
                         </div>
                      </div>
                      <div class="horizontal-line"></div>`
                     )
                     .join("")}
              </div>
              </div>
              <div class="font-xs">אישור זה מעיד על קבלת החיסונים ואינו מהווה תחליף לתעודת מתחסן של משרד הבריאות</div>
          </div>
      </div>
      <div style="display:none">
          <img src="images/invalid-name.png">
      </div>
  </body>
  
  </html>
    `;
};
