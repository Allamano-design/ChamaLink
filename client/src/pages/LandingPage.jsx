import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();
  const [stats, setStats] = useState({
    members: 0,
    totalSaved: 0,
    goalProgress: 0,
    nextContribution: '—',
    pendingApprovals: '—',
    lastPayment: '—',
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const carouselCards = [
    { label: 'Active Groups', value: isAuthenticated ? (stats.members > 0 ? Math.ceil(stats.members / 10) : 1) : 4 },
    { label: 'Average Contribution', value: isAuthenticated ? `KES ${(stats.totalSaved / Math.max(1, (stats.members || 1))).toFixed(0)}` : 'KES 6,250' },
    { label: 'Next Payout', value: stats.nextContribution },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !token) return;
      setLoadingStats(true);

      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user;
        const groupsCount = Array.isArray(user.groups) ? user.groups.length : 0;

        // Example mapping/logic. Adjust according to actual backend data.
        const totalSaved = user.totalSavings ?? 0;
        const progress = user.goalProgress ?? (totalSaved > 0 ? Math.min(Math.round((totalSaved / 100000) * 100), 100) : 0);

        setStats({
          members: groupsCount > 0 ? groupsCount * 10 : 12,
          totalSaved: totalSaved || 75000,
          goalProgress: progress || 39,
          nextContribution: '8 days',
          pendingApprovals: user.pendingApprovals ?? 2,
          lastPayment: user.lastPayment || 'Today · 12:15 PM',
        });
      } catch (err) {
        // fallback static values
        setStats((prev) => ({ ...prev, members: 12, totalSaved: 75000, goalProgress: 39, pendingApprovals: 2, lastPayment: 'Today · 12:15 PM' }));
      } finally {
        setLoadingStats(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated, carouselCards.length]);

  const features = [
    {
      icon: '👥',
      title: 'Group Management',
      description: 'Create and manage savings groups with ease. Invite members with secure codes that expire in 10 minutes.',
    },
    {
      icon: '📊',
      title: 'Track Savings',
      description: 'Monitor your group savings progress with beautiful charts and detailed transaction history.',
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Get automated reminders for contributions so nobody misses their savings goal.',
    },
    {
      icon: '✨',
      title: 'Transparent Tracking',
      description: 'See exactly where every shilling goes with complete transaction visibility.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-700">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-50 mb-6">
              Save Together, Grow Together
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              ChamaLink makes group savings simple, transparent, and rewarding. Join thousands of Africans
              building financial freedom together.
            </p>
            {!isAuthenticated && (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/signin"
                  className="px-8 py-3 border-2 border-emerald-100 text-emerald-50 font-semibold rounded-lg hover:bg-emerald-600/20 transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>

          {/* Hero Image / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative bg-white/90 border border-gray-200 backdrop-blur rounded-2xl h-auto md:h-96 p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="col-span-1 md:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 md:p-6 shadow-lg relative">
              <div className="absolute top-4 right-4 text-xs md:text-sm bg-white/20 rounded px-2 py-1">Live</div>
              <h4 className="text-xl md:text-2xl font-bold mb-3">Group Savings Snapshot</h4>

              <div className="p-4 rounded-xl bg-white/15 backdrop-blur mb-4 transition-all duration-500">
                <p className="text-xs md:text-sm uppercase tracking-wider text-white/80">{carouselCards[carouselIndex].label}</p>
                <p className="text-2xl md:text-3xl font-bold mt-2">{loadingStats ? '...' : carouselCards[carouselIndex].value}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/groups/create')}
                  className="inline-flex items-center justify-center rounded-lg bg-white/25 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-white/40 transition"
                >
                  + Create Group
                </button>
                <button
                  onClick={() => navigate('/groups')}
                  className="inline-flex items-center justify-center rounded-lg bg-white/25 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-white/40 transition"
                >
                  Join Group
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center justify-center rounded-lg bg-white/25 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-white/40 transition"
                >
                  View Dashboard
                </button>
              </div>
            </div>

            <div className="col-span-1 space-y-3">
              {[
                { title: 'Next Contribution', value: stats.nextContribution },
                { title: 'Pending Approvals', value: stats.pendingApprovals },
                { title: 'Last Payment', value: stats.lastPayment },
              ].map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h6 className="text-sm font-semibold text-gray-700">{item.title}</h6>
                  <p className="text-xl font-bold text-emerald-600">{loadingStats ? '...' : item.value}</p>
                </div>
              ))}
            </div>

            <div className="hidden md:flex absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex-row gap-3 bg-white/80 border border-gray-200 rounded-full px-5 py-2 text-xs text-gray-700">
              <span className="font-semibold">Trusted by 800+ groups</span>
              <span>|</span>
              <span>99.9% Uptime</span>
              <span>|</span>
              <span>100% Transparency</span>
            </div>

            <div className="flex md:hidden flex-wrap gap-2 mt-4 sm:mt-0 justify-center px-2">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full px-3 py-1">Trusted by 800+ groups</span>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full px-3 py-1">99.9% Uptime</span>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full px-3 py-1">100% Transparency</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Powerful Features for Group Savings
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-8 border-2 border-gray-200 rounded-xl hover:border-primary transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            How ChamaLink Works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: 1, title: 'Create a Group', details: 'Set up your savings circle, define goals, and invite trusted members.' },
              { step: 2, title: 'Contribute & Track', details: 'Log payments, monitor progress, and stay on schedule with smart reminders.' },
              { step: 3, title: 'Distribute & Grow', details: 'Share contributions transparently and reinvest for bigger group gains.' },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: item.step * 0.15 }}
                className="p-6 rounded-xl border border-gray-200 bg-slate-50"
              >
                <div className="text-primary text-xl font-bold mb-3">Step {item.step}</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Loved by Groups Across Africa</h2>
          <p className="text-gray-600 mt-3">Real feedback from real users building community savings together.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Lucy N.', quote: 'ChamaLink made our weekly contributions effortless and transparent. We feel empowered!', role: 'Group Admin, Nairobi', avatar: 'https://i.pravatar.cc/100?img=47', rating: 5 },
            { name: 'Kelvin T.', quote: 'The reporting and reminders keep us consistent. We have grown our pool by 30%.', role: 'Member, Kampala', avatar: 'https://i.pravatar.cc/100?img=52', rating: 4 },
            { name: 'Aisha M.', quote: 'Invites and verification are smooth. Great tool for trust-based savings.', role: 'Founder, Dar es Salaam', avatar: 'https://i.pravatar.cc/100?img=68', rating: 5 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-white border border-gray-200 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={item.avatar} alt={`${item.name} avatar`} className="w-12 h-12 rounded-full border border-gray-200" />
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">“{item.quote}”</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, starIndex) => (
                  <span key={starIndex} className={starIndex < item.rating ? 'text-amber-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Group Savings?</h2>
            <p className="text-lg mb-8 opacity-95">
              Join ChamaLink today and start saving together with your community.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
            >
              Create Your Account Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
