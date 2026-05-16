'use client';

import { useState, useEffect } from 'react';
import { careers, getCareerById } from '../lib/careers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimulationResult {
  career: string;
  years: number;
  currentSalary: number;
  predictedSalary: number;
  jobDemand: number;
  automationRisk: number;
  insights: string;
  chartData: { year: number; salary: number }[];
}

export default function CareerSelector() {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [compareCareer, setCompareCareer] = useState('');
  const [years, setYears] = useState(5);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [compareResult, setCompareResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedSimulations, setSavedSimulations] = useState<SimulationResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('careerSimulations');
    if (saved) {
      setSavedSimulations(JSON.parse(saved));
    }
  }, []);

  const simulateCareer = async (careerId: string): Promise<SimulationResult | null> => {
    const career = getCareerById(careerId);
    if (!career) return null;

    const response = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ careerId, years }),
    });
    const data = await response.json();

    // Generate chart data
    const chartData = [];
    for (let i = 0; i <= years; i++) {
      const salary = i === 0 ? career.averageSalary : career.averageSalary * Math.pow(1 + career.growthRate / 100 * (1 - career.automationRisk / 100), i);
      chartData.push({ year: i, salary: Math.round(salary) });
    }
    data.chartData = chartData;

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [primaryResult, secondaryResult] = await Promise.all([
        selectedCareer ? simulateCareer(selectedCareer) : Promise.resolve(null),
        compareCareer ? simulateCareer(compareCareer) : Promise.resolve(null),
      ]);
      setResult(primaryResult);
      setCompareResult(secondaryResult);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSimulation = () => {
    if (result) {
      const updated = [...savedSimulations, result];
      setSavedSimulations(updated);
      localStorage.setItem('careerSimulations', JSON.stringify(updated));
    }
  };

  const categories = Array.from(new Set(careers.map(c => c.category)));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Simulate Your Career Path</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="career" className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Career
              </label>
              <select
                id="career"
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select a career...</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name} ({career.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="compare" className="block text-sm font-semibold text-gray-700 mb-2">
                Compare With (Optional)
              </label>
              <select
                id="compare"
                value={compareCareer}
                onChange={(e) => setCompareCareer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select to compare...</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name} ({career.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="years" className="block text-sm font-semibold text-gray-700 mb-2">
                Years to Simulate
              </label>
              <input
                type="number"
                id="years"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="1"
                max="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={loading || (!selectedCareer && !compareCareer)}
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Simulating...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Run Simulation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {(result || compareResult) && (
        <div className="space-y-8">
          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{result.career} Simulation</h3>
                <button
                  onClick={saveSimulation}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Simulation
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">${result.currentSalary.toLocaleString()}</div>
                  <div className="text-sm text-green-700">Current Salary</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">${result.predictedSalary.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Predicted in {result.years} Years</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{result.jobDemand}%</div>
                  <div className="text-sm text-purple-700">Job Demand</div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">{result.automationRisk}%</div>
                  <div className="text-sm text-red-700">Automation Risk</div>
                </div>
              </div>
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Projection Chart</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Salary']} />
                    <Legend />
                    <Line type="monotone" dataKey="salary" stroke="#4f46e5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h4>
                <p className="text-gray-700 leading-relaxed">{result.insights}</p>
              </div>
            </div>
          )}

          {compareResult && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{compareResult.career} Simulation</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">${compareResult.currentSalary.toLocaleString()}</div>
                  <div className="text-sm text-green-700">Current Salary</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">${compareResult.predictedSalary.toLocaleString()}</div>
                  <div className="text-sm text-blue-700">Predicted in {compareResult.years} Years</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">{compareResult.jobDemand}%</div>
                  <div className="text-sm text-purple-700">Job Demand</div>
                </div>
                <div className="bg-red-50 p-6 rounded-xl text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">{compareResult.automationRisk}%</div>
                  <div className="text-sm text-red-700">Automation Risk</div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">AI Insights</h4>
                <p className="text-gray-700 leading-relaxed">{compareResult.insights}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {savedSimulations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Saved Simulations</h3>
          <div className="space-y-4">
            {savedSimulations.map((sim, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold">{sim.career} - {sim.years} years</h4>
                <p className="text-sm text-gray-600">Predicted Salary: ${sim.predictedSalary.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}