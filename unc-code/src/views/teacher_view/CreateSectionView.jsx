import { useState, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, BookOpen, Users, X } from 'lucide-react';

/**
 * CreateSectionView
 * Props:
 *   onBack:   () => void  — navigates back to TeacherSectionsView
 *   onCreate: (section) => void  — called with the new section data
 *   existingSections: Section[]  — used to populate the Course Title dropdown
 */

const COURSE_OPTIONS = [
    'Fundamentals of Programming',
    'Discrete Mathematics',
    'Data Structures and Algorithms',
    'Object-Oriented Programming',
    'Web Development',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
];

const CreateSectionView = ({ onBack, onCreate }) => {
    const [sectionName, setSectionName] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [rows, setRows] = useState([{ id: Date.now(), email: '' }]);
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    // ── Row helpers ──────────────────────────────────────────────────────────
    const addRow = () =>
        setRows(prev => [...prev, { id: Date.now(), email: '' }]);

    const updateRow = (id, value) =>
        setRows(prev => prev.map(r => r.id === id ? { ...r, email: value } : r));

    const removeRow = (id) => {
        if (rows.length === 1) return; // keep at least one
        setRows(prev => prev.filter(r => r.id !== id));
    };

    // ── Validation ───────────────────────────────────────────────────────────
    const validate = () => {
        const newErrors = {};
        if (!sectionName.trim()) newErrors.sectionName = 'Section name is required.';
        if (!courseTitle) newErrors.courseTitle = 'Please select a course.';
        return newErrors;
    };

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleCreate = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const emails = rows.map(r => r.email).filter(Boolean);
        onCreate?.({ name: sectionName, course: courseTitle, students: emails });
        onBack?.();
    };

    // ── Drag & Drop styling ──────────────────────────────────────────────────
    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        // Future: parse Excel/CSV file and populate rows
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-8 animate-in fade-in duration-500">

            {/* ── Back button ──────────────────────────────────────────────── */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                    <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                </span>
                <span className="text-sm font-medium">Back to Sections</span>
            </button>

            {/* ── Page header ──────────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-4xl font-light text-slate-900 tracking-tight">
                    Create New <span className="font-semibold text-red-500">Section</span>
                </h1>
                <p className="text-slate-400 mt-2 text-sm">Fill in the details below to set up a new class section.</p>
            </div>

            {/* ── Main card ────────────────────────────────────────────────── */}
            <div className="max-w-3xl bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">

                {/* Card accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-red-400 via-red-500 to-rose-400" />

                <div className="p-8 space-y-8">

                    {/* ── Row 1: Section Name + Course Title ───────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Section Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                <BookOpen size={12} className="text-red-400" />
                                Section Name
                            </label>
                            <input
                                type="text"
                                value={sectionName}
                                onChange={e => {
                                    setSectionName(e.target.value);
                                    if (errors.sectionName) setErrors(prev => ({ ...prev, sectionName: undefined }));
                                }}
                                placeholder="e.g. BCS221-OCa"
                                className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm bg-slate-50 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-all duration-200 ${
                                    errors.sectionName ? 'border-red-400 bg-red-50' : 'border-slate-200'
                                }`}
                            />
                            {errors.sectionName && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <X size={11} /> {errors.sectionName}
                                </p>
                            )}
                        </div>

                        {/* Course Title */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                <BookOpen size={12} className="text-red-400" />
                                Course Title
                            </label>
                            <div className="relative">
                                <select
                                    value={courseTitle}
                                    onChange={e => {
                                        setCourseTitle(e.target.value);
                                        if (errors.courseTitle) setErrors(prev => ({ ...prev, courseTitle: undefined }));
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl border text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 appearance-none transition-all duration-200 ${
                                        errors.courseTitle ? 'border-red-400 bg-red-50' : 'border-slate-200'
                                    } ${!courseTitle ? 'text-slate-300' : ''}`}
                                >
                                    <option value="" disabled>Select a course…</option>
                                    {COURSE_OPTIONS.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                                {/* Custom chevron */}
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M2 4l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            {errors.courseTitle && (
                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                    <X size={11} /> {errors.courseTitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Divider ──────────────────────────────────────────── */}
                    <div className="border-t border-slate-100" />

                    {/* ── Student emails section ────────────────────────────── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                <Users size={12} className="text-red-400" />
                                Add Students via UNC Email
                            </label>

                            {/* Import from Excel */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                            >
                                <Upload size={13} />
                                Import from Excel
                            </button>
                            <input ref={fileInputRef} type="file" accept=".xlsx,.csv" className="hidden" />
                        </div>

                        {/* Drop zone wrapper */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                                isDragging
                                    ? 'border-red-400 bg-red-50/50'
                                    : 'border-slate-200 bg-slate-50/50'
                            }`}
                        >
                            {/* Table header */}
                            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span className="w-6 text-center">#</span>
                                <span>Email Address</span>
                                <span className="w-6" />
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-slate-100">
                                {rows.map((row, idx) => (
                                    <div
                                        key={row.id}
                                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2 group hover:bg-white transition-colors duration-150"
                                    >
                                        <span className="w-6 text-center text-xs text-slate-300 font-mono">{idx + 1}</span>
                                        <input
                                            type="email"
                                            value={row.email}
                                            onChange={e => updateRow(row.id, e.target.value)}
                                            placeholder="student@unc.edu.ph"
                                            className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-300 focus:outline-none py-1"
                                        />
                                        <button
                                            onClick={() => removeRow(row.id)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add Row */}
                            <button
                                onClick={addRow}
                                className="w-full flex items-center justify-center gap-2 py-3 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50/60 border-t border-slate-200 transition-all duration-200"
                            >
                                <Plus size={14} />
                                Add row
                            </button>
                        </div>

                        {isDragging && (
                            <p className="text-center text-xs text-red-400 font-medium animate-pulse">
                                Drop your Excel / CSV file here
                            </p>
                        )}
                    </div>

                </div>

                {/* ── Footer ────────────────────────────────────────────────── */}
                <div className="px-8 py-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onBack}
                        className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-sm shadow-red-200 transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Section
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateSectionView;
