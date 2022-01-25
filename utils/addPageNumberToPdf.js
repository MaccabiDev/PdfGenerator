const { Console } = require('console');

const addPageNumberToPdf = async (pdfdata) => {
    const { PDFDocument, rgb} = require('pdf-lib');
    const fontkit = require('@pdf-lib/fontkit');
    const fs = require('fs');
    try 
    {
        const font = fs.readFileSync('fonts/heebo-v2-hebrew-regular.ttf');
        var content = await PDFDocument.load(pdfdata);
        content.registerFontkit(fontkit);
        const loadFont =await content.embedFont(font);
        const pages = await content.getPages();
        var pageCount = pages.length;
  
       
              for (let i = 0 ; i < pageCount ; i ++) {
                  pages[i].drawText(`${i + 1} מתוך ${pageCount} `, {
                  x:  pages[i].getWidth() / 2 - 45,
                  y: 10,
                  size: 15,
                  font: loadFont,
                  color: rgb(0, 0, 0)
                });
              }
            
           
              pdfBytes = await content.save()
              return pdfBytes;

    }

     catch (e) 
     {
        logger.error(`pdf/addPageNumber - ${e}`);
        console.log(e);
     } 
}

module.exports={
    addPageNumberToPdf:addPageNumberToPdf
}