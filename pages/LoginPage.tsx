
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // DEMO ACCESS CHECK
        if (email === 'demo@manafeth.com' && password === 'demo123') {
            setTimeout(async () => {
                const { injectDemoData } = await import('../services/simulationService');
                injectDemoData();
                // Force reload to ensure DataContext picks up the new localStorage flags
                window.location.assign('/app');
            }, 1000);
            return;
        }

        // Simulate API Call
        setTimeout(() => {
            const mockUser = {
                id: '1',
                name: 'Majed Al-Saud',
                email: email,
                role: 'admin',
                token: 'mock-jwt-token'
            };

            localStorage.setItem('user', JSON.stringify(mockUser));

            // If they came from Diagnosis Guest Flow, we might want to preserve that?
            // For now, simple redirect.
            navigate('/app/dashboard');

            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-cairo" dir="rtl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100"
            >
                <div className="text-center mb-10">
                    <img src="/logo_full.png" alt="BiznesClinics" className="h-16 w-auto mx-auto mb-6 object-contain" />
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">تسجيل الدخول - بوابة المزودين</h1>
                    <p className="text-slate-500">مرحباً بك مجدداً في BiznesClinics</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'دخول'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-400">
                    ليس لديك حساب؟ <a href="/signup" className="text-blue-600 font-bold hover:underline">انشئ حساب جديد</a>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
