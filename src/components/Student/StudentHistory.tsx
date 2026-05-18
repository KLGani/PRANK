import React, { useEffect, useState } from 'react';
import { User, HistoryEntry } from '../../types';
import { storage } from '../../utils/storage';
import { History, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { format } from 'date-fns';

interface StudentHistoryProps {
  user: User;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({ user }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const data = storage.getHistoryByStudent(user.id);
    setHistory(data);
  }, [user.id]);

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No History Yet</h3>
        <p className="text-gray-500">Your prediction history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-600" />
          Prediction History
        </h2>
        <p className="text-gray-600">{history.length} prediction{history.length !== 1 ? 's' : ''} recorded</p>
      </div>

      <div className="space-y-4">
        {history.map((entry, index) => (
          <div key={entry.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-bold">#{history.length - index}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {format(new Date(entry.timestamp), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(entry.timestamp), 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Score</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {entry.prediction.predictedScore}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Grade</p>
                  <p className={`text-2xl font-bold ${getGradeColor(entry.prediction.grade)}`}>
                    {entry.prediction.grade}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadge(entry.prediction.riskLevel)}`}>
                  {entry.prediction.riskLevel} Risk
                </span>
              </div>
            </div>

            {/* Performance details */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Attendance</p>
                <p className="font-semibold text-gray-800">{entry.performance.attendance}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Assignment</p>
                <p className="font-semibold text-gray-800">{entry.performance.assignmentScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Quiz Score</p>
                <p className="font-semibold text-gray-800">{entry.performance.quizScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Study Hours</p>
                <p className="font-semibold text-gray-800">{entry.performance.studyHoursPerDay} hrs/day</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
