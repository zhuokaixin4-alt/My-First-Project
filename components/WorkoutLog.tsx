
import React, { useState } from 'react';
import { Workout, WorkoutType } from '../types';
// Correct: Removed .tsx extension from import
import { WORKOUT_TYPES } from '../constants';
import { Trash2, Plus, History, ChevronRight } from 'lucide-react';

interface WorkoutLogProps {
  workouts: Workout[];
  onAdd: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

export const WorkoutLog: React.FC<WorkoutLogProps> = ({ workouts, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Running' as WorkoutType,
    duration: 30,
    calories: 200,
    intensity: 'Medium' as 'Low' | 'Medium' | 'High',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWorkout: Workout = {
      id: crypto.randomUUID(),
      ...formData,
      date: new Date().toISOString(),
    };
    onAdd(newWorkout);
    setShowForm(false);
    // Reset form
    setFormData({
      type: 'Running',
      duration: 30,
      calories: 200,
      intensity: 'Medium',
      notes: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">运动记录</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-emerald-100"
        >
          {showForm ? '取消打卡' : (
            <><Plus size={20} /><span>新打卡</span></>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">运动类型</label>
              <div className="grid grid-cols-3 gap-2">
                {WORKOUT_TYPES.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      formData.type === type.value 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{type.icon}</span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">训练时长 (分钟)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">消耗热量 (千卡)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.calories}
                  onChange={e => setFormData({ ...formData, calories: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">运动强度</label>
                <select
                  value={formData.intensity}
                  onChange={e => setFormData({ ...formData, intensity: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Low">低强度 (轻松)</option>
                  <option value="Medium">中强度 (出汗)</option>
                  <option value="High">高强度 (力竭)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">备注</label>
            <textarea
              placeholder="今天的感觉如何？"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-100"
          >
            完成并打卡
          </button>
        </form>
      )}

      {/* History List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-400 mb-2">
          <History size={18} />
          <span className="text-sm font-medium uppercase tracking-wider">历史记录</span>
        </div>
        {workouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 border-dashed">
            <p className="text-slate-400">尚无打卡数据</p>
          </div>
        ) : (
          workouts.map(workout => (
            <div key={workout.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  {WORKOUT_TYPES.find(t => t.value === workout.type)?.icon || '🔥'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    {WORKOUT_TYPES.find(t => t.value === workout.type)?.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      workout.intensity === 'High' ? 'bg-red-50 text-red-600' :
                      workout.intensity === 'Medium' ? 'bg-orange-50 text-orange-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {workout.intensity === 'High' ? '高' : workout.intensity === 'Medium' ? '中' : '低'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">{new Date(workout.date).toLocaleString('zh-CN')}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-slate-700">{workout.duration} 分钟</p>
                  <p className="text-xs text-slate-400">{workout.calories} kcal</p>
                </div>
                <button 
                  onClick={() => onDelete(workout.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
