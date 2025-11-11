const API_URL = 'http://localhost:4000';

// FINAL OPTIMIZED CALIBRATION
// Strategy: Use must-haves sparingly, rely on weights for ranking

const finalCalibration = {
  'Senior Full Stack Engineer': {
    reasoning: 'NO must-haves - rank by overall capability. Focus on full-stack breadth.',
    competencies: [
      { name: 'JavaScript', weight: 0.25, mustHave: false },   // Core language
      { name: 'React', weight: 0.20, mustHave: false },        // Frontend
      { name: 'Node.js', weight: 0.20, mustHave: false },      // Backend
      { name: 'TypeScript', weight: 0.15, mustHave: false },   // Modern JS
      { name: 'System Design', weight: 0.10, mustHave: false }, // Senior skill (bonus)
      { name: 'AWS', weight: 0.05, mustHave: false },          // Cloud
      { name: 'PostgreSQL', weight: 0.05, mustHave: false }    // Database
    ],
    hardFilters: {
      min_total_exp_years: 5  // Keep experience requirement, remove location filter
    }
  }
};

async function applyFinalCalibration() {
  console.log('🎯 APPLYING FINAL CALIBRATION\n');
  console.log('Strategy: Remove must-have for Senior Full Stack');
  console.log('Result: Get more candidates, rank by weighted fit score\n');

  try {
    const response = await fetch(`${API_URL}/api/jobs`);
    const jobs = await response.json();
    
    const seniorJob = jobs.find(j => j.title === 'Senior Full Stack Engineer');
    
    if (seniorJob) {
      const updateResponse = await fetch(`${API_URL}/api/jobs/${seniorJob.job_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencies: finalCalibration['Senior Full Stack Engineer'].competencies,
          hardFilters: finalCalibration['Senior Full Stack Engineer'].hardFilters
        })
      });

      if (updateResponse.ok) {
        console.log('✅ Updated Senior Full Stack Engineer');
        console.log('   Must-haves: NONE (ranking by weighted score)');
        console.log('   Filters: 5+ years experience only\n');

        // Re-score
        console.log('🔄 Re-scoring...\n');
        const scoreResponse = await fetch(`${API_URL}/api/score/${seniorJob.job_id}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ calibrationVersion: 'v3-relaxed' })
        });

        const result = await scoreResponse.json();
        console.log(`✅ Scored ${result.scored} candidates (was 2)`);
        console.log(`   Excluded: ${result.excluded} (below 5 years experience)\n`);

        if (result.scored > 10) {
          console.log('🎉 SUCCESS! Now you have a good candidate pool to rank!\n');
        } else if (result.scored > 2) {
          console.log('✅ Improvement! More candidates to choose from.\n');
        }
      }
    }

    console.log('📊 FINAL CALIBRATION SUMMARY:\n');
    console.log('Job                        | Must-Haves        | Strategy');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Frontend Engineer          | 2 (React, TS)     | Focus on framework');
    console.log('Backend Engineer           | 1 (Java)          | Language + architecture');
    console.log('DevOps Engineer            | 2 (K8s, Docker)   | Container orchestration');
    console.log('ML Engineer                | 2 (Python, ML)    | Core skills');
    console.log('Senior Full Stack Engineer | 0 (NONE)          | Rank by breadth\n');

    console.log('💡 Calibration Best Practices Applied:');
    console.log('   ✓ 0-2 must-haves per role (not 3+)');
    console.log('   ✓ Junior roles: More must-haves (2)');
    console.log('   ✓ Senior roles: Fewer must-haves (0-1)');
    console.log('   ✓ Use weights for ranking quality');
    console.log('   ✓ Hard filters for non-negotiable requirements\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

applyFinalCalibration();

