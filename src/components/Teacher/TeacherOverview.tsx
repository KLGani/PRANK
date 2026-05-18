import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { Users, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TeacherOverviewProps {
  user: User;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    highRiskCount: 0,
    excellentCount: 0,
  });
  const [gradeDistribution, setGradeDistribution] = useState<any[]>([]);
  const [riskDistribution, setRiskDistribution] = useState<any[]>([]);

  useEffect(() => {
    const allData = storage.getAllStudentData();
    const allHistory = storage.getHistory();

    // Get unique students
    const uniqueStudents = new Set(allData.map(d => d.studentId));
    const totalStudents = uniqueStudents.size;

    // Calculate stats from latest predictions
    const latestPredictions = allHistory.reduce((acc, h) => {
      if (!acc[h.studentId] || new Date(h.timestamp) > new Date(acc[h.studentId].timestamp)) {
        acc[h.studentId] = h;
      }
      return acc;
    }, {} as Record<string, any>);

    const predictions = Object.values(latestPredictions);
    const averageScore = predictions.length > 0
      ? predictions.reduce((sum: number, p: any) => sum + p.prediction.predictedScore, 0) / predictions.length
      : 0;

    const highRiskCount = predictions.filter((p: any) => p.prediction.riskLevel === 'High').length;
    const excellentCount = predictions.filter((p: any) => p.prediction.predictedScore >= 85).length;

    setStats({
      totalStudents,
      averageScore,
      highRiskCount,
      excellentCount,
    });

    // Grade distribution
    const gradeCounts: Record<string, number> = {};
    predictions.forEach((p: any) => {
      const grade = p.prediction.grade;
      gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });

    const gradeData = Object.entries(gradeCounts).map(([grade, count]) => ({
      name: grade,
      value: count,
    }));
    setGradeDistribution(gradeData);

    // Risk distribution
    const riskCounts = {
      Low: predictions.filter((p: any) => p.prediction.riskLevel === 'Low').length,
      Medium: predictions.filter((p: any) => p.prediction.riskLevel === 'Medium').length,
      High: predictions.filter((p: any) => p.prediction.riskLevel === 'High').length,
    };

    const riskData = [
      { name: 'Low Risk', value: riskCounts.Low, fill: '#10B981' },
      { name: 'Medium Risk', value: riskCounts.Medium, fill: '#F59E0B' },
      { name: 'High Risk', value: riskCounts.High, fill: '#EF4444' },
    ];
    setRiskDistribution(riskData);
  }, []);

  const GRADE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 🎓</h2>
        <p className="text-purple-100">Here's an overview of your students' performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Students</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Class Average</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.averageScore.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">High Risk</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.highRiskCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Excellent (≥85%)</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.excellentCount}</p>
        </div>
      </div>

      {/* Charts */}
      {gradeDistribution.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Students">
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {gradeDistribution.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Student Data Yet</h3>
          <p className="text-gray-500">Student data will appear here once students make predictions or you upload data.</p>
        </div>
      )}
    </div>
  );
};
