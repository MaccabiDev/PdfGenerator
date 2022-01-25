//lab results PDF + exceptions lab results PDF
moment = require('moment');
const keys = require('../config/keys');

const extractGroups = (bodyData)=>{
    groupsContainer = `
    <div style="margin-top:-45px"></div><span style="font-family: MediumFont;visibility: hidden;">this for the error</span>
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${bodyData.examination_date_measurement_date ?
        `<tr>
            <td class="header-result-details bold" width="10%">תאריך בדיקה:</td>
            <td class="colorGray">${bodyData.examination_date_measurement_date}</td>
        </tr>` : ""}

        ${bodyData.operator_name ?
            `<tr>
                <td class="header-result-details bold" width="10%">בוצע ע"י:</td>
                <td class="colorGray">${bodyData.operator_name}</td>
            </tr>` : ""}
        
        ${bodyData.answer ?
            `<tr>
                <td class="header-result-details bold" width="10%">תשובה:</td>
                <td class="colorGray">${bodyData.answer}</td>
            </tr>` : ""
        }
    </table>
    
        ${bodyData.reason ?
            `<div class="result-details"><div class="header-result-details bold">סיבת הבדיקה:</div>
            <div class="colorGray">${bodyData.reason}</div></div>` : ""}
        ${bodyData.evaluation ?
            `<div class="result-details"><div class="header-result-details bold">הערכת הסימפטומים:</div>
            <div class="colorGray">${bodyData.evaluation}</div></div>` : ""}
        ${bodyData.history ?
            `<div class="result-details"><div class="header-result-details bold">תולדות המחלה:</div>
            <div class="colorGray">${bodyData.history}</div></div>` : ""}
        ${bodyData.risk_factor ?
            `<div class="result-details"><div class="header-result-details bold">גורמי סיכון:</div>
            <div class="colorGray">${bodyData.risk_factor}</div></div>` : null}
        ${bodyData.pre_test ?
            `<div class="result-details"><div class="header-result-details bold">PRE TEST:</div>
            <div class="colorGray">${bodyData.pre_test}</div></div>` : null}
        ${bodyData.relevant_drug ?
            `<div class="result-details"><div class="header-result-details bold">תרופות רלוונטיות:</div>
            <div class="colorGray">${bodyData.relevant_drug}</div></div>` : ""}
        ${bodyData.followed_by_medical_program ?
            `<div class="result-details"><div class="header-result-details bold">הבדיקה בוצעה תחת טיפול:</div>
            <div class="colorGray">${bodyData.followed_by_medical_program}</div></div>`: null}
        

        ${ (bodyData.pulse_for_minute_rest || bodyData.diastolic_pressure
            || bodyData.systolic_pressure || bodyData.finding
            || bodyData.ecg_on_rest || bodyData.max_pulse_by_age) ? 
            `<div class="result-details">
                <div style="color: #141414"><u>נתונים קליניים במנוחה:</u></div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      ${bodyData.pulse_for_minute_rest ?
                        `<tr>
                            <td class="header-result-details td-details bold" width="27%">קצב הלב:</td>
                            <td class="td-details colorGray">${bodyData.pulse_for_minute_rest} לדקה</td>
                        </tr>` : ""}
                    
                        ${bodyData.diastolic_pressure && bodyData.systolic_pressure ?
                        `<tr>
                            <td class="header-result-details td-details bold" width="27%">לחץ דם:</td>
                            <td class="td-details colorGray">${bodyData.systolic_pressure} / ${bodyData.diastolic_pressure}</td>
                        </tr>` : ""}    
                        ${bodyData.finding ?
                        `<tr>
                            <td class="header-result-details bold" width="27%">ממצאים חריגים בבדיקת הלב והריאות:</td>
                            <td class="colorGray">${bodyData.finding}</td>
                        </tr>` : ""}
                        ${bodyData.ecg_on_rest ?
                        `<tr>
                            <td class="header-result-details bold" width="27%">אקג:</td>
                            <td class="colorGray">${bodyData.ecg_on_rest}</td>
                        </tr>` : "" }
                        ${bodyData.max_pulse_by_age ?
                        `<tr>
                            <td class="header-result-details bold" width="27%">הדופק המקסימלי המצופה לגיל:</td>
                            <td class="colorGray">${bodyData.max_pulse_by_age} לדקה</td>
                        </tr>` : "" }

                </table>
            </div>` : ""} 
        

        ${ (bodyData.examination_protocol || bodyData.examination_by_minute
            || bodyData.stage || bodyData.pulse_for_minute_stress
            || bodyData.diastolic_pressure_effort || bodyData.systolic_pressure_effort 
            || bodyData.percent_from_max_pulse || bodyData.max_mets || bodyData.physical_evaluation 
            || bodyData.clinical_reaction || bodyData.ecg_on_stress ) ?
            `<div class="result-details">
                <div style="color: #141414"><u>מהלך המבחן:</u></div>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    ${bodyData.examination_protocol ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">פרוטוקול הבדיקה:</td>
                            <td class="colorGray">${bodyData.examination_protocol}</td>
                        </tr>` : "" }
                    ${bodyData.examination_by_minute ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">הבדיקה נמשכה:</td>
                            <td class="colorGray">${bodyData.examination_by_minute} דקות</td>
                        </tr>` : "" }
                    ${bodyData.stage ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">שלב:</td>
                            <td class="colorGray">${bodyData.stage}</td>
                        </tr>` : "" }
                    ${bodyData.pulse_for_minute_stress ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">קצב לב:</td>
                            <td class="colorGray">${bodyData.pulse_for_minute_stress} לדקה</td>
                        </tr>` : "" }
                    ${bodyData.diastolic_pressure_effort || bodyData.systolic_pressure_effort ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">לחץ דם בשיא המאמץ:</td>
                            <td class="colorGray">${bodyData.systolic_pressure_effort} / ${bodyData.diastolic_pressure_effort}</td>
                        </tr>` : "" }
                    ${bodyData.percent_from_max_pulse ? 
                        `<tr>
                            <td class="header-result-details bold" width="19%">אחוז מהדופק המקסימלי:</td>
                            <td class="colorGray">${bodyData.percent_from_max_pulse}</td>
                        </tr>` : "" }
                    ${bodyData.max_mets ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">מס׳ MET’s מקסימלי:</td>
                            <td class="colorGray">${bodyData.max_mets}</td>
                        </tr>`: "" }
                    ${bodyData.physical_evaluation ?
                        `<tr>
                            <td class="header-result-details bold" width="19%">הערכת כושר גופני:</td>
                            <td class="colorGray">${bodyData.physical_evaluation}</td>
                        </tr>` : "" }
                        ${bodyData.clinical_reaction ?
                            `<tr>
                                <td class="header-result-details bold" width="19%">תגובה קלינית:</td>
                                <td class="colorGray">${bodyData.clinical_reaction}</td>
                            </tr>` : "" }
                            ${bodyData.ecg_on_stress ?
                                `<tr>
                                    <td class="header-result-details bold" width="19%">אקג במאמץ:</td>
                                    <td class="colorGray">${bodyData.ecg_on_stress}</td>
                                </tr>` : "" }
                </table>
            </div>` : ""}

        ${bodyData.arrhythmia_on_stress ?
            `<div class="result-details"><div class="header-result-details bold">הפרעות קצב במאמץ / התאוששות:</div>
            <div class="colorGray">${bodyData.arrhythmia_on_stress}</div></div>` : "" }
        ${bodyData.st_on_stress ?
            `<div class="result-details"><div class="header-result-details bold">מקטע ST במאמץ / התאוששות:</div>
            <div class="colorGray">${bodyData.st_on_stress}</div></div>` : "" }
        ${bodyData.stop_reason ?
            `<div class="result-details"><div class="header-result-details bold">סיבת הפסקת הבדיקה:</div>
            <div class="colorGray">${bodyData.stop_reason}</div></div>` : "" }
        ${bodyData.repeated_ecg_in_minute ?
            `<div class="result-details"><div class="header-result-details bold">אקג חוזר למצב התחלתי בתוך:</div>
            <div class="colorGray">${bodyData.repeated_ecg_in_minute} דקות</div></div>` : "" }
        ${bodyData.duke_score ?
            `<div class="result-details"><div class="header-result-details bold">DUKE SCORE:</div>
            <div class="colorGray">${bodyData.duke_score}</div><div>` : "" }
        ${bodyData.pulse_decrease_in_2_minute ?
            `<div class="result-details"><div class="header-result-details bold">קצב ירידת הדופק ב-2 דקות ראשונות לאחר סיום המאמץ:</div>
            <div class="colorGray">${bodyData.pulse_decrease_in_2_minute}</div></div>` : "" }
        ${bodyData.todo_physical_activity_recommendation ?
            `<div class="result-details"><div class="header-result-details bold">המלצות לפעילות גופנית:</div>
            <div class="colorGray">${bodyData.todo_physical_activity_recommendation}</div></div>` : "" }
        ${bodyData.summary ?
            `<div class="result-details"><div class="header-result-details bold">סיכום:</div>
            <div class="colorGray">${bodyData.summary}</div></div>` : "" } 

        ${bodyData.security_level == "0" ? 
`        <table class="security-level-table" cellpadding="10" cellspacing="0" border="0" width="100%">
            <tr>
            ${bodyData.written_date ?
                `<td width="20%" class="security-level-value colorGray">${bodyData.written_date}</td>
                <td width="10%"></td>` : "" }
            ${bodyData.signed_by ? 
                `<td width="20%" class="security-level-value colorGray">${bodyData.signed_by}</td>
                <td width="10%"></td>` : "" }
            ${bodyData.responsible_name ?
                `<td width="20%" class="security-level-value colorGray">${bodyData.responsible_name}</td>` : ""}
            </tr>
            <tr>
                ${bodyData.written_date ? 
                `<td class="security-level-header bold">נחתם בתאריך</td>
                <td></td>` : ""}
                ${bodyData.signed_by ? 
                `<td class="security-level-header bold">נחתם ע"י</td>
                <td></td>` : "" }
                ${bodyData.responsible_name ?
                `<td class="security-level-header bold">רופא/ה אחראי/ת</td>` : "" }
            </tr>
        </table>` : ""}
 </div>`
return groupsContainer;
}

module.exports.createHeader = function(headerData){
        return `<div style=" width: 100%; float: right;">
        
                    <link href="${keys.basePath}css/StyleSheet1.css" rel="stylesheet" />
                    <link href="${keys.basePath}css/fonts.css" rel="stylesheet" />                  
                    <div style="float: right;">
                        <h2 style="font-size: 16px; font-family: MediumFont; color: #141414;">תוצאת בדיקות לב (קרדיולוגיה)</h2>                       
                        <div style="width: 100%; float: right; margin-bottom: 15px;">
                            <div class="id" style ="font-size: 14px; color: #525558;float: right;">${headerData.member_name}</div>
                            <div class="id" style ="font-size: 14px; float: right; color:  #525558;">ת"ז: ${headerData.member_id}</div>
                            ${headerData.doctor_name ? `<div style ="font-size: 14px; float: right; color: #525558;">רופא מפנה: <span class="medium colorBlack">${headerData.doctor_name}</span></div>` : ``}
                        </div>
                        <h2 style="font-size: 16px; font-family: MediumFont; color: #141414;">סיכום ארגומטריה</h2>
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
        <div class="backColor">
            ${extractGroups(bodyData)}
        </div>
        <div style="display:none">
            <img  src="images/logo.svg">
        </div>
    </body>
    </html>
    `
};