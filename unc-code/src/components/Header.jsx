import { Search, Bell, LogOut } from 'lucide-react';

const USER_INFO = {
    student: {
        name: 'Rameses Jr.',
        dept: 'Computer Science Dept',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100&h=100',
    },
    teacher: {
        name: 'Danny Casimero',
        dept: 'Senior Instructor',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100',
    },
};

const Header = ({ role = 'student', onLogout }) => {
    const user = USER_INFO[role] ?? USER_INFO.student;

    return (
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-lg">
                <div className="relative w-full group">
                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-500"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none"
                    />
                </div>
            </div>

            {/* Right: User Info + Logout */}
            <div className="flex items-center gap-8">
                <button className="text-slate-400 hover:text-slate-600 relative">
                    <Bell size={24} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[9px] text-white font-bold flex items-center justify-center rounded-full border-2 border-white">
                        2
                    </span>
                </button>

                <div className="flex items-center gap-5 border-l border-slate-100 pl-8">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-black text-slate-900 leading-none">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-tighter">{user.dept}</p>
                    </div>

                    <div className="w-11 h-11 rounded-2xl overflow-hidden ring-4 ring-slate-50">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <button
                        onClick={onLogout}
                        title="Log out"
                        className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
