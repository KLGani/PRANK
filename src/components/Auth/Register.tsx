import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User as UserIcon, GraduationCap, BookOpen, UserCircle } from 'lucide-react';
import { User } from '../../types';
import { storage } from '../../utils/storage';

interface RegisterProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [studentId, setStudentId] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [section, setSection] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (role === 'student' && (!studentId || !classLevel || !section)) {
      setError('Please fill in all student information');
      setIsLoading(false);
      return;
    }

    if (role === 'teacher' && (!teacherId || !subject)) {
      setError('Please fill in all teacher information');
      setIsLoading(false);
      return;
    }

    const existingUser = storage.getUsers().find(u => u.email === email);
    if (existingUser) {
      setError('An account with this email already exists');
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      ...(role === 'student' ? {
        studentId,
        class: classLevel,
        section,
      } : {
        teacherId,
        subject,
      }),
    };

    storage.saveUser(newUser, password);
    onRegister(newUser);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-3 md:mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-sm md:text-base text-gray-600">Join EduPredict to track and predict performance</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5 md:mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
            Sign Up
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 md:p-4 rounded-xl border-2 flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 ${
                    role === 'student'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-medium text-sm md:text-base">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`p-3 md:p-4 rounded-xl border-2 flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 ${
                    role === 'teacher'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-medium text-sm md:text-base">Teacher</span>
                </button>
              </div>
            </div>

            {/* Student-specific fields */}
            {role === 'student' && (
              <div className="p-4 bg-blue-50 rounded-xl space-y-4 animate-fade-in">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2 text-sm md:text-base">
                  <GraduationCap className="w-5 h-5" />
                  Student Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="STU001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Class</label>
                    <input
                      type="text"
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Section</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="A"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Teacher-specific fields */}
            {role === 'teacher' && (
              <div className="p-4 bg-purple-50 rounded-xl space-y-4 animate-fade-in">
                <h3 className="font-semibold text-purple-800 flex items-center gap-2 text-sm md:text-base">
                  <UserCircle className="w-5 h-5" />
                  Teacher Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                    <input
                      type="text"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="TCH001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Mathematics"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 font-semibold hover:underline active:text-blue-800"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
