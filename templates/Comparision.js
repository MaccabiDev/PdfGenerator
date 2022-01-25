//Comparison PDF
moment = require('moment');
const keys = require('../config/keys');

const isCoronaResult = (result) =>{
    return result.test_id === "76350"
}

const getGender=(genderField)=>{
    if(genderField === "ז"){
        return "זכר";
    }
    else if (genderField === "נ"){
        return "נקבה";
    }
    else{
        return "לא ידוע"
    }
}
const extractCurrentResult = (val)=>{   
        var precentage = val.numeric_percentage>100 ? 100 : val.numeric_percentage < 0 ? 0 :val.numeric_percentage;
        var isScala = val.max_lim > 0;
        val.result_file && val.result_file !== "" && Array.isArray(val.message_list) ? val.message_list.push('תוצאת הבדיקה מפורטות בהמשך') : '';
        var listMsg = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
              return `<div style="direction:ltr; text-align:right">${item} </div>`
            }).join(''):"";
            const listMsgWithDiv = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
                return `<div style="direction:ltr;">${item} </div>`
              }).join(''):"";
        var msg = val.message.length>0?`<div>${val.message}</div>` : listMsg;
        var isRed = (val.numeric_percentage>100 || val.numeric_percentage <0) && isScala;
        const isVitek = val.is_vitek;
        const hasMassageList = val.is_messages && parseInt(val.is_messages) > 0;
        const shouldShowMassageList = hasMassageList && (isScala || val.result !== 0);

        return `<div class="res floatRight pbi_avoid">
        <div class="font12 medium colorBlack col30 floatRight" style="direction:ltr;">${val.doc_first_name} ${val.doc_last_name}</div>
        <div class="font8 colorGray col30 floatRight">${moment(val.lab_date).format('DD/MM/YY')} ${isCoronaResult(val) ? `| בשעה ${val.reque_sthour}` :``}</div>
        ${isVitek ? `
        <div class="col60 floatRight">
            <div class="rowWrapper font10 colorGray">
                <div class="col_1">חיידקים</div>
                <div class="col_2">
                    <div class="col_2Wrapper">
                        <div class="nameOfDrug temp">תרופות</div>
                        <div class="sensitivity"></div>
                    </div>
                </div>
            </div>
            ${createVitekRow(val.vitek_row)}
        </div>
        ` : ""}
        ${val.result != 0 || isScala?
        `<div class="font8 colorGray col25 floatRight">
            <div class="floatRight">${val.units !== null && val.units.length>0 ? val.units:""}</div>
            <div class="floatRight numRes ${isRed? "colorRed":""} medium">${val.result}</div>
        </div>`
        :
        `${!isVitek ? `<div class="font8 colorGray col60 floatRight">
                ${msg}
            </div>` : ``}`
        }
        ${isScala?
        `<div class="col15 floatRight resRangeWrap">

            <div class="resRange dots">
                <div class="font8 ${isRed? "star":"starLow"} medium" style="left: ${precentage}%;">*</div>
                <div class="minRange font8 colorBlack">${val.min_lim}</div>
                <div class="maxRange font8 colorBlack">${val.max_lim}</div>
            </div>

            
        </div>`
        :""
        }
        ${shouldShowMassageList ? `<div class="col100 font8 colorGray floatRight"><div class="notesHeadlin">הערות לבדיקה:<div style="margin-right:5px;max-width:135px;word-wrap:break-word;">${listMsgWithDiv}</div></div></div>` : ""}
    </div>`
};

const createVitekRow = (vitekData) => {
    const vitekMarkUp =  vitekData.map((vitekRow) => {
        return(
            `<div class="rowWrapper font10 colorGray">
                <div class="col_1 colorBlack medium">${vitekRow.bacterium_name}</div>
                <div class="col_2">
                    ${vitekRow.drugs_and_sensitivity_list.map((drugs_and_sensitivity) => {
                        return(
                           ` <div class="col_2Wrapper">
                                <div class="nameOfDrug regular">${drugs_and_sensitivity.name_of_drug}</div>
                                <div class="sensitivity">
                                    ${drugs_and_sensitivity.sensitivity == " " ? `<div> </div>` : ""}
                                    ${drugs_and_sensitivity.sensitivity != " " ? `<div class="colorBlack medium">${drugs_and_sensitivity.sensitivity}</div>` : ""}
                                </div>
                            </div>`
                        );
                    }).join('')}
                </div>
            </div>`
        );
    });
    return vitekMarkUp.join('');
}

const extractOtherResult = (resultsValue)=>{
    
    var values =  resultsValue.map(val=>{
        var precentage = val.numeric_percentage>100 ? 100 : val.numeric_percentage < 0 ? 0 :val.numeric_percentage;
        var isScala = val.max_lim > 0;
        val.result_file && val.result_file !== "" && Array.isArray(val.message_list) ? val.message_list.push('תוצאת הבדיקה מפורטות בהמשך') : '';
        var listMsg = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
              return `<div style="direction:ltr; text-align:right">${item} </div>`
            }).join(''):"";
        const listMsgWithDiv = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
                return `<div style="direction:ltr;">${item} </div>`
              }).join(''):"";
        var msg = val.message.length>0?`<div style="direction:ltr">${val.message}</div>` : listMsg;
        var isRed = (val.numeric_percentage>100 || val.numeric_percentage <0) && isScala;
        const isVitek = val.is_vitek;
        const hasMassageList = val.is_messages && parseInt(val.is_messages) > 0;
        const shouldShowMassageList = hasMassageList && (isScala || val.result !== 0);

        return `<div class="res floatRight pbi_avoid">
        <div class="font12 medium colorBlack col30 floatRight testNameFontWeight" style="direction:ltr;">${val.doc_first_name} ${val.doc_last_name}</div>
        <div class="font8 colorGray col30 floatRight">${moment(val.lab_date).format('DD/MM/YY')} ${isCoronaResult(val) ? `| בשעה ${val.reque_sthour}` :``}</div>
        ${isVitek ? `
        <div class="col60 floatRight">
            <div class="rowWrapper font10 colorGray">
                <div class="col_1">חיידקים</div>
                <div class="col_2">
                    <div class="col_2Wrapper">
                        <div class="nameOfDrug temp">תרופות</div>
                        <div class="sensitivity"></div>
                    </div>
                </div>
            </div>
            ${createVitekRow(val.vitek_row)}
        </div>
        ` : ""}
        ${val.result != 0 || isScala?
        `<div class="font8 colorGray col25 floatRight">
            <div class="floatRight units">${val.units !== null && val.units.length>0 ? val.units:""}</div>
            <div class="floatRight numRes ${isRed? "colorRed":""} medium">${val.result}</div>
        </div>`
        :
        `${!isVitek ? `<div class="font8 colorGray col60 floatRight">
                ${msg}
        </div>` : ``}`
        }
        ${isScala?
        `<div class="col15 floatRight resRangeWrap">

            <div class="resRange dots">
                <div class="font8 ${isRed? "star":"starLow"} medium" style="left: ${precentage}%;">*</div>
                <div class="minRange font8 colorBlack">${val.min_lim}</div>
                <div class="maxRange font8 colorBlack">${val.max_lim}</div>
            </div>

            
        </div>`
        :""
        }
        ${shouldShowMassageList ? `<div class="col100 font8 colorGray floatRight"><div class="notesHeadlin">הערות לבדיקה:<div style="margin-right:5px;max-width:135px;word-wrap:break-word;">${listMsgWithDiv}</div></div></div>` : ""}
    </div>`
    });
    
    var groupValuesToReturn="";

    values.forEach(val=>{
        groupValuesToReturn = groupValuesToReturn.concat(val)
    })

    return groupValuesToReturn

    
}



module.exports.createHeader = function(headerData){
        return `<div style=" width: 100%; float: right;">
                <link href="${keys.basePath}css/StyleSheet1.css" rel="stylesheet" />
                <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
                <div style="float: right;">
                <h2 class-"font12" style = "font-size: 16px; font-family: MediumFont; color: #141414;">פירוט והשוואת תוצאות בדיקה עבור - ${headerData.first_name_hebrew + " " + headerData.last_name_hebrew}</h2>
                <div style="width: 100%; float: right;">
                    <div class="id" style ="font-size: 14px; color: #525558;float: right;">ת.ז: ${headerData.member_id}</div>
                    <div style ="font-size: 14px; float: right; color: #525558;">מין: ${getGender(headerData.sex)}</div>                    
                </div>
                <div style="color: #525558; font-size: 12px;" >במידה ונדרש הסבר על משמעות התוצאות, יש לפנות לרופא שהפנה אותך לבדיקה</div>
                <h3 style="margin-top:5px; font-size: 16px; color: #141414;  direction: ltr;" ><span class="medium">${headerData.result_test_desc}</span> ${headerData.result_units}</h3>
            </div>
            <div style ="width: 200px; float: left;">
                <div style ="float: left;">
                    <img style="margin-left:1px; margin-bottom:4px;width:150px;" src="${keys.basePath}images/logo.svg" />
                </div>
                <div style ="width: 100%; float: right;" >
                    <div style = "font-size: 12px; color: #525558; float: right;" >תאריך הדפסה : ${moment().format('DD/MM/YY')}</div>
                    <div style = "font-size: 12px; color: #525558; float: left; direction: rtl;">{{page}} מתוך {{pages}}</div>
                </div>
            </div>
        </div>`
        // </body>
        // </html>`
}
module.exports.createFooter = function(){
    return `<div style="text-align: center; margin:5px 0; width: 100%; float: right; font-size: 12px; color: #525558;">
    <link href="${keys.basePath}css/StyleSheet1.css" rel="stylesheet" />
    <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
    המסמך מכיל מידע המוגן על פי חוק הגנת הפרטיות ותקנותיו. המוסרו שלא כדין עובר עבירה.
    </div>`
}
module.exports.createHtml= function(bodyData){
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <link href="css/StyleSheet1.css" rel="stylesheet" />
        <link href="css/fonts.css" rel="stylesheet" />
    </head>
    <body>
        <div class="testResWrapper">
            <div class="contentWrapper section floatRight">
                <div class="testWrapper col100 floatRight">
                    <h4 class="bgGray font12 medium colorBlack">תוצאה נוכחית</h4>
                    <div class="resWrapper">
                        ${extractCurrentResult(bodyData.current_result)}
                    <div>
                </div>
            </div>
            ${bodyData.other_results.length > 0 ? `<div class="contentWrapper section floatRight">
            <div class="testWrapper col100 floatRight">
                <h4 class="bgGray font12 medium colorBlack">תוצאות נוספות</h4>
                <div class="resWrapper">
                    ${extractOtherResult(bodyData.other_results)}
                <div>
            </div>
        </div>` : ``}
            
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
        </div>
    </body>
    </html>
    `
};