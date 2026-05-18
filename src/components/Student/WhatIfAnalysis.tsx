import React, { useState, useEffect } from 'react';
import { User, StudentPerformance } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface WhatIfAnalysisProps {
  user: User;
}

export const WhatIfAnalysis: React.FC<WhatIfAnalysisProps> = ({ user }) => {
  const [basePerformance, setBasePerformance] = useState<StudentPerformance | null>(null);
  const [whatIf, setWhatIf] = useState({
    attendance: 85,
    assignmentScore: 78,
    quizScore: 82,
    studyHoursPerDay: 4,
  });
  const [basePrediction, setBasePrediction] = useState<any>(null);
  const [whatIfPrediction, setWhatIfPrediction] = useState<any>(null);

  useEffect(() => {
    const history = storage.getHistoryByStudent(user.id);
    if (history.length > 0) {
      const latest = history[0];
      setBasePerformance(latest.performance);
      setBasePrediction(latest.prediction);
      setWhatIf({
        attendance: latest.performance.attendance,
        assignmentScore: latest.performance.assignmentScore,
        quizScore: latest.performance.quizScore,
        studyHoursPerDay: latest.performance.studyHoursPerDay,
      });
    }
  }, [user.id]);

  useEffect(() => {
    if (basePerformance) {
      const result = predictPerformance(basePerformance, whatIf);
      setWhatIfPrediction(result);
    }
  }, [whatIf, basePerformance]);

  const handleChange = (field: string, value: number) => {
    setWhatIf(prev => ({ ...prev, [field]: value }));
  };

  const fields = [
    { key: 'attendance', label: 'Attendance', unit: '%', min: 0, max: 100 },
    { key: 'assignmentScore', label: 'Assignment Score', unit: '', min: 0, max: 100 },
    { key: 'quizScore', label: 'Quiz Score', unit: '', min: 0, max: 100 },
    { key: 'studyHoursPerDay', label: 'Study Hours/Day', unit: 'hrs', min: 0, max: 12 },
  ];

  if (!basePerformance) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Data Available</h3>
        <p className="text-gray-500">Please make a prediction first in the "Predict Performance" tab.</p>
      </div>
    );
  }

  const scoreDiff = whatIfPrediction
    ? whatIfPrediction.predictedScore - (basePrediction?.predictedScore || 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          What-If Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Adjust the sliders below to see how changes in your habits affect your predicted score.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <span className="text-sm font-bold text-blue-600">
                  {whatIf[field.key as keyof typeof whatIf]}{field.unit}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={whatIf[field.key as keyof typeof whatIf]}
                onChange={(e) => handleChange(field.key, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          ))}
        </div>
      </div>

      {whatIfPrediction && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <p className="text-sm text-gray-500 mb-1">Current Score</p>
            <p className="text-4xl font-bold text-gray-800">{basePrediction?.predictedScore || 0}%</p>
            <p className="text-sm text-gray-500 mt-1">Grade: {basePrediction?.grade || 'N/A'}</p>
          </div>

          <div className={`rounded-xl p-6 shadow-md text-center ${
            scoreDiff > 0 ? 'bg-green-50 border-2 border-green-200' :
            scoreDiff < 0 ? 'bg-red-50 border-2 border-red-200' :
            'bg-gray-50 border-2 border-gray-200'
          }`}>
            <p className="text-sm text-gray-500 mb-1">Change</p>
            <p className={`text-4xl font-bold ${
              scoreDiff > 0 ? 'text-green-600' : scoreDiff < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff.toFixed(1)}%
            </p>
            <TrendingUp className={`w-8 h-8 mx-auto mt-2 ${
              scoreDiff > 0 ? 'text-green-500' : scoreDiff < 0 ? 'text-red-500 rotate-180' : 'text-gray-400'
            }`} />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-md text-center">
            <p className="text-sm text-gray-500 mb-1">What-If Score</p>
            <p className="text-4xl font-bold text-blue-700">{whatIfPrediction.predictedScore}%</p>
            <p className="text-sm text-gray-500 mt-1">Grade: {whatIfPrediction.grade}</p>
          </div>
        </div>
      )}

      {whatIfPrediction && whatIfPrediction.recommendations.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations for This Scenario</h3>
          <div className="space-y-3">
            {whatIfPrediction.recommendations.map((rec: string, i: number) => (
              <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-gray-700">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
