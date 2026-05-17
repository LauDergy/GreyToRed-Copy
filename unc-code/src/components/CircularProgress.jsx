/**
 * ==========================================
 * FILE: components/shared/CircularProgress.jsx
 * ==========================================
 * export default CircularProgress;
 */
const CircularProgress = ({ percentage, label, sublabel }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <p className="text-xs text-slate-500 mb-2 whitespace-nowrap font-medium">{label}</p>
            <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-100" />
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        className="text-red-500 transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="absolute text-lg font-bold text-slate-700">{sublabel}</span>
            </div>
        </div>
    );
};
export default CircularProgress;