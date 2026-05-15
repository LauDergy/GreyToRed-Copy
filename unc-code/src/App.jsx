import React, { useState } from 'react';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  User,
  Terminal,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Play,
  Save,
  ChevronLeft
} from 'lucide-react';

// --- Sub-components ---

const CircularProgress = ({ percentage, label, sublabel }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-slate-500 mb-2 whitespace-nowrap font-medium">{label}</p>
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            className="text-red-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-lg font-bold text-slate-700">{sublabel}</span>
      </div>
    </div>
  );
};

// --- Content Views ---

const HomeContent = ({ onSelectSubject }) => {
  const subjects = [
    { id: 'BCS221-OCa', name: 'Fundamentals of Programming', instructor: 'Danny Casimero' },
    { id: 'MATH101-CS', name: 'Discrete Mathematics', instructor: 'Maria Santos' },
    { id: 'GE104-UNC', name: 'Art Appreciation', instructor: 'Ricardo Dela Cruz' }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight">John Michael Laureles</h1>
          <p className="text-slate-500 mt-2 text-xl font-light">1st year BSCS</p>
          <p className="text-slate-400 text-sm mt-1 font-mono tracking-wider">25-29019</p>
        </div>
        <div className="flex gap-16">
          <CircularProgress label="Tasks Completed" percentage={50} sublabel="1/2" />
          <CircularProgress label="Grade Percentage" percentage={40} sublabel="40%" />
        </div>
      </div>

      <div className="pt-4"><h2 className="text-2xl font-semibold text-slate-800">Enrolled Subjects</h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.map((sub) => (
          <div key={sub.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-red-200 hover:shadow-md transition-all duration-300">
            <div className="min-h-[100px]">
              <h3 className="text-2xl font-medium text-slate-800 mb-2">{sub.id}</h3>
              <p className="text-slate-600 text-lg">{sub.name}</p>
              <p className="text-slate-400 text-sm mt-2">{sub.instructor}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => onSelectSubject(sub)} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-90">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SubjectDetailContent = ({ subject, onSelectTask }) => {
  const tasks = [
    { id: 'task-1', title: 'Sorting Algorithm', status: 'In Progress', score: '0/50', subjectId: subject.id },
    { id: 'task-2', title: 'Two Sums', status: 'Completed', score: '40/50', isCompleted: true, subjectId: subject.id }
  ];

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-normal text-slate-900 tracking-tight">{subject.id}</h1>
          <p className="text-slate-500 mt-2 text-xl font-light">{subject.name}</p>
          <p className="text-slate-400 text-sm mt-1">{subject.instructor}</p>
        </div>
        <div className="flex gap-16">
          <CircularProgress label="Tasks Completed" percentage={50} sublabel="1/2" />
          <CircularProgress label="Grade Percentage" percentage={40} sublabel="40%" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-red-200 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-normal text-slate-800">{task.title}</h3>
              <span className="text-2xl font-light text-slate-400">{task.score}</span>
            </div>
            <p className={`text-sm font-medium ${task.isCompleted ? 'text-red-400' : 'text-slate-400'}`}>
              {task.status}
            </p>
            <div className="mt-12 flex justify-end">
              <button
                onClick={() => onSelectTask(task)}
                className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-90"
              >
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskCompilerView = ({ task }) => {
  return (
    <div className="p-8 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left: Problem Description */}
        <div className="space-y-6 overflow-y-auto pr-4">
          <h1 className="text-5xl font-light text-slate-800 mb-8">{task.title}</h1>

          <div className="text-slate-600 space-y-4 text-lg font-light leading-relaxed">
            <p>Given an array of integers <code className="bg-slate-100 px-1 rounded">nums</code>, sort the array in ascending order and return it.</p>
            <p>You must solve the problem without any built-in functions in O(nlog(n)) time complexity and with the smallest space complexity possible.</p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <p className="font-medium text-slate-800">Example 1:</p>
              <div className="bg-slate-50 p-4 rounded-xl text-sm font-mono text-slate-600">
                Input: nums = [5,2,3,1]<br />
                Output: [1,2,3,5]
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-slate-800">Constraints:</p>
              <ul className="list-disc pl-5 text-sm text-slate-500 space-y-1">
                <li>1 &le; nums.length &le; 5 * 10⁴</li>
                <li>-5 * 10⁴ &le; nums[i] &le; 5 * 10⁴</li>
              </ul>
            </div>
          </div>

          {/* Testcases */}
          <div className="space-y-4 pt-8">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-400 text-white px-4 py-2 text-sm font-medium">Testcase 1</div>
              <div className="bg-slate-100 p-4 font-mono text-sm">nums = [5,2,3,1]</div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-400 text-white px-4 py-2 text-sm font-medium">Testcase 2</div>
              <div className="bg-slate-100 p-4 font-mono text-sm">nums = [5,1,1,2,0,0]</div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Docker Runtime */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 bg-[#282C34] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
            <div className="bg-[#21252B] px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <span className="text-slate-400 text-xs font-mono">Java</span>
              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-colors">
                <Play size={14} fill="white" /> Run
              </button>
            </div>
            <div className="flex-1 p-6 font-mono text-slate-300 text-sm">
              <span className="text-slate-500 mr-4">1</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-400 text-white px-4 py-2 text-sm font-medium">Output 1</div>
              <div className="bg-slate-100 p-4 h-12"></div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-400 text-white px-4 py-2 text-sm font-medium">Output 2</div>
              <div className="bg-slate-100 p-4 h-12"></div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-100">
                <Save size={18} /> Save
              </button>
              <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-red-100">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardView = ({ task }) => {
  const leaderboardData = [
    { rank: 1, name: 'John Michael Laureles', time: 'Feb 14, 19:49:14', compile: '2.16s', score: '40/50', isUser: true },
    { rank: 2, name: 'Sobbie', time: 'Feb 14, 20:49:24', compile: '1.13s', score: '10/50', opacity: 'bg-red-900/40' },
    { rank: 3, name: 'Moddie', time: 'Feb 14, 23:59:99', compile: '1.28s', score: '10/50', opacity: 'bg-red-800/40' },
    { rank: 4, name: 'John Michael Laureles', time: 'Feb 14, 19:49:14', compile: '2.16s', score: '40/50', opacity: 'bg-slate-400' },
    { rank: 4, name: 'John Michael Laureles', time: 'Feb 14, 19:49:14', compile: '2.16s', score: '40/50', opacity: 'bg-slate-400' },
    { rank: 4, name: 'John Michael Laureles', time: 'Feb 14, 19:49:14', compile: '2.16s', score: '40/50', opacity: 'bg-slate-400' },
  ];

  return (
    <div className="p-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-6xl font-light text-slate-800 tracking-tight">Leaderboard for {task.title}</h1>
        <p className="text-2xl text-slate-500 mt-2 font-light">{task.subjectId}</p>
      </div>

      <div className="space-y-4">
        {/* Header */}
        <div className="grid grid-cols-6 px-10 text-slate-500 text-lg font-light mb-4">
          <div className="col-span-1">No. &uarr;&darr;</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-1">Time Finished &uarr;&darr;</div>
          <div className="col-span-1">Compile Time &uarr;&darr;</div>
          <div className="col-span-1 text-right">Score &uarr;&darr;</div>
        </div>

        {/* Rows */}
        {leaderboardData.map((row, i) => (
          <div
            key={i}
            className={`grid grid-cols-6 items-center px-10 py-6 rounded-full text-white ${row.isUser ? 'bg-red-500' : row.opacity || 'bg-slate-400'} transition-transform hover:scale-[1.01]`}
          >
            <div className="col-span-1 font-black text-xl">#{row.rank}</div>
            <div className="col-span-2 text-xl font-light">{row.name}</div>
            <div className="col-span-1 text-lg font-light">{row.time}</div>
            <div className="col-span-1 text-lg font-light">{row.compile}</div>
            <div className="col-span-1 text-right text-xl font-light">{row.score}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center items-center gap-4">
        <button className="p-1 bg-red-500 rounded text-white"><ChevronLeft size={20} /></button>
        <span className="text-slate-400 font-medium border-b-2 border-red-500 px-1">1</span>
        <span className="text-slate-400 font-medium">2</span>
        <button className="p-1 bg-red-500 rounded text-white"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [subjectsExpanded, setSubjectsExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const subjects = [
    { id: 'BCS221-OCa', name: 'Fundamentals of Programming', instructor: 'Danny Casimero' },
    { id: 'MATH101-CS', name: 'Discrete Mathematics', instructor: 'Maria Santos' },
    { id: 'GE104-UNC', name: 'Art Appreciation', instructor: 'Ricardo Dela Cruz' }
  ];

  const allTasks = [
    { id: 'task-1', title: 'Sorting Algorithm', status: 'In Progress', score: '0/50', subjectId: 'BCS221-OCa' },
    { id: 'task-2', title: 'Two Sums', status: 'Completed', score: '40/50', isCompleted: true, subjectId: 'BCS221-OCa' },
    { id: 'task-3', title: 'Logic Gates', status: 'In Progress', score: '0/30', subjectId: 'MATH101-CS' }
  ];

  const handleSubjectSelect = (sub) => {
    setSelectedSubject(sub);
    setSelectedTask(null);
    setActiveTab('subject-detail');
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setActiveTab('task-view');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex font-sans antialiased overflow-hidden">
      {/* --- LEFT SIDEBAR --- */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className={`flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'hidden'}`}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl">U</div>
            <span className="font-black text-xl text-slate-900 tracking-tighter">UNC-CODE</span>
          </div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Home */}
          <button
            onClick={() => { setActiveTab('home'); setSelectedSubject(null); setSelectedTask(null); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={22} />
            {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Home</span>}
          </button>

          {/* Subjects Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setSubjectsExpanded(!subjectsExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all text-slate-500 hover:bg-slate-50`}
            >
              <div className="flex items-center gap-4">
                <Trophy size={22} />
                {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Subjects</span>}
              </div>
              {isSidebarOpen && (subjectsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>
            {subjectsExpanded && isSidebarOpen && (
              <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubjectSelect(sub)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedSubject?.id === sub.id ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    {sub.id}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setTasksExpanded(!tasksExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all text-slate-500 hover:bg-slate-50`}
            >
              <div className="flex items-center gap-4">
                <Code2 size={22} />
                {isSidebarOpen && <span className="font-bold tracking-tight text-sm">Task</span>}
              </div>
              {isSidebarOpen && (tasksExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
            </button>
            {tasksExpanded && isSidebarOpen && (
              <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {allTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task)}
                    className={`w-full text-left px-4 py-2 rounded-xl text-xs font-semibold transition-all ${selectedTask?.id === task.id ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="p-6 border-t border-slate-100">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Docker Running</span>
            </div>
          )}
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto h-screen`}>
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500" size={20} />
              <input type="text" placeholder="Search modules..." className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-slate-400 hover:text-slate-600 relative"><Bell size={24} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[10px] text-white font-bold flex items-center justify-center rounded-full border-2 border-white">2</span></button>
            <div className="flex items-center gap-5 border-l border-slate-100 pl-8">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">Rameses Jr.</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tighter">Computer Science Dept</p>
              </div>
              <div className="w-11 h-11 rounded-2xl overflow-hidden ring-4 ring-slate-50"><img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100" alt="avatar" className="w-full h-full object-cover" /></div>
              <button className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={22} /></button>
            </div>
          </div>
        </header>

        <div className="pb-20">
          {activeTab === 'home' && <HomeContent onSelectSubject={handleSubjectSelect} />}
          {activeTab === 'subject-detail' && selectedSubject && <SubjectDetailContent subject={selectedSubject} onSelectTask={handleTaskSelect} />}
          {activeTab === 'task-view' && selectedTask && (
            selectedTask.isCompleted ? <LeaderboardView task={selectedTask} /> : <TaskCompilerView task={selectedTask} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;