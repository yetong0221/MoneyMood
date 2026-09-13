export function HeroArt() {
  return (
    <svg viewBox="0 0 220 180" className="h-full w-full" aria-hidden>
      <ellipse cx="145" cy="168" rx="60" ry="8" fill="#f0dcd0" opacity="0.65" />
      {/* dress / body */}
      <path d="M118 168c18-46 62-78 86-86 4 18-8 58-38 84" fill="#f7c9c0" />
      <path d="M78 118c8-18 28-22 48-10 22 12 18 42 2 58-22 20-62 8-70-18-4-14 6-24 20-30Z" fill="#ffb4bc" />
      <path d="M92 132c10 8 28 10 42 2" stroke="#ff8c94" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* head */}
      <path d="M86 78c-8-22 6-40 28-42 18-2 34 12 36 30 2 14-4 28-18 34-18 8-38 0-46-22Z" fill="#f5d2bc" />
      <path d="M92 86c2-16 14-28 30-28 14 0 26 10 28 24" fill="#3d2a28" />
      <path d="M88 78c8-18 28-28 46-22 10 3 22 14 20 28-16-8-34-8-66-6Z" fill="#2f201e" />
      <circle cx="108" cy="92" r="3.2" fill="#3a2a28" />
      <circle cx="132" cy="91" r="3.2" fill="#3a2a28" />
      <path d="M116 102c4 4 10 4 14 0" stroke="#d0897a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="101" cy="98" r="3.4" fill="#f4a39a" opacity="0.7" />
      <circle cx="140" cy="97" r="3.4" fill="#f4a39a" opacity="0.7" />
      {/* cat */}
      <ellipse cx="70" cy="156" rx="18" ry="12" fill="#f8dfd0" />
      <ellipse cx="70" cy="152" rx="10" ry="8" fill="#efc3ae" />
      <circle cx="66" cy="150" r="1.4" fill="#5a3c34" />
      <circle cx="74" cy="150" r="1.4" fill="#5a3c34" />
      <path d="M68 154c2 2 4 2 6 0" stroke="#c07a6a" strokeWidth="1.2" fill="none" />
      <path d="M56 146c-4-8 2-14 8-12" fill="#f8dfd0" />
      <path d="M76 146c4-8-2-14-8-12" fill="#f8dfd0" />
      {/* plant pot */}
      <rect x="42" y="128" width="22" height="16" rx="4" fill="#a8e6cf" />
      <rect x="44" y="124" width="18" height="6" rx="2" fill="#6ec8a5" />
      <path d="M50 124c2-8 6-12 8-14 2 6 4 10 4 14" stroke="#6ec8a5" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function GardenArt() {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full" aria-hidden>
      <ellipse cx="80" cy="82" rx="70" ry="8" fill="#f0d8cc" />
      <path d="M28 82c8-28 24-48 40-48 6 18-4 36-18 48" fill="#a8e6cf" />
      <circle cx="46" cy="38" r="10" fill="#ff8c94" />
      <circle cx="38" cy="44" r="7" fill="#ffe0b2" />
      <path d="M88 82c10-34 40-52 62-50-4 22-22 42-48 50" fill="#f4c4ba" />
      <circle cx="118" cy="34" r="8" fill="#d1c4e9" />
      <path d="M70 82c4-22 18-34 30-30 2 14-6 24-16 30" fill="#6ec8a5" />
      {/* girl holding flowers silhouette */}
      <circle cx="98" cy="42" r="10" fill="#f5d2bc" />
      <path d="M90 52c2-2 14-2 16 0 4 8 2 28-8 30-10-2-12-22-8-30Z" fill="#ffb4bc" />
    </svg>
  );
}

export function RobotArt({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="28" fill="#fff0f3" />
      <rect x="16" y="20" width="32" height="28" rx="10" fill="#ffb4bc" />
      <rect x="20" y="24" width="24" height="16" rx="6" fill="#fff" />
      <circle cx="27" cy="32" r="2.5" fill="#5a3f3f" />
      <circle cx="37" cy="32" r="2.5" fill="#5a3f3f" />
      <path d="M28 38c2 2 6 2 8 0" stroke="#f06d7a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="29" y="12" width="6" height="8" rx="3" fill="#d1c4e9" />
      <circle cx="32" cy="12" r="3" fill="#a8e6cf" />
      <circle cx="14" cy="34" r="3" fill="#ffe0b2" />
      <circle cx="50" cy="34" r="3" fill="#ffe0b2" />
    </svg>
  );
}

export function LogoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 21s-7-4.4-9.2-8.2C1.2 9.8 3 7 6 7c1.7 0 3.1.9 4 2.2C10.9 7.9 12.3 7 14 7c3 0 4.8 2.8 3.2 5.8C19 16.6 12 21 12 21Z"
        fill="#ff8c94"
      />
      <path d="M12 14v4" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 14c2-2 4-2 5-1" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
