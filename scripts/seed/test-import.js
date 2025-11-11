const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:4000';

async function testCandidate() {
  const content = fs.readFileSync(path.join(__dirname, 'generated/candidates.jsonl'), 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const firstCandidate = JSON.parse(lines[0]);
  
  console.log('Testing with first candidate:', firstCandidate.full_name);
  console.log('Candidate data keys:', Object.keys(firstCandidate));
  
  try {
    const response = await fetch(`${API_URL}/api/ingest/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: lines[0],
        format: 'jsonl'
      })
    });
    
    const result = await response.json();
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.errors && result.errors.length > 0) {
      console.log('\n❌ Errors:', result.errors);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testCandidate();

