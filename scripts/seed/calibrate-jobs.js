const API_URL = 'http://localhost:4000';

// Optimized calibrations for each job type
const calibrations = {
  'Frontend Engineer': {
    reasoning: 'Focus on core framework skills, reduce redundancy (JavaScript vs TypeScript)',
    competencies: [
      { name: 'React', weight: 0.30, mustHave: true },      // Core framework - highest weight
      { name: 'TypeScript', weight: 0.25, mustHave: true }, // Modern standard
      { name: 'JavaScript', weight: 0.15, mustHave: false }, // Implied by TypeScript
      { name: 'CSS', weight: 0.15, mustHave: false },       // Important but learnable
      { name: 'Testing', weight: 0.10, mustHave: false },   // Quality signal
      { name: 'GraphQL', weight: 0.05, mustHave: false }    // Nice bonus
    ],
    hardFilters: {
      min_total_exp_years: 2
    }
  },

  'Backend Engineer': {
    reasoning: 'Emphasize architecture skills, make Spring Boot optional since Java experience implies it',
    competencies: [
      { name: 'Java', weight: 0.25, mustHave: true },           // Core language
      { name: 'Microservices', weight: 0.20, mustHave: false }, // Architecture - very important
      { name: 'Spring Boot', weight: 0.15, mustHave: false },   // Framework - can learn
      { name: 'PostgreSQL', weight: 0.15, mustHave: false },    // Database
      { name: 'REST APIs', weight: 0.15, mustHave: false },     // Essential but common
      { name: 'Docker', weight: 0.05, mustHave: false },        // DevOps skill
      { name: 'Kubernetes', weight: 0.05, mustHave: false }     // DevOps skill
    ],
    hardFilters: {
      min_total_exp_years: 3
    }
  },

  'DevOps Engineer': {
    reasoning: 'Reduce must-haves from 4 to 2, focus on container orchestration',
    competencies: [
      { name: 'Kubernetes', weight: 0.25, mustHave: true },  // Most complex - must have
      { name: 'Docker', weight: 0.20, mustHave: true },      // Foundation - must have
      { name: 'AWS', weight: 0.20, mustHave: false },        // Cloud - important but can learn
      { name: 'CI/CD', weight: 0.15, mustHave: false },      // Process knowledge
      { name: 'Terraform', weight: 0.10, mustHave: false },  // IaC - valuable
      { name: 'Linux', weight: 0.05, mustHave: false },      // Assumed knowledge
      { name: 'Python', weight: 0.05, mustHave: false }      // Scripting - bonus
    ],
    hardFilters: {
      work_auth: ['US Citizen', 'Green Card', 'H1B'],  // Relax from just Citizen/Green Card
      min_total_exp_years: 3  // Reduce from 4 to 3
    }
  },

  'Machine Learning Engineer': {
    reasoning: 'Differentiate frameworks, make one must-have',
    competencies: [
      { name: 'Python', weight: 0.30, mustHave: true },         // Core language
      { name: 'Machine Learning', weight: 0.25, mustHave: true }, // Domain knowledge
      { name: 'PyTorch', weight: 0.15, mustHave: false },       // Prefer PyTorch (more common now)
      { name: 'TensorFlow', weight: 0.10, mustHave: false },    // Alternative framework
      { name: 'SQL', weight: 0.10, mustHave: false },           // Data access
      { name: 'AWS', weight: 0.10, mustHave: false }            // Deployment
    ],
    hardFilters: {
      work_auth: ['US Citizen', 'Green Card', 'H1B'],
      min_total_exp_years: 3
    }
  },

  'Senior Full Stack Engineer': {
    reasoning: 'Make it less restrictive - only 1 must-have, focus on senior skills',
    competencies: [
      { name: 'System Design', weight: 0.25, mustHave: true }, // Senior-level skill
      { name: 'JavaScript', weight: 0.20, mustHave: false },   // Core but flexible
      { name: 'Node.js', weight: 0.15, mustHave: false },      // Backend
      { name: 'React', weight: 0.15, mustHave: false },        // Frontend
      { name: 'TypeScript', weight: 0.10, mustHave: false },   // Modern JS
      { name: 'AWS', weight: 0.10, mustHave: false },          // Cloud
      { name: 'PostgreSQL', weight: 0.05, mustHave: false }    // Database
    ],
    hardFilters: {
      locations: ['San Francisco', 'Remote', 'Bay Area'],
      work_auth: ['US Citizen', 'Green Card', 'H1B'],
      min_total_exp_years: 5
    }
  }
};

async function updateJobCalibration(jobId, title, calibration) {
  try {
    const response = await fetch(`${API_URL}/api/jobs/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        competencies: calibration.competencies,
        hardFilters: calibration.hardFilters
      })
    });

    if (response.ok) {
      console.log(`\n✅ ${title}`);
      console.log(`   Reasoning: ${calibration.reasoning}`);
      console.log(`   Must-haves: ${calibration.competencies.filter(c => c.mustHave).map(c => c.name).join(', ')}`);
      return true;
    } else {
      console.log(`\n❌ Failed to update ${title}`);
      return false;
    }
  } catch (error) {
    console.log(`\n❌ Error updating ${title}:`, error.message);
    return false;
  }
}

async function calibrateAllJobs() {
  console.log('🎯 APPLYING OPTIMIZED CALIBRATIONS\n');
  console.log('📊 Calibration Philosophy:');
  console.log('   • 1-2 must-haves per role (not 3-4)');
  console.log('   • Higher weights for senior/complex skills');
  console.log('   • Balanced filters to get quality candidates\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Get all jobs
    const response = await fetch(`${API_URL}/api/jobs`);
    const jobs = await response.json();

    let updated = 0;
    for (const job of jobs) {
      if (calibrations[job.title]) {
        const success = await updateJobCalibration(
          job.job_id,
          job.title,
          calibrations[job.title]
        );
        if (success) updated++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n✅ Updated ${updated} jobs with optimized calibrations`);
    console.log('\n🔄 Now re-scoring candidates with new calibrations...\n');

    // Re-score all jobs with new calibrations
    for (const job of jobs) {
      if (calibrations[job.title]) {
        console.log(`   Scoring: ${job.title}...`);
        try {
          const scoreResponse = await fetch(`${API_URL}/api/score/${job.job_id}/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calibrationVersion: 'v2-optimized' })
          });
          const result = await scoreResponse.json();
          console.log(`   ✓ ${result.scored} candidates scored`);
        } catch (error) {
          console.log(`   ✗ Scoring failed`);
        }
      }
    }

    console.log('\n✅ CALIBRATION COMPLETE!');
    console.log('\n📊 Expected Improvements:');
    console.log('   • Senior Full Stack: Should see 10-20 candidates (was 2)');
    console.log('   • DevOps: Should see 20-30 candidates (was 13)');
    console.log('   • Better quality matches overall');
    console.log('\n🌐 Refresh your browser to see the changes!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

calibrateAllJobs();

