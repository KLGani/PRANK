import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { storage } from '../../utils/storage';
import { FileText, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface StudentMarksProps {
  user: User;
}

export const StudentMarks: React.FC<StudentMarksProps> = ({ user }) => {
  const [marks, setMarks] = useState<any[]>([]);

  useEffect(() => {
    const allHistory = storage.getHistoryByStudent(user.id);
    const combinedData: any[] = [];

    allHistory.forEach(h => {
      combinedData.push({
        id: h.id,
        timestamp: h.timestamp,
        attendance: h.performance.attendance,
        assignmentScore: h.performance.assignmentScore,
        quizScore: h.performance.quizScore,
        midtermScore: h.performance.midtermScore,
        previousResult: h.performance.previousResult,
        studyHoursPerDay: h.performance.studyHoursPerDay,
        extracurricularActivities: h.performance.extracurricularActivities,
        predictedScore: h.prediction.predictedScore,
        grade: h.prediction.grade,
        riskLevel: h.prediction.riskLevel,
      });
    });

    combinedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setMarks(combinedData);
  }, [user.id]);

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade?.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade?.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskBadge = (risk: string) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700 border-green-200';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (marks.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 md:p-12 shadow-md text-center">
        <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No Marks Available</h3>
        <p className="text-sm md:text-base text-gray-500">Your marks will appear here once your teacher uploads them.</p>
      </div>
    );
  }

  const latestMark = marks[0];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl p-5 md:p-8 text-white shadow-lg">
        <h2 className="text-xl md:text-3xl font-bold mb-2">My Academic Record 📊</h2>
        <p className="text-blue-100 text-sm md:text-base">Your marks as entered by your teachers</p>
        <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
            <p className="text-blue-100 text-xs md:text-sm">Latest Score</p>
            <p className="text-2xl md:text-3xl font-bold">{latestMark.predictedScore}%</p>
          </div>
          <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
            <p className="text-blue-100 text-xs md:text-sm">Grade</p>
            <p className="text-2xl md:text-3xl font-bold">{latestMark.grade}</p>
          </div>
          <div className="bg-white/10 rounded-lg md:rounded-xl p-3 md:p-4">
            <p className="text-blue-100 text-xs md:text-sm">Risk</p>
            <p className="text-lg md:text-xl font-bold">{latestMark.riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Latest Marks Detail */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Latest Marks Breakdown
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mb-4">
          {format(new Date(latestMark.timestamp), 'MMMM dd, yyyy h:mm a')}
        </p>

        <div className="space-y-3 md:space-y-4">
          {/* Attendance */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">Attendance</span>
              <span className="text-xs md:text-sm font-bold text-gray-800">{latestMark.attendance}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
              <div
                className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ${getScoreBarColor(latestMark.attendance)}`}
                style={{ width: `${latestMark.attendance}%` }}
              />
            </div>
          </div>

          {/* Assignment Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">Assignment Score</span>
              <span className="text-xs md:text-sm font-bold text-gray-800">{latestMark.assignmentScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
              <div
                className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ${getScoreBarColor(latestMark.assignmentScore)}`}
                style={{ width: `${latestMark.assignmentScore}%` }}
              />
            </div>
          </div>

          {/* Quiz Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">Quiz Score</span>
              <span className="text-xs md:text-sm font-bold text-gray-800">{latestMark.quizScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
              <div
                className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ${getScoreBarColor(latestMark.quizScore)}`}
                style={{ width: `${latestMark.quizScore}%` }}
              />
            </div>
          </div>

          {/* Midterm Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">Midterm Score</span>
              <span className="text-xs md:text-sm font-bold text-gray-800">{latestMark.midtermScore}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
              <div
                className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ${getScoreBarColor(latestMark.midtermScore)}`}
                style={{ width: `${latestMark.midtermScore}%` }}
              />
            </div>
          </div>

          {/* Previous Result */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs md:text-sm font-medium text-gray-700">Previous Year</span>
              <span className="text-xs md:text-sm font-bold text-gray-800">{latestMark.previousResult}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3">
              <div
                className={`h-2.5 md:h-3 rounded-full transition-all duration-500 ${getScoreBarColor(latestMark.previousResult)}`}
                style={{ width: `${latestMark.previousResult}%` }}
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 md:mt-6 grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-gray-50 rounded-lg p-2 md:p-4 text-center">
            <p className="text-[10px] md:text-xs text-gray-500">Study Hrs/Day</p>
            <p className="text-lg md:text-xl font-bold text-gray-800">{latestMark.studyHoursPerDay}h</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 md:p-4 text-center">
            <p className="text-[10px] md:text-xs text-gray-500">Extracurricular</p>
            <p className="text-lg md:text-xl font-bold text-gray-800">{latestMark.extracurricularActivities}</p>
          </div>
          <div className={`rounded-lg p-2 md:p-4 text-center border ${getRiskBadge(latestMark.riskLevel)}`}>
            <p className="text-[10px] md:text-xs opacity-80">Risk</p>
            <p className="text-sm md:text-xl font-bold">{latestMark.riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Marks History */}
      {marks.length > 1 && (
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4">Marks History</h3>
          <div className="space-y-2 md:space-y-3">
            {marks.map((mark, index) => (
              <div
                key={mark.id}
                className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-xs md:text-sm">#{marks.length - index}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm md:text-base">
                      {format(new Date(mark.timestamp), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-500">
                      Att: {mark.attendance}% | Asg: {mark.assignmentScore}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-base md:text-lg font-bold text-gray-800">{mark.predictedScore}%</span>
                  <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold ${getGradeColor(mark.grade)}`}>
                    {mark.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
