import { useState } from 'react';
import LoginPage from './views/LoginPage';
import OnboardingPage from './views/OnboardingPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// ── Student views ──────────────────────────────────────────────────────────
import HomeContent from './views/student_view/HomeContent';
import SubjectDetailContent from './views/student_view/SubjectDetailContent';
import TaskCompilerView from './views/student_view/TaskCompilerView';

// ── Teacher views ──────────────────────────────────────────────────────────
import TeacherSectionsView from './views/teacher_view/TeacherSectionsView';
import CreateSectionView from './views/teacher_view/CreateSectionView';
import ManageSectionsView from './views/teacher_view/ManageSectionsView';
import TeacherSectionDetailView from './views/teacher_view/TeacherSectionDetailView';
import TeacherTaskSubmissionsView from './views/teacher_view/TeacherTaskSubmissionsView';
import TeacherStudentReviewView from './views/teacher_view/TeacherStudentReviewView';
import ProblemSetsView from './views/teacher_view/ProblemSetsView';
import CreateProblemView from './views/teacher_view/CreateProblemView';
import ProblemCollectionView from './views/teacher_view/ProblemCollectionView';
import ExploreProblemSetsView from './views/teacher_view/ExploreProblemSetsView';
import TeacherProblemTestView from './views/teacher_view/TeacherProblemTestView';
import TeacherHomeView from './views/teacher_view/TeacherHomeView';

// ── Shared views ───────────────────────────────────────────────────────────
import LeaderboardView from './views/LeaderboardView';


// ── All app data flows from here ──────────────────────────────────────────
// When the backend is ready, replace these imports with API calls/context.
import {
    DUMMY_STUDENT,
    DUMMY_TEACHER,
    DUMMY_SUBJECTS,
    DUMMY_TASKS,
    DUMMY_SECTIONS,
    DUMMY_SECTION_STUDENTS,
    DUMMY_SUBMISSIONS,
    DUMMY_PROBLEMS,
    DUMMY_PUBLIC_PROBLEMS,
    PROBLEM_MAP,
    formatDeadline,
    computeStudentStats,
    computeLeaderboard,
} from './data/dummyData';

/**
 * ==========================================
 * MAIN APP COMPONENT
 * ==========================================
 */
const App = () => {
    // ── Auth state ────────────────────────────────────────────────────────────
    // currentUser: null | { name, email, role, isProfileComplete, studentId?, yearLevel?, course? }
    // In production: populated from JWT / session after POST /api/auth/login
    const [currentUser, setCurrentUser] = useState(null);
    const role = currentUser?.role ?? null;

    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('home');
    const [subjectsExpanded, setSubjectsExpanded] = useState(false);
    const [tasksExpanded, setTasksExpanded] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedTeacherTask, setSelectedTeacherTask] = useState(null);
    const [selectedSubmission, setSelectedSubmission]   = useState(null);
    const [submissionCallbacks, setSubmissionCallbacks] = useState({});
    const [testProblem,         setTestProblem]         = useState(null);

    const handleLogin = (userRole, userObj) => {
        setCurrentUser(userObj ?? { name: '', email: '', role: userRole, isProfileComplete: true });
        setActiveTab('home');
    };

    const handleOnboardingComplete = (profileData) => {
        // profileData: { studentId, yearLevel, course }
        // TODO: PATCH /api/users/me { ...profileData, isProfileComplete: true }
        setCurrentUser(prev => ({ ...prev, ...profileData, isProfileComplete: true }));
        setActiveTab('home');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setActiveTab('home');
        setSelectedSubject(null);
        setSelectedTask(null);
        setSelectedSection(null);
    };

    const handleSubjectSelect = (sub) => {
        setSelectedSubject(sub);
        setSelectedTask(null);
        setActiveTab('subject-detail');
    };

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        setActiveTab('task-view');
    };

    // ── Not logged in ─────────────────────────────────────────────────────
    if (!role) {
        return <LoginPage onLogin={handleLogin} />;
    }

    // ── Onboarding gate — shown on first-ever login ───────────────────────
    // isProfileComplete: false means the user has no studentId/yearLevel/course yet.
    // In production: check JWT claim or GET /api/users/me on app load.
    if (!currentUser.isProfileComplete) {
        return (
            <OnboardingPage
                user={currentUser}
                onComplete={handleOnboardingComplete}
            />
        );
    }

    // Tasks for the currently selected subject
    const subjectTasks = selectedSubject
        ? DUMMY_TASKS.filter(t => t.subjectId === selectedSubject.id)
        : [];

    // Compute unchecked count per section by summing pending submissions
    // across all tasks whose subjectId matches the section id.
    const uncheckedBySectionId = DUMMY_SECTIONS.reduce((acc, section) => {
        const sectionTasks = DUMMY_TASKS.filter(t => t.subjectId === section.id);
        const count = sectionTasks.reduce((sum, task) => {
            const taskSubs = DUMMY_SUBMISSIONS[task.id] ?? [];
            return sum + taskSubs.filter(s => s.status === 'pending').length;
        }, 0);
        acc[section.id] = count;
        return acc;
    }, {});

    // Sections enriched with the computed unchecked count
    const enrichedSections = DUMMY_SECTIONS.map(s => ({
        ...s,
        unchecked: uncheckedBySectionId[s.id] ?? 0,
    }));

    // Hide header when in the compiler / IDE view
    const showHeader = !(activeTab === 'task-view' && selectedTask && !selectedTask.isCompleted);

    // ── Logged in ─────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans antialiased overflow-hidden">

            {/* SIDEBAR */}
            <Sidebar
                role={role}
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                subjectsExpanded={subjectsExpanded}
                setSubjectsExpanded={setSubjectsExpanded}
                tasksExpanded={tasksExpanded}
                setTasksExpanded={setTasksExpanded}
                subjects={DUMMY_SUBJECTS}
                allTasks={DUMMY_TASKS}
                selectedSubject={selectedSubject}
                selectedTask={selectedTask}
                handleSubjectSelect={handleSubjectSelect}
                handleTaskSelect={handleTaskSelect}
            />

            {/* MAIN CONTENT */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto h-screen`}>

                {/* HEADER — hidden in compiler/IDE view */}
                {showHeader && <Header role={role} onLogout={handleLogout} />}

                <div className="pb-20">

                    {/* ── Student routes ── */}
                    {role === 'student' && activeTab === 'home' && (
                        <HomeContent
                            student={DUMMY_STUDENT}
                            tasks={DUMMY_TASKS}
                            subjects={DUMMY_SUBJECTS}
                            onSelectSubject={handleSubjectSelect}
                        />
                    )}
                    {role === 'student' && activeTab === 'subject-detail' && selectedSubject && (
                        <SubjectDetailContent
                            subject={selectedSubject}
                            tasks={subjectTasks}
                            student={DUMMY_STUDENT}
                            onSelectTask={handleTaskSelect}
                        />
                    )}
                    {role === 'student' && activeTab === 'task-view' && selectedTask && (
                        selectedTask.isCompleted
                            ? <LeaderboardView
                                task={selectedTask}
                                entries={computeLeaderboard(
                                    DUMMY_SUBMISSIONS[selectedTask.id] ?? [],
                                    DUMMY_STUDENT.studentId,
                                    selectedTask.maxScore ?? 50
                                )}
                              />
                            : <TaskCompilerView
                                task={selectedTask}
                                problem={PROBLEM_MAP[selectedTask.problemId] ?? null}
                              />
                    )}

                    {/* ── Teacher routes ── */}
                    {role === 'teacher' && activeTab === 'home' && (
                        <TeacherHomeView
                            teacher={DUMMY_TEACHER}
                            sections={enrichedSections}
                            sectionStudents={DUMMY_SECTION_STUDENTS}
                            tasks={DUMMY_TASKS}
                            submissions={DUMMY_SUBMISSIONS}
                            problems={DUMMY_PROBLEMS}
                            onGoToSections={() => setActiveTab('sections')}
                            onGoToProblems={() => setActiveTab('problem-sets')}
                            onGoToManage={() => setActiveTab('manage-sections')}
                            onSelectSection={(sec) => {
                                setSelectedSection(sec);
                                setActiveTab('section-detail');
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'sections' && (
                        <TeacherSectionsView
                            sections={enrichedSections}
                            onCreateSection={() => setActiveTab('create-section')}
                            onManageSections={() => setActiveTab('manage-sections')}
                            onSelectSection={(sec) => {
                                setSelectedSection(sec);
                                setActiveTab('section-detail');
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'section-detail' && selectedSection && (
                        <TeacherSectionDetailView
                            section={selectedSection}
                            tasks={DUMMY_TASKS.filter(t => t.subjectId === selectedSection.id)}
                            sectionStudents={DUMMY_SECTION_STUDENTS[selectedSection.id]}
                            problems={DUMMY_PROBLEMS}
                            onBack={() => setActiveTab('sections')}
                            onTaskSelect={(task) => {
                                setSelectedTeacherTask(task);
                                setActiveTab('teacher-task-detail');
                            }}
                            onAddTask={(problem, deadline) => {
                                // TODO: POST /api/tasks { sectionId: selectedSection.id, problemId: problem.id, deadline }
                                console.log('Add task:', problem.title, 'to', selectedSection.id, 'deadline:', deadline);
                            }}
                            onManageStudents={() => setActiveTab('manage-sections')}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'teacher-task-detail' && selectedTeacherTask && selectedSection && (
                        <TeacherTaskSubmissionsView
                            section={selectedSection}
                            task={selectedTeacherTask}
                            submissions={DUMMY_SUBMISSIONS[selectedTeacherTask.id]}
                            onBack={() => setActiveTab('section-detail')}
                            onLeaderboard={() => setActiveTab('teacher-leaderboard')}
                            onReviewStudent={(submission, validateFn, unsubmitFn) => {
                                setSelectedSubmission(submission);
                                setSubmissionCallbacks({ validateFn, unsubmitFn });
                                setActiveTab('student-review');
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'teacher-leaderboard' && selectedTeacherTask && (
                        <LeaderboardView
                            task={selectedTeacherTask}
                            entries={computeLeaderboard(
                                DUMMY_SUBMISSIONS[selectedTeacherTask.id] ?? [],
                                null,
                                selectedTeacherTask.maxScore ?? 50
                            )}
                            onBack={() => setActiveTab('teacher-task-detail')}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'student-review' && selectedSubmission && (
                        <TeacherStudentReviewView
                            section={selectedSection}
                            task={selectedTeacherTask}
                            problem={PROBLEM_MAP[selectedTeacherTask?.problemId] ?? null}
                            submission={selectedSubmission}
                            onBack={() => setActiveTab('teacher-task-detail')}
                            onValidate={(studentId, newStatus) => {
                                submissionCallbacks.validateFn?.(studentId, newStatus);
                                setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
                            }}
                            onUnsubmit={(studentId) => {
                                submissionCallbacks.unsubmitFn?.(studentId);
                                setActiveTab('teacher-task-detail');
                            }}
                            onScoreChange={(studentId, newScore) => {
                                // TODO: PATCH /api/submissions/:id { score: newScore }
                                setSelectedSubmission(prev => ({ ...prev, score: newScore }));
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'create-section' && (
                        <CreateSectionView
                            onBack={() => setActiveTab('sections')}
                            onCreate={(newSection) => {
                                // TODO: persist to backend — for now just navigate back
                                console.log('New section:', newSection);
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'manage-sections' && (
                        <ManageSectionsView
                            sections={enrichedSections}
                            sectionStudents={DUMMY_SECTION_STUDENTS}
                            onBack={() => setActiveTab('sections')}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'problem-sets' && (
                        <ProblemSetsView
                            onCollection={() => setActiveTab('problem-sets-collection')}
                            onExplore={() => setActiveTab('problem-sets-explore')}
                            onCreate={() => setActiveTab('problem-sets-create')}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'problem-sets-collection' && (
                        <ProblemCollectionView
                            problems={DUMMY_PROBLEMS}
                            sections={enrichedSections}
                            onBack={() => setActiveTab('problem-sets')}
                            onExplore={() => setActiveTab('problem-sets-explore')}
                            onAssign={(problem, sectionIds, deadline) => {
                                // TODO: for each sectionId → POST /api/tasks { problemId: problem.id, sectionId, deadline }
                                console.log(`Assigned "${problem.title}" → [${sectionIds.join(', ')}] — deadline: ${deadline}`);
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'problem-sets-explore' && (
                        <ExploreProblemSetsView
                            publicProblems={DUMMY_PUBLIC_PROBLEMS}
                            teacherCollectionIds={DUMMY_PROBLEMS.map(p => p.id)}
                            onBack={() => setActiveTab('problem-sets')}
                            onAddToCollection={(problem) => {
                                // TODO: POST /api/problems/:id/collect
                                console.log('Add to collection:', problem.title);
                            }}
                            onRemoveFromCollection={(problem) => {
                                // TODO: DELETE /api/problems/:id/collect
                                console.log('Remove from collection:', problem.title);
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'problem-sets-create' && (
                        <CreateProblemView
                            onBack={() => setActiveTab('problem-sets-collection')}
                            onTest={(data) => {
                                setTestProblem(data);
                                setActiveTab('problem-test');
                            }}
                            onFinish={(data) => {
                                // TODO: POST /api/problems
                                console.log('Create problem:', data);
                                setActiveTab('problem-sets-collection');
                            }}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'problem-test' && testProblem && (
                        <TeacherProblemTestView
                            problem={testProblem}
                            onBack={() => setActiveTab('problem-sets-create')}
                        />
                    )}
                    {role === 'teacher' && activeTab === 'students' && (
                        <div className="p-8">
                            <h1 className="text-4xl font-light text-slate-800">Students</h1>
                            <p className="text-slate-400 mt-3">Coming soon.</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default App;