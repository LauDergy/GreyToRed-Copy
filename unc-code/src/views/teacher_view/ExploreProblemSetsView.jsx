import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import { DUMMY_PUBLIC_PROBLEMS, DUMMY_PROBLEMS } from '../../data/dummyData';
import ProblemPreviewModal from '../../components/ProblemPreviewModal';

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const DIFF_COLOR = { easy: 'text-emerald-500', medium: 'text-amber-500', hard: 'text-red-500' };
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

/* ── Select dropdown ─────────────────────────────────────────────────────── */
const SelectDropdown = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="appearance-none w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-9 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all cursor-pointer"
        >
            <option value="">{placeholder}</option>
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
);

/* ── Problem card (explore variant) ─────────────────────────────────────── */
const ExploreCard = ({ problem, inCollection, onPreview, onToggleCollection }) => (
    <div className="bg-white border border-slate-100 hover:border-red-200 hover:shadow-md rounded-[1.5rem] p-7 transition-all duration-200 flex flex-col gap-5 shadow-sm">
        <div>
            <h3 className="text-2xl font-light text-slate-900 leading-snug line-clamp-1">{problem.title}</h3>
            <p className={`text-base font-semibold mt-0.5 ${DIFF_COLOR[problem.difficulty] ?? 'text-slate-500'}`}>
                {cap(problem.difficulty)}
            </p>
            <p className="text-sm text-slate-400 mt-0.5">By {problem.author}</p>
        </div>

        <div className="flex items-center gap-3 mt-auto">
            <button
                onClick={() => onPreview?.(problem)}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-bold py-2.5 rounded-full shadow-sm shadow-red-200 transition-all duration-200"
            >
                Preview
            </button>
            <button
                onClick={() => onToggleCollection?.(problem)}
                className={`flex-1 text-sm font-bold py-2.5 rounded-full transition-all duration-200 active:scale-95 ${
                    inCollection
                        ? 'bg-slate-400 hover:bg-slate-500 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200'
                }`}
            >
                {inCollection ? 'Remove from Collections' : 'Add to Collection'}
            </button>
        </div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   ExploreProblemSetsView

   Props:
     publicProblems:     Problem[]   — pool to browse
                         In production: GET /api/problems?visibility=public
     teacherCollectionIds: string[]  — IDs already in teacher's collection
                         In production: derived from GET /api/problems?owner=me
     onBack:             () => void
     onAddToCollection:  (problem) => void
                         In production: POST /api/problems/:id/collect
     onRemoveFromCollection: (problem) => void
                         In production: DELETE /api/problems/:id/collect
───────────────────────────────────────────────────────────────────────── */
const ExploreProblemSetsView = ({
    publicProblems = DUMMY_PUBLIC_PROBLEMS,
    teacherCollectionIds = DUMMY_PROBLEMS.map(p => p.id),
    onBack,
    onAddToCollection,
    onRemoveFromCollection,
}) => {
    // Track collection membership locally for instant UI feedback
    const [collectionIds, setCollectionIds] = useState(new Set(teacherCollectionIds));
    const [previewing,  setPreviewing]  = useState(null);
    const [search,      setSearch]      = useState('');
    const [difficulty,  setDifficulty]  = useState('');
    const [publisher,   setPublisher]   = useState('');

    const publishers = [...new Set(publicProblems.map(p => p.author))].map(a => ({ value: a, label: a }));

    const filtered = publicProblems.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchDiff   = !difficulty || p.difficulty === difficulty;
        const matchPub    = !publisher  || p.author    === publisher;
        return matchSearch && matchDiff && matchPub;
    });

    const handleToggle = (problem) => {
        if (collectionIds.has(problem.id)) {
            setCollectionIds(prev => { const n = new Set(prev); n.delete(problem.id); return n; });
            onRemoveFromCollection?.(problem);
            // TODO: DELETE /api/problems/:id/collect
        } else {
            setCollectionIds(prev => new Set([...prev, problem.id]));
            onAddToCollection?.(problem);
            // TODO: POST /api/problems/:id/collect
        }
    };

    return (
        <>
            <ProblemPreviewModal problem={previewing} onClose={() => setPreviewing(null)} showHidden={false} />

            <div className="p-8 animate-in fade-in duration-500">

                {/* ── Back ─────────────────────────────────────────────── */}
                <button onClick={onBack} className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all shadow-sm">
                        <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                    </span>
                    <span className="text-sm font-medium">Back to Problem Sets</span>
                </button>

                {/* ── Title ────────────────────────────────────────────── */}
                <h1 className="text-4xl font-light text-slate-900 tracking-tight mb-6">
                    Search Problem Sets
                </h1>

                {/* ── Search / filter card ──────────────────────────────── */}
                <div className="bg-white border border-slate-100 rounded-3xl px-6 py-5 shadow-sm mb-8">
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search for Problems"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="w-44">
                            <SelectDropdown
                                value={difficulty}
                                onChange={setDifficulty}
                                options={[
                                    { value: 'easy',   label: 'Easy'   },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'hard',   label: 'Hard'   },
                                ]}
                                placeholder="Difficulty"
                            />
                        </div>

                        {/* Publisher */}
                        <div className="w-56">
                            <SelectDropdown
                                value={publisher}
                                onChange={setPublisher}
                                options={publishers}
                                placeholder="Publisher Name"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Recommended / results ────────────────────────────── */}
                <p className="text-base font-light text-slate-700 mb-5">
                    {search || difficulty || publisher ? 'Search Results:' : 'Recommended Problems:'}
                </p>

                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-300">
                        <Search size={36} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No problems match your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {filtered.map(p => (
                            <ExploreCard
                                key={p.id}
                                problem={p}
                                inCollection={collectionIds.has(p.id)}
                                onPreview={setPreviewing}
                                onToggleCollection={handleToggle}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ExploreProblemSetsView;
