import React, { useState, useEffect } from 'react';
import { GraduationCap, PlayCircle, CheckCircle2, Clock, BookOpen, Plus, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LmsPage() {
  const { currentRole } = useAuth();
  const isEmployee = currentRole === 'employee';

  const [courses, setCourses] = useState([
    {
      _id: 'c1',
      title: 'ISO 27001 Security & Data Compliance',
      category: 'Compliance',
      duration: '1h 30m',
      modulesCount: 6,
      progress: 75
    },
    {
      _id: 'c2',
      title: 'Modern UI/UX Glassmorphism Principles',
      category: 'Design',
      duration: '2h 15m',
      modulesCount: 8,
      progress: 100
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Compliance');
  const [duration, setDuration] = useState('2h 00m');
  const [modulesCount, setModulesCount] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch courses from server API
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
      }
    } catch (e) {
      // Fallback to initial state
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          duration,
          modulesCount: Number(modulesCount),
          progress: 0
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(prev => [data, ...prev]);
      } else {
        setCourses(prev => [{ _id: String(Date.now()), title, category, duration, modulesCount: Number(modulesCount), progress: 0 }, ...prev]);
      }
    } catch (err) {
      setCourses(prev => [{ _id: String(Date.now()), title, category, duration, modulesCount: Number(modulesCount), progress: 0 }, ...prev]);
    } finally {
      setIsSubmitting(false);
      setShowCreateModal(false);
      setTitle('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-cyan-950/70 via-slate-900/80 to-indigo-950/70 border border-cyan-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-cyan-400" /> Learning Management System
            </span>
            {isEmployee && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Assigned Employee Portal
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-white">Nova Learning Academy</h2>
          <p className="text-xs text-slate-300 mt-0.5">Empower employees with self-paced onboarding and upskilling courses.</p>
        </div>

        {/* Hide Create Module button for Employee ESS */}
        {!isEmployee ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-cyan-glow"
          >
            <Plus className="w-4 h-4 text-cyan-300" /> Create Training Module
          </button>
        ) : (
          <span className="text-xs font-bold text-slate-400 px-3 py-1.5 rounded-xl glass-panel border border-white/10">
            Read-Only Employee View
          </span>
        )}
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, idx) => (
          <div key={course._id || idx} className="p-5 rounded-2xl glass-card space-y-4 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {course.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> {course.duration}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm leading-snug">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{course.modulesCount || course.modules || 6} Interactive Video Modules</p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-400">{course.progress || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${course.progress || 0}%` }}></div>
                </div>
              </div>

              <button
                onClick={() => alert(`Starting LMS Course: "${course.title}"`)}
                className="w-full py-2 rounded-xl glass-panel text-xs font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-2 hover:border-cyan-500/40 transition-all"
              >
                <PlayCircle className="w-4 h-4" /> {course.progress === 100 ? 'Review Course' : 'Start Module'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Training Module Modal (HR & Admin Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-cyan-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Create New Training Module</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. ISO 27001 Data Privacy & Security"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold mb-1 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Compliance" className="bg-slate-900">Compliance</option>
                  <option value="Engineering" className="bg-slate-900">Engineering</option>
                  <option value="Design" className="bg-slate-900">Design</option>
                  <option value="Leadership" className="bg-slate-900">Leadership</option>
                  <option value="HR Policies" className="bg-slate-900">HR Policies</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2h 30m"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-semibold mb-1 block">Modules Count</label>
                  <input
                    type="number"
                    min="1"
                    value={modulesCount}
                    onChange={(e) => setModulesCount(e.target.value)}
                    className="w-full p-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white flex items-center justify-center gap-2 mt-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" /> Publish Training Course
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
