'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@candidate-screening/ui';
import { Slider, Filter, Users, Settings, MessageSquare, ArrowUpDown, X } from 'lucide-react';
import type { Job, FitSnapshot, Candidate } from '@candidate-screening/domain';

interface CandidateWithFit {
  candidate: Candidate;
  fitSnapshot: FitSnapshot;
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<CandidateWithFit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateWithFit | null>(null);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

  // Filters
  const [filters, setFilters] = useState({
    min_fit: 0,
    skills: '',
    location: '',
    min_experience: ''
  });

  useEffect(() => {
    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const [jobResponse, candidatesResponse] = await Promise.all([
        fetch(`/api/jobs/${jobId}`),
        fetch(`/api/jobs/${jobId}/candidates`)
      ]);

      const jobData = await jobResponse.json();
      const candidatesData = await candidatesResponse.json();

      setJob(jobData);
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Failed to fetch job data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreBatch = async () => {
    setLoading(true);
    try {
      await fetch(`/api/score/${jobId}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      await fetchJobData();
    } catch (error) {
      console.error('Failed to score candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComparisonSelection = (candidateId: string) => {
    const newSet = new Set(selectedForComparison);
    if (newSet.has(candidateId)) {
      newSet.delete(candidateId);
    } else {
      newSet.add(candidateId);
    }
    setSelectedForComparison(newSet);
  };

  const getFitColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFitBadgeVariant = (score: number) => {
    if (score >= 0.7) return 'success' as const;
    if (score >= 0.5) return 'default' as const;
    return 'secondary' as const;
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              {job.location && <p className="text-gray-600 mt-1">{job.location}</p>}
              <div className="flex gap-2 mt-3">
                {job.competencies.map((comp) => (
                  <Badge key={comp.name} variant="outline">
                    {comp.name} {comp.mustHave && <span className="text-red-500">*</span>}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowCalibration(!showCalibration)} variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Calibrate
              </Button>
              <Button onClick={handleScoreBatch}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Re-score All
              </Button>
              <Button onClick={() => setShowChat(!showChat)} variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Panel */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Min Fit Score: {filters.min_fit}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.min_fit}
                    onChange={(e) => setFilters({ ...filters, min_fit: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Python, React"
                    value={filters.skills}
                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Min Experience (years)
                  </label>
                  <input
                    type="number"
                    placeholder="3"
                    value={filters.min_experience}
                    onChange={(e) => setFilters({ ...filters, min_experience: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                {selectedForComparison.size > 0 && (
                  <Button
                    className="w-full"
                    onClick={() => setShowComparison(true)}
                    disabled={selectedForComparison.size < 2}
                  >
                    Compare ({selectedForComparison.size})
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Candidates List */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Candidates ({candidates.length})
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {candidates.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No candidates scored yet</p>
                    <p className="text-sm">Click "Re-score All" to score candidates for this job</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {candidates
                      .filter((c) => {
                        if (filters.min_fit > 0 && c.fitSnapshot.overall * 100 < filters.min_fit) return false;
                        if (filters.location && !c.candidate.location?.toLowerCase().includes(filters.location.toLowerCase())) return false;
                        if (filters.min_experience && (c.candidate.total_experience_years || 0) < parseFloat(filters.min_experience)) return false;
                        if (filters.skills) {
                          const requiredSkills = filters.skills.split(',').map(s => s.trim().toLowerCase());
                          const candidateSkills = c.candidate.skills.map(s => s.name.toLowerCase());
                          if (!requiredSkills.some(skill => candidateSkills.includes(skill))) return false;
                        }
                        return true;
                      })
                      .map((candidateData) => (
                        <div
                          key={candidateData.candidate.candidate_id}
                          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => setSelectedCandidate(candidateData)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedForComparison.has(candidateData.candidate.candidate_id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleComparisonSelection(candidateData.candidate.candidate_id);
                                  }}
                                  className="w-4 h-4"
                                />
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {candidateData.candidate.full_name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {candidateData.candidate.current_title || 'No title'}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {candidateData.candidate.skills.slice(0, 5).map((skill) => (
                                  <Badge key={skill.name} variant="outline" className="text-xs">
                                    {skill.name}
                                  </Badge>
                                ))}
                                {candidateData.candidate.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidateData.candidate.skills.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <Badge variant={getFitBadgeVariant(candidateData.fitSnapshot.overall)} className="text-lg">
                                {(candidateData.fitSnapshot.overall * 100).toFixed(0)}%
                              </Badge>
                              {candidateData.fitSnapshot.redFlags.length > 0 && (
                                <div className="mt-2">
                                  <Badge variant="destructive" className="text-xs">
                                    {candidateData.fitSnapshot.redFlags.length} flags
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Candidate Detail Drawer */}
      {selectedCandidate && (
        <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-xl border-l overflow-y-auto z-50">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCandidate.candidate.full_name}
                </h2>
                <p className="text-gray-600">{selectedCandidate.candidate.current_title}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Fit Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Fit</span>
                <Badge variant={getFitBadgeVariant(selectedCandidate.fitSnapshot.overall)} className="text-xl">
                  {(selectedCandidate.fitSnapshot.overall * 100).toFixed(0)}%
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${getFitColor(selectedCandidate.fitSnapshot.overall)} h-2 rounded-full`}
                  style={{ width: `${selectedCandidate.fitSnapshot.overall * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Competency Scores */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Competency Breakdown</h3>
              <div className="space-y-3">
                {selectedCandidate.fitSnapshot.byCompetency.map((comp) => (
                  <div key={comp.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{comp.name}</span>
                      <span className="text-gray-600">{(comp.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${getFitColor(comp.score)} h-2 rounded-full`}
                        style={{ width: `${comp.score * 100}%` }}
                      ></div>
                    </div>
                    {comp.evidence.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {comp.evidence.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Atoms */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">AI Insights</h3>
              <ul className="space-y-2">
                {selectedCandidate.fitSnapshot.explainAtoms.map((atom, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{atom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            {selectedCandidate.fitSnapshot.redFlags.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Red Flags</h3>
                <div className="space-y-2">
                  {selectedCandidate.fitSnapshot.redFlags.map((flag, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <Badge variant="destructive" className="text-xs">!</Badge>
                      <span className="text-sm text-gray-700">{flag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
              <dl className="space-y-2 text-sm">
                {selectedCandidate.candidate.location && (
                  <>
                    <dt className="text-gray-600">Location</dt>
                    <dd className="font-medium">{selectedCandidate.candidate.location}</dd>
                  </>
                )}
                {selectedCandidate.candidate.total_experience_years && (
                  <>
                    <dt className="text-gray-600">Experience</dt>
                    <dd className="font-medium">{selectedCandidate.candidate.total_experience_years} years</dd>
                  </>
                )}
                {selectedCandidate.candidate.work_auth && (
                  <>
                    <dt className="text-gray-600">Work Authorization</dt>
                    <dd className="font-medium">{selectedCandidate.candidate.work_auth}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && selectedForComparison.size >= 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Candidate Comparison</h2>
                <button onClick={() => setShowComparison(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Metric</th>
                      {Array.from(selectedForComparison).map((id) => {
                        const candidateData = candidates.find((c) => c.candidate.candidate_id === id);
                        return (
                          <th key={id} className="text-left p-3 font-semibold">
                            {candidateData?.candidate.full_name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Overall Fit</td>
                      {Array.from(selectedForComparison).map((id) => {
                        const candidateData = candidates.find((c) => c.candidate.candidate_id === id);
                        return (
                          <td key={id} className="p-3">
                            <Badge variant={getFitBadgeVariant(candidateData?.fitSnapshot.overall || 0)}>
                              {((candidateData?.fitSnapshot.overall || 0) * 100).toFixed(0)}%
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>

                    {job.competencies.map((comp) => (
                      <tr key={comp.name} className="border-b">
                        <td className="p-3 font-medium">
                          {comp.name}
                          {comp.mustHave && <span className="text-red-500 ml-1">*</span>}
                        </td>
                        {Array.from(selectedForComparison).map((id) => {
                          const candidateData = candidates.find((c) => c.candidate.candidate_id === id);
                          const compScore = candidateData?.fitSnapshot.byCompetency.find(
                            (c) => c.name === comp.name
                          );
                          return (
                            <td key={id} className="p-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`${getFitColor(compScore?.score || 0)} h-2 rounded-full`}
                                  style={{ width: `${(compScore?.score || 0) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">
                                {((compScore?.score || 0) * 100).toFixed(0)}%
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    <tr className="border-b">
                      <td className="p-3 font-medium">Experience</td>
                      {Array.from(selectedForComparison).map((id) => {
                        const candidateData = candidates.find((c) => c.candidate.candidate_id === id);
                        return (
                          <td key={id} className="p-3">
                            {candidateData?.candidate.total_experience_years || 0} years
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b">
                      <td className="p-3 font-medium">Red Flags</td>
                      {Array.from(selectedForComparison).map((id) => {
                        const candidateData = candidates.find((c) => c.candidate.candidate_id === id);
                        return (
                          <td key={id} className="p-3">
                            {candidateData?.fitSnapshot.redFlags.length || 0}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border flex flex-col z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Copilot
            </h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-sm text-gray-600 text-center py-8">
              Chat copilot coming soon!
              <br />
              <span className="text-xs">Configure Azure OpenAI to enable</span>
            </div>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Ask about candidates..."
              className="w-full px-3 py-2 border rounded-md text-sm"
              disabled
            />
          </div>
        </div>
      )}
    </div>
  );
}
