import { ArrowRight } from 'lucide-react';

/**
 * SubjectCard
 * Props:
 *   subject:         { id, name, instructor }
 *   onSelectSubject: (subject) => void
 */
const SubjectCard = ({ subject, onSelectSubject }) => {
    return (
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 group hover:border-red-200 hover:shadow-md transition-all duration-300 flex flex-col min-h-[180px]">
            <div className="flex-1 min-h-[100px]">
                <h3 className="text-2xl font-medium text-slate-800 mb-2">{subject.id}</h3>
                <p className="text-slate-600 text-lg">{subject.name}</p>
                <p className="text-slate-400 text-sm mt-2">{subject.instructor}</p>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => onSelectSubject(subject)}
                    className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-lg shadow-red-200 active:scale-90"
                >
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default SubjectCard;
