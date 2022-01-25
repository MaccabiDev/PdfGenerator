const fs = require("fs");
const Mustache = require("mustache");

module.exports.createBody = (params) => {
  try {

    const {findings_according_complaints} = params;
    const isDisplayFindingArr = findings_according_complaints && findings_according_complaints.length > 0
    return Mustache.render(fs.readFileSync("./templates/html/Holter.html", "utf8"), {
      ...params,
      isDisplayComplaint: isDisplayFindingArr && findings_according_complaints[0].complaint,
      isDisplayFinding: isDisplayFindingArr && findings_according_complaints[0].finding,
      isDisplayHour: isDisplayFindingArr && findings_according_complaints[0].hour,

      isDisplaySecuritylevel: params.securitylevel === "0"
    });

  } catch (err) {
    throw `failed to createBody : ${err}`;
  }
};
