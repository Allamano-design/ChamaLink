import { motion } from 'framer-motion';
import { useState } from 'react';

export default function AdminPage() {
  // Mock data for graphs
  const growthData = [40, 70, 45, 90, 65, 80, 95]; // Active savings growth
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
          
          {/* Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Overview</h1>
              <p className="text-slate-500 font-medium mt-1">Platform-wide analytics and user management</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                Export Data
              </button>
              <button className="px-5 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                System Update
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Users', value: '1,284', grow: '+12%', icon: '👥' },
              { label: 'Active Groups', value: '86', grow: '+5%', icon: '📂' },
              { label: 'Platform Savings', value: '4.2M', grow: '+18%', icon: '💰' },
              { label: 'Daily Transactions', value: '312', grow: '-2%', icon: '⚡' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl">{stat.icon}</span>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.grow.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {stat.grow}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Savings Growth Chart (Visualized with Tailwind) */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Growth</h3>
                <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-0">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                </select>
              </div>
              
              <div className="relative h-64 flex items-end justify-between gap-2 px-2">
                {growthData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${val}%` }} 
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="w-full bg-indigo-600 rounded-t-xl relative overflow-hidden group-hover:bg-indigo-500 transition-colors"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent,rgba(255,255,255,0.2))]"></div>
                    </motion.div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{days[i]}</span>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-[110%] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none">
                      {val}k
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Logs Section */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200">
              <h3 className="text-xl font-black text-indigo-400 mb-8 tracking-widest uppercase text-center md:text-left">Live Activity</h3>
              <div className="space-y-6">
                {[
                  { user: "John D.", action: "Created Group", time: "2m ago" },
                  { user: "Alice M.", action: "Deposited KES 5k", time: "14m ago" },
                  { user: "System", action: "Payout Processed", time: "1h ago" },
                  { user: "Kevin K.", action: "New Registration", time: "3h ago" }
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <p className="text-white font-bold text-sm">{log.user}</p>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">{log.action}</p>
                    </div>
                    <span className="text-indigo-400 text-[10px] font-black">{log.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 text-xs font-black hover:bg-indigo-500/20 transition">
                View All Logs
              </button>
            </div>
          </div>

          {/* User Management Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50">
               <h3 className="text-xl font-black text-slate-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {['User', 'Role', 'Join Date', 'Status', 'Action'].map((h) => (
                      <th key={h} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "John Doe", email: "john@example.com", role: "Admin", date: "Jan 12, 2026", status: "Active" },
                    { name: "Jane Smith", email: "jane@smith.io", role: "User", date: "Feb 04, 2026", status: "Pending" },
                    { name: "Sam Wilson", email: "sam@chama.com", role: "User", date: "Mar 20, 2026", status: "Suspended" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.email}</p>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">{row.role}</td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">{row.date}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                          row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-indigo-600 font-bold text-sm hover:underline">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}