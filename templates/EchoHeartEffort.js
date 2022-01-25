const fs = require("fs");
const Mustache = require("mustache");
const {base64EncodeFile} = require("../utils/base64Encode");

module.exports.createBody = (params) => {
  try {
    const { pulse_rest, pulse, pulse_max_pulse_percent, diastolic_pressure_rest, systolic_pressure_rest,
      diastolic_pressure, systolic_pressure, pressure_max_pressure_percent, clinical_reaction,
      eco_on_stress, in_leads, eco_summary_on_stress, eco_remark_on_stress, left_ventricle_functionality_after_stress,
      evidence_of_decrease_regional_function, remark, apical_ant_on_rest, apical_ant_on_rest2,
      mid_sep_on_rest, basal_sep_on_rest, securitylevel, rest,
      basal_sep_on_stress, mid_sep_on_stress, apical_ant_on_stress2, line } = params
    const isDisplayRest = rest && rest.length > 0;
    const isDisplayLine = line && line.length > 0;
    return Mustache.render(fs.readFileSync("./templates/html/EchoHeartEffort.html", "utf8"), {
      ...params,
      isDisplayPulsePerMinute: pulse_rest || pulse || pulse_max_pulse_percent,
      isDisplayBloodPressure: (diastolic_pressure_rest && systolic_pressure_rest
        || diastolic_pressure && systolic_pressure
        || pressure_max_pressure_percent),
      isDisplayResult: clinical_reaction || eco_on_stress || in_leads
        || eco_summary_on_stress || eco_remark_on_stress || left_ventricle_functionality_after_stress
        || evidence_of_decrease_regional_function || remark,
      isDisplayMobilityOfWallsAtRest: apical_ant_on_rest || apical_ant_on_rest2 || mid_sep_on_rest
        || basal_sep_on_rest,
      apicalRestImage: base64EncodeFile(`./images/apicalRest.bmp`),
      apicalRest2Image: base64EncodeFile(`./images/apicalRest2.bmp`),
      midRestImage: base64EncodeFile(`./images/midRest.bmp`),
      basalRestImage: base64EncodeFile(`./images/basalRest.bmp`),
      isDisplayFront: isDisplayRest && rest[0].front,
      isDisplayFront_sptum: isDisplayRest && rest[0].front_sptum,
      isDisplayHeart_point: isDisplayRest && rest[0].heart_point,
      isDisplayLine: isDisplayRest && rest[0].line,
      isDisplayLower: isDisplayRest && rest[0].lower,
      isDisplayRear: isDisplayRest && rest[0].rear,
      isDisplaySide: isDisplayRest && rest[0].side,
      isDisplaySptum: isDisplayRest && rest[0].sptum,

      isDisplayMobilityOfWallsAtPeakEffort: basal_sep_on_stress || mid_sep_on_stress || apical_ant_on_stress2
        || apical_ant_on_stress,

      isDisplayFront_line: isDisplayLine && line[0].front,
      isDisplayFront_sptum_line: isDisplayLine && line[0].front_sptum,
      isDisplayHeart_point_line: isDisplayLine && line[0].heart_point,
      isDisplayLine_line: isDisplayLine && line[0].line,
      isDisplayLower_line: isDisplayLine && line[0].lower,
      isDisplayRear_line: isDisplayLine && line[0].rear,
      isDisplaySide_line: isDisplayLine && line[0].side,
      isDisplaySptum_line: isDisplayLine && line[0].sptum,

      isDisplaySecuritylevel: securitylevel === "0"
    });

  } catch (err) {
    throw `failed to createBody : ${err}`;
  }
};
