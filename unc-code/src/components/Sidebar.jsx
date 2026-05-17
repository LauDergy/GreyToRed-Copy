import {
    LayoutDashboard,
    Trophy,
    Code2,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Puzzle,
    Layout,
    Users,
    ArrowRight,
} from 'lucide-react';
import logo from '../assets/LOGO.svg';

const Sidebar = ({
    role = 'student',
    isSidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    subjectsExpanded,
    setSubjectsExpanded,
    tasksExpanded,
    setTasksExpanded,
    subjects,
    allTasks,
    selectedSubject,
    selectedTask,
    handleSubjectSelect,
    handleTaskSelect,
}) => {
    const navBtn = (tab) =>
        `w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === tab
            ? 'bg-slate-900 text-white shadow-lg'
            : 'text-slate-500 hover:bg-slate-50'
        }`;

    return (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}>

            {/* Logo — clicking toggles sidebar. Hover shows directional red arrow. */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="group h-20 w-full flex items-center px-5 border-b border-slate-100 overflow-hidden relative cursor-pointer select-none"
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
                {/* Full logo (open state) */}
                {isSidebarOpen ? (
                    <img
                        src={logo}
                        alt="GreyToRed"
                        className="h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-30"
                        draggable={false}
                    />
                ) : (
                    <img
                        src={logo}
                        alt="GreyToRed"
                        className="h-8 w-8 object-contain mx-auto transition-opacity duration-200 group-hover:opacity-30"
                        draggable={false}
                    />
                )}

                {/* Red arrow overlay — appears on hover */}
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {isSidebarOpen
                        ? <ChevronLeft  size={28} className="text-red-500 drop-shadow-sm" strokeWidth={2.5} />
                        : <ArrowRight   size={28} className="text-red-500 drop-shadow-sm" strokeWidth={2.5} />
                    }
                </span>
            </button>

            {/* Nav Links */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">

                {/* ── Home (shared) ── */}
                <button
                    onClick={() => { setActiveTab('home'); }}
                    className={navBtn('home')}
                >
                    <LayoutDashboard size={22} />
                    {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Home</span>}
                </button>

                {/* ── STUDENT nav ── */}
                {role === 'student' && (
                    <div className="space-y-1">
                        {/* Subjects dropdown */}
                        <button
                            onClick={() => setSubjectsExpanded(!subjectsExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50"
                        >
                            <div className="flex items-center gap-4">
                                <Trophy size={22} />
                                {isSidebarOpen && <span className="font-bold text-sm">Subjects</span>}
                            </div>
                            {isSidebarOpen && (subjectsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>
                        {subjectsExpanded && isSidebarOpen && (
                            <div className="pl-4 space-y-1">
                                {subjects.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleSubjectSelect(s)}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSubject?.id === s.id
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {s.id}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tasks dropdown */}
                        <button
                            onClick={() => setTasksExpanded(!tasksExpanded)}
                            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-50"
                        >
                            <div className="flex items-center gap-4">
                                <Code2 size={22} />
                                {isSidebarOpen && <span className="font-bold text-sm">Tasks</span>}
                            </div>
                            {isSidebarOpen && (tasksExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                        </button>
                        {tasksExpanded && isSidebarOpen && (
                            <div className="pl-4 space-y-1">
                                {allTasks.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => handleTaskSelect(t)}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedTask?.id === t.id
                                                ? 'text-red-500 bg-red-50'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {t.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TEACHER nav ── */}
                {role === 'teacher' && (
                    <>
                        <button onClick={() => setActiveTab('problem-sets')} className={navBtn('problem-sets')}>
                            <Puzzle size={22} />
                            {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Problem Sets</span>}
                        </button>

                        <button onClick={() => setActiveTab('sections')} className={navBtn('sections')}>
                            <Layout size={22} />
                            {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Sections</span>}
                        </button>

                        <button onClick={() => setActiveTab('students')} className={navBtn('students')}>
                            <Users size={22} />
                            {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Students</span>}
                        </button>
                    </>
                )}
            </nav>

            {/* Footer Status */}
            <div className="p-6 border-t border-slate-100">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {isSidebarOpen && <span>Docker Running</span>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
