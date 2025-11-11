# 🎯 Calibration Guide - Candidate Screening App

## 📊 Final Optimized Calibrations

### Overview
Calibration determines **who gets through** and **how they rank**. The key is balancing selectivity with candidate pool size.

---

## 🎚️ Calibration Components

### 1. **Competency Weights**
- Sum must equal 1.0
- Higher weight = more impact on overall score
- Reflects relative importance to role success

### 2. **Must-Have Skills**
- **Binary filter**: Has skill = pass, doesn't have = exclude
- Use sparingly! Each must-have drastically reduces candidate pool
- **Best practice**: 0-2 must-haves per role

### 3. **Hard Filters**
- Non-negotiable requirements
- Common filters:
  - `min_total_exp_years` - Minimum experience
  - `work_auth` - Work authorization status
  - `locations` - Acceptable work locations

---

## 📋 Applied Calibrations

### 1️⃣ **Frontend Engineer** (40 candidates)
```javascript
{
  mustHaves: ['React', 'TypeScript'],  // 2 must-haves
  weights: {
    'React': 0.30,        // Highest - core framework
    'TypeScript': 0.25,   // Modern standard
    'JavaScript': 0.15,   // Redundant with TS
    'CSS': 0.15,          // Important but learnable
    'Testing': 0.10,      // Quality indicator
    'GraphQL': 0.05       // Nice bonus
  },
  filters: { min_exp: 2 }
}
```
**Strategy**: Focus on core framework expertise. TypeScript implies JavaScript knowledge.

---

### 2️⃣ **Backend Engineer** (35 candidates)
```javascript
{
  mustHaves: ['Java'],  // 1 must-have only
  weights: {
    'Java': 0.25,           // Core language
    'Microservices': 0.20,  // Architecture skill
    'Spring Boot': 0.15,    // Can learn if knows Java
    'PostgreSQL': 0.15,     // Database
    'REST APIs': 0.15,      // Common skill
    'Docker': 0.05,         // DevOps bonus
    'Kubernetes': 0.05      // DevOps bonus
  },
  filters: { min_exp: 3 }
}
```
**Strategy**: Emphasize architecture skills. Spring Boot not must-have since Java developers can learn it.

---

### 3️⃣ **DevOps Engineer** (18 candidates)
```javascript
{
  mustHaves: ['Kubernetes', 'Docker'],  // 2 must-haves
  weights: {
    'Kubernetes': 0.25,  // Most complex
    'Docker': 0.20,      // Foundation
    'AWS': 0.20,         // Cloud platform
    'CI/CD': 0.15,       // Process knowledge
    'Terraform': 0.10,   // IaC
    'Linux': 0.05,       // Assumed
    'Python': 0.05       // Scripting bonus
  },
  filters: { 
    min_exp: 3,
    work_auth: ['US Citizen', 'Green Card', 'H1B']
  }
}
```
**Strategy**: Container orchestration is non-negotiable. Relaxed from 4 to 2 must-haves.

---

### 4️⃣ **Machine Learning Engineer** (18 candidates)
```javascript
{
  mustHaves: ['Python', 'Machine Learning'],  // 2 must-haves
  weights: {
    'Python': 0.30,             // Core language
    'Machine Learning': 0.25,   // Domain knowledge
    'PyTorch': 0.15,            // Preferred framework
    'TensorFlow': 0.10,         // Alternative
    'SQL': 0.10,                // Data access
    'AWS': 0.10                 // Deployment
  },
  filters: { 
    min_exp: 3,
    work_auth: ['US Citizen', 'Green Card', 'H1B']
  }
}
```
**Strategy**: Core ML skills required. Framework preference for PyTorch but flexible.

---

### 5️⃣ **Senior Full Stack Engineer** (28 candidates) ⭐
```javascript
{
  mustHaves: [],  // ZERO must-haves!
  weights: {
    'JavaScript': 0.25,      // Core language
    'React': 0.20,           // Frontend
    'Node.js': 0.20,         // Backend  
    'TypeScript': 0.15,      // Modern JS
    'System Design': 0.10,   // Senior skill (bonus)
    'AWS': 0.05,             // Cloud
    'PostgreSQL': 0.05       // Database
  },
  filters: { min_exp: 5 }  // Only experience filter
}
```
**Strategy**: **NO must-haves for senior roles!** Rank by overall capability and breadth. System Design is a bonus, not a blocker.

---

## 🎓 Calibration Best Practices

### ✅ DO's

1. **Use 0-2 must-haves per role**
   - Each must-have cuts your pool dramatically
   - Senior roles: 0-1 must-haves
   - Junior roles: 1-2 must-haves

2. **Weight by impact**
   - Core skills: 0.20-0.30
   - Important skills: 0.10-0.20
   - Nice-to-have: 0.05-0.10

3. **Trust the scoring algorithm**
   - Weights handle ranking
   - Must-haves only for truly non-negotiable skills

4. **Consider skill relationships**
   - TypeScript implies JavaScript
   - Spring Boot requires Java
   - Don't make both must-have

5. **Balance pool size**
   - Too few candidates (< 10): Relax must-haves
   - Too many (> 100): Add must-haves or raise filters

### ❌ DON'Ts

1. **Don't use 3+ must-haves** - Pool becomes too small
2. **Don't make framework-specific** - React vs Vue shouldn't both be must-have
3. **Don't ignore experience** - Use min_exp filter instead
4. **Don't over-specify senior roles** - They need breadth, not narrow expertise

---

## 📊 Impact Analysis

### Before Optimization:
| Role | Must-Haves | Candidates | Issue |
|------|-----------|-----------|-------|
| Senior Full Stack | 3 | 2 | ❌ Too restrictive |
| DevOps | 4 | 13 | ⚠️ Very strict |
| Frontend | 3 | 40 | ⚠️ JavaScript + TypeScript redundant |

### After Optimization:
| Role | Must-Haves | Candidates | Result |
|------|-----------|-----------|--------|
| Senior Full Stack | 0 | 28 | ✅ Healthy pool |
| DevOps | 2 | 18 | ✅ Balanced |
| Frontend | 2 | 40 | ✅ Optimized |

**Key Improvement**: Senior Full Stack went from 2 to **28 candidates** (14x increase!)

---

## 🎯 Role-Specific Guidelines

### **Junior/Entry-Level Roles**
- **Must-haves**: 1-2 core skills
- **Strategy**: Test for fundamentals
- **Example**: Junior Frontend needs React + one language

### **Mid-Level Roles**  
- **Must-haves**: 1-2 skills
- **Strategy**: Domain expertise in 1-2 areas
- **Example**: Backend needs language OR framework

### **Senior/Lead Roles**
- **Must-haves**: 0-1 skill (or NONE)
- **Strategy**: Breadth over depth
- **Example**: Senior Full Stack ranked by overall capability

### **Specialized Roles** (DevOps, ML, etc.)
- **Must-haves**: 2 core skills
- **Strategy**: Non-negotiable domain requirements
- **Example**: DevOps must know K8s + Docker

---

## 🔄 Calibration Workflow

1. **Define role requirements** - What skills truly matter?
2. **Identify must-haves** - What's non-negotiable? (Aim for 0-2)
3. **Assign weights** - Rank relative importance (sum = 1.0)
4. **Set hard filters** - Experience, location, work auth
5. **Score candidates** - Run the scoring engine
6. **Review results** - Got 10-50 candidates? Good!
7. **Adjust if needed**:
   - Too few candidates (< 10)? Remove a must-have
   - Too many (> 100)? Add a must-have or raise experience
   - Wrong ranking? Adjust weights

---

## 💡 Key Insights

### Why Few Must-Haves?
**Mathematics**: Each must-have is a multiplicative filter
- 1 must-have: ~70% pass
- 2 must-haves: ~50% pass (0.7 × 0.7)
- 3 must-haves: ~35% pass (0.7 × 0.7 × 0.7)
- 4 must-haves: ~25% pass (0.7⁴)

With 50 candidates, 4 must-haves leaves only 12-13 candidates!

### Why Weights Matter?
Weights determine **ranking** among qualified candidates:
- Candidate A: Strong in high-weight skills → Higher score
- Candidate B: Strong in low-weight skills → Lower score

**The algorithm handles nuance.** You just set the priorities.

---

## 🛠️ How to Adjust Calibration

### In the UI (Calibration Panel):
1. Go to any job detail page
2. Click "Calibrate" button
3. Adjust sliders for weights
4. Toggle must-have switches
5. Click "Save & Re-score"

### Via API:
```javascript
PUT /api/jobs/{jobId}
{
  "competencies": [
    { "name": "React", "weight": 0.30, "mustHave": true }
  ],
  "hardFilters": { "min_total_exp_years": 3 }
}

POST /api/score/{jobId}/batch
```

---

## 📈 Success Metrics

**Well-Calibrated Role**:
- ✅ 10-50 qualified candidates
- ✅ Clear score distribution (not all 90% or all 30%)
- ✅ Top candidates have relevant skills
- ✅ No obvious great candidates excluded

**Needs Adjustment**:
- ❌ < 5 candidates (too strict)
- ❌ > 100 candidates (too loose)
- ❌ All scores between 45-55% (weights too flat)
- ❌ Great candidates scored low (wrong weights)

---

## 🎓 Summary

**The Golden Rules**:
1. **0-2 must-haves** per role
2. **Senior roles**: Fewer must-haves, more weight diversity
3. **Junior roles**: More must-haves, test fundamentals
4. **Trust the weights** to do the ranking
5. **Iterate based on results**

**Current Calibrations are Optimized** for:
- ✅ Realistic candidate pools
- ✅ Clear differentiation in scores
- ✅ Proper balance of selectivity and flexibility
- ✅ Role-appropriate requirements

**Refresh your browser** to see the calibrated results! 🚀

