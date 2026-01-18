
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, ChevronRight } from 'lucide-react';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simulate Secure Auth
        setTimeout(() => {
            if (email === 'admin@monafsat.com' && password === 'admin123') {
                const adminUser = {
                    id: 'admin-1',
                    name: 'Super Admin',
                    email: email,
                    role: 'admin',
                    token: 'secure-admin-token-xyz'
                };
                localStorage.setItem('user', JSON.stringify(adminUser));
                navigate('/admin');
            } else {
                setError('بيانات الدخول غير صحيحة');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 font-cairo" dir="rtl">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-inner">
                        <Shield className="text-emerald-500" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">بوابة المشرفين</h1>
                    <p className="text-slate-400 text-sm">مجال مخصص للمسؤولين فقط</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm font-bold border border-red-500/20 text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            placeholder="admin@monafsat.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-slate-900 rounded-xl border border-slate-700 text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>دخول آمن</span>
                                <ChevronRight className="group-hover:-translate-x-1 transition-transform" size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate('/')} className="text-slate-500 text-sm hover:text-white transition-colors">
                        العودة للرئيسية
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoginPage;
