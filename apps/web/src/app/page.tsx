'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@candidate-screening/ui';
import { Badge } from '@candidate-screening/ui';
import { Briefcase, Users, TrendingUp } from 'lucide-react';
import type { Job } from '@candidate-screening/domain';

interface JobStats {
  applicationsCount: number;
  candidatesCount: number;
  avgFit: number;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobStats, setJobStats] = useState<Map<string, JobStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);

      // Fetch stats for each job
      const stats = new Map<string, JobStats>();
      for (const job of data) {
        const statsResponse = await fetch(`/api/jobs/${job.job_id}/stats`);
        const statsData = await statsResponse.json();
        stats.set(job.job_id, statsData);
      }
      setJobStats(stats);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Candidate Screening</h1>
            <p className="text-gray-600 mt-2">AI-powered intelligent recruitment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Candidate Screening</h1>
            <p className="text-gray-600 mt-2">AI-powered intelligent recruitment</p>
          </div>
          <Link
            href="/jobs/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first job posting to start screening candidates
              </p>
              <Link
                href="/jobs/new"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Job
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const stats = jobStats.get(job.job_id);
              return (
                <Link key={job.job_id} href={`/jobs/${job.job_id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                          {job.location && (
                            <CardDescription className="text-sm">
                              {job.location}
                            </CardDescription>
                          )}
                        </div>
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Candidates
                          </span>
                          <span className="font-semibold">{stats?.candidatesCount || 0}</span>
                        </div>

                        {stats && stats.candidatesCount > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4" />
                              Avg Fit
                            </span>
                            <Badge
                              variant={
                                stats.avgFit >= 0.7
                                  ? 'success'
                                  : stats.avgFit >= 0.5
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {(stats.avgFit * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        )}

                        <div className="pt-2 border-t">
                          <div className="text-xs text-gray-500">
                            {job.competencies.length} competencies
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.competencies.slice(0, 3).map((comp) => (
                              <Badge key={comp.name} variant="outline" className="text-xs">
                                {comp.name}
                              </Badge>
                            ))}
                            {job.competencies.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.competencies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
