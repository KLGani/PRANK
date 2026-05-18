export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
}

export interface Student extends User {
  studentId: string;
  class: string;
  section: string;
}

export interface Teacher extends User {
  teacherId: string;
  subject: string;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  email: string;
  class: string;
  section: string;
  attendance: number;
  assignmentScore: number;
  quizScore: number;
  midtermScore: number;
  previousResult: number;
  studyHoursPerDay: number;
  extracurricularActivities: number;
  timestamp: string;
}

export interface PredictionResult {
  predictedScore: number;
  grade: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  recommendations: string[];
  strengths: string[];
  areasOfImprovement: string[];
  confidenceScore: number;
}

export interface WhatIfScenario {
  attendance?: number;
  assignmentScore?: number;
  quizScore?: number;
  studyHoursPerDay?: number;
}

export interface HistoryEntry {
  id: string;
  studentId: string;
  performance: StudentPerformance;
  prediction: PredictionResult;
  timestamp: string;
}

export interface ClassData {
  className: string;
  section: string;
  totalStudents: number;
  averageScore: number;
  students: StudentPerformance[];
}
