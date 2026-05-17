import { useState } from 'react';
import { Archive, ChevronDown, ChevronUp } from 'lucide-react';
import SectionCard from '../../components/SectionCard';
import { DUMMY_SECTIONS } from '../../data/dummyData';

/**
 * TeacherSectionsView
 * Props:
 *   sections:          Section[]  — { id, name, unchecked, status }
 *   onSelectSection:   (section) => void
 *   onCreateSection:   () => void
 *   onManageSections:  () => void
 */
const TeacherSectionsView = ({
    sections = DUMMY_SECTIONS,
    onSelectSection,
    onCreateSection,
    onManageSections,
}) => {
    const [showArchived, setShowArchived] = useState(false);

    const activeSections   = sections.filter(s => s.status !== 'archived');
    const archivedSections = sections.filter(s => s.status === 'archived');

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">

            {/* ── Header card ─────────────────────────────────────────── */}
            <div className="bg-white rounded-[2.5rem] px-10 py-8 shadow-sm border border-slate-100 flex items-start justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-light text-slate-900 tracking-tight">Sections</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {activeSections.length} active
                        {archivedSections.length > 0 && (
                            <span className="ml-2 text-slate-300">· {archivedSections.length} archived</span>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-3 min-w-[180px]">
                    <button
                        onClick={onCreateSection}
                        className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm shadow-red-200">
                        Create New Section
                    </button>
                    <button
                        onClick={onManageSections}
                        className="w-full bg-slate-400 hover:bg-slate-500 active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all">
                        Manage Sections
                    </button>
                </div>
            </div>

            {/* ── Active sections ─────────────────────────────────────── */}
            {activeSections.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <p className="text-lg font-light">No active sections yet.</p>
                    <p className="text-sm mt-1">Click "Create New Section" to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeSections.map((section) => (
                        <SectionCard
                            key={section.id}
                            section={section}
                            onSelect={onSelectSection}
                        />
                    ))}
                </div>
            )}

            {/* ── Archived toggle ─────────────────────────────────────── */}
            {archivedSections.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowArchived(v => !v)}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors duration-200 group"
                    >
                        <Archive size={13} className="group-hover:text-slate-500 transition-colors" />
                        {showArchived ? 'Hide archived sections' : `Show archived sections (${archivedSections.length})`}
                        {showArchived
                            ? <ChevronUp  size={13} />
                            : <ChevronDown size={13} />
                        }
                    </button>

                    {showArchived && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            {archivedSections.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    onSelect={onSelectSection}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeacherSectionsView;
