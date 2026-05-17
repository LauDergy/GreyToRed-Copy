import { useState } from 'react';
import { Play, CheckCircle } from 'lucide-react';

const INITIAL_CODE =
`public class Solution {
    public static void main(String[] args) {
        // Write your solution here

    }
}`;

/**
 * TaskCompilerView
 *
 * Full-screen split-panel compiler for students.
 *
 * Props:
 *   task:     { title, subjectId }
 *   problem:  Problem  — from PROBLEM_MAP[task.problemId]
 *             shape: { description, constraints[], sampleTestcases[{ input, expected }] }
 *             In production: GET /api/problems/:id
 *
 * In production:
 *   "Run" posts code + testcase inputs to POST /api/run
 *   and receives { outputs: [{ actual, pass }] }
 */
const TaskCompilerView = ({ task, problem }) => {
    const testcases = problem?.sampleTestcases ?? [];

    const [code,           setCode]           = useState(INITIAL_CODE);
    const [outputs,        setOutputs]        = useState([]);
    const [isRunning,      setIsRunning]      = useState(false);
    const [activeTestcase, setActiveTestcase] = useState(0);

    // Simulate a Docker run — replace with POST /api/run in production
    const handleRun = () => {
        setIsRunning(true);
        setTimeout(() => {
            setOutputs(testcases.map(tc => tc.expected));
            setIsRunning(false);
        }, 1200);
    };

    const lineCount = code.split('\n').length;

    return (
        <div className="flex h-screen bg-[#F9FAFB] font-sans overflow-hidden">

            {/* ── LEFT PANEL: Problem Description ── */}
            <div className="w-[480px] min-w-[360px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">

                {/* Problem title */}
                <div className="px-10 pt-10 pb-6 border-b border-slate-100 shrink-0">
                    <h1 className="text-3xl font-light text-slate-900 tracking-tight">
                        {task?.title ?? 'Problem'}
                    </h1>
                    <div className="flex items-center gap-2 mt-3">
                        {problem?.difficulty && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                {problem.difficulty}
                            </span>
                        )}
                        {task?.subjectId && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-50 px-2 py-1 rounded-lg">
                                {task.subjectId}
                            </span>
                        )}
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 custom-scrollbar">

                    {/* Description */}
                    {problem?.description && (
                        <div className="text-sm text-slate-600 leading-relaxed">
                            {problem.description}
                        </div>
                    )}

                    {/* Constraints */}
                    {problem?.constraints?.length > 0 && (
                        <div>
                            <p className="text-sm font-semibold text-slate-700 mb-3">Constraints:</p>
                            <ul className="space-y-1.5 text-sm text-slate-500 list-disc pl-5">
                                {problem.constraints.map((c, i) => (
                                    <li key={i} className="font-mono text-xs leading-relaxed">{c}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Testcases (input viewer) */}
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

            {/* ── RIGHT PANEL: Editor + Outputs ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Editor toolbar */}
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
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>

                {/* Code Editor */}
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
                    <textarea
                        spellCheck={false}
                        className="flex-1 bg-[#1C1C1E] text-slate-200 font-mono text-sm px-5 py-5 outline-none resize-none leading-[1.625rem] selection:bg-red-500/30 custom-scrollbar"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                    />
                </div>

                {/* Output panels */}
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
                                    {isRunning
                                        ? <span className="text-slate-300 animate-pulse">Running…</span>
                                        : outputs[i]
                                            ? <span className={outputs[i] === tc.expected ? 'text-green-600' : 'text-red-500'}>{outputs[i]}</span>
                                            : <span className="text-slate-300">—</span>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-1">
                        <button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm shadow-red-200">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCompilerView;