import { useState, useMemo } from 'react';
import {
    ArrowLeft, ChevronDown, ChevronUp, Search, UserPlus,
    Trash2, Archive, Eye, X, AlertTriangle, CheckCircle,
    Users, BookOpen, Filter,
} from 'lucide-react';
import { DUMMY_SECTIONS, DUMMY_SECTION_STUDENTS } from '../../data/dummyData';

/* ─────────────────────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const cfg = {
        active:   'bg-emerald-50 text-emerald-600 border-emerald-200',
        archived: 'bg-slate-100  text-slate-400  border-slate-200',
    }[status] ?? 'bg-slate-100 text-slate-400 border-slate-200';
    return (
        <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg}`}>
            {status}
        </span>
    );
};

/* Avatar initials */
const Avatar = ({ name }) => {
    const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-red-200">
            {initials}
        </div>
    );
};

/* Confirmation Modal */
const ConfirmModal = ({ open, icon, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 active:scale-95 ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────
   Single Section Panel (accordion item)
───────────────────────────────────────────────────────────── */
const SectionPanel = ({ section, initialStudents, onDelete, onArchive }) => {
    const [open, setOpen]           = useState(false);
    const [search, setSearch]       = useState('');
    const [students, setStudents]   = useState(initialStudents ?? []);
    const [addEmail, setAddEmail]   = useState('');
    const [showAddRow, setShowAddRow] = useState(false);
    const [modal, setModal]         = useState(null); // { type: 'delete'|'archive'|'removeStudent', studentId? }
    const [toast, setToast]         = useState(null); // { message }

    const showToast = (message) => {
        setToast({ message });
        setTimeout(() => setToast(null), 3000);
    };

    /* filtered students */
    const filtered = useMemo(() =>
        students.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase()) ||
            s.studentId.toLowerCase().includes(search.toLowerCase())
        ), [students, search]);

    /* add student inline */
    const handleAddStudent = () => {
        if (!addEmail.trim()) return;
        const newStudent = {
            id: `temp-${Date.now()}`,
            name: addEmail.split('@')[0].replace(/\./g, ' '),
            email: addEmail.trim(),
            studentId: '—',
        };
        setStudents(prev => [...prev, newStudent]);
        setAddEmail('');
        setShowAddRow(false);
        showToast('Student added successfully.');
    };

    /* remove student */
    const handleRemoveStudent = (studentId) => {
        setStudents(prev => prev.filter(s => s.id !== studentId));
        setModal(null);
        showToast('Student removed from section.');
    };

    const isArchived = section.status === 'archived';

    return (
        <>
            {/* ── Toast ────────────────────────────────────────────────── */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-4 duration-300">
                    <CheckCircle size={16} className="text-emerald-400" />
                    {toast.message}
                </div>
            )}

            {/* ── Confirm modals ───────────────────────────────────────── */}
            <ConfirmModal
                open={modal?.type === 'delete'}
                icon={<Trash2 size={18} className="text-red-500" />}
                title="Delete Section?"
                message={`"${section.id}" and all its student records will be permanently removed. This cannot be undone.`}
                confirmLabel="Delete"
                confirmClass="bg-red-500 hover:bg-red-600"
                onConfirm={() => { setModal(null); onDelete?.(section.id); }}
                onCancel={() => setModal(null)}
            />
            <ConfirmModal
                open={modal?.type === 'archive'}
                icon={<Archive size={18} className="text-amber-500" />}
                title="Archive Section?"
                message={`"${section.id}" will be moved to the archive. Students will lose access but records are preserved.`}
                confirmLabel="Archive"
                confirmClass="bg-amber-500 hover:bg-amber-600"
                onConfirm={() => { setModal(null); onArchive?.(section.id); }}
                onCancel={() => setModal(null)}
            />
            <ConfirmModal
                open={modal?.type === 'removeStudent'}
                icon={<AlertTriangle size={18} className="text-red-500" />}
                title="Remove Student?"
                message="This student will be removed from the section. Their submitted work will still be preserved."
                confirmLabel="Remove"
                confirmClass="bg-red-500 hover:bg-red-600"
                onConfirm={() => handleRemoveStudent(modal.studentId)}
                onCancel={() => setModal(null)}
            />

            {/* ── Accordion header ─────────────────────────────────────── */}
            <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                open
                    ? 'border-red-200 shadow-md shadow-red-50'
                    : 'border-slate-200 shadow-sm hover:border-slate-300'
            } ${isArchived ? 'opacity-70' : ''}`}>

                <button
                    onClick={() => setOpen(o => !o)}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-colors duration-200 ${
                        open ? 'bg-red-50/60' : 'bg-white hover:bg-slate-50'
                    }`}
                >
                    {/* Chevron */}
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                        open ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>

                    {/* Section info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm">{section.id}</span>
                            <StatusBadge status={section.status} />
                            {section.unchecked > 0 && (
                                <span className="text-[10px] font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                                    {section.unchecked} unchecked
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{section.name}</p>
                    </div>

                    {/* Student count pill */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                        <Users size={12} />
                        <span className="font-semibold">{students.length}</span>
                        <span className="font-normal">students</span>
                    </div>
                </button>

                {/* ── Expanded body ─────────────────────────────────────── */}
                {open && (
                    <div className="bg-white border-t border-slate-100">

                        {/* Sub-toolbar */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 flex-wrap">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[180px]">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search students…"
                                    className="w-full pl-8 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all duration-200"
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                                        <X size={13} />
                                    </button>
                                )}
                            </div>

                            {/* Add student */}
                            {!isArchived && (
                                <button
                                    onClick={() => setShowAddRow(r => !r)}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-300 hover:border-red-500 px-3 py-2 rounded-xl transition-all duration-200"
                                >
                                    <UserPlus size={13} />
                                    Add Student
                                </button>
                            )}

                            {/* Filter placeholder */}
                            <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-xl transition-all duration-200">
                                <Filter size={13} />
                                Filter
                            </button>
                        </div>

                        {/* Add-student row */}
                        {showAddRow && (
                            <div className="flex items-center gap-3 px-6 py-3 bg-red-50/60 border-b border-red-100">
                                <UserPlus size={14} className="text-red-400 shrink-0" />
                                <input
                                    type="email"
                                    value={addEmail}
                                    onChange={e => setAddEmail(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
                                    placeholder="Enter student UNC email…"
                                    autoFocus
                                    className="flex-1 bg-white border border-red-200 rounded-xl px-4 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-all"
                                />
                                <button
                                    onClick={handleAddStudent}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-xl transition-all active:scale-95"
                                >
                                    Add
                                </button>
                                <button onClick={() => { setShowAddRow(false); setAddEmail(''); }} className="text-slate-300 hover:text-slate-500 transition-colors">
                                    <X size={15} />
                                </button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-x-auto">
                            {/* Header */}
                            <div className="grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-3 px-6 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <span className="text-center">#</span>
                                <span>Student</span>
                                <span>Email</span>
                                <span>ID Number</span>
                                <span className="text-right pr-1">Actions</span>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="py-10 text-center text-slate-300 text-sm">
                                    {search ? `No results for "${search}"` : 'No students in this section yet.'}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50">
                                    {filtered.map((student, idx) => (
                                        <div
                                            key={student.id}
                                            className="grid grid-cols-[2rem_1fr_1fr_auto_auto] items-center gap-3 px-6 py-3 hover:bg-slate-50/70 transition-colors duration-150 group"
                                        >
                                            {/* Row number */}
                                            <span className="text-center text-xs text-slate-300 font-mono">{idx + 1}</span>

                                            {/* Name + avatar */}
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <Avatar name={student.name} />
                                                <span className="text-sm font-medium text-slate-700 truncate">{student.name}</span>
                                            </div>

                                            {/* Email */}
                                            <span className="text-sm text-slate-400 truncate">{student.email}</span>

                                            {/* Student ID */}
                                            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg whitespace-nowrap">
                                                {student.studentId}
                                            </span>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1.5 justify-end">
                                                <button className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-white hover:bg-red-500 border border-slate-200 hover:border-red-500 px-2.5 py-1.5 rounded-lg transition-all duration-150 active:scale-95">
                                                    <Eye size={11} />
                                                    Profile
                                                </button>
                                                {!isArchived && (
                                                    <button
                                                        onClick={() => setModal({ type: 'removeStudent', studentId: student.id })}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section action footer */}
                        {!isArchived && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                <p className="text-xs text-slate-400">
                                    Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{students.length}</span> students
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setModal({ type: 'archive' })}
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-600 hover:text-white hover:bg-amber-500 border border-amber-200 hover:border-amber-500 rounded-xl transition-all duration-200 active:scale-95"
                                    >
                                        <Archive size={13} />
                                        Archive Section
                                    </button>
                                    <button
                                        onClick={() => setModal({ type: 'delete' })}
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 rounded-xl transition-all duration-200 active:scale-95"
                                    >
                                        <Trash2 size={13} />
                                        Delete Section
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────────────
   ManageSectionsView
───────────────────────────────────────────────────────────── */
const ManageSectionsView = ({
    sections = DUMMY_SECTIONS,
    sectionStudents = DUMMY_SECTION_STUDENTS,
    onBack,
}) => {
    const [globalSearch, setGlobalSearch]   = useState('');
    const [filterStatus, setFilterStatus]   = useState('all'); // 'all' | 'active' | 'archived'
    const [sectionList, setSectionList]     = useState(sections);

    const handleDelete  = (id) => setSectionList(prev => prev.filter(s => s.id !== id));
    const handleArchive = (id) => setSectionList(prev =>
        prev.map(s => s.id === id ? { ...s, status: 'archived' } : s)
    );

    const visible = sectionList.filter(s => {
        const matchesSearch =
            s.id.toLowerCase().includes(globalSearch.toLowerCase()) ||
            s.name.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/20 p-8 animate-in fade-in duration-500">

            {/* ── Back ────────────────────────────────────────────────── */}
            <button
                onClick={onBack}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-700 mb-8 transition-colors duration-200"
            >
                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-red-300 group-hover:bg-red-50 transition-all duration-200 shadow-sm">
                    <ArrowLeft size={15} className="group-hover:text-red-500 transition-colors" />
                </span>
                <span className="text-sm font-medium">Back to Sections</span>
            </button>

            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-6 mb-8 flex-wrap">
                <div>
                    <h1 className="text-4xl font-light text-slate-900 tracking-tight">
                        Manage <span className="font-semibold text-red-500">Sections</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        {sectionList.length} section{sectionList.length !== 1 ? 's' : ''} total
                    </p>
                </div>

                {/* Stats row */}
                <div className="flex gap-3">
                    {[
                        { label: 'Active',   value: sectionList.filter(s => s.status === 'active').length,   color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Archived', value: sectionList.filter(s => s.status === 'archived').length, color: 'text-slate-400',   bg: 'bg-slate-100'  },
                        { label: 'Students', value: Object.values(sectionStudents).flat().length,             color: 'text-red-500',     bg: 'bg-red-50'     },
                    ].map(stat => (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl px-5 py-3 text-center min-w-[70px]`}>
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Global toolbar ───────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    <input
                        type="text"
                        value={globalSearch}
                        onChange={e => setGlobalSearch(e.target.value)}
                        placeholder="Search sections…"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 transition-all shadow-sm"
                    />
                </div>

                {/* Status filter tabs */}
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm text-xs font-semibold">
                    {['all', 'active', 'archived'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilterStatus(f)}
                            className={`px-4 py-2.5 capitalize transition-all duration-200 ${
                                filterStatus === f
                                    ? 'bg-red-500 text-white'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Section list ─────────────────────────────────────────── */}
            {visible.length === 0 ? (
                <div className="text-center py-20 text-slate-300">
                    <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-medium">No sections match your search.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.map(section => (
                        <SectionPanel
                            key={section.id}
                            section={section}
                            initialStudents={sectionStudents[section.id] ?? []}
                            onDelete={handleDelete}
                            onArchive={handleArchive}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageSectionsView;
