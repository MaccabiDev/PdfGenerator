
const moment = require('moment');
const keys = require('../config/keys');
const fieldsName = {
    DAY:'יום',
    MONTH:"חודש",
    YEAR:"שנה",
    BANK_NUMBER_HEADER:'בנק',
    BRANCH_NUMNER_HEADER:"סניף",
    BANK_NUMBER_LEFT:"בנק - 3 ספרות",
    BRANCH_NUMBER_LEFT:"סניף - 3 ספרות",
    ACCOUNT_NUMBER_LEFT:'מספר חשבון בנק - 10 ספרות',
    REFERENCE:"אסמכתא",
    AUTHORIZATION:"Group1",
    MAX_AMOUNT:"סכום לתקרת חיוב",
    MAX_DATE_VALID:"מועד פקיעה",
    NAME_OF_THE_ACCOUNT_OWNER:"שם בעלי החשבון",
    ID_NUMBER:"מספר זהות",
    CLIENT_SIGNATURE:"חתימת הלקוחות",
    CHECK_SIGNATURE:"סימון חתימה",
    SELECT_MAX_AMOUNT:"תקרת סכום החיוב",
    SELECT_MAX_DATE:"מועד פקיעת תוקף ההרשאה"
};
const radioOptions = {
    GENERAL_AUTHORIZATION:"Choice1",
    MAX_AMOUNT_VALIDATE_DATE:"Choice2",
}

const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');


const fillPdf = async (data) => {
    const {
        bankNumber,
        branchNumber,
        accountNumber,
        reference,
        maxAmount,
        maxDateValid,
        memberId,
        accountOwner,
        memberFirstName,
        memberLastName,
    } = data;
    const pdfdata = fs.readFileSync('templates/formedPDF/DirectDebitBank.pdf');
    const font = fs.readFileSync('fonts/heebo-v2-hebrew-regular.ttf');
    
    const pdfDoc = await PDFDocument.load(pdfdata);
    pdfDoc.registerFontkit(fontkit);
    const loadFont = await pdfDoc.embedFont(font);
    
    const form = pdfDoc.getForm();
    
    form.getTextField(fieldsName.DAY).setText(moment().format("DD"));
    form.getTextField(fieldsName.MONTH).setText(moment().format("MM"));
    form.getTextField(fieldsName.YEAR).setText(moment().format("YYYY"));
    form.getTextField(fieldsName.BANK_NUMBER_HEADER).setText(bankNumber);
    form.getTextField(fieldsName.BRANCH_NUMNER_HEADER).setText(branchNumber);
    form.getTextField(fieldsName.BANK_NUMBER_LEFT).setText(bankNumber);
    form.getTextField(fieldsName.BRANCH_NUMBER_LEFT).setText(branchNumber);
    form.getTextField(fieldsName.ACCOUNT_NUMBER_LEFT).setText(accountNumber);
    form.getTextField(fieldsName.REFERENCE).setText(reference);
    form.getTextField(fieldsName.NAME_OF_THE_ACCOUNT_OWNER).setText(accountOwner);
    form.getTextField(fieldsName.ID_NUMBER).setText(memberId);
    form.getTextField(fieldsName.CLIENT_SIGNATURE).setText(`${memberFirstName} ${memberLastName}`);
    form.getCheckBox(fieldsName.CHECK_SIGNATURE).check();
    if(maxAmount > 0 || (!!maxDateValid && maxDateValid!== "")){
        form.getRadioGroup(fieldsName.AUTHORIZATION).select(radioOptions.MAX_AMOUNT_VALIDATE_DATE);

        if(maxAmount > 0){
            form.getTextField(fieldsName.MAX_AMOUNT).setText(maxAmount);
            form.getCheckBox(fieldsName.SELECT_MAX_AMOUNT).check();
        }
        if(!!maxDateValid && maxDateValid!== ""){
            form.getTextField(fieldsName.MAX_DATE_VALID).setText(maxDateValid);
            form.getCheckBox(fieldsName.SELECT_MAX_DATE).check();
        }
    }else{
        form.getRadioGroup(fieldsName.AUTHORIZATION).select(radioOptions.GENERAL_AUTHORIZATION);
    }

    form.getFields().forEach(field => field.enableReadOnly());

    form.updateFieldAppearances(loadFont)

    const pdfBytes = await pdfDoc.save();
    const base64 = await Buffer.from(pdfBytes).toString('base64');
    return base64;
}

module.exports={
    fillPdf:fillPdf
}