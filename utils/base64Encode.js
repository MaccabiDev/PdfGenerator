const fs = require("fs");

const base64EncodeFile = (file) => {
  var bitmap = fs.readFileSync(file);
  return bitmap.toString("base64");
};

module.exports={
  base64EncodeFile: base64EncodeFile
}