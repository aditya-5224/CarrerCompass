export type Semester = { sem: number; label: string; subjects: string[]; skills: string[] };
export type Company = { name: string; role: string; emoji: string; color: string; about: string; perks: string[] };
export type Stream = {
  id: string; name: string; shortName: string; emoji: string;
  color: string; glow: string; tagline: string; semLabel: string;
  semesters: Semester[];
  opportunities: string[];
  companies: Company[];
  salaryRange: string;
  topColleges: string[];
};

export const STREAMS: Stream[] = [
  {
    id: "cse", name: "Computer Science Engineering", shortName: "CSE", emoji: "💻",
    color: "#818cf8", glow: "rgba(129,140,248,0.3)", tagline: "Build the software that runs the world.",
    salaryRange: "₹6L – ₹40L+", semLabel: "Semester", topColleges: ["IIT Bombay", "IIT Delhi", "BITS Pilani", "NIT Trichy"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Engineering Maths", "Physics", "C Programming"], skills: ["Logic Building", "Basic Coding"] },
      { sem: 2, label: "Sem 2", subjects: ["Data Structures", "Digital Electronics", "Discrete Maths"], skills: ["DSA Basics", "Boolean Logic"] },
      { sem: 3, label: "Sem 3", subjects: ["Algorithms", "OOP (Java)", "Computer Organization"], skills: ["Time Complexity", "OOP"] },
      { sem: 4, label: "Sem 4", subjects: ["Operating Systems", "DBMS", "Computer Networks"], skills: ["SQL", "Networking"] },
      { sem: 5, label: "Sem 5", subjects: ["Software Engg.", "Web Tech", "Theory of Computation"], skills: ["HTML/CSS/JS", "SDLC"] },
      { sem: 6, label: "Sem 6", subjects: ["AI Basics", "Cloud Computing", "Compiler Design"], skills: ["AWS", "AI Concepts"] },
      { sem: 7, label: "Sem 7", subjects: ["Machine Learning", "Cybersecurity", "Distributed Systems"], skills: ["Python/ML", "Docker"] },
      { sem: 8, label: "Sem 8", subjects: ["Final Year Project", "Electives", "Capstone"], skills: ["Real Product", "Research"] },
    ],
    opportunities: ["Software Engineer", "AI/ML Engineer", "Product Manager", "Startup Founder", "Cloud Architect"],
    companies: [
      { name: "Google", role: "Software Engineer", emoji: "🔍", color: "#4285F4", about: "World's largest search company and AI pioneer. Offices in 50+ countries.", perks: ["₹25L–₹60L CTC", "Free meals & transport", "20% innovation time", "World-class mentors"] },
      { name: "Amazon", role: "SDE II", emoji: "📦", color: "#FF9900", about: "Global e-commerce & cloud giant. AWS powers 30% of the internet.", perks: ["₹20L–₹50L CTC", "Stock grants (RSU)", "Leadership training", "Global mobility"] },
      { name: "Microsoft", role: "Full Stack Dev", emoji: "🪟", color: "#00A1F1", about: "The company behind Windows, Azure, and GitHub. 221,000 employees worldwide.", perks: ["₹18L–₹45L CTC", "Azure certifications", "WFH flexibility", "Hackathon culture"] },
      { name: "Infosys", role: "Systems Engineer", emoji: "🏢", color: "#007CC3", about: "India's second-largest IT company with 300,000+ employees in 50 countries.", perks: ["₹6L–₹12L CTC", "Global onsite opportunities", "Training at Mysore Campus", "Fast promotions"] },
      { name: "Startup", role: "Full Stack Engineer", emoji: "🚀", color: "#10b981", about: "Join India's booming startup ecosystem. High risk, high reward, equity stakes.", perks: ["₹8L–₹20L + Equity", "Massive learning curve", "Build from scratch", "Direct founder access"] },
    ],
  },
  {
    id: "aiml", name: "AI & Machine Learning", shortName: "CS AIML", emoji: "🤖",
    color: "#c084fc", glow: "rgba(192,132,252,0.3)", tagline: "Teach machines to think like humans.",
    salaryRange: "₹8L – ₹60L+", semLabel: "Semester", topColleges: ["IIT Hyderabad", "IIIT Hyderabad", "IIT Madras", "IISc Bangalore"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Linear Algebra", "Statistics", "Python Programming"], skills: ["NumPy", "Pandas"] },
      { sem: 2, label: "Sem 2", subjects: ["Data Structures", "Calculus for ML", "Data Visualization"], skills: ["Matplotlib", "Algo Design"] },
      { sem: 3, label: "Sem 3", subjects: ["ML Fundamentals", "Databases", "Signal Processing"], skills: ["Scikit-learn", "SQL"] },
      { sem: 4, label: "Sem 4", subjects: ["Deep Learning", "Computer Vision", "NLP Basics"], skills: ["TensorFlow", "PyTorch"] },
      { sem: 5, label: "Sem 5", subjects: ["Reinforcement Learning", "Big Data", "Cloud AI"], skills: ["AWS SageMaker", "Spark"] },
      { sem: 6, label: "Sem 6", subjects: ["Generative AI", "MLOps", "AI Ethics"], skills: ["LLMs", "Docker", "CI/CD"] },
      { sem: 7, label: "Sem 7", subjects: ["Research Methods", "Autonomous Systems", "Edge AI"], skills: ["TinyML", "ROS"] },
      { sem: 8, label: "Sem 8", subjects: ["Thesis / Industry Project", "Startup Lab", "AI Product"], skills: ["End-to-end AI Product"] },
    ],
    opportunities: ["ML Engineer", "AI Research Scientist", "Data Scientist", "NLP Engineer", "AI Product Manager"],
    companies: [
      { name: "OpenAI", role: "Research Engineer", emoji: "🧠", color: "#10a37f", about: "The company behind ChatGPT and GPT-4. Frontier AI research lab.", perks: ["₹40L–₹1Cr+ CTC", "Cutting-edge research", "AI safety focus", "Top researchers worldwide"] },
      { name: "Google DeepMind", role: "AI Scientist", emoji: "🔬", color: "#4285F4", about: "Google's flagship AI research lab. Made AlphaGo and Gemini.", perks: ["₹35L–₹80L CTC", "Published research", "PhD fast-track", "Nobel-level colleagues"] },
      { name: "Meta AI", role: "ML Engineer", emoji: "👓", color: "#1877F2", about: "Meta's AI division works on LLaMA, PyTorch and AR/VR AI.", perks: ["₹25L–₹70L CTC", "Open source contributions", "PyTorch community", "AR/VR projects"] },
      { name: "Zomato/Swiggy", role: "Data Scientist", emoji: "🍔", color: "#E23744", about: "India's top food-tech giants using ML for recommendations & delivery.", perks: ["₹15L–₹35L CTC", "India impact at scale", "Fast-paced culture", "Equity options"] },
      { name: "DRDO/ISRO", role: "AI Researcher", emoji: "🛰️", color: "#ff6b35", about: "India's defence and space research uses AI for missile systems, satellites.", perks: ["Government security", "National pride", "Cutting-edge defence tech", "Research publications"] },
    ],
  },
  {
    id: "mbbs", name: "MBBS / Medical", shortName: "MBBS", emoji: "🩺",
    color: "#f43f5e", glow: "rgba(244,63,94,0.3)", tagline: "Heal, restore, and save lives.",
    salaryRange: "₹8L – ₹50L+", semLabel: "Year", topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER Puducherry", "KGMU Lucknow"],
    semesters: [
      { sem: 1, label: "Year 1", subjects: ["Anatomy", "Physiology", "Biochemistry"], skills: ["Human Body Structure", "Cell Biology"] },
      { sem: 2, label: "Year 2", subjects: ["Microbiology", "Pathology", "Pharmacology"], skills: ["Disease Diagnosis", "Drug Mechanism"] },
      { sem: 3, label: "Year 3A", subjects: ["Forensic Medicine", "Community Medicine", "ENT"], skills: ["Legal Medicine", "Public Health"] },
      { sem: 4, label: "Year 3B", subjects: ["General Medicine", "General Surgery", "Obstetrics"], skills: ["Clinical Diagnosis", "Surgical Skills"] },
      { sem: 5, label: "Year 4A", subjects: ["Paediatrics", "Ophthalmology", "Orthopaedics"], skills: ["Child Healthcare", "Eye Surgery"] },
      { sem: 6, label: "Internship", subjects: ["Rotation in all departments", "Emergency Medicine", "Research"], skills: ["Real Patient Handling", "Clinical Practice"] },
    ],
    opportunities: ["MBBS Doctor", "Surgeon (PG/MS)", "Psychiatrist", "Medical Researcher", "Hospital Administrator"],
    companies: [
      { name: "AIIMS", role: "Resident Doctor", emoji: "🏥", color: "#e11d48", about: "India's premier medical institute. Serves 10,000+ patients daily.", perks: ["₹80K–₹1.2L/month", "Best clinical exposure", "Research opportunities", "Government job security"] },
      { name: "Apollo Hospitals", role: "Specialist", emoji: "❤️", color: "#dc2626", about: "Asia's largest healthcare group with 70+ hospitals across India.", perks: ["₹12L–₹40L CTC", "Global training", "Super-specialty exposure", "Performance bonuses"] },
      { name: "Fortis Healthcare", role: "Consultant", emoji: "🔬", color: "#16a34a", about: "Leading hospital chain with 36+ hospitals and world-class facilities.", perks: ["₹10L–₹35L CTC", "Modern technology", "Research grants", "Work-life balance"] },
      { name: "WHO / UN", role: "Public Health Officer", emoji: "🌍", color: "#2563eb", about: "World Health Organisation — global health policy and disease control.", perks: ["$60K–$120K USD", "Global postings", "UN benefits", "Save millions of lives"] },
      { name: "Pharma MNCs", role: "Medical Advisor", emoji: "💊", color: "#7c3aed", about: "Companies like Cipla, Sun Pharma, Pfizer hire doctors as medical advisors.", perks: ["₹15L–₹30L CTC", "No night shifts", "Research & writing", "Travel opportunities"] },
    ],
  },
  {
    id: "commerce", name: "B.Com / CA / MBA", shortName: "Commerce", emoji: "📊",
    color: "#f59e0b", glow: "rgba(245,158,11,0.3)", tagline: "Master money, markets, and management.",
    salaryRange: "₹5L – ₹35L+", semLabel: "Semester", topColleges: ["SRCC Delhi", "LSR Delhi", "St. Xavier's Mumbai", "IIM Ahmedabad (MBA)"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Financial Accounting", "Business Maths", "Economics I"], skills: ["Bookkeeping", "Micro-economics"] },
      { sem: 2, label: "Sem 2", subjects: ["Cost Accounting", "Business Law", "Economics II"], skills: ["Cost Analysis", "Corporate Law"] },
      { sem: 3, label: "Sem 3", subjects: ["Taxation", "Corporate Accounting", "Statistics"], skills: ["GST & Income Tax", "Data Analysis"] },
      { sem: 4, label: "Sem 4", subjects: ["Auditing", "Financial Management", "Marketing"], skills: ["Audit Reports", "Fund Management"] },
      { sem: 5, label: "Sem 5", subjects: ["Investment Analysis", "Management Accounting", "E-Commerce"], skills: ["Portfolio Management", "Digital Commerce"] },
      { sem: 6, label: "Sem 6", subjects: ["International Business", "Research Methods", "Specialization"], skills: ["Global Trade", "Industry Project"] },
    ],
    opportunities: ["Chartered Accountant (CA)", "Financial Analyst", "Investment Banker", "MBA Graduate", "Tax Consultant"],
    companies: [
      { name: "Deloitte", role: "Audit Associate", emoji: "📋", color: "#86bc25", about: "One of Big 4. World's largest professional services firm.", perks: ["₹8L–₹20L CTC", "Big 4 brand", "CPA/CA support", "Global travel"] },
      { name: "KPMG", role: "Tax Analyst", emoji: "🧾", color: "#00338D", about: "Big 4 firm specialising in audit, tax and advisory services.", perks: ["₹7L–₹18L CTC", "Tax expertise", "International postings", "Fast growth"] },
      { name: "Goldman Sachs", role: "Finance Analyst", emoji: "💰", color: "#7B6FAB", about: "World's leading investment bank. Operations in 40+ countries.", perks: ["₹20L–₹60L CTC", "Highest finance salaries", "Wall Street culture", "Exit ops to PE/VC"] },
      { name: "HDFC Bank", role: "Relationship Manager", emoji: "🏦", color: "#004C8F", about: "India's largest private bank. 8000+ branches across India.", perks: ["₹6L–₹14L CTC", "Stable career", "Loan/banking expertise", "Quick promotions"] },
      { name: "McKinsey", role: "Business Analyst", emoji: "📈", color: "#2563eb", about: "World's top management consulting firm. MBA dream company.", perks: ["₹18L–₹40L CTC", "CEO-level exposure", "MBA sponsorship", "Global strategy work"] },
    ],
  },
  {
    id: "arts", name: "BA / Arts & Humanities", shortName: "BA/Arts", emoji: "🎨",
    color: "#06b6d4", glow: "rgba(6,182,212,0.3)", tagline: "Shape opinions, cultures, and societies.",
    salaryRange: "₹3L – ₹25L+", semLabel: "Semester", topColleges: ["Delhi University", "JNU", "Jadavpur University", "Ashoka University"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Social Sciences", "English Literature", "History I"], skills: ["Critical Thinking", "Essay Writing"] },
      { sem: 2, label: "Sem 2", subjects: ["Political Science", "Sociology", "Psychology I"], skills: ["Research Methods", "Social Analysis"] },
      { sem: 3, label: "Sem 3", subjects: ["Modern History", "Media & Communication", "Philosophy"], skills: ["Journalism Basics", "Logical Reasoning"] },
      { sem: 4, label: "Sem 4", subjects: ["Public Administration", "Economics", "Gender Studies"], skills: ["Policy Analysis", "Statistical Tools"] },
      { sem: 5, label: "Sem 5", subjects: ["International Relations", "Digital Media", "Specialization I"], skills: ["UPSC Concepts", "Content Creation"] },
      { sem: 6, label: "Sem 6", subjects: ["Final Thesis", "Fieldwork", "Competitive Exam Prep"], skills: ["Research Paper", "UPSC / Law Ready"] },
    ],
    opportunities: ["IAS/IPS Officer (UPSC)", "Journalist", "Lawyer (after LLB)", "Psychologist", "NGO Leader"],
    companies: [
      { name: "UPSC / IAS", role: "IAS Officer", emoji: "🏛️", color: "#1e40af", about: "India's most prestigious exam. IAS/IPS officers run the country.", perks: ["₹56K–₹2.5L/month", "Bungalows & staff", "Nation-level impact", "Pension & security"] },
      { name: "NDTV / The Hindu", role: "Journalist", emoji: "📰", color: "#dc2626", about: "India's top news organisations — print, digital and TV journalism.", perks: ["₹5L–₹20L CTC", "Press credentials", "Interview top leaders", "Public recognition"] },
      { name: "UN / UNDP", role: "Policy Analyst", emoji: "🌏", color: "#009edb", about: "United Nations agencies hire humanities graduates for global policy work.", perks: ["$50K–$100K USD", "Geneva/NYC postings", "Diplomatic passport", "Global impact"] },
      { name: "Content Agencies", role: "Content Creator", emoji: "✍️", color: "#7c3aed", about: "Digital content is India's fastest growing industry. Writers are in high demand.", perks: ["₹4L–₹15L CTC", "Work from home", "Creative freedom", "Fast growth"] },
      { name: "NGOs / Think Tanks", role: "Researcher", emoji: "🤝", color: "#059669", about: "CRY, Pratham, CSDS — research and policy organisations for social change.", perks: ["₹4L–₹12L CTC", "Social impact", "International grants", "Flexible work"] },
    ],
  },
  {
    id: "hotel", name: "Hotel Management (BHM)", shortName: "BHM", emoji: "🏨",
    color: "#10b981", glow: "rgba(16,185,129,0.3)", tagline: "Create unforgettable experiences worldwide.",
    salaryRange: "₹4L – ₹30L+", semLabel: "Semester", topColleges: ["IHM Mumbai", "IHM Delhi", "Welcomgroup Manipal", "IHM Kolkata"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Food Production I", "F&B Service", "Front Office I"], skills: ["Basic Cooking", "Guest Handling"] },
      { sem: 2, label: "Sem 2", subjects: ["Housekeeping", "Communication Skills", "Nutrition"], skills: ["Room Management", "Professional English"] },
      { sem: 3, label: "Sem 3", subjects: ["Food Production II", "Bakery", "Hospitality Accounts"], skills: ["Continental Cuisine", "Cost Control"] },
      { sem: 4, label: "Sem 4", subjects: ["Advanced F&B", "Hotel Law", "PMS Software"], skills: ["Bar Management", "Hotel Systems"] },
      { sem: 5, label: "Sem 5", subjects: ["Event Management", "Tourism", "Revenue Management"], skills: ["Event Planning", "Yield Management"] },
      { sem: 6, label: "Sem 6", subjects: ["Entrepreneurship", "HR in Hospitality", "Research"], skills: ["Leadership", "Staff Management"] },
      { sem: 7, label: "Sem 7", subjects: ["Industrial Training I", "Specialization"], skills: ["5-star Property Experience"] },
      { sem: 8, label: "Sem 8", subjects: ["Industrial Training II", "Dissertation", "Placement Prep"], skills: ["International Hotel Ready"] },
    ],
    opportunities: ["Hotel Manager", "Executive Chef", "Event Manager", "Resort Manager", "Airline Hospitality"],
    companies: [
      { name: "Taj Hotels", role: "F&B Manager", emoji: "🏯", color: "#b45309", about: "India's most iconic luxury hotel group. Part of Tata Group. 100+ hotels.", perks: ["₹6L–₹20L CTC", "World-class properties", "International postings", "Tata benefits"] },
      { name: "Marriott International", role: "Front Office Manager", emoji: "⭐", color: "#c2002f", about: "World's largest hotel chain. 8,000+ properties in 139 countries.", perks: ["₹8L–₹25L CTC", "Global transfers", "Hotel stay discounts", "Leadership program"] },
      { name: "Oberoi Group", role: "Executive Chef", emoji: "👨‍🍳", color: "#1a1a2e", about: "India's most luxurious hotel group. Known for finest culinary arts.", perks: ["₹7L–₹22L CTC", "Culinary excellence", "European training", "Top chef mentors"] },
      { name: "Air India / IndiGo", role: "Cabin Crew", emoji: "✈️", color: "#2563eb", about: "Aviation hospitality — serve passengers on domestic & international routes.", perks: ["₹5L–₹12L CTC", "Free flights worldwide", "Travel allowance", "Glamorous career"] },
      { name: "Thomas Cook", role: "Travel Manager", emoji: "🗺️", color: "#f97316", about: "World's oldest travel company. Tour operations & luxury travel packages.", perks: ["₹5L–₹15L CTC", "Fam trips worldwide", "Tourism expertise", "Sales commissions"] },
    ],
  },
  {
    id: "law", name: "BA LLB / LLB (Law)", shortName: "LAW", emoji: "⚖️",
    color: "#8b5cf6", glow: "rgba(139,92,246,0.3)", tagline: "Defend rights and shape justice.",
    salaryRange: "₹4L – ₹40L+", semLabel: "Semester", topColleges: ["NLU Delhi (NLS)", "NLU Mumbai", "Symbiosis Law School", "Christ University"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Law of Contract", "Constitutional Law I", "Legal Methods"], skills: ["Legal Drafting", "Contract Analysis"] },
      { sem: 2, label: "Sem 2", subjects: ["Criminal Law (IPC)", "Tort Law", "Constitutional Law II"], skills: ["IPC Sections", "Case Analysis"] },
      { sem: 3, label: "Sem 3", subjects: ["Family Law", "Property Law", "CPC"], skills: ["Court Procedures", "Legal Research"] },
      { sem: 4, label: "Sem 4", subjects: ["Corporate Law", "Labour Law", "IPR"], skills: ["Company Law", "Patent Filing"] },
      { sem: 5, label: "Sem 5", subjects: ["International Law", "Environmental Law", "Evidence Law"], skills: ["Global Treaties", "Moot Court"] },
      { sem: 6, label: "Sem 6", subjects: ["ADR/Arbitration", "Human Rights Law", "Taxation Law"], skills: ["Mediation", "Negotiation"] },
      { sem: 7, label: "Sem 7", subjects: ["Cyber Law", "Banking Law", "Clinical Legal Aid"], skills: ["Digital Laws", "Pro-bono Cases"] },
      { sem: 8, label: "Sem 8", subjects: ["Dissertation", "Court Internship", "Bar Exam Prep"], skills: ["High Court Exposure"] },
      { sem: 9, label: "Sem 9", subjects: ["Moot Court Finals", "Advanced Trial Advocacy", "Electives"], skills: ["Oral Arguments", "Trial Skills"] },
      { sem: 10, label: "Sem 10", subjects: ["Final Thesis", "Placement / Judiciary Prep", "Capstone"], skills: ["Bar Council Enrollment Ready"] },
    ],
    opportunities: ["Advocate / Lawyer", "Corporate Counsel", "Judge (Judiciary Exam)", "Legal Advisor", "Activist / Politician"],
    companies: [
      { name: "Cyril Amarchand Mangaldas", role: "Associate Lawyer", emoji: "⚖️", color: "#1e3a5f", about: "India's largest law firm. Handles biggest M&A and corporate deals.", perks: ["₹12L–₹30L CTC", "Top corporate work", "International deals", "Premium brand"] },
      { name: "Supreme Court Bar", role: "Advocate", emoji: "🏛️", color: "#7c3aed", about: "Argue cases at India's highest constitutional court.", perks: ["Prestigious career", "Constitutional impact", "Landmark judgements", "Legacy building"] },
      { name: "Tata Legal / Infosys Legal", role: "In-house Counsel", emoji: "💼", color: "#0f172a", about: "Corporate in-house legal teams — contracts, compliance, IP protection.", perks: ["₹15L–₹40L CTC", "Corporate lifestyle", "No court stress", "Equity benefits"] },
      { name: "Judiciary (HJS/HCS)", role: "Civil Judge", emoji: "👨‍⚖️", color: "#b45309", about: "State judicial exams lead to Civil Judge posts — most respected legal career.", perks: ["Government security", "₹80K–₹2L/month", "Pension & housing", "Highest social respect"] },
      { name: "NHRC / NALSA", role: "Legal Officer", emoji: "🌿", color: "#059669", about: "National Human Rights Commission — fight for justice at the national level.", perks: ["₹8L–₹18L CTC", "Social impact", "Policy influence", "Nation-level work"] },
    ],
  },
  {
    id: "design", name: "Design / Fine Arts / Fashion", shortName: "Design", emoji: "✏️",
    color: "#ec4899", glow: "rgba(236,72,153,0.3)", tagline: "Create beauty that moves the world.",
    salaryRange: "₹4L – ₹30L+", semLabel: "Semester", topColleges: ["NID Ahmedabad", "NIFT Delhi", "MIT Institute of Design", "Pearl Academy"],
    semesters: [
      { sem: 1, label: "Sem 1", subjects: ["Drawing & Sketching", "Design Principles", "Color Theory"], skills: ["Hand Drawing", "Composition"] },
      { sem: 2, label: "Sem 2", subjects: ["Typography", "Material Science", "Art History"], skills: ["Font Design", "Fabric Knowledge"] },
      { sem: 3, label: "Sem 3", subjects: ["Digital Design Tools", "UX Fundamentals", "Textile Design"], skills: ["Adobe Suite", "Figma", "Prototyping"] },
      { sem: 4, label: "Sem 4", subjects: ["Brand Identity", "Product Design", "Photography"], skills: ["Logo Design", "Visual Storytelling"] },
      { sem: 5, label: "Sem 5", subjects: ["Fashion Illustration", "Industrial Design", "Advertising"], skills: ["Campaign Design", "3D Modeling"] },
      { sem: 6, label: "Sem 6", subjects: ["Trend Forecasting", "Sustainable Design", "Motion Graphics"], skills: ["After Effects", "Eco Design"] },
      { sem: 7, label: "Sem 7", subjects: ["Portfolio Development", "Internship", "Design Research"], skills: ["Client Projects", "Case Studies"] },
      { sem: 8, label: "Sem 8", subjects: ["Graduation Show / Thesis Collection", "Placement"], skills: ["Industry-ready Portfolio"] },
    ],
    opportunities: ["UI/UX Designer", "Fashion Designer", "Brand Designer", "Creative Director", "Animator"],
    companies: [
      { name: "Myntra", role: "Fashion Designer", emoji: "👗", color: "#e91e63", about: "India's top fashion e-commerce. Employs 1000+ designers & stylists.", perks: ["₹8L–₹20L CTC", "Fashion industry exposure", "Trend-setting work", "Startup energy"] },
      { name: "Google (UX)", role: "UX Designer", emoji: "🔍", color: "#4285F4", about: "Google's design team creates interfaces used by billions worldwide.", perks: ["₹20L–₹50L CTC", "Material Design system", "Global product impact", "Top UX mentors"] },
      { name: "Zomato / Swiggy", role: "Brand Designer", emoji: "🎨", color: "#E23744", about: "India's biggest food apps invest heavily in brand & UI design.", perks: ["₹10L–₹25L CTC", "Young team", "Rapid iteration", "Stock options"] },
      { name: "Sabyasachi / Manish Malhotra", role: "Fashion Stylist", emoji: "👑", color: "#92400e", about: "India's top luxury fashion designers. Red carpet, Bollywood, weddings.", perks: ["Prestige brand", "Celebrity clients", "Fashion weeks", "Creative freedom"] },
      { name: "Wieden+Kennedy", role: "Creative Director", emoji: "💡", color: "#7c3aed", about: "World's top advertising agency. Created Nike's 'Just Do It' campaign.", perks: ["₹15L–₹40L CTC", "Award-winning campaigns", "Global clients", "Creative excellence"] },
    ],
  },
];
