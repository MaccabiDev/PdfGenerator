const fs = require("fs");
const Mustache = require("mustache");

module.exports.createBody = (params) => {
  try {

    return Mustache.render(fs.readFileSync("./templates/html/Ecg.html", "utf8"), {
      ...params,
      isDisplaySecuritylevel: params.securitylevel === "0"
    });

  } catch (err) {
    throw `failed to createBody : ${err}`;
  }
};
