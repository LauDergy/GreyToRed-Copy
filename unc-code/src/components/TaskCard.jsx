import { ArrowRight, Clock } from 'lucide-react';
import { formatDeadline } from '../data/dummyData';

/**
 * TaskCard (Student view)
 * Props:
 *   task:         { id, title, status, score, isCompleted, deadline? }
 *   onSelectTask: (task) => void
 */

const deadlineColor = (deadline) => {
    if (!deadline) return 'text-slate-400';
    const due = new Date(deadline);
    const now = new Date();
    const diffMs = due - now;
    if (diffMs < 0)             return 'text-red-500';     // overdue
    if (diffMs < 3 * 86400000) return 'text-amber-500';   // within 3 days
    return 'text-slate-400';
};

const TaskCard = ({ task, onSelectTask }) => {
    const dlColor = deadlineColor(task.deadline);

    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-red-200 hover:shadow-md transition-all duration-300 flex flex-col min-h-[200px]">
            <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-normal text-slate-800 leading-snug">{task.title}</h3>
                    <span className="text-2xl font-light text-slate-400 shrink-0 ml-4">
                        {task.maxScore != null ? `${task.score}/${task.maxScore}` : task.score}
                    </span>
                </div>
                <p className={`text-sm font-medium ${task.isCompleted ? 'text-red-400' : 'text-slate-400'}`}>
                    {task.status}
                </p>
            </div>

            {/* Deadline + arrow row */}
            <div className="mt-6 flex items-center justify-between">
                {task.deadline ? (
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${dlColor}`}>
                        <Clock size={12} />
                        Deadline: {formatDeadline(task.deadline)}
                    </span>
                ) : (
                    <span />
                )}
                <button
                    onClick={() => onSelectTask(task)}
                    className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200 active:scale-90 transition-all shrink-0"
                >
                    <ArrowRight size={22} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;

