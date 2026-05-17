import { Library, Compass, FilePlus2, BookOpenCheck } from 'lucide-react';

/**
 * ProblemSetsView  (Teacher)
 *
 * Landing page shown when the teacher clicks "Problem Sets" in the sidebar.
 * Presents four navigation cards:
 *   1. Your Collection   — problems the teacher has created or saved
 *   2. Published Problems— problems the teacher has authored/published
 *   3. Explore Problem Sets — browse the public/shared library
 *   4. Create New Problem — open the problem editor
 *
 * Props:
 *   onCollection:  () => void
 *   onPublished:   () => void
 *   onExplore:     () => void
 *   onCreate:      () => void
 *
 * When the backend is ready, wire each card to its respective route.
 * Expected API endpoints:
 *   GET  /api/problems?owner=me          → Published
 *   GET  /api/problems?visibility=public → Explore
 *   POST /api/problems                   → Create
 */

const OPTIONS = [
    {
        key: 'collection',
        label: 'Your Collection',
        icon: Library,
        desc: 'Problems you have saved',
    },
    {
        key: 'published',
        label: 'Published Problems',
        icon: BookOpenCheck,
        desc: 'Problems you have authored and published',
    },
    {
        key: 'explore',
        label: 'Explore Problem Sets',
        icon: Compass,
        desc: 'Browse problems shared by the community',
    },
    {
        key: 'create',
        label: 'Create New Problem',
        icon: FilePlus2,
        desc: 'Write a new coding problem from scratch',
    },
];

const ProblemSetsView = ({
    onCollection,
    onPublished,
    onExplore,
    onCreate,
}) => {
    const handlers = { collection: onCollection, published: onPublished, explore: onExplore, create: onCreate };

    return (
        <div className="p-10 animate-in fade-in duration-500 max-w-xl mx-auto">

            {/* Title */}
            <h1 className="text-4xl font-light text-slate-900 tracking-tight mb-10">
                Problem Sets
            </h1>

            {/* Option cards */}
            <div className="space-y-4">
                {OPTIONS.map(({ key, label, icon: Icon, desc }) => (
                    <button
                        key={key}
                        onClick={handlers[key]}
                        className="w-full bg-white hover:bg-red-50 border border-slate-100 hover:border-red-200 rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-red-50 group"
                    >
                        {/* Icon container */}
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                            <Icon
                                size={32}
                                strokeWidth={1.5}
                                className="text-slate-700 group-hover:text-red-500 transition-colors duration-200"
                            />
                        </div>

                        {/* Label */}
                        <span className="text-lg font-light text-slate-800 group-hover:text-red-600 transition-colors duration-200 tracking-tight">
                            {label}
                        </span>

                        {/* Subtle description — visible on hover */}
                        <span className="text-xs text-slate-400 group-hover:text-red-400 transition-colors duration-200">
                            {desc}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProblemSetsView;
