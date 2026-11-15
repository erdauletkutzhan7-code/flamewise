import { NavLink } from 'react-router-dom';

const NAV_COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home',      to: '/' },
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Ranking',   to: '/ranking' },
    ],
  },
  {
    heading: 'Science',
    links: [
      { label: 'Insights',       to: '/insights' },
      { label: 'Engineering',    to: '/engineering' },
      { label: 'Visualizations', to: '/visualizations' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Copilot', to: '/copilot' },
      { label: 'About',   to: '/about' },
    ],
  },
];

const DATA_SOURCES: { label: string; href: string; description: string }[] = [
  {
    label: 'PSI Repository',
    href: 'https://psi.nasa.gov/',
    description: 'Physical Sciences Informatics — primary experiment data',
  },
  {
    label: 'NASA Glenn Research Center',
    href: 'https://www.nasa.gov/centers/glenn/',
    description: 'Combustion & reacting-flow research division',
  },
  {
    label: 'ISS Combustion Science',
    href: 'https://www.nasa.gov/mission/station/research-explorer/investigation/?#iss_investigator_page/',
    description: 'On-orbit microgravity combustion experiments',
  },
  {
    label: 'NASA Technical Reports (NTRS)',
    href: 'https://ntrs.nasa.gov/',
    description: 'Published findings & mission documentation',
  },
];

const FlameIconSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 shrink-0"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="flameGradFooter" cx="50%" cy="80%" r="60%">
        <stop offset="0%"  stopColor="#fff7ed" />
        <stop offset="30%" stopColor="#fb923c" />
        <stop offset="70%" stopColor="#ff6b00" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
    </defs>
    <path
      d="M12 2C10 6 7 7 7 11.5A5 5 0 0 0 12 16.5 5 5 0 0 0 17 11.5C17 7 14 6 12 2Z"
      fill="url(#flameGradFooter)"
    />
    <path
      d="M12 10c-.8 2-2.5 2.5-2.5 4a2.5 2.5 0 0 0 5 0C14.5 12.5 12.8 12 12 10Z"
      fill="#fff7ed"
      opacity="0.85"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-3 h-3"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-space-950 border-t border-white/8 mt-auto">
      {/* ── Top gradient accent ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-flame-500/70 to-transparent" />

      {/* ── Main content ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1.6fr_1.4fr] gap-12">

        {/* ── Left: Brand ── */}
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <FlameIconSmall />
            <div className="leading-none">
              <span
                className="block text-base font-black tracking-widest text-white"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                SOLFORGE
              </span>
              <span className="block text-[10px] tracking-[0.18em] text-flame-400 uppercase font-medium">
                Flame in Freefall
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            An interactive exploration of microgravity combustion science — from
            the ISS to the dangers of cool flames in confined spacecraft.
          </p>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              NASA Space Apps Challenge 2026
            </p>
            <p className="text-xs text-slate-500 tracking-wide">
              Team&nbsp;
              <span className="text-flame-400 font-medium">SOLFORGE</span>
            </p>
          </div>

          {/* NASA meatball badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" aria-hidden="true" />
            <span className="text-[11px] text-slate-400 tracking-wider uppercase">
              NASA Open Data
            </span>
          </div>
        </div>

        {/* ── Center: Nav columns ── */}
        <div className="grid grid-cols-3 gap-6">
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-flame-400">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        isActive
                          ? 'text-sm text-flame-300 font-medium'
                          : 'text-sm text-slate-400 hover:text-white transition-colors duration-200'
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Right: Data Sources ── */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-flame-400">
            Data Sources
          </h3>

          <ul className="flex flex-col gap-4">
            {DATA_SOURCES.map(({ label, href, description }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-0.5"
                >
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-300 group-hover:text-flame-400 transition-colors duration-200 font-medium">
                    {label}
                    <span className="text-slate-600 group-hover:text-flame-500 transition-colors duration-200">
                      <ExternalLinkIcon />
                    </span>
                  </span>
                  <span className="text-xs text-slate-500 leading-snug">
                    {description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div className="border-t border-white/8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            Built on real NASA data.&nbsp;
            <span className="text-slate-400">
              All experiment data sourced from the PSI repository and NTRS.
            </span>
          </p>
          <p className="text-xs text-slate-600 max-w-md sm:text-right leading-relaxed">
            Disclaimer: This project is an independent submission for NASA Space Apps
            Challenge 2026. It is not an official NASA product. Data is used for
            educational and research visualization purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
