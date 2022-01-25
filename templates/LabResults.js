//lab results PDF + exceptions lab results PDF
moment = require('moment');
const keys = require('../config/keys');
const extractGroups = (bodyData)=>{

    var groupsContainer = ` <div class="contentWrapper section floatRight">`
    var groupValues;
    groupValues = bodyData.map(group=>{

        return `<div class="testWrapper col100 floatRight pbi_avoid">
            <h4 class="bgGray font12 medium colorBlack">${group.group_name}</h4>
            <div class="resWrapper">
                ${extractGroupValues(group.group_values, group.group_name)}
            <div>
        </div>
        `
    });
    groupValues.forEach(element => {
        groupsContainer = groupsContainer.concat(element);
    });
    groupsContainer = groupsContainer.concat(`</div>`)
    return groupsContainer;
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

const extractGroupValues = (groupValues, groupName)=>{
    
    const values =  groupValues.map(val=>{
        const precentage = val.numeric_percentage>100 ? 100 : val.numeric_percentage < 0 ? 0 :val.numeric_percentage;
        const isScala = val.max_lim > 0;
        val.result_file && val.result_file !== "" && Array.isArray(val.message_list) ? val.message_list.push('תוצאת הבדיקה מפורטות בהמשך') : '';
        const listMsg = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
              return `<div style="direction:ltr; text-align:right">${item} </div>`
            }).join(''):"";
        const listMsgWithDiv = val.message_list && val.message_list.length>0?val.message_list.map(item=>{
            return `<div style="direction:ltr;">${item} </div>`
            }).join(''):"";
        const msg = val.message.length>0?`<div style="direction:ltr">${val.message}</div>` : listMsg;
        const isRed = (val.numeric_percentage>100 || val.numeric_percentage <0) && isScala;
        const isVitek = val.is_vitek;
        const hasMassageList = val.is_messages && parseInt(val.is_messages) > 0;
        const shouldShowMassageList = hasMassageList && (isScala || val.result !== 0);
        

        return `<div class="res floatRight pbi_avoid">
        <div class="font12 medium colorBlack col40 floatRight testNameFontWeight" style="direction:ltr;">${val.test_desc}</div>
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
        `<div class="font8 colorGray col45 floatRight">
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
    
    let groupValuesToReturn="";

    values.forEach(val=>{
        groupValuesToReturn = groupValuesToReturn.concat(val)
    })

    return groupValuesToReturn

    
}

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



module.exports.createHeader = function(headerData){
        return `<div style=" width: 100%; float: right;">
                <link href="${keys.basePath}css/StyleSheet1.css" rel="stylesheet" />
                <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
                <div style="float: right;">
                <h2 style = "font-size: 16px; font-family: MediumFont; color: #141414;">תוצאות בדיקות מעבדה ${headerData.irregular_only ? 'חריגות' : ''} עבור - ${headerData.first_name_hebrew + " " + headerData.last_name_hebrew}</h2>
                <div style="width: 100%; float: right;">
                    <div class="id" style ="font-size: 14px; color: #525558;float: right;">ת.ז: ${headerData.member_id}</div>
                    <div class="id" style ="font-size: 14px; float: right; color: #525558;">מין: ${getGender(headerData.sex)}</div>
                    ${headerData.doctor_name ? `<div style ="font-size: 14px; float: right; color: #525558;">רופא מפנה: <span class="medium colorBlack">${headerData.doctor_name}</span></div>` : ``}
                </div>
                <div style="color: #525558; font-size: 12px;" >במידה ונדרש הסבר על משמעות התוצאות, יש לפנות לרופא שהפנה אותך לבדיקה</div>
                <h3 style="margin-top:5px; font-size: 16px; font-family: MediumFont; color: #141414;" >תאריך בדיקה ${typeof headerData.test_date !== "undefined" ? moment(headerData.test_date).format('DD/MM/YY') : ""} ${typeof headerData.test_time !== "undefined" ? `בשעה ${headerData.test_time}` : ""}</h3>
                ${headerData.is_partial ? `<h4 style="font-size: 14px; color: #141414;">תוצאות חלקיות</h4>` : ``}
            </div>
            <div style ="width: 200px; float: left;">
                <div style ="float: left;">
                    <img style="margin-left:0; margin-bottom:4px;width:150px;" src="${keys.basePath}images/logo.svg" />
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
module.exports.createFooter = function(json){
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
            ${extractGroups(bodyData)}
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
        </div>
    </body>
    </html>
    `
};