import type {
  Job,
  Candidate,
  Assessment,
  FitSnapshot,
  CompetencyScore,
  Skill,
  SkillLevel
} from '@candidate-screening/domain';

export interface ScoringContext {
  job: Job;
  candidate: Candidate;
  assessments: Assessment[];
  calibrationVersion?: string;
}

export interface ScoringConfig {
  currentYear: number;
  mustHaveCapScore: number; // Cap score when must-have is missing (e.g., 0.3)
  excludeOnMissingMustHave: boolean;
  excludeOnHardFilterFail: boolean;
}

const DEFAULT_CONFIG: ScoringConfig = {
  currentYear: new Date().getFullYear(),
  mustHaveCapScore: 0.3,
  excludeOnMissingMustHave: false,
  excludeOnHardFilterFail: true
};

/**
 * Get skill level factor for scoring
 */
function getLevelFactor(level?: SkillLevel): number {
  switch (level) {
    case 'basic':
      return 0.6;
    case 'intermediate':
      return 0.8;
    case 'advanced':
      return 1.0;
    default:
      return 0.7; // Default if not specified
  }
}

/**
 * Clamp a value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Find skill in candidate's skill list (case-insensitive)
 */
function findSkill(candidate: Candidate, skillName: string): Skill | undefined {
  return candidate.skills.find(
    (s) => s.name.toLowerCase() === skillName.toLowerCase()
  );
}

/**
 * Calculate coverage score (0 or 1)
 */
function calculateCoverage(candidate: Candidate, competencyName: string): number {
  const hasSkill = findSkill(candidate, competencyName);
  return hasSkill ? 1 : 0;
}

/**
 * Calculate recency score (0..1)
 * Based on how recently the skill was used
 */
function calculateRecency(
  skill: Skill | undefined,
  currentYear: number
): number {
  if (!skill?.last_used) {
    return 0.6; // Neutral default when last_used is not provided
  }
  const yearsSince = currentYear - skill.last_used;
  return clamp(1 - yearsSince / 5, 0, 1);
}

/**
 * Calculate depth score (0..1)
 * Based on years of experience and skill level
 */
function calculateDepth(skill: Skill | undefined): number {
  if (!skill) return 0;

  const yearsScore = Math.min(1, (skill.years || 0) / 5);
  const levelFactor = getLevelFactor(skill.level);

  return yearsScore * levelFactor;
}

/**
 * Calculate assessment factor for a competency
 * Returns normalized weighted mean of relevant subscores
 */
function calculateAssessmentFactor(
  competencyName: string,
  assessments: Assessment[]
): number {
  if (assessments.length === 0) {
    return 1.0; // Neutral if no assessments
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const assessment of assessments) {
    // Check if this assessment has competency mapping for this competency
    if (assessment.competency_map) {
      const mapping = assessment.competency_map.find(
        (m) => m.competency.toLowerCase() === competencyName.toLowerCase()
      );

      if (mapping) {
        const weight = mapping.weight || 1.0;
        const normalizedScore = assessment.score / 100; // Convert 0-100 to 0-1
        totalWeightedScore += normalizedScore * weight;
        totalWeight += weight;
      }
    }

    // Also check subscores that might match the competency
    if (assessment.subscores) {
      const subscore = assessment.subscores.find(
        (s) => s.name.toLowerCase() === competencyName.toLowerCase()
      );

      if (subscore) {
        const normalizedScore = subscore.score / 100;
        totalWeightedScore += normalizedScore;
        totalWeight += 1;
      }
    }
  }

  if (totalWeight === 0) {
    return 1.0; // No relevant assessments for this competency
  }

  return totalWeightedScore / totalWeight;
}

/**
 * Generate evidence strings for a competency score
 */
function generateEvidence(
  competencyName: string,
  candidate: Candidate,
  assessments: Assessment[],
  skill: Skill | undefined
): string[] {
  const evidence: string[] = [];

  if (skill) {
    let skillEvidence = `skills.${skill.name}`;
    if (skill.level) {
      skillEvidence += `(level=${skill.level}`;
    }
    if (skill.last_used) {
      skillEvidence += skill.level ? `,last_used=${skill.last_used}` : `(last_used=${skill.last_used}`;
    }
    if (skill.years) {
      skillEvidence += (skill.level || skill.last_used) ? `,years=${skill.years}` : `(years=${skill.years}`;
    }
    if (skillEvidence.includes('(')) {
      skillEvidence += ')';
    }
    evidence.push(skillEvidence);
  }

  // Add assessment evidence
  for (const assessment of assessments) {
    if (assessment.competency_map) {
      const mapping = assessment.competency_map.find(
        (m) => m.competency.toLowerCase() === competencyName.toLowerCase()
      );
      if (mapping) {
        evidence.push(`assessment:${assessment.type}.score=${Math.round(assessment.score)}`);
      }
    }

    if (assessment.subscores) {
      const subscore = assessment.subscores.find(
        (s) => s.name.toLowerCase() === competencyName.toLowerCase()
      );
      if (subscore) {
        evidence.push(`assessment:${assessment.type}.${subscore.name}=${Math.round(subscore.score)}`);
      }
    }
  }

  return evidence;
}

/**
 * Score a single competency for a candidate
 */
function scoreCompetency(
  competencyName: string,
  candidate: Candidate,
  assessments: Assessment[],
  currentYear: number
): CompetencyScore {
  const skill = findSkill(candidate, competencyName);

  const coverage = calculateCoverage(candidate, competencyName);
  const recency = calculateRecency(skill, currentYear);
  const depth = calculateDepth(skill);
  const assessFactor = calculateAssessmentFactor(competencyName, assessments);

  // Competency score formula:
  // comp_score = coverage * ((0.5*recency + 0.5*depth)) * assess
  const skillScore = 0.5 * recency + 0.5 * depth;
  const score = coverage * skillScore * assessFactor;

  const evidence = generateEvidence(competencyName, candidate, assessments, skill);

  return {
    name: competencyName,
    score: clamp(score, 0, 1),
    evidence
  };
}

/**
 * Check hard filters and generate red flags
 */
function checkHardFilters(
  job: Job,
  candidate: Candidate,
  config: ScoringConfig
): string[] {
  const redFlags: string[] = [];

  if (!job.hardFilters) {
    return redFlags;
  }

  const { min_total_exp_years, work_auth, locations } = job.hardFilters;

  // Check minimum experience
  if (
    min_total_exp_years !== undefined &&
    (candidate.total_experience_years === undefined ||
      candidate.total_experience_years < min_total_exp_years)
  ) {
    redFlags.push(
      `total_experience_years=${candidate.total_experience_years || 0} < required ${min_total_exp_years}`
    );
  }

  // Check work authorization
  if (work_auth && work_auth.length > 0 && candidate.work_auth) {
    const hasValidAuth = work_auth.some(
      (auth) => auth.toLowerCase() === candidate.work_auth?.toLowerCase()
    );
    if (!hasValidAuth) {
      redFlags.push(
        `work_auth=${candidate.work_auth} not in required [${work_auth.join(', ')}]`
      );
    }
  }

  // Check location
  if (locations && locations.length > 0 && candidate.location) {
    const hasValidLocation = locations.some(
      (loc) => candidate.location?.toLowerCase().includes(loc.toLowerCase())
    );
    if (!hasValidLocation) {
      redFlags.push(
        `location=${candidate.location} not in required [${locations.join(', ')}]`
      );
    }
  }

  return redFlags;
}

/**
 * Check for missing must-have competencies
 */
function checkMustHaves(
  job: Job,
  byCompetency: CompetencyScore[]
): string[] {
  const redFlags: string[] = [];

  for (const competency of job.competencies) {
    if (competency.mustHave) {
      const compScore = byCompetency.find(
        (c) => c.name.toLowerCase() === competency.name.toLowerCase()
      );

      // If coverage is 0 (no skill found), it's a missing must-have
      if (!compScore || compScore.score === 0) {
        redFlags.push(`must-have competency missing: ${competency.name}`);
      }
    }
  }

  return redFlags;
}

/**
 * Generate explanation atoms (terse rationale items)
 */
function generateExplainAtoms(
  job: Job,
  candidate: Candidate,
  byCompetency: CompetencyScore[],
  redFlags: string[],
  overall: number
): string[] {
  const atoms: string[] = [];

  // Overall fit
  const fitLevel = overall >= 0.8 ? 'excellent' : overall >= 0.6 ? 'good' : overall >= 0.4 ? 'moderate' : 'low';
  atoms.push(`Overall fit: ${fitLevel} (${(overall * 100).toFixed(0)}%)`);

  // Top competencies
  const topCompetencies = [...byCompetency]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .filter((c) => c.score > 0.5);

  if (topCompetencies.length > 0) {
    const topNames = topCompetencies.map((c) => c.name).join(', ');
    atoms.push(`Strong in: ${topNames}`);
  }

  // Weak competencies
  const weakCompetencies = byCompetency
    .filter((c) => c.score < 0.3 && c.score > 0)
    .map((c) => c.name);

  if (weakCompetencies.length > 0) {
    atoms.push(`Needs development: ${weakCompetencies.join(', ')}`);
  }

  // Experience
  if (candidate.total_experience_years !== undefined) {
    atoms.push(`${candidate.total_experience_years} years total experience`);
  }

  // Seniority
  if (candidate.seniority) {
    atoms.push(`Seniority: ${candidate.seniority}`);
  }

  // Red flags
  if (redFlags.length > 0) {
    atoms.push(...redFlags.map((flag) => `⚠️ ${flag}`));
  }

  return atoms;
}

/**
 * Main scoring function
 * Computes a FitSnapshot for a candidate-job pair
 */
export function scoreCandidate(
  context: ScoringContext,
  config: Partial<ScoringConfig> = {}
): FitSnapshot | null {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const { job, candidate, assessments, calibrationVersion } = context;

  // Check hard filters first
  const hardFilterFlags = checkHardFilters(job, candidate, finalConfig);

  if (hardFilterFlags.length > 0 && finalConfig.excludeOnHardFilterFail) {
    // Exclude this candidate
    return null;
  }

  // Score each competency
  const byCompetency: CompetencyScore[] = job.competencies.map((comp) =>
    scoreCompetency(comp.name, candidate, assessments, finalConfig.currentYear)
  );

  // Check must-haves
  const mustHaveFlags = checkMustHaves(job, byCompetency);

  if (mustHaveFlags.length > 0 && finalConfig.excludeOnMissingMustHave) {
    // Exclude this candidate
    return null;
  }

  // Calculate overall score: weighted average of competency scores
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const comp of job.competencies) {
    const compScore = byCompetency.find(
      (c) => c.name.toLowerCase() === comp.name.toLowerCase()
    );

    if (compScore) {
      totalWeightedScore += compScore.score * comp.weight;
      totalWeight += comp.weight;
    }
  }

  let overall = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  // Apply cap if must-have is missing
  if (mustHaveFlags.length > 0 && !finalConfig.excludeOnMissingMustHave) {
    overall = Math.min(overall, finalConfig.mustHaveCapScore);
  }

  // Combine all red flags
  const redFlags = [...hardFilterFlags, ...mustHaveFlags];

  // Generate explanation atoms
  const explainAtoms = generateExplainAtoms(
    job,
    candidate,
    byCompetency,
    redFlags,
    overall
  );

  // Create snapshot
  const snapshot: FitSnapshot = {
    snapshot_id: '', // Will be set by caller
    job_id: job.job_id,
    candidate_id: candidate.candidate_id,
    overall: clamp(overall, 0, 1),
    byCompetency,
    redFlags,
    explainAtoms,
    calibrationVersion: calibrationVersion || 'v1',
    created_at: new Date().toISOString()
  };

  return snapshot;
}

/**
 * Score multiple candidates for a job
 */
export function scoreCandidates(
  job: Job,
  candidates: Candidate[],
  assessmentsByCandidate: Map<string, Assessment[]>,
  config: Partial<ScoringConfig> = {}
): FitSnapshot[] {
  const snapshots: FitSnapshot[] = [];

  for (const candidate of candidates) {
    const assessments = assessmentsByCandidate.get(candidate.candidate_id) || [];

    const snapshot = scoreCandidate(
      {
        job,
        candidate,
        assessments,
        calibrationVersion: config.currentYear?.toString() || 'v1'
      },
      config
    );

    if (snapshot) {
      snapshots.push(snapshot);
    }
  }

  return snapshots;
}
