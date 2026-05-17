import { useState, useMemo } from 'react';
import {
    ArrowLeft, Search, X, CheckCircle2, Clock, AlertCircle,
    ChevronLeft, ChevronRight, Trophy, Filter, TrendingUp,
    Users, FileCheck, FileX,
} from 'lucide-react';
import { DUMMY_SUBMISSIONS } from '../../data/dummyData';

/* ─────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;

const STATUS_CFG = {
    pending:       { label: 'Validate',      labelDone: 'Validate',   bg: 'bg-red-500 hover:bg-red-600',    text: 'text-white',       dot: 'bg-amber-400', dotLabel: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-200'  },
    validated:     { label: 'Validated',     labelDone: 'Validated',  bg: 'bg-emerald-50 hover:bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-400', dotLabel: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    not_submitted: { label: 'Not Submitted', labelDone: '',           bg: '',                               text: '',                 dot: 'bg-slate-300', dotLabel: 'text-slate-400', badge: 'bg-slate-100 text-slate-400 border-slate-200'  },
};

/* Avatar initials */
const Avatar = ({ name }) => {
    const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-red-100">
            {initials}
        </div>
    );
};

/* Score pill — colour shifts with value.
 * score: INT (new) or "got/max" string (legacy). maxScore used as denominator. */
const ScorePill = ({ score, maxScore = 50 }) => {
    if (score == null) return <span className="text-slate-300 text-sm">—</span>;
    // Support both integer (new) and "got/max" string (legacy)
    const got = typeof score === 'number' ? score : Number(score.split('/')[0]);
    const max = typeof score === 'number' ? maxScore : Number(score.split('/')[1]);
    const display = `${got}/${max}`;
    const pct = max ? (got / max) * 100 : 0;
    const color = pct >= 80 ? 'text-emerald-600 bg-emerald-50' : pct >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-500 bg-red-50';
    return (
        <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${color}`}>{display}</span>
    );
};

/* ─────────────────────────────────────────────────────────────
   TeacherTaskSubmissionsView
───────────────────────────────────────────────────────────── */

/**
 * Props:
 *   section:     { id, name }
 *   task:        { id, title, deadline, score (max), unchecked }
 *   submissions: Submission[]  — from DUMMY_SUBMISSIONS[task.id]
 *   onBack:      () => void
 *   onLeaderboard: () => void
 */
const TeacherTaskSubmissionsView = ({
    section,
    task,
    submissions: initialSubmissions,
    onBack,
    onLeaderboard,
    onReviewStudent,
}) => {
    const submissions = initialSubmissions ?? DUMMY_SUBMISSIONS[task?.id] ?? [];

    const [search, setSearch]         = useState('');
    const [filterStatus, setFilter]   = useState('all');
    const [page, setPage]             = useState(1);
    const [rows, setRows]             = useState(submissions);

    /* validate toggle — called from review view callback */
    const handleValidate = (studentId, newStatus) => {
        setRows(prev => prev.map(r =>
            r.studentId === studentId ? { ...r, status: newStatus ?? (r.status === 'pending' ? 'validated' : 'pending') } : r
        ));
    };

    /* unsubmit — called from review view callback */
    const handleUnsubmit = (studentId) => {
        setRows(prev => prev.map(r =>
            r.studentId === studentId ? { ...r, status: 'not_submitted', score: null, time: null, compile: null } : r
        ));
    };

    /* filtered + searched */
    const filtered = useMemo(() => {
        return rows.filter(r => {
            const matchSearch =
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.email.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filterStatus === 'all' || r.status === filterStatus;
            return matchSearch && matchFilter;
        });
    }, [rows, search, filterStatus]);

    /* pagination */
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const goPage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

    /* summary stats */
    const pending       = rows.filter(r => r.status === 'pending').length;
    const validated     = rows.filter(r => r.status === 'validated').length;
    const notSubmitted  = rows.filter(r => r.status === 'not_submitted').length;
    const submitted     = rows.filter(r => r.status !== 'not_submitted').length;
    const avgScore = (() => {
        const maxScore = task?.maxScore ?? 50;
        const scored = rows.filter(r => r.score != null && r.status !== 'not_submitted');
        if (!scored.length) return null;
        const total = scored.reduce((sum, r) => {
            const got = typeof r.score === 'number' ? r.score : Number(r.score.split('/')[0]);
            return sum + (got / maxScore) * 100;
        }, 0);
        return Math.round(total / scored.length);
    })();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20 p-8 animate-in fade-in duration-500">

            {/* ── Back ────────────────────────────────────────────────── */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                    <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                </span>
                <span className="text-sm font-medium">Back to Section</span>
            </button>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    {/* Breadcrumb */}
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span>{section?.id}</span>
                        <span className="text-slate-300">›</span>
                        <span className="text-red-400">{task?.title}</span>
                    </p>
                    <h1 className="text-4xl font-light text-slate-900 tracking-tight">
                        Student <span className="font-semibold text-red-500">Submissions</span>
                    </h1>
                    {task?.deadline && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                            <Clock size={12} />
                            Deadline: {task.deadline}
                        </p>
                    )}
                </div>

                {/* Leaderboard link */}
                <button
                    onClick={onLeaderboard}
                    className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-300 hover:border-red-500 px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 self-start md:self-auto"
                >
                    <Trophy size={15} />
                    See Leaderboard
                </button>
            </div>

            {/* ── Stats row ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: <Users size={18} className="text-slate-400" />,     label: 'Total',         value: rows.length,    bg: 'bg-white',       val: 'text-slate-800' },
                    { icon: <AlertCircle size={18} className="text-amber-400" />, label: 'Pending Review', value: pending,       bg: 'bg-amber-50',    val: 'text-amber-600' },
                    { icon: <FileCheck size={18} className="text-emerald-400" />, label: 'Validated',      value: validated,     bg: 'bg-emerald-50',  val: 'text-emerald-600' },
                    { icon: <FileX size={18} className="text-slate-300" />,     label: 'Not Submitted', value: notSubmitted,   bg: 'bg-slate-50',    val: 'text-slate-500' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4 border border-slate-100 shadow-sm flex items-center gap-3`}>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                            {s.icon}
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${s.val}`}>{s.value}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Average score banner (when data exists) ─────────────── */}
            {avgScore !== null && (
                <div className="flex items-center gap-3 mb-6 bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm w-fit">
                    <TrendingUp size={16} className="text-red-400" />
                    <span className="text-sm text-slate-500">Class average:</span>
                    <span className={`text-sm font-bold ${avgScore >= 80 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                        {avgScore}%
                    </span>
                    <span className="text-xs text-slate-300">({submitted} submitted)</span>
                </div>
            )}

            {/* ── Toolbar ──────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search students…"
                        className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all shadow-sm"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                            <X size={13} />
                        </button>
                    )}
                </div>

                {/* Status filter */}
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-xs font-semibold">
                    {[
                        { key: 'all',           label: 'All'           },
                        { key: 'pending',        label: 'Pending'       },
                        { key: 'validated',      label: 'Validated'     },
                        { key: 'not_submitted',  label: 'Not Submitted' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => { setFilter(f.key); setPage(1); }}
                            className={`px-4 py-2.5 transition-all duration-200 ${
                                filterStatus === f.key
                                    ? 'bg-red-500 text-white'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table card ───────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">

                {/* Table header */}
                <div className="grid grid-cols-[2rem_1fr_1fr_auto_auto_auto_auto] items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="text-center">#</span>
                    <span>Student</span>
                    <span>Email</span>
                    <span className="text-center">Score</span>
                    <span className="text-center">Submitted</span>
                    <span className="text-center">Compile</span>
                    <span className="text-right pr-1">Action</span>
                </div>

                {/* Rows */}
                {pageRows.length === 0 ? (
                    <div className="py-16 text-center text-slate-300">
                        <Filter size={28} className="mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No results match your filter.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {pageRows.map((row, idx) => {
                            const cfg = STATUS_CFG[row.status];
                            const globalIdx = (page - 1) * PAGE_SIZE + idx + 1;
                            return (
                                <div
                                    key={row.studentId}
                                    className={`grid grid-cols-[2rem_1fr_1fr_auto_auto_auto_auto] items-center gap-3 px-6 py-3.5 hover:bg-slate-50/70 transition-colors duration-150 ${
                                        row.status === 'not_submitted' ? 'opacity-60' : ''
                                    }`}
                                >
                                    {/* # */}
                                    <span className="text-center text-xs text-slate-300 font-mono">{globalIdx}</span>

                                    {/* Name + avatar */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <Avatar name={row.name} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-700 truncate">{row.name}</p>
                                            <div className={`flex items-center gap-1 mt-0.5`}>
                                                <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                <span className={`text-[10px] font-semibold ${cfg.dotLabel}`}>
                                                    {row.status === 'pending' ? 'Awaiting validation' : row.status === 'validated' ? 'Validated' : 'Not submitted'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <span className="text-sm text-slate-400 truncate">{row.email}</span>

                                    {/* Score */}
                                    <div className="text-center">
                                        <ScorePill score={row.score} maxScore={task?.maxScore ?? 50} />
                                    </div>

                                    {/* Time */}
                                    <span className="text-xs text-slate-400 text-center whitespace-nowrap">
                                        {row.time ?? '—'}
                                    </span>

                                    {/* Compile */}
                                    <span className="text-xs font-mono text-slate-400 text-center">
                                        {row.compile ?? '—'}
                                    </span>

                                    {/* Action */}
                                    <div className="flex justify-end">
                                        {row.status === 'pending' && (
                                            <button
                                                onClick={() => onReviewStudent?.(row, handleValidate, handleUnsubmit)}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-all duration-200 active:scale-95 shadow-sm shadow-red-100"
                                            >
                                                <CheckCircle2 size={12} />
                                                Review
                                            </button>
                                        )}
                                        {row.status === 'validated' && (
                                            <button
                                                onClick={() => onReviewStudent?.(row, handleValidate, handleUnsubmit)}
                                                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 text-xs font-semibold rounded-xl transition-all"
                                            >
                                                <CheckCircle2 size={12} />
                                                Validated
                                            </button>
                                        )}
                                        {row.status === 'not_submitted' && (
                                            <span className="text-xs font-semibold text-slate-300 px-2">—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Pagination ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                    Showing <span className="font-semibold text-slate-600">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold text-slate-600">{filtered.length}</span> students
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goPage(page - 1)}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                            key={p}
                            onClick={() => goPage(p)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
                                p === page
                                    ? 'bg-red-500 text-white border border-red-500'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                            }`}
                        >
                            {p}
                        </button>
                    ))}

                    <button
                        onClick={() => goPage(page + 1)}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherTaskSubmissionsView;
