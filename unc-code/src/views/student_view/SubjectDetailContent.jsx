import CircularProgress from '../../components/CircularProgress';
import TaskCard from '../../components/TaskCard';
import { DUMMY_TASKS, DUMMY_STUDENT, computeStudentStats } from '../../data/dummyData';

/**
 * SubjectDetailContent (Student)
 *
 * Props:
 *   subject:      { id, name, instructor }
 *   tasks:        Task[]  — tasks already filtered to THIS subject by App.jsx
 *                 In production: GET /api/tasks?studentId=:id&subjectId=:subjectId
 *   student:      { name, course, studentId }
 *   onSelectTask: (task) => void
 *
 * Stats are derived from the subject-scoped `tasks` via computeStudentStats().
 * This ensures the CircularProgress rings reflect THIS subject only.
 */
const SubjectDetailContent = ({
    subject,
    tasks,
    student     = DUMMY_STUDENT,
    onSelectTask,
}) => {
    // Use only the tasks passed in (already scoped to this subject by App.jsx)
    const displayTasks = tasks ?? DUMMY_TASKS.filter(t => t.subjectId === subject?.id);

    // Compute stats scoped to this subject
    const { tasksCompleted, totalTasks, tasksPct, gradePercentage } = computeStudentStats(displayTasks);

    return (
        <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Subject header */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-normal text-slate-900 tracking-tight">{subject?.id}</h1>
                    <p className="text-slate-500 mt-2 text-xl font-light">{subject?.name}</p>
                    <p className="text-slate-400 text-sm mt-1">{subject?.instructor}</p>
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

            {/* Task cards */}
            {displayTasks.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-lg font-light">No tasks for this subject yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayTasks.map((task) => (
                        <TaskCard key={task.id} task={task} onSelectTask={onSelectTask} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubjectDetailContent;