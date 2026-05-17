import CircularProgress from '../../components/CircularProgress';
import SubjectCard from '../../components/SubjectCard';
import { DUMMY_SUBJECTS, DUMMY_STUDENT, DUMMY_TASKS, computeStudentStats } from '../../data/dummyData';

/**
 * HomeContent (Student)
 *
 * Props:
 *   student:         { name, course, studentId }
 *                    In production: GET /api/students/:id
 *   tasks:           Task[]  — ALL tasks assigned to this student (across all subjects)
 *                    In production: GET /api/tasks?studentId=:id
 *   subjects:        Subject[]
 *                    In production: GET /api/subjects?studentId=:id
 *   onSelectSubject: (subject) => void
 *
 * Stats are derived from `tasks` via computeStudentStats() — never hardcoded.
 */
const HomeContent = ({
    student  = DUMMY_STUDENT,
    tasks    = DUMMY_TASKS,
    subjects = DUMMY_SUBJECTS,
    onSelectSubject,
}) => {
    // Compute overall stats from ALL tasks across every subject
    const { tasksCompleted, totalTasks, tasksPct, gradePercentage } = computeStudentStats(tasks);

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Student profile card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-normal text-slate-900 tracking-tight">{student.name}</h1>
                    <p className="text-slate-500 mt-2 text-xl font-light">{student.course}</p>
                    <p className="text-slate-400 text-sm mt-1 font-mono tracking-wider">{student.studentId}</p>
                </div>
                <div className="flex gap-16">
                    <CircularProgress
                        label="Tasks Completed"
                        percentage={tasksPct}
                        sublabel={`${tasksCompleted}/${totalTasks}`}
                    />
                    <CircularProgress
                        label="Grade Percentage"
                        percentage={gradePercentage}
                        sublabel={`${gradePercentage}%`}
                    />
                </div>
            </div>

            {/* Enrolled subjects */}
            <div className="pt-4">
                <h2 className="text-2xl font-semibold text-slate-800">Enrolled Subjects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subjects.map((sub) => (
                    <SubjectCard key={sub.id} subject={sub} onSelectSubject={onSelectSubject} />
                ))}
            </div>
        </div>
    );
};

export default HomeContent;