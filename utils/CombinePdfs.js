const keys = require('../config/keys');
const {addPageNumberToPdf} = require('./addPageNumberToPdf');

const combinePdfs = async (pdfOne,pdfTwo,addPageNumber = false) => {
    if(pdfTwo === null || pdfTwo === "") return pdfOne;
    if(pdfOne === null || pdfOne === "") return pdfTwo;
    const { PDFDocument } = require('pdf-lib');
    const pdfOneBuffer = Buffer.from(pdfOne,'base64');
    const pdfTwoBuffer = Buffer.from(pdfTwo,'base64');
    const firstDoc = await PDFDocument.load(pdfOneBuffer);
    const secondDoc = await PDFDocument.load(pdfTwoBuffer);
    const pagesAfterCopy = await firstDoc.copyPages(secondDoc,secondDoc.getPageIndices());
    var base64;
    var pdfBytes;


    for(const page of pagesAfterCopy){
        firstDoc.addPage(page)
    }
    if (addPageNumber){
        pdfBytes = await firstDoc.save();
        const pdfWIthPageCoubt = await addPageNumberToPdf(pdfBytes);
        base64 = await Buffer.from(pdfWIthPageCoubt).toString('base64');
    }
    else{
        pdfBytes = await firstDoc.save();
        base64 = await Buffer.from(pdfBytes).toString('base64');
    }
    return base64;
}

module.exports={
    combinePdfs:combinePdfs
}