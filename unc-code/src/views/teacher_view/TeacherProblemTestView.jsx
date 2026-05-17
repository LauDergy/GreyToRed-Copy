import { useState } from 'react';
import { ArrowLeft, Play, Eye, EyeOff } from 'lucide-react';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF_COLOR = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const INITIAL_CODE =
`public class Solution {
    public static void main(String[] args) {
        // Write your solution here

    }
}`;

/* ─────────────────────────────────────────────────────────────────────────
   TeacherProblemTestView

   A split-panel compiler view for the teacher to validate a newly created
   problem before publishing.

   Props:
     problem:  {
       title, difficulty, instructions,
       constraints:    string[],        — from CreateProblemView form
       testcases:      string[],        — visible (raw string inputs)
       hiddenTestcases: string[],       — hidden (raw string inputs)
     }
     onBack:  () => void  — return to CreateProblemView

   In production:
     - Left panel data comes from GET /api/problems/:id
     - "Run" button posts code to POST /api/run { code, testcases }
       and receives { outputs: [{ actual, pass }] }
───────────────────────────────────────────────────────────────────────── */
const TeacherProblemTestView = ({ problem, onBack }) => {
    const [code,          setCode]          = useState(INITIAL_CODE);
    const [outputs,       setOutputs]       = useState([]);
    const [isRunning,     setIsRunning]     = useState(false);
    const [tcTab,         setTcTab]         = useState('visible'); // 'visible' | 'hidden'
    const [activeOutput,  setActiveOutput]  = useState(0);

    const visibleTCs = problem?.testcases?.filter(Boolean)       ?? [];
    const hiddenTCs  = problem?.hiddenTestcases?.filter(Boolean) ?? [];
    const allTCs     = [...visibleTCs, ...hiddenTCs];

    // Simulate Docker run — in production: POST /api/run { code, testcases: allTCs }
    const handleRun = () => {
        setIsRunning(true);
        setOutputs([]);
        setTimeout(() => {
            setOutputs(allTCs.map(() => ({ actual: '(simulated output)', pass: Math.random() > 0.4 })));
            setIsRunning(false);
        }, 1400);
    };

    const lineCount = code.split('\n').length;

    return (
        <div className="flex h-screen bg-[#F9FAFB] font-sans overflow-hidden">

            {/* ── LEFT PANEL ─────────────────────────────────────────── */}
            <div className="w-[480px] min-w-[360px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">

                {/* Back + title */}
                <div className="px-8 pt-8 pb-5 border-b border-slate-100 shrink-0">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-5 transition-colors duration-200"
                    >
                        <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                            <ArrowLeft size={13} />
                        </span>
                        <span className="text-xs font-medium">Back to form</span>
                    </button>

                    <h1 className="text-2xl font-light text-slate-900 tracking-tight">
                        {problem?.title || 'Untitled Problem'}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        {problem?.difficulty && (
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-slate-100 ${DIFF_COLOR[problem.difficulty]}`}>
                                {cap(problem.difficulty)}
                            </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-red-50 text-red-400">
                            Teacher Preview
                        </span>
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7 custom-scrollbar">

                    {/* Description */}
                    {problem?.instructions && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{problem.instructions}</p>
                        </div>
                    )}

                    {/* Constraints */}
                    {problem?.constraints?.filter(Boolean).length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Constraints</p>
                            <ul className="space-y-1.5 text-sm text-slate-500 list-disc pl-5">
                                {problem.constraints.filter(Boolean).map((c, i) => (
                                    <li key={i} className="font-mono text-xs leading-relaxed">{c}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Testcase tabs */}
                    <div>
                        <div className="flex gap-1 mb-3">
                            <button
                                onClick={() => setTcTab('visible')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${tcTab === 'visible' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                            >
                                <Eye size={10} /> Testcases ({visibleTCs.length})
                            </button>
                            {hiddenTCs.length > 0 && (
                                <button
                                    onClick={() => setTcTab('hidden')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${tcTab === 'hidden' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >
                                    <EyeOff size={10} /> Hidden ({hiddenTCs.length})
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            {(tcTab === 'visible' ? visibleTCs : hiddenTCs).map((tc, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveOutput(tcTab === 'visible' ? i : visibleTCs.length + i)}
                                    className={`rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                                        activeOutput === (tcTab === 'visible' ? i : visibleTCs.length + i)
                                            ? 'border-red-200 shadow-sm'
                                            : 'border-slate-100'
                                    }`}
                                >
                                    <div className={`px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition-colors ${
                                        activeOutput === (tcTab === 'visible' ? i : visibleTCs.length + i)
                                            ? (tcTab === 'hidden' ? 'bg-slate-700 text-white' : 'bg-red-500 text-white')
                                            : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {tcTab === 'hidden' && <EyeOff size={10} />}
                                        {tcTab === 'hidden' ? 'Hidden ' : ''}Testcase {i + 1}
                                    </div>
                                    <div className="bg-white px-4 py-3 font-mono text-xs text-slate-600">{tc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Toolbar */}
                <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <span className="ml-3 text-xs font-mono text-slate-400">Solution.java</span>
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-red-200"
                    >
                        <Play size={13} fill="white" />
                        {isRunning ? 'Running…' : 'Run'}
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 flex bg-[#1C1C1E] overflow-hidden">
                    <div className="w-12 pt-5 pb-5 text-right pr-3 bg-[#1C1C1E] select-none shrink-0 overflow-hidden">
                        {Array.from({ length: lineCount }, (_, i) => (
                            <div key={i} className="text-[11px] font-mono text-slate-600 leading-[1.625rem]">{i + 1}</div>
                        ))}
                    </div>
                    <div className="w-px bg-white/5 shrink-0" />
                    <textarea
                        spellCheck={false}
                        className="flex-1 bg-[#1C1C1E] text-slate-200 font-mono text-sm px-5 py-5 outline-none resize-none leading-[1.625rem] selection:bg-red-500/30 custom-scrollbar"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        autoComplete="off" autoCorrect="off" autoCapitalize="off"
                    />
                </div>

                {/* Output */}
                <div className="bg-white border-t border-slate-200 px-6 py-5 space-y-3 shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Output</p>
                    <div className="grid grid-cols-3 gap-3">
                        {allTCs.slice(0, 6).map((tc, i) => {
                            const out = outputs[i];
                            const isHid = i >= visibleTCs.length;
                            return (
                                <div key={i} className={`rounded-2xl overflow-hidden border ${isHid ? 'border-slate-200' : 'border-slate-100'}`}>
                                    <div className={`px-3 py-1.5 text-[10px] font-bold flex items-center justify-between gap-1 ${isHid ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
                                        <span className="flex items-center gap-1">{isHid && <EyeOff size={9} />} {isHid ? 'H' : ''}TC {isHid ? i - visibleTCs.length + 1 : i + 1}</span>
                                        {out && (
                                            <span className={`font-bold ${out.pass ? 'text-green-500' : 'text-red-400'}`}>
                                                {out.pass ? '✓' : '✗'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="px-3 py-2 min-h-[2rem] font-mono text-[11px] text-slate-700 bg-white">
                                        {isRunning
                                            ? <span className="text-slate-300 animate-pulse">Running…</span>
                                            : out
                                                ? <span className={out.pass ? 'text-green-600' : 'text-red-500'}>{out.actual}</span>
                                                : <span className="text-slate-300">—</span>
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProblemTestView;
