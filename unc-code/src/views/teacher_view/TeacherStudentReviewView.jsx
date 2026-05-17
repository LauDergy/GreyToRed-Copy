import { useState } from 'react';
import { Play, CheckCircle, AlertCircle, Pencil, RotateCcw, X } from 'lucide-react';

/**
 * TeacherStudentReviewView
 *
 * Full-screen split view that mimics the student compiler layout.
 * Shows a student's submitted code (read-only) alongside the task description.
 * Teacher can: Validate / Unvalidate the submission, or Unsubmit it.
 *
 * Props:
 *   section:      { id }
 *   task:         { title, subjectId, difficulty, maxScore? }
 *                 maxScore defaults to 50 when not provided.
 *                 In production: comes from GET /api/tasks/:id
 *   problem:      Problem  — from PROBLEM_MAP[task.problemId]
 *                 shape: { description, constraints[], sampleTestcases[{ input, expected }] }
 *                 In production: GET /api/problems/:id
 *   submission:   { studentId, name, score, status, code, time, compile }
 *   onBack:       () => void
 *   onValidate:   (studentId, newStatus) => void  — toggles pending ↔ validated
 *   onUnsubmit:   (studentId) => void             — sets back to not_submitted
 *   onScoreChange:(studentId, newScore) => void   — e.g. PATCH /api/submissions/:id { score }
 */

/* Score pill */
const ScorePill = ({ score }) => {
    if (!score) return null;
    const [got, max] = score.split('/').map(Number);
    const pct = max ? (got / max) * 100 : 0;
    const color = pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400';
    return <span className={`font-bold ${color}`}>{score}</span>;
};

/* Confirm modal */
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

const TeacherStudentReviewView = ({
    section,
    task,
    problem,
    submission,
    onBack,
    onValidate,
    onUnsubmit,
    onScoreChange,
}) => {
    // MAX_SCORE is always 50. In production: sourced from task.maxScore (GET /api/tasks/:id).
    const MAX_SCORE = task?.maxScore ?? 50;

    // Parse the numerator from the submission score.
    // score is now a plain integer (e.g. 47), not a string like "47/50".
    const parseGot = (score) => (score != null ? String(score) : '');

    const testcases   = problem?.sampleTestcases ?? [];
    const [localStatus, setLocalStatus] = useState(submission?.status ?? 'pending');
    const [editingScore, setEditingScore] = useState(false);
    // scoreInput holds only the NUMERATOR as a string (denominator is always MAX_SCORE)
    const [scoreInput, setScoreInput]     = useState(parseGot(submission?.score));
    const [scoreError, setScoreError]     = useState('');
    const [outputs]                       = useState(testcases.map(tc => tc.expected));
    const [activeTestcase, setActiveTestcase] = useState(0);
    const [modal, setModal] = useState(null);

    // Display string always in "got/MAX_SCORE" format
    const displayScore = scoreInput !== '' ? `${scoreInput}/${MAX_SCORE}` : submission?.score ?? null;

    const isValidated = localStatus === 'validated';

    const handleValidateToggle = () => {
        const next = isValidated ? 'pending' : 'validated';
        setLocalStatus(next);
        onValidate?.(submission?.studentId, next);
    };

    const handleSaveScore = () => {
        const raw = scoreInput.trim();
        if (raw === '') { setScoreError('Score is required.'); return; }
        const val = Number(raw);
        if (!Number.isInteger(val))     { setScoreError('Must be a whole number.'); return; }
        if (val < 0 || val > MAX_SCORE) { setScoreError(`Must be between 0 and ${MAX_SCORE}.`); return; }
        setScoreError('');
        setEditingScore(false);
        // TODO: PATCH /api/submissions/:submissionId { score: `${val}/${MAX_SCORE}` }
        onScoreChange?.(submission?.studentId, `${val}/${MAX_SCORE}`);
    };

    const handleCancelScore = () => {
        setScoreInput(parseGot(submission?.score)); // revert to original
        setScoreError('');
        setEditingScore(false);
    };

    const handleUnsubmit = () => {
        setLocalStatus('not_submitted');
        onUnsubmit?.(submission?.studentId);
        setModal(null);
        onBack?.();
    };

    const code = submission?.code ?? '// No code submitted';
    const lineCount = code.split('\n').length;

    return (
        <>
            <ConfirmModal
                open={modal === 'unsubmit'}
                title="Unsubmit this submission?"
                message={`${submission?.name}'s work will be marked as "Not Submitted". They will need to resubmit.`}
                confirmLabel="Unsubmit"
                confirmClass="bg-red-500 hover:bg-red-600"
                onConfirm={handleUnsubmit}
                onCancel={() => setModal(null)}
            />

            <div className="flex h-screen bg-[#F9FAFB] font-sans overflow-hidden animate-in fade-in duration-300">

                {/* ── LEFT PANEL ──────────────────────────────────────────── */}
                <div className="w-[480px] min-w-[360px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">

                    {/* Top breadcrumb bar */}
                    <div className="px-8 pt-7 pb-5 border-b border-slate-100">
                        {/* Breadcrumb */}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 mb-3">
                            <button onClick={onBack} className="hover:text-red-400 transition-colors">{section?.id}</button>
                            <span className="text-slate-300">›</span>
                            <span className="hover:text-red-400 cursor-pointer transition-colors">{task?.title}</span>
                            <span className="text-slate-300">›</span>
                            <span className="text-red-400">{submission?.name}</span>
                        </p>

                        {/* Score row */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-light text-slate-500">Score</span>
                                {editingScore ? (
                                    <div className="flex items-center gap-2">
                                        {/* Numerator only — denominator is always MAX_SCORE */}
                                        <div className="flex items-center gap-1.5 border border-slate-300 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-red-400/40 focus-within:border-red-400">
                                            <input
                                                type="number"
                                                min={0}
                                                max={MAX_SCORE}
                                                step={1}
                                                value={scoreInput}
                                                onChange={e => {
                                                    setScoreError('');
                                                    setScoreInput(e.target.value);
                                                }}
                                                onKeyDown={e => e.key === 'Enter' && handleSaveScore()}
                                                className="w-12 text-sm font-bold text-slate-700 bg-transparent focus:outline-none text-right"
                                                autoFocus
                                            />
                                            <span className="text-sm font-bold text-slate-400">/ {MAX_SCORE}</span>
                                        </div>
                                        <button
                                            onClick={handleSaveScore}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button onClick={handleCancelScore} className="text-slate-300 hover:text-slate-500">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-slate-800">
                                            {displayScore
                                                ? <ScorePill score={displayScore} />
                                                : <span className="text-slate-300 font-light text-sm">Not graded</span>
                                            }
                                        </span>
                                        <button
                                            onClick={() => { setScoreError(''); setEditingScore(true); }}
                                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Pencil size={12} />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Inline validation error */}
                            {scoreError && (
                                <p className="text-xs text-red-500 font-medium pl-1">{scoreError}</p>
                            )}
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            {submission?.time && <span>Submitted: {submission.time}</span>}
                            {submission?.compile && <span>Compile: {submission.compile}</span>}
                        </div>
                    </div>

                    {/* Problem title & meta */}
                    <div className="px-8 pt-6 pb-4 border-b border-slate-100">
                        <h1 className="text-2xl font-light text-slate-900 tracking-tight">{task?.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            {task?.difficulty && (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                    {task.difficulty}
                                </span>
                            )}
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-50 px-2 py-1 rounded-lg">
                                {task?.subjectId}
                            </span>
                        </div>
                    </div>

                    {/* Scrollable body */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7 custom-scrollbar">

                        {/* Description */}
                        {problem?.description && (
                            <div className="text-sm text-slate-600 leading-relaxed">
                                {problem.description}
                            </div>
                        )}

                        {/* Constraints */}
                        {problem?.constraints?.length > 0 && (
                            <div>
                                <p className="text-sm font-semibold text-slate-700 mb-2">Constraints:</p>
                                <ul className="space-y-1.5 text-sm text-slate-500 list-disc pl-5">
                                    {problem.constraints.map((c, i) => (
                                        <li key={i} className="font-mono text-xs">{c}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Testcases */}
                        {testcases.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Test Cases</p>
                                {testcases.map((tc, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveTestcase(i)}
                                        className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                                            activeTestcase === i ? 'border-red-200 shadow-sm' : 'border-slate-100'
                                        }`}
                                    >
                                        <div className={`px-4 py-2 text-xs font-bold transition-colors ${
                                            activeTestcase === i ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            Testcase {i + 1}
                                        </div>
                                        <div className="bg-white px-4 py-3 font-mono text-xs text-slate-600">{tc.input}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Editor toolbar */}
                    <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                            <span className="ml-3 text-xs font-mono text-slate-400">Solution.java</span>
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-slate-300 border border-slate-200 px-2 py-0.5 rounded-md">
                                Read-only
                            </span>
                        </div>
                        {/* Run is disabled for teacher review — show output directly */}
                        <button
                            disabled
                            className="flex items-center gap-2 bg-slate-100 text-slate-300 text-xs font-bold px-4 py-2 rounded-lg cursor-not-allowed"
                        >
                            <Play size={13} fill="currentColor" />
                            Run
                        </button>
                    </div>

                    {/* Code (read-only) */}
                    <div className="flex-1 flex bg-[#1C1C1E] overflow-hidden">
                        {/* Line numbers */}
                        <div className="w-12 pt-5 pb-5 text-right pr-3 bg-[#1C1C1E] select-none shrink-0 overflow-hidden">
                            {Array.from({ length: lineCount }, (_, i) => (
                                <div key={i} className="text-[11px] font-mono text-slate-600 leading-[1.625rem]">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="w-px bg-white/5 shrink-0" />
                        {/* Pre — not a textarea so it can't be edited */}
                        <pre className="flex-1 bg-[#1C1C1E] text-slate-200 font-mono text-sm px-5 py-5 outline-none leading-[1.625rem] overflow-auto whitespace-pre">
                            {code}
                        </pre>
                    </div>

                    {/* Output + actions */}
                    <div className="bg-white border-t border-slate-200 px-6 py-5 space-y-3 shrink-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Output</p>

                        <div className="grid grid-cols-2 gap-3">
                            {testcases.map((tc, i) => (
                                <div key={i} className="rounded-2xl overflow-hidden border border-slate-100">
                                    <div className="px-4 py-2 bg-slate-100 text-xs font-bold text-slate-500 flex justify-between items-center">
                                        <span>Output {i + 1}</span>
                                        {outputs[i] && (
                                            <span className={`flex items-center gap-1 ${outputs[i] === tc.expected ? 'text-green-500' : 'text-red-400'}`}>
                                                <CheckCircle size={12} />
                                                {outputs[i] === tc.expected ? 'Correct' : 'Wrong'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 min-h-[2.5rem] font-mono text-xs text-slate-700 bg-white">
                                        {outputs[i]
                                            ? <span className={outputs[i] === tc.expected ? 'text-green-600' : 'text-red-500'}>{outputs[i]}</span>
                                            : <span className="text-slate-300">—</span>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Teacher actions */}
                        <div className="flex items-center gap-3 pt-1">
                            {/* Validate / Unvalidate toggle */}
                            <button
                                onClick={handleValidateToggle}
                                className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-sm ${
                                    isValidated
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-red-200'
                                }`}
                            >
                                {isValidated
                                    ? <><AlertCircle size={15} /> Unvalidate</>
                                    : <><CheckCircle size={15} /> Validate</>
                                }
                            </button>

                            {/* Unsubmit */}
                            <button
                                onClick={() => setModal('unsubmit')}
                                className="flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white transition-all duration-200 active:scale-95"
                            >
                                <RotateCcw size={15} />
                                Unsubmit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherStudentReviewView;
