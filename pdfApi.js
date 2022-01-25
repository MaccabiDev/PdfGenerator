const express = require("express");
const app = express();
const logger = require("./utils/logger");
const pdfGenerator = require("./pdfGenerator");
const pdfGeneratorV2 = require("./pdfGeneratorV2");
const formedPdfGenerator = require("./formedPdfGenerator");
const bodyParser = require("body-parser");
const uniqid = require("uniqid");
const { combinePdfs } = require("./utils/CombinePdfs");
const formedTemplates = ["DirectDebitBank"];

const port = 3002;

logger.info("application started");
app.use(bodyParser.json({ limit: "50mb" })); //creates a new limit for request
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.post("/pdf/", async (req, res) => {
  const templateName = req.body.templateName;
  let pdf;
  if (formedTemplates.includes(templateName)) {
    logger.info(`api call started on memberId: ${req.body.data.memberId}`);
    try {
      const formedPdf = await formedPdfGenerator.generateJson(
        templateName,
        req.body.data
      );
      const { payerArr, DebtArr } = req.body.body;
      const haveDebtsAndPayees = payerArr.length !== 0 || DebtArr.length !== 0;
      const pdfName = `${req.body.header}_${templateName}_${uniqid()}`;
      //payee and debts are generated with the formed file
      const payeeAndDebts = haveDebtsAndPayees
        ? await pdfGenerator.generateJson(
            pdfName,
            "DebtdetailsAndPayers",
            req.body.body,
            req.body.header
          )
        : null;
      pdf = await combinePdfs(formedPdf, payeeAndDebts, true);
      // console.log("pdf", pdf);
    } catch (err) {
      logger.error(
        `Member ID : ${req.body.data.memberId} , Template : ${templateName}  --- ${err}`
      );
      res.status(500).send("");
    }
  } else {
    const headerData = req.body.header;
    const bodyData = req.body.body;
    logger.info(`api call started on memberId: ${req.body.header.member_id}`);
    const pdfName = `${headerData.member_id}_${templateName}_${uniqid()}`;
    try {
      pdf = await pdfGenerator.generateJson(
        pdfName,
        templateName,
        bodyData,
        headerData
      );
      console.log("pdff", pdf);
      logger.info(`api call ended`);
    } catch (e) {
      console.log("generation failed");
      logger.error(
        `Member ID : ${headerData.member_id} , Template : ${templateName}  --- ${e}`
      );
      res.status(500).send();
    }
  }

  // res.writeHead(200, {
  //   'Content-Type': 'application/pdf',
  // });

  //  const download = Buffer.from(pdf.toString('utf-8'), 'base64');

  //  res.end(download);
  res.send({ base64: pdf });
});

app.post("/pdf/combine", async (req, res) => {
  const { pdfs } = req.body;
  try {
    const base64 = await pdfs.reduce(async (acc, item) => {
      const isObject = typeof item === "object";
      const isString = typeof item === "string";
      const currentAcc = await acc;
      let combinedPdf = "";
      if (isObject) {
        const { header, body, templateName } = item;
        const pdfName = `${templateName}_${uniqid()}`;
        if (formedTemplates.includes(templateName)) {
          const formedPdf = await formedPdfGenerator.generateJson(
            templateName,
            req.body.data
          );
          const { payerArr, DebtArr } = req.body.body;
          const haveDebtsAndPayees =
            payerArr.length !== 0 || DebtArr.length !== 0;
          //payee and debts are generated with the formed file
          const payeeAndDebts = haveDebtsAndPayees
            ? await pdfGenerator.generateJson(
                pdfName,
                "DebtdetailsAndPayers",
                req.body.body,
                req.body.header
              )
            : null;
          combinedPdf = await combinePdfs(formedPdf, payeeAndDebts);
        } else {
          try {
            const pdf = await pdfGenerator.generateJson(
              pdfName,
              templateName,
              body,
              header
            );
            combinedPdf = combinePdfs(currentAcc, pdf);
          } catch (e) {
            logger.error(
              `Member ID : ${header.member_id} , Template : ${templateName}  --- ${e}`
            );
            res.status(500).send();
          }
        }
      }
      if (isString) {
        if (req.body.templateName === "CreditCardConfirm") {
          combinedPdf = combinePdfs(currentAcc, item, true);
        } else {
          combinedPdf = combinePdfs(currentAcc, item);
        }
      }
      return combinedPdf;
    }, "");

    res.send({ base64 });
  } catch (e) {
    logger.error(`pdf/combine - ${e}`);
    res.status(500).send();
  }
});

app.post("/pdf/v2/", async (req, res) => {
  try {
    const { templateName, templateType, data } = req.body;

    logger.info(`api call started on memberId: ${data.member_id}`);

    const pdfName = `${data.member_id}_${templateName}_${uniqid()}`;
    logger.debug(`pdf file name: ${pdfName}`);

    const pdf = await pdfGeneratorV2.generateJson({
      pdfPath: pdfName,
      templateName: templateName,
      templateType: templateType,
      data: data,
    });

    logger.info(`api call ended`);

    // res.writeHead(200, {
    //   'Content-Type': 'application/pdf',
    // });

    // res.end(pdf);
    res.send({ base64: pdf });
  } catch (error) {
    logger.error(`Error from API: ${error}}`);
    res
      .status(500)
      .send(`Error from API: ${error}} Data from body API: ${req.body}}`);
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
