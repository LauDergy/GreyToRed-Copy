import { useState } from 'react';
import logo from '../assets/LOGO.svg';
import { ArrowRight, User, BookOpen, Hash } from 'lucide-react';

const YEAR_LEVELS = ['1st year', '2nd year', '3rd year', '4th year'];
const COURSES = ['BSCS', 'BSIT', 'BSIS', 'BSECE', 'BSCpE', 'Other'];

/**
 * OnboardingPage
 *
 * Shown immediately after a user's first-ever login when isProfileComplete === false.
 * Collects: studentId, yearLevel, course.
 *
 * Props:
 *   user:       { name, email, role }  — from the auth response
 *   onComplete: (profileData) => void
 *               profileData: { studentId, yearLevel, course }
 *               In production: PATCH /api/users/me { studentId, yearLevel, course, isProfileComplete: true }
 */
const OnboardingPage = ({ user, onComplete }) => {
    const initialFirstName = user?.name?.split(' ')[0] ?? '';
    const initialLastName = user?.name?.split(' ').slice(1).join(' ') ?? '';

    const [form, setForm] = useState({ firstName: initialFirstName, lastName: initialLastName, studentId: '', yearLevel: '', course: '' });
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1); // 1 = intro, 2 = form

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim())      errs.firstName  = 'First name is required.';
        if (!form.lastName.trim())       errs.lastName   = 'Last name is required.';
        if (!form.studentId.trim())      errs.studentId  = 'Student ID is required.';
        else if (!/^\d{2}-\d{4,5}$/.test(form.studentId.trim()))
                                          errs.studentId  = 'Format: 25-29019';
        if (!form.yearLevel)             errs.yearLevel  = 'Select your year level.';
        if (!form.course)                errs.course     = 'Select your course.';
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        // TODO: PATCH /api/users/me { firstName, lastName, studentId, yearLevel, course, isProfileComplete: true }
        onComplete({ 
            firstName: form.firstName.trim(), 
            lastName: form.lastName.trim(), 
            studentId: form.studentId.trim(), 
            yearLevel: form.yearLevel, 
            course: form.course 
        });
    };

    const firstName = user?.name?.split(' ')[0] ?? 'there';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex flex-col items-center justify-center px-4 font-sans antialiased">

            {/* Card */}
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Top accent strip */}
                <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #9CA3AF, #EF4444)' }} />

                <div className="px-10 py-10">
                    {/* Logo */}
                    <img src={logo} alt="GreyToRed" className="h-12 w-auto object-contain mb-8" draggable={false} />

                    {step === 1 ? (
                        /* ── Intro step ───────────────────────────────── */
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Welcome</p>
                                <h1 className="text-3xl font-light text-slate-800 tracking-tight">
                                    Hi, <span className="font-semibold">{firstName}</span> 👋
                                </h1>
                                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                    Before we take you to your dashboard, we need a few details to set up your profile. It only takes a moment.
                                </p>
                            </div>

                            {/* Info preview */}
                            <div className="bg-slate-50 rounded-2xl px-5 py-4 space-y-2.5 border border-slate-100">
                                <InfoRow icon={<Hash size={14} />}      label="Student ID"    hint="e.g. 25-29019" />
                                <InfoRow icon={<User size={14} />}      label="Year Level"    hint="e.g. 1st year" />
                                <InfoRow icon={<BookOpen size={14} />}  label="Course"        hint="e.g. BSCS" />
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm tracking-wide shadow-md active:scale-[0.98] transition-all"
                                style={{ background: 'linear-gradient(to right, #9CA3AF 0%, #EF4444 100%)' }}
                            >
                                Get started <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        /* ── Form step ────────────────────────────────── */
                        <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-1">Step 2 of 2</p>
                                <h2 className="text-2xl font-light text-slate-800 tracking-tight">Complete your profile</h2>
                            </div>

                            {/* Name fields */}
                            <div className="flex gap-4">
                                <Field
                                    label="First Name"
                                    name="firstName"
                                    type="text"
                                    placeholder="e.g. John"
                                    value={form.firstName}
                                    error={errors.firstName}
                                    onChange={handleChange}
                                />
                                <Field
                                    label="Last Name"
                                    name="lastName"
                                    type="text"
                                    placeholder="e.g. Doe"
                                    value={form.lastName}
                                    error={errors.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Student ID */}
                            <Field
                                label="Student ID"
                                name="studentId"
                                type="text"
                                placeholder="e.g. 25-29019"
                                value={form.studentId}
                                error={errors.studentId}
                                onChange={handleChange}
                            />

                            {/* Year Level */}
                            <SelectField
                                label="Year Level"
                                name="yearLevel"
                                value={form.yearLevel}
                                error={errors.yearLevel}
                                options={YEAR_LEVELS}
                                onChange={handleChange}
                            />

                            {/* Course */}
                            <SelectField
                                label="Course"
                                name="course"
                                value={form.course}
                                error={errors.course}
                                options={COURSES}
                                onChange={handleChange}
                            />

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white text-sm shadow-md active:scale-[0.98] transition-all"
                                    style={{ background: 'linear-gradient(to right, #9CA3AF 0%, #EF4444 100%)' }}
                                >
                                    Go to Dashboard <ArrowRight size={15} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Signed in as */}
            <p className="mt-6 text-xs text-slate-400">
                Signed in as <span className="font-semibold text-slate-500">{user?.email}</span>
            </p>
        </div>
    );
};

/* ── Sub-components ─────────────────────────────────────────────────────── */

const InfoRow = ({ icon, label, hint }) => (
    <div className="flex items-center gap-3">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm font-medium text-slate-600 w-24">{label}</span>
        <span className="text-xs text-slate-400">{hint}</span>
    </div>
);

const Field = ({ label, name, type, placeholder, value, error, onChange }) => (
    <div>
        <label className="block text-sm text-slate-500 mb-1.5 font-medium">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all ${
                error
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            }`}
        />
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
);

const SelectField = ({ label, name, value, error, options, onChange }) => (
    <div>
        <label className="block text-sm text-slate-500 mb-1.5 font-medium">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all appearance-none cursor-pointer ${
                error
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            } ${!value ? 'text-slate-400' : 'text-slate-700'}`}
        >
            <option value="">Select…</option>
            {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
);

export default OnboardingPage;
