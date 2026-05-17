import { useState } from 'react';
import { X, Eye, EyeOff, ChevronRight } from 'lucide-react';

const DIFF_COLOR  = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const DIFF_BG     = { easy: 'bg-emerald-50 border-emerald-200', medium: 'bg-amber-50 border-amber-200', hard: 'bg-red-50 border-red-200' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ── Testcase row ─────────────────────────────────────────────────────────── */
const TestcaseRow = ({ tc, index, isHidden = false }) => (
    <div className={`rounded-2xl overflow-hidden border ${isHidden ? 'border-slate-200 bg-slate-50/50' : 'border-slate-100'}`}>
        <div className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isHidden ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
            {isHidden && <EyeOff size={10} />}
            {isHidden ? `Hidden Testcase ${index + 1}` : `Testcase ${index + 1}`}
        </div>
        <div className="px-4 py-3 font-mono text-xs space-y-1">
            <div><span className="text-slate-400">Input: </span><span className="text-slate-700">{tc.input}</span></div>
            <div><span className="text-slate-400">Expected: </span><span className="text-slate-800 font-semibold">{tc.expected}</span></div>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   ProblemPreviewModal

   Props:
     problem:       Problem | null      — null = hidden
     onClose:       () => void
     showHidden:    boolean             — true for teacher-facing views
───────────────────────────────────────────────────────────────────────── */
const ProblemPreviewModal = ({ problem, onClose, showHidden = true }) => {
    const [tab, setTab] = useState('visible'); // 'visible' | 'hidden'

    if (!problem) return null;

    const visibleTCs = problem.sampleTestcases ?? [];
    const hiddenTCs  = problem.hiddenTestcases  ?? [];

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ─────────────────────────────────────────── */}
                <div className="flex items-start justify-between px-8 pt-8 pb-5 border-b border-slate-50 shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-light text-slate-900 leading-snug">{problem.title}</h2>
                            <span className={`text-[10px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full ${DIFF_BG[problem.difficulty] ?? 'bg-slate-100 border-slate-200'} ${DIFF_COLOR[problem.difficulty] ?? 'text-slate-500'}`}>
                                {cap(problem.difficulty)}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">By {problem.author}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-slate-500 transition-all ml-4 shrink-0 active:scale-90"
                    >
                        <X size={15} strokeWidth={2.5} />
                    </button>
                </div>

                {/* ── Body ───────────────────────────────────────────── */}
                <div className="flex flex-1 overflow-hidden">

                    {/* Left — description + constraints */}
                    <div className="w-[55%] border-r border-slate-50 px-8 py-6 overflow-y-auto space-y-6 custom-scrollbar">

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{problem.description ?? 'No description provided.'}</p>
                        </div>

                        {/* Constraints */}
                        {problem.constraints?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Constraints</p>
                                <ul className="space-y-1.5">
                                    {problem.constraints.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                                            <ChevronRight size={14} className="text-slate-300 mt-0.5 shrink-0" />
                                            <span className="font-mono text-xs leading-relaxed">{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Right — testcases */}
                    <div className="flex-1 flex flex-col overflow-hidden">

                        {/* Tabs (only show if teacher has hidden TCs) */}
                        {showHidden && hiddenTCs.length > 0 && (
                            <div className="flex border-b border-slate-100 px-6 pt-2 shrink-0">
                                <button
                                    onClick={() => setTab('visible')}
                                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${tab === 'visible' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <Eye size={12} /> Visible ({visibleTCs.length})
                                </button>
                                <button
                                    onClick={() => setTab('hidden')}
                                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${tab === 'hidden' ? 'border-red-500 text-red-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <EyeOff size={12} /> Hidden ({hiddenTCs.length})
                                </button>
                            </div>
                        )}

                        {/* Testcase list */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3 custom-scrollbar">
                            {tab === 'visible' || !showHidden ? (
                                visibleTCs.length > 0
                                    ? visibleTCs.map((tc, i) => <TestcaseRow key={i} tc={tc} index={i} />)
                                    : <p className="text-sm text-slate-300 text-center pt-8">No testcases added yet.</p>
                            ) : (
                                hiddenTCs.length > 0
                                    ? hiddenTCs.map((tc, i) => <TestcaseRow key={i} tc={tc} index={i} isHidden />)
                                    : <p className="text-sm text-slate-300 text-center pt-8">No hidden testcases.</p>
                            )}
                        </div>

                        {/* Close footer */}
                        <div className="px-6 py-4 border-t border-slate-50 shrink-0">
                            <button
                                onClick={onClose}
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl transition-all active:scale-[0.98]"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPreviewModal;
