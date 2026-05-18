import React, { useState } from 'react';
import { User, StudentPerformance, HistoryEntry } from '../../types';
import { predictPerformance } from '../../utils/prediction';
import { storage } from '../../utils/storage';
import { TrendingUp, Save } from 'lucide-react';
import { PredictionDisplay } from './PredictionDisplay';

interface PerformanceInputProps {
  user: User;
}

export const PerformanceInput: React.FC<PerformanceInputProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    attendance: 85,
    assignmentScore: 78,
    quizScore: 82,
    midtermScore: 75,
    previousResult: 80,
    studyHoursPerDay: 4,
    extracurricularActivities: 2,
  });
  const [prediction, setPrediction] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setPrediction(null);
    setSaved(false);
  };

  const handlePredict = () => {
    const performance: StudentPerformance = {
      studentId: user.id,
      studentName: user.name,
      email: user.email,
      class: ('class' in user ? (user as any).class : 'N/A') as string,
      section: ('section' in user ? (user as any).section : 'N/A') as string,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    const result = predictPerformance(performance);
    setPrediction({ performance, result });
  };

  const handleSave = () => {
    if (!prediction) return;

    const entry: HistoryEntry = {
      id: `${user.id}-${Date.now()}`,
      studentId: user.id,
      performance: prediction.performance,
      prediction: prediction.result,
      timestamp: new Date().toISOString(),
    };

    storage.saveHistory(entry);
    storage.saveStudentData(prediction.performance);
    setSaved(true);
  };

  const fields = [
    { key: 'attendance', label: 'Attendance', unit: '%', min: 0, max: 100, description: 'Class attendance percentage' },
    { key: 'assignmentScore', label: 'Assignment Score', unit: '', min: 0, max: 100, description: 'Average assignment score' },
    { key: 'quizScore', label: 'Quiz Score', unit: '', min: 0, max: 100, description: 'Average quiz score' },
    { key: 'midtermScore', label: 'Midterm Score', unit: '', min: 0, max: 100, description: 'Midterm exam score' },
    { key: 'previousResult', label: 'Previous Result', unit: '', min: 0, max: 100, description: "Last year's final score" },
    { key: 'studyHoursPerDay', label: 'Study Hours/Day', unit: 'hrs', min: 0, max: 12, description: 'Daily study hours' },
    { key: 'extracurricularActivities', label: 'Extracurricular', unit: '', min: 0, max: 10, description: 'Number of activities' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          Predict Performance
        </h2>
        <p className="text-gray-600 mb-6">Enter your academic data to get an AI-powered prediction</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(field => (
            <div key={field.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{field.label}</label>
                <span className="text-sm font-bold text-blue-600">
                  {formData[field.key as keyof typeof formData]}{field.unit}
                </span>
              </div>
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => handleChange(field.key, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-gray-500">{field.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handlePredict}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            Predict Performance
          </button>
          {prediction && !saved && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
          )}
          {saved && (
            <div className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold flex items-center gap-2">
              ✓ Saved!
            </div>
          )}
        </div>
      </div>

      {prediction && <PredictionDisplay result={prediction.result} />}
    </div>
  );
};
