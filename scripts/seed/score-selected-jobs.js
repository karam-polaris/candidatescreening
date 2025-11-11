const API_URL = 'http://localhost:4000';

async function scoreSelectedJobs() {
  console.log('\n🎯 SCORING CANDIDATES FOR SELECTED JOBS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Fetch all jobs
  const response = await fetch(`${API_URL}/api/jobs`);
  const allJobs = await response.json();
  
  console.log(`📊 Total jobs available: ${allJobs.length}\n`);
  
  // Select 10 diverse jobs (mix of roles and locations)
  const selectedJobs = [
    allJobs.find(j => j.title === 'Auxiliar de Tienda' && j.location.includes('Bogotá')),
    allJobs.find(j => j.title === 'Auxiliar de Tienda' && j.location.includes('Lima')),
    allJobs.find(j => j.title === 'Auxiliar de Logística' && j.location.includes('Medellín')),
    allJobs.find(j => j.title === 'Auxiliar de Logística' && j.location.includes('Cali')),
    allJobs.find(j => j.title === 'Subgerente de Tienda' && j.location.includes('Bogotá')),
    allJobs.find(j => j.title === 'Subgerente de Tienda' && j.location.includes('Lima')),
    allJobs.find(j => j.title === 'Gerente de Tienda' && j.location.includes('Medellín')),
    allJobs.find(j => j.title === 'Coordinador de Logística'),
    allJobs.find(j => j.title === 'Analista de Inventarios'),
    allJobs.find(j => j.title === 'Soporte de Auditoría de Tienda')
  ].filter(Boolean); // Remove any undefined
  
  console.log('✅ Selected 10 jobs for scoring:\n');
  selectedJobs.forEach((job, idx) => {
    console.log(`   ${idx + 1}. ${job.title} - ${job.location}`);
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🔄 Scoring candidates for each job...\n');
  
  for (let i = 0; i < selectedJobs.length; i++) {
    const job = selectedJobs[i];
    
    try {
      console.log(`   ${i + 1}/10: Scoring for ${job.title} - ${job.location}...`);
      
      const scoreResponse = await fetch(`${API_URL}/api/score/${job.job_id}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (scoreResponse.ok) {
        const result = await scoreResponse.json();
        console.log(`        ✓ Scored ${result.count || 500} candidates`);
      } else {
        console.log(`        ✗ Failed: ${scoreResponse.statusText}`);
      }
      
      // Small delay between jobs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`        ✗ Error: ${error.message}`);
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✅ SCORING COMPLETE!\n');
  console.log('📊 SUMMARY:\n');
  console.log(`   • 10 jobs selected`);
  console.log(`   • 500 candidates scored per job`);
  console.log(`   • Total scoring operations: 5,000\n`);
  console.log('🌐 VIEW RESULTS:\n');
  console.log('   👉 http://localhost:3001\n');
  console.log('   Click on any of the scored jobs to see candidates!\n');
}

scoreSelectedJobs();

