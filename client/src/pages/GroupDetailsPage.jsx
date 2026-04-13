import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export default function GroupDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const savedGroups = JSON.parse(localStorage.getItem('my_savings_groups') || '[]');
    const foundGroup = savedGroups.find(g => g.id.toString() === id.toString());
    setGroup(foundGroup || null);
  }, [id]);

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-bold">
        Group not found
      </div>
    );
  }

  // Check if current user is the group admin
  const isOwner = group.adminId === (user?.id || user?._id);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Main Hero Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{group.name}</h1>
                <p className="text-slate-500 font-medium max-w-lg">{group.description || 'Collective savings toward a shared goal.'}</p>
              </div>
              <div className="flex gap-2">
                {isOwner && (
                  <span className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">
                    👑 Group Admin
                  </span>
                )}
                <span className="px-4 py-2 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200">
                  Code: {group.inviteCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</p>
                <p className="text-3xl font-black text-slate-900">{group.members}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saved</p>
                <p className="text-3xl font-black text-indigo-600">KES {group.savings.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target</p>
                <p className="text-3xl font-black text-slate-900">KES {group.goal.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                <p className="text-3xl font-black text-slate-900">{group.progress}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-10">
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${group.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-indigo-600 h-full rounded-full shadow-lg shadow-indigo-200"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Contributions</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95">
                  Make Payment
                </button>
                <button className="flex-1 py-4 bg-slate-50 text-slate-900 border border-slate-200 font-black rounded-2xl hover:bg-slate-100 transition active:scale-95">
                  View History
                </button>
              </div>
            </div>

            {/* Admin/Info Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-6">Group Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-50">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-tight">Frequency</span>
                  <span className="text-sm font-black text-slate-900 capitalize">{group.frequency}</span>
                </div>
                {isOwner && (
                  <button className="w-full py-4 mt-2 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-rose-600 transition shadow-xl">
                    Edit Group Settings
                  </button>
                )}
                {!isOwner && (
                  <button className="w-full py-4 mt-2 bg-rose-50 text-rose-500 text-xs font-black rounded-2xl hover:bg-rose-100 transition">
                    Leave Group
                  </button>
                )}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}