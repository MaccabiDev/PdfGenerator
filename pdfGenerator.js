const keys = require("./config/keys");
var Promise = require("bluebird");
const pdf = Promise.promisifyAll(require("html-pdf"));
const pdf2base64 = require("pdf-to-base64");
const logger = require("./utils/logger");

module.exports = {
  generateJson: async (pdfName, templateName, bodyData, headerData) => {
    console.log("generateJson started");
    var res = await createPdf(pdfName, bodyData, templateName, headerData);
    return res;
  },
};

const createPdf = async (jsonName, bodyData, templateName, headerData) => {
  try {
    var htmlCreator = require(`./templates/${templateName}`);
  } catch (err) {
    throw `failed to load template : ${err}`;
  }

  try {
    var header = htmlCreator.createHeader(headerData);
    var footer = htmlCreator.createFooter(bodyData);
  } catch (err) {
    throw `failed to create header/footer : ${err}`;
  }

  const basePath = keys.basePath;
  console.log(basePath);
  var options = {
    format: "A4",
    timeout: "100000",
    base: basePath,
    fitToPage: false,
    header: {
      height: headerData.is_partial
        ? "100px"
        : templateName === "CreditCardConfirm"
        ? "165px"
        : "85px",
      contents: header,
    },
    orientation: templateName === "Graph" ? "landscape" : "portrait",
    footer: {
      height: "35px",
      contents: footer,
    },
    border: {
      top: "10px", // default is 0, units: mm, cm, in, px
      right: "10px",
      bottom: "0",
      left: "10px",
    },
    // "phantomPath":"/app/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"
    // "margin": { 'top': '-300mm', 'left': '5mm', 'bottom': '-5mm', 'right': '5mm' }
  };

  var res = await createPdfByHtmlString(
    options,
    jsonName,
    bodyData,
    htmlCreator
  );
  return res;
};

// --------------------------------------------------------------//
const createPdfByHtmlString = async (
  options,
  jsonName,
  bodyData,
  htmlCreator
) => {
  console.log("createPdfByHtmlString started");
  try {
    var createdHtml = await htmlCreator.createHtml(bodyData);
  } catch (err) {
    logger.error(`failed to create body : ${err}`);
  }
  var createResult = await pdf.create(createdHtml, options);
  // console.log("createResult", createResult);
  var res;
  if (keys.createLocalPdf) {
    let pdfToFile = Promise.promisify(createResult.__proto__.toFile, {
      context: createResult,
    }); // makes the createResult.toFile() return a promise instead of callback ,
    const src = new URL(keys.pdfAbsolutePath);

    await pdfToFile(src + jsonName + ".pdf").then(
      (x) => {
        console.log(
          "pdf generated in this location: " + src + jsonName + ".pdf"
        );
        pdf2base64(`${keys.pdfAbsolutePath}${jsonName}.pdf`).then(
          (response) => {
            res = response;
          },
          () => {
            throw `pdf TO base 64 failure : ${err}`;
          }
        );
      },
      (err) => {
        throw `createPdfByHtmlString failure : ${err}`;
      }
    );
  } else {
    //let pdfToBase64 = Promise.promisify(createResult.__proto__.toBuffer, {context: createResult});
    console.log("promisifying");
    let pdfToBase64 = () => {
      return new Promise((resolve, reject) => {
        createResult.toBuffer((err, buffer) => {
          if (err) {
            return reject(err);
          } else {
            resolve(buffer);
          }
        });
      });
    };
    console.log("promisified");
    await pdfToBase64().then(
      (response) => {
        res = response.toString("base64");
      },
      () => {
        throw `pdf TO base 64 failure : ${err}`;
      }
    );
  }
  return res;
};
