import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showAdminLock, setShowAdminLock] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleAdminAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isAdminRegister ? '/auth/admin-register' : '/auth/admin-login';

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, 
        { password: adminPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setShowAdminLock(false);
        setAdminPass('');
        toast.success(isAdminRegister ? 'Admin Account Initialized' : 'Access Granted');
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('isAdminAuthenticated');
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-black">C</span>
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">ChamaLink</span>
          </Link>

          {/* DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/dashboard') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</Link>
                <Link to="/groups" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/groups') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}>Groups</Link>
                <Link to="/profile" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive('/profile') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-900'}`}>{user?.fullName?.split(' ')[0]}</Link>
                <div className="h-6 w-[1px] bg-slate-200 mx-3"></div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowAdminLock(true)} className="px-5 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl shadow-xl hover:bg-rose-600 transition-all">Admin Panel</button>
                  <button onClick={handleLogout} className="px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/signin" className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition">Sign In</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg hover:bg-indigo-700 transition">Get Started</Link>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-50 text-slate-900"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-bold text-slate-700 bg-slate-50">Dashboard</Link>
                  <Link to="/groups" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-bold text-slate-700">Groups</Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl font-bold text-slate-700">Profile Settings</Link>
                  <button onClick={() => { setShowAdminLock(true); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl font-bold text-indigo-600">Admin Panel</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl font-bold text-rose-500">Logout</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-2">
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 font-bold text-slate-600 bg-slate-50 rounded-xl">Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="text-center py-3 font-bold text-white bg-indigo-600 rounded-xl">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN MODAL (Keep as is) */}
      <AnimatePresence>
        {showAdminLock && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdminLock(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl border border-slate-100">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isAdminRegister ? 'Create Admin' : 'Secure Entry'}</h2>
              </div>
              <form onSubmit={handleAdminAction} className="space-y-6">
                <input type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)} placeholder="Master Password" flex className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg">Verify</button>
                <button type="button" onClick={() => setShowAdminLock(false)} className="w-full py-2 text-slate-400 font-bold text-xs">Go Back</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}