/**
 * Photography: NASA image library (public domain — NASA media usage guidelines).
 * `id` is the NASA image ID so every picture can be traced (see docs/IMAGE_CREDITS.md).
 */
const p = (id, alt, caption, pos = 'center') => ({ src: null, id, alt, caption, pos });
const RAW = {
  'sun-flare': p('GSFC_20171208_Archive_e000963', 'The Sun with an erupting solar flare, imaged in extreme ultraviolet', 'Solar flare imaged by NASA’s Solar Dynamics Observatory'),
  aurora: p('iss064e024075', 'Green and red aurora glowing above Earth’s horizon at night', 'Aurora over Earth’s limb, seen from the ISS'),
  'earth-limb': p('iss071e364425', 'Earth’s thin atmosphere glowing at the horizon beside a station solar array', 'Earth’s atmosphere at the limb, seen from the ISS'),
  'cupola-crew': p('iss074e0604606', 'Two crew members looking up at Earth through the Cupola windows', 'Crew members at the Cupola windows'),
  'cupola-float': p('iss072e978930', 'Astronaut floating inside the Cupola with hair drifting upward', 'Floating in the Cupola', 'center 20%'),
  eva: p('iss053e079613', 'Space station solar array and truss above Earth with astronauts working on a spacewalk', 'Spacewalk outside the ISS'),
  'eva-suit': p('iss038e020263', 'Astronaut in a spacesuit floating in front of Earth’s clouds', 'Spacesuit life support on a spacewalk'),
  respirator: p('iss055e032444', 'Crew member wearing a respirator mask and gloves working at station equipment', 'Crew member wearing a respirator mask aboard the ISS'),
  lettuce: p('iss040e009125', 'Astronaut harvesting red romaine lettuce grown on the station', 'Harvesting lettuce grown on the ISS'),
  meal: p('s127e007464', 'Crew members gathered around a floating table sharing a meal', 'Crew sharing a meal aboard the ISS'),
  quarters: p('iss026e012158', 'Astronaut smiling from inside a private crew sleeping compartment', 'A private crew sleeping compartment', 'center 30%'),
  'quarters-wide': p('iss054e022260', 'Sleeping bag and personal items inside a crew quarters compartment', 'Inside a crew quarters compartment'),
  'ared-ground': p('jsc2018e083567', 'Astronaut performing an overhead press on the Advanced Resistive Exercise Device', 'Training on the Advanced Resistive Exercise Device (ARED)', 'center 25%'),
  'ared-squat': p('jsc2018e087584', 'Astronaut doing a barbell squat on the ARED trainer', 'Squat training on the ARED', 'center 30%'),
  'ared-lift': p('jsc2018e087212', 'Two people at the ARED, one performing a bent-over lift', 'ARED lift training'),
  'ared-iss': p('iss030e148403', 'Astronaut exercising on the ARED aboard the space station', 'Exercising on the ARED aboard the ISS'),
  'ared-band': p('iss030e033011', 'Astronaut exercising on the ARED with arms extended', 'Resistance exercise aboard the ISS', 'center 40%'),
  'ared-upper': p('iss030e033043', 'Astronaut performing an upper-body movement on the ARED', 'Upper-body resistance exercise', 'center 35%'),
  treadmill: p('iss024e007998', 'Astronaut running on the treadmill with a harness in the station', 'Treadmill running with a harness aboard the ISS'),
  'treadmill-2': p('iss036e005384', 'Astronaut running on the station treadmill, secured with a harness', 'Endurance running on the ISS treadmill'),
  cycle: p('iss030e032768', 'Astronaut lying back while cycling on the station ergometer', 'Cycle ergometer exercise on the ISS'),
  'float-1': p('iss031e144497', 'Astronaut stretched out horizontally while exercising in microgravity', 'Exercising in microgravity'),
  'float-2': p('iss031e144502', 'Astronaut exercising in a node of the space station', 'Stretching and conditioning in orbit'),
  tvis: p('iss014e12154', 'Astronaut standing in harness straps on the treadmill', 'Harness fitting for treadmill exercise', 'center 30%'),
  'tvis-2': p('iss012e15158', 'Astronaut balancing in treadmill harness straps', 'Balance and coordination in orbit', 'center 30%'),
  glovebox: p('iss068e018995', 'Crew member working with a sealed experiment container', 'Crew member conducting an experiment'),
  'glovebox-2': p('iss074e0591327', 'Crew member with a headset working inside a science glovebox', 'Working in a science glovebox'),
  'lab-research': p('iss071e414653', 'Crew member smiling at a laboratory work area', 'Research work aboard the ISS'),
  'lab-medical': p('iss073e0078566', 'Two crew members working together at a laboratory bench', 'Crew members at a laboratory bench'),
  'lab-medical-2': p('iss030e257690', 'Crew member operating laboratory equipment on the station', 'Crew member operating laboratory equipment'),
  procedure: p('iss040e007113', 'Two crew members working together on a procedure', 'Crew members performing a procedure'),
  sensor: p('iss051e051544', 'Crew member holding up a small electronic device', 'Crew member with a handheld device'),
  'crew-lab': p('iss072e861307', 'Crew member working in a station module', 'Working inside a station module'),
  'plants-iss': p('iss055e070862', 'Crew member wearing gloves near plant-growth equipment', 'Plant-growth equipment on the ISS'),
  'crew-group': p('iss070e002869', 'Four crew members floating together, smiling', 'Crew together aboard the ISS'),
};
export const PHOTOS = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, { ...v, src: `/images/stock/${k}.jpg` }]));
