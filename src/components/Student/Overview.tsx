import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { TrendingUp, TrendingDown, Award, AlertCircle, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

interface OverviewProps {
  user: User;
}

export const Overview: React.FC<OverviewProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    averageScore: 0,
    trend: 'stable' as 'up' | 'down' | 'stable',
    latestGrade: 'N/A',
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High',
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const history = storage.getHistoryByStudent(user.id);
    
    if (history.length === 0) {
      return;
    }

    const totalPredictions = history.length;
    const averageScore = history.reduce((sum, h) => sum + h.prediction.predictedScore, 0) / totalPredictions;
    const latest = history[0];
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (history.length >= 2) {
      const current = history[0].prediction.predictedScore;
      const previous = history[1].prediction.predictedScore;
      if (current > previous + 2) trend = 'up';
      else if (current < previous - 2) trend = 'down';
    }

    setStats({
      totalPredictions,
      averageScore,
      trend,
      latestGrade: latest.prediction.grade,
      riskLevel: latest.prediction.riskLevel,
    });

    const chartData = history
      .slice(0, 10)
      .reverse()
      .map((h, idx) => ({
        name: `#${idx + 1}`,
        date: format(new Date(h.timestamp), 'MMM dd'),
        score: h.prediction.predictedScore,
        attendance: h.performance.attendance,
        assignments: h.performance.assignmentScore,
        quizzes: h.performance.quizScore,
      }));

    setChartData(chartData);
  }, [user.id]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl p-5 md:p-8 text-white shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Welcome back! 🎓</h2>
        <p className="text-blue-100 text-sm md:text-base">Here's your academic performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-blue-100 animate-slide-up stagger-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2 md:mb-0">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-600">Predictions</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.totalPredictions}</p>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-green-100 animate-slide-up stagger-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 md:mb-0">
              <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-600">Avg Score</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.averageScore.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-purple-100 animate-slide-up stagger-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-2 md:mb-0 ${
              stats.trend === 'up' ? 'bg-green-100' : stats.trend === 'down' ? 'bg-red-100' : 'bg-purple-100'
            }`}>
              {stats.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              ) : stats.trend === 'down' ? (
                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              ) : (
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              )}
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-600">Trend</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">{stats.trend}</p>
        </div>

        <div className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md transition-all duration-300 hover:shadow-xl border border-orange-100 animate-slide-up stagger-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-2 md:mb-0 ${
              stats.riskLevel === 'Low' ? 'bg-green-100' : stats.riskLevel === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <AlertCircle className={`w-5 h-5 md:w-6 md:h-6 ${
                stats.riskLevel === 'Low' ? 'text-green-600' : stats.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-600">Risk</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">{stats.riskLevel}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Performance Trend */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Performance Trend</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Score" />
                  <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Component Scores */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Component Scores</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="assignments" fill="#3B82F6" name="Assignments" />
                  <Bar dataKey="quizzes" fill="#10B981" name="Quizzes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-md text-center">
          <Activity className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No Data Yet</h3>
          <p className="text-sm md:text-base text-gray-500">Your marks will appear here once your teacher uploads them!</p>
        </div>
      )}
    </div>
  );
};
