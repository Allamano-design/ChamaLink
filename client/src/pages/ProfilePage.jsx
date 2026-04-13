import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { token, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });

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
        setFormData({
          fullName: data.user.fullName || '',
          phoneNumber: data.user.phoneNumber || '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, isAuthenticated]);

  const memberSince = profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2026';

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(prev => ({ ...prev, ...data.user }));
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('profilePicture', file);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/upload-profile-picture`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setProfile(prev => ({ ...prev, profilePicture: data.profilePicture }));
      toast.success('Profile picture updated!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your personal information and preferences</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg active:scale-95"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Left Column: Avatar Card */}
            <div className="md:col-span-4">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 text-center">
                <div className="relative inline-block group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-indigo-50 bg-slate-100 flex items-center justify-center text-5xl">
                    {profile?.profilePicture ? (
                      <img
                        src={`http://localhost:5000${profile.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="grayscale opacity-50">👤</span>
                    )}
                  </div>
                  
                  <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 active:scale-90">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "📷"}
                  </label>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{profile?.fullName}</h2>
                  <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-1">Verified Member</p>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Since</span>
                      <span className="text-slate-900 font-bold">{memberSince}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Groups</span>
                      <span className="text-slate-900 font-bold">{profile?.groups?.length || 0} Joined</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Column: Information Fields */}
            <div className="md:col-span-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Field Wrapper Component would go here, mapped below */}
                  {[
                    { label: 'Full Name', value: profile?.fullName, icon: '👤', field: 'fullName' },
                    { label: 'Email Address', value: profile?.email, icon: '✉️', field: null },
                    { label: 'Phone Number', value: profile?.phoneNumber || 'Not provided', icon: '📱', field: 'phoneNumber' },
                    { label: 'Total Savings', value: `KES ${profile?.totalSavings?.toLocaleString() || '0'}`, icon: '💰', field: null },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {item.label}
                      </label>
                      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${
                        isEditing && item.field 
                        ? 'border-indigo-600 bg-white ring-4 ring-indigo-50' 
                        : 'border-slate-100 bg-slate-50/50'
                      }`}>
                        <span className="text-lg opacity-70">{item.icon}</span>
                        {isEditing && item.field ? (
                          <input
                            type="text"
                            name={item.field}
                            value={formData[item.field]}
                            onChange={handleFormChange}
                            className="bg-transparent w-full font-bold text-slate-900 outline-none"
                          />
                        ) : (
                          <p className="font-bold text-slate-900">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 mt-10 pt-10 border-t border-slate-50"
                  >
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50"
                    >
                      {saving ? 'Processing...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition active:scale-95"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}

                {!isEditing && (
                   <div className="mt-10 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between overflow-hidden relative group">
                      <div className="relative z-10">
                         <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Active Balance</p>
                         <p className="text-2xl font-black">KES {profile?.totalSavings?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center relative z-10">
                         📊
                      </div>
                      {/* Decorative circle */}
                      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/40 transition-all duration-700"></div>
                   </div>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}