import { ChevronLeft, ChevronRight, ArrowLeft, Trophy } from 'lucide-react';

const ROW_COLORS = [
    'bg-red-500',    // rank 1
    'bg-red-900/40', // rank 2
    'bg-red-800/40', // rank 3
];
const rowColor = (row, index) => {
    if (row.isUser) return 'bg-red-500';
    return ROW_COLORS[index] ?? 'bg-slate-400';
};

/**
 * LeaderboardView
 * Props:
 *   task:     { title, subjectId }
 *   entries:  LeaderboardEntry[]  — { rank, name, time, compile, score, isUser }
 *             Passed from App.jsx via computeLeaderboard(DUMMY_SUBMISSIONS[taskId], studentId).
 *             In production: GET /api/tasks/:taskId/leaderboard.
 *   onBack:   () => void   — optional, shows a back button when provided
 */
const LeaderboardView = ({
    task,
    entries = [],
    onBack,
}) => {
    return (
        <div className="p-8 animate-in fade-in duration-500 max-w-6xl mx-auto">

            {/* ── Back button (teacher / any caller that provides onBack) ── */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
                >
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                        <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                    </span>
                    <span className="text-sm font-medium">Back to Submissions</span>
                </button>
            )}

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="mb-12 flex items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy size={32} className="text-red-400" />
                        <h1 className="text-6xl font-light text-slate-800 tracking-tight">Leaderboard</h1>
                    </div>
                    <p className="text-xl text-slate-500 mt-2 font-light">
                        {task?.title} &bull; {task?.subjectId}
                    </p>
                </div>
                <div className="text-right text-sm text-slate-400">
                    <p className="font-semibold text-slate-600">{entries.length}</p>
                    <p>submissions ranked</p>
                </div>
            </div>

            {/* ── Column headers ─────────────────────────────────────────── */}
            <div className="grid grid-cols-6 px-10 text-slate-500 text-sm font-light mb-4">
                <div className="col-span-1">No.</div>
                <div className="col-span-2">Name</div>
                <div className="col-span-1">Time Finished</div>
                <div className="col-span-1">Compile Time</div>
                <div className="col-span-1 text-right">Score</div>
            </div>

            {/* ── Rows ───────────────────────────────────────────────────── */}
            {entries.length === 0 ? (
                <div className="text-center py-16 text-slate-300">
                    <Trophy size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm">No submissions yet for this task.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map((row, i) => (
                        <div
                            key={i}
                            className={`grid grid-cols-6 items-center px-10 py-6 rounded-full text-white ${rowColor(row, i)} transition-transform hover:scale-[1.01] shadow-lg shadow-slate-200/50`}
                        >
                            <div className="col-span-1 font-black text-xl">#{row.rank}</div>
                            <div className="col-span-2 text-xl font-light">{row.name}</div>
                            <div className="col-span-1 text-lg font-light">{row.time}</div>
                            <div className="col-span-1 text-lg font-light">{row.compile}</div>
                            <div className="col-span-1 text-right text-xl font-light">{row.score}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Pagination ─────────────────────────────────────────────── */}
            <div className="mt-12 flex justify-center items-center gap-4">
                <button className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="text-slate-400 font-bold border-b-2 border-red-500 px-2">1</span>
                <button className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default LeaderboardView;