import { useMemo } from 'react';
import {
    Users, BookOpen, Clock, CheckSquare,
    ChevronRight, ArrowRight, AlertCircle, LayoutGrid, FileText, Settings
} from 'lucide-react';
import {
    DUMMY_TEACHER,
    DUMMY_SECTIONS,
    DUMMY_SECTION_STUDENTS,
    DUMMY_TASKS,
    DUMMY_SUBMISSIONS,
    DUMMY_PROBLEMS,
} from '../../data/dummyData';

/* ─────────────────────────────────────────────────────────────────────────
   TeacherHomeView

   Props:
     teacher:         { name, title }
                      In production: from session / GET /api/auth/me
     sections:        Section[]           — includes enriched 'unchecked' count
                      In production: GET /api/sections?teacher=me
     sectionStudents: { [sectionId]: Student[] }
                      In production: GET /api/sections/:id/students
     tasks:           Task[]              — all tasks across all sections
                      In production: GET /api/tasks?teacher=me
     submissions:     { [taskId]: Submission[] }
                      In production: GET /api/submissions?teacher=me (grouped)
     problems:        Problem[]
                      In production: GET /api/problems?owner=me
     onGoToSections:  () => void
     onGoToProblems:  () => void
     onGoToManage:    () => void
     onSelectSection: (section) => void
─────────────────────────────────────────────────────────────────────────── */
const TeacherHomeView = ({
    teacher        = DUMMY_TEACHER,
    sections       = DUMMY_SECTIONS,
    sectionStudents = DUMMY_SECTION_STUDENTS,
    tasks          = DUMMY_TASKS,
    submissions    = DUMMY_SUBMISSIONS,
    problems       = DUMMY_PROBLEMS,
    onGoToSections,
    onGoToProblems,
    onGoToManage,
    onSelectSection,
}) => {

    // ── Derived stats ───────────────────────────────────────────────────
    const stats = useMemo(() => {
        const activeSections = sections.filter(s => s.status === 'active');

        const totalStudents = activeSections.reduce(
            (sum, s) => sum + (sectionStudents[s.id]?.length ?? 0), 0
        );

        // Flatten all submissions and filter pending
        const allPending = Object.entries(submissions).flatMap(([taskId, subs]) =>
            (subs ?? [])
                .filter(s => s.status === 'pending')
                .map(s => ({ ...s, taskId, task: tasks.find(t => t.id === taskId) }))
        );

        // Sort most recent first
        const recentPending = [...allPending]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 6);

        // Per-section stats
        const sectionStats = activeSections.map(sec => {
            const students  = sectionStudents[sec.id] ?? [];
            const secTasks  = tasks.filter(t => t.subjectId === sec.id);
            const pending   = secTasks.reduce((sum, t) => {
                return sum + (submissions[t.id] ?? []).filter(s => s.status === 'pending').length;
            }, 0);
            return {
                ...sec,
                studentCount: students.length,
                taskCount:    secTasks.length,
                pendingCount: pending,
            };
        });

        return {
            activeSectionCount: activeSections.length,
            totalStudents,
            pendingCount: allPending.length,
            problemCount: problems.length,
            recentPending,
            sectionStats,
        };
    }, [sections, sectionStudents, tasks, submissions, problems]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">

            {/* ── Profile header ──────────────────────────────────────── */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <p className="text-sm font-medium text-red-400 mb-1">{greeting}</p>
                    <h1 className="text-4xl font-normal text-slate-900 tracking-tight">{teacher.name}</h1>
                    <p className="text-slate-400 mt-2 text-base font-light">{teacher.title}</p>
                </div>
                {/* Quick action buttons */}
                <div className="flex flex-wrap gap-3">
                    <QuickAction icon={<LayoutGrid size={15} />} label="Sections"      onClick={onGoToSections} />
                    <QuickAction icon={<BookOpen   size={15} />} label="Problem Sets"  onClick={onGoToProblems} />
                    <QuickAction icon={<Settings   size={15} />} label="Manage"        onClick={onGoToManage}   />
                </div>
            </div>

            {/* ── Stat cards ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <StatCard
                    icon={<Users size={20} />}
                    label="Total Students"
                    value={stats.totalStudents}
                    sub="across active sections"
                    color="blue"
                />
                <StatCard
                    icon={<LayoutGrid size={20} />}
                    label="Active Sections"
                    value={stats.activeSectionCount}
                    sub="currently running"
                    color="emerald"
                />
                <StatCard
                    icon={<AlertCircle size={20} />}
                    label="Pending Reviews"
                    value={stats.pendingCount}
                    sub="submissions to check"
                    color="amber"
                    highlight={stats.pendingCount > 0}
                />
                <StatCard
                    icon={<BookOpen size={20} />}
                    label="Problem Bank"
                    value={stats.problemCount}
                    sub="problems authored"
                    color="red"
                />
            </div>

            {/* ── Main grid: sections + pending ───────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Active sections */}
                <div className="lg:col-span-3 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-7 py-5 border-b border-slate-50">
                        <h2 className="text-base font-semibold text-slate-800">Active Sections</h2>
                        <button
                            onClick={onGoToSections}
                            className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors"
                        >
                            View all <ArrowRight size={12} />
                        </button>
                    </div>

                    {stats.sectionStats.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-12">No active sections.</p>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {stats.sectionStats.map(sec => (
                                <button
                                    key={sec.id}
                                    onClick={() => onSelectSection?.(sec)}
                                    className="w-full flex items-center justify-between px-7 py-4 hover:bg-slate-50/70 transition-colors text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                            <FileText size={16} className="text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">{sec.id}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{sec.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-700">{sec.studentCount}</p>
                                            <p className="text-[10px] text-slate-400">students</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-700">{sec.taskCount}</p>
                                            <p className="text-[10px] text-slate-400">tasks</p>
                                        </div>
                                        {sec.pendingCount > 0 ? (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-amber-500">{sec.pendingCount}</p>
                                                <p className="text-[10px] text-amber-400">pending</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p className="text-sm font-semibold text-emerald-500">✓</p>
                                                <p className="text-[10px] text-emerald-400">all clear</p>
                                            </div>
                                        )}
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-red-400 transition-colors" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent pending submissions */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-7 py-5 border-b border-slate-50">
                        <h2 className="text-base font-semibold text-slate-800">Pending Reviews</h2>
                        {stats.pendingCount > 0 && (
                            <span className="text-xs font-bold text-white bg-amber-400 px-2.5 py-1 rounded-full">
                                {stats.pendingCount}
                            </span>
                        )}
                    </div>

                    {stats.recentPending.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <CheckSquare size={32} className="text-emerald-300" />
                            <p className="text-sm text-slate-400 font-medium">All submissions reviewed!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50 overflow-y-auto max-h-72 custom-scrollbar">
                            {stats.recentPending.map((sub, i) => (
                                <div key={`${sub.taskId}-${sub.studentId}`} className="px-7 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xs font-bold text-amber-500 shrink-0">
                                            {sub.name?.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-700 truncate">{sub.name}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{sub.task?.title ?? sub.taskId}</p>
                                        </div>
                                        <div className="ml-auto shrink-0 text-right">
                                            <p className="text-xs font-semibold text-slate-600">{sub.score}</p>
                                            <p className="text-[10px] text-slate-300">{sub.time?.split(',')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Sub-components ─────────────────────────────────────────────────────── */

const COLOR_MAP = {
    blue:    { bg: 'bg-blue-50',    icon: 'text-blue-400',    val: 'text-blue-700'    },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-400', val: 'text-emerald-700' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-400',   val: 'text-amber-700'   },
    red:     { bg: 'bg-red-50',     icon: 'text-red-400',     val: 'text-red-700'     },
};

const StatCard = ({ icon, label, value, sub, color = 'blue', highlight = false }) => {
    const c = COLOR_MAP[color];
    return (
        <div className={`bg-white rounded-[2rem] p-7 shadow-sm border transition-all duration-200 ${
            highlight ? 'border-amber-200 shadow-amber-100' : 'border-slate-100'
        }`}>
            <div className={`w-10 h-10 rounded-2xl ${c.bg} flex items-center justify-center mb-4`}>
                <span className={c.icon}>{icon}</span>
            </div>
            <p className={`text-3xl font-light ${c.val} mb-1`}>{value}</p>
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
    );
};

const QuickAction = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 text-slate-600 hover:text-red-600 text-sm font-medium transition-all duration-150 active:scale-95"
    >
        {icon}
        {label}
    </button>
);

export default TeacherHomeView;
