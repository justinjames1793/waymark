/**
 * Seed opportunities for Waymark.
 *
 * Organizations, programs and centers here are real UC San Diego ones, and the
 * URLs point at their real pages. Dates are set across fall quarter 2026 so the
 * feed has something upcoming to rank — only the Fall Career Fair slot is taken
 * from a published listing. Treat these as realistic demo data, not a live
 * scrape: before showing this to students, replace it with real ingest.
 */

export interface SeedOpportunity {
  title: string;
  organization: string;
  org_type: "club" | "professional" | "university" | "research";
  category: string;
  description: string;
  location: string;
  starts_at: string | null;
  is_recurring?: boolean;
  url: string;
  tags: string[];
}

const CLUB_HUB = "https://studentorg.ucsd.edu/";
const JACOBS_ORGS =
  "https://jacobsschool.ucsd.edu/idea/current-undergraduates/undergraduate";
const CAREER = "https://career.ucsd.edu/events/";
const UGRESEARCH = "https://ugresearch.ucsd.edu/";
const BASEMENT = "https://thebasement.ucsd.edu/";
const OIC = "https://innovation.ucsd.edu/";
const CALENDAR = "https://calendar.ucsd.edu/";

export const SEED_OPPORTUNITIES: SeedOpportunity[] = [
  // ---------------------------------------------------------------- clubs
  {
    title: "Hack School: Intro to Full-Stack Web Development",
    organization: "Association for Computing Machinery (ACM)",
    org_type: "club",
    category: "workshop",
    description:
      "A hands-on beginner track covering React, APIs and deployment. No prior web experience assumed — bring a laptop and leave with a deployed project you can put on a resume.",
    location: "Computer Science and Engineering Building",
    starts_at: "2026-10-06T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["web development", "react", "javascript", "beginner friendly", "software engineering"],
  },
  {
    title: "ACM Projects Kickoff and Team Matching",
    organization: "Association for Computing Machinery (ACM)",
    org_type: "club",
    category: "info-session",
    description:
      "Meet the project leads, hear what each team is building this year, and get matched onto a team. Projects range from developer tooling to ML applications.",
    location: "Price Center West Ballroom",
    starts_at: "2026-09-30T17:30:00-07:00",
    url: JACOBS_ORGS,
    tags: ["software engineering", "projects", "portfolio", "machine learning", "teamwork"],
  },
  {
    title: "Resume Review Night with Industry Mentors",
    organization: "Computer Science and Engineering Society (CSES)",
    org_type: "club",
    category: "networking",
    description:
      "Bring a printed resume and sit down one-on-one with engineers from San Diego tech companies for direct line-by-line feedback ahead of internship season.",
    location: "Franklin Antonio Hall",
    starts_at: "2026-10-14T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["resume", "internships", "networking", "software engineering", "career prep"],
  },
  {
    title: "Pro-Bono Project Team Recruitment",
    organization: "Triton Software Engineering (TSE)",
    org_type: "club",
    category: "info-session",
    description:
      "TSE builds free software for local nonprofits. Learn how the client engagements work and apply to join a project team as a developer, designer or product manager.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-10-01T19:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["software engineering", "nonprofit", "social impact", "product management", "design"],
  },
  {
    title: "Women in Computing Industry Panel",
    organization: "Undergraduate Women in Computing (WiC)",
    org_type: "club",
    category: "speaker",
    description:
      "Engineers and engineering managers talk candidly about first jobs, negotiating offers, and navigating early career decisions in tech.",
    location: "Computer Science and Engineering Building",
    starts_at: "2026-10-21T18:30:00-07:00",
    url: JACOBS_ORGS,
    tags: ["women in tech", "panel", "career growth", "mentorship", "software engineering"],
  },
  {
    title: "Intro to Bioinformatics Workshop",
    organization: "Undergraduate Bioinformatics Club (UBIC)",
    org_type: "club",
    category: "workshop",
    description:
      "A practical session on sequence analysis tooling and the Python ecosystem used in computational biology, aimed at students with some programming background.",
    location: "Biomedical Library",
    starts_at: "2026-10-08T17:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["bioinformatics", "python", "computational biology", "data science", "research"],
  },
  {
    title: "Hardware Workshop Series: PCB Design",
    organization: "Institute of Electrical and Electronics Engineers (IEEE)",
    org_type: "club",
    category: "workshop",
    description:
      "Design a printed circuit board from schematic to fabrication-ready files. Boards from the workshop get manufactured and returned to participants.",
    location: "Jacobs Hall",
    starts_at: "2026-10-13T18:00:00-07:00",
    is_recurring: true,
    url: JACOBS_ORGS,
    tags: ["hardware", "electrical engineering", "pcb", "embedded systems", "hands-on"],
  },
  {
    title: "SWE Evening with Industry",
    organization: "Society of Women Engineers (SWE)",
    org_type: "club",
    category: "networking",
    description:
      "Structured networking dinner with engineering employers across aerospace, biotech, defense and software. Business casual; company reps rotate between tables.",
    location: "Price Center Ballroom East",
    starts_at: "2026-10-28T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["networking", "women in engineering", "employers", "internships", "professional development"],
  },
  {
    title: "SHPE Fall General Body Meeting",
    organization: "Society of Hispanic Professional Engineers (SHPE)",
    org_type: "club",
    category: "networking",
    description:
      "Kickoff meeting covering the national convention, chapter mentorship pairings, and corporate partner opportunities for the year.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-10-02T18:00:00-07:00",
    is_recurring: true,
    url: JACOBS_ORGS,
    tags: ["community", "mentorship", "engineering", "professional development", "networking"],
  },
  {
    title: "NSBE Chapter Kickoff and Mentorship Pairing",
    organization: "National Society of Black Engineers (NSBE)",
    org_type: "club",
    category: "networking",
    description:
      "Meet the chapter, get paired with an upper-division or alumni mentor, and hear about regional conference travel funding.",
    location: "Center Hall",
    starts_at: "2026-10-05T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["community", "mentorship", "engineering", "conference", "networking"],
  },
  {
    title: "Formula SAE New Member Recruitment",
    organization: "Triton Racing",
    org_type: "club",
    category: "info-session",
    description:
      "Triton Racing designs, builds and races a formula-style car each year. Open to all majors — the team needs machinists, aero, electronics, and business/sponsorship leads.",
    location: "Engineering Building Unit II",
    starts_at: "2026-09-29T17:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["mechanical engineering", "automotive", "hands-on", "competition", "design"],
  },
  {
    title: "Rocket Propulsion Lab Open House",
    organization: "Rocket Propulsion Laboratory (RPL)",
    org_type: "club",
    category: "info-session",
    description:
      "Tour the propulsion test setup and machine shop, meet subteam leads, and learn how students go from new member to launching student-built rockets.",
    location: "Structural and Materials Engineering Building",
    starts_at: "2026-10-03T13:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["aerospace", "propulsion", "hands-on", "rocketry", "mechanical engineering"],
  },
  {
    title: "Building for the Headset: XR Development Workshop",
    organization: "Triton XR",
    org_type: "club",
    category: "workshop",
    description:
      "Build and deploy a small VR scene in Unity, then try it on a headset. Triton XR also runs an industry mentorship track with San Diego XR studios.",
    location: "Design and Innovation Building",
    starts_at: "2026-10-20T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["vr", "ar", "unity", "game development", "emerging tech"],
  },
  {
    title: "Fall Game Jam 2026",
    organization: "Video Game Development Club (VGDC)",
    org_type: "club",
    category: "competition",
    description:
      "A weekend-long game jam open to programmers, artists, writers and sound designers. Teams form on-site; finished games are showcased and judged.",
    location: "Design and Innovation Building",
    starts_at: "2026-11-06T17:00:00-08:00",
    url: JACOBS_ORGS,
    tags: ["game development", "competition", "creative", "portfolio", "teamwork"],
  },
  {
    title: "Neurotechnology Journal Club",
    organization: "Triton NeuroTechX",
    org_type: "club",
    category: "research",
    description:
      "Weekly paper discussion on brain-computer interfaces and neural signal processing, with a rotating student lead. Good entry point to neuroengineering research.",
    location: "Powell-Focht Bioengineering Hall",
    starts_at: "2026-10-07T16:00:00-07:00",
    is_recurring: true,
    url: JACOBS_ORGS,
    tags: ["neuroscience", "research", "signal processing", "bioengineering", "journal club"],
  },
  {
    title: "Space Industry Speaker Night",
    organization: "Students for the Exploration and Development of Space (SEDS)",
    org_type: "club",
    category: "speaker",
    description:
      "Engineers from San Diego and LA aerospace companies talk about how they broke in, what they look for in new grads, and where the industry is heading.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-11-10T18:00:00-08:00",
    url: JACOBS_ORGS,
    tags: ["aerospace", "space", "speaker", "careers", "networking"],
  },
  {
    title: "Theta Tau Fall Rush: Professional Engineering Fraternity",
    organization: "Theta Tau",
    org_type: "club",
    category: "info-session",
    description:
      "A week of rush events for the professional engineering fraternity, covering the pledge process, alumni network, and professional development programming.",
    location: "Price Center",
    starts_at: "2026-09-28T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["professional development", "engineering", "community", "alumni network", "leadership"],
  },
  {
    title: "Case Interview Bootcamp",
    organization: "UCSD Consulting Group",
    org_type: "club",
    category: "workshop",
    description:
      "Learn the case interview format used by consulting firms, then run live practice cases in pairs with feedback from members who have interned in the industry.",
    location: "Robinson Building Complex",
    starts_at: "2026-10-15T18:00:00-07:00",
    url: CLUB_HUB,
    tags: ["consulting", "case interview", "business", "career prep", "interview skills"],
  },
  {
    title: "Fall Stock Pitch Competition",
    organization: "Finance and Investment Club",
    org_type: "club",
    category: "competition",
    description:
      "Teams research and pitch an equity position to a panel of judges from finance. Open to all majors; the club runs prep sessions in the weeks beforehand.",
    location: "Rady School of Management",
    starts_at: "2026-11-13T17:00:00-08:00",
    url: CLUB_HUB,
    tags: ["finance", "investing", "competition", "equity research", "business"],
  },
  {
    title: "Law School Admissions and LSAT Panel",
    organization: "UCSD Pre-Law Society",
    org_type: "club",
    category: "speaker",
    description:
      "Admissions representatives and current law students cover timelines, LSAT preparation, personal statements, and what a competitive application looks like.",
    location: "Social Sciences Building",
    starts_at: "2026-10-22T17:30:00-07:00",
    url: CLUB_HUB,
    tags: ["pre-law", "law school", "admissions", "graduate school", "public policy"],
  },
  {
    title: "Mars Rover Build Team Info Session",
    organization: "Yonder Dynamics",
    org_type: "club",
    category: "info-session",
    description:
      "Yonder Dynamics builds an autonomous Martian rover for international competition. Recruiting across mechanical, electrical, software and systems subteams.",
    location: "Engineering Building Unit I",
    starts_at: "2026-10-09T17:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["robotics", "autonomy", "competition", "hands-on", "systems engineering"],
  },
  {
    title: "Global Projects Info Night",
    organization: "Engineers Without Borders (EWB)",
    org_type: "club",
    category: "info-session",
    description:
      "Hear about the chapter's current international water and infrastructure partnerships and how students take on design and travel roles on each project.",
    location: "Warren Lecture Hall",
    starts_at: "2026-10-12T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["social impact", "civil engineering", "global development", "sustainability", "volunteer"],
  },
  {
    title: "LGBTQIA+ in STEM Networking Mixer",
    organization: "Out in Science, Technology, Engineering and Mathematics (oSTEM)",
    org_type: "club",
    category: "networking",
    description:
      "Informal mixer connecting students with LGBTQIA+ professionals working in STEM across San Diego, plus info on the national oSTEM conference.",
    location: "Price Center",
    starts_at: "2026-10-27T18:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["community", "networking", "stem", "inclusion", "professional development"],
  },
  {
    title: "SASE Professional Development Workshop",
    organization: "Society of Asian Scientists and Engineers (SASE)",
    org_type: "club",
    category: "workshop",
    description:
      "Workshop on behavioral interviewing and personal branding, run with corporate partners who recruit from the chapter each year.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-11-04T18:00:00-08:00",
    url: JACOBS_ORGS,
    tags: ["professional development", "interview skills", "networking", "stem", "career prep"],
  },
  {
    title: "Engineering Organization Fair",
    organization: "Triton Engineering Student Council (TESC)",
    org_type: "club",
    category: "networking",
    description:
      "Every engineering student organization in one courtyard. The single fastest way to see what project teams, honor societies and professional chapters exist.",
    location: "Warren Mall",
    starts_at: "2026-09-30T11:00:00-07:00",
    url: JACOBS_ORGS,
    tags: ["org fair", "student organizations", "engineering", "networking", "getting involved"],
  },

  // --------------------------------------------------------- professional
  {
    title: "Fall 2026 Career Fair",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "career-fair",
    description:
      "The largest recruiting event of the quarter, bringing employers hiring for internships, part-time and full-time roles across industry, nonprofits and government agencies.",
    location: "LionTree Arena",
    starts_at: "2026-10-07T12:00:00-07:00",
    url: "https://calendar.ucsd.edu/event/fall-2026-career-fair",
    tags: ["career fair", "internships", "full-time jobs", "recruiting", "employers"],
  },
  {
    title: "Graduate and Professional Schools Fair",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "career-fair",
    description:
      "Representatives from graduate and professional programs discuss admissions requirements, program structure and the application process, with a health and STEM focus.",
    location: "Price Center Ballrooms",
    starts_at: "2026-10-21T11:00:00-07:00",
    url: "https://career.ucsd.edu/employers-recruiters/career-fairs/2025-fall-virtual.html",
    tags: ["graduate school", "phd", "admissions", "advising", "research careers"],
  },
  {
    title: "Resume and LinkedIn Lab",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "workshop",
    description:
      "Drop-in lab where career staff review your resume and LinkedIn profile in a short one-on-one session. No appointment required.",
    location: "Career Center",
    starts_at: "2026-10-01T13:00:00-07:00",
    is_recurring: true,
    url: CAREER,
    tags: ["resume", "linkedin", "career prep", "drop-in", "professional branding"],
  },
  {
    title: "Employer Info Session: Software Engineering Roles",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "info-session",
    description:
      "A visiting engineering team walks through their interview loop, what they look for in intern applications, and takes questions from students.",
    location: "Career Center",
    starts_at: "2026-10-13T17:00:00-07:00",
    url: CAREER,
    tags: ["software engineering", "internships", "recruiting", "interview process", "tech"],
  },
  {
    title: "Technical Interview Preparation Workshop",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "workshop",
    description:
      "How to structure an answer under time pressure, think out loud, and recover from a stuck moment — with live practice problems and peer feedback.",
    location: "Career Center",
    starts_at: "2026-10-19T16:00:00-07:00",
    url: CAREER,
    tags: ["interview skills", "technical interview", "career prep", "algorithms", "practice"],
  },
  {
    title: "Fall Recruiting Kickoff",
    organization: "Rady School Career Management Center",
    org_type: "professional",
    category: "info-session",
    description:
      "Overview of the on-campus recruiting calendar, employer partners and application timelines for business-track students heading into fall recruiting.",
    location: "Rady School of Management",
    starts_at: "2026-09-29T12:00:00-07:00",
    url: "https://career.rady.ucsd.edu/events/",
    tags: ["business", "recruiting", "consulting", "finance", "career timeline"],
  },
  {
    title: "Handshake 101: Finding Roles That Fit",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "workshop",
    description:
      "Short session on using the campus job platform well — saved searches, employer follow-up, and filtering past the roles everyone else is applying to.",
    location: "Virtual",
    starts_at: "2026-09-25T15:00:00-07:00",
    is_recurring: true,
    url: CAREER,
    tags: ["job search", "handshake", "internships", "tools", "career prep"],
  },
  {
    title: "Internship Search Strategy Workshop",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "workshop",
    description:
      "Build a target list, a timeline and an outreach plan for internship season, including how to approach companies that do not post campus roles.",
    location: "Career Center",
    starts_at: "2026-10-26T16:00:00-07:00",
    url: CAREER,
    tags: ["internships", "job search", "strategy", "networking", "career prep"],
  },
  {
    title: "Triton Alumni Networking Night",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "networking",
    description:
      "Alumni across tech, health, finance, policy and the nonprofit sector return to campus for structured small-group conversations with current students.",
    location: "Price Center West Ballroom",
    starts_at: "2026-11-05T18:00:00-08:00",
    url: CAREER,
    tags: ["alumni", "networking", "mentorship", "careers", "professional development"],
  },
  {
    title: "Government and Public Sector Career Panel",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "speaker",
    description:
      "Panelists from federal, state and municipal agencies explain hiring timelines, security clearances, and how public sector work differs from industry.",
    location: "Career Center",
    starts_at: "2026-11-12T16:00:00-08:00",
    url: CAREER,
    tags: ["public policy", "government", "public sector", "careers", "panel"],
  },
  {
    title: "Health Professions Advising Info Session",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "info-session",
    description:
      "Timeline and requirements for medical, dental and other health professional school applications, including clinical hours and gap-year planning.",
    location: "Career Center",
    starts_at: "2026-10-16T15:00:00-07:00",
    url: CAREER,
    tags: ["pre-med", "health professions", "medical school", "advising", "graduate school"],
  },
  {
    title: "Data and Analytics Employer Panel",
    organization: "UC San Diego Career Center",
    org_type: "professional",
    category: "speaker",
    description:
      "Analysts and data scientists from health systems, biotech and tech companies discuss what entry-level data work actually looks like and which skills transfer.",
    location: "Career Center",
    starts_at: "2026-11-17T16:00:00-08:00",
    url: CAREER,
    tags: ["data science", "analytics", "machine learning", "careers", "panel"],
  },

  // ----------------------------------------------------------- university
  {
    title: "Blackstone LaunchPad Incubator: Applications Open",
    organization: "The Basement",
    org_type: "university",
    category: "program",
    description:
      "The incubator for student founders working on a venture or social impact idea. Accepted teams get 24/7 co-working access, prototyping funds and mentorship.",
    location: "The Basement, Mandeville Center",
    starts_at: "2026-10-05T09:00:00-07:00",
    url: BASEMENT,
    tags: ["entrepreneurship", "startup", "incubator", "funding", "social impact"],
  },
  {
    title: "Startup Office Hours",
    organization: "The Basement",
    org_type: "university",
    category: "networking",
    description:
      "Book a slot with an entrepreneur-in-residence to pressure-test an idea, talk through a co-founder question, or figure out the next concrete step.",
    location: "The Basement, Mandeville Center",
    starts_at: "2026-10-02T10:00:00-07:00",
    is_recurring: true,
    url: BASEMENT,
    tags: ["entrepreneurship", "mentorship", "startup", "office hours", "advising"],
  },
  {
    title: "Founder Fridays",
    organization: "The Basement",
    org_type: "university",
    category: "speaker",
    description:
      "A founder talks through how their company actually started, including the parts that went badly. Open to any student, no application or background needed.",
    location: "The Basement, Mandeville Center",
    starts_at: "2026-10-09T15:00:00-07:00",
    is_recurring: true,
    url: BASEMENT,
    tags: ["entrepreneurship", "startup", "speaker", "founders", "inspiration"],
  },
  {
    title: "Intro to Intellectual Property and Commercialization",
    organization: "Office of Innovation and Commercialization",
    org_type: "university",
    category: "workshop",
    description:
      "How university research becomes a product: invention disclosures, patents, licensing and startup formation. Useful for anyone in a lab with a commercial idea.",
    location: "Torrey Pines Center",
    starts_at: "2026-10-20T15:00:00-07:00",
    url: OIC,
    tags: ["commercialization", "intellectual property", "patents", "research", "entrepreneurship"],
  },
  {
    title: "Student Startup Showcase",
    organization: "Moxie Center for Student Entrepreneurship",
    org_type: "university",
    category: "competition",
    description:
      "Student ventures pitch to judges from the San Diego investment and startup community, with funding awarded to the strongest teams.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-11-19T17:00:00-08:00",
    url: OIC,
    tags: ["entrepreneurship", "pitch competition", "startup", "funding", "investors"],
  },
  {
    title: "NSF I-Corps Customer Discovery Workshop",
    organization: "von Liebig Entrepreneurism Center",
    org_type: "university",
    category: "workshop",
    description:
      "The customer discovery method used by NSF I-Corps: how to run interviews that tell you whether anyone actually wants what you are building.",
    location: "Franklin Antonio Hall",
    starts_at: "2026-10-29T16:00:00-07:00",
    url: OIC,
    tags: ["customer discovery", "entrepreneurship", "product", "research", "startup"],
  },
  {
    title: "Entrepreneurship and Innovation Minor Info Session",
    organization: "Rady School of Management",
    org_type: "university",
    category: "info-session",
    description:
      "What the E&I minor covers, how it fits alongside a technical major, and which courses count. Open to undergraduates from any college.",
    location: "Rady School of Management",
    starts_at: "2026-10-14T12:00:00-07:00",
    url: "https://rady.ucsd.edu/programs/undergraduate/minors/entrepreneurship-minor.html",
    tags: ["entrepreneurship", "minor", "business", "academic planning", "innovation"],
  },
  {
    title: "Science Communication Volunteer Program",
    organization: "Birch Aquarium at Scripps",
    org_type: "university",
    category: "volunteer",
    description:
      "Train as a volunteer interpreter explaining ocean science to the public. Strong experience for students considering teaching, outreach or science communication.",
    location: "Birch Aquarium at Scripps",
    starts_at: "2026-10-10T10:00:00-07:00",
    is_recurring: true,
    url: CALENDAR,
    tags: ["science communication", "volunteer", "outreach", "marine science", "education"],
  },
  {
    title: "Data Visualization Workshop Series",
    organization: "UC San Diego Library",
    org_type: "university",
    category: "workshop",
    description:
      "Hands-on sessions on turning a dataset into a figure that communicates, covering chart choice, color and the tools researchers actually use.",
    location: "Geisel Library",
    starts_at: "2026-10-15T14:00:00-07:00",
    is_recurring: true,
    url: CALENDAR,
    tags: ["data visualization", "data science", "research skills", "tools", "communication"],
  },
  {
    title: "Triton Weeks of Welcome Org Fair",
    organization: "Center for Student Involvement",
    org_type: "university",
    category: "networking",
    description:
      "Hundreds of registered student organizations set up across Library Walk. The widest single view of what exists on campus, across every interest area.",
    location: "Library Walk",
    starts_at: "2026-09-24T10:00:00-07:00",
    url: CLUB_HUB,
    tags: ["org fair", "student organizations", "getting involved", "community", "networking"],
  },
  {
    title: "F-1 Students: Pre-Completion OPT Workshop",
    organization: "International Students and Programs Office",
    org_type: "university",
    category: "info-session",
    description:
      "How pre-completion OPT works for F-1 students, including eligibility, timing relative to graduation, and how it interacts with on-campus employment.",
    location: "Virtual",
    starts_at: "2026-10-08T11:00:00-07:00",
    is_recurring: true,
    url: CALENDAR,
    tags: ["international students", "opt", "work authorization", "immigration", "career prep"],
  },

  // ------------------------------------------------------------- research
  {
    title: "Undergraduate Research Scholarships: Applications Open",
    organization: "Undergraduate Research Hub",
    org_type: "research",
    category: "program",
    description:
      "Donor-funded scholarships supporting a summer research project under a UC San Diego faculty mentor, across a range of research areas and disciplines.",
    location: "Undergraduate Research Hub",
    starts_at: "2026-11-02T09:00:00-08:00",
    url: "https://ugresearch.ucsd.edu/programs/all-urh-programs/urs/index.html",
    tags: ["research", "scholarship", "funding", "summer research", "faculty mentor"],
  },
  {
    title: "Faculty Mentor Program Information Session",
    organization: "Faculty Mentor Program",
    org_type: "research",
    category: "info-session",
    description:
      "FMP pairs students with faculty mentors for independent study, culminating in a research proposal and a poster at the spring symposium. Covers how to apply.",
    location: "Undergraduate Research Hub",
    starts_at: "2026-10-06T15:00:00-07:00",
    url: "https://fmp.ucsd.edu/",
    tags: ["research", "faculty mentor", "independent study", "graduate school prep", "poster"],
  },
  {
    title: "Finding a Research Mentor Workshop",
    organization: "Undergraduate Research Hub",
    org_type: "research",
    category: "workshop",
    description:
      "How to identify faculty whose work matches your interests, read a lab page critically, and write an email that actually gets a response.",
    location: "Undergraduate Research Hub",
    starts_at: "2026-09-30T14:00:00-07:00",
    is_recurring: true,
    url: UGRESEARCH,
    tags: ["research", "mentorship", "cold outreach", "labs", "getting started"],
  },
  {
    title: "SPURS Summer Research Program Info Session",
    organization: "Summer Program for Undergraduate Research in Science",
    org_type: "research",
    category: "info-session",
    description:
      "A paid summer research placement in a science lab with structured mentorship. Session covers eligibility, the application, and what a summer looks like.",
    location: "Virtual",
    starts_at: "2026-11-09T15:00:00-08:00",
    url: "https://center.ucsd.edu/mentor-village/summer-program-undergrad-research",
    tags: ["summer research", "paid research", "science", "mentorship", "application"],
  },
  {
    title: "Undergraduate Research Poster Symposium",
    organization: "Undergraduate Research Hub",
    org_type: "research",
    category: "research",
    description:
      "Students present their research to faculty and peers. Worth attending before you have your own project — it shows what undergraduate research actually produces.",
    location: "Price Center Ballrooms",
    starts_at: "2026-11-20T13:00:00-08:00",
    url: UGRESEARCH,
    tags: ["research", "poster session", "presentation", "science communication", "symposium"],
  },
  {
    title: "Undergraduate Research Openings: Ocean Data",
    organization: "Scripps Institution of Oceanography",
    org_type: "research",
    category: "research",
    description:
      "Labs working on ocean observation and climate data are recruiting undergraduates with programming or statistics coursework to help with analysis pipelines.",
    location: "Scripps Institution of Oceanography",
    starts_at: null,
    is_recurring: true,
    url: UGRESEARCH,
    tags: ["research", "climate", "ocean science", "data analysis", "python"],
  },
  {
    title: "Undergraduate Research Assistant Openings",
    organization: "Halıcıoğlu Data Science Institute",
    org_type: "research",
    category: "research",
    description:
      "HDSI faculty take on undergraduate research assistants for projects spanning machine learning methods, health data and computational social science.",
    location: "Halıcıoğlu Data Science Institute",
    starts_at: null,
    is_recurring: true,
    url: UGRESEARCH,
    tags: ["data science", "machine learning", "research", "statistics", "faculty mentor"],
  },
  {
    title: "Research Expo Information Session",
    organization: "Jacobs School of Engineering",
    org_type: "research",
    category: "info-session",
    description:
      "Research Expo showcases graduate engineering research to industry. This session covers how undergraduates can attend, present with a lab, or meet research groups.",
    location: "Jacobs School of Engineering",
    starts_at: "2026-11-16T15:00:00-08:00",
    url: JACOBS_ORGS,
    tags: ["research", "engineering", "industry", "graduate school", "networking"],
  },
];
