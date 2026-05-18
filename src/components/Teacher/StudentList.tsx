import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { Users, Search } from 'lucide-react';

interface StudentListProps {
  user: User;
}

export const StudentList: React.FC<StudentListProps> = ({ user }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const allHistory = storage.getHistory();

    // Get latest prediction per student
    const latestPerStudent = allHistory.reduce((acc, h) => {
      if (!acc[h.studentId] || new Date(h.timestamp) > new Date(acc[h.studentId].timestamp)) {
        acc[h.studentId] = h;
      }
      return acc;
    }, {} as Record<string, any>);

    setStudents(Object.values(latestPerStudent));
  }, []);

  const filtered = students.filter(s =>
    s.performance.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase())
  );

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700 border border-green-200';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    return 'bg-red-100 text-red-700 border border-red-200';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 shadow-md text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Student Data</h3>
        <p className="text-gray-500">Student performance data will appear here once students use the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Student Performance
        </h2>
        <p className="text-gray-600 mb-4">{students.length} student{students.length !== 1 ? 's' : ''} tracked</p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((student) => (
              <tr key={student.studentId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold text-sm">
                        {student.performance.studentName?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{student.performance.studentName}</p>
                      <p className="text-xs text-gray-500">{student.performance.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{student.prediction.predictedScore}%</p>
                </td>
                <td className="px-6 py-4">
                  <p className={`font-bold text-lg ${getGradeColor(student.prediction.grade)}`}>
                    {student.prediction.grade}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadge(student.prediction.riskLevel)}`}>
                    {student.prediction.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          student.performance.attendance >= 80 ? 'bg-green-500' :
                          student.performance.attendance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${student.performance.attendance}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-700">{student.performance.attendance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
