import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(data.user);
      } catch (error) {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, isAuthenticated]);

  const activeGroups = profile?.groups?.length || 0;
  const totalSavings = profile?.totalSavings || 0;
  const monthlyTarget = 25000;
  const progress = monthlyTarget > 0 ? Math.round((totalSavings / monthlyTarget) * 100) : 0;

  const stats = [
    { emoji: '👥', label: 'Active Groups', value: activeGroups.toString(), shadow: 'shadow-blue-100' },
    { emoji: '💳', label: 'Total Savings', value: `KES ${totalSavings.toLocaleString()}`, shadow: 'shadow-emerald-100' },
    { emoji: '📈', label: 'Monthly Target', value: `KES ${monthlyTarget.toLocaleString()}`, shadow: 'shadow-purple-100' },
    { emoji: '📊', label: 'Progress', value: `${progress}%`, shadow: 'shadow-orange-100' },
  ];

  const sampleData = [
    { month: 'Jan', savings: 5000, goal: 10000 },
    { month: 'Feb', savings: 8000, goal: 10000 },
    { month: 'Mar', savings: 12000, goal: 15000 },
    { month: 'Apr', savings: 15000, goal: 15000 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="text-indigo-600">{user?.fullName}!</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is your financial summary for this month.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white border border-slate-100 rounded-2xl p-6 shadow-sm ${stat.shadow} hover:shadow-md transition-all`}
            >
              <div className="flex flex-col">
                <span className="text-2xl mb-3">{stat.emoji}</span>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Savings Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800">Savings Progress</h2>
              <p className="text-sm text-slate-400">Monthly growth vs goals</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Line type="monotone" dataKey="savings" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="goal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Contribution Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800">Monthly Contributions</h2>
              <p className="text-sm text-slate-400">Total amount deposited</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="savings" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}