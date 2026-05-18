import React from 'react';
import { PredictionResult } from '../../types';
import { Award, AlertCircle, TrendingUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface PredictionDisplayProps {
  result: PredictionResult;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result }) => {
  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-100 border-green-200';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-100 mb-1">Predicted Final Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(result.predictedScore)} drop-shadow`} style={{ color: 'white' }}>
              {result.predictedScore}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 mb-1">Grade</p>
            <p className="text-5xl font-bold">{result.grade}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 mb-1">Confidence</p>
            <p className="text-3xl font-bold">{result.confidenceScore}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="bg-blue-800 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-1000"
              style={{ width: `${result.predictedScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Risk Level */}
      <div className={`rounded-xl p-4 border-2 flex items-center gap-3 ${getRiskColor(result.riskLevel)}`}>
        <AlertCircle className="w-6 h-6 flex-shrink-0" />
        <div>
          <p className="font-semibold">Risk Level: {result.riskLevel}</p>
          <p className="text-sm opacity-80">
            {result.riskLevel === 'Low' ? 'Great performance! Keep it up.' :
             result.riskLevel === 'Medium' ? 'Some areas need attention.' :
             'Immediate action recommended.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Areas of Improvement */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Areas to Improve
          </h3>
          <ul className="space-y-2">
            {result.areasOfImprovement.map((area, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-red-400">→</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Personalized Recommendations
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700">
              {rec}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
