const fs = require("fs");
const Mustache = require("mustache");
const {base64EncodeFile} = require("../utils/base64Encode");

module.exports.createBody = (params) => {
  try {
    const { aorta_is_up, aorta_root, left_atrium ,left_atrium_area, left_chamber_diameter_on_systole,
      left_chamber_diameter_on_diastole, ventricular_septal_proximal_thickness, ventricular_septal_thickness,
      back_wall_thickness, left_chamber, extraction_channel_left_chamber, left_apical_ant1, left_apical_ant2,
      left_mid_sep, left_basal_sep, mitral_valve_structure, mitral_valve_doppler, jet_area, pisa, jet_la_ratio,
      vneq, cw, tvi, regurgitant_flow_rate, effective_regurgitant_orifice, regurgitant_volume,
      mitral_vena_contracta, pulmonary_venous_flow, systolic_diameter, aortic_regurgitation, diastolic_diameter,
      systolic_flow, dt_per32mm_hg, dp_dt, e_wave, a_wave, e_wave_a_wave_ratio, deceleration,
      ivrt, ivct, mitral_tvi, diastolic_function, aortic_valve_structure, aortic_valve_colored_doppler,
      aortic_max_pressure_gradient, aortic_avg_pressure_gradient, aortic_outlet_diameter,
      left_ventricular_out_flow_tract ,vti_valve ,aortic_valve_area, trivial_regurgitatio_structure,
      trivial_regurgitatio_colored_doppler, systolic_gradient, estimated_pressure_in_rt_atrium,
      estimated_pulmonary_artery_pressure, pulmonary_artery_pressure, inferior_vena_cava,
      pulmonary_valve, max_systolic_gradient, avg_systolic_gradient, extra_cardiac_finding,
      cardiovascular_data, securitylevel } = params

    return Mustache.render(fs.readFileSync("./templates/html/EchoHeartDoppler.html", "utf8"), {
      ...params,
      isDisplayMeasurements: aorta_is_up || aorta_root || left_atrium || left_atrium_area || left_chamber_diameter_on_systole
      || left_chamber_diameter_on_diastole || ventricular_septal_proximal_thickness || ventricular_septal_thickness
      || back_wall_thickness,
      isDisplayLeftVentricularSystolic: left_chamber || extraction_channel_left_chamber,
      isDisplayEchoHeartDopplerSummary: left_apical_ant1 || left_apical_ant2 || left_mid_sep
      || left_basal_sep,
      apicalRestImage: base64EncodeFile(`./images/apicalRest.bmp`),
      apicalRest2Image: base64EncodeFile(`./images/apicalRest2.bmp`),
      midRestImage: base64EncodeFile(`./images/midRest.bmp`),
      basalRestImage: base64EncodeFile(`./images/basalRest.bmp`),
      isDisplayMitralValve: mitral_valve_structure || mitral_valve_doppler,
      isDisplayExtendedColoredDoppler: jet_area || pisa || jet_la_ratio || vneq || cw || tvi || regurgitant_flow_rate || effective_regurgitant_orifice ||
      regurgitant_volume || mitral_vena_contracta || pulmonary_venous_flow || systolic_diameter || aortic_regurgitation || 
      diastolic_diameter || systolic_flow || dt_per32mm_hg || dp_dt,
      isDisplayMitralFlow: e_wave || a_wave || e_wave_a_wave_ratio || deceleration,
      isDisplayExtendedDiastolicEvaluation: ivrt || ivct || mitral_tvi || diastolic_function,
      isDisplayAorticValve: aortic_valve_structure || aortic_valve_colored_doppler,
      isDisplayAorticFlow: aortic_max_pressure_gradient || aortic_avg_pressure_gradient || aortic_outlet_diameter ||
      left_ventricular_out_flow_tract  ||vti_valve  ||aortic_valve_area,
      isDisplayTricuspidValve: trivial_regurgitatio_structure || trivial_regurgitatio_colored_doppler 
      || systolic_gradient || estimated_pressure_in_rt_atrium || estimated_pulmonary_artery_pressure 
      || pulmonary_artery_pressure || inferior_vena_cava,
      isDisplayPulmonaryValve: pulmonary_valve || max_systolic_gradient || avg_systolic_gradient 
      || extra_cardiac_finding || cardiovascular_data,
      isDisplaySecuritylevel: securitylevel === "0"
    });

  } catch (err) {
    throw `failed to createBody : ${err}`;
  }
};
