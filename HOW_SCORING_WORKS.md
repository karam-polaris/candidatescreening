# 🎯 How Candidate Scoring Works (No AI!)

## The Simple Truth

**It's just math!** Like a hiring manager's scorecard, but automated and consistent.

---

## 📊 Real Example: Hiring a Store Assistant

### Step 1: Define What You Need

```
JOB: Auxiliar de Tienda (Store Assistant) - Bogotá

REQUIREMENTS (Competencies with Weights):
┌─────────────────────┬────────┬─────────────┐
│ Competency          │ Weight │ Must-Have?  │
├─────────────────────┼────────┼─────────────┤
│ Customer Service    │  35%   │     ✓       │
│ Teamwork            │  25%   │             │
│ Cash Handling       │  20%   │             │
│ Inventory Control   │  15%   │             │
│ Product Knowledge   │   5%   │             │
└─────────────────────┴────────┴─────────────┘

HARD FILTERS (Deal Breakers):
• Minimum 1 year experience
• Location: Bogotá or nearby
• Work authorization: Colombia
```

---

### Step 2: Score Candidate A - "Maria García"

```
CANDIDATE PROFILE:
Name: Maria García
Experience: 3 years in retail
Location: Bogotá, Colombia ✓

SKILLS:
• Customer Service    - Advanced, 3 yrs, last used 2024
• Teamwork           - Intermediate, 2 yrs, last used 2023  
• Cash Handling      - Basic, 1 yr, last used 2024
• Product Knowledge  - Advanced, 2 yrs, last used 2024
• Inventory Control  - Not listed ✗
```

#### Calculate Each Competency Score:

**1. Customer Service (35% of final score)**
```
✓ Has skill? YES → Coverage = 1.0
✓ How recent? Used in 2024 (1 year ago) → Recency = 0.8
✓ How experienced? 3 years, Advanced level → Depth = 0.6 × 1.0 = 0.6

Formula: Coverage × (0.5×Recency + 0.5×Depth)
Score: 1.0 × (0.5×0.8 + 0.5×0.6) = 1.0 × 0.7 = 0.70 → 70%
```

**2. Teamwork (25% of final score)**
```
✓ Has skill? YES → 1.0
✓ How recent? 2023 (2 years ago) → 0.6
✓ Experience? 2 years, Intermediate → 0.4 × 0.8 = 0.32

Score: 1.0 × (0.5×0.6 + 0.5×0.32) = 0.46 → 46%
```

**3. Cash Handling (20% of final score)**
```
✓ Has skill? YES → 1.0
✓ How recent? 2024 (1 year) → 0.8
✓ Experience? 1 year, Basic → 0.2 × 0.6 = 0.12

Score: 1.0 × (0.5×0.8 + 0.5×0.12) = 0.46 → 46%
```

**4. Inventory Control (15% of final score)**
```
✗ Has skill? NO → 0.0

Score: 0 → 0%
```

**5. Product Knowledge (5% of final score)**
```
✓ Has skill? YES → 1.0
✓ How recent? 2024 → 0.8
✓ Experience? 2 years, Advanced → 0.4 × 1.0 = 0.4

Score: 1.0 × (0.5×0.8 + 0.5×0.4) = 0.6 → 60%
```

---

### Step 3: Calculate Overall Fit

```
WEIGHTED AVERAGE:
= (Customer Service × 35%) + (Teamwork × 25%) + (Cash × 20%) + (Inventory × 15%) + (Product × 5%)

= (70% × 0.35) + (46% × 0.25) + (46% × 0.20) + (0% × 0.15) + (60% × 0.05)

= 24.5% + 11.5% + 9.2% + 0% + 3%

= 48.2% OVERALL FIT
```

---

### Step 4: Check Hard Filters (Red Flags)

```
✓ Experience: 3 years ≥ 1 year required → PASS
✓ Location: Bogotá = required → PASS  
✓ Work Auth: Colombia = required → PASS
✓ Must-have skill: Has Customer Service → PASS

RED FLAGS: None
```

---

### Step 5: Compare All Candidates

```
RANKED LIST:
┌───────────────┬──────────┬─────────────────────────────────────┬────────────┐
│ Candidate     │ Fit Score│ Strengths                           │ Red Flags  │
├───────────────┼──────────┼─────────────────────────────────────┼────────────┤
│ Carlos Ruiz   │   72%    │ Strong in all areas, 5 years exp    │ None       │
│ Ana Torres    │   65%    │ Excellent cash & inventory skills   │ None       │
│ Maria García  │   48%    │ Great customer service              │ None       │
│ Pedro López   │   35%    │ Basic skills, recent graduate       │ None       │
│ Sofia Díaz    │   12%    │ No retail experience                │ ⚠️ Min exp │
└───────────────┴──────────┴─────────────────────────────────────┴────────────┘

BEST CANDIDATE: Carlos Ruiz (72% fit)
```

---

## 🧮 The Math Behind It

### Skill Level Factors:
```
Basic        → 0.6
Intermediate → 0.8
Advanced     → 1.0
```

### Recency Calculation:
```
Years_Since = CurrentYear - LastUsedYear
Recency = max(0, 1 - Years_Since/5)

Examples:
• Used this year (0 years ago) → 1.0 (100%)
• Used 2 years ago → 0.6 (60%)
• Used 5+ years ago → 0.0 (0%)
```

### Depth Calculation:
```
Years_Score = min(YearsOfExperience / 5, 1.0)
Depth = Years_Score × Level_Factor

Examples:
• 5 years, Advanced → 1.0 × 1.0 = 1.0
• 2 years, Intermediate → 0.4 × 0.8 = 0.32
• 1 year, Basic → 0.2 × 0.6 = 0.12
```

---

## 🤔 Why This Works

### It Mimics Human Evaluation:

**What a Hiring Manager Does:**
1. Reads job requirements
2. Reviews candidate resume
3. Checks: "Do they have this skill?"
4. Thinks: "When did they last use it?"
5. Considers: "How experienced are they?"
6. Weights important skills more
7. Makes a judgment call: "65% fit"

**What This System Does:**
1. Job competencies defined (with weights)
2. Candidate skills parsed (structured data)
3. Coverage check (has skill? yes/no)
4. Recency calculation (formula)
5. Depth calculation (formula)
6. Weighted average (math)
7. Produces score: "65% fit"

---

## ✅ Advantages of Deterministic Scoring

| Benefit | Explanation |
|---------|-------------|
| **Explainable** | You can see exactly why: "65% = 70% customer service × 35% weight + ..." |
| **Consistent** | Same candidate + same job = same score every time |
| **Fair** | No hidden biases, same rules for everyone |
| **Fast** | No API calls, instant results |
| **Transparent** | Candidates can understand why they scored X% |
| **Auditable** | HR can prove compliance with regulations |
| **Tunable** | Adjust weights and see immediate impact |
| **Cost-free** | No AI tokens or API costs |

---

## 🆚 AI vs Deterministic

| Aspect | AI Scoring | Deterministic Scoring |
|--------|-----------|----------------------|
| **Explainability** | "Black box" - hard to explain | Clear formulas, full transparency |
| **Consistency** | Can vary between runs | Identical every time |
| **Speed** | API latency (seconds) | Instant (milliseconds) |
| **Cost** | $0.01-0.10 per candidate | $0 |
| **Legal compliance** | Hard to audit | Easy to prove fairness |
| **Customization** | Need retraining | Change weights instantly |
| **Understanding** | Opaque neural networks | Simple math anyone can verify |

---

## 🎓 Think of It Like School Grades

```
Math Class Final Grade:
• Homework: 20% → You scored 85%
• Quizzes: 30% → You scored 90%  
• Midterm: 20% → You scored 75%
• Final: 30% → You scored 95%

Overall = (85%×0.2) + (90%×0.3) + (75%×0.2) + (95%×0.3)
        = 17% + 27% + 15% + 28.5%
        = 87.5% FINAL GRADE

Same logic! No AI needed - just weighted averages.
```

---

## 🚀 The Power is in the Configuration

You control the "intelligence" by setting:

1. **Which competencies matter** (e.g., Customer Service vs Technical Skills)
2. **How much each matters** (weights)
3. **What's mandatory** (must-haves)
4. **Deal breakers** (hard filters)

The system just **applies your rules consistently** to every candidate.

---

## 💡 Bottom Line

**No AI magic required!** 

It's smart **data processing** + **domain expertise** (knowing what makes a good Store Assistant) + **math**.

The "intelligence" comes from:
✓ Your job design (which skills, what weights)
✓ Candidate data quality (accurate skill info)
✓ Well-designed formulas (recency, depth)

**Not from:**
✗ Machine learning
✗ Neural networks
✗ OpenAI API calls
✗ "Black box" predictions

---

## 🎯 Try It Yourself!

Go to: **http://localhost:3001**

1. Click any job
2. Look at a candidate's score (e.g., "65%")
3. Click to see the breakdown
4. You'll see exactly:
   - Each competency score
   - How it was calculated
   - Which skills matched
   - The evidence used

**It's all transparent math!** 🧮✨

