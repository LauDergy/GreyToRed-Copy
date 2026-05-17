import { useState } from 'react';
import { ArrowLeft, X, CheckCircle } from 'lucide-react';
import { DUMMY_PROBLEMS, DUMMY_SECTIONS } from '../../data/dummyData';
import ProblemPreviewModal from '../../components/ProblemPreviewModal';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF_COLOR = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ─────────────────────────────────────────────────────────────────────────
   Preview Modal  —  shows problem description
   In production: data comes from GET /api/problems/:id
───────────────────────────────────────────────────────────────────────── */
const PreviewModal = ({ problem, onClose }) => {
    if (!problem) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-8 pb-4">
                    <div>
                        <h2 className="text-2xl font-light text-slate-900 leading-snug">{problem.title}</h2>
                        <p className={`text-base font-semibold mt-0.5 ${DIFF_COLOR[problem.difficulty] ?? 'text-slate-500'}`}>
                            {cap(problem.difficulty)}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">By {problem.author}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all ml-4 shrink-0 active:scale-90"
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 pb-8 space-y-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {problem.description ?? 'No description available.'}
                        </p>
                    </div>
                    <div className="flex gap-6 text-xs text-slate-400 pt-2 border-t border-slate-50">
                        {problem.sampleTestcases?.length > 0 && (
                            <span><span className="font-semibold text-slate-600">{problem.sampleTestcases.length}</span> visible testcases</span>
                        )}
                        {problem.hiddenTestcases?.length > 0 && (
                            <span><span className="font-semibold text-slate-600">{problem.hiddenTestcases.length}</span> hidden testcases</span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────
   Assign Task Modal  —  section picker + deadline
   In production: on confirm → POST /api/tasks { problemId, sectionId, deadline }
───────────────────────────────────────────────────────────────────────── */
const AssignTaskModal = ({ problem, sections, onAssign, onClose }) => {
    const [selected, setSelected] = useState(new Set()); // multi-select
    const [date,     setDate]     = useState('');
    const [time,     setTime]     = useState('');

    if (!problem) return null;
    const activeSections = sections?.filter(s => s.status !== 'archived') ?? [];
    const canAssign = selected.size > 0 && date && time;

    const toggleSection = (id) => setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-7 pb-4">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Assign Task</h2>
                        <p className="text-sm text-slate-400 mt-0.5">
                            Select a section to assign <span className="font-medium text-slate-600">"{problem.title}"</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all ml-4 shrink-0 active:scale-90"
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Section list */}
                <div className="px-7 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {activeSections.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-6">No active sections found.</p>
                    ) : activeSections.map(sec => {
                        const isSelected = selected.has(sec.id);
                        return (
                            <button
                                key={sec.id}
                                onClick={() => toggleSection(sec.id)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border text-left transition-all duration-150 ${
                                    isSelected
                                        ? 'border-red-400 bg-red-50 shadow-sm'
                                        : 'border-slate-100 bg-slate-50 hover:border-red-200 hover:bg-red-50/50'
                                }`}
                            >
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">{sec.id}</p>
                                    <p className="text-xs text-slate-400">{sec.name}</p>
                                </div>
                                {isSelected && (
                                    <CheckCircle size={18} className="text-red-500 shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Deadline pickers */}
                <div className="px-7 pt-5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Set Deadline</p>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                        />
                        <input
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-7 pt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!canAssign}
                        onClick={() => {
                            const deadline   = `${date}T${time}`; // ISO: "2026-06-01T23:59"
                            const sectionIds = [...selected];
                            onAssign?.(problem, sectionIds, deadline);
                            onClose();
                        }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] ${
                            canAssign
                                ? 'bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Assign{selected.size > 1 ? ` (${selected.size})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────
   Confirm delete modal
───────────────────────────────────────────────────────────────────────── */
const ConfirmModal = ({ open, title, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-base font-semibold text-slate-800 mb-1">Remove from collection?</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                    <span className="font-medium text-slate-600">"{title}"</span> will be removed. This cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-5">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-5 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all active:scale-95">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────
   Problem card
───────────────────────────────────────────────────────────────────────── */
const ProblemCard = ({ problem, onDelete, onPreview, onAssign }) => (
    <div className="relative bg-white border border-slate-100 hover:border-red-200 hover:shadow-md rounded-[1.5rem] p-7 transition-all duration-200 flex flex-col gap-5 shadow-sm">
        <button
            onClick={() => onDelete?.(problem)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-red-400 hover:text-white text-slate-500 flex items-center justify-center transition-all duration-200 active:scale-90"
            aria-label="Remove"
        >
            <X size={14} strokeWidth={2.5} />
        </button>

        <div className="pr-8">
            <h3 className="text-2xl font-light text-slate-900 leading-snug line-clamp-1">{problem.title}</h3>
            <p className={`text-base font-semibold mt-0.5 ${DIFF_COLOR[problem.difficulty] ?? 'text-slate-500'}`}>
                {cap(problem.difficulty)}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">By {problem.author}</p>
        </div>

        <div className="flex items-center gap-3 mt-auto">
            <button onClick={() => onPreview?.(problem)} className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-full shadow-sm shadow-red-200 transition-all duration-200">
                Preview
            </button>
            <button onClick={() => onAssign?.(problem)} className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-full shadow-sm shadow-red-200 transition-all duration-200">
                Assign Task
            </button>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   Add New card  —  goes to Explore
───────────────────────────────────────────────────────────────────────── */
const AddNewCard = ({ onClick }) => (
    <button
        onClick={onClick}
        className="bg-white border border-slate-100 hover:border-red-200 hover:shadow-md rounded-[1.5rem] p-7 transition-all duration-200 flex flex-col items-center justify-center gap-4 shadow-sm min-h-[200px] active:scale-[0.98] group"
    >
        <div className="w-14 h-14 rounded-full bg-red-500 group-hover:bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 transition-colors duration-200">
            <span className="text-3xl font-light leading-none mb-0.5">+</span>
        </div>
        <span className="text-base text-slate-700 group-hover:text-red-600 transition-colors font-light">
            Add New To Collection
        </span>
    </button>
);

/* ─────────────────────────────────────────────────────────────────────────
   ProblemCollectionView

   Props:
     problems:   Problem[]          — defaults to DUMMY_PROBLEMS
                 In production: GET /api/problems?owner=me
     sections:   Section[]          — for Assign Task modal
                 In production: GET /api/sections?teacher=me
     onBack:     () => void
     onExplore:  () => void          — "Add New" navigates to Explore
     onAssign:   (problem, sectionIds[], deadline) => void
                 In production: one POST /api/tasks per sectionId { problemId, sectionId, deadline }
───────────────────────────────────────────────────────────────────────── */
const ProblemCollectionView = ({
    problems: initialProblems = DUMMY_PROBLEMS,
    sections = DUMMY_SECTIONS,
    onBack,
    onExplore,
    onAssign,
}) => {
    const [problems, setProblems] = useState(initialProblems);
    const [deleting,    setDeleting]    = useState(null);
    const [previewing,  setPreviewing]  = useState(null);
    const [assigning,   setAssigning]   = useState(null);

    const handleConfirmDelete = () => {
        setProblems(prev => prev.filter(p => p.id !== deleting.id));
        setDeleting(null);
        // TODO: DELETE /api/problems/:id/collect
    };

    const handleAssign = (problem, sectionIds, deadline) => {
        onAssign?.(problem, sectionIds, deadline);
        // TODO: for each sectionId → POST /api/tasks { problemId: problem.id, sectionId, deadline }
        console.log(`Assigned "${problem.title}" → [${sectionIds.join(', ')}] — deadline: ${deadline}`);
    };

    return (
        <>
            <ProblemPreviewModal problem={previewing} onClose={() => setPreviewing(null)} showHidden />
            <AssignTaskModal
                problem={assigning}
                sections={sections}
                onAssign={handleAssign}
                onClose={() => setAssigning(null)}
            />
            <ConfirmModal
                open={!!deleting}
                title={deleting?.title}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleting(null)}
            />

            <div className="p-8 animate-in fade-in duration-500">
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all shadow-sm">
                        <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                    </span>
                    <span className="text-sm font-medium">Back to Problem Sets</span>
                </button>

                <div className="mb-8">
                    <h1 className="text-4xl font-light text-slate-900 tracking-tight">Your Collection</h1>
                    <p className="text-sm text-slate-400 mt-1">{problems.length} problem{problems.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {problems.map(p => (
                        <ProblemCard
                            key={p.id}
                            problem={p}
                            onDelete={(prob) => setDeleting({ id: prob.id, title: prob.title })}
                            onPreview={setPreviewing}
                            onAssign={setAssigning}
                        />
                    ))}
                    <AddNewCard onClick={onExplore} />
                </div>
            </div>
        </>
    );
};

export default ProblemCollectionView;
