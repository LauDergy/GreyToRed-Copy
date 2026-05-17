import { useState } from 'react';
import { ArrowLeft, ArrowRight, Clock, Plus, Users, AlertCircle, CheckCircle2, BookOpen, X, Check } from 'lucide-react';
import { DUMMY_TASKS, DUMMY_SECTION_STUDENTS, DUMMY_PROBLEMS, formatDeadline } from '../../data/dummyData';
import ProblemPreviewModal from '../../components/ProblemPreviewModal';

/* ─────────────────────────────────────────────────────────────
   Deadline helpers
───────────────────────────────────────────────────────────── */
const deadlineState = (deadline) => {
    if (!deadline) return 'none';
    const diff = new Date(deadline) - new Date();
    if (diff < 0)            return 'overdue';
    if (diff < 3 * 86400000) return 'soon';
    return 'ok';
};

const deadlineCfg = {
    overdue: { color: 'text-red-500',   bg: 'bg-red-50',   icon: <AlertCircle size={11} className="shrink-0" /> },
    soon:    { color: 'text-amber-500', bg: 'bg-amber-50', icon: <Clock       size={11} className="shrink-0" /> },
    ok:      { color: 'text-slate-400', bg: 'bg-slate-50', icon: <Clock       size={11} className="shrink-0" /> },
    none:    { color: 'text-slate-300', bg: '',             icon: null },
};

/* ─────────────────────────────────────────────────────────────
   Difficulty colours
───────────────────────────────────────────────────────────── */
const DIFF_COLOR = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ─────────────────────────────────────────────────────────────
   Add Task Modal
   - Shows teacher's problem collection as selectable cards
   - One problem can be selected at a time (toggle with ✓)
   - Date + time deadline picker in footer
   - "Set Task" calls onAddTask(problem, isoDeadline)
     In production: POST /api/tasks { sectionId, problemId, deadline }
───────────────────────────────────────────────────────────── */
const AddTaskModal = ({ section, problems, onClose, onAddTask }) => {
    const [selected,  setSelected]  = useState(null);   // problem id
    const [previewing, setPreviewing] = useState(null); // problem object
    const [date,      setDate]      = useState('');
    const [time,      setTime]      = useState('');

    const canSubmit = selected && date && time;

    const handleSetTask = () => {
        if (!canSubmit) return;
        const problem  = problems.find(p => p.id === selected);
        const deadline = `${date}T${time}`; // ISO: "2026-06-01T23:59"
        onAddTask?.(problem, deadline);
        // TODO: POST /api/tasks { sectionId: section.id, problemId: problem.id, deadline }
        onClose();
    };

    return (
        <>
            <ProblemPreviewModal
                problem={previewing}
                onClose={() => setPreviewing(null)}
                showHidden
            />

            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-[#F3F3F3] rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                    style={{ maxHeight: '90vh' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* ── Header ─────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-7 pt-7 pb-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            Add Task to <span className="text-red-500">{section?.id}</span>
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all active:scale-90 shrink-0"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* ── Problem grid ───────────────────────────────── */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4 custom-scrollbar">
                        {problems.length === 0 ? (
                            <div className="text-center py-16 text-slate-400">
                                <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No problems in your collection yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {problems.map(p => {
                                    const isSelected = selected === p.id;
                                    return (
                                        <div
                                            key={p.id}
                                            className={`bg-white rounded-2xl p-6 border-2 transition-all duration-200 ${
                                                isSelected
                                                    ? 'border-red-400 shadow-md shadow-red-100'
                                                    : 'border-transparent shadow-sm'
                                            }`}
                                        >
                                            {/* Info */}
                                            <h3 className="text-2xl font-light text-slate-900 leading-snug line-clamp-1 mb-0.5">
                                                {p.title}
                                            </h3>
                                            <p className={`text-base font-semibold ${DIFF_COLOR[p.difficulty] ?? 'text-slate-500'}`}>
                                                {cap(p.difficulty)}
                                            </p>
                                            <p className="text-sm text-slate-400">By {p.author}</p>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3 mt-5">
                                                <button
                                                    onClick={() => setPreviewing(p)}
                                                    className="bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold px-5 py-2 rounded-full shadow-sm shadow-red-200 transition-all duration-200"
                                                >
                                                    Preview
                                                </button>

                                                {/* Select toggle */}
                                                <button
                                                    onClick={() => setSelected(isSelected ? null : p.id)}
                                                    className={`ml-auto w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                                                        isSelected
                                                            ? 'bg-slate-300 text-slate-600 hover:bg-slate-400'
                                                            : 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200'
                                                    }`}
                                                    aria-label={isSelected ? 'Deselect' : 'Select'}
                                                >
                                                    {isSelected
                                                        ? <Check size={16} strokeWidth={2.5} />
                                                        : <Plus  size={16} strokeWidth={2.5} />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Footer — deadline + set task ───────────────── */}
                    <div className="border-t border-slate-200 bg-white px-7 py-4 flex items-center gap-4 shrink-0">
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">Set Deadline:</span>

                        {/* Date */}
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                        />

                        {/* Time */}
                        <input
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-36 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                        />

                        <button
                            disabled={!canSubmit}
                            onClick={handleSetTask}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95 whitespace-nowrap ${
                                canSubmit
                                    ? 'bg-red-500 hover:bg-red-600 shadow-sm shadow-red-200'
                                    : 'bg-slate-300 cursor-not-allowed'
                            }`}
                        >
                            Set Task
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────────────
   Teacher Task Card
───────────────────────────────────────────────────────────── */
const TeacherTaskCard = ({ task, onSelect }) => {
    const state = deadlineState(task.deadline);
    const cfg   = deadlineCfg[state];

    return (
        <div
            onClick={() => onSelect?.(task)}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 hover:border-red-200 hover:shadow-lg hover:shadow-red-50 transition-all duration-300 group flex flex-col min-h-[210px] cursor-pointer"
        >
            <div className="flex-1">
                <div className="flex items-start gap-4 mb-3">
                    <h3 className="text-2xl font-normal text-slate-800 leading-snug group-hover:text-red-500 transition-colors duration-200">
                        {task.title}
                    </h3>
                </div>

                {task.unchecked > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-full w-fit px-3 py-1 mb-2">
                        <AlertCircle size={11} />
                        {task.unchecked} unchecked {task.unchecked === 1 ? 'submission' : 'submissions'}
                    </div>
                )}
                {task.unchecked === 0 && task.isCompleted && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-full w-fit px-3 py-1 mb-2">
                        <CheckCircle2 size={11} />
                        All checked
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between">
                {task.deadline ? (
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                        {cfg.icon}
                        Deadline: {formatDeadline(task.deadline)}
                    </span>
                ) : (
                    <span className="text-xs text-slate-300">No deadline set</span>
                )}

                <button
                    onClick={e => { e.stopPropagation(); onSelect?.(task); }}
                    className="w-11 h-11 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-90 transition-all shrink-0"
                >
                    <ArrowRight size={19} />
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────
   TeacherSectionDetailView

   Props:
     section:            { id, name, unchecked, status }
     tasks:              Task[]  — pre-filtered to this section's subjectId
     sectionStudents:    Student[]
     problems:           Problem[]  — teacher's collection (DUMMY_PROBLEMS)
                         In production: GET /api/problems?owner=me
     onBack:             () => void
     onTaskSelect:       (task) => void
     onAddTask:          (problem, deadline) => void
                         In production: POST /api/tasks { sectionId, problemId, deadline }
     onManageStudents:   () => void
───────────────────────────────────────────────────────────── */
const TeacherSectionDetailView = ({
    section,
    tasks,
    sectionStudents,
    problems = DUMMY_PROBLEMS,
    onBack,
    onTaskSelect,
    onAddTask,
    onManageStudents,
}) => {
    const [showAddTask, setShowAddTask] = useState(false);

    const displayTasks    = tasks          ?? DUMMY_TASKS.filter(t => t.subjectId === section?.id);
    const displayStudents = sectionStudents ?? DUMMY_SECTION_STUDENTS[section?.id] ?? [];

    const totalStudents  = displayStudents.length;
    const totalTasks     = displayTasks.length;
    const uncheckedTotal = displayTasks.reduce((acc, t) => acc + (t.unchecked ?? 0), 0);

    return (
        <>
            {showAddTask && (
                <AddTaskModal
                    section={section}
                    problems={problems}
                    onClose={() => setShowAddTask(false)}
                    onAddTask={(problem, deadline) => {
                        onAddTask?.(problem, deadline);
                        setShowAddTask(false);
                    }}
                />
            )}

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20 p-8 animate-in fade-in duration-500">

                {/* ── Back ─────────────────────────────────────────── */}
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
                >
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                        <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                    </span>
                    <span className="text-sm font-medium">Back to Sections</span>
                </button>

                {/* ── Header card ───────────────────────────────────── */}
                <div className="bg-white rounded-[2.5rem] px-10 py-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-red-400 to-rose-500 rounded-l-[2.5rem]" />

                    <div className="pl-4">
                        <h1 className="text-4xl font-semibold text-slate-900 tracking-tight">{section?.id}</h1>
                        <p className="text-slate-500 mt-1 text-lg font-light">{section?.name}</p>

                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <Users size={14} className="text-red-400" />
                                <span className="font-semibold text-slate-700">{totalStudents}</span>
                                <span>students</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                <BookOpen size={14} className="text-red-400" />
                                <span className="font-semibold text-slate-700">{totalTasks}</span>
                                <span>tasks</span>
                            </div>
                            {uncheckedTotal > 0 && (
                                <>
                                    <div className="w-px h-4 bg-slate-200" />
                                    <div className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
                                        <AlertCircle size={14} />
                                        {uncheckedTotal} unchecked
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[170px]">
                        <button
                            onClick={() => setShowAddTask(true)}
                            className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm shadow-red-200 flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            Add Task
                        </button>
                        <button
                            onClick={onManageStudents}
                            className="w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 text-sm font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Users size={15} />
                            Manage Students
                        </button>
                    </div>
                </div>

                {/* ── Task grid ─────────────────────────────────────── */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tasks</h2>
                    {uncheckedTotal > 0 && (
                        <span className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 rounded-full px-3 py-1">
                            {uncheckedTotal} pending review
                        </span>
                    )}
                </div>

                {displayTasks.length === 0 ? (
                    <div className="text-center py-24 text-slate-300">
                        <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm font-medium">No tasks yet.</p>
                        <p className="text-xs mt-1">Click "Add Task" to create the first one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayTasks.map(task => (
                            <TeacherTaskCard
                                key={task.id}
                                task={task}
                                onSelect={onTaskSelect}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TeacherSectionDetailView;
