/**
 * CODE GR Logo SVG Component
 * Matches the attached logo: "CODE" text above large "G→R" monogram
 */
const CodeGrLogo = ({ className = '' }) => (
    <div className={`flex flex-col items-center select-none ${className}`}>
        {/* "CODE" word mark */}
        <span
            className="text-slate-800 tracking-[0.35em] text-xl font-light"
            style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.35em' }}
        >
            CODE
        </span>

        {/* G → R monogram */}
        <svg
            viewBox="0 0 120 72"
            width="120"
            height="72"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* G — grey */}
            <text
                x="0"
                y="66"
                fontSize="80"
                fontWeight="900"
                fill="#9CA3AF"
                fontFamily="Georgia, serif"
            >
                G
            </text>

            {/* R — red, slightly offset right */}
            <text
                x="52"
                y="66"
                fontSize="80"
                fontWeight="900"
                fill="#EF4444"
                fontFamily="Georgia, serif"
            >
                R
            </text>

            {/* Arrow overlapping in the middle — white/grey triangle pointing right */}
            <polygon
                points="46,20 72,44 46,68"
                fill="#9CA3AF"
                opacity="0.95"
            />
            <polygon
                points="46,20 66,44 46,68"
                fill="white"
                opacity="1"
            />
        </svg>
    </div>
);

export default CodeGrLogo;
