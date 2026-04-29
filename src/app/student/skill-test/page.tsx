"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenText,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Globe,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import styles from "./skill-test.module.css";

type Lang = "en" | "hi";

/* ── Hindi translations for every question ───────────────────────────── */
const hindiQuestions: Record<number, { prompt: string; options: string[] }> = {
  1: {
    prompt:
      "एक छात्र क्लब के सोशल मीडिया फॉलोअर्स इस प्रकार बढ़ते हैं: 3, 9, 21, 45, 93। इस तार्किक क्रम के आधार पर अगले महीने का लक्ष्य क्या है?",
    options: ["189", "141", "195", "120"],
  },
  2: {
    prompt:
      "आपकी रिपोर्ट पर शिक्षक की प्रतिक्रिया कहती है: 'आपके तर्क तकनीकी रूप से सही हैं, लेकिन अंतिम निष्कर्ष आपके प्राथमिक साक्ष्य से कुछ हद तक अलग लगता है।' शिक्षक का मुख्य सुझाव क्या है?",
    options: [
      "अपनी व्याकरण और वर्तनी सुधारें।",
      "अपने तथ्यों और अपने सारांश के बीच तार्किक संबंध को मजबूत करें।",
      "एक नए विषय का समर्थन करने के लिए और साक्ष्य खोजें।",
      "विषय प्रदान किए गए साक्ष्य के लिए बहुत जटिल है।",
    ],
  },
  3: {
    prompt:
      "आपको स्कूल जिम में 10 बूथ लगाने हैं। दो बड़े खंभे केंद्र में रास्ता रोकते हैं। यदि आप बूथों को खंभों के चारों ओर गोलाकार प्रवाह में मानसिक रूप से घुमाते हैं, तो 10x10 मीटर क्षेत्र में 2 मीटर चलने का रास्ता रखते हुए कितने 2x2 मीटर बूथ फिट हो सकते हैं?",
    options: ["12", "10", "8", "6"],
  },
  4: {
    prompt:
      "ग्रुप प्रेजेंटेशन की रिहर्सल के दौरान, एक टीम मेंबर आपके काम पर व्यंग्य करता है। बाकी सब हंसते हैं। आप महसूस करते हैं कि यह नेता के रूप में आपकी भूमिका को कमजोर करता है। आप कैसे प्रतिक्रिया करते हैं?",
    options: [
      "रिहर्सल खत्म होने तक प्रतीक्षा करें, फिर टीम की दिशा के बारे में निजी तौर पर बात करें।",
      "खुद पर मजाक बनाएं ताकि टीम को लगे कि आप सहज हैं।",
      "ग्रेडिंग मानदंडों की याद दिलाने के लिए तुरंत रिहर्सल रोकें।",
      "टिप्पणी को नज़रअंदाज़ करें और अधिक ध्यान से जारी रखें।",
    ],
  },
  5: {
    prompt:
      "अनुक्रम: वृत्त वर्ग के अंदर, वर्ग त्रिभुज के अंदर, त्रिभुज षट्कोण के अंदर। श्रृंखला को क्या पूरा करता है?",
    options: [
      "षट्कोण वृत्त के अंदर",
      "षट्कोण अष्टकोण के अंदर",
      "अष्टकोण वर्ग के अंदर",
      "वर्ग वृत्त के अंदर",
    ],
  },
  6: {
    prompt:
      "लीवर के रूप में एक लंबे लकड़ी के तख्ते का उपयोग करके 50 किलो का बक्सा उठाने के लिए, कम से कम बल लगाने के लिए आधार बिंदु (फुलक्रम) कहाँ रखना चाहिए?",
    options: [
      "आपके हाथों के सबसे करीब।",
      "बिल्कुल बीच में।",
      "भारी बक्से के सबसे करीब।",
      "स्थान की परवाह किए बिना बल स्थिर रहता है।",
    ],
  },
  7: {
    prompt:
      "क्लब उपस्थिति — महीना 1: 20, महीना 2: 30, महीना 3: 15। महीना 3 में उसी दिन अनिवार्य परीक्षा थी। एक साथी कहता है, 'क्लब खत्म हो रहा है।' आपका तार्किक निष्कर्ष क्या है?",
    options: [
      "साथी सही है; रुचि घट रही है।",
      "परीक्षा एक भ्रामक कारक है; प्रवृत्ति जानने के लिए हमें बिना परीक्षा के महीना 4 का परीक्षण करना होगा।",
      "हमें क्लब का विषय कुछ और रोमांचक में बदलना चाहिए।",
      "महीना 2 की वृद्धि एक संयोग थी।",
    ],
  },
  8: {
    prompt:
      "आप एक स्थानीय चैरिटी के लिए लोगो डिज़ाइन कर रहे हैं। वे 'पारंपरिक' चाहते हैं, लेकिन आपके शोध से पता चलता है कि 'आधुनिक' लोगो 40% अधिक युवा दाताओं को आकर्षित करेगा।",
    options: [
      "एक क्लासिक प्रतीक को आधुनिक शैली में मिलाकर हाइब्रिड लोगो बनाएं।",
      "ग्राहक खुश रहे इसके लिए निर्देशों का बिल्कुल पालन करें।",
      "केवल आधुनिक शैली का उपयोग करें, क्योंकि आप विशेषज्ञ हैं।",
      "दो अलग-अलग लोगो बनाएं और बिना राय दिए उन्हें चुनने दें।",
    ],
  },
  9: {
    prompt:
      "इन दो छात्र आईडी सूचियों की तुलना करें: सूची 1: 4492-X, 3921-A, 8820-Z, 1102-B। सूची 2: 4492-X, 3921-A, 8802-Z, 1102-B। सूची 2 में कितनी गलतियाँ हैं?",
    options: ["0", "1", "2", "3"],
  },
  10: {
    prompt:
      "आपको पता चलता है कि एक साथी ने गलती से शिक्षक को दी गई रिपोर्ट में प्रोजेक्ट की सफलता बढ़ा-चढ़ाकर लिखी है। शिक्षक ने पहले ही ग्रुप को 'A' ग्रेड दे दिया है। आप क्या करते हैं?",
    options: [
      "निजी तौर पर शिक्षक को बताएं और डेटा ठीक करने की पेशकश करें, भले ही ग्रेड बदल जाए।",
      "कुछ न कहें; यह दुर्घटना थी और परिणाम अच्छा था।",
      "साथी को निजी तौर पर सही करें लेकिन ग्रेड वैसा ही छोड़ दें।",
      "उम्मीद करें कि शिक्षक को पता न चले और अगले प्रोजेक्ट में अतिरिक्त मेहनत करें।",
    ],
  },
  11: {
    prompt:
      "सभी सफल कलाकार रचनात्मक हैं। कुछ छात्र सफल कलाकार हैं। इसलिए, कुछ छात्र रचनात्मक हैं। यह है:",
    options: ["हमेशा सत्य", "हमेशा असत्य", "अनिश्चित"],
  },
  12: {
    prompt:
      "आपने एश्ले के साथ एक प्रोजेक्ट पर काम किया। वह निराश और चुप थी। यदि उसका गुस्सा कठिन गणित कार्यों के कारण है, तो आप मदद कर सकते हैं। आपका पहला कदम क्या है?",
    options: [
      "एश्ले से पूछें कि क्या उसे प्रोजेक्ट कार्यों में मदद चाहिए।",
      "उसे बताएं कि आप उसकी निराशा समझते हैं और पूछें कि क्या वह बात करना चाहती है।",
      "उसका तनाव कम करने के लिए प्रोजेक्ट कार्य खुद पूरे करें।",
      "शिक्षक को बताएं कि वह मुश्किल पैदा कर रही है और नया पार्टनर माँगें।",
    ],
  },
  13: {
    prompt: "छात्र छात्रवृत्ति आवेदन के लिए कौन सा वाक्य सबसे पेशेवर है?",
    options: [
      "मुझे यह चाहिए क्योंकि आपका शहर का सबसे अच्छा स्कूल है।",
      "मेरा उद्देश्य अपनी दक्षताओं का उपयोग इस प्रकार करना है जो आपके संगठन को मूल्य प्रदान करे।",
      "मैं अपनी कक्षा के किसी भी छात्र से बेहतर काम कर सकता हूँ।",
      "मैं आमतौर पर किसी की भावनाओं को महसूस कर सकता हूँ।",
    ],
  },
  14: {
    prompt:
      "PDF के विज़ुअल प्रॉम्प्ट में 3x3 ग्रिड दिखाया गया है जहाँ आकृतियाँ हर चरण में 90 डिग्री घड़ी की दिशा में घूमती हैं। अंतिम वर्ग को कौन सा विकल्प सबसे अच्छा पूरा करता है?",
    options: [
      "मैट्रिक्स पूरा करने के लिए उसी घड़ी की दिशा में घुमाव जारी रखें।",
      "पिछली आकृति को जमाकर बिना बदले दोहराएं।",
      "बाहरी आकृति को स्थिर रखते हुए केवल भीतरी आकृति को घुमाएं।",
      "घुमाव नियम का पालन किए बिना आकृतियों को बदल दें।",
    ],
  },
  15: {
    prompt:
      "आप लैब समस्या का सही उत्तर जानते हैं, लेकिन आपका ग्रुप लीडर इसे गलत तरीके से समझा रहा है। आप कैसे प्रतिक्रिया करते हैं?",
    options: [
      "विनम्रता से एक सवाल पूछें जो गलती को उजागर करे, ताकि लीडर खुद सुधार कर सके।",
      "तुरंत सही उत्तर बोलें ताकि ग्रुप का समय बर्बाद न हो।",
      "कुछ न कहें; लीडर गलत भी हो तो उसकी बात माननी चाहिए।",
      "लीडर को सही करें और फिर खराब प्रबंधन के लिए शिक्षक को रिपोर्ट करें।",
    ],
  },
  16: {
    prompt:
      "यदि चार जुड़े गियर्स की प्रणाली में पहला गियर घड़ी की दिशा में घूमता है, तो चौथा गियर किस दिशा में घूमता है?",
    options: [
      "घड़ी की दिशा में",
      "घड़ी की विपरीत दिशा में",
      "यह नहीं घूमता",
      "यह बारी-बारी बदलता है",
    ],
  },
  17: {
    prompt:
      "आपके क्लब के पास 3 महीने का पैसा बचा है। आप 'सुरक्षित' छोटी बिक्री कर सकते हैं जिसमें ₹50 का गारंटीड लाभ है, या 'महत्वाकांक्षी' कार्यक्रम जिसमें ₹500 का संभावित लाभ है लेकिन 50% जोखिम है कि सारा पैसा खो जाएगा।",
    options: [
      "सदस्यों से सर्वे करें कि जोखिम कम करने के लिए क्या आकर्षक होगा।",
      "महत्वाकांक्षी कार्यक्रम करें; उच्च जोखिम ही क्लब बचाने का एकमात्र तरीका है।",
      "सुरक्षित बिक्री करें ताकि क्लब अधिक समय तक चले।",
      "क्लब अभी बंद करें और पैसे अगले साल के लिए बचाएं।",
    ],
  },
  18: {
    prompt:
      "एक अलग संस्कृति का नया छात्र आपके ग्रुप में शामिल होता है। वह शांत है और आँख नहीं मिलाता। आप:",
    options: [
      "उनकी भागीदारी का आकलन करने से पहले उनकी संस्कृति के संवाद मानदंडों पर शोध करें।",
      "ज़ोर से और धीरे बोलें ताकि वे आपको समझ सकें।",
      "मान लें कि वे शर्मीले हैं और उनकी ओर से बात करें।",
      "उन्हें बताएं कि नेतृत्व भूमिकाओं के लिए आँख मिलाना ज़रूरी है।",
    ],
  },
  19: {
    prompt:
      "एक छात्र दुकान ₹0.50 में पेन खरीदती है और ₹1.20 में बेचती है। अगर वे 40 पेन बेचते हैं लेकिन 5 पेन चोरी हो जाते हैं, तो कुल लाभ कितना है?",
    options: ["₹28.00", "₹25.50", "₹23.00", "₹30.00"],
  },
  20: {
    prompt:
      "आपको अपनी डिबेट टीम के लिए 3 लोगों को चुनना है। आप किसे चुनते हैं:",
    options: [
      "अपने 3 सबसे अच्छे दोस्त ताकि आसानी से काम हो सके।",
      "इतिहास में सबसे अधिक अंक वाले 3 छात्र।",
      "एक अच्छा वक्ता, एक अच्छा शोधकर्ता, और नोट्स व्यवस्थित करने में माहिर एक व्यक्ति।",
      "वे लोग जिन्हें अभी तक टीम में मौका नहीं मिला, निष्पक्षता के लिए।",
    ],
  },
};

/* ── Hindi UI strings ────────────────────────────────────────────────── */
const uiStrings = {
  en: {
    skillTest: "Skill Test",
    careerCompass: "CareerCompass",
    assessmentSnapshot: "Assessment snapshot",
    questions: "Questions",
    answered: "Answered",
    status: "Status",
    fitScore: "Fit score",
    done: "Done",
    inProgress: "In progress",
    ready: "Ready",
    questionMap: "Question map",
    howItWorks: "How it works",
    howItWorksItems: [
      "Each answer contributes to an aptitude lane based on the PDF weighting system.",
      "Finish the full set to unlock your career fit and strength profile.",
      "You can jump back to any question before submitting.",
    ],
    basedOnPdf: "Based on the attached PDF",
    heroTitle: "Interactive aptitude and reasoning assessment",
    heroDesc:
      "This version turns the question set into a polished, scenario-driven test with progress tracking, weighted scoring, and a career-fit summary at the end.",
    focusPacing: "Focus-friendly pacing",
    weightedScoring: "Weighted scoring",
    profilesByLane: "Profiles strengths by lane",
    careerMapping: "Career mapping",
    showsAlignedRoles: "Shows aligned roles instantly",
    startSkillTest: "Start skill test",
    previewQuestions: "Preview questions",
    assessmentComplete: "Assessment complete",
    overallFit: "overall fit",
    retake: "Retake",
    topStrengths: "Top strengths",
    bestFitRoles: "Best-fit roles",
    recommended: "Recommended",
    strongestLane: "Strongest lane",
    areaToPractice: "Area to practice",
    questionReview: "Question review",
    yourAnswer: "Your answer",
    benchmark: "Benchmark",
    skipped: "Skipped",
    whyItMatters: "Why it matters",
    questionOf: "Question",
    of: "of",
    pleaseAnswer: "Please answer question",
    beforeFinishing: "before finishing.",
    psychologicalMapping: "Psychological mapping",
    careerDomain: "Career domain",
    hiddenInsight: "Hidden insight",
    benchmarkAnswer: "Benchmark answer",
    back: "Back",
    finishAssessment: "Finish assessment",
    nextQuestion: "Next question",
    fit: "fit",
    andLabel: "and",
    stoodOutMost: "stood out the most.",
    weakestLaneText: "is currently your lightest lane, so that is the best place to improve if you want a more balanced profile.",
    summaryHigh: "You look highly aligned with analytical and leadership-heavy roles that reward structured judgment and fast pattern recognition.",
    summarySolid: "You show solid aptitude across several areas. Your strongest lanes are starting to emerge clearly.",
    summaryForming: "Your profile is still forming. Use the result breakdown to see which thinking style is already strong and which skills need more practice.",
    summaryDefault: "Work through each scenario at your own pace. You can move back and revise answers before you submit.",
    time: "8-12 min",
  },
  hi: {
    skillTest: "कौशल परीक्षा",
    careerCompass: "करियरकम्पास",
    assessmentSnapshot: "मूल्यांकन सारांश",
    questions: "प्रश्न",
    answered: "उत्तर दिए",
    status: "स्थिति",
    fitScore: "फिट स्कोर",
    done: "पूर्ण",
    inProgress: "जारी",
    ready: "तैयार",
    questionMap: "प्रश्न मानचित्र",
    howItWorks: "यह कैसे काम करता है",
    howItWorksItems: [
      "प्रत्येक उत्तर PDF भार प्रणाली के आधार पर एक योग्यता लेन में योगदान देता है।",
      "अपनी करियर फिट और शक्ति प्रोफ़ाइल अनलॉक करने के लिए पूरा सेट पूरा करें।",
      "जमा करने से पहले आप किसी भी प्रश्न पर वापस जा सकते हैं।",
    ],
    basedOnPdf: "संलग्न PDF पर आधारित",
    heroTitle: "इंटरैक्टिव योग्यता और तर्क मूल्यांकन",
    heroDesc:
      "यह संस्करण प्रश्न सेट को प्रगति ट्रैकिंग, भारित स्कोरिंग और अंत में करियर-फिट सारांश के साथ एक परिष्कृत, परिदृश्य-संचालित परीक्षा में बदल देता है।",
    focusPacing: "ध्यान-अनुकूल गति",
    weightedScoring: "भारित स्कोरिंग",
    profilesByLane: "लेन द्वारा शक्ति प्रोफ़ाइल",
    careerMapping: "करियर मैपिंग",
    showsAlignedRoles: "तुरंत मिलती-जुलती भूमिकाएँ दिखाता है",
    startSkillTest: "कौशल परीक्षा शुरू करें",
    previewQuestions: "प्रश्न पूर्वावलोकन",
    assessmentComplete: "मूल्यांकन पूर्ण",
    overallFit: "कुल फिट",
    retake: "दोबारा लें",
    topStrengths: "शीर्ष ताकतें",
    bestFitRoles: "सर्वश्रेष्ठ भूमिकाएँ",
    recommended: "सुझावित",
    strongestLane: "सबसे मजबूत लेन",
    areaToPractice: "अभ्यास क्षेत्र",
    questionReview: "प्रश्न समीक्षा",
    yourAnswer: "आपका उत्तर",
    benchmark: "बेंचमार्क",
    skipped: "छोड़ा गया",
    whyItMatters: "यह क्यों मायने रखता है",
    questionOf: "प्रश्न",
    of: "में से",
    pleaseAnswer: "कृपया प्रश्न का उत्तर दें",
    beforeFinishing: "समाप्त करने से पहले।",
    psychologicalMapping: "मनोवैज्ञानिक मानचित्रण",
    careerDomain: "करियर क्षेत्र",
    hiddenInsight: "छिपी जानकारी",
    benchmarkAnswer: "बेंचमार्क उत्तर",
    back: "पीछे",
    finishAssessment: "मूल्यांकन समाप्त करें",
    nextQuestion: "अगला प्रश्न",
    fit: "फिट",
    andLabel: "और",
    stoodOutMost: "सबसे अलग दिखे।",
    weakestLaneText: "वर्तमान में आपकी सबसे हल्की लेन है, इसलिए अधिक संतुलित प्रोफ़ाइल चाहते हैं तो यहाँ सुधार करें।",
    summaryHigh: "आप विश्लेषणात्मक और नेतृत्व-भारी भूमिकाओं के लिए अत्यधिक उपयुक्त दिखते हैं जो संरचित निर्णय और तेज पैटर्न पहचान को पुरस्कृत करती हैं।",
    summarySolid: "आप कई क्षेत्रों में ठोस योग्यता दिखाते हैं। आपकी सबसे मजबूत लेनें स्पष्ट रूप से उभरने लगी हैं।",
    summaryForming: "आपकी प्रोफ़ाइल अभी बन रही है। यह देखने के लिए परिणाम विश्लेषण का उपयोग करें कि कौन सी सोच शैली पहले से मजबूत है।",
    summaryDefault: "अपनी गति से प्रत्येक परिदृश्य पर काम करें। जमा करने से पहले आप वापस जाकर उत्तर संशोधित कर सकते हैं।",
    time: "8-12 मिनट",
  },
};

type BucketKey =
  | "numerical"
  | "verbal"
  | "spatial"
  | "social"
  | "leadership"
  | "creative"
  | "mechanical"
  | "detail"
  | "ethics"
  | "strategic"
  | "cultural"
  | "deductive"
  | "language"
  | "analytical";

type Option = {
  id: string;
  label: string;
  text: string;
  score: number;
};

type Question = {
  id: number;
  section: string;
  prompt: string;
  focus: string;
  psychological: string;
  careerDomain: string;
  hiddenInsight: string;
  confidence: number;
  impacts: Array<{ key: BucketKey; weight: number }>;
  options: Option[];
};

type BucketMeta = {
  label: string;
  color: string;
  roles: string[];
  summary: string;
};

const bucketMeta: Record<BucketKey, BucketMeta> = {
  numerical: {
    label: "Numerical Reasoning",
    color: "#66e3ff",
    roles: ["Data Analyst", "Actuary", "Financial Analyst"],
    summary: "Sees patterns, proportions, and logical growth quickly.",
  },
  verbal: {
    label: "Verbal Reasoning",
    color: "#8b9cff",
    roles: ["Lawyer", "Researcher", "Communications Strategist"],
    summary: "Reads nuance, implication, and logical structure in language.",
  },
  spatial: {
    label: "Spatial Reasoning",
    color: "#ffad66",
    roles: ["Architect", "UI/UX Designer", "Product Designer"],
    summary: "Handles rotation, layout, and visual structure comfortably.",
  },
  social: {
    label: "Social Insight",
    color: "#7ee787",
    roles: ["Counselor", "Teacher", "Community Manager"],
    summary: "Notices emotional context and social dynamics fast.",
  },
  leadership: {
    label: "Leadership",
    color: "#f7c64e",
    roles: ["Product Manager", "Team Lead", "Operations Manager"],
    summary: "Balances people, priorities, and execution pressure.",
  },
  creative: {
    label: "Creative Synthesis",
    color: "#ff7eb6",
    roles: ["Marketing Strategist", "Brand Designer", "Content Strategist"],
    summary: "Blends research and aesthetics into a strong concept.",
  },
  mechanical: {
    label: "Mechanical Reasoning",
    color: "#c6a0ff",
    roles: ["Mechanical Engineer", "Technician", "Field Engineer"],
    summary: "Understands force, motion, and systems reliably.",
  },
  detail: {
    label: "Detail & Accuracy",
    color: "#5eead4",
    roles: ["QA Analyst", "Accountant", "HR Specialist"],
    summary: "Catches small mismatches and works methodically.",
  },
  ethics: {
    label: "Ethics & Integrity",
    color: "#fb7185",
    roles: ["Auditor", "Compliance Officer", "HR Generalist"],
    summary: "Shows long-term judgment when rules and pressure collide.",
  },
  strategic: {
    label: "Strategic Thinking",
    color: "#f97316",
    roles: ["Entrepreneur", "Project Lead", "Business Analyst"],
    summary: "Chooses risk with a measured view of consequences.",
  },
  cultural: {
    label: "Cultural Intelligence",
    color: "#38bdf8",
    roles: ["Teacher", "Counselor", "DEI Specialist"],
    summary: "Reads cultural context before judging behavior.",
  },
  deductive: {
    label: "Deductive Logic",
    color: "#a78bfa",
    roles: ["Researcher", "Policy Analyst", "Legal Analyst"],
    summary: "Follows premises carefully and avoids jumpy conclusions.",
  },
  language: {
    label: "Language Precision",
    color: "#34d399",
    roles: ["Editor", "PR Coordinator", "Scholarship Advisor"],
    summary: "Uses formal, professional language with care.",
  },
  analytical: {
    label: "Analytical Thinking",
    color: "#60a5fa",
    roles: ["Software Engineer", "Data Scientist", "Business Analyst"],
    summary: "Integrates evidence, trends, and logic into action.",
  },
};

const questions: Question[] = [
  {
    id: 1,
    section: "Numerical Trend Recognition",
    prompt:
      "A student club's social media followers grow as follows: 3, 9, 21, 45, 93. What is the next month target based on this logical progression?",
    focus: "Numerical Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Separates calculated logic from ambitious guessing under pressure.",
    confidence: 0.95,
    impacts: [{ key: "numerical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "189", score: 1 },
      { id: "b", label: "B", text: "141", score: 0.2 },
      { id: "c", label: "C", text: "195", score: 0.3 },
      { id: "d", label: "D", text: "120", score: 0.1 },
    ],
  },
  {
    id: 2,
    section: "The Missing Section",
    prompt:
      "A teacher's feedback on your report says: 'Your arguments are technically sound, but the final conclusion feels somewhat detached from your primary evidence.' What is the teacher's core suggestion?",
    focus: "Verbal Reasoning",
    psychological: "Investigative / Social",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Measures the ability to detect logical gaps in a written argument.",
    confidence: 0.9,
    impacts: [{ key: "verbal", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Improve your grammar and spelling.", score: 0.1 },
      { id: "b", label: "B", text: "Strengthen the logical link between your facts and your summary.", score: 1 },
      { id: "c", label: "C", text: "Find more evidence to support a new topic.", score: 0.4 },
      { id: "d", label: "D", text: "The topic is too complex for the evidence provided.", score: 0.2 },
    ],
  },
  {
    id: 3,
    section: "Spatial Event Planning",
    prompt:
      "You must set up 10 booths in a school gym. Two large pillars block the center. If you mentally rotate the booths to create a circular flow around the pillars, how many 2x2 meter booths can fit in a 10x10 meter area while maintaining a 2-meter walking path throughout?",
    focus: "Space Relations",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight: "Correlates spatial ability with physical problem-solving speed.",
    confidence: 0.95,
    impacts: [{ key: "spatial", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "12", score: 0.4 },
      { id: "b", label: "B", text: "10", score: 1 },
      { id: "c", label: "C", text: "8", score: 0.6 },
      { id: "d", label: "D", text: "6", score: 0.3 },
    ],
  },
  {
    id: 4,
    section: "The Group Conflict",
    prompt:
      "During a rehearsal for a group presentation, a teammate makes a sarcastic joke about your section of the work. The rest laugh. You feel this undermines your role as leader. How do you respond?",
    focus: "Social + Leadership",
    psychological: "Enterprising + Social",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Separates task focus from relationship management under stress.",
    confidence: 0.92,
    impacts: [
      { key: "leadership", weight: 0.6 },
      { key: "social", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Wait until the rehearsal finishes, then speak to the teammate privately about the team's focus.",
        score: 1,
      },
      {
        id: "b",
        label: "B",
        text: "Make a joke back at yourself to show the team you are easygoing.",
        score: 0.6,
      },
      {
        id: "c",
        label: "C",
        text: "Immediately stop the rehearsal to remind everyone of the grading criteria.",
        score: 0.4,
      },
      {
        id: "d",
        label: "D",
        text: "Ignore the comment and continue with increased focus.",
        score: 0.3,
      },
    ],
  },
  {
    id: 5,
    section: "Abstract Pattern Sequence",
    prompt:
      "Sequence: Circle inside Square, Square inside Triangle, Triangle inside Hexagon. What completes the series?",
    focus: "Abstract Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Predicts success in non-verbal problem-solving and pattern recognition.",
    confidence: 0.95,
    impacts: [{ key: "analytical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Hexagon inside Circle", score: 0.2 },
      { id: "b", label: "B", text: "Hexagon inside Octagon", score: 1 },
      { id: "c", label: "C", text: "Octagon inside Square", score: 0.4 },
      { id: "d", label: "D", text: "Square inside Circle", score: 0.3 },
    ],
  },
  {
    id: 6,
    section: "Mechanical Advantage",
    prompt:
      "To lift a 50kg crate using a long wooden plank as a lever, where should the pivot point (fulcrum) be placed to use the least amount of physical force?",
    focus: "Mechanical Reasoning",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Predicts comfort with physical systems, tools, and vocational tasks.",
    confidence: 0.95,
    impacts: [{ key: "mechanical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Closest to your hands.", score: 0.2 },
      { id: "b", label: "B", text: "Exactly in the middle.", score: 0.5 },
      { id: "c", label: "C", text: "Closest to the heavy crate.", score: 1 },
      { id: "d", label: "D", text: "Force remains constant regardless of placement.", score: 0 },
    ],
  },
  {
    id: 7,
    section: "Data Interpretation",
    prompt:
      "Club attendance Month 1: 20, Month 2: 30, Month 3: 15. In Month 3, a mandatory exam session was held the same day. A teammate says, 'The club is dying.' What is your logical conclusion?",
    focus: "Analytical Reasoning",
    psychological: "Investigative / Thinker",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Measures whether you isolate a confounding variable before jumping to conclusions.",
    confidence: 0.9,
    impacts: [{ key: "analytical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "The teammate is right; interest is declining.", score: 0.2 },
      {
        id: "b",
        label: "B",
        text: "The exam is a confounding variable; we must test Month 4 without exams to know the trend.",
        score: 1,
      },
      { id: "c", label: "C", text: "We should change the club topic to something more exciting.", score: 0.3 },
      { id: "d", label: "D", text: "The growth in Month 2 was a fluke.", score: 0.4 },
    ],
  },
  {
    id: 8,
    section: "The Design Dilemma",
    prompt:
      "You are designing a logo for a local charity. They want 'traditional,' but your research shows a 'modern' logo will attract 40% more young donors.",
    focus: "Creative + Analytical",
    psychological: "Artistic + Investigative",
    careerDomain: "Creative & Business",
    hiddenInsight:
      "Measures how well you synthesize conflicting evidence into one strong solution.",
    confidence: 0.94,
    impacts: [
      { key: "creative", weight: 0.6 },
      { key: "analytical", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Create a hybrid logo using a classic symbol in a clean, modern style.",
        score: 1,
      },
      { id: "b", label: "B", text: "Follow the instructions exactly to ensure the client is happy.", score: 0.6 },
      { id: "c", label: "C", text: "Use the modern style only, as you are the expert.", score: 0.4 },
      { id: "d", label: "D", text: "Create two different logos and let them choose without giving your opinion.", score: 0.5 },
    ],
  },
  {
    id: 9,
    section: "Clerical Accuracy Check",
    prompt:
      "Compare these two student lists of IDs: List 1: 4492-X, 3921-A, 8820-Z, 1102-B. List 2: 4492-X, 3921-A, 8802-Z, 1102-B. How many errors are there in List 2?",
    focus: "Perceptual Speed and Accuracy",
    psychological: "Conventional / Organizer",
    careerDomain: "Leadership & Technical",
    hiddenInsight:
      "High scores predict success in detail-oriented, systematic environments.",
    confidence: 0.95,
    impacts: [{ key: "detail", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "0", score: 0.1 },
      { id: "b", label: "B", text: "1", score: 1 },
      { id: "c", label: "C", text: "2", score: 0.2 },
      { id: "d", label: "D", text: "3", score: 0.1 },
    ],
  },
  {
    id: 10,
    section: "The Ethical Slide",
    prompt:
      "You realize a teammate accidentally inflated your group's project success in a report to the teacher. Your teacher has already given the group an 'A'. What do you do?",
    focus: "Integrity + Strategic",
    psychological: "Conventional + Social",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Tests long-term integrity risk instead of short-term comfort.",
    confidence: 0.92,
    impacts: [
      { key: "ethics", weight: 0.7 },
      { key: "social", weight: 0.3 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Inform the teacher privately and offer to fix the data, even if the grade changes.",
        score: 1,
      },
      { id: "b", label: "B", text: "Say nothing; it was an accident and the outcome was good.", score: 0.1 },
      { id: "c", label: "C", text: "Correct the teammate in private but leave the grade as is.", score: 0.5 },
      { id: "d", label: "D", text: "Hope the teacher doesn't notice and work extra hard on the next project to earn the grade.", score: 0.3 },
    ],
  },
  {
    id: 11,
    section: "Logical Syllogism",
    prompt:
      "All successful artists are creative. Some students are successful artists. Therefore, some students are creative. Is this:",
    focus: "Deductive Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Social",
    hiddenInsight:
      "Shows resistance to optimism bias by following premises precisely.",
    confidence: 0.95,
    impacts: [{ key: "deductive", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Always True", score: 1 },
      { id: "b", label: "B", text: "Always False", score: 0 },
      { id: "c", label: "C", text: "Uncertain", score: 0.2 },
    ],
  },
  {
    id: 12,
    section: "The Feedback Loop",
    prompt:
      "You worked with Ashley on a project. She was frustrated and quiet. If her anger is due to the difficult math tasks, you can help. What is your first step?",
    focus: "Social + Analytical",
    psychological: "Social",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Measures perspective-taking and the quality of your first social move.",
    confidence: 0.93,
    impacts: [
      { key: "social", weight: 0.7 },
      { key: "leadership", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "Ask Ashley if she needs help with the project tasks.", score: 0.7 },
      { id: "b", label: "B", text: "Let her know you perceive her frustration and ask if she wants to talk.", score: 1 },
      { id: "c", label: "C", text: "Finish the project tasks yourself to reduce her stress.", score: 0.4 },
      { id: "d", label: "D", text: "Tell the teacher she is being difficult and ask for a new partner.", score: 0.1 },
    ],
  },
  {
    id: 13,
    section: "Language Consistency",
    prompt:
      "Which sentence is most professional for a student scholarship application?",
    focus: "Language Usage",
    psychological: "Conventional / Organizer",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Measures attention to detail and awareness of formal communication standards.",
    confidence: 0.92,
    impacts: [
      { key: "language", weight: 0.7 },
      { key: "detail", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "I want this because your the best school in the city.", score: 0 },
      { id: "b", label: "B", text: "My objective is to utilize my competencies in a way that provides value to your organization.", score: 1 },
      { id: "c", label: "C", text: "I can do the work better then any other student in my class.", score: 0.1 },
      { id: "d", label: "D", text: "I'm normally able to 'get into someone's shoes' and experience their emotions.", score: 0.6 },
    ],
  },
  {
    id: 14,
    section: "Abstract Reasoning: Matrix Completion",
    prompt:
      "The PDF's visual prompt shows a 3x3 grid where shapes rotate 90 degrees clockwise in each step. Which choice best completes the final square?",
    focus: "Abstract Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "This visual logic task checks whether you can continue the rule without getting lost in surface detail.",
    confidence: 0.95,
    impacts: [
      { key: "spatial", weight: 0.6 },
      { key: "analytical", weight: 0.4 },
    ],
    options: [
      { id: "a", label: "A", text: "Continue the same clockwise rotation to complete the matrix.", score: 1 },
      { id: "b", label: "B", text: "Freeze the previous shape and repeat it unchanged.", score: 0.3 },
      { id: "c", label: "C", text: "Rotate only the inner shape while leaving the outer shape fixed.", score: 0.6 },
      { id: "d", label: "D", text: "Swap the shapes without following the rotation rule.", score: 0.2 },
    ],
  },
  {
    id: 15,
    section: "The Expert Trap",
    prompt:
      "You know the correct answer to a lab problem, but your group leader is explaining it incorrectly. How do you respond?",
    focus: "Social + Strategic",
    psychological: "Social + Enterprising",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Evaluates social regulation: modifying behavior to achieve the best group outcome.",
    confidence: 0.9,
    impacts: [
      { key: "social", weight: 0.6 },
      { key: "leadership", weight: 0.4 },
    ],
    options: [
      {
        id: "a",
        label: "A",
        text: "Politely ask a question that highlights the error, allowing the leader to discover the correction themselves.",
        score: 1,
      },
      { id: "b", label: "B", text: "State the correct answer out loud immediately so the group doesn't waste time.", score: 0.6 },
      { id: "c", label: "C", text: "Say nothing; it's better to follow the leader even if they are wrong.", score: 0.4 },
      { id: "d", label: "D", text: "Correct the leader and then report them to the teacher for poor management.", score: 0.2 },
    ],
  },
  {
    id: 16,
    section: "Mechanical Gears",
    prompt:
      "If the first gear in a system of four connected gears rotates clockwise, which direction does the fourth gear rotate?",
    focus: "Mechanical Reasoning",
    psychological: "Realistic / Doer",
    careerDomain: "Analytical & Technical",
    hiddenInsight: "Each gear reverses direction, so the chain logic matters.",
    confidence: 0.95,
    impacts: [{ key: "mechanical", weight: 1 }],
    options: [
      { id: "a", label: "A", text: "Clockwise", score: 0.2 },
      { id: "b", label: "B", text: "Counter-clockwise", score: 1 },
      { id: "c", label: "C", text: "It doesn't move", score: 0 },
      { id: "d", label: "D", text: "It alternates", score: 0.4 },
    ],
  },
  {
    id: 17,
    section: "Strategic Risk",
    prompt:
      "Your club has 3 months of money left. You can do a 'Safe' small sale with guaranteed $50 profit or an 'Ambitious' event with $500 potential profit but a 50% risk of losing all current funds.",
    focus: "Leadership + Strategic",
    psychological: "Enterprising + Investigative",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Distinguishes risk aversion from strategic innovation under uncertainty.",
    confidence: 0.9,
    impacts: [
      { key: "strategic", weight: 0.7 },
      { key: "leadership", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "Survey members to see what would make them attend the Ambitious event to reduce risk.", score: 1 },
      { id: "b", label: "B", text: "Do the Ambitious event; high risk is the only way to save the club.", score: 0.8 },
      { id: "c", label: "C", text: "Do the Safe sale to ensure the club stays open as long as possible.", score: 0.5 },
      { id: "d", label: "D", text: "Close the club now and save the money for next year.", score: 0.2 },
    ],
  },
  {
    id: 18,
    section: "The New Student",
    prompt:
      "A new student from a different culture joins your group. They are quiet and don't make eye contact. You:",
    focus: "Psychology + Cultural Intelligence",
    psychological: "Social + Openness",
    careerDomain: "Social & Psychological",
    hiddenInsight:
      "Checks whether you scan for cultural cues before labeling someone shy.",
    confidence: 0.92,
    impacts: [
      { key: "cultural", weight: 0.8 },
      { key: "social", weight: 0.2 },
    ],
    options: [
      { id: "a", label: "A", text: "Research their culture's communication norms before judging their participation.", score: 1 },
      { id: "b", label: "B", text: "Speak louder and more slowly to ensure they understand you.", score: 0.3 },
      { id: "c", label: "C", text: "Assume they are shy and do the talking for them.", score: 0.4 },
      { id: "d", label: "D", text: "Tell them eye contact is necessary for leadership roles.", score: 0.1 },
    ],
  },
  {
    id: 19,
    section: "Arithmetic Reasoning",
    prompt:
      "A student store buys pens for $0.50 and sells them for $1.20. If they sell 40 pens but 5 pens are stolen, what is their total profit?",
    focus: "Numerical Reasoning",
    psychological: "Investigative",
    careerDomain: "Analytical & Technical",
    hiddenInsight:
      "Checks whether you account for costs, not just visible sales revenue.",
    confidence: 0.95,
    impacts: [
      { key: "numerical", weight: 0.7 },
      { key: "detail", weight: 0.3 },
    ],
    options: [
      { id: "a", label: "A", text: "$28.00", score: 0.2 },
      { id: "b", label: "B", text: "$25.50", score: 1 },
      { id: "c", label: "C", text: "$23.00", score: 0.4 },
      { id: "d", label: "D", text: "$30.00", score: 0.3 },
    ],
  },
  {
    id: 20,
    section: "The Leadership Choice",
    prompt:
      "You must pick 3 people for your debate team. Do you pick:",
    focus: "Leadership + Team Composition",
    psychological: "Enterprising + Conventional",
    careerDomain: "Leadership & Business",
    hiddenInsight:
      "Shows whether you scan for competencies instead of comfort when building a team.",
    confidence: 0.92,
    impacts: [
      { key: "leadership", weight: 0.6 },
      { key: "detail", weight: 0.4 },
    ],
    options: [
      { id: "a", label: "A", text: "Your 3 best friends so you can work together easily.", score: 0.3 },
      { id: "b", label: "B", text: "The 3 students with the highest history grades.", score: 0.7 },
      { id: "c", label: "C", text: "One great speaker, one great researcher, and one person who is good at organizing notes.", score: 1 },
      { id: "d", label: "D", text: "People who haven't had a chance to be on a team yet to be fair.", score: 0.6 },
    ],
  },
];

const bucketOrder: BucketKey[] = [
  "analytical",
  "numerical",
  "verbal",
  "spatial",
  "social",
  "leadership",
  "creative",
  "mechanical",
  "detail",
  "ethics",
  "strategic",
  "cultural",
  "deductive",
  "language",
];

export default function SkillTest() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("en");

  // Load language preference from localStorage (set on the homepage)
  useEffect(() => {
    const saved = localStorage.getItem("careercompass-lang");
    if (saved === "en" || saved === "hi") setLang(saved);
  }, []);

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("careercompass-lang", newLang);
  };

  const t = uiStrings[lang];

  const getQuestionPrompt = (q: Question) => {
    if (lang === "hi" && hindiQuestions[q.id]) return hindiQuestions[q.id].prompt;
    return q.prompt;
  };

  const getOptionText = (q: Question, optionIndex: number) => {
    if (lang === "hi" && hindiQuestions[q.id]?.options[optionIndex]) {
      return hindiQuestions[q.id].options[optionIndex];
    }
    return q.options[optionIndex]?.text ?? "";
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[activeIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const results = useMemo(() => {
    const totals: Record<BucketKey, { score: number; max: number }> = {
      numerical: { score: 0, max: 0 },
      verbal: { score: 0, max: 0 },
      spatial: { score: 0, max: 0 },
      social: { score: 0, max: 0 },
      leadership: { score: 0, max: 0 },
      creative: { score: 0, max: 0 },
      mechanical: { score: 0, max: 0 },
      detail: { score: 0, max: 0 },
      ethics: { score: 0, max: 0 },
      strategic: { score: 0, max: 0 },
      cultural: { score: 0, max: 0 },
      deductive: { score: 0, max: 0 },
      language: { score: 0, max: 0 },
      analytical: { score: 0, max: 0 },
    };

    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((question) => {
      const selectedOption = question.options.find((option) => option.id === answers[question.id]);
      const bestOption = Math.max(...question.options.map((option) => option.score));
      const resolvedScore = selectedOption?.score ?? 0;

      totalScore += resolvedScore * question.confidence;
      maxScore += bestOption * question.confidence;

      question.impacts.forEach((impact) => {
        totals[impact.key].score += resolvedScore * impact.weight * question.confidence;
        totals[impact.key].max += bestOption * impact.weight * question.confidence;
      });
    });

    const bucketScores = bucketOrder.map((key) => ({
      key,
      label: bucketMeta[key].label,
      color: bucketMeta[key].color,
      summary: bucketMeta[key].summary,
      roles: bucketMeta[key].roles,
      percent: totals[key].max > 0 ? Math.round((totals[key].score / totals[key].max) * 100) : 0,
    }));

    const sortedBuckets = [...bucketScores].sort((left, right) => right.percent - left.percent);
    const overallScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    return {
      bucketScores,
      sortedBuckets,
      overallScore,
    };
  }, [answers]);

  const primaryBucket = results.sortedBuckets[0];
  const secondaryBucket = results.sortedBuckets[1];
  const weakestBucket = [...results.sortedBuckets].sort((left, right) => left.percent - right.percent)[0];

  const recommendationRoles = useMemo(() => {
    const roles = results.sortedBuckets.slice(0, 3).flatMap((bucket) => bucket.roles);
    return Array.from(new Set(roles)).slice(0, 4);
  }, [results.sortedBuckets]);

  const summaryTone = useMemo(() => {
    if (!finished) {
      return t.summaryDefault;
    }

    if (results.overallScore >= 85) {
      return t.summaryHigh;
    }

    if (results.overallScore >= 70) {
      return t.summarySolid;
    }

    return t.summaryForming;
  }, [finished, results.overallScore, t]);

  const handleSelect = (optionId: string) => {
    setNotice(null);
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  };

  const goToQuestion = (index: number) => {
    setActiveIndex(index);
    setNotice(null);
  };

  const handleNext = () => {
    setNotice(null);
    if (activeIndex === questions.length - 1) {
      if (answeredCount !== questions.length) {
        const firstUnanswered = questions.findIndex((question) => !answers[question.id]);
        setNotice(`${t.pleaseAnswer} ${firstUnanswered + 1} ${t.beforeFinishing}`);
        if (firstUnanswered >= 0) {
          setActiveIndex(firstUnanswered);
        }
        return;
      }

      setFinished(true);
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  const handlePrevious = () => {
    setNotice(null);
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setActiveIndex(0);
    setAnswers({});
    setNotice(null);
  };

  const startAssessment = () => {
    setStarted(true);
    setFinished(false);
    setActiveIndex(0);
    setNotice(null);
  };

  const currentBestOption = currentQuestion.options.reduce((winner, option) =>
    option.score > winner.score ? option : winner
  );

  return (
    <div className={styles.page}>
      <div className={styles.auroraPrimary} />
      <div className={styles.auroraSecondary} />

      <main className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <BrainCircuit size={22} />
            </div>
            <div>
              <p className={styles.kicker}>{t.careerCompass}</p>
              <h1>{t.skillTest}</h1>
            </div>
          </div>

          {/* Language switcher */}
          <div className={styles.sidebarPanel}>
            <div className={styles.panelHeading}>
              <Globe size={16} />
              <span>{lang === "hi" ? "भाषा" : "Language"}</span>
            </div>
            <div className={styles.langRow}>
              <button
                className={`${styles.langChip} ${lang === "en" ? styles.langChipActive : ""}`}
                onClick={() => handleLangChange("en")}
              >
                English
              </button>
              <button
                className={`${styles.langChip} ${lang === "hi" ? styles.langChipActive : ""}`}
                onClick={() => handleLangChange("hi")}
              >
                हिन्दी
              </button>
            </div>
          </div>

          <div className={styles.sidebarPanel}>
            <div className={styles.panelHeading}>
              <Sparkles size={16} />
              <span>{t.assessmentSnapshot}</span>
            </div>
            <div className={styles.snapshotGrid}>
              <article className={styles.snapshotCard}>
                <span>{t.questions}</span>
                <strong>{questions.length}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>{t.answered}</span>
                <strong>{answeredCount}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>{t.status}</span>
                <strong>{finished ? t.done : started ? t.inProgress : t.ready}</strong>
              </article>
              <article className={styles.snapshotCard}>
                <span>{t.fitScore}</span>
                <strong>{finished ? `${results.overallScore}%` : "—"}</strong>
              </article>
            </div>
          </div>

          {started && (
            <div className={styles.sidebarPanel}>
              <div className={styles.panelHeading}>
                <Target size={16} />
                <span>{t.questionMap}</span>
              </div>
              <div className={styles.navigator}>
                {questions.map((question, index) => {
                  const isCurrent = index === activeIndex;
                  const isAnswered = Boolean(answers[question.id]);

                  return (
                    <button
                      key={question.id}
                      type="button"
                      className={[
                        styles.navigatorButton,
                        isCurrent ? styles.navigatorButtonActive : "",
                        isAnswered ? styles.navigatorButtonAnswered : "",
                      ].join(" ")}
                      onClick={() => goToQuestion(index)}
                    >
                      <span>{index + 1}</span>
                      <strong>{question.section}</strong>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.sidebarPanel}>
            <div className={styles.panelHeading}>
              <BookOpenText size={16} />
              <span>{t.howItWorks}</span>
            </div>
            <ul className={styles.legendList}>
              {t.howItWorksItems.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </aside>

        <section className={styles.content}>
          {!started ? (
            <div className={styles.heroCard}>
              <div className={styles.heroCopy}>
                <span className={styles.heroTag}>{t.basedOnPdf}</span>
                <h2>{t.heroTitle}</h2>
                <p>{t.heroDesc}</p>
              </div>

              <div className={styles.heroStats}>
                <article>
                  <Timer size={18} />
                  <div>
                    <strong>{t.time}</strong>
                    <span>{t.focusPacing}</span>
                  </div>
                </article>
                <article>
                  <BarChart3 size={18} />
                  <div>
                    <strong>{t.weightedScoring}</strong>
                    <span>{t.profilesByLane}</span>
                  </div>
                </article>
                <article>
                  <BadgeCheck size={18} />
                  <div>
                    <strong>{t.careerMapping}</strong>
                    <span>{t.showsAlignedRoles}</span>
                  </div>
                </article>
              </div>

              <div className={styles.heroActions}>
                <button type="button" className={styles.primaryButton} onClick={startAssessment}>
                  {t.startSkillTest}
                  <ArrowRight size={16} />
                </button>
                <button type="button" className={styles.secondaryButton} onClick={() => setStarted(true)}>
                  {t.previewQuestions}
                </button>
              </div>
            </div>
          ) : finished ? (
            <div className={styles.resultsWrap}>
              <div className={styles.resultsHero}>
                <div>
                  <span className={styles.heroTag}>{t.assessmentComplete}</span>
                  <h2>{results.overallScore}% {t.overallFit}</h2>
                  <p>{summaryTone}</p>
                </div>
                <button type="button" className={styles.secondaryButton} onClick={restart}>
                  <RotateCcw size={16} />
                  {t.retake}
                </button>
              </div>

              <div className={styles.resultsGrid}>
                <article className={styles.resultsPanel}>
                  <div className={styles.panelHeading}>
                    <Sparkles size={16} />
                    <span>{t.topStrengths}</span>
                  </div>
                  <div className={styles.strengthList}>
                    {results.sortedBuckets.slice(0, 5).map((bucket) => (
                      <div className={styles.strengthItem} key={bucket.key}>
                        <div className={styles.strengthLabelRow}>
                          <strong>{bucket.label}</strong>
                          <span>{bucket.percent}%</span>
                        </div>
                        <div className={styles.barTrack}>
                          <span className={styles.barFill} style={{ width: `${bucket.percent}%`, background: bucket.color }} />
                        </div>
                        <p>{bucket.summary}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.resultsPanel}>
                  <div className={styles.panelHeading}>
                    <Target size={16} />
                    <span>{t.bestFitRoles}</span>
                  </div>
                  <div className={styles.roleGrid}>
                    {recommendationRoles.map((role) => (
                      <div className={styles.roleCard} key={role}>
                        <span>{t.recommended}</span>
                        <strong>{role}</strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.noteCard}>
                    <strong>{t.strongestLane}</strong>
                    <p>
                      {primaryBucket?.label} {t.andLabel} {secondaryBucket?.label} {t.stoodOutMost}
                    </p>
                  </div>
                  <div className={styles.noteCard}>
                    <strong>{t.areaToPractice}</strong>
                    <p>
                      {weakestBucket?.label} {t.weakestLaneText}
                    </p>
                  </div>
                </article>
              </div>

              <article className={styles.resultsPanel}>
                <div className={styles.panelHeading}>
                  <BookOpenText size={16} />
                  <span>{t.questionReview}</span>
                </div>
                <div className={styles.reviewList}>
                  {questions.map((question) => {
                    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
                    const benchmarkOption = question.options.reduce((winner, option) =>
                      option.score > winner.score ? option : winner
                    );

                    return (
                      <div className={styles.reviewCard} key={question.id}>
                        <div className={styles.reviewHeader}>
                          <strong>
                            {question.id}. {question.section}
                          </strong>
                          <span>{question.focus}</span>
                        </div>
                        <p>{getQuestionPrompt(question)}</p>
                        <div className={styles.reviewMeta}>
                          <span>
                            {t.yourAnswer}: {selectedOption ? `${selectedOption.label} - ${lang === "hi" ? getOptionText(question, question.options.indexOf(selectedOption)) : selectedOption.text}` : t.skipped}
                          </span>
                          <span>
                            {t.benchmark}: {benchmarkOption.label} - {lang === "hi" ? getOptionText(question, question.options.indexOf(benchmarkOption)) : benchmarkOption.text}
                          </span>
                        </div>
                        <div className={styles.reviewInsight}>
                          <strong>{t.whyItMatters}</strong>
                          <p>{question.hiddenInsight}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          ) : (
            <div className={styles.questionStage}>
              <div className={styles.progressWrap}>
                <div className={styles.progressHeader}>
                  <span>
                    {t.questionOf} {activeIndex + 1} {t.of} {questions.length}
                  </span>
                  <span>{Math.round(((activeIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className={styles.progressTrack}>
                  <span
                    className={styles.progressFill}
                    style={{ width: `${((activeIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {notice && <div className={styles.notice}>{notice}</div>}

              <article className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <div>
                    <span className={styles.heroTag}>{currentQuestion.section}</span>
                    <h2>{getQuestionPrompt(currentQuestion)}</h2>
                  </div>
                  <div className={styles.questionBadge}>
                    <strong>{currentQuestion.focus}</strong>
                    <span>{Math.round(currentQuestion.confidence * 100)}% confidence</span>
                  </div>
                </div>

                <div className={styles.optionGrid}>
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentAnswer === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={[
                          styles.optionCard,
                          isSelected ? styles.optionCardSelected : "",
                        ].join(" ")}
                        onClick={() => handleSelect(option.id)}
                        aria-pressed={isSelected}
                      >
                        <div className={styles.optionTopRow}>
                          <span className={styles.optionLabel}>{option.label}</span>
                          <span className={styles.optionScore}>{Math.round(option.score * 100)}% {t.fit}</span>
                        </div>
                        <p>{getOptionText(currentQuestion, currentQuestion.options.indexOf(option))}</p>
                      </button>
                    );
                  })}
                </div>

                <div className={styles.questionInfoGrid}>
                  <div className={styles.infoCard}>
                    <span>{t.psychologicalMapping}</span>
                    <strong>{currentQuestion.psychological}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <span>{t.careerDomain}</span>
                    <strong>{currentQuestion.careerDomain}</strong>
                  </div>
                  <div className={styles.infoCard}>
                    <span>{t.hiddenInsight}</span>
                    <strong>{currentQuestion.hiddenInsight}</strong>
                  </div>
                </div>

                <div className={styles.questionControls}>
                  <button type="button" className={styles.secondaryButton} onClick={handlePrevious} disabled={activeIndex === 0}>
                    <ChevronLeft size={16} />
                    {t.back}
                  </button>

                  <div className={styles.controlHint}>
                    <span>{t.benchmarkAnswer}</span>
                    <strong>
                      {currentBestOption.label} - {getOptionText(currentQuestion, currentQuestion.options.indexOf(currentBestOption))}
                    </strong>
                  </div>

                  <button type="button" className={styles.primaryButton} onClick={handleNext}>
                    {activeIndex === questions.length - 1 ? t.finishAssessment : t.nextQuestion}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
