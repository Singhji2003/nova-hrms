import React, { useState } from 'react';
import { Sparkles, Briefcase, ChevronRight, CheckCircle, FileText, UserPlus, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AtsPipeline() {
  const [candidates, setCandidates] = useState([
    { id: 'c1', name: 'Sophia Martinez', role: 'Senior React Developer', stage: 'Interview', match: 96, skills: ['React', 'TypeScript', 'Tailwind', 'GraphQL'], exp: '6 Years' },
    { id: 'c2', name: 'Liam Gallagher', role: 'DevOps Engineer', stage: 'Screening', match: 89, skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform'], exp: '4 Years' },
    { id: 'c3', name: 'Aria Montgomery', role: 'Staff Product Designer', stage: 'Offered', match: 98, skills: ['Figma', 'Glassmorphism', 'Framer'], exp: '7 Years' },
    { id: 'c4', name: 'James Wilson', role: 'Backend Node.js Lead', stage: 'Applied', match: 91, skills: ['Node.js', 'MongoDB', 'Express', 'Redis'], exp: '5 Years' },
  ]);

  const stages = ['Applied', 'Screening', 'Interview', 'Offered'];

  const moveStage = (id, currentStage) => {
    const nextIdx = (stages.indexOf(currentStage) + 1) % stages.length;
    const nextStage = stages[nextIdx];
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: nextStage } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-card bg-gradient-to-r from-violet-950/80 via-slate-900/80 to-indigo-950/80 border border-violet-500/30 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" /> AI-Powered ATS Engine
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Talent Acquisition & Candidate Kanban</h2>
          <p className="text-xs text-slate-300 mt-1">Automatic resume parsing with AI Match Score algorithms.</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass-button text-xs font-bold text-white">
          <UserPlus className="w-4 h-4" /> Post New Job Requisition
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stageName) => {
          const stageCandidates = candidates.filter(c => c.stage === stageName);
          return (
            <div key={stageName} className="p-4 rounded-2xl glass-card border border-white/10 space-y-3 min-h-[500px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-bold text-xs text-white uppercase tracking-wider">{stageName}</span>
                <span className="text-xs font-bold text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/20">
                  {stageCandidates.length}
                </span>
              </div>

              <div className="space-y-3">
                {stageCandidates.map((cand) => (
                  <motion.div
                    key={cand.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl glass-panel space-y-3 border border-white/5 hover:border-violet-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-violet-300 transition-colors">{cand.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cand.role} • {cand.exp}</p>
                      </div>

                      {/* AI Match Badge */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-300" /> {cand.match}% AI Match
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {cand.skills.map((skill, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <button
                        onClick={() => moveStage(cand.id, cand.stage)}
                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        Advance Stage <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
