import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from '../context/TranslationContext';

const NAV_KEYS = [
  { key: 'nav.home',           to: '/' },
  { key: 'nav.dashboard',      to: '/dashboard' },
  { key: 'nav.ranking',        to: '/ranking' },
  { key: 'nav.insights',       to: '/insights' },
  { key: 'nav.engineering',    to: '/engineering' },
  { key: 'nav.lab',            to: '/lab' },
  { key: 'nav.visualizations', to: '/visualizations' },
  { key: 'nav.copilot',        to: '/copilot' },
  { key: 'nav.about',          to: '/about' },
];

const FlameIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-7 h-7"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="flameGrad" cx="50%" cy="80%" r="60%">
        <stop offset="0%"  stopColor="#fff7ed" />
        <stop offset="30%" stopColor="#fb923c" />
        <stop offset="70%" stopColor="#ff6b00" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
    </defs>
    {/* outer flame */}
    <path
      d="M12 2C10 6 7 7 7 11.5A5 5 0 0 0 12 16.5 5 5 0 0 0 17 11.5C17 7 14 6 12 2Z"
      fill="url(#flameGrad)"
    />
    {/* inner core */}
    <path
      d="M12 10c-.8 2-2.5 2.5-2.5 4a2.5 2.5 0 0 0 5 0C14.5 12.5 12.8 12 12 10Z"
      fill="#fff7ed"
      opacity="0.85"
    />
    {/* microgravity sphere hint */}
    <circle cx="12" cy="20" r="2" fill="#ff6b00" opacity="0.4" />
  </svg>
);

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="relative w-6 h-5 flex flex-col justify-between" aria-hidden="true">
    <span
      className={clsx(
        'block h-0.5 bg-white rounded-full transition-all duration-300 origin-left',
        open && 'rotate-45 translate-y-px',
      )}
    />
    <span
      className={clsx(
        'block h-0.5 bg-white rounded-full transition-all duration-300',
        open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
      )}
    />
    <span
      className={clsx(
        'block h-0.5 bg-white rounded-full transition-all duration-300 origin-left',
        open && '-rotate-45 -translate-y-px',
      )}
    />
  </div>
);

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close drawer when navigating
  const handleNavClick = () => setMenuOpen(false);

  const activeLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'relative text-sm font-medium tracking-wide transition-colors duration-200',
      'after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all after:duration-200',
      isActive
        ? 'text-flame-400 after:bg-flame-500 after:scale-x-100'
        : 'text-slate-300 hover:text-white after:bg-flame-500 after:scale-x-0 hover:after:scale-x-100',
    );

  const mobileActiveLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'block px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200',
      isActive
        ? 'bg-flame-500/20 text-flame-400 border-l-2 border-flame-500'
        : 'text-slate-300 hover:text-white hover:bg-white/5',
    );

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-space-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
            : 'bg-transparent',
        )}
      >
        <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="SOLFORGE – Home"
          >
            <span className="transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#ff6b00]">
              <FlameIcon />
            </span>
            <div className="leading-none">
              <span
                className="block text-lg font-black tracking-widest text-white"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                SOLFORGE
              </span>
              <span className="block text-[10px] tracking-[0.2em] text-flame-400 uppercase font-medium">
                Flame in Freefall
              </span>
            </div>
          </NavLink>

          {/* ── Desktop Nav ── */}
          <ul className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_KEYS.map(({ key, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={activeLinkClass}
                >
                  {t(key)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* ── Hamburger (mobile) ── */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-flame-500"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-16 inset-x-0 z-40 lg:hidden"
            >
              <div className="mx-4 rounded-2xl bg-space-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 overflow-hidden">
                <ul className="p-3 flex flex-col gap-1">
                  {NAV_KEYS.map(({ key, to }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        end={to === '/'}
                        className={mobileActiveLinkClass}
                        onClick={handleNavClick}
                      >
                        {t(key)}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                {/* bottom accent strip */}
                <div className="h-px bg-gradient-to-r from-transparent via-flame-500/60 to-transparent" />
                <p className="px-4 py-2.5 text-[11px] text-slate-500 text-center tracking-widest uppercase">
                  NASA Space Apps Challenge 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
