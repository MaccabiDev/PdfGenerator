const keys = require("./config/keys");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const logger = require("./utils/logger");

module.exports = {
  generateJson: async (createPdfParams) => {
    logger.debug("generateJson started");
    const res = await createPdf(createPdfParams);

    return res;
  },
};

const createPdf = async ({ pdfPath, templateName, templateType, data }) => {
  try {
    const { createBody } = require(`./templates/${templateName}`);
    const {
      createHeader,
      createFooter,
    } = require(`./templates/layout/${templateType}Layout`);

    const html = createBody(data);

    const options = {
      printBackground: true,
      format: "A4",
      timeout: "100000",
      path: pdfPath,
      displayHeaderFooter: true,
      headerTemplate: createHeader(data, templateName),
      footerTemplate: createFooter(),
      margin: { top: "120px", right: "10px", left: "10px", bottom: "60px" },
    };

    const browser = await puppeteer.launch({
      executablePath: `${path.resolve(__dirname)}\\chrome\\chrome.exe`,
      args: ["--no-sandbox", "--font-render-hinting=none"],
      headless: true,
    });

    var page = await browser.newPage();
    logger.debug("browser newPage");

    await page.setContent(html, { waitUntil: "networkidle2" });

    await page.addStyleTag({ path: `./css/${templateType}.css` });

    if (fs.existsSync(`./css/${templateName}.css`)) {
      await page.addStyleTag({ path: `./css/${templateName}.css` });
    }

    await page.evaluateHandle("document.fonts.ready");

    const buffer = await page.pdf(options);

    await browser.close();

    //delete the file created for generate pdf
    fs.unlinkSync(pdfPath);

    const base64 = buffer.toString("base64");
    logger.debug(`data:application/pdf;base64,${base64}`);

    //return pdf file
    // return buffer;

    //return base64
    return base64;
  } catch (err) {
    logger.error(`failed to create pdf : ${err}`);
  }
};
