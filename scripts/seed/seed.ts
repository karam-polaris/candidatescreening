import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as Papa from 'papaparse';
import type {
  Job,
  Candidate,
  Application,
  Assessment,
  Skill,
  SkillLevel,
  Seniority,
  AssessmentType
} from '@candidate-screening/domain';

const OUTPUT_DIR = path.join(__dirname, 'generated');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Sample data pools
const FIRST_NAMES = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Margaret', 'Anthony', 'Betty', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
];

const CITIES = [
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Boston, MA',
  'Chicago, IL', 'Los Angeles, CA', 'Denver, CO', 'Atlanta, GA', 'Portland, OR',
  'Remote', 'Miami, FL', 'Washington, DC', 'San Diego, CA', 'Phoenix, AZ'
];

const WORK_AUTHS = ['US Citizen', 'Green Card', 'H1B', 'OPT', 'No Authorization'];

const TECH_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 'Spring Boot',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'PostgreSQL', 'MongoDB',
  'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'CI/CD', 'Git',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms',
  'System Design', 'SQL', 'NoSQL', 'Linux', 'Agile', 'Scrum'
];

const JOB_TITLES = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'DevOps Engineer', 'Data Engineer', 'Machine Learning Engineer',
  'Engineering Manager', 'Technical Lead', 'Principal Engineer'
];

const DEGREES = [
  'B.S. Computer Science', 'M.S. Computer Science', 'B.S. Software Engineering',
  'M.S. Data Science', 'B.S. Electrical Engineering', 'Ph.D. Computer Science',
  'B.A. Mathematics', 'M.S. Artificial Intelligence'
];

const UNIVERSITIES = [
  'Stanford University', 'MIT', 'UC Berkeley', 'Carnegie Mellon University',
  'University of Washington', 'Georgia Tech', 'UT Austin', 'University of Michigan',
  'Cornell University', 'Columbia University', 'Harvard University', 'Princeton University'
];

// Helper functions
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomSubset<T>(arr: T[], minCount: number, maxCount: number): T[] {
  const count = randomInt(minCount, Math.min(maxCount, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateEmail(firstName: string, lastName: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomItem(domains)}`;
}

function generatePhone(): string {
  return `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`;
}

// Generate jobs
function generateJobs(): Job[] {
  return [
    {
      job_id: uuidv4(),
      title: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      competencies: [
        { name: 'JavaScript', weight: 0.2, mustHave: true },
        { name: 'React', weight: 0.15, mustHave: true },
        { name: 'Node.js', weight: 0.15, mustHave: true },
        { name: 'TypeScript', weight: 0.15, mustHave: false },
        { name: 'PostgreSQL', weight: 0.1, mustHave: false },
        { name: 'AWS', weight: 0.15, mustHave: false },
        { name: 'System Design', weight: 0.1, mustHave: false }
      ],
      hardFilters: {
        min_total_exp_years: 5,
        work_auth: ['US Citizen', 'Green Card', 'H1B'],
        locations: ['San Francisco', 'Remote', 'Bay Area']
      }
    },
    {
      job_id: uuidv4(),
      title: 'Machine Learning Engineer',
      location: 'Seattle, WA',
      competencies: [
        { name: 'Python', weight: 0.25, mustHave: true },
        { name: 'Machine Learning', weight: 0.25, mustHave: true },
        { name: 'TensorFlow', weight: 0.15, mustHave: false },
        { name: 'PyTorch', weight: 0.15, mustHave: false },
        { name: 'AWS', weight: 0.1, mustHave: false },
        { name: 'SQL', weight: 0.1, mustHave: false }
      ],
      hardFilters: {
        min_total_exp_years: 3,
        work_auth: ['US Citizen', 'Green Card', 'H1B']
      }
    },
    {
      job_id: uuidv4(),
      title: 'Backend Engineer',
      location: 'Remote',
      competencies: [
        { name: 'Java', weight: 0.2, mustHave: true },
        { name: 'Spring Boot', weight: 0.15, mustHave: true },
        { name: 'PostgreSQL', weight: 0.15, mustHave: true },
        { name: 'Microservices', weight: 0.15, mustHave: false },
        { name: 'Docker', weight: 0.1, mustHave: false },
        { name: 'Kubernetes', weight: 0.1, mustHave: false },
        { name: 'REST APIs', weight: 0.15, mustHave: false }
      ],
      hardFilters: {
        min_total_exp_years: 3
      }
    },
    {
      job_id: uuidv4(),
      title: 'DevOps Engineer',
      location: 'Austin, TX',
      competencies: [
        { name: 'Docker', weight: 0.2, mustHave: true },
        { name: 'Kubernetes', weight: 0.2, mustHave: true },
        { name: 'AWS', weight: 0.15, mustHave: true },
        { name: 'CI/CD', weight: 0.15, mustHave: true },
        { name: 'Linux', weight: 0.1, mustHave: false },
        { name: 'Python', weight: 0.1, mustHave: false },
        { name: 'Terraform', weight: 0.1, mustHave: false }
      ],
      hardFilters: {
        min_total_exp_years: 4,
        work_auth: ['US Citizen', 'Green Card']
      }
    },
    {
      job_id: uuidv4(),
      title: 'Frontend Engineer',
      location: 'New York, NY',
      competencies: [
        { name: 'React', weight: 0.25, mustHave: true },
        { name: 'TypeScript', weight: 0.2, mustHave: true },
        { name: 'JavaScript', weight: 0.2, mustHave: true },
        { name: 'CSS', weight: 0.15, mustHave: false },
        { name: 'GraphQL', weight: 0.1, mustHave: false },
        { name: 'Testing', weight: 0.1, mustHave: false }
      ],
      hardFilters: {
        min_total_exp_years: 2
      }
    }
  ];
}

// Generate a single candidate
function generateCandidate(): Candidate {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const seniority = randomItem(['junior', 'mid', 'senior', 'lead'] as Seniority[]);

  let minExp = 0;
  let maxExp = 15;

  if (seniority === 'junior') {
    minExp = 0;
    maxExp = 3;
  } else if (seniority === 'mid') {
    minExp = 3;
    maxExp = 7;
  } else if (seniority === 'senior') {
    minExp = 7;
    maxExp = 12;
  } else if (seniority === 'lead') {
    minExp = 10;
    maxExp = 20;
  }

  const totalExp = randomFloat(minExp, maxExp);
  const currentYear = new Date().getFullYear();

  // Generate skills
  const numSkills = randomInt(5, 15);
  const selectedSkills = randomSubset(TECH_SKILLS, numSkills, numSkills);

  const skills: Skill[] = selectedSkills.map((skillName) => {
    const level = randomItem(['basic', 'intermediate', 'advanced'] as SkillLevel[]);
    const years = randomFloat(0.5, Math.min(totalExp, 10));
    const lastUsed = currentYear - randomInt(0, 3);

    return {
      name: skillName,
      level,
      years: parseFloat(years.toFixed(1)),
      last_used: lastUsed
    };
  });

  // Generate education
  const education = randomInt(0, 10) > 2 ? [
    {
      degree: randomItem(DEGREES),
      school: randomItem(UNIVERSITIES),
      year: currentYear - randomInt(5, 20)
    }
  ] : [];

  return {
    candidate_id: uuidv4(),
    full_name: `${firstName} ${lastName}`,
    emails: [generateEmail(firstName, lastName)],
    phones: [generatePhone()],
    location: randomItem(CITIES),
    work_auth: randomItem(WORK_AUTHS),
    current_title: randomItem(JOB_TITLES),
    total_experience_years: parseFloat(totalExp.toFixed(1)),
    skills,
    seniority,
    education,
    experience_summary: `Experienced ${seniority} engineer with ${totalExp.toFixed(0)} years in software development.`,
    sources: [{ system: 'candidates', id: uuidv4() }]
  };
}

// Generate candidates
function generateCandidates(count: number): Candidate[] {
  const candidates: Candidate[] = [];
  for (let i = 0; i < count; i++) {
    candidates.push(generateCandidate());
  }
  return candidates;
}

// Generate applications
function generateApplications(jobs: Job[], candidates: Candidate[]): Application[] {
  const applications: Application[] = [];

  // Each candidate applies to 1-3 jobs
  for (const candidate of candidates) {
    const numApplications = randomInt(1, 3);
    const selectedJobs = randomSubset(jobs, numApplications, numApplications);

    for (const job of selectedJobs) {
      applications.push({
        application_id: uuidv4(),
        job_id: job.job_id,
        candidate_id: candidate.candidate_id,
        source: randomItem(['LinkedIn', 'Indeed', 'Company Website', 'Referral']),
        submitted_at: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000).toISOString(),
        stage: randomItem(['applied', 'screening', 'interview', 'offer', 'rejected']),
        recruiter_notes: ''
      });
    }
  }

  return applications;
}

// Generate assessments
function generateAssessments(candidates: Candidate[]): Assessment[] {
  const assessments: Assessment[] = [];

  // 70% of candidates have assessments
  for (const candidate of candidates) {
    if (Math.random() < 0.7) {
      const numAssessments = randomInt(1, 3);

      for (let i = 0; i < numAssessments; i++) {
        const assessmentType = randomItem(['coding', 'cognitive', 'language', 'domain'] as AssessmentType[]);
        const baseScore = randomInt(50, 95);

        // Generate subscores based on candidate skills
        const subscores = [];

        if (assessmentType === 'coding') {
          subscores.push(
            { name: 'Algorithm Design', score: baseScore + randomInt(-10, 10) },
            { name: 'Code Quality', score: baseScore + randomInt(-10, 10) },
            { name: 'Problem Solving', score: baseScore + randomInt(-10, 10) }
          );
        } else if (assessmentType === 'cognitive') {
          subscores.push(
            { name: 'Logical Reasoning', score: baseScore + randomInt(-10, 10) },
            { name: 'Pattern Recognition', score: baseScore + randomInt(-10, 10) }
          );
        }

        // Map to competencies based on candidate skills
        const competencyMap = candidate.skills.slice(0, 3).map((skill) => ({
          competency: skill.name,
          weight: randomFloat(0.3, 1.0)
        }));

        assessments.push({
          assessment_id: uuidv4(),
          candidate_id: candidate.candidate_id,
          type: assessmentType,
          provider: randomItem(['HackerRank', 'Codility', 'TestGorilla', 'Criteria Corp']),
          score: Math.min(100, Math.max(0, baseScore)),
          subscores: subscores.length > 0 ? subscores : undefined,
          completed_at: new Date(Date.now() - randomInt(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
          competency_map: competencyMap.length > 0 ? competencyMap : undefined
        });
      }
    }
  }

  return assessments;
}

// Main seed function
async function seed() {
  console.log('🌱 Generating seed data...\n');

  // Generate data
  console.log('Generating 5 jobs...');
  const jobs = generateJobs();

  console.log('Generating 1000 candidates...');
  const candidates = generateCandidates(1000);

  console.log('Generating applications...');
  const applications = generateApplications(jobs, candidates);

  console.log('Generating assessments...');
  const assessments = generateAssessments(candidates);

  console.log('\n📊 Summary:');
  console.log(`  Jobs: ${jobs.length}`);
  console.log(`  Candidates: ${candidates.length}`);
  console.log(`  Applications: ${applications.length}`);
  console.log(`  Assessments: ${assessments.length}\n`);

  // Write files
  console.log('Writing files...');

  // Jobs (JSON)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'jobs.json'),
    JSON.stringify(jobs, null, 2)
  );

  // Candidates (JSONL)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'candidates.jsonl'),
    candidates.map((c) => JSON.stringify(c)).join('\n')
  );

  // Applications (CSV)
  const applicationsCsv = Papa.unparse(
    applications.map((a) => ({
      application_id: a.application_id,
      job_id: a.job_id,
      candidate_id: a.candidate_id,
      source: a.source,
      submitted_at: a.submitted_at,
      stage: a.stage,
      recruiter_notes: a.recruiter_notes
    }))
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, 'applications.csv'), applicationsCsv);

  // Assessments (CSV)
  const assessmentsCsv = Papa.unparse(
    assessments.map((a) => ({
      assessment_id: a.assessment_id,
      candidate_id: a.candidate_id,
      type: a.type,
      provider: a.provider,
      score: a.score,
      subscores: a.subscores ? JSON.stringify(a.subscores) : '',
      completed_at: a.completed_at,
      competency_map: a.competency_map ? JSON.stringify(a.competency_map) : ''
    }))
  );
  fs.writeFileSync(path.join(OUTPUT_DIR, 'assessments.csv'), assessmentsCsv);

  console.log('\n✅ Seed data generated successfully!');
  console.log(`\nFiles created in: ${OUTPUT_DIR}`);
  console.log('  - jobs.json');
  console.log('  - candidates.jsonl');
  console.log('  - applications.csv');
  console.log('  - assessments.csv');

  console.log('\n📥 To load this data into the database:');
  console.log('  1. Start the API server: pnpm dev');
  console.log('  2. Run the import script or use the API endpoints');

  // Now send the data to the API if it's running
  const API_URL = process.env.API_URL || 'http://localhost:4000';

  try {
    console.log(`\n🚀 Attempting to load data into API at ${API_URL}...`);

    // Load jobs
    for (const job of jobs) {
      await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
    }
    console.log('  ✓ Jobs loaded');

    // Load candidates
    const candidatesJsonl = candidates.map((c) => JSON.stringify(c)).join('\n');
    await fetch(`${API_URL}/api/ingest/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: candidatesJsonl, format: 'jsonl' })
    });
    console.log('  ✓ Candidates loaded');

    // Load applications
    await fetch(`${API_URL}/api/ingest/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: applicationsCsv })
    });
    console.log('  ✓ Applications loaded');

    // Load assessments
    await fetch(`${API_URL}/api/ingest/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: assessmentsCsv, format: 'csv' })
    });
    console.log('  ✓ Assessments loaded');

    console.log('\n🎉 All data loaded successfully into the database!');
    console.log('\nNext steps:');
    console.log('  1. Visit http://localhost:3000 to view the dashboard');
    console.log('  2. Click on a job to score candidates');
    console.log('  3. Explore the screening, comparison, and calibration features');

  } catch (error) {
    console.log('\n⚠️  Could not connect to API. Make sure the API server is running.');
    console.log('   You can manually import the generated files later.');
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Error during seed:', error);
  process.exit(1);
});
