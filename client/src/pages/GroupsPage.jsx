import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Assuming you use this for tokens
import axios from 'axios';

export default function GroupsPage() {
  const { token } = useAuthStore();
  const [groups, setGroups] = useState([]); // Start empty
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState('');
  const [joinedMessage, setJoinedMessage] = useState('');

  // 1. FETCH ACTUAL GROUPS FROM BACKEND
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Replace with your actual endpoint
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(data); 
      } catch (error) {
        // Fallback to sample data if API fails so you can still see the UI
        setGroups([
          { id: 1, name: 'Family Fund', members: 5, savings: 50000, goal: 100000, progress: 50, inviteCode: 'FAM123' },
          { id: 2, name: 'Office Chama', members: 8, savings: 75000, goal: 100000, progress: 75, inviteCode: 'OFF456' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [token]);

  const handleJoinGroup = async () => {
    if (!inviteCode) return;
    
    try {
      // Logic to join via API
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/groups/join`, 
        { code: inviteCode },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setJoinedMessage(`Successfully joined!`);
      // Refresh groups list after joining
      window.location.reload(); 
    } catch (error) {
      setJoinedMessage('Invalid invitation code or already a member');
    }
  };

  if (loading) return <div className="pt-28 text-center text-slate-500">Loading groups...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Groups</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and track your collective savings</p>
          </motion.div>

          <Link
            to="/groups/create"
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
          >
            + Create Group
          </Link>
        </div>

        {/* Join Section */}
        <div className="bg-white border border-slate-100 p-2 rounded-2xl shadow-sm mb-12 flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter invitation code..."
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="flex-1 px-6 py-3 bg-transparent outline-none text-slate-700 font-medium"
          />
          <button
            onClick={handleJoinGroup}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
          >
            Join Group
          </button>
        </div>

        {joinedMessage && (
          <p className="text-sm font-semibold mb-6 ml-2 text-indigo-600">{joinedMessage}</p>
        )}

        {/* Groups Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.length > 0 ? (
            groups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-slate-900">{group.name}</h3>
                  <span className="bg-slate-50 text-slate-400 text-[10px] font-bold px-2 py-1 rounded border border-slate-100">
                    {group.inviteCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 mb-6 font-medium">
                  <span>👥</span> <span>{group.members} members</span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Savings</span>
                    <span className="font-bold text-slate-900">KES {group.savings.toLocaleString()}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${group.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>{group.progress}% COMPLETE</span>
                    <span>GOAL: KES {group.goal.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No groups found. Create one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}