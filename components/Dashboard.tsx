
import React, { useMemo } from 'react';
import { Workout } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Clock, Flame, Calendar } from 'lucide-react';

interface DashboardProps {
  workouts: Workout[];
}

export const Dashboard: React.FC<DashboardProps> = ({ workouts }) => {
  const stats = useMemo(() => {
    const totalDuration = workouts.reduce((acc, w) => acc + w.duration, 0);
    const totalCalories = workouts.reduce((acc, w) => acc + w.calories, 0);
    
    // Simple streak calculation (mock)
    const streak = workouts.length > 0 ? Math.min(workouts.length, 7) : 0;

    return {
      count: workouts.length,
      duration: totalDuration,
      calories: totalCalories,
      streak
    };
  }, [workouts]);

  const chartData = useMemo(() => {
    // Group last 7 days (or just last 7 entries for demo)
    return workouts.slice(0, 7).reverse().map(w => ({
      name: new Date(w.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      duration: w.duration,
      calories: w.calories
    }));
  }, [workouts]);

  const pieData = useMemo(() => {
    const types: Record<string, number> = {};
    workouts.forEach(w => {
      types[w.type] = (types[w.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, value]) => ({ name, value }));
  }, [workouts]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
        <Activity size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-medium">还没有运动记录</h2>
        <p className="mt-2 text-sm text-slate-500">快去完成你的第一次运动打卡吧！</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">欢迎回来，运动健将！</h2>
        <p className="text-slate-500">这是你的个人运动成就看板</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="text-emerald-500" />} label="总训练量" value={stats.count} unit="次" />
        <StatCard icon={<Clock className="text-blue-500" />} label="总时长" value={stats.duration} unit="分钟" />
        <StatCard icon={<Flame className="text-orange-500" />} label="累计消耗" value={stats.calories} unit="千卡" />
        <StatCard icon={<Calendar className="text-purple-500" />} label="本周坚持" value={stats.streak} unit="天" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-700">最近运动趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="duration" fill="#10b981" radius={[4, 4, 0, 0]} name="时长 (分)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-slate-700">运动类型占比</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="bg-slate-50 p-3 rounded-xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">{value}</span>
        <span className="text-xs text-slate-400 font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const Activity = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);
