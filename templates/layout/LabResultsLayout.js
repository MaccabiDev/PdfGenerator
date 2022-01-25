const fs = require("fs");
const Mustache = require("mustache");
moment = require('moment');
const {base64EncodeFile} = require("../../utils/base64Encode")

module.exports.createFooter = () => {
    try {
  
      return fs.readFileSync("./templates/html/footer.html", "utf8");
  
    } catch (err) {
      throw `failed to createFooter : ${err}`;
    }
  };
  
  module.exports.createHeader = (params, templateName) => {
    try {
  
      return Mustache.render(fs.readFileSync("./templates/html/header.html", "utf8"), {
        ...params,
        title: getTitleByTemplateName(templateName),
        image: base64EncodeFile(`./images/logo.png`),
        date: moment().format("DD/MM/YY")
      });
  
    } catch (err) {
      throw `failed to createHeader : ${err}`;
    }
  };

  const getTitleByTemplateName = (templateName) => {
    return {
      Argometry: "סיכום ארגומטריה",
      EchoHeartDoppler: "סיכום אקו לב דופלר",
      Holter: "סיכום הולטר",
      EchoHeartEffort: "סיכום אקו לב במאמץ",
      Ecg: "סיכום אקג"
    }[templateName];
  }