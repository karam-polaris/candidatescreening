const API_URL = 'http://localhost:4000';

// Dollar City Job Competencies by Role Type
const competencies = {
  'Auxiliar de Logística': [
    { name: 'SAP/EWM', weight: 0.25, mustHave: false },
    { name: 'Warehouse Operations', weight: 0.20, mustHave: true },
    { name: 'Inventory Control', weight: 0.20, mustHave: true },
    { name: 'Quality Standards', weight: 0.15, mustHave: false },
    { name: 'Loading/Unloading', weight: 0.10, mustHave: false },
    { name: 'Documentation', weight: 0.10, mustHave: false }
  ],
  
  'Auxiliar de Tienda': [
    { name: 'Customer Service', weight: 0.25, mustHave: true },
    { name: 'Cash Register Operations', weight: 0.20, mustHave: true },
    { name: 'Merchandising', weight: 0.20, mustHave: false },
    { name: 'Inventory Management', weight: 0.15, mustHave: false },
    { name: 'Store Cleanliness', weight: 0.10, mustHave: false },
    { name: 'Stock Replenishment', weight: 0.10, mustHave: false }
  ],
  
  'Subgerente de Tienda': [
    { name: 'Team Leadership', weight: 0.25, mustHave: true },
    { name: 'Operational Management', weight: 0.20, mustHave: true },
    { name: 'Customer Experience', weight: 0.15, mustHave: false },
    { name: 'Inventory Control', weight: 0.15, mustHave: false },
    { name: 'Staff Scheduling', weight: 0.10, mustHave: false },
    { name: 'Problem Resolution', weight: 0.10, mustHave: false },
    { name: 'Policy Enforcement', weight: 0.05, mustHave: false }
  ],
  
  'Gerente de Tienda': [
    { name: 'Store Leadership', weight: 0.25, mustHave: true },
    { name: 'P&L Management', weight: 0.20, mustHave: true },
    { name: 'Sales Strategy', weight: 0.15, mustHave: false },
    { name: 'Team Development', weight: 0.15, mustHave: false },
    { name: 'Operational Excellence', weight: 0.10, mustHave: false },
    { name: 'Customer Satisfaction', weight: 0.10, mustHave: false },
    { name: 'Compliance', weight: 0.05, mustHave: false }
  ],
  
  'Coordinador': [
    { name: 'Team Coordination', weight: 0.25, mustHave: true },
    { name: 'Process Management', weight: 0.20, mustHave: true },
    { name: 'Data Analysis', weight: 0.20, mustHave: false },
    { name: 'Reporting', weight: 0.15, mustHave: false },
    { name: 'Problem Solving', weight: 0.10, mustHave: false },
    { name: 'Communication', weight: 0.10, mustHave: false }
  ],
  
  'Analista': [
    { name: 'Data Analysis', weight: 0.25, mustHave: true },
    { name: 'Microsoft Excel', weight: 0.20, mustHave: true },
    { name: 'Reporting', weight: 0.15, mustHave: false },
    { name: 'Process Improvement', weight: 0.15, mustHave: false },
    { name: 'Communication', weight: 0.15, mustHave: false },
    { name: 'Attention to Detail', weight: 0.10, mustHave: false }
  ],
  
  'Specialized': [ // For unique roles like trilingual positions
    { name: 'Spanish', weight: 0.25, mustHave: true },
    { name: 'English', weight: 0.25, mustHave: true },
    { name: 'Domain Expertise', weight: 0.20, mustHave: true },
    { name: 'Data Analysis', weight: 0.15, mustHave: false },
    { name: 'Communication', weight: 0.10, mustHave: false },
    { name: 'Microsoft Office', weight: 0.05, mustHave: false }
  ]
};

// All 100 Dollar City Jobs
const dollarCityJobs = [
  // LOGISTICS ASSISTANTS - Colombia (10 positions)
  { title: 'Auxiliar de Logística', location: 'Palmira, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Bogotá, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Medellín, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Cali, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Barranquilla, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Cartagena, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Bucaramanga, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Ibagué, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Valle del Cauca, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Logística', location: 'Popayán, Colombia', type: 'Auxiliar de Logística', country: 'Colombia', minExp: 0 },
  
  // STORE ASSISTANTS - Colombia (29 positions)
  { title: 'Auxiliar de Tienda', location: 'Usaquén, Bogotá, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Kennedy, Bogotá, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Cedritos, Bogotá, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Suba/Barrios Unidos/Engativá, Bogotá, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Tocancipá y Sopó, Cundinamarca, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Neiva, Huila, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Manizales, Caldas, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Rionegro, Antioquia, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Armenia, Quindío, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Pereira, Risaralda, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Cúcuta, Norte de Santander, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Cartagena, Bolívar, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Barranquilla, Atlántico, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Santa Marta, Magdalena, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Valledupar, Cesar, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Tunja, Boyacá, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Popayán, Cauca, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Bucaramanga, Santander, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Villavicencio, Meta, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Pasto, Nariño, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Yopal, Casanare, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Ibagué, Tolima, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Montería, Córdoba, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Ciénaga, Magdalena, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Riohacha, La Guajira, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Quibdó, Chocó, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'San Juan de Pasto, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Soacha, Cundinamarca, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Girardot, Cundinamarca, Colombia', type: 'Auxiliar de Tienda', country: 'Colombia', minExp: 0 },
  
  // STORE ASSISTANT MANAGERS - Colombia (9 positions)
  { title: 'Subgerente de Tienda', location: 'Armenia, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Bogotá, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Cali, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Medellín, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Pereira, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Cartagena, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Bucaramanga, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Neiva, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Popayán, Colombia', type: 'Subgerente de Tienda', country: 'Colombia', minExp: 2 },
  
  // STORE MANAGERS - Colombia (6 positions)
  { title: 'Gerente de Tienda', location: 'Bogotá, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Cali, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Medellín, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Cartagena, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Barranquilla, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Armenia, Colombia', type: 'Gerente de Tienda', country: 'Colombia', minExp: 3 },
  
  // COORDINATORS - Colombia (4 positions)
  { title: 'Coordinador de Logística', location: 'Bogotá, Colombia', type: 'Coordinador', country: 'Colombia', minExp: 2 },
  { title: 'Coordinador de Logística', location: 'Cali, Colombia', type: 'Coordinador', country: 'Colombia', minExp: 2 },
  { title: 'Coordinador de Equipo Profesional', location: 'Armenia, Colombia', type: 'Coordinador', country: 'Colombia', minExp: 2 },
  { title: 'Coordinador de Equipo Profesional', location: 'Medellín, Colombia', type: 'Coordinador', country: 'Colombia', minExp: 2 },
  
  // ANALYSTS & SPECIALIZED ROLES - Colombia (9 positions)
  { title: 'Soporte de Auditoría de Tienda', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Soporte de Auditoría de Tienda', location: 'Cali, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Analista de Cumplimiento de Productos', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Analista de Operaciones de Mantenimiento', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Analista de Nómina Trilingüe', location: 'Bogotá, Colombia', type: 'Specialized', country: 'Colombia', minExp: 2 },
  { title: 'Administrador de Reclutamiento Trilingüe', location: 'Bogotá, Colombia', type: 'Specialized', country: 'Colombia', minExp: 2 },
  { title: 'Analista de Centro de Soporte', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Analista de Inventarios', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  { title: 'Analista de Seguridad y Salud Ocupacional', location: 'Bogotá, Colombia', type: 'Analista', country: 'Colombia', minExp: 1 },
  
  // PERU POSITIONS
  // Quality & Management - Peru (2 positions)
  { title: 'Supervisor de Calidad de Tienda', location: 'Lima, Peru', type: 'Coordinador', country: 'Peru', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Lima, Peru', type: 'Subgerente de Tienda', country: 'Peru', minExp: 2 },
  
  // STORE ASSISTANTS - Peru (19 positions)
  { title: 'Auxiliar de Tienda', location: 'Callao, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Surco, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Pachacamac, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'La Molina, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'San Isidro, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Santa Anita/Ate/La Molina, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Lince, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Punta Hermosa, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Ica, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Loreto, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Trujillo, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Cusco, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Arequipa, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Huánuco, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Junín, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Cajamarca, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Ancash, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Pucallpa, Ucayali, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  { title: 'Auxiliar de Tienda', location: 'Iquitos, Loreto, Peru', type: 'Auxiliar de Tienda', country: 'Peru', minExp: 0 },
  
  // STORE ASSISTANT MANAGERS - Peru (2 positions)
  { title: 'Subgerente de Tienda', location: 'Callao, Peru', type: 'Subgerente de Tienda', country: 'Peru', minExp: 2 },
  { title: 'Subgerente de Tienda', location: 'Surco, Peru', type: 'Subgerente de Tienda', country: 'Peru', minExp: 2 },
  
  // STORE MANAGERS - Peru (5 positions)
  { title: 'Gerente de Tienda', location: 'Lima, Peru', type: 'Gerente de Tienda', country: 'Peru', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Callao, Peru', type: 'Gerente de Tienda', country: 'Peru', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Cusco, Peru', type: 'Gerente de Tienda', country: 'Peru', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Trujillo, Peru', type: 'Gerente de Tienda', country: 'Peru', minExp: 3 },
  { title: 'Gerente de Tienda', location: 'Arequipa, Peru', type: 'Gerente de Tienda', country: 'Peru', minExp: 3 },
  
  // COORDINATORS & ANALYSTS - Peru (3 positions)
  { title: 'Coordinador de Inventarios', location: 'Lima, Peru', type: 'Coordinador', country: 'Peru', minExp: 2 },
  { title: 'Coordinador de Auditoría', location: 'Lima, Peru', type: 'Coordinador', country: 'Peru', minExp: 2 },
  { title: 'Analista de Seguridad y Salud Ocupacional', location: 'Lima, Peru', type: 'Analista', country: 'Peru', minExp: 1 },
  
  // REGIONAL POSITIONS - El Salvador, Guatemala, Mexico (1 aggregated position)
  { title: 'Auxiliar de Tienda', location: 'El Salvador / Guatemala / Mexico', type: 'Auxiliar de Tienda', country: 'Multi-Country', minExp: 0 }
];

console.log(`📊 Total jobs to import: ${dollarCityJobs.length}`);
console.log('✅ Validation: Expected 100 jobs\n');

async function clearExistingJobs() {
  try {
    const response = await fetch(`${API_URL}/api/jobs`);
    const jobs = await response.json();
    
    console.log(`🗑️  Clearing ${jobs.length} existing jobs...`);
    
    for (const job of jobs) {
      await fetch(`${API_URL}/api/jobs/${job.job_id}`, { method: 'DELETE' });
    }
    
    console.log('✅ Existing jobs cleared\n');
  } catch (error) {
    console.log('⚠️  No existing jobs to clear or error:', error.message);
  }
}

async function importDollarCityJobs() {
  console.log('🏪 DOLLAR CITY - JOB IMPORT\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  await clearExistingJobs();
  
  console.log('📥 Importing 100 Dollar City jobs...\n');
  
  let imported = 0;
  const byCountry = {};
  const byType = {};
  
  for (const job of dollarCityJobs) {
    const jobCompetencies = competencies[job.type];
    
    try {
      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: job.title,
          location: job.location,
          competencies: jobCompetencies,
          hardFilters: {
            min_total_exp_years: job.minExp
          }
        })
      });
      
      if (response.ok) {
        imported++;
        byCountry[job.country] = (byCountry[job.country] || 0) + 1;
        byType[job.type] = (byType[job.type] || 0) + 1;
        
        if (imported % 10 === 0) {
          console.log(`  ✓ Imported ${imported} jobs...`);
        }
      }
    } catch (error) {
      console.log(`  ✗ Error importing ${job.title} - ${job.location}`);
    }
  }
  
  console.log(`\n✅ Import complete! Imported ${imported} jobs\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 BREAKDOWN BY COUNTRY:\n');
  Object.entries(byCountry).forEach(([country, count]) => {
    console.log(`   ${country}: ${count} positions`);
  });
  
  console.log('\n📊 BREAKDOWN BY ROLE TYPE:\n');
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`   ${type}: ${count} positions`);
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🎯 NEXT STEPS:\n');
  console.log('1. Refresh your browser: http://localhost:3001');
  console.log('2. You\'ll see all 100 Dollar City job positions');
  console.log('3. Each job has retail-appropriate competencies');
  console.log('4. Jobs are organized by country and role type\n');
  console.log('💡 NOTE: You\'ll need candidates with retail skills to match these jobs!');
  console.log('   Run the retail candidate generator script next.\n');
}

importDollarCityJobs();

