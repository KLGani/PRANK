import React, { useState } from 'react';
import { User } from '../../types';
// Student Dashboard - Shows marks entered by teachers (no manual entry)
import { Overview } from '../Student/Overview';
import { StudentMarks } from '../Student/StudentMarks';
import { WhatIfAnalysis } from '../Student/WhatIfAnalysis';
import { LayoutDashboard, BookOpen, Lightbulb, LogOut, X, Menu } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type Tab = 'overview' | 'marks' | 'whatif';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showMenu, setShowMenu] = useState(false);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'marks' as Tab, label: 'My Marks', icon: BookOpen },
    { id: 'whatif' as Tab, label: 'What-If', icon: Lightbulb },
  ];

  const getTabLabel = () => {
    return tabs.find(t => t.id === activeTab)?.label || 'Overview';
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-lg">E</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-800">EduPredict</h1>
              <p className="text-xs md:text-sm text-gray-600">Student Portal</p>
            </div>
          </div>
          
          {/* Desktop User Info & Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-600">
                {'studentId' in user ? `ID: ${(user as any).studentId}` : user.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile Slide Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
              <span className="font-semibold text-gray-800">Menu</span>
              <button onClick={() => setShowMenu(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => { onLogout(); setShowMenu(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {activeTab === 'overview' && <Overview user={user} />}
        {activeTab === 'marks' && <StudentMarks user={user} />}
        {activeTab === 'whatif' && <WhatIfAnalysis user={user} />}
      </main>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 min-w-[70px] transition-all ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-blue-100' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
