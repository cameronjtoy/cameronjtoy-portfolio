// Single source of truth for all resume text on the site.
// Sections and 3D scenes read from here; nothing else should hard-code copy.

export interface Link {
  label: string
  href: string
}

export interface Experience {
  id: string
  company: string
  role: string
  team: string
  location: string
  start: string
  end: string
  highlights: string[]
}

export interface Project {
  id: string
  name: string
  stack: string[]
  highlights: string[]
  /** The highlights reframed as a short product brief, shown on the site. */
  brief: { label: string; text: string }[]
}

export interface Education {
  school: string
  degree: string
  location: string
  graduated: string
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Resume {
  name: string
  title: string
  location: string
  summary: string
  links: Link[]
  /** Where this site's code lives. */
  source: Link
  experience: Experience[]
  projects: Project[]
  education: Education[]
  skills: SkillGroup[]
}

export const resume: Resume = {
  name: 'Cameron Toy',
  title: 'Software Engineer',
  location: 'Albertson, New York',
  summary:
    'Software engineer building backend systems, data pipelines, and full-stack products. Interested in distributed systems and in shipping things people use.',
  links: [
    { label: 'Email', href: 'mailto:cameron.j.toy@gmail.com' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cameron-j-toy/' },
    { label: 'GitHub', href: 'https://github.com/cameronjtoy' },
  ],
  source: {
    label: 'Source on GitHub',
    href: 'https://github.com/cameronjtoy/cameronjtoy-portfolio',
  },
  experience: [
    {
      id: 'bnsf',
      company: 'BNSF Railway',
      role: 'Software Engineer',
      team: 'Service Management',
      location: 'Remote',
      start: 'May 2025',
      end: 'Present',
      highlights: [
        'Developed a demand forecasting algorithm incorporating workforce productivity metrics, improving time to hire and saving over $1M.',
        'Architected a reusable CRUD framework in Java and Angular adopted across ~150 applications, saving an estimated 1 year of development work.',
        'Improved attrition record accuracy to 98% over the legacy system by delivering full-stack classification features across ETL batch logic, REST APIs, and Angular UI with drill-down modals and PDF/Excel export.',
        'Designed backend algorithms in Java Spring Boot to aggregate and compute demand metrics across 100+ stations, powering executive reports with station-level granularity for on-time performance analysis.',
        'Built durable EDI 404 waybill testing infrastructure with Postgres-persisted scheduled injection across IBM MQ and Kafka pipelines, ensuring tests survive restarts and automatically surface integration regressions.',
      ],
    },
    {
      id: 'stony-brook',
      company: 'Stony Brook Administrative Services, LLC',
      role: 'Software Engineer',
      team: 'Legacy EMR',
      location: 'Commack, New York',
      start: 'Aug. 2024',
      end: 'May 2025',
      highlights: [
        'Engineered an EMR dashboard in React, Node.js, Express, and MS SQL Server to surface migrated records with role-based access and audit logging.',
        'Delivered REST APIs in Node.js/Express to retrieve and transform legacy EMR records into the internal platform.',
        'Streamlined operations by deploying a React/Node dashboard, Python invoicing service, and data-quality pipeline reducing duplicate records.',
      ],
    },
    {
      id: 'develop-for-good',
      company: 'Develop for Good',
      role: 'Software Engineer Intern',
      team: 'Linens N Love',
      location: 'Remote',
      start: 'May 2024',
      end: 'Aug. 2024',
      highlights: [
        'Deployed MVP application on AWS EC2 instances, leveraging AWS S3 for image storage, ensuring high availability and scalability of service.',
        'Built a password-less authentication flow with Gmail API and Node.js/Express, securely verifying over 500 users.',
      ],
    },
    {
      id: 'university-at-buffalo',
      company: 'University at Buffalo',
      role: 'Research Assistant',
      team: 'Vizier Data Workbook',
      location: 'Buffalo, New York',
      start: 'Aug. 2023',
      end: 'May 2024',
      highlights: [
        'Optimized user workflow in data filtration and selection by building a data profiler with Apache Spark and Scala, achieving a 20% reduction in processing time.',
        'Improved data visualization by adding and fixing ETL modules using Scala and Vega, achieving a 25% reduction in rendering time.',
      ],
    },
  ],
  projects: [
    {
      id: 'prem',
      name: 'Prem',
      stack: ['Electron', 'TypeScript', 'Node.js', 'CodeMirror', 'Docker'],
      highlights: [
        'Built an open-source (Apache-2.0) desktop lab notebook for research labs, storing records as plain markdown with full version history and a tamper-evident hash-chain audit trail; piloting with research labs.',
        'Developed a self-hostable lab server (single Node file, Docker image) with per-person tokens, per-folder permissions, live updates, and edit-conflict protection, backed by unit and end-to-end tests.',
      ],
      brief: [
        {
          label: 'For',
          text: 'Research labs that want a lab notebook they can host themselves.',
        },
        {
          label: 'What',
          text: 'An open-source (Apache-2.0) desktop lab notebook. Records are plain markdown with full version history and a tamper-evident hash-chain audit trail.',
        },
        {
          label: 'How',
          text: 'A self-hostable lab server, shipped as a single Node file and a Docker image, with per-person tokens, per-folder permissions, live updates and edit-conflict protection. Backed by unit and end-to-end tests.',
        },
        { label: 'Status', text: 'Piloting with research labs.' },
      ],
    },
    {
      id: 'vct-manager',
      name: 'VCT Manager',
      stack: ['AWS Bedrock', 'AWS RDS', 'AWS EC2', 'Python', 'Streamlit'],
      highlights: [
        'Placed 3rd at the AWS × VCT Hackathon for building an LLM-powered Valorant team-builder and Q&A assistant.',
        'Implemented data cleaning and ETL pipelines in Python, loading processed data into AWS RDS.',
      ],
      brief: [
        {
          label: 'For',
          text: 'Building a Valorant team and asking questions about it.',
        },
        {
          label: 'What',
          text: 'An LLM-powered team-builder and Q&A assistant, built on AWS Bedrock with a Streamlit interface.',
        },
        {
          label: 'How',
          text: 'Data cleaning and ETL pipelines in Python load processed data into AWS RDS.',
        },
        { label: 'Outcome', text: '3rd place at the AWS × VCT Hackathon.' },
      ],
    },
  ],
  education: [
    {
      school: 'University at Buffalo, The State University of New York',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Buffalo, New York',
      graduated: 'May 2024',
    },
  ],
  skills: [
    {
      label: 'Languages',
      items: ['Scala', 'Go', 'Java', 'Python', 'TypeScript', 'C/C++', 'SQL'],
    },
    {
      label: 'Frameworks',
      items: [
        'Spring Boot',
        'React',
        'Angular',
        'FastAPI',
        'ReactiveX (RxScala)',
        'Apache Spark',
        'Apache MapReduce',
        'CUDA',
      ],
    },
    {
      label: 'Data & Infrastructure',
      items: ['PostgreSQL', 'MySQL', 'AWS', 'GCP', 'OpenShift', 'Jenkins'],
    },
  ],
}
