const API_URL = 'http://localhost:4000';

// Latin American names
const firstNames = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa', 'Juan', 'Patricia',
  'Pedro', 'Laura', 'Jorge', 'Isabel', 'Fernando', 'Sofía', 'Ricardo', 'Elena', 'Alberto', 'Lucía',
  'Roberto', 'Gabriela', 'Francisco', 'Daniela', 'Andrés', 'Valentina', 'Javier', 'Carolina', 'Diego', 'Camila',
  'Alejandro', 'Natalia', 'Manuel', 'Andrea', 'Sergio', 'Paula', 'Rafael', 'Mariana', 'Raúl', 'Julia',
  'Héctor', 'Sandra', 'Eduardo', 'Adriana', 'Óscar', 'Claudia', 'Arturo', 'Beatriz', 'Emilio', 'Cristina'
];

const surnames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Mendoza',
  'Silva', 'Castro', 'Vargas', 'Romero', 'Ruiz', 'Alvarez', 'Jiménez', 'Moreno', 'Muñoz', 'Rojas'
];

const colombianCities = [
  'Bogotá, Colombia', 'Medellín, Colombia', 'Cali, Colombia', 'Barranquilla, Colombia', 
  'Cartagena, Colombia', 'Bucaramanga, Colombia', 'Pereira, Colombia', 'Cúcuta, Colombia',
  'Ibagué, Colombia', 'Manizales, Colombia', 'Neiva, Colombia', 'Armenia, Colombia'
];

const peruvianCities = [
  'Lima, Peru', 'Arequipa, Peru', 'Trujillo, Peru', 'Cusco, Peru', 
  'Callao, Peru', 'Ica, Peru', 'Huánuco, Peru', 'Cajamarca, Peru'
];

// Role-specific skill profiles (matching job competencies EXACTLY)
const roleProfiles = {
  'Store Assistant': {
    title: 'Store Assistant',
    requiredSkills: ['Customer Service', 'Cash Register Operations'],
    optionalSkills: ['Merchandising', 'Inventory Management', 'Stock Replenishment', 'Store Cleanliness'],
    minExperience: 0,
    maxExperience: 4,
    education: ['High School Diploma', 'Technical Certificate in Retail Management']
  },
  
  'Logistics Assistant': {
    title: 'Warehouse Assistant',
    requiredSkills: ['Warehouse Operations', 'Inventory Control'],
    optionalSkills: ['SAP/EWM', 'Loading/Unloading', 'Quality Standards', 'Documentation'],
    minExperience: 0,
    maxExperience: 4,
    education: ['High School Diploma', 'Technical Certificate in Logistics']
  },
  
  'Store Supervisor': {
    title: 'Shift Supervisor',
    requiredSkills: ['Team Leadership', 'Operational Management', 'Customer Service'],
    optionalSkills: ['Customer Experience', 'Inventory Control', 'Staff Scheduling', 'Problem Resolution'],
    minExperience: 2,
    maxExperience: 6,
    education: ['Technical Certificate in Retail Management', 'Bachelor in Business Administration']
  },
  
  'Store Manager': {
    title: 'Store Manager',
    requiredSkills: ['Store Leadership', 'P&L Management'],
    optionalSkills: ['Sales Strategy', 'Team Development', 'Operational Excellence', 'Customer Satisfaction', 'Compliance'],
    minExperience: 3,
    maxExperience: 10,
    education: ['Bachelor in Business Administration', 'Bachelor in Industrial Engineering']
  },
  
  'Coordinator': {
    title: 'Operations Coordinator',
    requiredSkills: ['Team Coordination', 'Process Management'],
    optionalSkills: ['Data Analysis', 'Reporting', 'Problem Solving', 'Communication'],
    minExperience: 2,
    maxExperience: 7,
    education: ['Technical Certificate in Logistics', 'Bachelor in Business Administration']
  },
  
  'Analyst': {
    title: 'Inventory Analyst',
    requiredSkills: ['Data Analysis', 'Microsoft Excel'],
    optionalSkills: ['Reporting', 'Process Improvement', 'Communication', 'Attention to Detail'],
    minExperience: 1,
    maxExperience: 5,
    education: ['Bachelor in Business Administration', 'Bachelor in Industrial Engineering']
  }
};

function getSeniority(years) {
  if (years < 2) return 'junior';
  if (years < 5) return 'mid';
  if (years < 8) return 'senior';
  return 'lead';
}

function selectLocation(roleType) {
  // 80% Colombia, 20% Peru
  const isColombia = Math.random() < 0.8;
  const cities = isColombia ? colombianCities : peruvianCities;
  return cities[Math.floor(Math.random() * cities.length)];
}

function generateCandidateForRole(roleType, index) {
  const profile = roleProfiles[roleType];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName1 = surnames[Math.floor(Math.random() * surnames.length)];
  const lastName2 = surnames[Math.floor(Math.random() * surnames.length)];
  const fullName = `${firstName} ${lastName1} ${lastName2}`;
  
  // Experience based on role requirements
  const experienceYears = profile.minExperience + 
    Math.floor(Math.random() * (profile.maxExperience - profile.minExperience + 1));
  
  const location = selectLocation(roleType);
  
  // Build skill array - ALWAYS include required skills
  const skills = [];
  
  // Add ALL required skills with strong experience
  profile.requiredSkills.forEach(skillName => {
    skills.push({
      name: skillName,
      years: Math.max(1, Math.floor(experienceYears * 0.7)), // 70% of total experience
      level: experienceYears >= 4 ? 'advanced' : experienceYears >= 2 ? 'intermediate' : 'basic',
      last_used: new Date().getFullYear()
    });
  });
  
  // Add some optional skills (50-80% of them)
  const numOptionalSkills = Math.floor(profile.optionalSkills.length * (0.5 + Math.random() * 0.3));
  const shuffledOptional = [...profile.optionalSkills].sort(() => Math.random() - 0.5);
  
  shuffledOptional.slice(0, numOptionalSkills).forEach(skillName => {
    const skillYears = Math.floor(Math.random() * experienceYears);
    skills.push({
      name: skillName,
      years: skillYears,
      level: skillYears >= 3 ? 'advanced' : skillYears >= 1 ? 'intermediate' : 'basic',
      last_used: new Date().getFullYear() - Math.floor(Math.random() * 3)
    });
  });
  
  // Always add Spanish
  skills.push({ 
    name: 'Spanish', 
    years: experienceYears,
    level: 'advanced',
    last_used: new Date().getFullYear()
  });
  
  // Education
  const educationOption = profile.education[Math.floor(Math.random() * profile.education.length)];
  const education = [{
    degree: educationOption,
    school: educationOption.includes('Bachelor') ? 'Universidad Nacional' : 'SENA',
    year: new Date().getFullYear() - experienceYears - Math.floor(Math.random() * 3)
  }];
  
  const emailName = `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${Math.floor(Math.random() * 999)}`;
  
  const seniority = getSeniority(experienceYears);
  
  // Create realistic experience summary
  const experienceSummary = `${seniority} ${profile.title} with ${experienceYears} years of experience in retail operations. ` +
    `Strong background in ${profile.requiredSkills.join(', ').toLowerCase()}. ` +
    `Proven track record in ${shuffledOptional.slice(0, 2).join(' and ').toLowerCase()}.`;
  
  return {
    full_name: fullName,
    emails: [`${emailName}@email.com`],
    phones: [`+57${Math.floor(Math.random() * 900000000 + 100000000)}`],
    location,
    work_auth: location.includes('Colombia') ? 'Colombia' : 'Peru',
    current_title: profile.title,
    total_experience_years: experienceYears,
    skills,
    seniority,
    education,
    experience_summary: experienceSummary,
    sources: [{ system: 'candidates', id: `realistic-${index}` }]
  };
}

async function clearExistingCandidates() {
  console.log('🗑️  Clearing existing candidates...');
  try {
    // This would need an API endpoint to clear candidates
    // For now, we'll just note it
    console.log('   ⚠️  Note: Existing candidates will remain, new ones will be added\n');
  } catch (error) {
    console.log('   ℹ️  Continuing with import\n');
  }
}

async function importRealisticCandidates() {
  console.log('\n🏪 DOLLAR CITY - REALISTIC CANDIDATE GENERATOR\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await clearExistingCandidates();
  
  // Distribution matching job types
  const distribution = [
    { role: 'Store Assistant', count: 200 },      // Most common role
    { role: 'Logistics Assistant', count: 100 },  // Distribution center staff
    { role: 'Store Supervisor', count: 80 },      // Mid-level
    { role: 'Coordinator', count: 50 },           // Support functions
    { role: 'Analyst', count: 40 },               // Specialist roles
    { role: 'Store Manager', count: 30 }          // Senior leadership
  ];
  
  console.log('📊 GENERATING 500 ROLE-MATCHED CANDIDATES:\n');
  distribution.forEach(d => {
    console.log(`   • ${d.count} ${d.role}s`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const BATCH_SIZE = 25;
  let totalImported = 0;
  let currentIndex = 0;
  
  for (const { role, count } of distribution) {
    console.log(`\n📦 Importing ${role}s...`);
    
    const batches = Math.ceil(count / BATCH_SIZE);
    
    for (let batch = 0; batch < batches; batch++) {
      const batchSize = Math.min(BATCH_SIZE, count - (batch * BATCH_SIZE));
      const batchCandidates = [];
      
      for (let i = 0; i < batchSize; i++) {
        const candidate = generateCandidateForRole(role, currentIndex++);
        batchCandidates.push(candidate);
      }
      
      try {
        const response = await fetch(`${API_URL}/api/ingest/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            content: JSON.stringify(batchCandidates),
            format: 'json'
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          totalImported += result.count || batchSize;
          console.log(`   ✓ Batch ${batch + 1}/${batches}: ${totalImported} total imported`);
        } else {
          console.log(`   ✗ Batch ${batch + 1}/${batches} failed`);
        }
      } catch (error) {
        console.log(`   ✗ Error: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`✅ Import complete! Total: ${totalImported} candidates\n`);
  console.log('💡 KEY FEATURES OF REALISTIC DATA:\n');
  console.log('   ✓ Skills match job competencies exactly');
  console.log('   ✓ Required skills always present');
  console.log('   ✓ Experience levels match role requirements');
  console.log('   ✓ Realistic skill proficiency (years)');
  console.log('   ✓ Appropriate education for each role\n');
  console.log('🎯 NEXT STEP: Re-score jobs to see realistic fit scores!\n');
  console.log('   Run: node score-selected-jobs.js\n');
}

importRealisticCandidates();

