import { StudentPerformance, PredictionResult, WhatIfScenario } from '../types';

// Advanced ML-inspired prediction algorithm
export const predictPerformance = (
  performance: StudentPerformance,
  whatIf?: WhatIfScenario
): PredictionResult => {
  // Use what-if values if provided, otherwise use actual values
  const attendance = whatIf?.attendance ?? performance.attendance;
  const assignmentScore = whatIf?.assignmentScore ?? performance.assignmentScore;
  const quizScore = whatIf?.quizScore ?? performance.quizScore;
  const studyHoursPerDay = whatIf?.studyHoursPerDay ?? performance.studyHoursPerDay;

  // Weighted calculation with realistic coefficients
  const weights = {
    attendance: 0.15,
    assignment: 0.25,
    quiz: 0.20,
    midterm: 0.15,
    previous: 0.15,
    study: 0.10,
  };

  // Normalize study hours (assuming max 8 hours)
  const normalizedStudyHours = Math.min(studyHoursPerDay / 8, 1) * 100;

  let predictedScore =
    attendance * weights.attendance +
    assignmentScore * weights.assignment +
    quizScore * weights.quiz +
    performance.midtermScore * weights.midterm +
    performance.previousResult * weights.previous +
    normalizedStudyHours * weights.study;

  // Add bonus for extracurricular activities (max 5 points)
  const extracurricularBonus = Math.min(performance.extracurricularActivities * 1.5, 5);
  predictedScore += extracurricularBonus;

  // Apply non-linear adjustments for synergy effects
  if (attendance > 90 && assignmentScore > 85) {
    predictedScore += 2; // Consistency bonus
  }
  if (studyHoursPerDay > 5 && quizScore > 80) {
    predictedScore += 1.5; // Effort bonus
  }

  // Cap at 100
  predictedScore = Math.min(predictedScore, 100);

  // Determine grade
  const grade = getGrade(predictedScore);

  // Determine risk level
  const riskLevel = getRiskLevel(predictedScore, attendance, assignmentScore);

  // Calculate confidence score based on data completeness and consistency
  const confidenceScore = calculateConfidence(performance, whatIf);

  // Generate recommendations
  const recommendations = generateRecommendations(
    performance,
    predictedScore,
    attendance,
    assignmentScore,
    quizScore,
    studyHoursPerDay
  );

  // Identify strengths
  const strengths = identifyStrengths(
    attendance,
    assignmentScore,
    quizScore,
    performance.midtermScore,
    studyHoursPerDay
  );

  // Identify areas of improvement
  const areasOfImprovement = identifyAreasOfImprovement(
    attendance,
    assignmentScore,
    quizScore,
    performance.midtermScore,
    studyHoursPerDay
  );

  return {
    predictedScore: Math.round(predictedScore * 10) / 10,
    grade,
    riskLevel,
    recommendations,
    strengths,
    areasOfImprovement,
    confidenceScore,
  };
};

const getGrade = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const getRiskLevel = (
  score: number,
  attendance: number,
  assignmentScore: number
): 'Low' | 'Medium' | 'High' => {
  if (score >= 75 && attendance >= 85 && assignmentScore >= 75) return 'Low';
  if (score >= 60 && attendance >= 70 && assignmentScore >= 60) return 'Medium';
  return 'High';
};

const calculateConfidence = (
  performance: StudentPerformance,
  whatIf?: WhatIfScenario
): number => {
  let confidence = 85; // Base confidence

  // Reduce confidence for what-if scenarios
  if (whatIf) {
    confidence -= 10;
  }

  // Check data consistency
  const scores = [
    performance.assignmentScore,
    performance.quizScore,
    performance.midtermScore,
    performance.previousResult,
  ];
  const variance = calculateVariance(scores);

  // Lower variance = more predictable = higher confidence
  if (variance < 100) confidence += 10;
  else if (variance > 300) confidence -= 15;

  // Attendance consistency
  if (performance.attendance > 90) confidence += 5;
  else if (performance.attendance < 70) confidence -= 10;

  return Math.max(60, Math.min(95, confidence));
};

const calculateVariance = (scores: number[]): number => {
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
  return squaredDiffs.reduce((a, b) => a + b, 0) / scores.length;
};

const generateRecommendations = (
  performance: StudentPerformance,
  predictedScore: number,
  attendance: number,
  assignmentScore: number,
  quizScore: number,
  studyHours: number
): string[] => {
  const recommendations: string[] = [];

  if (attendance < 80) {
    recommendations.push(
      `🎯 Improve attendance to at least 90% (current: ${attendance.toFixed(1)}%). This can boost your score by 3-5 points.`
    );
  }

  if (assignmentScore < 75) {
    recommendations.push(
      `📚 Focus on completing assignments with higher quality. Target 85%+ to see significant improvement.`
    );
  }

  if (quizScore < 75) {
    recommendations.push(
      `✏️ Practice more quiz-style questions. Regular practice can improve quiz scores by 10-15 points.`
    );
  }

  if (studyHours < 3) {
    recommendations.push(
      `⏰ Increase daily study time to at least 4 hours. Consistent study habits lead to better retention.`
    );
  } else if (studyHours > 7) {
    recommendations.push(
      `🌟 Balance study time with breaks. Quality over quantity - focus on effective study techniques.`
    );
  }

  if (performance.extracurricularActivities < 2) {
    recommendations.push(
      `🎭 Consider joining 1-2 extracurricular activities. They improve cognitive skills and time management.`
    );
  }

  if (predictedScore >= 85) {
    recommendations.push(
      `🏆 Excellent performance! Keep up the momentum and consider helping peers to reinforce your knowledge.`
    );
  }

  return recommendations.slice(0, 4);
};

const identifyStrengths = (
  attendance: number,
  assignmentScore: number,
  quizScore: number,
  midtermScore: number,
  studyHours: number
): string[] => {
  const strengths: string[] = [];

  if (attendance >= 90) strengths.push('Excellent attendance record');
  if (assignmentScore >= 80) strengths.push('Strong assignment performance');
  if (quizScore >= 80) strengths.push('Good quiz performance');
  if (midtermScore >= 80) strengths.push('Strong midterm results');
  if (studyHours >= 4) strengths.push('Dedicated study habits');

  return strengths.length > 0 ? strengths : ['Showing potential for improvement'];
};

const identifyAreasOfImprovement = (
  attendance: number,
  assignmentScore: number,
  quizScore: number,
  midtermScore: number,
  studyHours: number
): string[] => {
  const areas: string[] = [];

  if (attendance < 80) areas.push('Class attendance');
  if (assignmentScore < 70) areas.push('Assignment completion');
  if (quizScore < 70) areas.push('Quiz preparation');
  if (midtermScore < 70) areas.push('Exam preparation');
  if (studyHours < 2) areas.push('Study time allocation');

  return areas.length > 0 ? areas : ['Continue current performance level'];
};
