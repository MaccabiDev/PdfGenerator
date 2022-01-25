
const createPdf= async(templateName,data)=>{
  try{
    var formedPdf = require(`./templates/${templateName}`);
  }
  catch(err){
    throw(`failed to load template : ${err}`);
  }
  var res = await formedPdf.fillPdf(data);
  return res;
}


module.exports = {
  generateJson : async(templateName,data)=>{
    var res = await createPdf(templateName,data)
    return res;
  },
}