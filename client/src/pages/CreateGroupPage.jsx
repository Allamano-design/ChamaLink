import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function CreateGroupPage() {
  const { user } = useAuthStore(); // Get the current user
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    contributionAmount: '',
    contributionFrequency: 'monthly',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const existingGroups = JSON.parse(localStorage.getItem('my_savings_groups') || '[]');
      
      const newGroup = {
        id: Date.now(),
        adminId: user?.id || user?._id, // LINKING THE ADMIN
        name: formData.name,
        description: formData.description,
        members: 1,
        savings: 0,
        goal: Number(formData.targetAmount),
        progress: 0,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        contributionAmount: formData.contributionAmount,
        frequency: formData.contributionFrequency,
        createdAt: new Date().toLocaleDateString()
      };

      const updatedGroups = [...existingGroups, newGroup];
      localStorage.setItem('my_savings_groups', JSON.stringify(updatedGroups));

      toast.success('Group created! You are now the Admin.');
      
      setTimeout(() => {
        navigate(`/groups/${newGroup.id}`); // Direct to the new group
      }, 800);
      
    } catch (error) {
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Create a <span className="text-indigo-600">Savings Group</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">You will be the administrator of this group.</p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Group Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Vacation 2026 Fund" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900" required />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Purpose</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What are we saving for?" rows="3" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900 resize-none" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Target Goal (KES)</label>
                  <input type="number" name="targetAmount" value={formData.targetAmount} onChange={handleChange} placeholder="100,000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Contribution (KES)</label>
                  <input type="number" name="contributionAmount" value={formData.contributionAmount} onChange={handleChange} placeholder="5,000" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-slate-900" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]">
                {loading ? 'Initializing...' : '🚀 Launch Group'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}