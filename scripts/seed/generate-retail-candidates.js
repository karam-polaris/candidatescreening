const API_URL = 'http://localhost:4000';

// Latin American first names and surnames
const firstNames = [
  'Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa', 'Juan', 'Patricia',
  'Pedro', 'Laura', 'Jorge', 'Isabel', 'Fernando', 'Sofía', 'Ricardo', 'Elena', 'Alberto', 'Lucía',
  'Roberto', 'Gabriela', 'Francisco', 'Daniela', 'Andrés', 'Valentina', 'Javier', 'Carolina', 'Diego', 'Camila',
  'Alejandro', 'Natalia', 'Manuel', 'Andrea', 'Sergio', 'Paula', 'Rafael', 'Mariana', 'Raúl', 'Julia',
  'Héctor', 'Sandra', 'Eduardo', 'Adriana', 'Óscar', 'Claudia', 'Arturo', 'Beatriz', 'Emilio', 'Cristina',
  'Marco', 'Silvia', 'Pablo', 'Victoria', 'Guillermo', 'Mónica', 'Víctor', 'Teresa', 'Daniel', 'Gloria',
  'Antonio', 'Diana', 'Felipe', 'Liliana', 'Ramón', 'Angela', 'Enrique', 'Martha', 'Rodrigo', 'Cecilia',
  'Leonardo', 'Paola', 'Iván', 'Verónica', 'Alfredo', 'Alejandra', 'Samuel', 'Lorena', 'Tomás', 'Fernanda',
  'Sebastián', 'Marcela', 'Nicolás', 'Jimena', 'Mateo', 'Rocío', 'Santiago', 'Nora', 'Ignacio', 'Pilar',
  'César', 'Marina', 'Joaquín', 'Esther', 'Gonzalo', 'Yolanda', 'Mauricio', 'Susana', 'Esteban', 'Iris'
];

const surnames = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Mendoza',
  'Silva', 'Castro', 'Vargas', 'Romero', 'Ruiz', 'Alvarez', 'Jiménez', 'Moreno', 'Muñoz', 'Rojas',
  'Medina', 'Aguilar', 'Delgado', 'Castillo', 'Vega', 'León', 'Herrera', 'Salazar', 'Guerrero', 'Mendez',
  'Ramos', 'Rios', 'Fernández', 'Mejía', 'Navarro', 'Cordero', 'Valdez', 'Campos', 'Cortez', 'Santos',
  'Paredes', 'Ponce', 'Benitez', 'Soto', 'Cabrera', 'Mora', 'Espinoza', 'Contreras', 'Sandoval', 'Paz',
  'Carrillo', 'Dominguez', 'Acosta', 'Guzmán', 'Fuentes', 'Maldonado', 'Peña', 'Valencia', 'Ochoa', 'Luna',
  'Cárdenas', 'Ibarra', 'Núñez', 'Molina', 'Cervantes', 'Pacheco', 'Avila', 'Velasco', 'Arias', 'Lara',
  'Figueroa', 'Zamora', 'Gallegos', 'Bravo', 'Suárez', 'Chávez', 'Escobar', 'Bustamante', 'Montoya', 'Miranda',
  'Parra', 'Vásquez', 'Alvarado', 'Peralta', 'Estrada', 'Quintero', 'Franco', 'Zavala', 'Cardona', 'Quispe'
];

// Colombian and Peruvian cities
const locations = [
  'Bogotá, Colombia', 'Medellín, Colombia', 'Cali, Colombia', 'Barranquilla, Colombia', 'Cartagena, Colombia',
  'Bucaramanga, Colombia', 'Pereira, Colombia', 'Cúcuta, Colombia', 'Ibagué, Colombia', 'Manizales, Colombia',
  'Neiva, Colombia', 'Armenia, Colombia', 'Villavicencio, Colombia', 'Pasto, Colombia', 'Popayán, Colombia',
  'Lima, Peru', 'Arequipa, Peru', 'Trujillo, Peru', 'Cusco, Peru', 'Callao, Peru',
  'Ica, Peru', 'Huánuco, Peru', 'Cajamarca, Peru', 'Loreto, Peru', 'Junín, Peru'
];

// Retail-specific skills
const retailSkills = [
  'Customer Service', 'Cash Register Operations', 'POS Systems', 'Merchandising', 'Inventory Management',
  'Stock Replenishment', 'Visual Display', 'Sales Floor Management', 'Cash Handling', 'Product Knowledge',
  'Store Cleanliness', 'Loss Prevention', 'Customer Relations', 'Team Collaboration', 'Time Management',
  'Problem Solving', 'Communication', 'Attention to Detail', 'Multitasking', 'Spanish',
  'SAP', 'EWM', 'Warehouse Management', 'Loading/Unloading', 'Order Picking', 'Quality Control',
  'Documentation', 'Barcode Scanning', 'Forklift Operation', 'Inventory Audits',
  'Microsoft Excel', 'Microsoft Office', 'Data Entry', 'Reporting', 'Computer Literacy',
  'Team Leadership', 'Staff Training', 'Scheduling', 'P&L Management', 'Operational Excellence',
  'Conflict Resolution', 'Decision Making', 'Strategic Planning', 'Performance Management', 'Compliance',
  'English', 'French', 'Portuguese', 'Bilingual Communication', 'Cross-cultural Communication'
];

// Education levels
const educations = [
  { degree: 'High School Diploma', field: 'General Studies', institution: 'Colegio Nacional' },
  { degree: 'Technical Certificate', field: 'Retail Management', institution: 'SENA' },
  { degree: 'Technical Certificate', field: 'Logistics', institution: 'Instituto Técnico' },
  { degree: 'Bachelor', field: 'Business Administration', institution: 'Universidad Nacional' },
  { degree: 'Bachelor', field: 'Industrial Engineering', institution: 'Universidad de los Andes' },
  { degree: 'Associate', field: 'Marketing', institution: 'Universidad Distrital' },
  { degree: 'Technical Certificate', field: 'Customer Service', institution: 'Centro de Formación' },
  { degree: 'High School Diploma', field: 'Commerce', institution: 'Colegio Comercial' }
];

// Job titles for retail
const jobTitles = [
  'Store Assistant', 'Cashier', 'Sales Associate', 'Stock Clerk', 'Warehouse Assistant',
  'Logistics Assistant', 'Inventory Clerk', 'Customer Service Rep', 'Retail Associate', 'Store Clerk',
  'Assistant Manager', 'Shift Supervisor', 'Team Leader', 'Department Supervisor', 'Floor Manager',
  'Store Manager', 'Operations Manager', 'Branch Manager', 'Retail Manager', 'District Manager'
];

// Seniority levels based on experience
const getSeniority = (years) => {
  if (years < 2) return 'Entry';
  if (years < 5) return 'Mid';
  if (years < 8) return 'Senior';
  return 'Lead';
};

// Generate random candidate
function generateCandidate(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName1 = surnames[Math.floor(Math.random() * surnames.length)];
  const lastName2 = surnames[Math.floor(Math.random() * surnames.length)];
  const fullName = `${firstName} ${lastName1} ${lastName2}`;
  
  const experienceYears = Math.floor(Math.random() * 12); // 0-12 years
  const seniority = getSeniority(experienceYears);
  
  // Select 5-12 skills (more skills for experienced candidates)
  const numSkills = Math.min(5 + Math.floor(experienceYears / 2), 15);
  const candidateSkills = [];
  const usedSkills = new Set();
  
  while (candidateSkills.length < numSkills) {
    const skill = retailSkills[Math.floor(Math.random() * retailSkills.length)];
    if (!usedSkills.has(skill)) {
      usedSkills.add(skill);
      candidateSkills.push({
        name: skill,
        yearsOfExperience: Math.min(Math.floor(Math.random() * (experienceYears + 1)), experienceYears)
      });
    }
  }
  
  // Always add Spanish
  if (!usedSkills.has('Spanish')) {
    candidateSkills.push({ name: 'Spanish', yearsOfExperience: experienceYears });
  }
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  const education = educations[Math.floor(Math.random() * educations.length)];
  const currentTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  
  const emailName = `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${Math.floor(Math.random() * 999)}`;
  
  return {
    full_name: fullName,
    emails: [`${emailName}@email.com`],
    phones: [`+57${Math.floor(Math.random() * 900000000 + 100000000)}`],
    location,
    work_auth: location.includes('Colombia') ? 'Colombia' : 'Peru',
    current_title: currentTitle,
    total_experience_years: experienceYears,
    skills: candidateSkills,
    seniority,
    education: [education],
    experience_summary: `Experienced ${currentTitle.toLowerCase()} with ${experienceYears} years in retail operations. Strong background in customer service, inventory management, and team collaboration.`,
    sources: [{ system: 'Manual', id: `gen-${index}` }]
  };
}

async function importCandidates() {
  console.log('\n🏪 DOLLAR CITY - RETAIL CANDIDATE GENERATOR\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Generating 500 retail candidates...\n');
  
  const BATCH_SIZE = 25;
  let totalImported = 0;
  
  for (let batch = 0; batch < 20; batch++) {
    const batchCandidates = [];
    
    for (let i = 0; i < BATCH_SIZE; i++) {
      const candidate = generateCandidate(batch * BATCH_SIZE + i);
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
        totalImported += result.count || BATCH_SIZE;
        console.log(`  ✓ Batch ${batch + 1}/20: ${totalImported} candidates imported`);
      } else {
        console.log(`  ✗ Batch ${batch + 1}/20 failed: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`  ✗ Batch ${batch + 1}/20 error:`, error.message);
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Import complete! Total candidates: ${totalImported}\n`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 CANDIDATE PROFILE DISTRIBUTION:\n');
  console.log('   • Entry Level (0-2 years): ~170 candidates');
  console.log('   • Mid Level (2-5 years): ~160 candidates');
  console.log('   • Senior (5-8 years): ~110 candidates');
  console.log('   • Lead (8+ years): ~60 candidates\n');
  console.log('🌎 GEOGRAPHIC DISTRIBUTION:\n');
  console.log('   • Colombia: ~400 candidates');
  console.log('   • Peru: ~100 candidates\n');
  console.log('💼 SKILLS COVERAGE:\n');
  console.log('   • Customer Service & Sales');
  console.log('   • Inventory & Warehouse');
  console.log('   • POS & Cash Handling');
  console.log('   • Team Leadership');
  console.log('   • SAP/EWM Systems\n');
}

importCandidates();

