const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000';

async function quickImport() {
  const content = fs.readFileSync(path.join(__dirname, 'generated/candidates.jsonl'), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  
  console.log(`\n👥 Quick importing first 50 candidates...`);
  
  let imported = 0;
  for (let i = 0; i < Math.min(50, lines.length); i++) {
    try {
      const response = await fetch(`${API_URL}/api/ingest/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: lines[i], format: 'jsonl' })
      });
      
      const result = await response.json();
      if (result.count > 0) {
        imported++;
        if (imported % 10 === 0) console.log(`  ✓ Imported ${imported}...`);
      }
    } catch (error) {
      console.log(`  ✗ Error at ${i}:`, error.message);
    }
  }
  
  console.log(`\n✅ Imported ${imported} candidates total!`);
}

quickImport();

