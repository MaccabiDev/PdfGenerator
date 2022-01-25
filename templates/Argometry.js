const fs = require("fs");
const Mustache = require("mustache");


module.exports.createBody = (params) => {
  try {

    const {pulse_for_minute_rest, diastolic_pressure, systolic_pressure,
          finding, ecg_on_rest, max_pulse_by_age, examination_protocol,
          examination_by_minute,stage,pulse_for_minute_stress,
          diastolic_pressure_effort, systolic_pressure_effort,
          percent_from_max_pulse,max_mets,physical_evaluation,
          clinical_reaction,ecg_on_stress, securitylevel} = params;
    
    return Mustache.render(fs.readFileSync("./templates/html/Argometry.html", "utf8"), {
      ...params,
      isDisplayClinicalAtRest: pulse_for_minute_rest || diastolic_pressure || systolic_pressure ||
      finding || ecg_on_rest || max_pulse_by_age,
      isDisplayCourseTest: examination_protocol || 
      examination_by_minute || stage || pulse_for_minute_stress || 
      diastolic_pressure_effort ||  systolic_pressure_effort || 
      percent_from_max_pulse || max_mets || physical_evaluation || 
      clinical_reaction || ecg_on_stress,
      isDisplaySecuritylevel: securitylevel === "0"
    });

  } catch (err) {
    throw `failed to createBody : ${err}`;
  }
};
