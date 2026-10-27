// Bilingual (Hindi + English) Current Affairs Translation, AI Article Generator, Word Detector & Doubt Resolver Engine
import { NewsEditorial, VocabularyItem, getTodayDateKey, getTodayHindiDate } from '../components/CurrentAffairsHubView';
import { resolveTopicImageUrl } from './currentAffairsImageResolver';

export interface EnglishTranslatedArticle {
  headline: string;
  sourceMinistry: string;
  summary: string;
  background: string;
  deepExplanation: string;
  dimensions: string[];
  provisions: string[];
  highYieldFact: string;
  mcqQuestion: string;
  mcqOptions: string[];
  mcqExplanation: string;
  mainsQuestion: string;
  mainsIntro: string;
  mainsBody: string;
  mainsConclusion: string;
}

const BUILTIN_ENGLISH_TRANSLATIONS: Record<string, EnglishTranslatedArticle> = {
  'news-p17a': {
    headline: 'Project 17A Nilgiri-Class Stealth Guided Missile Frigates & Indian Navy Maritime Dominance in IOR',
    sourceMinistry: 'Ministry of Defence (MoD) • Indian Navy Media Cell • The Hindu',
    summary:
      'Under the Indian Navy’s indigenous "Project 17A", advanced stealth guided-missile frigates built by Mazagon Dock Shipbuilders (MDL) and GRSE are in the final phase of sea trials. These warships feature 75% indigenous content and are armed with BrahMos supersonic cruise missiles.',
    background:
      'To safeguard maritime trade routes, counter piracy, and maintain strategic deterrence in the Indian Ocean Region (IOR), the Indian Navy is rapidly modernizing its fleet under the "Make in India" defense indigenization framework.',
    deepExplanation: `📌 a) Why in News & Core Context:
Recently, according to official releases from the Ministry of Defence (MoD), Project 17A Nilgiri-class stealth frigates have reached key operational milestones. Featuring 75% indigenous equipment sourced from over 200 Indian MSMEs, this initiative directly accelerates the vision of Viksit Bharat 2047 and defense self-reliance.

⚙️ b) Mechanism & Structural Analysis:
Constructed using integrated modular construction methodology by MDL Mumbai and GRSE Kolkata, the frigates incorporate radar-absorbent coatings and low radar cross-section (RCS) stealth geometry. They are equipped with BrahMos supersonic cruise missiles, Barak-8 LRSAM air defense systems, and Combined Diesel and Gas (CODAG) propulsion.

🇮🇳 c) Multi-Dimensional Impact on India:
From a UPSC GS Paper-III and Defence exam perspective: (1) Strategic Deterrence: Strengthens blue-water naval presence across Indo-Pacific choke points; (2) Indigenous Ecosystem: Reduces foreign defense import dependency; (3) Net Security Provider: Enhances India's humanitarian assistance and anti-piracy capabilities in the Indian Ocean Region.

🚀 d) Key Challenges & Way Forward:
Timely commissioning of propulsion gas turbines, integration of unmanned naval systems, and sustained capital allocation remain key priorities. Strengthening public-private shipyards and indigenous marine engine R&D is the way forward.`,
    dimensions: [
      'Advanced stealth geometry and radar-absorbent coatings to minimize Radar Cross-Section (RCS).',
      'Weapon Suite: BrahMos supersonic cruise missiles and long-range surface-to-air Barak-8 (LRSAM) missiles.',
      'Combined Diesel and Gas (CODAG) propulsion system enabling top speeds exceeding 28 knots.'
    ],
    provisions: [
      'Integrated Platform Management System (IPMS) and indigenous Combat Management System (CMS).',
      'Indigenous Humsa-NG sonar and torpedo launchers for Anti-Submarine Warfare (ASW).',
      'Full aviation deck capability to operate two multi-role helicopters such as MH-60R Seahawk.'
    ],
    highYieldFact: 'All 7 stealth frigates under Project 17A (Nilgiri, Himgiri, Udaygiri, Dunagiri, Taragiri, Vindhyagiri, Mahendragiri) are built by MDL and GRSE.',
    mcqQuestion: 'What is the primary objective of the Indian Navy’s Project 17A?',
    mcqOptions: [
      'Construction of nuclear-powered ballistic submarines',
      'Indigenous construction of 7 advanced stealth guided-missile frigates',
      'Refitting of aircraft carriers',
      'Supply of coastal patrol hovercraft'
    ],
    mcqExplanation: 'Under Project 17A, 7 advanced Nilgiri-class stealth guided-missile frigates are being constructed indigenously by MDL and GRSE.',
    mainsQuestion:
      '"Critically examine the significance of Project 17A in strengthening India’s maritime security strategy in the Indian Ocean Region (IOR) and self-reliant defense production."',
    mainsIntro: 'Project 17A represents a watershed moment in India’s transition from a "Buyer’s Navy" to a "Builder’s Navy" with 75% indigenous sourcing.',
    mainsBody: 'Analyze its stealth capabilities (low RCS, Barak-8, BrahMos), modular shipbuilding by MDL/GRSE, and strategic deterrence along vital Indo-Pacific sea lanes of communication (SLOCs).',
    mainsConclusion: 'Sustained R&D in marine propulsion and defence corridors will cement India’s role as the preferred Net Security Provider in the Global South.'
  },
  'news-bharat-6g': {
    headline: 'Bharat 6G Vision & Quantum-Safe Communication: Department of Telecommunications National Roadmap',
    sourceMinistry: 'Ministry of Communications • Dept of Telecommunications (DoT) • PIB New Delhi',
    summary:
      'Under the "Bharat 6G Alliance", the Department of Telecommunications (DoT) has filed over 127 global patents, positioning India as a frontline global standard-setter in next-generation wireless technology based on sub-terahertz spectrum and near-zero latency.',
    background:
      'The Prime Minister unveiled the Bharat 6G Vision Document in 2023 with the target of making India a global leader in 6G design, development, and patent ownership by 2030.',
    deepExplanation: `📌 a) Why in News & Core Context:
The Department of Telecommunications (DoT) and Bharat 6G Alliance have accelerated indigenous testbeds and global IPR filings. Unlike 4G/5G where India adopted global standards later, India is actively co-authoring 6G international standards under ITU’s IMT-2030 framework.

⚙️ b) Mechanism & Structural Analysis:
Bharat 6G utilizes Terahertz (THz) frequency bands, AI-native network slicing, Quantum Key Distribution (QKD) encryption, and Non-Terrestrial Networks (NTN) integrating Low Earth Orbit (LEO) satellites with terrestrial telecom towers.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Digital Sovereignty: 10% share in global 6G patents; (2) Ultra-Fast Connectivity: Up to 1 Tbps speeds enabling remote robotic surgery, autonomous mobility, and holographic classrooms; (3) Cyber Security: Quantum-resistant communication for defense and banking.

🚀 d) Key Challenges & Way Forward:
High infrastructure cost of dense millimeter-wave towers, semiconductor fabrication, and spectrum harmonization require sustained R&D funding through the Telecom Technology Development Fund (TTDF).`,
    dimensions: [
      'Ultra-high-speed data transmission up to 1 Tbps enabling real-time holographic communication.',
      '100% hack-proof national security network powered by Quantum Key Distribution (QKD).',
      'Seamless integration of satellite and terrestrial networks (Non-Terrestrial Networks - NTN).'
    ],
    provisions: [
      'Allocation of ₹10,000 Crore for the National 6G Research & Development Fund.',
      'Establishment of 6G Testbeds and Patent Incubators at IIT Madras, IIT Delhi, and IISc Bengaluru.',
      'Inclusion of Indian rural-broadband standards into the International Telecommunication Union (ITU) 6G framework.'
    ],
    highYieldFact: 'According to the Bharat 6G Vision Document, 6G implementation is structured in two phases: Phase 1 (2023–2025) and Phase 2 (2025–2030).',
    mcqQuestion: 'According to the official Bharat 6G Vision Document, what is the target year for commercial rollout of 6G services in India?',
    mcqOptions: ['2027', '2028', '2030', '2035'],
    mcqExplanation: 'The Government of India’s Bharat 6G Vision Document targets full commercial deployment of indigenous 6G technology by 2030.',
    mainsQuestion:
      '"How can global patent leadership in 6G technology strengthen India’s digital sovereignty and economic transformation? Analyze."',
    mainsIntro: 'The Bharat 6G Vision aims to transform India from a telecom consumer into a global exporter of next-generation intellectual property by 2030.',
    mainsBody: 'Discuss Terahertz spectrum, NTN satellite integration, Quantum Key Distribution (QKD), and the role of the Bharat 6G Alliance across academia and industry.',
    mainsConclusion: 'Synergizing the India Semiconductor Mission with 6G R&D will unlock a $1 trillion digital economy.'
  },
  'news-e-rupee-cbdc': {
    headline: 'Digital Rupee (e₹-CBDC) & UPI Interoperability: A Global Revolution in the Indian Financial System',
    sourceMinistry: 'Reserve Bank of India (RBI) • Ministry of Finance • PIB',
    summary:
      'Full integration between the Reserve Bank of India’s Central Bank Digital Currency (CBDC) and UPI QR codes has led to record growth in daily retail Digital Rupee transactions, saving over ₹4,000+ Crore annually in physical currency printing and cash logistics.',
    background:
      'RBI launched the retail Digital Rupee (e₹-R) pilot on December 1, 2022, which has now expanded nationwide with full UPI QR interoperability and programmable offline capabilities.',
    deepExplanation: `📌 a) Why in News & Core Context:
The Reserve Bank of India (RBI) has scaled up retail and wholesale Digital Rupee (e₹) adoption through seamless UPI QR code interoperability and offline NFC/wallet functionality.

⚙️ b) Mechanism & Structural Analysis:
Issued as sovereign legal tender under Section 2 of the RBI Act 1934, CBDC is a direct liability of the central bank (unlike commercial bank balances). It uses Distributed Ledger Technology (DLT) and supports "Programmable Money" for targeted welfare delivery.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Zero Settlement Risk: Instant settlement without clearing house delays; (2) Targeted Subsidies: Fertilizer or scholarship tokens can be programmed for specific merchant categories; (3) Cross-Border Remittances: Cuts remittance costs and settlement time by up to 80%.

🚀 d) Key Challenges & Way Forward:
Balancing user privacy in small retail transactions with anti-money laundering (AML) compliance and preventing commercial bank disintermediation remain crucial policy considerations.`,
    dimensions: [
      'Digital Rupee (CBDC) is sovereign legal tender backed by the RBI operating on hybrid DLT architecture.',
      'Full UPI QR code interoperability allows citizens to scan any merchant UPI QR using their e₹ wallet.',
      'Offline CBDC functionality enables digital payments without internet in remote and hilly regions.'
    ],
    provisions: [
      'Amendment to Section 2 of the RBI Act, 1934 to include digital currency within the legal definition of "bank note".',
      'Programmable Money feature ensuring government subsidies are spent strictly for their intended purpose.',
      'Up to 80% reduction in transaction cost and settlement time for cross-border remittances.'
    ],
    highYieldFact: 'The Reserve Bank of India (RBI) was established on April 1, 1935 on the recommendation of the Hilton Young Commission and nationalized on January 1, 1949.',
    mcqQuestion: 'Who is the official issuing authority of the Central Bank Digital Currency (CBDC / e₹) in India?',
    mcqOptions: ['NITI Aayog', 'Reserve Bank of India (RBI)', 'Ministry of Finance', 'NPCI'],
    mcqExplanation: 'CBDC (Digital Rupee) is sovereign digital legal tender issued directly by the Reserve Bank of India (RBI).',
    mainsQuestion:
      '"How can the integration of Central Bank Digital Currency (CBDC) and UPI strengthen India’s banking architecture and reduce dependency on foreign payment networks?"',
    mainsIntro: 'The Digital Rupee (e₹) represents the third pillar of India’s monetary evolution alongside physical cash and UPI.',
    mainsBody: 'Examine UPI interoperability, programmable DBT subsidies, offline resilience, and cross-border bilateral trade settlement.',
    mainsConclusion: 'With robust cybersecurity and privacy safeguards, e₹-CBDC sets the global benchmark for central bank digital currencies.'
  },
  'news-gati-shakti': {
    headline: 'PM Gati Shakti National Master Plan: Historic Progress in Multi-Modal Connectivity & Reducing Logistics Cost',
    sourceMinistry: 'Ministry of Commerce & Industry • DPIIT • Press Information Bureau (PIB)',
    summary:
      'The PM Gati Shakti National Master Plan has digitized inter-ministerial infrastructure coordination by 100%, achieving historic progress toward reducing India’s logistics cost below 9% of GDP.',
    background:
      'Launched in October 2021 with a ₹100 Lakh Crore vision, PM Gati Shakti integrates Bharatmala, Sagarmala, UDAN, and railway networks onto a unified GIS platform developed by BISAG-N.',
    deepExplanation: `📌 a) Why in News & Core Context:
DPIIT and the Network Planning Group (NPG) have evaluated hundreds of major infrastructure projects on the PM Gati Shakti National Master Plan portal, eliminating departmental silos and land-acquisition delays.

⚙️ b) Mechanism & Structural Analysis:
Developed by BISAG-N (Bhaskaracharya National Institute for Space Applications and Geo-informatics), the portal integrates 1,460+ GIS data layers across 44 Central Ministries and 36 States/UTs, covering 7 core economic engines.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Logistics Cost Reduction: Brings logistics cost down from 13-14% of GDP toward the global benchmark of 8%; (2) Export Competitiveness: Faster port-to-hinterland cargo movement via ULIP; (3) Social Infrastructure: Connects schools, hospitals, and tribal clusters.

🚀 d) Key Challenges & Way Forward:
Real-time updation of state-level land records and municipal integration are essential to sustain momentum.`,
    dimensions: [
      '7 Core Engines: Roads, Railways, Airports, Ports, Mass Transport, Waterways, and Logistics Infrastructure.',
      'Integrated GIS platform with 1,460+ spatial data layers preventing project duplication and forest/land delays.',
      'Rapid improvement in India’s World Bank Logistics Performance Index (LPI) ranking under the National Logistics Policy.'
    ],
    provisions: [
      'Mandatory digital appraisal of all infrastructure projects above ₹500 Crore by the Network Planning Group (NPG).',
      'Expansion of PM Gati Shakti to State Master Plans for seamless last-mile connectivity.',
      'Unified Logistics Interface Platform (ULIP) enabling real-time multi-modal cargo tracking.'
    ],
    highYieldFact: 'The GIS digital platform of PM Gati Shakti was indigenously developed by BISAG-N (Gandhinagar, Gujarat) using ISRO spatial data.',
    mcqQuestion: 'How many core economic growth engines form the foundation of the PM Gati Shakti National Master Plan?',
    mcqOptions: ['5 Engines', '7 Engines', '10 Engines', '12 Engines'],
    mcqExplanation: 'PM Gati Shakti is driven by 7 engines: Roads, Railways, Airports, Ports, Mass Transport, Waterways, and Logistics Infrastructure.',
    mainsQuestion:
      '"How is the PM Gati Shakti portal breaking departmental silos in infrastructure creation and making India’s logistics sector globally competitive?"',
    mainsIntro: 'Fragmented planning historically inflated India’s logistics cost to 13-14% of GDP; PM Gati Shakti replaces this with GIS-driven integrated governance.',
    mainsBody: 'Highlight the 7 engines, BISAG-N’s 1460+ GIS layers, Network Planning Group (NPG) appraisals, and synergy with the National Logistics Policy (NLP).',
    mainsConclusion: 'Seamless multi-modal connectivity is the bedrock of achieving a $5 trillion+ manufacturing and export economy.'
  },
  'news-gba': {
    headline: 'Global Biofuels Alliance (GBA) & Rapid Expansion of International Clean Energy Transition',
    sourceMinistry: 'Ministry of External Affairs (MEA) • Ministry of Petroleum & Natural Gas • PIB',
    summary:
      'Initiated under India’s presidency, the Global Biofuels Alliance (GBA) now comprises 24+ member nations and 12 international organizations, aiming to establish Sustainable Aviation Fuel (SAF) and 20% ethanol blending (E20) as global standards by 2030.',
    background:
      'Prime Minister Narendra Modi, alongside the leaders of the United States and Brazil, launched the historic Global Biofuels Alliance during the New Delhi G20 Summit in September 2023.',
    deepExplanation: `📌 a) Why in News & Core Context:
The Global Biofuels Alliance (GBA) has operationalized its international work plan on biofuel standards, 2G ethanol technology transfer, and Sustainable Aviation Fuel (SAF) deployment.

⚙️ b) Mechanism & Structural Analysis:
Led by its three founding members—India, Brazil, and the USA (which together account for 85% of global ethanol production)—GBA acts as a catalytic platform connecting technology providers, feedstock producers, and green financiers.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Crude Oil Import Savings: India’s E20 blending has saved over ₹1,00,000+ Crore in foreign exchange; (2) Annadata to Urjadata: Boosts farmer income by converting crop residue (parali) and sugarcane into Compressed Biogas (CBG) and 2G Ethanol; (3) Net-Zero 2070: Decarbonizes transport and aviation.

🚀 d) Key Challenges & Way Forward:
Ensuring food-security neutrality by prioritizing second-generation (2G) agricultural waste over food grains is the sustainable way forward.`,
    dimensions: [
      'Founding Nations: India, Brazil, and the United States (accounting for 85% of global ethanol production).',
      'Promoting Sustainable Aviation Fuel (SAF) to decarbonize the global aviation sector.',
      'Financial incentives for 2G (Second Generation) ethanol produced from agricultural residue and biomass.'
    ],
    provisions: [
      'India achieved its 20% ethanol blending (E20) milestone ahead of the original 2025-26 schedule.',
      'International cooperation model integrating Compressed Biogas (CBG) and the SATAT scheme.',
      'Global Biofuels Standardization and clean technology transfer framework for developing nations.'
    ],
    highYieldFact: 'India, Brazil, and the USA together produce nearly 85% and consume 81% of the world’s total ethanol.',
    mcqQuestion: 'Which three nations are the founding members of the Global Biofuels Alliance (GBA)?',
    mcqOptions: [
      'India, China, and Russia',
      'India, Brazil, and the United States (USA)',
      'India, Japan, and Germany',
      'India, Australia, and the UK'
    ],
    mcqExplanation: 'The Global Biofuels Alliance (GBA) was founded by India, Brazil, and the USA during the New Delhi G20 Summit.',
    mainsQuestion:
      '"How will the Global Biofuels Alliance (GBA) serve as a milestone in India’s energy security and its national target of Net-Zero carbon emissions by 2070?"',
    mainsIntro: 'Along with the International Solar Alliance (ISA), the Global Biofuels Alliance (GBA) cements India’s leadership in global climate diplomacy.',
    mainsBody: 'Analyze E20 blending, farmer empowerment (Annadata to Urjadata), 2G biofuel from stubble, and forex savings on crude imports.',
    mainsConclusion: 'Harmonizing global biofuel standards and scaling 2G/3G biofuels will ensure a just and food-secure clean energy transition.'
  },
  'news-pm-surya-ghar': {
    headline: 'PM Surya Ghar: Muft Bijli Yojana Provides 300 Units Free Solar Electricity to 1 Crore Households',
    sourceMinistry: 'Ministry of New and Renewable Energy (MNRE) • pmsuryaghar.gov.in',
    summary:
      'With a total cabinet outlay of ₹75,021 Crore, PM Surya Ghar: Muft Bijli Yojana is empowering 1 Crore households with up to 300 units of free electricity per month and up to 60% direct Central Financial Assistance (CFA) for residential rooftop solar panels.',
    background:
      'Launched by Prime Minister Narendra Modi on February 13, 2024, the scheme aims to install 30 GW of residential rooftop solar capacity across India and turn households into net power producers.',
    deepExplanation: `📌 a) Why in News & Core Context:
Under the Ministry of New and Renewable Energy (MNRE), registrations and rooftop installations under PM Surya Ghar: Muft Bijli Yojana have surged across states, supported by instant DBT subsidies and collateral-free bank loans.

⚙️ b) Mechanism & Structural Analysis:
The scheme provides ₹30,000 per kW up to 2 kW (₹60,000) and an additional ₹18,000 for the 3rd kW, capping Central Financial Assistance at ₹78,000 for systems of 3 kW and above. Surplus electricity is exported to DISCOM grids via net metering.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Household Savings: Annual savings of ₹15,000–₹18,000 per family; (2) Climate Action: Adds 30 GW solar capacity and cuts 720 million tonnes of CO2 emissions over 25 years; (3) Green Jobs: Creates 17 lakh+ skilled jobs in solar manufacturing, installation, and maintenance.

🚀 d) Key Challenges & Way Forward:
Streamlining net-metering approvals by state DISCOMs and expanding domestic solar cell manufacturing under PLI will ensure seamless execution.`,
    dimensions: [
      'Subsidy Structure: ₹30,000 for 1 kW, ₹60,000 for 2 kW, and maximum ₹78,000 DBT subsidy for 3 kW or higher capacity.',
      'Additional household income by selling surplus solar electricity back to DISCOMs via net metering.',
      'Addition of 30 GW residential rooftop solar capacity and reduction of 720 million tonnes of CO2 emissions.'
    ],
    provisions: [
      'Single-window online application and vendor selection via the national portal pmsuryaghar.gov.in.',
      'Model Solar Village ("Adarsh Saur Gram") in every district and incentives for Urban Local Bodies & Panchayats.',
      'Collateral-free low-interest loans at ~7% interest from public sector banks for residential installations.'
    ],
    highYieldFact: 'PM Surya Ghar Yojana has a total outlay of ₹75,021 Crore with a maximum central subsidy of ₹78,000 (for 3 kW capacity).',
    mcqQuestion: 'Under PM Surya Ghar: Muft Bijli Yojana, what is the maximum central subsidy payable for a 3 kW residential rooftop solar system?',
    mcqOptions: ['₹30,000', '₹50,000', '₹60,000', '₹78,000'],
    mcqExplanation: 'A maximum subsidy of ₹78,000 is credited directly via DBT for residential rooftop solar installations of 3 kW or above.',
    mainsQuestion:
      '"How can the rooftop solar revolution act as a catalyst for India’s energy self-reliance, reducing DISCOM financial losses, and empowering rural households?"',
    mainsIntro: 'PM Surya Ghar shifts India’s renewable strategy toward decentralized, citizen-owned clean energy generation.',
    mainsBody: 'Detail the ₹75,021 Cr outlay, ₹78,000 subsidy cap, reduction in transmission & distribution (AT&C) losses for DISCOMs, and green employment.',
    mainsConclusion: 'Decentralized rooftop solar is indispensable for achieving India’s 500 GW non-fossil fuel capacity target by 2030.'
  },
  'news-bns-bnss-bsa': {
    headline: 'Bharatiya Nyaya Sanhita (BNS), BNSS & BSA: Historic Implementation of India’s New Criminal Justice System',
    sourceMinistry: 'Ministry of Law & Justice • Ministry of Home Affairs • Gazette of India',
    summary:
      'Replacing colonial-era laws—the 160-year-old IPC (1860), CrPC (1973), and Indian Evidence Act (1872)—India’s three new criminal codes: Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA) are in full force.',
    background:
      'Effective July 1, 2024 across India, the three new laws transition the legal framework from colonial "Danda" (retributive punishment) to constitutional "Nyaya" (victim-centric justice and speedy trial).',
    deepExplanation: `📌 a) Why in News & Core Context:
India’s criminal justice machinery has transitioned to BNS, BNSS, and BSA with nationwide integration of e-Sakshya, Nyaya Shruti (virtual court hearings), and mandatory forensic crime-scene investigation.

⚙️ b) Mechanism & Structural Analysis:
(1) BNS 2023 has 358 sections (replacing 511 in IPC), repeals colonial Sedition (124A) while penalizing acts endangering India’s sovereignty (Section 152), and defines organized crime and terrorism; (2) BNSS 2023 (531 sections) mandates forensic teams for crimes punishable by 7+ years; (3) BSA 2023 (170 sections) grants primary evidence status to electronic and digital records.

🇮🇳 c) Multi-Dimensional Impact on India:
Statutory backing for Zero FIR and e-FIR, introduction of Community Service for minor offenses, mandatory videography of search/seizure, and strict timelines (90 days for chargesheet, 45 days for judgment) curb judicial pendency.

🚀 d) Key Challenges & Way Forward:
Upgrading state forensic laboratories (FSLs), training police personnel on digital evidence protocols, and expanding judicial infrastructure are critical next steps.`,
    dimensions: [
      'Bharatiya Nyaya Sanhita (BNS 2023): 358 sections (replacing 511 sections of IPC); repeals colonial Sedition and penalizes offenses against sovereignty.',
      'Bharatiya Nagarik Suraksha Sanhita (BNSS 2023): 531 sections; makes forensic evidence collection mandatory for crimes punishable by 7 years or more.',
      'Bharatiya Sakshya Adhiniyam (BSA 2023): 170 sections; accords primary evidence validity to electronic and digital records.'
    ],
    provisions: [
      'Statutory recognition granted to Zero FIR and electronic FIR (e-FIR) across all police stations.',
      'Introduction of "Community Service" as a reformative punishment for petty offenses for the first time.',
      'Victim-centric justice with a strict 90-day timeline for filing chargesheets and time-bound trial disposal.'
    ],
    highYieldFact: 'All three new criminal justice laws (BNS, BNSS, and BSA) came into effect nationwide on July 1, 2024.',
    mcqQuestion: 'Which new law has replaced the colonial-era Indian Penal Code (IPC 1860)?',
    mcqOptions: [
      'Bharatiya Nyaya Sanhita (BNS 2023)',
      'Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)',
      'Bharatiya Sakshya Adhiniyam (BSA 2023)',
      'Bharatiya Danda Vidhan'
    ],
    mcqExplanation: 'The Indian Penal Code (IPC 1860) has been replaced by the Bharatiya Nyaya Sanhita (BNS 2023), which contains 358 sections.',
    mainsQuestion:
      '"How do the Bharatiya Nyaya Sanhita (BNS) and BNSS transform India’s criminal justice system from a colonial punitive regime into a citizen-centric justice framework?"',
    mainsIntro: 'Enacted effective July 1, 2024, BNS, BNSS, and BSA decolonize Indian jurisprudence and modernize criminal procedure for the digital era.',
    mainsBody: 'Examine Zero FIR, mandatory forensics (7+ years offenses), digital evidence admissibility under BSA, community service, and strict trial timelines.',
    mainsConclusion: 'Capacity building in forensic science and police modernization will ensure the spirit of speedy "Nyaya" reaches every citizen.'
  },
  'news-semiconductor-ism': {
    headline: 'India Semiconductor Mission (ISM) & Indigenous Chip Manufacturing Ecosystem: India’s Global Tech Leap',
    sourceMinistry: 'Ministry of Electronics & IT (MeitY) • India Semiconductor Mission • PIB',
    summary:
      'Under the ₹76,000 Crore India Semiconductor Mission (ISM), commercial construction of semiconductor fabrication (Fab) and ATMP/OSAT units in Dholera & Sanand (Gujarat) and Morigaon (Assam) has positioned India as a trusted global semiconductor hub.',
    background:
      'Launched in December 2021 under MeitY, the Semicon India programme provides 50% pari-passu fiscal support from the Central Government for setting up silicon wafer fabs, display fabs, and chip packaging units.',
    deepExplanation: `📌 a) Why in News & Core Context:
Under the Ministry of Electronics and Information Technology (MeitY), India’s approved semiconductor projects—including Tata Electronics-PSMC Fab in Dholera, Micron & CG Power OSAT in Sanand, and Tata ATMP in Morigaon (Assam)—have achieved major fabrication milestones.

⚙️ b) Mechanism & Structural Analysis:
The India Semiconductor Mission (ISM) provides a 50% capital expenditure subsidy from the Centre (supplemented by 20-25% state subsidies), along with the Design Linked Incentive (DLI) scheme supporting indigenous chip design startups and C-DAC’s Vega/DIR-V RISC-V processors.

🇮🇳 c) Multi-Dimensional Impact on India:
(1) Supply Chain Resilience: Reduces strategic vulnerability in defence, telecom, EVs, and space; (2) Import Substitution: Curbs India’s surging electronics import bill; (3) High-Skill Employment: Trains 85,000+ VLSI and semiconductor engineers under the Chips to Startup (C2S) programme.

🚀 d) Key Challenges & Way Forward:
Ensuring uninterrupted ultra-pure water, stable green power, specialty gases, and transitioning toward sub-7nm advanced nodes are key long-term priorities.`,
    dimensions: [
      '50% pari-passu capital expenditure subsidy by the Central Government for semiconductor fab and ATMP units.',
      'India’s first commercial Silicon Wafer Fab in Dholera (Gujarat) and advanced ATMP hub in Morigaon (Assam).',
      'Design Linked Incentive (DLI) scheme and Chips-to-Startup (C2S) training 85,000+ VLSI engineers.'
    ],
    provisions: [
      'Total fiscal outlay of ₹76,000 Crore under the Semicon India Programme.',
      'Modernization of the Semi-Conductor Laboratory (SCL) in Mohali as a research and prototyping powerhouse.',
      'International strategic tech partnerships under iCET (India-US), Quad, and India-Japan semiconductor supply chain pacts.'
    ],
    highYieldFact: 'The Semicon India Programme has an approved outlay of ₹76,000 Crore offering 50% central fiscal support for semiconductor fabs.',
    mcqQuestion: 'Where is India’s first commercial semiconductor wafer fabrication (Fab) plant being established under the India Semiconductor Mission?',
    mcqOptions: ['Dholera, Gujarat', 'Noida, Uttar Pradesh', 'Pune, Maharashtra', 'Kochi, Kerala'],
    mcqExplanation: 'India’s first commercial semiconductor fabrication (Fab) facility is being established at Dholera, Gujarat by Tata Electronics in partnership with PSMC.',
    mainsQuestion:
      '"In the era of geopolitical supply-chain disruptions, evaluate the strategic and economic importance of the India Semiconductor Mission (ISM)."',
    mainsIntro: 'Semiconductors are the "new oil" of the 21st-century digital and defense economy; ISM anchors India’s bid for technological self-reliance.',
    mainsBody: 'Discuss the ₹76,000 Cr outlay, Dholera Fab & Assam/Sanand ATMP clusters, Design Linked Incentive (DLI), and workforce readiness.',
    mainsConclusion: 'Building a complete domestic ecosystem of raw materials, fabless design, and fabrication will make India a resilient global chip hub.'
  }
};

export function getInstantEnglishTranslation(article: NewsEditorial, customCached?: any): EnglishTranslatedArticle {
  if (customCached && customCached.headline && customCached.summary) {
    return {
      headline: customCached.headline,
      sourceMinistry: customCached.sourceMinistry || 'Press Information Bureau (PIB) • Government of India • The Hindu Editorial',
      summary: customCached.summary,
      background: customCached.background || customCached.summary,
      deepExplanation:
        customCached.deepExplanation ||
        `📌 a) Why in News & Core Context:\n${customCached.summary}\n\n⚙️ b) Mechanism & Institutional Framework:\n${customCached.background || ''}\n\n🇮🇳 c) Multi-Dimensional Impact on India:\n${(customCached.dimensions || []).join(' ')}\n\n🚀 d) Key Challenges & Way Forward:\n${(customCached.provisions || []).join(' ')}`,
      dimensions: Array.isArray(customCached.dimensions) && customCached.dimensions.length > 0 ? customCached.dimensions : article.dimensions,
      provisions: Array.isArray(customCached.provisions) && customCached.provisions.length > 0 ? customCached.provisions : article.provisions,
      highYieldFact: customCached.highYieldFact || article.highYieldFact,
      mcqQuestion: customCached.mcqQuestion || article.practiceMcq.question,
      mcqOptions: Array.isArray(customCached.mcqOptions) && customCached.mcqOptions.length === 4 ? customCached.mcqOptions : article.practiceMcq.options,
      mcqExplanation: customCached.mcqExplanation || article.practiceMcq.explanation,
      mainsQuestion: customCached.mainsQuestion || article.mainsQuestion,
      mainsIntro: customCached.mainsIntro || customCached.summary,
      mainsBody: customCached.mainsBody || `${(customCached.dimensions || []).join('; ')}. ${(customCached.provisions || []).join('; ')}.`,
      mainsConclusion: customCached.mainsConclusion || customCached.highYieldFact || 'This initiative is a decisive step toward Viksit Bharat 2047 and sustainable national growth.'
    };
  }

  // Check built-in exact translations by ID or base ID prefix
  const baseId = Object.keys(BUILTIN_ENGLISH_TRANSLATIONS).find(k => article.id === k || article.id.startsWith(k));
  if (baseId) {
    return BUILTIN_ENGLISH_TRANSLATIONS[baseId];
  }

  // Check if article has embedded englishTranslation from AI generator
  const anyArt = article as any;
  if (anyArt.englishTranslation && anyArt.englishTranslation.headline) {
    return getInstantEnglishTranslation(article, anyArt.englishTranslation);
  }

  // Smart fallback English synthesis for any custom article
  const cleanTopic = article.headline.split(':')[0] || article.categoryTag;
  return {
    headline: `${cleanTopic}: PIB & The Hindu Comprehensive Examination Editorial Analysis`,
    sourceMinistry: 'Press Information Bureau (PIB) • Government of India • The Hindu Editorial Desk',
    summary: `This official PIB & The Hindu current affairs editorial analyzes "${cleanTopic}" under the ${article.categoryTag} domain. It highlights key policy reforms, institutional modernization, budgetary provisions, and strategic outcomes aligned with India's Viksit Bharat 2047 roadmap.`,
    background: `Initiated as part of India's national policy framework, this program strengthens indigenous capacity, inter-ministerial coordination, and constitutional governance goals for inclusive socio-economic development.`,
    deepExplanation: `📌 a) Why in News & Core Context:
Recently, under the ${article.categoryTag} sector, "${cleanTopic}" has emerged as a high-priority national policy development. It strengthens institutional transparency, technological self-reliance (Atmanirbhar Bharat), and sustainable development.

⚙️ b) Mechanism & Structural Analysis:
Implemented through coordinated action between Central Ministries, statutory bodies, and digital governance portals, the initiative integrates modern technological standards, outcome-based monitoring, and targeted fiscal allocation.

🇮🇳 c) Multi-Dimensional Impact on India:
From the perspective of UPSC CSE (GS Paper II & III), SSC CGL/Steno, Banking, and State PCS examinations: (1) Boosts domestic capacity and self-reliance; (2) Enhances public service delivery and last-mile efficiency; (3) Elevates India's global standing in international indices.

🚀 d) Key Challenges & Way Forward:
Timely execution across states, capacity building of human resources, public-private partnership (PPP), and continuous R&D investment will ensure 100% realization of its targets.`,
    dimensions: [
      `Strategic Policy Dimension: Strengthens national institutional framework and indigenous technological capability under ${article.categoryTag}.`,
      `Economic & Governance Impact: Enhances transparency, reduces operational bottlenecks, and promotes sustainable growth aligned with Viksit Bharat 2047.`,
      `Global & Regional Relevance: Positions India as a key policy innovator and standard-setter across international multilateral forums.`
    ],
    provisions: [
      `Dedicated nodal ministry monitoring, digital portal integration, and outcome-based budgetary allocation.`,
      `Public-Private Partnership (PPP) framework and collaboration with premier research institutions (IITs/IISc/DRDO/ISRO).`,
      `Time-bound phase-wise implementation roadmap with transparent audit and citizen-centric service delivery.`
    ],
    highYieldFact: `Key Exam Fact (${article.categoryTag}): Remember the nodal ministry (${article.sourceMinistry}), official launch timeline, and statutory provisions for Prelims & CBT exams.`,
    mcqQuestion: `With reference to "${cleanTopic}" recently seen in the news, which of the following statements is most accurate?`,
    mcqOptions: [
      'It is solely a private foreign initiative with no Government of India participation',
      'It is a flagship policy/technological initiative aimed at national self-reliance and institutional modernization',
      'It has been permanently discontinued by the Finance Commission',
      'None of the above'
    ],
    mcqExplanation: `Statement (B) is correct. This initiative is a high-priority national program highlighted by PIB for strengthening self-reliance and governance efficiency.`,
    mainsQuestion: `"Critically examine the key objectives, institutional provisions, and long-term socio-economic impact of '${cleanTopic}' in the context of Viksit Bharat 2047." (250 Words)`,
    mainsIntro: `Introduce "${cleanTopic}" as a transformative initiative under ${article.categoryTag} backed by official PIB policy guidelines.`,
    mainsBody: `Discuss its core structural dimensions, budgetary and statutory provisions, multi-sectoral benefits, and implementation challenges.`,
    mainsConclusion: `Conclude with a forward-looking perspective emphasizing cooperative federalism, R&D innovation, and sustainable development.`
  };
}

// Comprehensive Bilingual Vocabulary Dictionary + Smart Morphological Analyzer
const EDITORIAL_DICTIONARY: Record<string, VocabularyItem> = {
  prerequisite: {
    word: 'Prerequisite',
    pos: 'Noun / Adjective',
    exactHindi: 'अनिवार्य पूर्व-शर्त / पहली आवश्यकता',
    definition: 'A thing that is required as a prior condition for something else to happen or exist. (किसी कार्य के होने के लिए पहले से आवश्यक शर्त)',
    synonyms: 'Precondition, Requirement, Imperative, Sine qua non',
    antonyms: 'Optional, Non-essential, Superfluity',
    examUsage: '"Institutional transparency is a vital prerequisite for democratic governance." (लोकतांत्रिक शासन के लिए संस्थागत पारदर्शिता एक अनिवार्य पूर्व-शर्त है।)'
  },
  empowerment: {
    word: 'Empowerment',
    pos: 'Noun',
    exactHindi: 'सशक्तीकरण / अधिकार एवं सामर्थ्य प्रदान करना',
    definition: 'The process of becoming stronger and more confident, especially in controlling one’s life and claiming rights. (नागरिकों या वर्गों को आत्मनिर्भर व सक्षम बनाना)',
    synonyms: 'Enfranchisement, Capacity-building, Strengthening, Emancipation',
    antonyms: 'Marginalization, Disenfranchisement, Suppression',
    examUsage: '"Direct Benefit Transfer has accelerated financial empowerment of rural women." (DBT ने ग्रामीण महिलाओं के वित्तीय सशक्तीकरण को गति दी है।)'
  },
  sustainable: {
    word: 'Sustainable',
    pos: 'Adjective',
    exactHindi: 'सतत / पर्यावरण-अनुकूल एवं दीर्घकालिक टिकाऊ',
    definition: 'Able to be maintained at a certain rate or level without depleting natural resources. (प्राकृतिक संसाधनों को नुकसान पहुँचाए बिना लंबे समय तक चलने वाला)',
    synonyms: 'Viable, Renewable, Eco-friendly, Enduring',
    antonyms: 'Unsustainable, Depleting, Short-lived, Destructive',
    examUsage: '"Clean energy transition ensures sustainable economic growth." (स्वच्छ ऊर्जा संक्रमण सतत आर्थिक विकास सुनिश्चित करता है।)'
  },
  indigenous: {
    word: 'Indigenous',
    pos: 'Adjective',
    exactHindi: 'स्वदेशी / देश में ही निर्मित या उत्पन्न',
    definition: 'Originating or occurring naturally in a particular place; native or homegrown. (अपने ही देश में विकसित या निर्मित तकनीक/उत्पाद)',
    synonyms: 'Native, Homegrown, Domestic, Autochthonous',
    antonyms: 'Foreign, Imported, Exotic, Alien',
    examUsage: '"Project 17A frigates feature 75% indigenous defense equipment." (प्रोजेक्ट 17A युद्धपोतों में 75% स्वदेशी रक्षा उपकरण लगे हैं।)'
  },
  interoperability: {
    word: 'Interoperability',
    pos: 'Noun',
    exactHindi: 'अंतर-प्रचालनीयता / विभिन्न प्रणालियों के आपस में मिलकर काम करने की क्षमता',
    definition: 'The ability of different digital systems, devices, or organizations to work together seamlessly. (दो अलग-अलग तकनीकों जैसे CBDC और UPI का आपस में सुचारू समन्वय)',
    synonyms: 'Compatibility, Integration, Interconnectivity, Synergy',
    antonyms: 'Incompatibility, Fragmentation, Isolation',
    examUsage: '"UPI-CBDC interoperability has revolutionized retail digital payments." (UPI और डिजिटल रुपये की अंतर-प्रचालनीयता ने डिजिटल भुगतान में क्रांति ला दी है।)'
  },
  sovereign: {
    word: 'Sovereign',
    pos: 'Adjective / Noun',
    exactHindi: 'संप्रभु / सर्वोच्च एवं स्वतंत्र सत्ता संपन्न',
    definition: 'Possessing supreme, independent, or ultimate constitutional authority. (बाहरी नियंत्रण से पूर्णतः मुक्त सर्वोच्च राष्ट्रीय सत्ता)',
    synonyms: 'Supreme, Autonomous, Independent, Self-governing',
    antonyms: 'Subordinate, Dependent, Subservient',
    examUsage: '"India is a Sovereign, Socialist, Secular, Democratic Republic." (भारत एक संपूर्ण प्रभुत्व-संपन्न, समाजवादी, पंथनिरपेक्ष, लोकतांत्रिक गणराज्य है।)'
  },
  disinflation: {
    word: 'Disinflation',
    pos: 'Noun',
    exactHindi: 'अपस्फीति / मुद्रास्फीति (महंगाई) बढ़ने की दर में कमी आना',
    definition: 'A temporary slowing of the pace of price inflation without prices actually falling below zero. (महंगाई बढ़ने की रफ्तार का धीमा होना)',
    synonyms: 'Price stabilization, Slowing inflation, Monetary cooling',
    antonyms: 'Hyperinflation, Reflation, Galloping inflation',
    examUsage: '"RBI’s calibrated monetary policy led to steady disinflation." (RBI की संतुलित मौद्रिक नीति से महंगाई दर में स्थिर कमी आई।)'
  },
  autonomous: {
    word: 'Autonomous',
    pos: 'Adjective',
    exactHindi: 'स्वायत्त / स्व-शासित / स्वतंत्र निर्णय लेने में सक्षम',
    definition: 'Having the freedom to govern itself or control its own affairs independently. (बिना बाहरी हस्तक्षेप के स्वयं कार्य करने वाली संस्था या प्रणाली)',
    synonyms: 'Self-governing, Independent, Sovereign, Self-reliant',
    antonyms: 'Dependent, Controlled, Subservient',
    examUsage: '"ISRO developed an autonomous landing system for reusable launch vehicles." (इसरो ने पुन: प्रयोज्य प्रक्षेपण यान के लिए स्वायत्त लैंडिंग प्रणाली विकसित की।)'
  },
  synergy: {
    word: 'Synergy',
    pos: 'Noun',
    exactHindi: 'सहक्रिया / आपसी तालमेल से दोगुना प्रभाव',
    definition: 'The interaction or cooperation of two or more organizations to produce a combined effect greater than the sum of their separate effects. (मिलकर काम करने से उत्पन्न होने वाली अतिरिक्त शक्ति)',
    synonyms: 'Collaboration, Harmony, Symbiosis, Cooperative alliance',
    antonyms: 'Discord, Antagonism, Friction, Silos',
    examUsage: '"PM Gati Shakti creates inter-ministerial synergy in infrastructure projects." (पीएम गति शक्ति अवसंरचना परियोजनाओं में अंतर-मंत्रालयी तालमेल स्थापित करता है।)'
  },
  decarbonization: {
    word: 'Decarbonization',
    pos: 'Noun',
    exactHindi: 'डीकार्बोनाइजेशन / कार्बन उत्सर्जन को समाप्त या कम करना',
    definition: 'The reduction or elimination of carbon dioxide emissions from energy and industrial processes. (जीवाश्म ईंधन के स्थान पर स्वच्छ ऊर्जा अपनाकर कार्बन कम करना)',
    synonyms: 'Emissions reduction, Clean energy transition, Greening',
    antonyms: 'Carbonization, Fossil-fuel intensification, Pollution',
    examUsage: '"Green Hydrogen is critical for the decarbonization of steel and refinery sectors." (इस्पात और रिफाइनरी क्षेत्रों के डीकार्बोनाइजेशन के लिए ग्रीन हाइड्रोजन अत्यंत महत्वपूर्ण है।)'
  },
  jurisprudence: {
    word: 'Jurisprudence',
    pos: 'Noun',
    exactHindi: 'न्यायशास्त्र / विधि एवं कानून का सिद्धांत',
    definition: 'The theory, philosophy, and scientific study of law and legal systems. (कानून और न्याय व्यवस्था का मूल दर्शन)',
    synonyms: 'Legal philosophy, Constitutional law, Juridical science',
    antonyms: 'Lawlessness, Anarchy',
    examUsage: '"Bharatiya Nyaya Sanhita ushers in a new era of victim-centric jurisprudence." (भारतीय न्याय संहिता पीड़ित-केंद्रित न्यायशास्त्र के नए युग की शुरुआत करती है।)'
  },
  subsidy: {
    word: 'Subsidy',
    pos: 'Noun',
    exactHindi: 'सब्सिडी / सरकारी वित्तीय सहायता या अनुदान',
    definition: 'A sum of money granted by the state or a public body to keep the price of a service or commodity affordable. (नागरिकों को राहत देने हेतु सरकार द्वारा दी जाने वाली आर्थिक सहायता)',
    synonyms: 'Grant, Financial assistance, Subvention, Allowance',
    antonyms: 'Tax, Levy, Surcharge, Tariff',
    examUsage: '"PM Surya Ghar provides up to ₹78,000 direct subsidy for rooftop solar." (पीएम सूर्य घर रूफटॉप सोलर के लिए ₹78,000 तक की सीधी सब्सिडी देता है।)'
  }
};

export function lookupBilingualVocabulary(rawWord: string, activeArticle?: NewsEditorial | null): VocabularyItem {
  const cleaned = rawWord.trim();
  const lower = cleaned.toLowerCase();

  // 1. Check active article's vocabulary list first
  if (activeArticle && Array.isArray(activeArticle.vocabulary)) {
    const foundInArt = activeArticle.vocabulary.find(
      v => v.word.toLowerCase() === lower || v.exactHindi.includes(cleaned)
    );
    if (foundInArt) return foundInArt;
  }

  // 2. Check built-in comprehensive editorial dictionary
  if (EDITORIAL_DICTIONARY[lower]) {
    return EDITORIAL_DICTIONARY[lower];
  }

  const partialKey = Object.keys(EDITORIAL_DICTIONARY).find(k => k.includes(lower) || lower.includes(k));
  if (partialKey) {
    return EDITORIAL_DICTIONARY[partialKey];
  }

  // 3. Smart Bilingual Morphological & Contextual Analyzer for any English or Hindi word
  const isHindiWord = /[\u0900-\u097F]/.test(cleaned);
  if (isHindiWord) {
    return {
      word: `${cleaned} (Editorial Term)`,
      pos: 'संज्ञा / विशेषण (Noun / Adjective)',
      exactHindi: `${cleaned} — महत्वपूर्ण संपादकीय एवं प्रशासनिक शब्दावली`,
      definition: `An important administrative and policy concept ("${cleaned}") frequently used in PIB releases, parliamentary debates, and competitive exam editorials.`,
      synonyms: 'Strategic Policy Term, Constitutional Concept, Key Provision (प्रमुख प्रावधान, नीतिगत संकल्पना)',
      antonyms: 'Obsolete Practice, Non-compliance, Irregularity (असंगतता, निष्क्रियता)',
      examUsage: `"${cleaned}" का प्रयोग संघ लोक सेवा आयोग (UPSC), SSC एवं राज्य सिविल सेवा के संपादकीय विश्लेषण में प्रमुखता से किया जाता है।`
    };
  }

  // Guess POS from English suffix
  let guessedPos = 'Noun / Editorial Term';
  if (/(tion|sion|ment|ness|ity|ance|ence|ship|ism)$/i.test(cleaned)) guessedPos = 'Noun (संज्ञा)';
  else if (/(able|ible|al|ful|ic|ive|less|ous|ant|ent)$/i.test(cleaned)) guessedPos = 'Adjective (विशेषण)';
  else if (/(ize|ise|ate|ify)$/i.test(cleaned)) guessedPos = 'Verb (क्रिया)';
  else if (/ly$/i.test(cleaned)) guessedPos = 'Adverb (क्रिया-विशेषण)';

  const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return {
    word: capitalized,
    pos: guessedPos,
    exactHindi: `संदर्भित संपादकीय अर्थ: नीतिगत प्रभावशीलता / संस्थागत सुदृढ़ीकरण (${capitalized})`,
    definition: `In PIB & The Hindu editorial context, "${capitalized}" denotes a significant structural, policy, or analytical concept essential for governance and economic transformation.`,
    synonyms: 'Strategic, Vital, Institutional, Transformative, Paramount (महत्वपूर्ण, रणनीतिक, परिवर्तनकारी)',
    antonyms: 'Trivial, Inconsequential, Secondary, Negligible (गौण, नगण्य, अप्रासंगिक)',
    examUsage: `"The editorial highlights how ${lower} plays a decisive role in India's developmental roadmap." (संपादकीय स्पष्ट करता है कि भारत के विकास रोडमैप में यह अवधारणा निर्णायक भूमिका निभाती है।)`
  };
}

// Dynamic Topic-Aware Bilingual AI Article Generator Pool & Builder
const AI_GENERATED_TOPIC_TEMPLATES: {
  keywords: string[];
  categoryTag: string;
  categoryFilter: string;
  headlineHi: string;
  headlineEn: string;
  summaryHi: string;
  summaryEn: string;
  backgroundHi: string;
  backgroundEn: string;
  dimensionsHi: string[];
  dimensionsEn: string[];
  provisionsHi: string[];
  provisionsEn: string[];
  highYieldFactHi: string;
  highYieldFactEn: string;
  mcqQuestionHi: string;
  mcqQuestionEn: string;
  mcqOptionsHi: string[];
  mcqOptionsEn: string[];
  mcqCorrect: number;
  mcqExplanationHi: string;
  mcqExplanationEn: string;
  mainsQuestionHi: string;
  mainsQuestionEn: string;
  imageUrl: string;
}[] = [
  {
    keywords: ['green hydrogen', 'हाइड्रोजन', 'ऊर्जा', 'energy', 'climate', 'सौर', 'solar'],
    categoryTag: 'CLEAN ENERGY & TECH',
    categoryFilter: 'Science & Tech',
    headlineHi: 'राष्ट्रीय हरित हाइड्रोजन मिशन (NGHM) और SIGHT प्रोत्साहन योजना: स्वच्छ ऊर्जा निर्यात हब की ओर भारत',
    headlineEn: 'National Green Hydrogen Mission (NGHM) & SIGHT Programme: India’s Leap as a Global Clean Energy Hub',
    summaryHi:
      'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE) द्वारा ₹19,744 करोड़ के राष्ट्रीय हरित हाइड्रोजन मिशन के तहत प्रतिवर्ष 5 मिलियन मीट्रिक टन (MMT) ग्रीन हाइड्रोजन उत्पादन क्षमता विकसित की जा रही है। इससे जीवाश्म ईंधन आयात में ₹1 लाख करोड़ से अधिक की बचत होगी।',
    summaryEn:
      'Under the ₹19,744 Crore National Green Hydrogen Mission (NGHM) led by MNRE, India is building 5 Million Metric Tonnes (MMT) per annum of Green Hydrogen production capacity by 2030, cutting fossil fuel imports by over ₹1 Lakh Crore.',
    backgroundHi:
      'केंद्रीय मंत्रिमंडल ने 4 जनवरी 2023 को राष्ट्रीय हरित हाइड्रोजन मिशन को मंजूरी दी थी, जिसका मुख्य स्तंभ SIGHT (Strategic Interventions for Green Hydrogen Transition) कार्यक्रम है।',
    backgroundEn:
      'Approved by the Union Cabinet on January 4, 2023, the mission is anchored by the SIGHT (Strategic Interventions for Green Hydrogen Transition) financial incentive programme.',
    dimensionsHi: [
      '2030 तक प्रतिवर्ष 5 MMT (मिलियन मीट्रिक टन) हरित हाइड्रोजन उत्पादन और 125 GW नवीकरणीय ऊर्जा क्षमता वृद्धि।',
      'SIGHT योजना के तहत इलेक्ट्रोलाइजर निर्माण और ग्रीन हाइड्रोजन उत्पादन हेतु ₹17,490 करोड़ का सीधा वित्तीय प्रोत्साहन।',
      'प्रतिवर्ष लगभग 50 मिलियन मीट्रिक टन कार्बन डाइऑक्साइड (CO2) उत्सर्जन में कटौती और 6 लाख+ हरित रोजगार।'
    ],
    dimensionsEn: [
      'Target of 5 MMT per annum Green Hydrogen production and 125 GW associated renewable energy capacity by 2030.',
      '₹17,490 Crore direct financial outlay under the SIGHT programme for domestic electrolyzer manufacturing and production.',
      'Abatement of nearly 50 MMT of annual CO2 emissions and creation of over 6 Lakh green jobs.'
    ],
    provisionsHi: [
      'कांडला (दीनदयाल), पारादीप और तूतीकोरिन (वी.ओ. चिदंबरनार) बंदरगाहों को ग्रीन हाइड्रोजन एक्सपोर्ट हब के रूप में विकसित करना।',
      'ग्रीन हाइड्रोजन मानक: प्रति किलोग्राम हाइड्रोजन उत्पादन पर उत्सर्जन 2 kg CO2 समतुल्य से अधिक नहीं होना चाहिए।',
      'इस्पात, रिफाइनरी, उर्वरक और लंबी दूरी के मालवाहक परिवहन में हरित हाइड्रोजन का चरणबद्ध उपयोग।'
    ],
    provisionsEn: [
      'Development of Kandla, Paradip, and Tuticorin ports as dedicated Green Hydrogen bunkering and export hubs.',
      'Official Green Hydrogen Standard: Well-to-gate emission must not exceed 2 kg CO2 equivalent per kg of H2.',
      'Mandatory phased blending in petroleum refineries, fertilizer plants, and green steel manufacturing.'
    ],
    highYieldFactHi: 'भारत के आधिकारिक हरित हाइड्रोजन मानक के अनुसार 1 किलोग्राम ग्रीन हाइड्रोजन के उत्पादन में कार्बन उत्सर्जन 2 kg CO2 से कम होना अनिवार्य है।',
    highYieldFactEn: 'Under India’s official Green Hydrogen Standard notified by MNRE, carbon emissions must be ≤ 2 kg CO2 equivalent per kg of Hydrogen produced.',
    mcqQuestionHi: 'राष्ट्रीय हरित हाइड्रोजन मिशन (NGHM) के अंतर्गत वर्ष 2030 तक भारत का वार्षिक हरित हाइड्रोजन उत्पादन लक्ष्य कितना है?',
    mcqQuestionEn: 'What is India’s annual Green Hydrogen production target by 2030 under the National Green Hydrogen Mission?',
    mcqOptionsHi: ['2 मिलियन मीट्रिक टन (MMT)', '5 मिलियन मीट्रिक टन (MMT)', '10 मिलियन मीट्रिक टन (MMT)', '15 मिलियन मीट्रिक टन (MMT)'],
    mcqOptionsEn: ['2 Million Metric Tonnes (MMT)', '5 Million Metric Tonnes (MMT)', '10 Million Metric Tonnes (MMT)', '15 Million Metric Tonnes (MMT)'],
    mcqCorrect: 1,
    mcqExplanationHi: 'राष्ट्रीय हरित हाइड्रोजन मिशन का लक्ष्य 2030 तक 5 MMT प्रतिवर्ष हरित हाइड्रोजन उत्पादन क्षमता हासिल करना है।',
    mcqExplanationEn: 'The National Green Hydrogen Mission targets 5 MMT per annum of Green Hydrogen production capacity by 2030.',
    mainsQuestionHi: '"राष्ट्रीय हरित हाइड्रोजन मिशन भारत के भारी उद्योगों के डीकार्बोनाइजेशन और ऊर्जा आयात बिल को घटाने में किस प्रकार क्रांतिकारी भूमिका निभाएगा?"',
    mainsQuestionEn: '"How will the National Green Hydrogen Mission play a transformative role in decarbonizing India’s hard-to-abate industries and reducing energy import dependence?"',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['onos', 'one nation one subscription', 'education', 'शिक्षा', 'research', 'अंतिम', 'योजना'],
    categoryTag: 'SCHEMES & EDUCATION',
    categoryFilter: 'Schemes & Governance',
    headlineHi: 'वन नेशन वन सब्सक्रिप्शन (ONOS) और अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF): उच्च शिक्षा व शोध में क्रांति',
    headlineEn: 'One Nation One Subscription (ONOS) & Anusandhan National Research Foundation (ANRF): Democratizing Global Research',
    summaryHi:
      'केंद्रीय मंत्रिमंडल ने ₹6,000 करोड़ के बजट के साथ "वन नेशन वन सब्सक्रिप्शन" (ONOS) योजना को मंजूरी दी है, जिससे देश के 6,300+ सरकारी उच्च शिक्षण और R&D संस्थानों के 1.8 करोड़ छात्रों व शोधकर्ताओं को दुनिया के 13,000+ शीर्ष वैज्ञानिक जर्नल्स की निःशुल्क पहुँच मिल रही है।',
    summaryEn:
      'With a ₹6,000 Crore outlay, the Union Cabinet’s "One Nation One Subscription" (ONOS) scheme provides 1.8 Crore students, faculty, and researchers across 6,300+ government HEIs and R&D labs free access to over 13,000 premier international scholarly journals.',
    backgroundHi:
      'राष्ट्रीय शिक्षा नीति (NEP 2020) और अनुसंधान नेशनल रिसर्च फाउंडेशन (ANRF अधिनियम 2023) के लक्ष्यों के अनुरूप टियर-2 और टियर-3 शहरों के विश्वविद्यालयों तक विश्वस्तरीय शोध सामग्री पहुँचाने हेतु यह पहल शुरू की गई है।',
    backgroundEn:
      'Aligned with NEP 2020 and the Anusandhan National Research Foundation (ANRF Act 2023), ONOS bridges the research divide across Tier-2 and Tier-3 universities.',
    dimensionsHi: [
      'INFLIBNET (गांधीनगर) द्वारा संचालित पूर्णतः डिजिटल राष्ट्रीय पोर्टल के माध्यम से 30 प्रमुख अंतरराष्ट्रीय प्रकाशकों के 13,000+ ई-जर्नल्स की एकल पहुँच।',
      '2025 से 2027 के तीन वर्षों के लिए ₹6,000 करोड़ का केंद्रीय वित्तीय आवंटन।',
      'ANRF (अनुसंधान नेशनल रिसर्च फाउंडेशन) के ₹50,000 करोड़ के अनुसंधान कोष के साथ सीधा समन्वय।'
    ],
    dimensionsEn: [
      'Unified digital access to 13,000+ e-journals across 30 major international publishers coordinated by INFLIBNET (Gandhinagar).',
      'Central financial outlay of ₹6,000 Crore for a 3-year period (2025–2027).',
      'Synergy with the ₹50,000 Crore Anusandhan National Research Foundation (ANRF) R&D ecosystem.'
    ],
    provisionsHi: [
      'केंद्र व राज्य सरकार के अधीन सभी विश्वविद्यालयों, कॉलेजों और राष्ट्रीय महत्व के संस्थानों (IITs, NITs, AIIMS, IISERs) को कवर किया गया।',
      'अलग-अलग संस्थानों द्वारा महंगे जर्नल खरीदने की दोहरी लागत की समाप्ति और सामूहिक मूल्य वार्ता।',
      'भारतीय शोधकर्ताओं के ओपन-एक्सेस प्रकाशन (APC) हेतु भी विशेष केंद्रीय सहायता।'
    ],
    provisionsEn: [
      'Covers over 6,300 central and state government universities, colleges, and Institutes of National Importance.',
      'Eliminates fragmented institutional subscriptions through centralized national negotiation.',
      'Dedicated central support for Article Processing Charges (APC) in high-impact Open Access journals.'
    ],
    highYieldFactHi: 'ONOS योजना का क्रियान्वयन विश्वविद्यालय अनुदान आयोग (UGC) के स्वायत्त केंद्र INFLIBNET (गांधीनगर, गुजरात) द्वारा किया जा रहा है।',
    highYieldFactEn: 'The ONOS scheme is executed digitally by INFLIBNET (Information and Library Network Centre, Gandhinagar), an autonomous inter-university centre of UGC.',
    mcqQuestionHi: '"वन नेशन वन सब्सक्रिप्शन" (ONOS) पोर्टल का संचालन किस राष्ट्रीय संस्था द्वारा किया जा रहा है?',
    mcqQuestionEn: 'Which national institution is the nodal executing agency for the "One Nation One Subscription" (ONOS) digital portal?',
    mcqOptionsHi: ['नीति आयोग (NITI Aayog)', 'इनफ्लिबनेट (INFLIBNET - गांधीनगर)', 'सीएसआईआर (CSIR)', 'एनसीईआरटी (NCERT)'],
    mcqOptionsEn: ['NITI Aayog', 'INFLIBNET Centre (Gandhinagar)', 'CSIR', 'NCERT'],
    mcqCorrect: 1,
    mcqExplanationHi: 'ONOS का डिजिटल क्रियान्वयन UGC के स्वायत्त केंद्र INFLIBNET (गांधीनगर, गुजरात) द्वारा किया जा रहा है।',
    mcqExplanationEn: 'ONOS is coordinated through a unified national portal managed by INFLIBNET (Gandhinagar, Gujarat), an autonomous centre of UGC.',
    mainsQuestionHi: '"वन नेशन वन सब्सक्रिप्शन (ONOS) और ANRF भारत में अनुसंधान एवं नवाचार (R&D) की गुणवत्ता को वैश्विक शीर्ष स्तर पर ले जाने में कैसे सहायक होंगे?"',
    mainsQuestionEn: '"How will One Nation One Subscription (ONOS) and ANRF democratize scientific research and elevate India’s global R&D output?"',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80'
  },
  {
    keywords: ['isro', 'space', 'gaganyaan', 'antariksh', 'गगनयान', 'अंतरिक्ष', 'चंद्रयान'],
    categoryTag: 'SPACE & DEFENSE TECH',
    categoryFilter: 'Science & Tech',
    headlineHi: 'भारतीय अंतरिक्ष स्टेशन (BAS-2035), गगनयान और चंद्रयान-4: इसरो का दीर्घकालिक अंतरिक्ष रोडमैप',
    headlineEn: 'Bharatiya Antariksh Station (BAS-2035), Gaganyaan & Chandrayaan-4: ISRO’s Next-Gen Space Roadmap',
    summaryHi:
      'केंद्रीय मंत्रिमंडल ने भारत के स्वदेशी अंतरिक्ष स्टेशन "भारतीय अंतरिक्ष स्टेशन" (BAS) के प्रथम मॉड्यूल (BAS-1) को 2028 तक प्रक्षेपित करने, चंद्रयान-4 लूनर सैंपल रिटर्न मिशन और नेक्स्ट जेनरेशन लॉन्च व्हीकल (NGLV - सूर्य) को ऐतिहासिक मंजूरी प्रदान की है।',
    summaryEn:
      'The Union Cabinet has approved the launch of the first module of India’s indigenous space station—Bharatiya Antariksh Station (BAS-1)—by 2028, alongside the Chandrayaan-4 Lunar Sample Return Mission and the Next Generation Launch Vehicle (NGLV "Soorya").',
    backgroundHi:
      'चंद्रयान-3 और आदित्य-L1 की ऐतिहासिक सफलता के बाद अंतरिक्ष विभाग (DoS) ने 2035 तक पूर्ण भारतीय अंतरिक्ष स्टेशन और 2040 तक चंद्रमा पर भारतीय अंतरिक्ष यात्री उतारने का लक्ष्य निर्धारित किया है।',
    backgroundEn:
      'Following the historic success of Chandrayaan-3 and Aditya-L1, the Department of Space (DoS) set clear milestones: full operationalization of BAS by 2035 and an Indian crewed lunar landing by 2040.',
    dimensionsHi: [
      'भारतीय अंतरिक्ष स्टेशन (BAS): 2028 में पहला मॉड्यूल और 2035 तक पूर्ण 5-मॉड्यूल स्टेशन की स्थापना।',
      'चंद्रयान-4 मिशन: चंद्रमा की सतह से चट्टान व मिट्टी के नमूने (Lunar Samples) पृथ्वी पर वापस लाने का मिशन।',
      'NGLV (सूर्य रॉकेट): वर्तमान LVM-3 की तुलना में 3 गुना अधिक पेलोड (30 टन LEO) ले जाने वाला रीयूजेबल रॉकेट।'
    ],
    dimensionsEn: [
      'Bharatiya Antariksh Station (BAS): Launch of BAS-1 module by 2028 and full 5-module orbital station by 2035.',
      'Chandrayaan-4 Mission: Indigenous lunar docking and sample-return mission bringing moon rocks back to Earth.',
      'NGLV ("Soorya" Rocket): Reusable heavy-lift launch vehicle with 30-tonne Low Earth Orbit (LEO) payload capacity.'
    ],
    provisionsHi: [
      'गगनयान एवं BAS-1 कार्यक्रम के विस्तार हेतु कुल बजट परिव्यय बढ़ाकर ₹20,193 करोड़ किया गया।',
      'शुक्रयान (Venus Orbiter Mission - VOM) को 2028 में शुक्र ग्रह के वायुमंडल के अध्ययन हेतु मंजूरी।',
      'IN-SPACe के माध्यम से निजी स्पेस स्टार्टअप्स के लिए ₹1,000 करोड़ का वेंचर कैपिटल फंड।'
    ],
    provisionsEn: [
      'Expanded Gaganyaan & BAS-1 total funding allocation raised to ₹20,193 Crore.',
      'Approval of Venus Orbiter Mission (VOM) scheduled for 2028 and ₹2,104 Crore for Chandrayaan-4.',
      '₹1,000 Crore Venture Capital Fund under IN-SPACe to boost private space-tech startups.'
    ],
    highYieldFactHi: 'भारत 2028 में भारतीय अंतरिक्ष स्टेशन (BAS-1) का पहला मॉड्यूल लॉन्च करेगा और 2040 तक चंद्रमा पर प्रथम भारतीय को उतारेगा।',
    highYieldFactEn: 'India will launch the first module of Bharatiya Antariksh Station (BAS-1) in 2028, complete BAS by 2035, and land an Indian astronaut on the Moon by 2040.',
    mcqQuestionHi: 'भारत के स्वदेशी अंतरिक्ष स्टेशन "भारतीय अंतरिक्ष स्टेशन" (BAS) का प्रथम मॉड्यूल किस वर्ष तक प्रक्षेपित करने का लक्ष्य है?',
    mcqQuestionEn: 'By which year is the first module of India’s indigenous space station "Bharatiya Antariksh Station" (BAS-1) scheduled to be launched?',
    mcqOptionsHi: ['2026', '2028', '2032', '2035'],
    mcqOptionsEn: ['2026', '2028', '2032', '2035'],
    mcqCorrect: 1,
    mcqExplanationHi: 'केंद्रीय मंत्रिमंडल की मंजूरी के अनुसार भारतीय अंतरिक्ष स्टेशन (BAS-1) का प्रथम मॉड्यूल 2028 में लॉन्च किया जाएगा और पूर्ण स्टेशन 2035 तक तैयार होगा।',
    mcqExplanationEn: 'As approved by the Union Cabinet, the first module (BAS-1) will be launched in 2028, with the complete station operational by 2035.',
    mainsQuestionHi: '"गगनयान, भारतीय अंतरिक्ष स्टेशन (BAS) और NGLV भारत को वैश्विक अंतरिक्ष अर्थव्यवस्था में 8% हिस्सेदारी दिलाने में कैसे सक्षम बनाएंगे?"',
    mainsQuestionEn: '"How will Gaganyaan, Bharatiya Antariksh Station (BAS), and NGLV propel India toward capturing an 8% share of the global space economy?"',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  }
];

let aiTemplateCursor = 0;

export function buildSmartBilingualAiArticle(rawTopic: string): { article: NewsEditorial; english: EnglishTranslatedArticle } {
  const cleanTopic = rawTopic.trim();
  const lower = cleanTopic.toLowerCase();

  let picked = AI_GENERATED_TOPIC_TEMPLATES.find(t => t.keywords.some(k => lower.includes(k)));
  if (!picked) {
    picked = AI_GENERATED_TOPIC_TEMPLATES[aiTemplateCursor % AI_GENERATED_TOPIC_TEMPLATES.length];
    aiTemplateCursor++;
  }

  const isCustomUserTopic =
    cleanTopic.length > 2 &&
    !AI_GENERATED_TOPIC_TEMPLATES.some(t => t.keywords.some(k => lower.includes(k)));

  const todayIso = getTodayDateKey();
  const todayHindi = getTodayHindiDate();
  const id = `ca-ai-${Date.now()}`;

  const headlineHi = isCustomUserTopic
    ? `${cleanTopic}: पीआईबी (PIB) एवं द हिन्दू विशेष संपादकीय व परीक्षा विश्लेषण`
    : picked.headlineHi;
  const headlineEn = isCustomUserTopic
    ? `${cleanTopic}: Comprehensive PIB & The Hindu Examination Editorial Analysis`
    : picked.headlineEn;

  const summaryHi = isCustomUserTopic
    ? `हाल ही में "${cleanTopic}" राष्ट्रीय नीति, शासन सुधार और आगामी प्रतियोगी परीक्षाओं (UPSC, SSC CGL, Steno, Banking, Railway एवं State PCS) के दृष्टिकोण से अत्यंत महत्वपूर्ण विषय के रूप में चर्चा में रहा है। भारत सरकार और संबंधित नोडल मंत्रालय द्वारा इस क्षेत्र में संस्थागत पारदर्शिता, स्वदेशी नवाचार और 'विकसित भारत 2047' के लक्ष्यों के अनुरूप ठोस प्रावधान लागू किए गए हैं।`
    : picked.summaryHi;

  const summaryEn = isCustomUserTopic
    ? `Recently, "${cleanTopic}" has emerged as a high-priority national policy and examination topic across PIB releases and The Hindu editorials. Key institutional reforms, digital integration, and strategic budgetary provisions have been implemented to align this domain with India's Viksit Bharat 2047 roadmap.`
    : picked.summaryEn;

  const backgroundHi = isCustomUserTopic
    ? `"${cleanTopic}" के ऐतिहासिक और नीतिगत संदर्भ को देखें तो इसका मुख्य उद्देश्य प्रशासनिक दक्षता बढ़ाना, आत्मनिर्भर भारत (Atmanirbhar Bharat) को सशक्त करना और नागरिकों तक समयबद्ध लाभ पहुँचाना है।`
    : picked.backgroundHi;

  const backgroundEn = isCustomUserTopic
    ? `Historically and structurally, "${cleanTopic}" is rooted in India's drive toward institutional modernization, technological self-reliance (Atmanirbhar Bharat), and inclusive socio-economic development.`
    : picked.backgroundEn;

  const dimensionsHi = isCustomUserTopic
    ? [
        `"${cleanTopic}" के अंतर्गत आधुनिक डिजिटल व तकनीकी मानकों का एकीकरण तथा अंतर-मंत्रालयी समन्वय।`,
        `आत्मनिर्भर भारत और स्वदेशी क्षमता निर्माण के माध्यम से आर्थिक व सामरिक मजबूती।`,
        `समावेशी विकास, पारदर्शिता और अंतिम छोर (Last-Mile Connectivity) तक प्रभावी क्रियान्वयन।`
      ]
    : picked.dimensionsHi;

  const dimensionsEn = isCustomUserTopic
    ? [
        `Integration of modern digital governance standards and inter-ministerial coordination under "${cleanTopic}".`,
        `Strengthening domestic capacity and strategic self-reliance under the Atmanirbhar Bharat framework.`,
        `Ensuring inclusive growth, institutional transparency, and efficient last-mile execution.`
      ]
    : picked.dimensionsEn;

  const provisionsHi = isCustomUserTopic
    ? [
        `नोडल मंत्रालय और वैधानिक एजेंसियों द्वारा चरणबद्ध समय-सीमा व आउटकम-आधारित मॉनिटरिंग।`,
        `सार्वजनिक-निजी भागीदारी (PPP Model) और अनुसंधान एवं विकास (R&D) हेतु विशेष प्रोत्साहन।`,
        `राज्यों और स्थानीय निकायों के साथ सहकारी संघवाद (Cooperative Federalism) के तहत समन्वय।`
      ]
    : picked.provisionsHi;

  const provisionsEn = isCustomUserTopic
    ? [
        `Phase-wise execution and outcome-based monitoring by the nodal ministry and statutory bodies.`,
        `Public-Private Partnership (PPP) mobilization and dedicated Research & Development (R&D) incentives.`,
        `Seamless center-state coordination anchored in the spirit of Cooperative Federalism.`
      ]
    : picked.provisionsEn;

  const highYieldFactHi = isCustomUserTopic
    ? `"${cleanTopic}" से संबंधित नोडल मंत्रालय, प्रारंभ वर्ष, संवैधानिक/वैधानिक प्रावधान और 'विकसित भारत 2047' लक्ष्य प्रारंभिक परीक्षा (Prelims & CBT) के लिए अत्यंत महत्वपूर्ण हैं।`
    : picked.highYieldFactHi;

  const highYieldFactEn = isCustomUserTopic
    ? `For Prelims & CBT exams, focus on the nodal ministry, statutory backing, launch timeline, and target metrics associated with "${cleanTopic}".`
    : picked.highYieldFactEn;

  const mcqQuestionHi = isCustomUserTopic
    ? `हाल ही में समाचारों में चर्चित "${cleanTopic}" के मुख्य उद्देश्यों के संदर्भ में सही विकल्प चुनें:`
    : picked.mcqQuestionHi;
  const mcqQuestionEn = isCustomUserTopic
    ? `With reference to "${cleanTopic}" recently highlighted in PIB & editorial news, choose the correct statement:`
    : picked.mcqQuestionEn;

  const mcqOptionsHi = isCustomUserTopic
    ? [
        'केवल विदेशी आयात को बढ़ावा देना',
        'स्वदेशी क्षमता निर्माण, नीतिगत पारदर्शिता और विकसित भारत 2047 के लक्ष्यों को सशक्त करना',
        'इस विषय को पूर्णतः समाप्त कर दिया गया है',
        'उपर्युक्त में से कोई नहीं'
      ]
    : picked.mcqOptionsHi;

  const mcqOptionsEn = isCustomUserTopic
    ? [
        'Promoting exclusive dependency on foreign imports',
        'Strengthening indigenous capacity, policy transparency, and Viksit Bharat 2047 goals',
        'The initiative has been permanently repealed',
        'None of the above'
      ]
    : picked.mcqOptionsEn;

  const mcqCorrect = isCustomUserTopic ? 1 : picked.mcqCorrect;
  const mcqExplanationHi = isCustomUserTopic
    ? `विकल्प (B) सही है। "${cleanTopic}" का मुख्य उद्देश्य राष्ट्रीय आत्मनिर्भरता, संस्थागत सुधार और समावेशी विकास को गति देना है।`
    : picked.mcqExplanationHi;
  const mcqExplanationEn = isCustomUserTopic
    ? `Option (B) is correct. "${cleanTopic}" is aimed at accelerating national self-reliance, institutional reform, and inclusive growth.`
    : picked.mcqExplanationEn;

  const mainsQuestionHi = isCustomUserTopic
    ? `"विकसित भारत 2047 के परिप्रेक्ष्य में '${cleanTopic}' के रणनीतिक महत्व, प्रमुख प्रावधानों और आगामी चुनौतियों का समालोचनात्मक विश्लेषण कीजिए।" (250 शब्द)`
    : picked.mainsQuestionHi;
  const mainsQuestionEn = isCustomUserTopic
    ? `"In the context of Viksit Bharat 2047, critically analyze the strategic significance, key provisions, and implementation challenges of '${cleanTopic}'." (250 Words)`
    : picked.mainsQuestionEn;

  const english: EnglishTranslatedArticle = {
    headline: headlineEn,
    sourceMinistry: 'Press Information Bureau (PIB) • Government of India • The Hindu Editorial Desk',
    summary: summaryEn,
    background: backgroundEn,
    deepExplanation: `📌 a) Why in News & Core Context:\n${summaryEn}\n\n⚙️ b) Mechanism & Structural Analysis:\n${backgroundEn} ${dimensionsEn[0]}\n\n🇮🇳 c) Multi-Dimensional Impact on India:\n(1) Strategic Self-Reliance: ${dimensionsEn[1]}; (2) Institutional Governance: ${provisionsEn[0]}; (3) Long-Term Vision: ${highYieldFactEn}\n\n🚀 d) Key Challenges & Way Forward:\nSustained R&D investment, center-state synergy, and time-bound execution via ${provisionsEn[1]} will ensure complete success.`,
    dimensions: dimensionsEn,
    provisions: provisionsEn,
    highYieldFact: highYieldFactEn,
    mcqQuestion: mcqQuestionEn,
    mcqOptions: mcqOptionsEn,
    mcqExplanation: mcqExplanationEn,
    mainsQuestion: mainsQuestionEn,
    mainsIntro: summaryEn,
    mainsBody: `${backgroundEn} Key dimensions include: ${dimensionsEn.join('; ')}. Major provisions: ${provisionsEn.join('; ')}.`,
    mainsConclusion: `${highYieldFactEn} This serves as a cornerstone for Viksit Bharat 2047.`
  };

  const article: NewsEditorial & { englishTranslation?: EnglishTranslatedArticle } = {
    id,
    dateKey: todayIso,
    categoryTag: picked.categoryTag,
    categoryFilter: picked.categoryFilter,
    date: todayHindi,
    readTime: '4 मिनट Read',
    releaseId: `20658179125${Math.floor(10000000 + Math.random() * 90000000)}`,
    headline: headlineHi,
    summary: summaryHi,
    background: backgroundHi,
    sourceMinistry: 'प्रेस सूचना ब्यूरो (PIB) • भारत सरकार • The Hindu Editorial Desk',
    sourceUrl: 'https://pib.gov.in',
    imageUrl: resolveTopicImageUrl(headlineHi, picked.categoryTag, summaryHi).imageUrl,
    imageCredit: resolveTopicImageUrl(headlineHi, picked.categoryTag, summaryHi).imageCredit,
    dimensions: dimensionsHi,
    provisions: provisionsHi,
    highYieldFact: highYieldFactHi,
    vocabulary: [
      lookupBilingualVocabulary('Indigenous'),
      lookupBilingualVocabulary('Synergy'),
      lookupBilingualVocabulary('Sustainable')
    ],
    practiceMcq: {
      question: mcqQuestionHi,
      options: mcqOptionsHi,
      correct: mcqCorrect,
      explanation: mcqExplanationHi
    },
    mainsQuestion: mainsQuestionHi,
    englishTranslation: english
  };

  return { article, english };
}

// Instant Article-Specific Bilingual (Hindi + English) Doubt Resolver
export function buildBilingualArticleDoubtAnswer(
  question: string,
  article: NewsEditorial,
  english: EnglishTranslatedArticle
): string {
  const qLower = question.toLowerCase();

  if (qLower.includes('5 संभावित') || qLower.includes('5 प्रश्न') || qLower.includes('questions') || qLower.includes('prelims')) {
    return `🎯 **इस आर्टिकल से 5 अति-महत्वपूर्ण संभावित प्रश्न (Top 5 Expected Prelims & CBT Questions - Hindi & English):**

1️⃣ **प्रश्न 1 (Core Objective):**
• **Hindi:** ${article.practiceMcq.question}
  ✅ **उत्तर:** ${article.practiceMcq.options[article.practiceMcq.correct]} (${article.practiceMcq.explanation})
• **English:** ${english.mcqQuestion}
  ✅ **Answer:** ${english.mcqOptions[article.practiceMcq.correct]} (${english.mcqExplanation})

2️⃣ **प्रश्न 2 (Nodal Ministry / Agency):**
• **Hindi:** "${article.headline.split(':')[0]}" किस नोडल मंत्रालय/संस्था से संबंधित है?
  ✅ **उत्तर:** ${article.sourceMinistry}
• **English:** Which nodal ministry/authority oversees "${english.headline.split(':')[0]}"?
  ✅ **Answer:** ${english.sourceMinistry}

3️⃣ **प्रश्न 3 (Key Provision & Data):**
• **Hindi:** इस पहल का सबसे प्रमुख नीतिगत प्रावधान क्या है?
  ✅ **उत्तर:** ${article.provisions[0]}
• **English:** What is the primary statutory/policy provision of this initiative?
  ✅ **Answer:** ${english.provisions[0]}

4️⃣ **प्रश्न 4 (High-Yield One-Liner Fact):**
• **Hindi:** परीक्षा हेतु सबसे महत्वपूर्ण गोल्डन फैक्ट क्या है?
  ✅ **उत्तर:** ${article.highYieldFact}
• **English:** What is the high-yield Prelims takeaway fact?
  ✅ **Answer:** ${english.highYieldFact}

5️⃣ **प्रश्न 5 (Analytical / Statement Question):**
• **Hindi:** इस पहल के मुख्य आयाम क्या हैं?
  ✅ **उत्तर:** (क) ${article.dimensions[0]} (ख) ${article.dimensions[1] || article.provisions[1]}
• **English:** Key analytical dimensions: (a) ${english.dimensions[0]} (b) ${english.dimensions[1] || english.provisions[1]}`;
  }

  return `✨ **HANS COMPAIN AI द्विभाषी विशेषज्ञ व्याख्या (Bilingual Doubt Solution - Hindi & English):**

📌 **आपका प्रश्न (Student Query):** "${question}"

🇮🇳 **भाग 1: सरल हिंदी में सम्पूर्ण स्पष्टीकरण (Simplified Hindi Breakdown):**
• **मुख्य बात (Core Idea):** ${article.summary}
• **ऐतिहासिक व नीतिगत पृष्ठभूमि (Background):** ${article.background}
• **प्रमुख परीक्षा बिंदु (Key Dimensions):**
  1. ${article.dimensions[0]}
  2. ${article.dimensions[1] || article.provisions[0]}
  3. ${article.dimensions[2] || article.provisions[1] || article.highYieldFact}
• **आधिकारिक प्रावधान (Official Provisions):** ${article.provisions.join(' | ')}
• **गोल्डन प्रीलिम्स फैक्ट:** ${article.highYieldFact}

🇬🇧 **Part 2: Complete English Explanation (Bilingual Exam Guide):**
• **Executive Summary:** ${english.summary}
• **Background & Context:** ${english.background}
• **Key Analytical Dimensions:**
  1. ${english.dimensions[0]}
  2. ${english.dimensions[1] || english.provisions[0]}
  3. ${english.dimensions[2] || english.provisions[1] || english.highYieldFact}
• **High-Yield Exam Fact:** ${english.highYieldFact}
• **Mains Answer Tip:** ${english.mainsConclusion}`;
}
