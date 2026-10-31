export interface SampleResume {
  id: string;
  title: string;
  candidateName: string;
  role: string;
  experienceLevel: string;
  content: string;
}

export interface SampleJob {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-software-engineer',
    title: 'Senior Software Engineer (Full Stack)',
    candidateName: 'Alex Rivera',
    role: 'Full Stack Engineer',
    experienceLevel: 'Mid-Senior (4 yrs)',
    content: `ALEX RIVERA
San Francisco, CA | (415) 555-0198 | alex.rivera@email.com | github.com/arivera | linkedin.com/in/alexrivera-dev

PROFESSIONAL SUMMARY
Full Stack Software Engineer with 4+ years of experience designing, building, and deploying scalable web applications and microservices. Proficient in TypeScript, React, Node.js, Next.js, PostgreSQL, and AWS. Proven track record of improving web application performance by 35% and mentoring junior developers in Agile environments.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Webpack, Vite
- Backend & APIs: Node.js, Express, NestJS, RESTful APIs, GraphQL, gRPC
- Databases & Cloud: PostgreSQL, MongoDB, Redis, AWS (S3, EC2, Lambda), Docker, CI/CD (GitHub Actions)
- Testing & Tools: Jest, Cypress, Git, Postman, Linux

WORK EXPERIENCE

SENIOR SOFTWARE ENGINEER | CloudScale Technologies, San Francisco, CA
June 2022 – Present
- Architected and deployed a multi-tenant analytics dashboard serving 120,000+ daily active users using React, TypeScript, and Tailwind CSS.
- Optimized database queries and introduced Redis caching layers, reducing API response times by 42% across core endpoints.
- Spearheaded the migration of legacy monolithic services into containerized microservices utilizing Docker and AWS ECS, improving deployment frequency by 3x.
- Mentored a cohort of 4 junior and mid-level software engineers through structured code reviews and bi-weekly architecture sessions.

SOFTWARE ENGINEER | DataPulse Systems, San Jose, CA
August 2020 – May 2022
- Developed responsive client-facing web portals utilizing React, TypeScript, and Redux, achieving a 99.4% crash-free session rate.
- Designed and documented RESTful APIs in Node.js and Express that processed over 5M transactional requests per week.
- Integrated Stripe payment gateway and automated webhook listeners, reducing failed checkout drops by 18%.
- Collaborated closely with UI/UX designers and product managers in 2-week Agile sprints to deliver features on schedule.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley
Graduated: May 2020 | GPA: 3.82 / 4.0

PROJECTS
- DevPulse: Open-source developer productivity tool built with Next.js, Tailwind CSS, and Supabase with 1,200+ GitHub stars.
- AlgoVisualizer: Interactive web application for visualizing graph algorithms and dynamic programming structures using Canvas API and React.

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2023)
- Meta Front-End Developer Professional Certificate (2021)`
  },
  {
    id: 'sample-student-fresher',
    title: 'Computer Science Graduate (Entry Level / Fresher)',
    candidateName: 'Priya Sharma',
    role: 'Junior Software Engineer',
    experienceLevel: 'Student / Fresher (0 yrs)',
    content: `PRIYA SHARMA
Austin, TX | (512) 555-8392 | priya.sharma@collegemail.edu | github.com/priyasharma-cs | linkedin.com/in/priyasharma

CAREER OBJECTIVE
Enthusiastic and results-driven Computer Science graduate seeking an entry-level Software Engineer position to leverage strong foundation in data structures, algorithms, React, and Python to contribute to innovative software solutions.

EDUCATION
Bachelor of Science in Computer Science | University of Texas at Austin
Graduation: May 2024 | GPA: 3.75 / 4.0
Relevant Coursework: Data Structures & Algorithms, Object-Oriented Programming, Database Systems, Web Development, Operating Systems, Machine Learning Foundations.

TECHNICAL SKILLS
- Programming Languages: Python, Java, C++, JavaScript, TypeScript, SQL
- Web Technologies: React.js, HTML5, CSS3, Node.js, Express.js
- Tools & Platforms: Git, GitHub, VS Code, Linux, Docker basics, Postman
- Soft Skills: Problem solving, quick learner, effective communication, team collaboration

ACADEMIC & PERSONAL PROJECTS
Campus Event Hub (Full Stack Web App)
- Developed a full-stack campus event registration web app using React, Node.js, Express, and MongoDB.
- Implemented user authentication with JWT and secure password hashing with bcrypt.
- Added interactive calendar filtering by student club categories and automated email confirmations via Nodemailer.

AI Smart Resume Keyword Matcher
- Created a Python script leveraging Natural Language Processing (NLTK, TF-IDF) to compare resume text with job postings.
- Displayed match percentages and missing keywords using a clean Streamlit interface.

INTERNSHIP EXPERIENCE
Software Engineering Intern | TechNova Labs, Austin, TX
June 2023 – August 2023
- Assisted in building internal testing suites using Jest and React Testing Library, expanding test coverage by 24%.
- Fixed over 35 front-end UI bugs and improved accessibility (WCAG AA compliance) across 10 client dashboards.
- Participated in daily standups and sprint planning sessions with senior engineers.

HONORS & ACTIVITIES
- Dean's Honor Roll (4 consecutive semesters)
- Lead Organizer, HackUTX Hackathon (500+ participants, raised $12,000 in sponsorships)`
  },
  {
    id: 'sample-product-manager',
    title: 'Product Manager (B2B SaaS)',
    candidateName: 'Marcus Vance',
    role: 'Product Manager',
    experienceLevel: 'Mid-Level (3.5 yrs)',
    content: `MARCUS VANCE
New York, NY | (212) 555-4019 | marcus.vance@email.com | linkedin.com/in/marcusvance-pm

PROFESSIONAL SUMMARY
Data-informed Product Manager with 3.5+ years of experience steering B2B SaaS features from discovery through launch. Expert in user research, sprint prioritization, PRD authoring, and analytics (Mixpanel, SQL). Led cross-functional squads to drive a 28% increase in product adoption and 15% reduction in customer churn.

CORE COMPETENCIES
- Product Strategy: Product discovery, PRDs, roadmap planning, user journey mapping, wireframing (Figma).
- Analytics & Metrics: SQL, Mixpanel, Amplitude, Google Analytics, A/B testing, cohort analysis.
- Methodologies: Agile/Scrum, dual-track agile, sprint ceremonies, OKRs, customer interviews.
- Tools: Jira, Confluence, Linear, Notion, Postman, Tableau.

PROFESSIONAL EXPERIENCE
PRODUCT MANAGER | EnterpriseFlow Inc., New York, NY
Jan 2022 – Present
- Spearheaded the zero-to-one launch of an automated compliance reporting module, generating $850K in ARR in its first 3 quarters.
- Defined product requirements and managed a cross-functional team of 8 software engineers and 2 product designers in 2-week sprints.
- Conducted 60+ customer discovery interviews with enterprise compliance officers to identify key friction points in the audit lifecycle.
- Lowered user onboarding time by 34% by redesigning the workspace setup wizard based on quantitative funnel drop-off analysis.

ASSOCIATE PRODUCT MANAGER | FinNext Technologies, New York, NY
July 2020 – Dec 2021
- Owned the self-serve subscription portal, conducting A/B experiments that boosted paid conversion by 14.2%.
- Partnered with customer success and engineering to triage and resolve 200+ customer feature requests per quarter.
- Built internal product dashboards in SQL and Metabase to monitor feature adoption and daily active user engagement.

EDUCATION
Bachelor of Arts in Economics & Minor in Computer Science | Columbia University, New York, NY
Graduated: May 2020

CERTIFICATIONS
- Certified Scrum Product Owner (CSPO)
- Pragmatic Institute Certified (PMC-III)`
  }
];

export const SAMPLE_JOBS: SampleJob[] = [
  {
    id: 'job-senior-frontend',
    title: 'Senior Frontend Engineer',
    company: 'FinTech Velocity',
    category: 'Engineering',
    description: `About the Role:
We are seeking an experienced Senior Frontend Engineer to build modern, high-performance web applications for our financial intelligence platform. You will work with TypeScript, React, Next.js, and modern CSS to craft seamless user experiences for thousands of global financial analysts.

Responsibilities:
- Build and maintain responsive, accessible, and performant web interfaces using React, TypeScript, and modern state management.
- Architect scalable client-side infrastructure and optimize Core Web Vitals and render times.
- Collaborate closely with product managers, UX designers, and backend engineers.
- Write clean, maintainable code with high test coverage using Jest, Vitest, and Cypress.
- Mentor junior engineers and champion frontend best practices.

Requirements:
- 4+ years of professional software engineering experience specializing in frontend web development.
- Deep expertise in TypeScript, JavaScript (ES6+), React, and modern CSS (Tailwind CSS or styled-components).
- Proven experience with state management (Redux Toolkit, Zustand, or TanStack Query) and Next.js / SSR.
- Strong knowledge of web performance optimization, RESTful APIs, and GraphQL.
- Hands-on experience with automated testing (Jest, React Testing Library, Cypress).
- Experience with Git, CI/CD pipelines (GitHub Actions), and cloud deployment (AWS or Vercel).
- Excellent communication skills and passion for collaborating in an Agile squad.`
  },
  {
    id: 'job-fullstack-ai',
    title: 'Full Stack AI Solutions Engineer',
    company: 'HyperScale AI',
    category: 'Engineering & AI',
    description: `Join HyperScale AI as a Full Stack Engineer building next-generation generative AI workflows and enterprise dashboards.

Key Responsibilities:
- Design, implement, and deploy end-to-end full stack web applications integrating LLMs (Google Gemini, OpenAI, Claude).
- Develop robust backend APIs using Node.js / Express / Python and frontend clients in React / Next.js.
- Optimize prompt engineering, structured JSON outputs, streaming responses, and vector database retrieval.
- Build clean data pipelines and manage PostgreSQL, Redis, and cloud infrastructure on AWS/GCP.
- Implement authentication, RBAC, and telemetry.

Qualifications:
- Bachelor's degree in Computer Science or equivalent practical experience.
- 3+ years of full stack software engineering experience with React, TypeScript, and Node.js or Python.
- Demonstrated hands-on experience integrating LLM APIs and modern AI tools.
- Proficiency with relational databases (PostgreSQL), Docker, and cloud architectures.
- Experience writing clean automated tests and documentation.`
  },
  {
    id: 'job-product-manager',
    title: 'Product Manager - Core Platform',
    company: 'CloudFlow Technologies',
    category: 'Product',
    description: `CloudFlow is looking for a Product Manager to lead our Core Platform and Integrations squad.

What You'll Do:
- Own the product lifecycle for platform infrastructure, user permissions, and developer APIs.
- Conduct continuous user research, customer interviews, and quantitative funnel analysis using Mixpanel/SQL.
- Translate business goals into comprehensive PRDs, wireframes, and sprint user stories.
- Run Agile sprint planning, daily standups, and retrospective ceremonies with engineering and design teams.
- Define and track north-star product metrics and OKRs.

What We Need:
- 3+ years of product management experience in B2B SaaS or technical developer tools.
- Strong technical fluency; comfortable discussing APIs, system architecture, and SQL queries with engineers.
- Data-driven mindset with proven track record using Amplitude, Mixpanel, or SQL for user analytics.
- Superior written and verbal communication skills.`
  }
];
