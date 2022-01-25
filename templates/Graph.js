//last tests PDF + exceptions last tests PDF
moment = require('moment');
const keys = require('../config/keys');
const axios= require('axios')

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



    






module.exports.createHeader = function(headerData){
        return `<div style=" width: 100%; float: right;">
                <link href="${keys.basePath}css/StyleSheet1.css" rel="stylesheet" />
                <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />
                <div style="float: right;">
                <h2 style = "font-size: 16px; font-family: MediumFont; color: #141414;">פירוט והשוואת תוצאות בדיקה עבור - ${headerData.first_name_hebrew + " " + headerData.last_name_hebrew}</h2>
                <div style="width: 100%; float: right;">
                    <div class="id" style ="font-size: 14px; color: #525558; padding-left: 5px; float: right;">ת.ז: ${headerData.member_id}</div>
                    <div style ="font-size: 14px; float: right; color: #525558;">מין: ${getGender(headerData.sex)}</div>
                </div>
                <div style="color: #525558; font-size: 12px;" >במידה ונדרש הסבר על משמעות התוצאות, יש לפנות לרופא שהפנה אותך לבדיקה</div>
            </div>
            <div style ="width: 200px; float: left;">
                <div style ="float: left;">
                    <img style="margin-left:0;margin-bottom:4px;width:150px;" src="${keys.basePath}images/logo.svg" />
                </div>
                <div style ="width: 100%; float: right;" >
                    <div style = "font-size: 12px; color: #525558; float: left;" >תאריך הדפסה : ${moment().format('DD/MM/YY')}</div>

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

const getGraph = async(json)=>{
    var result = "computing";
    await axios.post(`http://graph-service:4001/`,{comparisionData:json}).then((res)=>{
        
        result = res.data;
    }).catch((err)=>{
        console.log(err);
    })
    return result;
}

module.exports.createHtml= async function(json){
    var graph = "";
    await getGraph(json).then((res)=>{
        console.log(res);
        graph = res;
    },(err)=>{
        console.log(err);
    })
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

        <h4 class="medium" style="direction:ltr; text-align: center; margin-bottom:0px">${json.current_result.test_desc}${json.current_result.units ? ` | ${json.current_result.units}` : ``}</h4>
        <div style="width: 100%; height: 1px; background-color: rgba(0,0,0,0.2);"></div>
        <div style="width:1001px; margin:0 auto">
            ${graph}
        </div>
        <div style="display:none;">
            <img  src="images/logo.svg">
        </div>
    </body>
    </html>
    `
};