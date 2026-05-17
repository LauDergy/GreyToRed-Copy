import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, FlaskConical, CheckCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Small reusable field components
───────────────────────────────────────────────────────────── */
const Label = ({ children, hint }) => (
    <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{children}</span>
        {hint && <span className="text-[10px] text-slate-400 font-normal normal-case tracking-normal">{hint}</span>}
    </div>
);

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all";

/* Repeatable row list (constraints / testcases) */
const RepeatableList = ({ rows, onChange, onAdd, onRemove, placeholder = '', maxRows = 5 }) => (
    <div className="space-y-2">
        {rows.map((val, i) => (
            <div key={i} className="flex items-center gap-2 group">
                <input
                    type="text"
                    value={val}
                    onChange={e => onChange(i, e.target.value)}
                    placeholder={`${placeholder} ${i + 1}`}
                    className={inputCls}
                />
                {rows.length > 1 && (
                    <button
                        type="button"
                        onClick={() => onRemove(i)}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        ))}
        {rows.length < maxRows && (
            <button
                type="button"
                onClick={onAdd}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors mt-1"
            >
                <Plus size={13} />
                Add row
            </button>
        )}
    </div>
);

/* ─────────────────────────────────────────────────────────────
   CreateProblemView
───────────────────────────────────────────────────────────── */

/**
 * Props:
 *   onBack:    () => void
 *   onTest:    (formData) => void  — run the problem in the compiler preview
 *   onFinish:  (formData) => void  — POST /api/problems
 */
const CreateProblemView = ({ onBack, onTest, onFinish }) => {
    const [title,       setTitle]       = useState('');
    const [difficulty,  setDifficulty]  = useState('');
    const [instructions, setInstructions] = useState('');
    const [constraints, setConstraints] = useState(['', '', '']);
    const [testcases,   setTestcases]   = useState(['', '', '']);
    const [hidden,      setHidden]      = useState(['', '']);

    /* Helpers for repeatable lists */
    const listHelpers = (setter) => ({
        onChange: (i, v) => setter(prev => prev.map((x, idx) => idx === i ? v : x)),
        onAdd:    ()     => setter(prev => [...prev, '']),
        onRemove: (i)    => setter(prev => prev.filter((_, idx) => idx !== i)),
    });

    const buildFormData = () => ({
        title, difficulty, instructions,
        constraints: constraints.filter(Boolean),
        testcases:   testcases.filter(Boolean),
        hiddenTestcases: hidden.filter(Boolean),
    });

    const handleTest   = () => onTest?.(buildFormData());
    const handleFinish = (e) => { e.preventDefault(); onFinish?.(buildFormData()); };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20 p-8 animate-in fade-in duration-500">

            {/* ── Back ─────────────────────────────────────────────────── */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                    <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                </span>
                <span className="text-sm font-medium">Back to Problem Sets</span>
            </button>

            {/* ── Card ─────────────────────────────────────────────────── */}
            <form
                onSubmit={handleFinish}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 max-w-3xl mx-auto space-y-8"
            >
                {/* Heading */}
                <h1 className="text-4xl font-light text-slate-900 tracking-tight">
                    Create New Problem
                </h1>

                {/* ── Row 1: Title + Difficulty ── */}
                <div className="grid grid-cols-[1fr_180px] gap-6 items-end">
                    <div>
                        <Label>Problem Title</Label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Two Sum"
                            className={inputCls}
                            required
                        />
                    </div>
                    <div>
                        <Label>Difficulty</Label>
                        <select
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value)}
                            className={`${inputCls} appearance-none cursor-pointer`}
                            required
                        >
                            <option value="" disabled>Select…</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* ── Instructions ── */}
                <div>
                    <Label>Instructions</Label>
                    <textarea
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        placeholder="Describe the problem, examples, and expected behaviour…"
                        rows={10}
                        className={`${inputCls} resize-y leading-relaxed`}
                        required
                    />
                </div>

                {/* ── Constraints ── */}
                <div>
                    <Label>Constraints</Label>
                    <RepeatableList
                        rows={constraints}
                        {...listHelpers(setConstraints)}
                        placeholder="Constraint"
                        maxRows={8}
                    />
                </div>

                {/* ── Visible Testcases ── */}
                <div>
                    <Label hint={'Separate inputs with spaces — use " " for strings'}>
                        Testcases
                    </Label>
                    <RepeatableList
                        rows={testcases}
                        {...listHelpers(setTestcases)}
                        placeholder="Testcase"
                        maxRows={8}
                    />
                </div>

                {/* ── Hidden Testcases ── */}
                <div>
                    <Label hint="Students will not see these when running their code">
                        Hidden Testcases
                    </Label>
                    <RepeatableList
                        rows={hidden}
                        {...listHelpers(setHidden)}
                        placeholder="Hidden testcase"
                        maxRows={10}
                    />
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={handleTest}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-sm shadow-emerald-200 transition-all duration-200"
                    >
                        <FlaskConical size={15} />
                        Test
                    </button>

                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold px-8 py-2.5 rounded-full shadow-sm shadow-red-200 transition-all duration-200"
                    >
                        <CheckCircle size={15} />
                        Finish
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProblemView;
