import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, Edit2, Trash2, AlertCircle } from 'lucide-react';
import ProblemPreviewModal from '../../components/ProblemPreviewModal';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF_COLOR = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ── Select dropdown ─────────────────────────────────────────────────────── */
const SelectDropdown = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="appearance-none w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-9 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all cursor-pointer"
        >
            <option value="">{placeholder}</option>
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

/* ── Confirm Modal ──────────────────────────────────────────────────────── */
const ConfirmModal = ({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95 ${confirmClass}`}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Problem card (published variant) ────────────────────────────────────── */
const PublishedCard = ({ problem, onPreview, onEdit, onDelete }) => (
    <div className="bg-white border border-slate-100 hover:border-red-200 hover:shadow-md rounded-[1.5rem] p-7 transition-all duration-200 flex flex-col gap-5 shadow-sm">
        <div className="cursor-pointer" onClick={() => onPreview?.(problem)}>
            <h3 className="text-2xl font-light text-slate-900 leading-snug line-clamp-1">{problem.title}</h3>
            <p className={`text-base font-semibold mt-0.5 ${DIFF_COLOR[problem.difficulty] ?? 'text-slate-500'}`}>
                {cap(problem.difficulty)}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">Published on {problem.createdAt || 'recently'}</p>
        </div>

        <div className="flex items-center gap-3 mt-auto">
            <button
                onClick={() => onEdit?.(problem)}
                className="flex-1 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-sm font-bold py-2.5 rounded-full transition-all duration-200"
            >
                <Edit2 size={16} />
                Edit
            </button>
            <button
                onClick={() => onDelete?.(problem)}
                className="flex-1 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 active:scale-95 text-red-600 border border-red-100 text-sm font-bold py-2.5 rounded-full transition-all duration-200"
            >
                <Trash2 size={16} />
                Delete
            </button>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   PublishedProblemsView

   Props:
     publishedProblems:  Problem[]   — problems authored by this teacher
                         In production: GET /api/problems?author=me
     onBack:             () => void
     onEditProblem:      (problem) => void
                         In production: navigates to problem editor with pre-filled data
     onDeleteProblem:    (problemId) => void
                         In production: DELETE /api/problems/:id
───────────────────────────────────────────────────────────────────────── */
const PublishedProblemsView = ({
    publishedProblems = [],
    onBack,
    onEditProblem,
    onDeleteProblem,
}) => {
    const [localProblems, setLocalProblems] = useState(publishedProblems);
    const [previewing,  setPreviewing]  = useState(null);
    const [deleting,    setDeleting]    = useState(null);
    const [search,      setSearch]      = useState('');
    const [difficulty,  setDifficulty]  = useState('');

    const filtered = localProblems.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchDiff   = !difficulty || p.difficulty === difficulty;
        return matchSearch && matchDiff;
    });

    const handleDeleteConfirm = () => {
        if (!deleting) return;
        // Optimistic UI update
        setLocalProblems(prev => prev.filter(p => p.id !== deleting.id));
        onDeleteProblem?.(deleting.id);
        setDeleting(null);
    };

    return (
        <>
            <ProblemPreviewModal problem={previewing} onClose={() => setPreviewing(null)} showHidden={true} />
            <ConfirmModal
                open={!!deleting}
                title="Delete Problem?"
                message={deleting ? `Are you sure you want to delete "${deleting.title}"? This action cannot be undone.` : ''}
                confirmLabel="Delete"
                confirmClass="bg-red-500 hover:bg-red-600"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleting(null)}
            />

            <div className="p-8 animate-in fade-in duration-500">

                {/* ── Back ─────────────────────────────────────────────── */}
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all shadow-sm">
                        <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                    </span>
                    <span className="text-sm font-medium">Back to Problem Sets</span>
                </button>

                {/* ── Title ────────────────────────────────────────────── */}
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-4xl font-light text-slate-900 tracking-tight">
                        Published <span className="font-semibold text-red-500">Problems</span>
                    </h1>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-sm self-end mb-1">
                        {localProblems.length} Total
                    </span>
                </div>

                {/* ── Search / filter card ──────────────────────────────── */}
                <div className="bg-white border border-slate-100 rounded-3xl px-6 py-5 shadow-sm mb-8">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search your published problems"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="w-44">
                            <SelectDropdown
                                value={difficulty}
                                onChange={setDifficulty}
                                options={[
                                    { value: 'easy',   label: 'Easy'   },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'hard',   label: 'Hard'   },
                                ]}
                                placeholder="Difficulty"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Results ────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-300">
                        <AlertCircle size={36} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">
                            {search || difficulty ? 'No published problems match your filter.' : "You haven't published any problems yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map(p => (
                            <PublishedCard
                                key={p.id}
                                problem={p}
                                onPreview={setPreviewing}
                                onEdit={(prob) => onEditProblem?.(prob)}
                                onDelete={(prob) => setDeleting(prob)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PublishedProblemsView;
