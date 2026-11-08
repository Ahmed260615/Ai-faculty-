/** DEMONSTRATION placeholders. Replace with medically reviewed content from the video service. */
export const VIDEO_CATEGORIES = ['Cardiac Emergencies', 'Respiratory Emergencies', 'Injuries and Trauma', 'Medical Emergencies', 'First Aid', 'Preventive Procedures'];
const PH = {1: "lab-medical-2", 2: "procedure", 3: "respirator", 4: "glovebox-2", 5: "eva-suit", 6: "eva", 7: "lab-medical", 8: "crew-lab", 9: "lab-research", 10: "glovebox", 11: "quarters-wide", 12: "sensor"};
const v = (id, category, title, description, duration, hue) => ({ id, category, title, description, duration, hue, photo: PH[id] });
export const VIDEOS = [
  v(1, 'Cardiac Emergencies', 'Recognising cardiac emergencies', 'Placeholder overview of cardiac emergency recognition.', '4:20', 0),
  v(2, 'Cardiac Emergencies', 'Using the onboard defibrillator', 'Placeholder walkthrough of the onboard AED unit.', '6:05', 8),
  v(3, 'Respiratory Emergencies', 'Respiratory distress in a closed cabin', 'Placeholder overview of respiratory distress response.', '5:10', 190),
  v(4, 'Respiratory Emergencies', 'Oxygen supply and masks', 'Placeholder demonstration of oxygen equipment.', '3:45', 200),
  v(5, 'Injuries and Trauma', 'Managing cuts and bleeding', 'Placeholder first response to injuries.', '5:30', 20),
  v(6, 'Injuries and Trauma', 'Suspected fracture or sprain', 'Placeholder overview of musculoskeletal injuries.', '4:50', 30),
  v(7, 'Medical Emergencies', 'Allergic reaction response', 'Placeholder overview of allergic reaction response.', '3:30', 280),
  v(8, 'Medical Emergencies', 'Contacting ground medical support', 'Placeholder for communication with mission control medical.', '2:40', 250),
  v(9, 'First Aid', 'First aid kit orientation', 'Placeholder tour of the medical kit contents and locations.', '7:15', 150),
  v(10, 'First Aid', 'Basic life support refresher', 'Placeholder basic life support refresher.', '8:00', 160),
  v(11, 'Preventive Procedures', 'Daily health-check routine', 'Placeholder for preventive health routines.', '3:10', 210),
  v(12, 'Preventive Procedures', 'Cabin air quality checks', 'Placeholder for environmental safety checks.', '4:05', 175),
];
