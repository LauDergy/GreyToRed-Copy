import { useState } from 'react';
import bgLogin from '../assets/bg-login.png';
import logo from '../assets/LOGO.svg';

/**
 * LoginPage
 *
 * Props:
 *   onLogin: (role, user) => void
 *            user: { name, email, role, isProfileComplete }
 *            In production:
 *              - Login  → POST /api/auth/login  { email, password }
 *              - Signup → POST /api/auth/signup { email, password }
 *              - Google → POST /api/auth/google (OAuth redirect)
 *            Backend response includes isProfileComplete to gate the onboarding flow.
 */

const UNC_DOMAIN = '@unc.edu.ph';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
);

const LoginPage = ({ onLogin }) => {
    const [mode, setMode]     = useState('login'); // 'login' | 'signup'
    const [form, setForm]     = useState({ email: '', username: '', password: '', confirm: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    };

    const validateSignup = () => {
        const errs = {};
        if (!form.email.endsWith(UNC_DOMAIN))
            errs.email = `Email must end with ${UNC_DOMAIN}`;
        if (!form.username.trim())
            errs.username = 'Full name is required.';
        if (form.password.length < 8)
            errs.password = 'Password must be at least 8 characters.';
        if (form.password !== form.confirm)
            errs.confirm = 'Passwords do not match.';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'signup') {
            const errs = validateSignup();
            if (Object.keys(errs).length) { setErrors(errs); return; }
            // TODO: POST /api/auth/signup { email, password }
            // Backend creates record with isProfileComplete: false and returns user object.
            onLogin('student', {
                name:              form.username,
                email:             form.email,
                role:              'student',
                isProfileComplete: false,
            });
        } else {
            // TODO: POST /api/auth/login { email, password }
            // Backend returns { user, token } where user.isProfileComplete drives onboarding gate.
            onLogin('student', {
                name:              form.email.split('@')[0],
                email:             form.email,
                role:              'student',
                isProfileComplete: true,
            });
        }
    };

    const handleGoogle = () => {
        // TODO: Trigger Google OAuth redirect → GET /api/auth/google
        alert('Google Sign-In coming soon — will use OAuth 2.0 redirect.');
    };

    const switchMode = () => {
        setMode(m => m === 'login' ? 'signup' : 'login');
        setErrors({});
        setForm({ email: '', username: '', password: '', confirm: '' });
    };

    return (
        <div className="min-h-screen flex flex-col font-sans antialiased overflow-hidden relative">
            {/* Background photo */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${bgLogin})` }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Header bar */}
            <header className="relative z-10 h-14 bg-red-600 flex items-center justify-between px-8 shadow-lg">
                <img src={logo} alt="GreyToRed" className="h-8 w-auto object-contain" draggable={false} />
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => { setMode('login'); setErrors({}); }}
                        className={`text-sm font-semibold transition-colors ${mode === 'login' ? 'text-white' : 'text-red-200 hover:text-white'}`}
                    >Sign In</button>
                    <button
                        onClick={() => { setMode('signup'); setErrors({}); }}
                        className={`text-sm font-semibold transition-colors ${mode === 'signup' ? 'text-white' : 'text-red-200 hover:text-white'}`}
                    >Create Account</button>
                </div>
            </header>

            {/* Centered card */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-12 py-10 flex flex-col items-center">

                    <img src={logo} alt="GreyToRed" className="h-20 w-auto object-contain mb-6" draggable={false} />

                    {/* Google button */}
                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm hover:shadow transition-all mb-5 active:scale-[0.98]"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs font-medium text-slate-300">or</span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-slate-500 mb-1.5 font-medium">
                                {mode === 'signup' ? `UNC Email (must end in ${UNC_DOMAIN})` : 'Email'}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder={mode === 'signup' ? `yourname${UNC_DOMAIN}` : ''}
                                autoComplete="email"
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                                    errors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                }`}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Full name — signup only */}
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm text-slate-500 mb-1.5 font-medium">Full Name</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="e.g. John Laureles"
                                    className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                                        errors.username ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                    }`}
                                />
                                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-slate-500 mb-1.5 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                                    errors.password ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                }`}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm password — signup only */}
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-sm text-slate-500 mb-1.5 font-medium">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirm"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${
                                        errors.confirm ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                                    }`}
                                />
                                {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
                            </div>
                        )}

                        {errors.general && (
                            <p className="text-xs text-red-500 font-medium text-center">{errors.general}</p>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-bold text-white text-sm tracking-wide shadow-md transition-all active:scale-[0.98] mt-1"
                            style={{ background: 'linear-gradient(to right, #9CA3AF 0%, #EF4444 100%)' }}
                        >
                            {mode === 'login' ? 'Log In' : 'Create Account'}
                        </button>
                    </form>

                    <button onClick={switchMode} className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                        {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                    </button>

                    {/* Dev / Testing shortcuts */}
                    <div className="mt-8 w-full border-t border-slate-100 pt-6 space-y-2">
                        <p className="text-[10px] text-center font-bold uppercase tracking-widest text-slate-300 mb-3">
                            Testing shortcuts
                        </p>
                        <button
                            onClick={() => onLogin('student', { name: 'John Michael Laureles', email: 'john.laureles@unc.edu.ph', role: 'student', isProfileComplete: true })}
                            className="w-full py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 text-xs font-bold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                            Log in as Student
                        </button>
                        <button
                            onClick={() => onLogin('student', { name: 'New Student', email: 'new.student@unc.edu.ph', role: 'student', isProfileComplete: false })}
                            className="w-full py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 text-xs font-bold hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        >
                            New Student (Onboarding)
                        </button>
                        <button
                            onClick={() => onLogin('teacher', { name: 'Danny Casimero', email: 'danny.casimero@unc.edu.ph', role: 'teacher', isProfileComplete: true })}
                            className="w-full py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 text-xs font-bold hover:border-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all"
                        >
                            Log in as Teacher
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
