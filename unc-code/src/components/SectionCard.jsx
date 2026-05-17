import { ArrowRight, Archive } from 'lucide-react';

/**
 * SectionCard
 * Props:
 *   section: { id, name, unchecked?, status? }
 *   onSelect: (section) => void
 */
const SectionCard = ({ section, onSelect }) => {
    const isArchived = section.status === 'archived';

    return (
        <div className={`rounded-[2rem] p-8 shadow-sm border transition-all duration-300 group flex flex-col min-h-[180px] ${
            isArchived
                ? 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                : 'bg-white border-slate-100 hover:border-red-200 hover:shadow-md'
        }`}>
            {/* Section info */}
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h2 className={`text-2xl font-medium ${isArchived ? 'text-slate-500' : 'text-slate-800'}`}>
                        {section.id}
                    </h2>
                    {isArchived && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                            <Archive size={9} />
                            Archived
                        </span>
                    )}
                </div>
                <p className="text-slate-500 mt-1 text-sm">{section.name}</p>
                {section.unchecked > 0 && (
                    <p className="text-red-400 text-xs font-medium mt-2">
                        {section.unchecked} unchecked {section.unchecked === 1 ? 'work' : 'works'}
                    </p>
                )}
            </div>

            {/* Navigate button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onSelect?.(section)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all ${
                        isArchived
                            ? 'bg-slate-400 hover:bg-slate-500 shadow-slate-200'
                            : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                    }`}
                >
                    <ArrowRight size={22} />
                </button>
            </div>
        </div>
    );
};

export default SectionCard;
