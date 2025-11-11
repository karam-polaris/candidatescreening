'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@candidate-screening/ui';
import { Plus, X } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [competencies, setCompetencies] = useState([
    { name: '', weight: 0.2, mustHave: false }
  ]);

  const addCompetency = () => {
    setCompetencies([...competencies, { name: '', weight: 0.1, mustHave: false }]);
  };

  const removeCompetency = (index: number) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const updateCompetency = (index: number, field: string, value: any) => {
    const updated = [...competencies];
    updated[index] = { ...updated[index], [field]: value };
    setCompetencies(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          location,
          competencies: competencies.filter((c) => c.name)
        })
      });

      if (response.ok) {
        const job = await response.json();
        router.push(`/jobs/${job.job_id}`);
      }
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Job</h1>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="San Francisco, CA"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Competencies *
                  </label>
                  <Button type="button" onClick={addCompetency} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-3">
                  {competencies.map((comp, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => updateCompetency(index, 'name', e.target.value)}
                        placeholder="React, Python, etc."
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <input
                        type="number"
                        value={comp.weight}
                        onChange={(e) =>
                          updateCompetency(index, 'weight', parseFloat(e.target.value))
                        }
                        min="0"
                        max="1"
                        step="0.05"
                        className="w-20 px-3 py-2 border rounded-md text-sm"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={comp.mustHave}
                          onChange={(e) =>
                            updateCompetency(index, 'mustHave', e.target.checked)
                          }
                        />
                        Must-have
                      </label>
                      {competencies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCompetency(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit">Create Job</Button>
                <Button type="button" variant="outline" onClick={() => router.push('/')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
