import React, { useState } from 'react';
import { 
  Zap, Compass, Activity, Play, RotateCcw, Sparkles, BookOpen, 
  HelpCircle, CheckCircle2, Sliders, RefreshCw, Calculator, Flame, 
  Award, Volume2, VolumeX, ArrowRight, Eye, Beaker, Atom, TrendingUp, Info,
  Dna, Leaf, Cpu, Sun, Orbit, Binary, Radio, Gauge, BatteryCharging, Droplets,
  Layers, ShieldCheck, Microscope, Wind, Cable, ToggleLeft, ToggleRight, Check, X,
  Thermometer, Lightbulb, Satellite, ShieldAlert
} from 'lucide-react';
import { speakText, stopAllSpeech } from '../utils/speechUtils';
import { InteractivePeriodicTable } from './InteractivePeriodicTable';

interface ScienceFormulaLabViewProps {
  showToast: (msg: string, type: 'success' | 'error' | 'info' | 'warn') => void;
  language: 'hindi' | 'english';
}

export type LabCategory = 'all' | 'chemistry' | 'biology' | 'electronics' | 'physics' | 'space' | 'math-ai';

export const ScienceFormulaLabView: React.FC<ScienceFormulaLabViewProps> = ({ showToast, language }) => {
  const isHindi = language === 'hindi';
  const [selectedCategory, setSelectedCategory] = useState<LabCategory>('all');
  const [activeTab, setActiveTab] = useState<
    | 'periodic-table'
    | 'circuits' 
    | 'medical-cardio' 
    | 'optics' 
    | 'pendulum' 
    | 'chemistry-ph' 
    | 'projectile' 
    | 'trig' 
    | 'finance'
    | 'biology-photosynthesis'
    | 'biology-genetics'
    | 'biology-osmosis'
    | 'electronics-logic-gates'
    | 'electronics-transformer'
    | 'engineering-solar'
    | 'space-orbital'
    | 'custom-solver'
  >('periodic-table');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // -------------------------------------------------------------
  // LAB 1: OHM'S LAW & ELECTRIC CIRCUITS
  // -------------------------------------------------------------
  const [voltage, setVoltage] = useState<number>(12); // V
  const [resistance, setResistance] = useState<number>(10); // Ohms
  const current = (voltage / resistance).toFixed(2); // I = V / R
  const power = (voltage * (voltage / resistance)).toFixed(2); // P = V * I

  const getCircuitExplanation = () => {
    if (isHindi) {
      return `【प्रैक्टिकल विश्लेषण】: 
• वोल्टेज (V = ${voltage}V) बढ़ाने का मतलब है सर्किट में बैटरी का धक्का (Electrical Pressure) बढ़ाना। इससे इलेक्ट्रॉनों की गति तेज होती है और धारा (I = ${current}A) बढ़ती है।
• प्रतिरोध (R = ${resistance}Ω) बढ़ाने का मतलब है तार में रुकावट पैदा करना। जब R बढ़ता है तो धारा घटती है।
• वर्तमान शक्ति (Power P = ${power}W): बल्ब की चमक शक्ति के सीधे समानुपाती है। ${parseFloat(power) > 50 ? 'बल्ब बहुत तेज और गर्म जल रहा है!' : 'बल्ब सामान्य मंद गति से जल रहा है।'}`;
    } else {
      return `[Practical Analysis]:
• Increasing Voltage (V = ${voltage}V) increases electrical pressure, pushing more electrons per second through the circuit (Current I = ${current}A).
• Increasing Resistance (R = ${resistance}Ω) obstructs electron flow, decreasing current.
• Total Power Dissipation is ${power} Watts (P = V × I).`;
    }
  };

  // -------------------------------------------------------------
  // LAB 2: MEDICAL PHYSIOLOGY & CARDIAC CYCLE
  // -------------------------------------------------------------
  const [heartRate, setHeartRate] = useState<number>(72); // BPM
  const [strokeVolume, setStrokeVolume] = useState<number>(70); // mL/beat
  const [systolicBP, setSystolicBP] = useState<number>(120); // mmHg
  const [diastolicBP, setDiastolicBP] = useState<number>(80); // mmHg

  const cardiacOutput = ((heartRate * strokeVolume) / 1000).toFixed(2); // L/min
  const meanArterialPressure = (diastolicBP + (systolicBP - diastolicBP) / 3).toFixed(1);
  const pulsePressure = systolicBP - diastolicBP;

  const getCardioExplanation = () => {
    if (isHindi) {
      return `【हार्ट व बीपी प्रैक्टिकल विश्लेषण】:
• हार्ट रेट (${heartRate} BPM) व स्ट्रोक वॉल्यूम (${strokeVolume} mL): दिल 1 मिनट में शरीर को ${cardiacOutput} लीटर शुद्ध रक्त पंप कर रहा है। (सामान्य सीमा: 4.5 से 6.0 L/min)।
• ब्लड प्रेशर (${systolicBP}/${diastolicBP} mmHg): सिस्टोलिक (धड़कन के समय का दबाव) और डायस्टोलिक (आराम के समय का दबाव)।
• पल्स प्रेशर (${pulsePressure} mmHg): धमनियों की लोच (Arterial Elasticity) दर्शाता है।
• MAP (${meanArterialPressure} mmHg): मस्तिष्क व गुर्दे (Kidneys) तक रक्त पहुँचाने वाला निरंतर परफ्यूजन दबाव है।`;
    } else {
      return `[Cardiac Hemodynamics]:
• Cardiac Output is ${cardiacOutput} L/min (CO = HR × SV). Normal resting range is 4.5 - 6.0 L/min.
• Blood Pressure is ${systolicBP}/${diastolicBP} mmHg. Pulse Pressure is ${pulsePressure} mmHg.
• Mean Arterial Pressure (MAP) is ${meanArterialPressure} mmHg, which drives organ perfusion.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 3: OPTICS & CONVEX LENS
  // -------------------------------------------------------------
  const [focalLength, setFocalLength] = useState<number>(20); // f in cm
  const [objectDistance, setObjectDistance] = useState<number>(40); // u in cm
  const uSign = -objectDistance;
  const vCalculated = (focalLength * uSign) / (uSign + focalLength);
  const vDisplay = isFinite(vCalculated) ? vCalculated.toFixed(1) : '∞';
  const magnification = isFinite(vCalculated) ? (vCalculated / uSign).toFixed(2) : '∞';

  const getOpticsExplanation = () => {
    const isVirtual = objectDistance < focalLength;
    if (isHindi) {
      if (isVirtual) {
        return `【मैग्निफाइंग ग्लास स्थिति (u < f)】:
• वस्तु (${objectDistance}cm) फोकस (${focalLength}cm) के अंदर है!
• किरणें दूसरी तरफ नहीं मिलतीं। लेंस के उसी तरफ आभासी (Virtual), सीधा (Erect) और ${Math.abs(parseFloat(magnification))}x गुना बड़ा प्रतिबिंब बनता है। सूक्ष्मदर्शी व आवर्धक लेंस इसी सिद्धांत पर काम करते हैं।`;
      } else if (objectDistance === focalLength * 2) {
        return `【2F स्थिति (u = 2f = ${focalLength * 2}cm)】:
• वस्तु 2F पर रखी है। प्रतिबिंब ठीक 2F पर वास्तविक, उल्टा और वस्तु के ठीक बराबर (1.0x) बनता है (फोटोकॉपी मशीन सिद्धांत)।`;
      } else if (objectDistance > focalLength * 2) {
        return `【कैमरा स्थिति (u > 2f)】:
• वस्तु 2F से दूर है। प्रतिबिंब F और 2F के बीच वास्तविक, उल्टा और छोटा (${Math.abs(parseFloat(magnification))}x) बनता है (आँख और कैमरा लेंस)।`;
      } else {
        return `【प्रोजेक्टर स्थिति (F < u < 2F)】:
• वस्तु F और 2F के बीच है। प्रतिबिंब 2F से परे वास्तविक, उल्टा और बड़ा बनता है (सिनेमा प्रोजेक्टर)।`;
      }
    } else {
      return `[Optics Ray Tracking]: Object Distance u = ${objectDistance}cm, Focal Length f = ${focalLength}cm. Image formed at v = ${vDisplay}cm with magnification m = ${magnification}x. ${isVirtual ? 'Image is Virtual, Erect & Enlarged.' : 'Image is Real & Inverted.'}`;
    }
  };

  // -------------------------------------------------------------
  // LAB 4: SIMPLE PENDULUM & GRAVITY
  // -------------------------------------------------------------
  const [pendulumLength, setPendulumLength] = useState<number>(1.0); // L in meters
  const [gravity, setGravity] = useState<number>(9.8); // g in m/s^2
  const timePeriod = (2 * Math.PI * Math.sqrt(pendulumLength / gravity)).toFixed(2);
  const frequency = (1 / parseFloat(timePeriod)).toFixed(2);

  const getPendulumExplanation = () => {
    if (isHindi) {
      return `【पेंडुलम आवर्तकाल (T = 2π√(L/g))】:
• लंबाई (L = ${pendulumLength}m) बढ़ाने से आवर्तकाल (T = ${timePeriod}s) बढ़ता है क्योंकि पेंडुलम को लंबा चाप (Arc) तय करना पड़ता है।
• गुरुत्वाकर्षण (g = ${gravity} m/s²): गुरुत्वाकर्षण बढ़ने से पेंडुलम तेजी से नीचे खिंचता है जिससे दोलन तेज हो जाता है।
• निष्कर्ष: पेंडुलम का आवर्तकाल बॉब (Bob) के द्रव्यमान पर बिल्कुल निर्भर नहीं करता (केवल L और g पर)।`;
    } else {
      return `[Pendulum Dynamics (T = 2π√(L/g))]:
• Length L = ${pendulumLength}m, Gravity g = ${gravity} m/s².
• Time Period T = ${timePeriod} seconds (1 complete oscillation).
• Frequency f = ${frequency} Hz.
• Note: Period depends strictly on length and gravity, NOT on bob mass.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 5: CHEMISTRY ACID-BASE TITRATION & pH SCALE
  // -------------------------------------------------------------
  const [acidStrength, setAcidStrength] = useState<number>(0.1); // Molar
  const [baseVolumeAdded, setBaseVolumeAdded] = useState<number>(25); // mL of NaOH added to 25mL acid
  
  // Calculate dynamic pH based on titration progress
  const acidMoles = 25 * acidStrength; // 25mL acid
  const baseMoles = baseVolumeAdded * 0.1; // 0.1M base
  let calculatedPh = 7.0;
  if (baseMoles < acidMoles) {
    const unreactedAcid = (acidMoles - baseMoles) / (25 + baseVolumeAdded);
    calculatedPh = Math.max(1.0, -Math.log10(Math.max(unreactedAcid, 0.0000001)));
  } else if (baseMoles > acidMoles) {
    const excessBase = (baseMoles - acidMoles) / (25 + baseVolumeAdded);
    const pOH = Math.max(0.5, -Math.log10(Math.max(excessBase, 0.0000001)));
    calculatedPh = Math.min(14.0, 14 - pOH);
  } else {
    calculatedPh = 7.0; // Equivalence point
  }
  const phDisplay = calculatedPh.toFixed(2);

  const getChemistryExplanation = () => {
    if (isHindi) {
      if (calculatedPh < 6.5) {
        return `【अम्लीय माध्यम (Acidic Solution pH = ${phDisplay})】:
• बीकर में $[H^+]$ आयनों की सांद्रता $[OH^-]$ से अधिक है।
• लिटमस पेपर लाल रहेगा और फिनॉल्फथेलिन (Phenolphthalein) रंगहीन रहेगा।`;
      } else if (calculatedPh >= 6.5 && calculatedPh <= 7.5) {
        return `【उदासीनीकरण बिंदु (Equivalence Neutral Point pH = ${phDisplay})】:
• एसिड ($HCl$) और बेस ($NaOH$) ने मिलकर लवण ($NaCl$) और जल ($H_2O$) बना लिया है ($H^+ + OH^- \rightarrow H_2O$)।
• फिनॉल्फथेलिन इस बिंदु पर हल्का गुलाबी (Faint Pink) रंग दिखाना शुरू करता है।`;
      } else {
        return `【क्षारीय माध्यम (Basic Solution pH = ${phDisplay})】:
• अतिरिक्त बेस मिलाने से विलयन में $[OH^-]$ हाइड्रॉक्साइड आयन बढ़ गए हैं।
• फिनॉल्फथेलिन गहरा गुलाबी/मैजेंटा रंग दिखाता है और लाल लिटमस नीला हो जाता है।`;
      }
    } else {
      return `[Titration & pH Analysis]: pH is ${phDisplay}. Solution is ${calculatedPh < 7 ? 'Acidic ([H+] > [OH-])' : calculatedPh > 7 ? 'Basic ([OH-] > [H+])' : 'Neutral (Salt + Water)'}.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 6: PROJECTILE MOTION (प्रक्षेप्य गति)
  // -------------------------------------------------------------
  const [launchVelocity, setLaunchVelocity] = useState<number>(30); // m/s
  const [launchAngle, setLaunchAngle] = useState<number>(45); // degrees
  const rad = (launchAngle * Math.PI) / 180;
  const gProj = 9.8;
  const maxHeight = ((launchVelocity * launchVelocity * Math.sin(rad) * Math.sin(rad)) / (2 * gProj)).toFixed(1);
  const maxRange = ((launchVelocity * launchVelocity * Math.sin(2 * rad)) / gProj).toFixed(1);
  const flightTime = ((2 * launchVelocity * Math.sin(rad)) / gProj).toFixed(2);

  const getProjectileExplanation = () => {
    if (isHindi) {
      return `【प्रक्षेप्य गति (Projectile Motion)】:
• वेग (${launchVelocity} m/s) व कोण (${launchAngle}°):
• अधिकतम क्षैतिज परास (Range R = ${maxRange}m): $45^\circ$ के कोण पर अधिकतम दूरी मिलती है ($\sin 2\theta = \sin 90^\circ = 1$)।
• अधिकतम ऊंचाई (Height H = ${maxHeight}m): कोण जितना $90^\circ$ के करीब होगा, गेंद उतनी ऊँची जाएगी।
• उड्डयन काल (Time of Flight T = ${flightTime}s): गेंद हवा में इतने सेकंड रहेगी।`;
    } else {
      return `[Kinematics Analysis]: Launch Angle = ${launchAngle}°, Velocity = ${launchVelocity} m/s. Range = ${maxRange}m, Max Height = ${maxHeight}m, Flight Time = ${flightTime}s. Maximum range occurs at exactly 45°.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 7: TRIGONOMETRY
  // -------------------------------------------------------------
  const [angleDeg, setAngleDeg] = useState<number>(45);
  const angleRad = (angleDeg * Math.PI) / 180;
  const sinVal = Math.sin(angleRad).toFixed(3);
  const cosVal = Math.cos(angleRad).toFixed(3);
  const tanVal = Math.cos(angleRad) !== 0 ? Math.tan(angleRad).toFixed(3) : 'Undefined';

  // -------------------------------------------------------------
  // LAB 8: COMPOUND INTEREST
  // -------------------------------------------------------------
  const [principal, setPrincipal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(5);
  const simpleInterestAmount = principal + (principal * rate * years) / 100;
  const compoundInterestAmount = principal * Math.pow(1 + rate / 100, years);
  const compoundProfit = compoundInterestAmount - principal;

  // -------------------------------------------------------------
  // LAB 9: BIOLOGY - PHOTOSYNTHESIS & ENZYME BIOENERGETICS (जीव विज्ञान)
  // -------------------------------------------------------------
  const [lightIntensity, setLightIntensity] = useState<number>(45000); // 0 - 100,000 Lux
  const [co2Ppm, setCo2Ppm] = useState<number>(420); // 100 - 1200 ppm
  const [tempCelsius, setTempCelsius] = useState<number>(25); // 5 - 55 °C

  // Blackman's Law of Limiting Factors calculations
  const lightFactor = Math.min(1.0, lightIntensity / 50000);
  const co2Factor = Math.min(1.0, co2Ppm / 800);
  let tempFactor = 1.0;
  if (tempCelsius < 10) {
    tempFactor = Math.max(0.05, tempCelsius / 25);
  } else if (tempCelsius <= 32) {
    tempFactor = 0.5 + (tempCelsius - 10) * (0.5 / 22);
  } else if (tempCelsius <= 40) {
    tempFactor = 1.0 - (tempCelsius - 32) * (0.3 / 8);
  } else {
    // Severe thermal denaturation of RuBisCO enzyme
    tempFactor = Math.max(0.0, 0.7 - (tempCelsius - 40) * (0.7 / 15));
  }

  const photosynthesisRate = Math.round(Math.min(lightFactor, co2Factor) * tempFactor * 100);
  const o2ProductionMlPerMin = (photosynthesisRate * 0.55).toFixed(1);
  const glucoseSynthesisGramsPerHour = (photosynthesisRate * 0.18).toFixed(2);
  const stomatalAperturePercent = Math.min(100, Math.round(lightFactor * 70 + (tempCelsius > 38 ? -40 : 30)));

  // Identify limiting factor
  const getLimitingFactor = () => {
    if (tempCelsius > 44) return isHindi ? 'अत्यधिक तापमान (RuBisCO एंजाइम विकृत/Denatured)' : 'Severe Heat (RuBisCO Enzyme Denaturation)';
    if (tempCelsius < 12) return isHindi ? 'अत्यधिक ठंड (एंजाइम निष्क्रियता/Cold Inactivation)' : 'Cold Temperature Inactivation';
    if (lightFactor <= co2Factor) return isHindi ? 'प्रकाश तीव्रता (Light Intensity)' : 'Light Intensity';
    return isHindi ? 'कार्बन डाइऑक्साइड सांद्रता (CO2 Concentration)' : 'CO2 Concentration';
  };

  const getPhotosynthesisExplanation = () => {
    if (isHindi) {
      return `【प्रकाश संश्लेषण व ब्लैकमेन का सीमाकारी सिद्धांत (6CO2 + 6H2O + Light → C6H12O6 + 6O2)】:
• कुल प्रकाश संश्लेषण दर: ${photosynthesisRate}% (O2 उत्सर्जन: ${o2ProductionMlPerMin} mL/min, ग्लूकोज: ${glucoseSynthesisGramsPerHour} g/hr)।
• प्रमुख सीमाकारी कारक (Limiting Factor): ${getLimitingFactor()}।
• ब्लैकमेन का नियम: जब कोई प्रक्रिया कई कारकों पर निर्भर करती है, तो उसकी दर सबसे न्यूनतम (न्यूनतम उपलब्ध) कारक द्वारा नियंत्रित होती है।
• रंध्र (Stomata) स्थिति: ${stomatalAperturePercent}% खुले हैं। ${tempCelsius > 38 ? 'अत्यधिक वाष्पोत्सर्जन से बचने हेतु रंध्र सिकुड़ रहे हैं।' : 'गैसों का सुचारू विनिमय हो रहा है।'}`;
    } else {
      return `[Photosynthesis Bioenergetics Analysis]:
• Current Photosynthetic Efficiency is ${photosynthesisRate}%.
• Net Oxygen Evolution: ${o2ProductionMlPerMin} mL/min | Glucose Synthesis: ${glucoseSynthesisGramsPerHour} g/hr.
• Primary Limiting Factor: ${getLimitingFactor()} (Blackman's Principle of Limiting Factors).
• Stomatal Aperture: ${stomatalAperturePercent}%. RuBisCO enzyme activity is optimal at 25-30°C.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 10: BIOLOGY - GENETICS & PUNNETT SQUARE (मेंडेलियन आनुवंशिकी)
  // -------------------------------------------------------------
  const [parent1Alleles, setParent1Alleles] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [parent2Alleles, setParent2Alleles] = useState<'TT' | 'Tt' | 'tt'>('Tt');
  const [geneticTrait, setGeneticTrait] = useState<'height' | 'eyes' | 'blood'>('height');

  const p1 = parent1Alleles.split('');
  const p2 = parent2Alleles.split('');
  
  // 4 Punnett matrix cells
  const punnettGrid = [
    [p1[0] + p2[0], p1[0] + p2[1]],
    [p1[1] + p2[0], p1[1] + p2[1]]
  ].map(row => row.map(cell => {
    const sorted = cell.split('').sort().join('');
    // Ensure dominant uppercase letter comes first e.g. 'tT' -> 'Tt'
    if (sorted === 'Tt' || sorted === 'tT') return 'Tt';
    if (sorted === 'Bb' || sorted === 'bB') return 'Bb';
    return cell;
  }));

  const allOffspring = [punnettGrid[0][0], punnettGrid[0][1], punnettGrid[1][0], punnettGrid[1][1]];
  const countTT = allOffspring.filter(g => g === 'TT' || g === 'BB').length;
  const countTt = allOffspring.filter(g => g === 'Tt' || g === 'tT' || g === 'Bb' || g === 'bB').length;
  const counttt = allOffspring.filter(g => g === 'tt' || g === 'bb').length;

  const dominantPercent = ((countTT + countTt) / 4) * 100;
  const recessivePercent = (counttt / 4) * 100;

  const getGeneticsExplanation = () => {
    if (isHindi) {
      return `【मेंडेलियन आनुवंशिकी विश्लेषण (${parent1Alleles} × ${parent2Alleles})】:
• जीनप्ररूप अनुपात (Genotypic Ratio): ${countTT} Homozygous Dominant : ${countTt} Heterozygous : ${counttt} Homozygous Recessive (${countTT}:${countTt}:${counttt})।
• दृश्यप्ररूप अनुपात (Phenotypic Ratio): ${dominantPercent}% प्रभावी लक्षण (Dominant) एवं ${recessivePercent}% अप्रभावी लक्षण (Recessive) [${dominantPercent/25}:${recessivePercent/25}]।
• मेंडल का पृथक्करण नियम (Law of Segregation): युग्मक (Gametes) बनते समय दोनों एलील एक-दूसरे से पूरी शुद्धता से अलग हो जाते हैं।`;
    } else {
      return `[Mendelian Monohybrid Cross (${parent1Alleles} × ${parent2Alleles})]:
• Genotypic Ratio: ${countTT} TT : ${countTt} Tt : ${counttt} tt (${countTT*25}% : ${countTt*25}% : ${counttt*25}%).
• Phenotypic Ratio: ${dominantPercent}% Dominant Trait vs ${recessivePercent}% Recessive Trait.
• Demonstrates Mendel's Law of Segregation and Law of Dominance.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 11: BIOLOGY - OSMOSIS & CELL TONICITY (परासरण व कोशिका स्फीति)
  // -------------------------------------------------------------
  const [soluteConcentration, setSoluteConcentration] = useState<number>(0.9); // % NaCl
  const [cellType, setCellType] = useState<'plant' | 'rbc'>('plant');

  const isHypotonic = soluteConcentration < 0.8;
  const isIsotonic = soluteConcentration >= 0.8 && soluteConcentration <= 1.0;
  const isHypertonic = soluteConcentration > 1.0;

  const getOsmosisStateName = () => {
    if (cellType === 'plant') {
      if (isHypotonic) return isHindi ? 'स्फीत (Turgid - पूर्ण स्फीति दाब)' : 'Turgid (High Turgor Pressure)';
      if (isIsotonic) return isHindi ? 'शिथिल (Flaccid - साम्यावस्था)' : 'Flaccid (Isotonic Equilibrium)';
      return isHindi ? 'जीवद्रव्यकुंचित (Plasmolyzed - कोशिकाद्रव्य सिकुड़ा)' : 'Plasmolyzed (Cytoplasm Shrunk)';
    } else {
      if (isHypotonic) return isHindi ? 'कोशिका विस्फोट/हीमोलिसिस (Hemolysis / Lysis - RBC फट गई!)' : 'Hemolysis / Lysis (Cell Burst!)';
      if (isIsotonic) return isHindi ? 'सामान्य द्विनतोदर डिस्क (Normal Biconcave RBC)' : 'Normal Biconcave Erythrocyte';
      return isHindi ? 'क्रीनेशन/सिकुड़न (Crenation - कंटीली व सिकुड़ी हुई)' : 'Crenated (Shrunken Spiky RBC)';
    }
  };

  const getOsmosisExplanation = () => {
    if (isHindi) {
      return `【परासरण व टोनिसिटी विश्लेषण (${soluteConcentration}% बाह्य लवण सांद्रता)】:
• माध्यम की प्रकृति: ${isHypotonic ? 'अल्पपरासारी (Hypotonic Medium - जल कोशिका के भीतर घुसेगा)' : isIsotonic ? 'समपरासारी (Isotonic Normal Saline - शुद्ध जल प्रवाह शून्य)' : 'अतिपरासारी (Hypertonic Brine - जल कोशिका से बाहर खींचेगा)'}।
• कोशिका की स्थिति: ${getOsmosisStateName()}।
• वैज्ञानिक कारण: ${cellType === 'plant' ? 'पादप कोशिका में सेलूलोज़ कोशिका भित्ति (Cell Wall) होती है, इसलिए वह अत्यधिक जल भरने पर फटती नहीं बल्कि स्फीत (Turgid) होकर पौधे को सीधा रखती है।' : 'मानव आरबीसी में कोशिका भित्ति नहीं होती, इसलिए अल्पपरासारी जल में जल के अंतःपरासरण से वह फट जाती है (Lysis)। इसलिए अस्पताल में 0.9% Normal Saline चढ़ाई जाती है।'}`;
    } else {
      return `[Osmosis & Cellular Tonicity]: Solute Concentration = ${soluteConcentration}%. Solution is ${isHypotonic ? 'Hypotonic' : isIsotonic ? 'Isotonic' : 'Hypertonic'}. Cell State: ${getOsmosisStateName()}.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 12: ELECTRONICS - DIGITAL LOGIC GATES & BINARY CIRCUITS
  // -------------------------------------------------------------
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'>('AND');
  const [inputA, setInputA] = useState<0 | 1>(1);
  const [inputB, setInputB] = useState<0 | 1>(1);

  const computeGateOutput = (gate: string, a: number, b: number): 0 | 1 => {
    switch (gate) {
      case 'AND': return (a === 1 && b === 1) ? 1 : 0;
      case 'OR': return (a === 1 || b === 1) ? 1 : 0;
      case 'NOT': return a === 0 ? 1 : 0;
      case 'NAND': return !(a === 1 && b === 1) ? 1 : 0;
      case 'NOR': return !(a === 1 || b === 1) ? 1 : 0;
      case 'XOR': return (a ^ b) === 1 ? 1 : 0;
      case 'XNOR': return a === b ? 1 : 0;
      default: return 0;
    }
  };

  const gateOutput = computeGateOutput(selectedGate, inputA, inputB);

  const getLogicGateExplanation = () => {
    if (isHindi) {
      return `【डिजिटल इलेक्ट्रॉनिक्स: ${selectedGate} गेट लॉजिक】:
• इनपुट: A = ${inputA} (${inputA ? 'HIGH / 5V' : 'LOW / 0V'}), B = ${inputB} (${inputB ? 'HIGH / 5V' : 'LOW / 0V'})।
• आउटपुट: Y = ${gateOutput} (${gateOutput ? '✅ LED बल्ब जल रहा है (HIGH / 5V)' : '❌ LED बल्ब बंद है (LOW / 0V)'})।
• बूलियन व्यंजक: ${selectedGate === 'AND' ? 'Y = A · B' : selectedGate === 'OR' ? 'Y = A + B' : selectedGate === 'NOT' ? 'Y = A̅' : selectedGate === 'NAND' ? 'Y = A̅·̅B̅' : selectedGate === 'NOR' ? 'Y = A̅+̅B̅' : selectedGate === 'XOR' ? 'Y = A ⊕ B' : 'Y = A ⊙ B'}।
• अनुप्रयोग: कंप्यूटर प्रोसेसर के अंकगणितीय तर्क इकाई (ALU), मेमोरी लैच और डिजिटल स्विचिंग में प्रयोग होता है।`;
    } else {
      return `[Digital Logic Analysis]: Gate = ${selectedGate}, Input A = ${inputA}, Input B = ${inputB}. Output Y = ${gateOutput} (${gateOutput ? 'HIGH / 5V LED ON' : 'LOW / 0V LED OFF'}).`;
    }
  };

  // -------------------------------------------------------------
  // LAB 13: ELECTRONICS & ELECTRICAL - AC TRANSFORMER COIL TURNS
  // -------------------------------------------------------------
  const [primaryVoltage, setPrimaryVoltage] = useState<number>(220); // V
  const [primaryTurns, setPrimaryTurns] = useState<number>(500); // Np
  const [secondaryTurns, setSecondaryTurns] = useState<number>(50); // Ns
  const [loadResistance, setLoadResistance] = useState<number>(10); // Ohms

  const turnRatio = secondaryTurns / primaryTurns;
  const secondaryVoltage = Math.round(primaryVoltage * turnRatio * 10) / 10;
  const secondaryCurrent = Math.round((secondaryVoltage / loadResistance) * 100) / 100;
  const primaryCurrent = Math.round((secondaryCurrent * turnRatio) * 100) / 100;
  const transformerPower = Math.round(secondaryVoltage * secondaryCurrent);
  const transformerType = secondaryTurns > primaryTurns 
    ? (isHindi ? 'स्टेप-अप ट्रांसफॉर्मर (Step-Up - वोल्टेज वर्धक)' : 'Step-Up Transformer') 
    : secondaryTurns < primaryTurns 
    ? (isHindi ? 'स्टेप-डाउन ट्रांसफॉर्मर (Step-Down - वोल्टेज अपचायक)' : 'Step-Down Transformer')
    : (isHindi ? '1:1 पृथक्करण ट्रांसफॉर्मर (Isolation Transformer)' : '1:1 Isolation Transformer');

  const getTransformerExplanation = () => {
    if (isHindi) {
      return `【एसी ट्रांसफॉर्मर सिद्धांत (Vs / Vp = Ns / Np = Ip / Is)】:
• ट्रांसफॉर्मर प्रकार: ${transformerType} (अनुपात k = ${turnRatio.toFixed(3)})।
• प्राथमिक क्वाइल (Primary): Vp = ${primaryVoltage}V, Np = ${primaryTurns} फेरे (Turns), धारा Ip = ${primaryCurrent}A।
• द्वितीयक क्वाइल (Secondary): Vs = ${secondaryVoltage}V, Ns = ${secondaryTurns} फेरे, धारा Is = ${secondaryCurrent}A (भार R = ${loadResistance}Ω)।
• ऊर्जा संरक्षण नियम: P_in ≈ P_out ≈ ${transformerPower}W। जब वोल्टेज घटती है तो धारा उसी अनुपात में बढ़ती है, कुल शक्ति स्थिर रहती है।`;
    } else {
      return `[AC Transformer Induction Analysis]: Transformation Ratio k = ${turnRatio.toFixed(3)}. Primary Vp = ${primaryVoltage}V (${primaryTurns} turns), Secondary Vs = ${secondaryVoltage}V (${secondaryTurns} turns). Type: ${transformerType}. Total Power = ${transformerPower} Watts.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 14: ENGINEERING - SOLAR PHOTOVOLTAIC PANEL EFFICIENCY
  // -------------------------------------------------------------
  const [solarIrradiance, setSolarIrradiance] = useState<number>(850); // W/m^2
  const [panelArea, setPanelArea] = useState<number>(6); // m^2
  const [cellTemp, setCellTemp] = useState<number>(35); // °C
  const [panelTechnology, setPanelTechnology] = useState<'mono' | 'poly' | 'thin-film'>('mono');

  const baseEfficiency = panelTechnology === 'mono' ? 0.22 : panelTechnology === 'poly' ? 0.17 : 0.12;
  // Derating factor: -0.4% per °C above 25°C STC standard test condition
  const tempDerating = 1 - 0.004 * (cellTemp - 25);
  const actualEfficiency = Math.max(0.05, baseEfficiency * tempDerating);
  const peakPowerWatts = Math.round(solarIrradiance * panelArea * actualEfficiency);
  const dailyEnergyKwh = Math.round((peakPowerWatts * 5.5 / 1000) * 10) / 10;
  const annualCo2SavedKg = Math.round(dailyEnergyKwh * 365 * 0.82);

  const getSolarExplanation = () => {
    if (isHindi) {
      return `【सौर ऊर्जा फोटोवोल्टिक (PV) सेल इंजीनियरिंग】:
• धूप की तीव्रता (Irradiance): ${solarIrradiance} W/m², पैनल क्षेत्रफल: ${panelArea} m² (${panelTechnology === 'mono' ? 'Monocrystalline 22%' : panelTechnology === 'poly' ? 'Polycrystalline 17%' : 'Thin-Film 12%'} सिलिकॉन)।
• अधिकतम विद्युत शक्ति (Pmax): ${peakPowerWatts} Watts (${(peakPowerWatts/1000).toFixed(2)} kW)।
• तापमान गुणांक (Temp Derating): पैनल तापमान ${cellTemp}°C है। 25°C से अधिक गर्म होने पर सोलर सेल की दक्षता ${((1 - tempDerating)*100).toFixed(1)}% घट गई है।
• दैनिक उत्पादन: ~${dailyEnergyKwh} kWh (यूनिट) प्रतिदिन। वार्षिक कार्बन डाईऑक्साइड बचत: ~${annualCo2SavedKg} kg CO2।`;
    } else {
      return `[Solar PV Physics]: Irradiance = ${solarIrradiance} W/m², Area = ${panelArea} m², Cell Temp = ${cellTemp}°C. Peak Output = ${peakPowerWatts}W, Daily Yield = ${dailyEnergyKwh} kWh, Avoided Carbon = ${annualCo2SavedKg} kg CO2/year.`;
    }
  };

  // -------------------------------------------------------------
  // LAB 15: SPACE & ASTROPHYSICS - ORBITAL VELOCITY & ESCAPE VELOCITY
  // -------------------------------------------------------------
  const [targetPlanet, setTargetPlanet] = useState<'earth' | 'moon' | 'mars' | 'jupiter'>('earth');
  const [orbitalAltitudeKm, setOrbitalAltitudeKm] = useState<number>(400); // km (e.g. ISS at 400km)

  const planetData = {
    earth: { name: 'पृथ्वी (Earth)', mass: 5.972e24, radiusKm: 6371, g0: 9.81, color: 'from-blue-500 to-emerald-500' },
    moon: { name: 'चंद्रमा (Moon)', mass: 7.342e22, radiusKm: 1737, g0: 1.62, color: 'from-slate-400 to-slate-200' },
    mars: { name: 'मंगल ग्रह (Mars)', mass: 6.417e23, radiusKm: 3389, g0: 3.71, color: 'from-red-600 to-amber-600' },
    jupiter: { name: 'बृहस्पति (Jupiter)', mass: 1.898e27, radiusKm: 69911, g0: 24.79, color: 'from-amber-600 to-orange-400' }
  };

  const currentPlanet = planetData[targetPlanet];
  const G = 6.6743e-11;
  const radiusMeters = (currentPlanet.radiusKm + orbitalAltitudeKm) * 1000;
  const orbitalVelocityMps = Math.sqrt((G * currentPlanet.mass) / radiusMeters);
  const orbitalVelocityKmS = (orbitalVelocityMps / 1000).toFixed(2);
  const escapeVelocityKmS = ((Math.sqrt(2) * orbitalVelocityMps) / 1000).toFixed(2);
  const orbitalPeriodSeconds = (2 * Math.PI * radiusMeters) / orbitalVelocityMps;
  const orbitalPeriodMinutes = (orbitalPeriodSeconds / 60).toFixed(1);
  const orbitalPeriodHours = (orbitalPeriodSeconds / 3600).toFixed(2);

  const getSpaceExplanation = () => {
    if (isHindi) {
      return `【अंतरिक्ष यांत्रिकी: कक्षीय वेग (vo = √(GM/r)) व पलायन वेग (ve = √2·vo)】:
• खगोलीय पिंड: ${currentPlanet.name} (त्रिज्या: ${currentPlanet.radiusKm} km, सतह गुरुत्व: ${currentPlanet.g0} m/s²)।
• कक्षा की ऊंचाई (Altitude): ${orbitalAltitudeKm} km।
• आवश्यक कक्षीय वेग (Orbital Velocity): ${orbitalVelocityKmS} km/s (लगभग ${(parseFloat(orbitalVelocityKmS)*3600).toLocaleString()} km/h)।
• पलायन वेग (Escape Velocity): ${escapeVelocityKmS} km/s — इस वेग से फेंकने पर रॉकेट गुरुत्वाकर्षण क्षेत्र को हमेशा के लिए पार कर जाएगा!
• एक परिक्रमा का समय (Time Period): ${orbitalPeriodMinutes} मिनट (${orbitalPeriodHours} घंटे)। (जैसे ISS 92 मिनट में पृथ्वी का 1 चक्कर लगाता है)।`;
    } else {
      return `[Astrophysics & Orbital Mechanics]: Planet = ${currentPlanet.name}, Altitude = ${orbitalAltitudeKm} km. Orbital Velocity vo = ${orbitalVelocityKmS} km/s, Escape Velocity ve = ${escapeVelocityKmS} km/s (√2 ratio). Orbital Period T = ${orbitalPeriodMinutes} minutes.`;
    }
  };

  // Custom AI Formula Solver States
  const [customFormulaQuery, setCustomFormulaQuery] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [solverResult, setSolverResult] = useState<string | null>(null);

  const handleSolveCustomFormula = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customFormulaQuery.trim();
    if (!query) return;

    setIsSolving(true);
    setSolverResult(null);
    showToast(
      isHindi ? `🔬 "${query}" का हल व सूत्र चरणबद्ध तैयार हो रहा है...` : `🔬 Solving formula for "${query}"...`,
      'info'
    );

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide step-by-step formula solution, substitution, variables explanation, unit analysis, and practical real-world cause-and-effect for: "${query}". Format clearly in ${isHindi ? 'Hindi & English' : 'English'}.`,
          systemInstruction: `You are HansAI Physics & Chemistry Master. Explain scientific laws with practical real-life examples and exam tips.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSolverResult(data.reply || 'Calculation completed.');
        showToast(isHindi ? '✅ हल तैयार है!' : '✅ Solution generated!', 'success');
      }
    } catch (err) {
      showToast('Could not solve formula. Please try again.', 'error');
    } finally {
      setIsSolving(false);
    }
  };

  const handleSpeakActiveLab = (textToSpeak: string) => {
    if (isPlayingAudio) {
      stopAllSpeech();
      setIsPlayingAudio(false);
      return;
    }
    stopAllSpeech();
    setIsPlayingAudio(true);
    speakText(textToSpeak, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
      rate: 1.0,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-6 text-slate-100 space-y-6 animate-fade-in text-left">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-black flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              INTERACTIVE VIRTUAL SCIENCE LAB 2026
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            {isHindi ? 'प्रैक्टिकल सिमुलेटर व कॉज-एंड-इफेक्ट गाइड' : 'Interactive Science Simulator & Cause-and-Effect Lab'}
          </h1>
          <p className="text-xs text-slate-300">
            {isHindi 
              ? 'स्लाइडर्स को ऊपर-नीचे करके देखें कि भौतिकी व रसायन विज्ञान में असल दुनिया में क्या बदलता है और क्यों।'
              : 'Adjust sliders to observe live cause-and-effect physics, optics, physiology and chemistry in real time.'}
          </p>
        </div>
      </div>

      {/* LAB CATEGORY FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: isHindi ? '🔬 सभी 17 लैब्स' : '🔬 All 17 Labs' },
          { id: 'chemistry', label: isHindi ? '⚛️ आवर्त सारणी व रसायन' : '⚛️ Chemistry & Periodic Table' },
          { id: 'biology', label: isHindi ? '🌿 बायोलॉजी व जीवन विज्ञान' : '🌿 Biology & Life Sciences' },
          { id: 'electronics', label: isHindi ? '⚡ इलेक्ट्रॉनिक्स व इंजीनियरिंग' : '⚡ Electronics & Engineering' },
          { id: 'physics', label: isHindi ? '🔭 भौतिकी व प्रकाशिकी' : '🔭 Physics & Optics' },
          { id: 'space', label: isHindi ? '🌌 अंतरिक्ष व सौर ऊर्जा' : '🌌 Space & Solar Energy' },
          { id: 'math-ai', label: isHindi ? '📐 गणित व AI सॉल्वर' : '📐 Maths & AI Solver' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as LabCategory)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-md font-black'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* LAB SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          // Chemistry & Periodic Table
          { id: 'periodic-table', category: 'chemistry', label: isHindi ? '⚛️ आधुनिक आवर्त सारणी (Periodic Table)' : '⚛️ Modern Periodic Table' },
          { id: 'chemistry-ph', category: 'chemistry', label: isHindi ? '🧪 अम्ल-क्षार व pH पैमाना' : '🧪 Acid-Base & pH Scale' },

          // Physics & Medical
          { id: 'circuits', category: 'physics', label: isHindi ? '⚡ विद्युत परिपथ (Ohm\'s Law)' : '⚡ Electric Circuit (Ohm\'s Law)' },
          { id: 'medical-cardio', category: 'biology', label: isHindi ? '🩺 कार्डियक व बीपी लैब' : '🩺 Cardiac & BP Lab' },
          { id: 'optics', category: 'physics', label: isHindi ? '🔭 लेंस प्रकाशिकी (Optics)' : '🔭 Lens Optics' },
          { id: 'pendulum', category: 'physics', label: isHindi ? '🕰️ सरल लोलक (Pendulum)' : '🕰️ Simple Pendulum' },
          { id: 'projectile', category: 'physics', label: isHindi ? '🚀 प्रक्षेप्य गति (Projectile)' : '🚀 Projectile Motion' },
          
          // Biology & Life Sciences
          { id: 'biology-photosynthesis', category: 'biology', label: isHindi ? '🌿 प्रकाश संश्लेषण (Photosynthesis)' : '🌿 Photosynthesis Lab' },
          { id: 'biology-genetics', category: 'biology', label: isHindi ? '🧬 मेंडेलियन आनुवंशिकी (Punnett)' : '🧬 Genetics & Punnett' },
          { id: 'biology-osmosis', category: 'biology', label: isHindi ? '💧 परासरण व टोनिसिटी (Osmosis)' : '💧 Osmosis & Tonicity' },

          // Electronics & Engineering
          { id: 'electronics-logic-gates', category: 'electronics', label: isHindi ? '🔲 डिजिटल लॉजिक गेट्स (Logic Gates)' : '🔲 Logic Gates & Binary' },
          { id: 'electronics-transformer', category: 'electronics', label: isHindi ? '⚡ ट्रांसफॉर्मर क्वाइल (Transformer)' : '⚡ AC Transformer' },
          { id: 'engineering-solar', category: 'space', label: isHindi ? '☀️ सोलर सेल PV इंजीनियरिंग' : '☀️ Solar PV Panel Lab' },
          { id: 'space-orbital', category: 'space', label: isHindi ? '🌌 कक्षीय वेग व पलायन वेग (Orbit)' : '🌌 Orbital & Escape Velocity' },

          // Maths & AI
          { id: 'trig', category: 'math-ai', label: isHindi ? '📐 त्रिकोणमिति चक्र' : '📐 Trigonometry Circle' },
          { id: 'finance', category: 'math-ai', label: isHindi ? '💰 चक्रवृद्धि ब्याज (Growth)' : '💰 Compound Interest' },
          { id: 'custom-solver', category: 'math-ai', label: isHindi ? '🤖 AI फॉर्मूला सॉल्वर' : '🤖 AI Formula Solver' }
        ]
          .filter(tab => selectedCategory === 'all' || tab.category === selectedCategory)
          .map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                stopAllSpeech();
                setIsPlayingAudio(false);
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border cursor-pointer shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 border-cyan-300 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
      </div>

      {/* ============================================================= */}
      {/* LAB VIEW 0: INTERACTIVE MODERN PERIODIC TABLE (CHEMISTRY) */}
      {/* ============================================================= */}
      {activeTab === 'periodic-table' && (
        <InteractivePeriodicTable language={language} showToast={showToast} />
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 1: ELECTRIC CIRCUITS & OHM'S LAW */}
      {/* ============================================================= */}
      {activeTab === 'circuits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls & Cause-and-Effect (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Formula: V = I × R | P = V × I</span>
                <h2 className="text-base font-extrabold text-white mt-1">विद्युत परिपथ एवं ओम का नियम</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getCircuitExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Practical Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Quick 1-Click Practical Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ⚡ {isHindi ? 'प्रैक्टिकल परिदृश्य चुनें (1-Click Presets):' : 'Practical Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setVoltage(24); setResistance(2); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  ⚡ हाई पावर हीटर (24V, 2Ω)
                </button>
                <button
                  onClick={() => { setVoltage(1.5); setResistance(50); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  🔋 कमजोर सेल लोड (1.5V, 50Ω)
                </button>
                <button
                  onClick={() => { setVoltage(12); setResistance(10); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  💡 सामान्य 12V 10Ω बल्ब
                </button>
                <button
                  onClick={() => { setVoltage(24); setResistance(1); }}
                  className="p-2 bg-slate-900 hover:bg-rose-950/40 border border-rose-900/50 rounded-xl text-[11px] font-bold text-rose-300 text-left cursor-pointer"
                >
                  ⚠️ शॉर्ट सर्किट टेस्ट (24V, 1Ω)
                </button>
              </div>
            </div>

            {/* Voltage Slider */}
            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Voltage (V) [विद्युत विभव]:</span>
                <span className="text-cyan-400 font-mono text-sm">{voltage} Volts</span>
              </div>
              <input
                type="range"
                min="1"
                max="36"
                step="1"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                {isHindi ? '↑ ऊपर करने पर: बैटरी का दबाव बढ़ता है, जिससे इलेक्ट्रॉन तेजी से दौड़ते हैं।' : '↑ Increasing V drives more current through the circuit.'}
              </p>
            </div>

            {/* Resistance Slider */}
            <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Resistance (R) [प्रतिरोध]:</span>
                <span className="text-amber-400 font-mono text-sm">{resistance} Ω (Ohms)</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                {isHindi ? '↑ ऊपर करने पर: तार में रुकावट बढ़ती है, जिससे करंट घटता है।' : '↑ Increasing R restricts flow of electrons, reducing current.'}
              </p>
            </div>

            {/* LIVE CALCULATION METRICS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Current (I = V/R)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{current} A</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block">Power (P = V × I)</span>
                <span className="text-lg font-black text-yellow-400 font-mono">{power} W</span>
              </div>
            </div>

            {/* LIVE CAUSE-AND-EFFECT NARRATIVE BOX */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Info className="w-4 h-4" />
                <span>{isHindi ? '🔴 प्रैक्टिकल में क्या हो रहा है और क्यों?' : 'Live Physical Explanation:'}</span>
              </div>
              <p className="whitespace-pre-line">{getCircuitExplanation()}</p>
            </div>

          </div>

          {/* LIVE SIMULATION CANVAS (7 COLS) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              ⚡ LIVE CIRCUIT SIMULATION & ELECTRON FLOW
            </span>

            <svg viewBox="0 0 400 240" className="w-full h-[260px] bg-[#090D16] rounded-2xl border border-slate-800 shadow-inner">
              {/* Circuit Wires */}
              <rect x="50" y="40" width="300" height="160" fill="none" stroke="#334155" strokeWidth="4" rx="12" />

              {/* Battery Symbol */}
              <g transform="translate(45, 120)">
                <line x1="0" y1="-20" x2="0" y2="20" stroke="#06B6D4" strokeWidth="6" />
                <line x1="10" y1="-10" x2="10" y2="10" stroke="#06B6D4" strokeWidth="3" />
                <text x="-32" y="4" fill="#06B6D4" fontSize="10" fontWeight="bold">+ {voltage}V -</text>
              </g>

              {/* Resistor Symbol */}
              <g transform="translate(200, 40)">
                <rect x="-30" y="-12" width="60" height="24" fill="#1E293B" stroke="#F59E0B" strokeWidth="3" rx="4" />
                <text x="0" y="4" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">{resistance} Ω</text>
              </g>

              {/* Bulb Glow Symbol with Dynamic Glow */}
              <g transform="translate(350, 120)">
                <circle 
                  cx="0" 
                  cy="0" 
                  r={Math.min(28, 14 + parseFloat(power) / 10)} 
                  fill={parseFloat(power) > 50 ? '#FBBF24' : parseFloat(power) > 10 ? '#F59E0B' : '#78350F'} 
                  opacity={Math.min(1, 0.4 + parseFloat(power) / 100)}
                  stroke="#F59E0B" 
                  strokeWidth="2" 
                  className="transition-all duration-300" 
                />
                <text x="0" y="4" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">{power}W</text>
              </g>

              {/* Electron Particles Animation */}
              <circle cx="200" cy="200" r="4" fill="#10B981" className="animate-ping" />
            </svg>

            <div className="flex justify-between items-center text-xs font-bold text-slate-300 px-2">
              <span>{isHindi ? `इलेक्ट्रॉन धारा: I = ${current} A` : `Current: ${current} A`}</span>
              <span className="text-yellow-400">{isHindi ? `बल्ब आउटपुट: ${power} W` : `Output: ${power} W`}</span>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 2: MEDICAL PHYSIOLOGY & CARDIAC CYCLE */}
      {/* ============================================================= */}
      {activeTab === 'medical-cardio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-5 bg-[#090D16] border border-rose-950/40 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-rose-900/30 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">Cardiac Output = HR × SV | MAP = DBP + 1/3(PP)</span>
                <h2 className="text-base font-extrabold text-white mt-1">हृदय गति व कार्डियक आउटपुट सिम्युलेटर</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getCardioExplanation())}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Medical Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🩺 {isHindi ? 'क्लिनिकल परिदृश्य चुनें:' : 'Clinical Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setHeartRate(72); setStrokeVolume(70); setSystolicBP(120); setDiastolicBP(80); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left"
                >
                  ✅ स्वस्थ युवा (72 BPM, 120/80)
                </button>
                <button
                  onClick={() => { setHeartRate(140); setStrokeVolume(110); setSystolicBP(150); setDiastolicBP(85); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left"
                >
                  🏃 मैराथन व्यायाम (140 BPM)
                </button>
                <button
                  onClick={() => { setHeartRate(85); setStrokeVolume(65); setSystolicBP(165); setDiastolicBP(105); }}
                  className="p-2 bg-slate-900 hover:bg-rose-950/40 border border-rose-900/50 rounded-xl text-[11px] font-bold text-rose-300 text-left"
                >
                  ⚠️ उच्च रक्तचाप (Hypertension)
                </button>
                <button
                  onClick={() => { setHeartRate(48); setStrokeVolume(95); setSystolicBP(110); setDiastolicBP(70); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left"
                >
                  🏅 एथलीट हार्ट (Bradycardia 48)
                </button>
              </div>
            </div>

            {/* Heart Rate Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Heart Rate (HR):</span>
                <span className="text-rose-400 font-mono">{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                step="2"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
            </div>

            {/* Stroke Volume Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Stroke Volume (SV) [प्रति धड़कन रक्त]:</span>
                <span className="text-pink-400 font-mono">{strokeVolume} mL/beat</span>
              </div>
              <input
                type="range"
                min="30"
                max="140"
                step="2"
                value={strokeVolume}
                onChange={(e) => setStrokeVolume(Number(e.target.value))}
                className="w-full accent-pink-400 cursor-pointer"
              />
            </div>

            {/* Blood Pressure Sliders */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Systolic BP</span>
                  <span className="text-amber-400 font-mono">{systolicBP} mmHg</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="190"
                  step="2"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Diastolic BP</span>
                  <span className="text-cyan-400 font-mono">{diastolicBP} mmHg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="120"
                  step="2"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Cause and Effect Explanation Box */}
            <div className="p-4 bg-rose-950/30 border border-rose-900/40 rounded-2xl text-xs text-rose-200 leading-relaxed font-medium space-y-1">
              <span className="font-bold text-rose-300 block">🩺 {isHindi ? 'क्लिनिकल प्रभाव:' : 'Clinical Analysis:'}</span>
              <p className="whitespace-pre-line">{getCardioExplanation()}</p>
            </div>

          </div>

          {/* Visual Canvas (7 Cols) */}
          <div className="lg:col-span-7 bg-[#090D16] border border-rose-950/40 p-6 rounded-3xl space-y-4 shadow-xl text-center">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider">Real-Time ECG & Hemodynamics</span>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase ${
                heartRate > 100 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : heartRate < 60
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {heartRate > 100 ? '⚠️ Tachycardia' : heartRate < 60 ? '⚠️ Bradycardia' : '✅ Normal Sinus Rhythm'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Cardiac Output (CO)</span>
                <span className="text-lg font-black text-rose-400 font-mono">{cardiacOutput} L/min</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Mean Arterial (MAP)</span>
                <span className="text-lg font-black text-cyan-400 font-mono">{meanArterialPressure} mmHg</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 block">Pulse Pressure</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{pulsePressure} mmHg</span>
              </div>
            </div>

            {/* Interactive SVG ECG */}
            <svg viewBox="0 0 500 200" className="w-full h-48 bg-[#03060E] rounded-2xl border border-slate-800">
              <path
                d="M 20 100 L 100 100 L 115 90 L 130 100 L 150 100 L 165 40 L 180 140 L 195 100 L 220 100 L 240 80 L 260 100 L 300 100 L 315 90 L 330 100 L 350 100 L 365 40 L 380 140 L 395 100 L 420 100 L 440 80 L 460 100 L 480 100"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text x="165" y="30" fill="#F43F5E" fontSize="10" fontWeight="bold">QRS (Ventricular Depolarization)</text>
            </svg>
          </div>

        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 3: OPTICS LENS & MIRRORS */}
      {/* ============================================================= */}
      {activeTab === 'optics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Formula: 1/f = 1/v - 1/u | m = v/u</span>
                <h2 className="text-base font-extrabold text-white mt-1">उत्तल लेंस प्रकाशिकी (Convex Lens Optics)</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getOpticsExplanation())}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Optics Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🔭 {isHindi ? 'ऑप्टिक्स परिदृश्य चुनें:' : 'Optics Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setFocalLength(25); setObjectDistance(12); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left"
                >
                  🔍 मैग्निफाइंग ग्लास (u &lt; f)
                </button>
                <button
                  onClick={() => { setFocalLength(20); setObjectDistance(40); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left"
                >
                  ⚖️ समान आकार (u = 2f)
                </button>
                <button
                  onClick={() => { setFocalLength(15); setObjectDistance(55); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left"
                >
                  📷 कैमरा मोड (u &gt; 2f)
                </button>
                <button
                  onClick={() => { setFocalLength(20); setObjectDistance(28); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left"
                >
                  📽️ प्रोजेक्टर मोड (f &lt; u &lt; 2f)
                </button>
              </div>
            </div>

            {/* Focal Length Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Focal Length (f) [फोकस दूरी]:</span>
                <span className="text-cyan-400 font-mono">{focalLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="1"
                value={focalLength}
                onChange={(e) => setFocalLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Object Distance Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Object Distance (u) [वस्तु की दूरी]:</span>
                <span className="text-amber-400 font-mono">-{objectDistance} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={objectDistance}
                onChange={(e) => setObjectDistance(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Image Distance (v)</span>
                <span className="text-base font-black text-emerald-400 font-mono">{vDisplay} cm</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Magnification (m)</span>
                <span className="text-base font-black text-yellow-400 font-mono">{magnification}x</span>
              </div>
            </div>

            {/* Practical Explanation Box */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium space-y-1">
              <span className="font-bold text-amber-300 block">🔭 {isHindi ? 'किरण आरेख व प्रतिबिंब की प्रकृति:' : 'Ray Optics Analysis:'}</span>
              <p className="whitespace-pre-line">{getOpticsExplanation()}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🔭 OPTICS RAY TRACING CANVAS
            </span>

            <svg viewBox="0 0 400 200" className="w-full h-[240px] bg-[#090D16] rounded-2xl border border-slate-800">
              <line x1="10" y1="100" x2="390" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
              <ellipse cx="200" cy="100" rx="10" ry="70" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="2" />
              
              {/* Object Arrow */}
              <line x1={Math.max(20, 200 - objectDistance * 1.6)} y1="100" x2={Math.max(20, 200 - objectDistance * 1.6)} y2="55" stroke="#F59E0B" strokeWidth="4" />
              <polygon points={`${Math.max(20, 200 - objectDistance * 1.6)},47 ${Math.max(20, 200 - objectDistance * 1.6) - 5},57 ${Math.max(20, 200 - objectDistance * 1.6) + 5},57`} fill="#F59E0B" />

              {/* Focus points */}
              <circle cx={200 - focalLength * 1.6} cy="100" r="3" fill="#06B6D4" />
              <text x={200 - focalLength * 1.6} y="115" fill="#06B6D4" fontSize="8" textAnchor="middle">F1</text>
              <circle cx={200 + focalLength * 1.6} cy="100" r="3" fill="#06B6D4" />
              <text x={200 + focalLength * 1.6} y="115" fill="#06B6D4" fontSize="8" textAnchor="middle">F2</text>
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 4: SIMPLE PENDULUM & GRAVITY */}
      {/* ============================================================= */}
      {activeTab === 'pendulum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Formula: T = 2π √(L/g) | f = 1/T</span>
                <h2 className="text-base font-extrabold text-white mt-1">सरल लोलक एवं गुरुत्वाकर्षण लैब</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getPendulumExplanation())}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Gravity Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🪐 {isHindi ? 'ग्रह व गुरुत्वाकर्षण चुनें (Celestial Gravity):' : 'Celestial Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setGravity(9.8); setPendulumLength(1.0); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left"
                >
                  🌍 पृथ्वी (Earth g = 9.8 m/s²)
                </button>
                <button
                  onClick={() => { setGravity(1.62); setPendulumLength(1.0); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left"
                >
                  🌕 चंद्रमा (Moon g = 1.62 - Slow)
                </button>
                <button
                  onClick={() => { setGravity(3.7); setPendulumLength(1.0); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left"
                >
                  🔴 मंगल (Mars g = 3.7 m/s²)
                </button>
                <button
                  onClick={() => { setGravity(24.8); setPendulumLength(1.0); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left"
                >
                  ⚡ बृहस्पति (Jupiter g = 24.8 - Fast)
                </button>
              </div>
            </div>

            {/* Length Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Length (L) [धागे की लंबाई]:</span>
                <span className="text-cyan-400 font-mono">{pendulumLength} meters</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="5.0"
                step="0.1"
                value={pendulumLength}
                onChange={(e) => setPendulumLength(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Gravity Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Gravity (g) [गुरुत्वाकर्षण त्वरण]:</span>
                <span className="text-amber-400 font-mono">{gravity} m/s²</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.2"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Calculated Period */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Time Period (T)</span>
                <span className="text-lg font-black text-emerald-400 font-mono">{timePeriod} s</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Frequency (f)</span>
                <span className="text-lg font-black text-yellow-400 font-mono">{frequency} Hz</span>
              </div>
            </div>

            {/* Explanation Box */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium space-y-1">
              <span className="font-bold text-amber-300 block">🕰️ {isHindi ? 'प्रैक्टिकल भौतिकी नियम:' : 'Physics Dynamics:'}</span>
              <p className="whitespace-pre-line">{getPendulumExplanation()}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🕰️ SIMPLE PENDULUM OSCILLATION
            </span>

            <svg viewBox="0 0 400 240" className="w-full h-[260px] bg-[#090D16] rounded-2xl border border-slate-800">
              <line x1="150" y1="20" x2="250" y2="20" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
              <circle cx="200" cy="20" r="4" fill="#06B6D4" />

              {/* String & Bob */}
              <line x1="200" y1="20" x2="250" y2="170" stroke="#94A3B8" strokeWidth="2" strokeDasharray="2 2" />
              <line x1="200" y1="20" x2="160" y2="170" stroke="#06B6D4" strokeWidth="3" />
              <circle cx="160" cy="170" r="16" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              
              <text x="200" y="215" fill="#38BDF8" fontSize="11" fontWeight="bold" textAnchor="middle">
                T = 2π√(L/g) = {timePeriod}s | g = {gravity} m/s²
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 5: CHEMISTRY ACID-BASE TITRATION & pH SCALE */}
      {/* ============================================================= */}
      {activeTab === 'chemistry-ph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">pH = -log[H+] | Acid + Base = Salt + Water</span>
                <h2 className="text-base font-extrabold text-white mt-1">अम्ल-क्षार अनुमापन एवं pH पैमाना लैब</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getChemistryExplanation())}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Chemistry Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🧪 {isHindi ? 'रासायनिक अवस्था चुनें:' : 'Chemical States:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBaseVolumeAdded(0)}
                  className="p-2 bg-slate-900 hover:bg-rose-950/40 border border-rose-900/50 rounded-xl text-[11px] font-bold text-rose-300 text-left"
                >
                  🔴 शुद्ध अम्ल (HCl 0.1M, pH 1.0)
                </button>
                <button
                  onClick={() => setBaseVolumeAdded(25)}
                  className="p-2 bg-slate-900 hover:bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-[11px] font-bold text-emerald-300 text-left"
                >
                  🟢 न्यूट्रल पॉइंट (Equivalence pH 7.0)
                </button>
                <button
                  onClick={() => setBaseVolumeAdded(50)}
                  className="p-2 bg-slate-900 hover:bg-blue-950/40 border border-blue-900/50 rounded-xl text-[11px] font-bold text-blue-300 text-left"
                >
                  🟣 अत्यधिक क्षार (NaOH pH 12.8)
                </button>
                <button
                  onClick={() => setBaseVolumeAdded(15)}
                  className="p-2 bg-slate-900 hover:bg-amber-950/40 border border-amber-900/50 rounded-xl text-[11px] font-bold text-amber-300 text-left"
                >
                  🟠 आंशिक उदासीनीकरण (pH 2.6)
                </button>
              </div>
            </div>

            {/* Base Added Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Base Added (0.1M NaOH) [मिलाया गया क्षार]:</span>
                <span className="text-cyan-400 font-mono">{baseVolumeAdded} mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={baseVolumeAdded}
                onChange={(e) => setBaseVolumeAdded(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* pH Metric Output */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`border p-3 rounded-2xl text-center ${
                calculatedPh < 6.5 ? 'bg-rose-950/40 border-rose-500 text-rose-300' :
                calculatedPh > 7.5 ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300' :
                'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              }`}>
                <span className="text-[10px] font-bold block opacity-80">Calculated pH</span>
                <span className="text-2xl font-black font-mono">{phDisplay}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Phenolphthalein Color</span>
                <span className="text-xs font-black text-pink-400 block mt-1">
                  {calculatedPh < 7 ? 'रंगहीन (Colorless)' : calculatedPh <= 7.5 ? 'हल्का गुलाबी (Faint Pink)' : 'गहरा मैजेंटा (Deep Pink)'}
                </span>
              </div>
            </div>

            {/* Chemistry Cause & Effect */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium space-y-1">
              <span className="font-bold text-amber-300 block">🧪 {isHindi ? 'आयन संतुलन व रासायनिक प्रक्रिया:' : 'Chemical Equilibrium:'}</span>
              <p className="whitespace-pre-line">{getChemistryExplanation()}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🧪 VIRTUAL TITRATION BEAKER & PH INDICATOR
            </span>

            <svg viewBox="0 0 400 240" className="w-full h-[260px] bg-[#090D16] rounded-2xl border border-slate-800">
              {/* Burette */}
              <rect x="185" y="10" width="30" height="90" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
              <text x="200" y="55" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle">NaOH</text>

              {/* Droplets */}
              <circle cx="200" cy="115" r="3" fill="#38BDF8" className="animate-bounce" />

              {/* Conical Flask */}
              <polygon 
                points="160,130 240,130 280,210 120,210" 
                fill={calculatedPh < 7 ? 'rgba(239, 68, 68, 0.25)' : calculatedPh <= 7.5 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(236, 72, 153, 0.45)'} 
                stroke="#06B6D4" 
                strokeWidth="3" 
              />
              <text x="200" y="185" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                pH = {phDisplay}
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 6: PROJECTILE MOTION */}
      {/* ============================================================= */}
      {activeTab === 'projectile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Range: R = v²sin(2θ)/g | Height: H = v²sin²θ/2g</span>
                <h2 className="text-base font-extrabold text-white mt-1">प्रक्षेप्य गति (Projectile Motion)</h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getProjectileExplanation())}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Projectile Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🚀 {isHindi ? 'स्पोर्ट्स व मिलिट्री परिदृश्य:' : 'Motion Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setLaunchAngle(45); setLaunchVelocity(35); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left"
                >
                  🏏 क्रिकेट छक्का (45°, 35 m/s)
                </button>
                <button
                  onClick={() => { setLaunchAngle(36); setLaunchVelocity(32); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left"
                >
                  🥇 भाला फेंक ओलंपिक (36°)
                </button>
                <button
                  onClick={() => { setLaunchAngle(90); setLaunchVelocity(30); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left"
                >
                  🚀 सीधा ऊपर (90° Max Height)
                </button>
                <button
                  onClick={() => { setLaunchAngle(15); setLaunchVelocity(40); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left"
                >
                  🔫 कम कोण तेज गति (15°, 40 m/s)
                </button>
              </div>
            </div>

            {/* Angle Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Launch Angle (θ) [प्रक्षेप्य कोण]:</span>
                <span className="text-cyan-400 font-mono">{launchAngle}°</span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="1"
                value={launchAngle}
                onChange={(e) => setLaunchAngle(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Velocity Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Initial Velocity (v) [प्रारंभिक वेग]:</span>
                <span className="text-amber-400 font-mono">{launchVelocity} m/s</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="1"
                value={launchVelocity}
                onChange={(e) => setLaunchVelocity(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] font-bold text-slate-400 block">Max Range (R)</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{maxRange} m</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] font-bold text-slate-400 block">Max Height (H)</span>
                <span className="text-sm font-black text-cyan-400 font-mono">{maxHeight} m</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-2xl text-center">
                <span className="text-[9px] font-bold text-slate-400 block">Flight Time (T)</span>
                <span className="text-sm font-black text-yellow-400 font-mono">{flightTime} s</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 leading-relaxed font-medium space-y-1">
              <span className="font-bold text-amber-300 block">🚀 {isHindi ? 'प्रक्षेप्य गति नियम:' : 'Kinematics Law:'}</span>
              <p className="whitespace-pre-line">{getProjectileExplanation()}</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              🚀 PARABOLIC TRAJECTORY SIMULATION
            </span>

            <svg viewBox="0 0 400 240" className="w-full h-[260px] bg-[#090D16] rounded-2xl border border-slate-800">
              {/* Ground */}
              <line x1="20" y1="200" x2="380" y2="200" stroke="#475569" strokeWidth="4" />

              {/* Trajectory Arc */}
              <path
                d={`M 30 200 Q 180 ${Math.max(30, 200 - parseFloat(maxHeight) * 2.2)} 330 200`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="3"
                strokeDasharray="4 4"
              />

              {/* Ball */}
              <circle cx="180" cy={Math.max(30, 200 - parseFloat(maxHeight) * 2.2)} r="7" fill="#10B981" />
              <text x="180" y={Math.max(18, 185 - parseFloat(maxHeight) * 2.2)} fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                H = {maxHeight}m
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 7: TRIGONOMETRY */}
      {/* ============================================================= */}
      {activeTab === 'trig' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Unit Circle: sin²θ + cos²θ = 1</span>
              <h2 className="text-base font-extrabold text-white mt-1">त्रिकोणमिति व इकाई वृत्त (Unit Circle)</h2>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Angle (θ):</span>
                <span className="text-cyan-400 font-mono">{angleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={angleDeg}
                onChange={(e) => setAngleDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">sin(θ)</span>
                <span className="text-base font-black text-emerald-400 font-mono">{sinVal}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">cos(θ)</span>
                <span className="text-base font-black text-cyan-400 font-mono">{cosVal}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">tan(θ)</span>
                <span className="text-base font-black text-yellow-400 font-mono">{tanVal}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              📐 UNIT CIRCLE VISUALIZER
            </span>
            <svg viewBox="0 0 300 240" className="w-full h-[240px] bg-[#090D16] rounded-2xl border border-slate-800">
              <circle cx="150" cy="120" r="80" fill="none" stroke="#334155" strokeWidth="2" />
              <line x1="50" y1="120" x2="250" y2="120" stroke="#475569" strokeWidth="1.5" />
              <line x1="150" y1="20" x2="150" y2="220" stroke="#475569" strokeWidth="1.5" />
              <line x1="150" y1="120" x2={150 + 80 * Math.cos(angleRad)} y2={120 - 80 * Math.sin(angleRad)} stroke="#06B6D4" strokeWidth="3" />
              <circle cx={150 + 80 * Math.cos(angleRad)} cy={120 - 80 * Math.sin(angleRad)} r="5" fill="#F59E0B" />
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 8: COMPOUND INTEREST */}
      {/* ============================================================= */}
      {activeTab === 'finance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">A = P(1 + r/100)^t</span>
              <h2 className="text-base font-extrabold text-white mt-1">चक्रवृद्धि ब्याज व धन वृद्धि सिम्युलेटर</h2>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Principal (P) [मूलधन]:</span>
                <span className="text-cyan-400 font-mono">₹{principal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Rate (r) [ब्याज दर]:</span>
                <span className="text-amber-400 font-mono">{rate}% p.a.</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Years (t) [समय]:</span>
                <span className="text-emerald-400 font-mono">{years} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-slate-400 block">Simple Interest Amt</span>
                <span className="text-base font-black text-slate-300 font-mono">₹{simpleInterestAmount.toFixed(0)}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-emerald-400 block">Compound Interest Amt</span>
                <span className="text-base font-black text-emerald-400 font-mono">₹{compoundInterestAmount.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest block">
              💰 COMPOUNDING WEALTH EXPONENTIAL CURVE
            </span>
            <div className="p-4 bg-slate-950 rounded-2xl text-xs text-left space-y-2">
              <p className="text-slate-200">
                • <strong>अल्बर्ट आइंस्टीन:</strong> "चक्रवृद्धि ब्याज दुनिया का आठवाँ अजूबा है। जो इसे समझता है, वह इसे कमाता है; जो नहीं समझता, वह इसे चुकाता है।"
              </p>
              <p className="text-emerald-400 font-mono">
                • कुल शुद्ध मुनाफा (Compound Wealth Gain): +₹{compoundProfit.toFixed(0)} ({((compoundProfit / principal) * 100).toFixed(0)}% ROI)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 9: BIOLOGY - PHOTOSYNTHESIS & ENZYME LAB */}
      {/* ============================================================= */}
      {activeTab === 'biology-photosynthesis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                  6CO₂ + 6H₂O + Photons → C₆H₁₂O₆ + 6O₂
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'प्रकाश संश्लेषण व श्वसन बायोएनर्जेटिक्स' : 'Photosynthesis & Bioenergetics Lab'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getPhotosynthesisExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🌿 {isHindi ? 'प्राकृतिक परिदृश्य (1-Click Presets):' : 'Ecological Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setLightIntensity(65000); setCo2Ppm(420); setTempCelsius(26); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  ☀️ {isHindi ? 'प्रखर धूप वाला दिन' : 'Sunny Summer Day'}
                </button>
                <button
                  onClick={() => { setLightIntensity(75000); setCo2Ppm(950); setTempCelsius(28); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  🏡 {isHindi ? 'ग्रीनहाउस उच्च CO₂' : 'Greenhouse High CO2'}
                </button>
                <button
                  onClick={() => { setLightIntensity(8000); setCo2Ppm(420); setTempCelsius(22); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  🌲 {isHindi ? 'घना छायादार जंगल' : 'Deep Canopy Shade'}
                </button>
                <button
                  onClick={() => { setLightIntensity(85000); setCo2Ppm(420); setTempCelsius(48); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left cursor-pointer"
                >
                  🔥 {isHindi ? 'ग्रीष्म लहर 48°C (विकृति)' : 'Heat Wave 48°C'}
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    {isHindi ? 'प्रकाश तीव्रता (Light Intensity):' : 'Light Intensity:'}
                  </span>
                  <span className="text-amber-400 font-mono">{lightIntensity.toLocaleString()} Lux</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="2500"
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-cyan-400" />
                    {isHindi ? 'CO₂ सांद्रता (CO₂ Concentration):' : 'CO₂ Concentration:'}
                  </span>
                  <span className="text-cyan-400 font-mono">{co2Ppm} ppm</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="20"
                  value={co2Ppm}
                  onChange={(e) => setCo2Ppm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    {isHindi ? 'तापमान (Temperature):' : 'Temperature:'}
                  </span>
                  <span className="text-rose-400 font-mono">{tempCelsius}°C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="55"
                  step="1"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Limiting Factor Warning */}
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-1 text-xs">
              <span className="font-bold text-emerald-300 block flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                {isHindi ? 'ब्लैकमेन का सीमाकारी कारक (Limiting Factor):' : 'Primary Limiting Factor:'}
              </span>
              <p className="text-slate-300 font-bold">{getLimitingFactor()}</p>
            </div>
          </div>

          {/* Live Simulation & Metrics (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                {isHindi ? 'क्लोरोप्लास्ट व प्रकाशिक अभिक्रिया सिमुलेशन' : 'Live Chloroplast & Calvin Cycle'}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-black">
                {photosynthesisRate}% {isHindi ? 'दक्षता' : 'Efficiency'}
              </span>
            </div>

            {/* Visual Chloroplast Chamber */}
            <div className="relative h-52 bg-gradient-to-b from-slate-950 via-emerald-950/30 to-slate-950 rounded-2xl border border-emerald-500/30 p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-[11px] font-bold text-amber-300">
                  <Sun className="w-3.5 h-3.5 animate-spin" />
                  <span>{lightIntensity > 50000 ? '☀️ High Photon Flux' : '⛅ Low Photons'}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 text-[11px] font-bold text-cyan-300">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Stomata: {stomatalAperturePercent}% Open</span>
                </div>
              </div>

              {/* Plant leaf & oxygen bubbles */}
              <div className="flex items-center justify-around z-10">
                <div className="text-center space-y-1">
                  <div className="w-16 h-16 rounded-full bg-emerald-600/30 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Leaf className="w-8 h-8 text-emerald-300 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 block">Thylakoid Grana</span>
                </div>

                <div className="text-center space-y-1">
                  <div className="px-4 py-2 bg-cyan-950/80 border border-cyan-500/50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 block">O₂ Gas Bubbles</span>
                    <span className="text-lg font-black text-cyan-300 font-mono">+{o2ProductionMlPerMin} mL/min</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="px-4 py-2 bg-amber-950/80 border border-amber-500/50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 block">Glucose Synthesis</span>
                    <span className="text-lg font-black text-amber-300 font-mono">+{glucoseSynthesisGramsPerHour} g/hr</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 overflow-hidden z-10">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${photosynthesisRate}%` }}
                />
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getPhotosynthesisExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 10: BIOLOGY - GENETICS & PUNNETT SQUARE */}
      {/* ============================================================= */}
      {activeTab === 'biology-genetics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                  Mendel's Law of Segregation & Dominance
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'मेंडेलियन आनुवंशिकी व पुनेट स्क्वायर' : 'Genetics & Punnett Square Matrix'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getGeneticsExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🧬 {isHindi ? 'मेंडेलियन संकरण (Cross Presets):' : 'Mendelian Cross Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setParent1Alleles('Tt'); setParent2Alleles('Tt'); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-purple-300 text-left cursor-pointer"
                >
                  🌱 {isHindi ? 'Monohybrid (Tt × Tt)' : 'Tt × Tt (3:1 Ratio)'}
                </button>
                <button
                  onClick={() => { setParent1Alleles('TT'); setParent2Alleles('tt'); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  🧬 {isHindi ? 'F1 Pure (TT × tt)' : 'Pure TT × tt (100% Tt)'}
                </button>
                <button
                  onClick={() => { setParent1Alleles('Tt'); setParent2Alleles('tt'); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  🧪 {isHindi ? 'Test Cross (Tt × tt)' : 'Test Cross (1:1 Ratio)'}
                </button>
                <button
                  onClick={() => { setParent1Alleles('Tt'); setParent2Alleles('TT'); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  🌲 {isHindi ? 'Back Cross (Tt × TT)' : 'Back Cross (100% Tall)'}
                </button>
              </div>
            </div>

            {/* Genotype Selectors */}
            <div className="space-y-4">
              <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  {isHindi ? 'जनक 1 का जीनप्ररूप (Parent 1 Genotype):' : 'Parent 1 Genotype:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['TT', 'Tt', 'tt'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setParent1Alleles(g)}
                      className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                        parent1Alleles === g ? 'bg-purple-600 text-white border-purple-400 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {g} ({g === 'TT' ? 'Homo Dominant' : g === 'Tt' ? 'Heterozygous' : 'Homo Recessive'})
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300 block">
                  {isHindi ? 'जनक 2 का जीनप्ररूप (Parent 2 Genotype):' : 'Parent 2 Genotype:'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['TT', 'Tt', 'tt'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setParent2Alleles(g)}
                      className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                        parent2Alleles === g ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {g} ({g === 'TT' ? 'Homo Dominant' : g === 'Tt' ? 'Heterozygous' : 'Homo Recessive'})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Punnett Grid & Probability Breakdown (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest block flex items-center gap-2">
              <Dna className="w-4 h-4 text-purple-400" />
              {isHindi ? '4-कक्षीय पुनेट स्क्वायर संकरण ग्रिड' : 'Interactive 4-Quadrant Punnett Grid'}
            </span>

            {/* 2x2 Punnett Grid */}
            <div className="max-w-md mx-auto bg-slate-950 p-4 rounded-2xl border border-purple-500/30">
              <div className="grid grid-cols-3 gap-2 text-center items-center">
                {/* Top left empty */}
                <div className="p-2 text-[10px] font-bold text-slate-500">P1 \ P2</div>
                <div className="p-2 bg-indigo-950/80 border border-indigo-500/50 rounded-xl font-black text-indigo-300 text-sm">
                  {p2[0]}
                </div>
                <div className="p-2 bg-indigo-950/80 border border-indigo-500/50 rounded-xl font-black text-indigo-300 text-sm">
                  {p2[1]}
                </div>

                {/* Row 1 */}
                <div className="p-2 bg-purple-950/80 border border-purple-500/50 rounded-xl font-black text-purple-300 text-sm">
                  {p1[0]}
                </div>
                <div className={`p-4 rounded-xl border text-base font-black transition-all ${
                  punnettGrid[0][0] === 'tt' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  {punnettGrid[0][0]}
                  <span className="block text-[10px] font-normal text-slate-400">{punnettGrid[0][0] === 'tt' ? '🌱 Dwarf' : '🌲 Tall'}</span>
                </div>
                <div className={`p-4 rounded-xl border text-base font-black transition-all ${
                  punnettGrid[0][1] === 'tt' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  {punnettGrid[0][1]}
                  <span className="block text-[10px] font-normal text-slate-400">{punnettGrid[0][1] === 'tt' ? '🌱 Dwarf' : '🌲 Tall'}</span>
                </div>

                {/* Row 2 */}
                <div className="p-2 bg-purple-950/80 border border-purple-500/50 rounded-xl font-black text-purple-300 text-sm">
                  {p1[1]}
                </div>
                <div className={`p-4 rounded-xl border text-base font-black transition-all ${
                  punnettGrid[1][0] === 'tt' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  {punnettGrid[1][0]}
                  <span className="block text-[10px] font-normal text-slate-400">{punnettGrid[1][0] === 'tt' ? '🌱 Dwarf' : '🌲 Tall'}</span>
                </div>
                <div className={`p-4 rounded-xl border text-base font-black transition-all ${
                  punnettGrid[1][1] === 'tt' ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                }`}>
                  {punnettGrid[1][1]}
                  <span className="block text-[10px] font-normal text-slate-400">{punnettGrid[1][1] === 'tt' ? '🌱 Dwarf' : '🌲 Tall'}</span>
                </div>
              </div>
            </div>

            {/* Phenotype & Genotype Ratios */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">
                  {isHindi ? 'प्रभावी लक्षण (Tall/Dominant)' : 'Dominant Trait'}
                </span>
                <span className="text-xl font-black text-emerald-300">{dominantPercent}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">
                  {isHindi ? 'अप्रभावी लक्षण (Dwarf/Recessive)' : 'Recessive Trait'}
                </span>
                <span className="text-xl font-black text-amber-300">{recessivePercent}%</span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getGeneticsExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 11: BIOLOGY - OSMOSIS & CELL TONICITY */}
      {/* ============================================================= */}
      {activeTab === 'biology-osmosis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  Water Potential Ψw & Semi-Permeable Membrane
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'परासरण, टोनिसिटी व कोशिका स्फीति' : 'Osmosis & Cell Tonicity Lab'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getOsmosisExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Cell Type Toggle */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isHindi ? 'कोशिका का प्रकार चुनें (Cell Type):' : 'Select Cell Type:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCellType('plant')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    cellType === 'plant' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🌿 {isHindi ? 'पादप कोशिका (Plant Cell)' : 'Plant Cell (Cell Wall)'}
                </button>
                <button
                  onClick={() => setCellType('rbc')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    cellType === 'rbc' ? 'bg-rose-600 text-white border-rose-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  🩸 {isHindi ? 'मानव RBC (Animal Cell)' : 'Human RBC (No Wall)'}
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                💧 {isHindi ? 'घोल सांद्रता प्रीसेट (Tonicity Presets):' : 'Solution Tonicity:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSoluteConcentration(0.1)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  💧 {isHindi ? 'शुद्ध आसुत जल (Hypotonic)' : 'Distilled Water (0.1%)'}
                </button>
                <button
                  onClick={() => setSoluteConcentration(0.9)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  🏥 {isHindi ? 'अस्पताल सेलाइन (0.9% Isotonic)' : 'Normal Saline (0.9%)'}
                </button>
                <button
                  onClick={() => setSoluteConcentration(3.5)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  🌊 {isHindi ? 'समुद्री जल (3.5% Saline)' : 'Seawater (3.5%)'}
                </button>
                <button
                  onClick={() => setSoluteConcentration(5.0)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left cursor-pointer"
                >
                  🧂 {isHindi ? 'गाढ़ा नमक अचार (Hypertonic)' : 'Brine Salt (5.0%)'}
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{isHindi ? 'बाह्य लवण सांद्रता (Solute %):' : 'Solute Concentration:'}</span>
                <span className="text-cyan-400 font-mono">{soluteConcentration.toFixed(1)}% NaCl</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={soluteConcentration}
                onChange={(e) => setSoluteConcentration(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Microscopic Chamber (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Microscope className="w-4 h-4 text-cyan-400" />
                {isHindi ? 'माइक्रोस्कोपिक सेल चैम्बर सिमुलेशन' : 'Microscopic Osmosis Chamber'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                isHypotonic ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : isIsotonic ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isHypotonic ? 'Hypotonic (अंतःपरासरण)' : isIsotonic ? 'Isotonic (साम्यावस्था)' : 'Hypertonic (बहिःपरासरण)'}
              </span>
            </div>

            {/* Cell visual representation */}
            <div className="h-52 bg-slate-950 rounded-2xl border border-cyan-500/30 p-4 flex items-center justify-around relative overflow-hidden">
              <div className="text-center space-y-2 z-10">
                <div className={`mx-auto transition-all duration-500 flex items-center justify-center shadow-2xl ${
                  cellType === 'plant'
                    ? isHypotonic
                      ? 'w-28 h-28 rounded-xl bg-emerald-600/40 border-4 border-emerald-400'
                      : isIsotonic
                      ? 'w-24 h-24 rounded-xl bg-emerald-700/30 border-2 border-emerald-600'
                      : 'w-16 h-16 rounded-xl bg-amber-900/40 border-2 border-amber-600'
                    : isHypotonic
                    ? 'w-28 h-28 rounded-full bg-rose-600/50 border-4 border-rose-400 animate-ping'
                    : isIsotonic
                    ? 'w-24 h-24 rounded-full bg-rose-700/40 border-2 border-rose-500'
                    : 'w-16 h-16 rounded-full bg-rose-950/60 border-2 border-dashed border-rose-700'
                }`}>
                  <span className="text-xs font-black text-white">
                    {cellType === 'plant' ? (isHypotonic ? 'Turgid' : isIsotonic ? 'Flaccid' : 'Plasmolyzed') : (isHypotonic ? '💥 LYSIS!' : isIsotonic ? 'Normal RBC' : 'Crenated')}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-300 block">
                  {getOsmosisStateName()}
                </span>
              </div>

              <div className="z-10 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-400 font-bold block">Water Flux Direction:</span>
                  <span className="text-cyan-300 font-black">
                    {isHypotonic ? '➡️ Inward (H₂O Enters Cell)' : isIsotonic ? '⚖️ Zero Net Flux' : '⬅️ Outward (H₂O Leaves Cell)'}
                  </span>
                </div>
                <div className="text-slate-300">
                  <span className="text-slate-400 font-bold block">Cell Protection:</span>
                  <span className="text-emerald-400 font-black">
                    {cellType === 'plant' ? '🛡️ Rigid Cellulose Wall prevents rupture' : '⚠️ No cell wall; risk of hemolysis'}
                  </span>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getOsmosisExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 12: ELECTRONICS - DIGITAL LOGIC GATES */}
      {/* ============================================================= */}
      {activeTab === 'electronics-logic-gates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Boolean Algebra & Transistor Switching
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'डिजिटल इलेक्ट्रॉनिक्स: लॉजिक गेट्स' : 'Digital Logic Gates & Binary Lab'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getLogicGateExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Gate Selection */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isHindi ? 'लॉजिक गेट चुनें (Select Gate):' : 'Select Gate Type:'}
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as const).map(gate => (
                  <button
                    key={gate}
                    onClick={() => setSelectedGate(gate)}
                    className={`py-2 rounded-xl text-xs font-black border cursor-pointer ${
                      selectedGate === gate ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105' : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs A & B Switches */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  {isHindi ? 'इनपुट स्विच A (Input A):' : 'Input Switch A:'}
                </span>
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 cursor-pointer transition-all ${
                    inputA === 1 ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {inputA === 1 ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  <span>{inputA === 1 ? '1 (HIGH / 5V)' : '0 (LOW / 0V)'}</span>
                </button>
              </div>

              {selectedGate !== 'NOT' && (
                <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300">
                    {isHindi ? 'इनपुट स्विच B (Input B):' : 'Input Switch B:'}
                  </span>
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`px-4 py-2 rounded-xl text-xs font-black border flex items-center gap-2 cursor-pointer transition-all ${
                      inputB === 1 ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {inputB === 1 ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    <span>{inputB === 1 ? '1 (HIGH / 5V)' : '0 (LOW / 0V)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Circuit & Truth Table (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest block flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-400" />
              {isHindi ? 'लाइव बाइनरी सर्किट व सत्यता सारणी (Truth Table)' : 'Live Circuit Schematic & Truth Table'}
            </span>

            {/* Circuit Diagram */}
            <div className="h-44 bg-slate-950 rounded-2xl border border-amber-500/30 p-4 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-3 z-10">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${inputA === 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                  Input A: {inputA}
                </div>
                {selectedGate !== 'NOT' && (
                  <div className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold ${inputB === 1 ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                    Input B: {inputB}
                  </div>
                )}
              </div>

              {/* Gate Icon Box */}
              <div className="px-6 py-4 bg-amber-950/40 border-2 border-amber-400 rounded-2xl text-center shadow-xl z-10">
                <span className="text-lg font-black text-amber-300 block">{selectedGate}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedGate === 'AND' ? 'Y = A·B' : selectedGate === 'OR' ? 'Y = A+B' : selectedGate === 'NOT' ? 'Y = A̅' : selectedGate === 'NAND' ? 'Y = A̅·̅B̅' : selectedGate === 'NOR' ? 'Y = A̅+̅B̅' : selectedGate === 'XOR' ? 'Y = A⊕B' : 'Y = A⊙B'}
                </span>
              </div>

              {/* Output LED */}
              <div className="text-center space-y-1 z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-300 ${
                  gateOutput === 1 
                    ? 'bg-yellow-400 border-4 border-yellow-200 shadow-2xl shadow-yellow-400/80 animate-pulse' 
                    : 'bg-slate-900 border-2 border-slate-700'
                }`}>
                  <Lightbulb className={`w-8 h-8 ${gateOutput === 1 ? 'text-slate-950' : 'text-slate-600'}`} />
                </div>
                <span className={`text-xs font-black block ${gateOutput === 1 ? 'text-yellow-300' : 'text-slate-500'}`}>
                  Output Y: {gateOutput} ({gateOutput === 1 ? 'ON' : 'OFF'})
                </span>
              </div>
            </div>

            {/* Truth Table */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {isHindi ? 'सत्यता सारणी (Truth Table):' : 'Truth Table:'}
              </span>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2">Input A</th>
                    {selectedGate !== 'NOT' && <th className="p-2">Input B</th>}
                    <th className="p-2">Output Y</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedGate === 'NOT' ? [[0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]]).map(([a, b], idx) => {
                    const out = computeGateOutput(selectedGate, a, b);
                    const isActive = (selectedGate === 'NOT' && inputA === a) || (selectedGate !== 'NOT' && inputA === a && inputB === b);
                    return (
                      <tr key={idx} className={`border-b border-slate-900 transition-all ${isActive ? 'bg-amber-500/20 font-black text-amber-300' : 'text-slate-300'}`}>
                        <td className="p-2 font-mono">{a}</td>
                        {selectedGate !== 'NOT' && <td className="p-2 font-mono">{b}</td>}
                        <td className="p-2 font-mono">{out}</td>
                        <td className="p-2">{out === 1 ? '💡 HIGH (5V)' : '⚫ LOW (0V)'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getLogicGateExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 13: ELECTRONICS - AC TRANSFORMER COIL TURNS */}
      {/* ============================================================= */}
      {activeTab === 'electronics-transformer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                  Vs / Vp = Ns / Np = Ip / Is
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'एसी ट्रांसफॉर्मर व फेरा अनुपात' : 'AC Transformer & Turns Ratio'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getTransformerExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ⚡ {isHindi ? 'वास्तविक ट्रांसफॉर्मर प्रीसेट:' : 'Transformer Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setPrimaryVoltage(220); setPrimaryTurns(440); setSecondaryTurns(10); setLoadResistance(5); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  📱 {isHindi ? 'मोबाइल चार्जर (220V → 5V)' : 'Phone Charger (5V)'}
                </button>
                <button
                  onClick={() => { setPrimaryVoltage(11000); setPrimaryTurns(2000); setSecondaryTurns(40); setLoadResistance(10); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  🏭 {isHindi ? 'सबस्टेशन ग्रिड (11kV → 220V)' : 'Substation Grid (11kV)'}
                </button>
                <button
                  onClick={() => { setPrimaryVoltage(220); setPrimaryTurns(100); setSecondaryTurns(1000); setLoadResistance(50); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-rose-300 text-left cursor-pointer"
                >
                  ⚡ {isHindi ? 'माइक्रोवेव स्टेप-अप (2.2kV)' : 'Microwave Step-Up (2.2kV)'}
                </button>
                <button
                  onClick={() => { setPrimaryVoltage(220); setPrimaryTurns(500); setSecondaryTurns(500); setLoadResistance(20); }}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  🛡️ {isHindi ? '1:1 आइसोलेशन ट्रांसफॉर्मर' : '1:1 Isolation (220V)'}
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Primary Voltage (Vp):</span>
                  <span className="text-blue-400 font-mono">{primaryVoltage} V</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="11000"
                  step="10"
                  value={primaryVoltage}
                  onChange={(e) => setPrimaryVoltage(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Primary Turns (Np):</span>
                  <span className="text-cyan-400 font-mono">{primaryTurns} Turns</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={primaryTurns}
                  onChange={(e) => setPrimaryTurns(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Secondary Turns (Ns):</span>
                  <span className="text-amber-400 font-mono">{secondaryTurns} Turns</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={secondaryTurns}
                  onChange={(e) => setSecondaryTurns(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Visual Magnetic Core & Output Meters (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-blue-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Cable className="w-4 h-4 text-blue-400" />
                {isHindi ? 'लेमिनेटेड कोर व चुंबकीय फ्लक्स सिमुलेशन' : 'Transformer Induction Chamber'}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full text-xs font-black">
                {transformerType}
              </span>
            </div>

            {/* Core Schematic */}
            <div className="h-44 bg-slate-950 rounded-2xl border border-blue-500/30 p-4 flex items-center justify-around relative">
              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-blue-950/80 border border-blue-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Primary Coil (Np={primaryTurns})</span>
                  <span className="text-lg font-black text-blue-300 font-mono">{primaryVoltage}V AC</span>
                  <span className="text-xs text-blue-400 block">Ip = {primaryCurrent}A</span>
                </div>
              </div>

              {/* Central Core Box */}
              <div className="px-4 py-2 bg-slate-900 border-2 border-dashed border-cyan-400/60 rounded-xl text-center z-10">
                <span className="text-[10px] font-bold text-slate-400 block">Ratio (k)</span>
                <span className="text-sm font-black text-cyan-300 font-mono">{turnRatio.toFixed(3)}</span>
                <span className="text-[9px] text-slate-500 block">ΦB Flux Coupling</span>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Secondary Coil (Ns={secondaryTurns})</span>
                  <span className="text-lg font-black text-amber-300 font-mono">{secondaryVoltage}V AC</span>
                  <span className="text-xs text-amber-400 block">Is = {secondaryCurrent}A</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Secondary Output</span>
                <span className="text-base font-black text-amber-400 font-mono">{secondaryVoltage} V</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Secondary Current</span>
                <span className="text-base font-black text-cyan-400 font-mono">{secondaryCurrent} A</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Power Conserved</span>
                <span className="text-base font-black text-emerald-400 font-mono">{transformerPower} W</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getTransformerExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 14: ENGINEERING - SOLAR PHOTOVOLTAIC (PV) LAB */}
      {/* ============================================================= */}
      {activeTab === 'engineering-solar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  Pmax = G × Area × η × [1 - γ(T - 25)]
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'सोलर सेल व फोटोवोल्टिक इंजीनियरिंग' : 'Solar PV Engineering Lab'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getSolarExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Solar Tech Selector */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isHindi ? 'सोलर पैनल सिलिकॉन तकनीक:' : 'Panel Technology:'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPanelTechnology('mono')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    panelTechnology === 'mono' ? 'bg-amber-500 text-slate-950 border-amber-300 font-black' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Mono (22%)
                </button>
                <button
                  onClick={() => setPanelTechnology('poly')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    panelTechnology === 'poly' ? 'bg-blue-600 text-white border-blue-400 font-black' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Poly (17%)
                </button>
                <button
                  onClick={() => setPanelTechnology('thin-film')}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    panelTechnology === 'thin-film' ? 'bg-slate-700 text-white border-slate-500 font-black' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Thin-Film (12%)
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{isHindi ? 'धूप की तीव्रता (Irradiance):' : 'Solar Irradiance (G):'}</span>
                  <span className="text-amber-400 font-mono">{solarIrradiance} W/m²</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="25"
                  value={solarIrradiance}
                  onChange={(e) => setSolarIrradiance(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{isHindi ? 'पैनल क्षेत्रफल (Area):' : 'Panel Surface Area:'}</span>
                  <span className="text-cyan-400 font-mono">{panelArea} m²</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={panelArea}
                  onChange={(e) => setPanelArea(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">{isHindi ? 'सेल तापमान (Cell Temp):' : 'Cell Temperature:'}</span>
                  <span className="text-rose-400 font-mono">{cellTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="75"
                  step="1"
                  value={cellTemp}
                  onChange={(e) => setCellTemp(Number(e.target.value))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* PV Generation Telemetry (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                {isHindi ? 'लाइव सोलर इन्वर्टर व ग्रिड उत्पादन' : 'Live Solar PV Generation'}
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black">
                {peakPowerWatts} Watts Output
              </span>
            </div>

            {/* Visual Panel Array */}
            <div className="h-44 bg-slate-950 rounded-2xl border border-amber-500/30 p-4 flex items-center justify-around relative overflow-hidden">
              <div className="text-center space-y-1 z-10">
                <div className="w-16 h-16 bg-blue-950/80 border-2 border-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <Layers className="w-8 h-8 text-blue-300" />
                </div>
                <span className="text-[10px] text-slate-400 block">Silicon Array</span>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Peak Generation</span>
                  <span className="text-xl font-black text-amber-300 font-mono">{(peakPowerWatts/1000).toFixed(2)} kW</span>
                </div>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Daily Energy Yield</span>
                  <span className="text-xl font-black text-emerald-300 font-mono">{dailyEnergyKwh} Units</span>
                </div>
              </div>
            </div>

            {/* Household Appliances Supported */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">LED Bulbs (10W)</span>
                <span className="text-base font-black text-yellow-300 font-mono">{Math.floor(peakPowerWatts / 10)} Bulbs</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Ceiling Fans (75W)</span>
                <span className="text-base font-black text-cyan-300 font-mono">{Math.floor(peakPowerWatts / 75)} Fans</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Annual CO₂ Saved</span>
                <span className="text-base font-black text-emerald-300 font-mono">{annualCo2SavedKg} kg CO₂</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getSolarExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 15: SPACE - ORBITAL & ESCAPE VELOCITY LAB */}
      {/* ============================================================= */}
      {activeTab === 'space-orbital' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090D16] border border-slate-800 p-5 sm:p-6 rounded-3xl space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  vo = √(GM/r) | ve = √(2GM/r)
                </span>
                <h2 className="text-base font-extrabold text-white mt-1">
                  {isHindi ? 'कक्षीय वेग, पलायन वेग व उपग्रह यांत्रिकी' : 'Orbital Mechanics & Escape Velocity'}
                </h2>
              </div>
              <button
                onClick={() => handleSpeakActiveLab(getSpaceExplanation())}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Listen Explanation"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Celestial Body Selection */}
            <div className="space-y-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                {isHindi ? 'खगोलीय पिंड चुनें (Celestial Body):' : 'Select Celestial Body:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['earth', 'moon', 'mars', 'jupiter'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setTargetPlanet(p)}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                      targetPlanet === p ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-md' : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {planetData[p].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Orbit Altitude Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                🛰️ {isHindi ? 'कक्षा ऊंचाई प्रीसेट (Orbit Presets):' : 'Orbit Altitude Presets:'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrbitalAltitudeKm(400)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-cyan-300 text-left cursor-pointer"
                >
                  🚀 {isHindi ? 'ISS स्टेशन (400 km)' : 'ISS Station (400 km)'}
                </button>
                <button
                  onClick={() => setOrbitalAltitudeKm(540)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-purple-300 text-left cursor-pointer"
                >
                  🔭 {isHindi ? 'हबल टेलिस्कोप (540 km)' : 'Hubble Telescope (540 km)'}
                </button>
                <button
                  onClick={() => setOrbitalAltitudeKm(20200)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-amber-300 text-left cursor-pointer"
                >
                  📍 {isHindi ? 'GPS उपग्रह (20,200 km)' : 'GPS Constellation'}
                </button>
                <button
                  onClick={() => setOrbitalAltitudeKm(35786)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] font-bold text-emerald-300 text-left cursor-pointer"
                >
                  🛰️ {isHindi ? 'भूस्थिर कक्षा (GEO 35,786 km)' : 'Geostationary (35,786 km)'}
                </button>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">{isHindi ? 'कक्षा की ऊंचाई (Altitude):' : 'Orbital Altitude (h):'}</span>
                <span className="text-cyan-400 font-mono">{orbitalAltitudeKm.toLocaleString()} km</span>
              </div>
              <input
                type="range"
                min="100"
                max="36000"
                step="100"
                value={orbitalAltitudeKm}
                onChange={(e) => setOrbitalAltitudeKm(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Space Orbit Chamber (7 Cols) */}
          <div className="lg:col-span-7 bg-[#060A12] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <Orbit className="w-4 h-4 text-cyan-400" />
                {isHindi ? 'कक्षीय गति व अंतरिक्ष टेलीमेट्री' : 'Orbital Dynamics Telemetry'}
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-black">
                {currentPlanet.name}
              </span>
            </div>

            {/* Space Visual */}
            <div className="h-44 bg-slate-950 rounded-2xl border border-cyan-500/30 p-4 flex items-center justify-around relative overflow-hidden">
              <div className="text-center space-y-1 z-10">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentPlanet.color} flex items-center justify-center mx-auto shadow-2xl`}>
                  <span className="text-xs font-black text-white">{currentPlanet.name.split(' ')[0]}</span>
                </div>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-cyan-950/80 border border-cyan-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Orbital Velocity (vo)</span>
                  <span className="text-xl font-black text-cyan-300 font-mono">{orbitalVelocityKmS} km/s</span>
                </div>
              </div>

              <div className="text-center space-y-1 z-10">
                <div className="p-3 bg-amber-950/80 border border-amber-500/50 rounded-2xl">
                  <span className="text-[10px] text-slate-400 block">Escape Velocity (ve)</span>
                  <span className="text-xl font-black text-amber-300 font-mono">{escapeVelocityKmS} km/s</span>
                </div>
              </div>
            </div>

            {/* Telemetry Cards */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Orbital Period (T)</span>
                <span className="text-base font-black text-cyan-300 font-mono">{orbitalPeriodMinutes} min</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Speed in km/h</span>
                <span className="text-base font-black text-amber-400 font-mono">{Math.round(parseFloat(orbitalVelocityKmS) * 3600).toLocaleString()} km/h</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 block">Velocity Ratio</span>
                <span className="text-base font-black text-emerald-400 font-mono">ve = √2 × vo</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
              <p className="text-slate-200 leading-relaxed">
                {getSpaceExplanation()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* LAB VIEW 9: CUSTOM AI FORMULA SOLVER */}
      {/* ============================================================= */}
      {activeTab === 'custom-solver' && (
        <div className="max-w-4xl mx-auto bg-[#090D16] border border-cyan-500/40 p-6 rounded-3xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{isHindi ? 'AI मास्टर साइंस फॉर्मूला सॉल्वर' : 'AI Science Formula Master'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isHindi ? 'भौतिकी, रसायन या गणित का कोई भी सूत्र लिखें (जैसे: "Bernoulli theorem", "Photoelectric effect", "pH of 0.05M H2SO4")' : 'Enter any physics, chemistry, or maths formula to get step-by-step substitution and real-life analysis.'}
            </p>
          </div>

          <form onSubmit={handleSolveCustomFormula} className="flex gap-2">
            <input
              type="text"
              value={customFormulaQuery}
              onChange={(e) => setCustomFormulaQuery(e.target.value)}
              placeholder="e.g. Kinetic Energy when mass=15kg, v=20m/s / Archimedes Principle / Newton Law of Cooling"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={isSolving || !customFormulaQuery.trim()}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer border-none"
            >
              {isSolving ? (isHindi ? 'हल हो रहा है...' : 'Solving...') : (isHindi ? 'हल निकालें' : 'Solve')}
            </button>
          </form>

          {solverResult && (
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                  {isHindi ? '✅ चरणबद्ध हल व प्रैक्टिकल व्याख्या' : 'Step-by-Step Solution'}
                </span>
                <button
                  onClick={() => handleSpeakActiveLab(solverResult)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {solverResult}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
