
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { WorkoutLog } from './components/WorkoutLog';
import { AICoach } from './components/AICoach';
import { Workout } from './types';
// Correct: Import STORAGE_KEY from constants, not types
import { STORAGE_KEY } from './constants';
import { Activity, LayoutDashboard, MessageSquare, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setWorkouts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse workouts", e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout: Workout) => {
    setWorkouts(prev => [workout, ...prev]);
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
        {/* Navigation Sidebar */}
        <nav className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-4 sticky top-0 md:h-screen z-10">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-emerald-500 p-2 rounded-xl">
              <Activity className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">FitPulse</h1>
          </div>

          <div className="space-y-1">
            <NavLink to="/" icon={<LayoutDashboard size={20} />} label="仪表盘" />
            <NavLink to="/log" icon={<PlusCircle size={20} />} label="运动打卡" />
            <NavLink to="/coach" icon={<MessageSquare size={20} />} label="AI 教练" />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard workouts={workouts} />} />
            <Route path="/log" element={<WorkoutLog workouts={workouts} onAdd={addWorkout} onDelete={deleteWorkout} />} />
            <Route path="/coach" element={<AICoach workouts={workouts} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-emerald-50 text-emerald-600 font-medium' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;
