import React from 'react';

/**
 * Custom Academic Illustration for NoteShare
 * Styled in the ivory, navy, sage, and lavender palette.
 * Represents genuine university scholarship (bound books, academic seal, quill/pen, syllabus scrolls).
 */
export const AcademicIllustration = ({ className = 'w-full h-auto max-w-md' }) => {
  return (
    <svg
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Academic notes and scholarship illustration"
      role="img"
    >
      <defs>
        {/* Soft background glow */}
        <radialGradient id="acadGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E4EBE4" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#E8E6F2" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F7F5F0" stopOpacity="0" />
        </radialGradient>

        {/* Navy book gradient */}
        <linearGradient id="bookNavy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1C3657" />
          <stop offset="100%" stopColor="#172B4D" />
        </linearGradient>

        {/* Sage ribbon gradient */}
        <linearGradient id="sageRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#81A382" />
          <stop offset="100%" stopColor="#5B7F67" />
        </linearGradient>

        {/* Paper ivory gradient */}
        <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCFBF9" />
        </linearGradient>

        {/* Lavender cover */}
        <linearGradient id="lavenderCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9B8FC5" />
          <stop offset="100%" stopColor="#8F85C7" />
        </linearGradient>

        {/* Soft shadow filter */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="8" stdDeviation="8" floodColor="#172B4D" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Background Ambient Glow */}
      <circle cx="250" cy="220" r="190" fill="url(#acadGlow)" />

      {/* Desk / Podium Horizon Line */}
      <ellipse cx="250" cy="350" rx="200" ry="24" fill="#EFECE3" />

      {/* Stacked Book Bottom (Sage Spine) */}
      <g filter="url(#softShadow)">
        <rect x="110" y="300" width="280" height="34" rx="6" fill="#5B7F67" stroke="#486652" strokeWidth="1.5" />
        <rect x="125" y="305" width="260" height="24" rx="3" fill="#EFECE3" />
        {/* Page lines */}
        <line x1="130" y1="312" x2="380" y2="312" stroke="#D5D0C2" strokeWidth="1" />
        <line x1="130" y1="317" x2="380" y2="317" stroke="#D5D0C2" strokeWidth="1" />
        <line x1="130" y1="322" x2="380" y2="322" stroke="#D5D0C2" strokeWidth="1" />
      </g>

      {/* Stacked Book Middle (Lavender Spine) */}
      <g filter="url(#softShadow)">
        <rect x="130" y="270" width="240" height="30" rx="6" fill="url(#lavenderCover)" stroke="#7568B0" strokeWidth="1.5" />
        <rect x="145" y="274" width="220" height="22" rx="3" fill="#FAF9F5" />
        <line x1="150" y1="281" x2="360" y2="281" stroke="#D5D0C2" strokeWidth="1" />
        <line x1="150" y1="286" x2="360" y2="286" stroke="#D5D0C2" strokeWidth="1" />
      </g>

      {/* Open Main Manuscript / Lecture Binder */}
      <g filter="url(#softShadow)">
        {/* Left Page */}
        <path
          d="M130 160 C 180 150, 235 155, 250 170 L 250 280 C 235 265, 180 260, 130 270 Z"
          fill="url(#paperGrad)"
          stroke="#E3DFD3"
          strokeWidth="1.5"
        />
        {/* Right Page */}
        <path
          d="M370 160 C 320 150, 265 155, 250 170 L 250 280 C 265 265, 320 260, 370 270 Z"
          fill="url(#paperGrad)"
          stroke="#E3DFD3"
          strokeWidth="1.5"
        />
        {/* Book Spine Center Crease */}
        <line x1="250" y1="170" x2="250" y2="280" stroke="#172B4D" strokeWidth="2" strokeOpacity="0.3" />

        {/* Left Page Text Lines (Lecture Notes representation) */}
        <line x1="150" y1="180" x2="230" y2="180" stroke="#172B4D" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
        <line x1="150" y1="195" x2="225" y2="195" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        <line x1="150" y1="207" x2="230" y2="207" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        <line x1="150" y1="219" x2="215" y2="219" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        <line x1="150" y1="231" x2="228" y2="231" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        <line x1="150" y1="243" x2="200" y2="243" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />

        {/* Right Page Text Lines & Formula Snippet */}
        <line x1="270" y1="180" x2="350" y2="180" stroke="#172B4D" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75" />
        <line x1="270" y1="195" x2="345" y2="195" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        <line x1="270" y1="207" x2="330" y2="207" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.35" />
        
        {/* Mini Diagram on Right Page */}
        <rect x="270" y="218" width="70" height="30" rx="3" fill="#E4EBE4" fillOpacity="0.6" stroke="#CAD8CA" strokeWidth="1" />
        <path d="M280 238 L295 226 L310 234 L325 224" stroke="#5B7F67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Bookmark Ribbon */}
        <path
          d="M246 170 L 246 300 L 253 292 L 260 300 L 260 170 Z"
          fill="url(#sageRibbon)"
        />
      </g>

      {/* Academic Seal / Crest on Top Right */}
      <g filter="url(#softShadow)">
        <circle cx="370" cy="115" r="34" fill="url(#bookNavy)" stroke="#FAF9F5" strokeWidth="2.5" />
        <circle cx="370" cy="115" r="28" fill="none" stroke="#FAF9F5" strokeWidth="1" strokeDasharray="3 3" />
        {/* Graduation Mortarboard in Seal */}
        <path d="M370 102 L386 110 L370 118 L354 110 Z" fill="#F7F5F0" />
        <path d="M360 115.5 L360 124 C360 127 380 127 380 124 L380 115.5" fill="#F7F5F0" />
        <path d="M386 110 L386 122 L384 124" stroke="#F7F5F0" strokeWidth="1" fill="none" />
      </g>

      {/* Traditional Fountain Pen / Stylus */}
      <g transform="rotate(35 220 120)">
        {/* Pen Body */}
        <path d="M220 80 L226 80 L226 150 L220 150 Z" fill="url(#bookNavy)" />
        {/* Gold/Sage Trim */}
        <rect x="220" y="100" width="6" height="4" fill="#5B7F67" />
        <rect x="220" y="148" width="6" height="2" fill="#5B7F67" />
        {/* Nib */}
        <path d="M220 150 L223 162 L226 150 Z" fill="#D5D0C2" stroke="#172B4D" strokeWidth="0.5" />
        <line x1="223" y1="150" x2="223" y2="157" stroke="#172B4D" strokeWidth="0.5" />
      </g>

      {/* Floating Verification Tag */}
      <g filter="url(#softShadow)">
        <rect x="60" y="130" width="120" height="34" rx="8" fill="#FCFBF9" stroke="#E3DFD3" strokeWidth="1" />
        <circle cx="78" cy="147" r="7" fill="#E4EBE4" />
        <path d="M75 147 L77 149 L81 144" stroke="#5B7F67" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="92" y="145" fill="#172B4D" fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          PEER REVIEWED
        </text>
        <text x="92" y="155" fill="#5B7F67" fontSize="8" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
          Syllabus Matched
        </text>
      </g>

      {/* Floating Course Code Tag */}
      <g filter="url(#softShadow)">
        <rect x="330" y="280" width="105" height="32" rx="8" fill="#FCFBF9" stroke="#E3DFD3" strokeWidth="1" />
        <rect x="336" y="286" width="20" height="20" rx="4" fill="#E8E6F2" />
        <text x="341" y="300" fill="#5A5288" fontSize="11" fontWeight="700" fontFamily="DM Serif Display, Georgia, serif">
          §
        </text>
        <text x="362" y="296" fill="#172B4D" fontSize="9" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          ALL SEMESTERS
        </text>
        <text x="362" y="305" fill="#7568B0" fontSize="8" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
          PDF Downloads
        </text>
      </g>
    </svg>
  );
};

export default AcademicIllustration;

