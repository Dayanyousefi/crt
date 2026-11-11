import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  CardCutShape,
  CollectionId,
  EnvelopeStagePhase,
  EnvelopeStyleVariant,
  FoilFinish,
  InvitationTemplate,
  OrnamentStyle,
  generatePaperDustParticles,
} from '../utils/templateAdapter';

interface FoilColors {
  stop1: string;
  stop2: string;
  stop3: string;
  stroke: string;
}

export function getFoilGradientColors(finish: FoilFinish, fallbackHex: string): FoilColors {
  switch (finish) {
    case 'rose-gold':
      return {
        stop1: '#9E6B5E',
        stop2: '#F3D6CE',
        stop3: '#C58B7E',
        stroke: '#C58B7E',
      };
    case 'silver':
      return {
        stop1: '#64748B',
        stop2: '#F1F5F9',
        stop3: '#94A3B8',
        stroke: '#94A3B8',
      };
    case 'bronze':
      return {
        stop1: '#7C5329',
        stop2: '#E6C299',
        stop3: '#B3824F',
        stroke: '#B3824F',
      };
    case 'gold':
    default:
      return {
        stop1: '#9A7432',
        stop2: '#F5E6B3',
        stop3: fallbackHex || '#D4AF37',
        stroke: fallbackHex || '#D4AF37',
      };
  }
}

export const BespokeCardFrame: React.FC<{
  style: OrnamentStyle;
  foilFinish: FoilFinish;
  foilHex: string;
  uid: string;
  cardShape?: CardCutShape;
}> = ({ style, foilFinish, foilHex, uid, cardShape = 'classic-frame' }) => {
  const colors = getFoilGradientColors(foilFinish, foilHex);
  const gradId = `foil-grad-${uid}`;
  const isArch = cardShape === 'arch';

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 340 490"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.stop1} />
          <stop offset="50%" stopColor={colors.stop2} />
          <stop offset="100%" stopColor={colors.stop3} />
        </linearGradient>
      </defs>

      {/* Outer Hairline Foil Border matching exact card geometry (Arch vs Classic/Chamfered) */}
      {isArch ? (
        <>
          <path
            d="M 10 168 A 160 158 0 0 1 330 168 L 330 472 Q 330 480 322 480 L 18 480 Q 10 480 10 472 Z"
            stroke={`url(#${gradId})`}
            strokeWidth="1.5"
            strokeOpacity="0.88"
          />
          <path
            d="M 17 170 A 153 151 0 0 1 323 170 L 323 466 Q 323 473 316 473 L 24 473 Q 17 473 17 466 Z"
            stroke={`url(#${gradId})`}
            strokeWidth="0.85"
            strokeOpacity="0.58"
          />
        </>
      ) : (
        <>
          <rect
            x="10"
            y="10"
            width="320"
            height="470"
            rx="7"
            stroke={`url(#${gradId})`}
            strokeWidth="1.5"
            strokeOpacity="0.88"
          />
          <rect
            x="17"
            y="17"
            width="306"
            height="456"
            rx="5"
            stroke={`url(#${gradId})`}
            strokeWidth="0.85"
            strokeOpacity="0.58"
          />
        </>
      )}

      {/* Corner & Crest Ornaments calibrated to stay inside the frame margin without touching text */}
      {style === 'persian-arabesque' && (
        <g stroke={`url(#${gradId})`} strokeWidth="1" opacity="0.88">
          <circle cx="170" cy="28" r="6" />
          <circle cx="170" cy="28" r="2.5" fill={`url(#${gradId})`} />
          <path d="M146 28 Q170 18 194 28 Q170 38 146 28 Z" />
          <path d="M17 442 Q40 442 40 473" />
          <path d="M323 442 Q300 442 300 473" />
          <path d="M142 465 L170 458 L198 465 L170 471 Z" />
        </g>
      )}

      {style === 'botanical-olive' && (
        <g stroke={`url(#${gradId})`} strokeWidth="1.1" opacity="0.88">
          <path d="M126 30 Q170 18 214 30" />
          <ellipse cx="148" cy="25" rx="6.5" ry="2.6" transform="rotate(-16 148 25)" />
          <ellipse cx="162" cy="23" rx="6.5" ry="2.6" transform="rotate(-6 162 23)" />
          <ellipse cx="178" cy="23" rx="6.5" ry="2.6" transform="rotate(6 178 23)" />
          <ellipse cx="192" cy="25" rx="6.5" ry="2.6" transform="rotate(16 192 25)" />
          <path d="M138 462 Q170 471 202 462" />
          <circle cx="170" cy="466" r="2.5" fill={`url(#${gradId})`} />
        </g>
      )}

      {style === 'art-deco-geometric' && (
        <g stroke={`url(#${gradId})`} strokeWidth="1.1" opacity="0.88">
          {!isArch && (
            <>
              <path d="M10 38 L38 10 M302 10 L330 38 M10 452 L38 480 M302 480 L330 452" />
              <path d="M10 26 L26 10 M314 10 L330 26 M10 464 L26 480 M314 480 L330 464" />
            </>
          )}
          <polygon points="170,19 178,28 170,37 162,28" />
          <polygon points="170,455 177,463 170,471 163,463" />
        </g>
      )}

      {style === 'baroque-crest' && (
        <g stroke={`url(#${gradId})`} strokeWidth="1.15" opacity="0.88">
          <path d="M134 30 C150 18, 190 18, 206 30" />
          <circle cx="170" cy="24" r="3.2" fill={`url(#${gradId})`} />
          <path d="M22 468 L44 468 L22 446 Z" opacity="0.45" />
          <path d="M318 468 L296 468 L318 446 Z" opacity="0.45" />
        </g>
      )}

      {style === 'celestial-arch' && (
        <g stroke={`url(#${gradId})`} strokeWidth="1.1" opacity="0.88">
          <path
            d="M170 19 L172 26 L179 28 L172 30 L170 37 L168 30 L161 28 L168 26 Z"
            fill={`url(#${gradId})`}
          />
          <circle cx="170" cy="464" r="3" fill={`url(#${gradId})`} />
        </g>
      )}

      {style === 'minimal-atelier' && (
        <g stroke={`url(#${gradId})`} strokeWidth="0.95" opacity="0.78">
          <line x1="130" y1="27" x2="210" y2="27" />
          <line x1="140" y1="464" x2="200" y2="464" />
          <circle cx="170" cy="27" r="2.2" fill={`url(#${gradId})`} />
        </g>
      )}
    </svg>
  );
};

export const WaxSealMedallion: React.FC<{
  monogram: string;
  waxHex: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ monogram, waxHex, size = 'lg' }) => {
  const dims =
    size === 'sm'
      ? 'w-10 h-10 text-[10px]'
      : size === 'md'
      ? 'w-14 h-14 text-xs'
      : 'w-22 h-22 text-base';

  return (
    <div
      className={`relative ${dims} rounded-full flex items-center justify-center select-none transition-transform duration-300 group-hover:scale-105`}
      style={{
        background: `radial-gradient(circle at 32% 28%, #F4D799 0%, ${waxHex} 48%, #4A3210 100%)`,
        boxShadow:
          '0 8px 18px rgba(0,0,0,0.36), inset 0 2px 5px rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.55)',
      }}
    >
      <div
        className="w-[82%] h-[82%] rounded-full flex items-center justify-center border border-[#FFF5D6]/45 px-1"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.48), 0 1px 2px rgba(255,255,255,0.35)',
        }}
      >
        <span
          dir="ltr"
          className="font-display-luxury font-bold tracking-tight whitespace-nowrap text-[#FFF8E7] drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]"
        >
          {monogram}
        </span>
      </div>
    </div>
  );
};

/**
 * 3D Multi-Style Interactive Envelope Closure powered by Framer Motion.
 * Renders 5 distinct, authentic physical closures matching `envelopeStyle`:
 * 1. `royal-wax`: Sculpted molten wax seal with wavy organic rim & embossed gold monogram
 * 2. `silk-ribbon`: Multi-looped 3D Satin Silk Bow with pleated ribbon tails & gold cameo
 * 3. `velvet-clasp`: Octagonal 24K Brushed Brass & Mother-of-Pearl Jewelled Clasp
 * 4. `persian-arch`: 16-Pointed Safavid Turquoise & Gold Filigree Shamseh Medallion
 * 5. `vintage-botanical`: Antique Botanical Wax Seal with Golden Twine & Olive Leaf Sprig
 */
export const FracturingWaxSeal3D: React.FC<{
  monogram: string;
  waxHex: string;
  foilHex?: string;
  envelopeStyle?: EnvelopeStyleVariant;
  phase: EnvelopeStagePhase;
  onActivate?: () => void;
}> = ({
  monogram,
  waxHex,
  foilHex = '#D4AF37',
  envelopeStyle = 'royal-wax',
  phase,
  onActivate,
}) => {
  const isBroken = phase !== 'sealed';

  const renderClosureArt = () => {
    if (envelopeStyle === 'silk-ribbon') {
      return (
        <div className="relative w-36 h-28 flex items-center justify-center select-none">
          {/* 3D Pleated Satin Silk Bow SVG */}
          <svg
            viewBox="0 0 160 120"
            className="w-full h-full overflow-visible"
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.45))' }}
          >
            <defs>
              <linearGradient id="silk-loop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="45%" stopColor="#F3E5AB" />
                <stop offset="80%" stopColor={foilHex} />
                <stop offset="100%" stopColor="#7C581E" />
              </linearGradient>
              <linearGradient id="silk-shadow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8A6421" />
                <stop offset="50%" stopColor="#F9E8B2" />
                <stop offset="100%" stopColor="#8A6421" />
              </linearGradient>
            </defs>
            {/* Flowing Ribbon Tails */}
            <path
              d="M 68 62 C 58 84, 42 102, 28 114 L 46 112 L 54 102 C 64 88, 72 74, 76 64 Z"
              fill="url(#silk-loop-grad)"
              stroke="#FFF8E7"
              strokeWidth="0.6"
            />
            <path
              d="M 92 62 C 102 84, 118 102, 132 114 L 114 112 L 106 102 C 96 88, 88 74, 84 64 Z"
              fill="url(#silk-loop-grad)"
              stroke="#FFF8E7"
              strokeWidth="0.6"
            />
            {/* Left Pleated Satin Bow Loop */}
            <path
              d="M 76 54 C 48 22, 10 28, 12 56 C 14 82, 52 78, 76 60 Z"
              fill="url(#silk-loop-grad)"
              stroke="#FFF8E7"
              strokeWidth="0.8"
            />
            <path
              d="M 72 55 C 50 42, 28 46, 22 56 C 32 64, 52 64, 72 58"
              fill="none"
              stroke="#8A6421"
              strokeWidth="1"
              opacity="0.45"
            />
            {/* Right Pleated Satin Bow Loop */}
            <path
              d="M 84 54 C 112 22, 150 28, 148 56 C 146 82, 108 78, 84 60 Z"
              fill="url(#silk-loop-grad)"
              stroke="#FFF8E7"
              strokeWidth="0.8"
            />
            <path
              d="M 88 55 C 110 42, 132 46, 138 56 C 128 64, 108 64, 88 58"
              fill="none"
              stroke="#8A6421"
              strokeWidth="1"
              opacity="0.45"
            />
            {/* Center Silk Knot & Gold Cameo */}
            <rect
              x="66"
              y="42"
              width="28"
              height="28"
              rx="8"
              fill="url(#silk-shadow-grad)"
              stroke="#FFFDF7"
              strokeWidth="1"
            />
          </svg>
          <div
            className="absolute w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#FFF8E7]"
            style={{
              background: `radial-gradient(circle at 35% 30%, #FFF9E6 0%, ${foilHex} 65%, #5E4214 100%)`,
              boxShadow: '0 6px 14px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.6)',
            }}
          >
            <span
              dir="ltr"
              className="font-display-luxury text-xs font-bold text-[#1C1917] tracking-tight whitespace-nowrap"
            >
              {monogram}
            </span>
          </div>
        </div>
      );
    }

    if (envelopeStyle === 'velvet-clasp') {
      return (
        <div
          className="relative w-26 h-26 flex items-center justify-center select-none"
          style={{
            clipPath:
              'polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)',
            background: `linear-gradient(135deg, #FCE8B2 0%, ${foilHex} 45%, #6E4E19 85%, #F5E1A4 100%)`,
            boxShadow: '0 16px 32px rgba(0,0,0,0.55)',
            padding: '5px',
          }}
        >
          <div
            className="w-full h-full flex flex-col items-center justify-center relative"
            style={{
              clipPath:
                'polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)',
              background: 'radial-gradient(circle at 35% 30%, #2C2523 0%, #14110F 100%)',
              border: '1px solid rgba(255, 245, 214, 0.5)',
            }}
          >
            {/* 4 Corner Diamond Rivets */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7B4] absolute top-2.5 left-1/2 -translate-x-1/2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7B4] absolute bottom-2.5 left-1/2 -translate-x-1/2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7B4] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F7E7B4] absolute right-2.5 top-1/2 -translate-y-1/2" />
            <div className="w-15 h-15 rounded-full border border-[#F5E6B3]/60 flex items-center justify-center bg-[#1C1917]">
              <span
                dir="ltr"
                className="font-display-luxury text-base font-bold tracking-wider text-[#F7E7B4] whitespace-nowrap"
              >
                {monogram}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (envelopeStyle === 'persian-arch') {
      return (
        <div className="relative w-28 h-28 flex items-center justify-center select-none">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 12px 22px rgba(0,0,0,0.52))' }}
          >
            <defs>
              <radialGradient id="shamseh-gold" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF4CC" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#6E4B14" />
              </radialGradient>
            </defs>
            {/* 16-Pointed Star Safavid Shamseh */}
            <polygon
              points="60,2 71,16 89,10 92,28 110,31 104,49 118,60 104,71 110,89 92,92 89,110 71,104 60,118 49,104 31,110 28,92 10,89 16,71 2,60 16,49 10,31 28,28 31,10 49,16"
              fill="url(#shamseh-gold)"
              stroke="#FFF8E7"
              strokeWidth="1.2"
            />
            <circle cx="60" cy="60" r="41" fill="#12354A" stroke="#F5E6B3" strokeWidth="1.5" />
            <circle
              cx="60"
              cy="60"
              r="34"
              fill="#19586E"
              stroke="#F5E6B3"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx="60" cy="60" r="26" fill="#0F2336" stroke="#D4AF37" strokeWidth="1.2" />
          </svg>
          <span
            dir="ltr"
            className="absolute font-display-luxury text-base font-bold tracking-wider text-[#FFF8E7] whitespace-nowrap drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
          >
            {monogram}
          </span>
        </div>
      );
    }

    if (envelopeStyle === 'vintage-botanical') {
      return (
        <div className="relative w-28 h-28 flex items-center justify-center select-none">
          {/* Pressed Gold & Olive Sprig tucked diagonally behind and across the wax seal */}
          <svg
            viewBox="0 0 120 120"
            className="absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none"
          >
            <g stroke="#E6C687" strokeWidth="1.5" fill="#5E7153">
              <path d="M 18 98 Q 60 56 102 16" fill="none" stroke="#D4AF37" strokeWidth="1.8" />
              <ellipse cx="36" cy="78" rx="9" ry="4" transform="rotate(-35 36 78)" />
              <ellipse cx="84" cy="34" rx="9" ry="4" transform="rotate(-35 84 34)" />
              <ellipse cx="94" cy="24" rx="7" ry="3.2" transform="rotate(-45 94 24)" />
            </g>
          </svg>
          <div
            className="relative w-23 h-23 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 32% 28%, #FCE6AE 0%, ${waxHex} 48%, #4A2E0B 100%)`,
              boxShadow:
                '0 14px 26px rgba(0,0,0,0.48), inset 0 3px 7px rgba(255,255,255,0.52), inset 0 -5px 10px rgba(0,0,0,0.62)',
            }}
          >
            <div className="w-[82%] h-[82%] rounded-full border border-[#FFF3D1]/50 flex items-center justify-center">
              <span
                dir="ltr"
                className="font-display-luxury text-base font-bold tracking-wider text-[#FFF9EA] whitespace-nowrap drop-shadow-[0_2px_3px_rgba(0,0,0,0.75)]"
              >
                {monogram}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Default `royal-wax`: Photorealistic sculpted molten wax & antique brass seal with frayed silk chiffon ribbon underlay
    const organicRimPath =
      'M 50,2 C 64,1 75,5 85,13 C 94,21 99,33 98,46 C 98,56 101,66 95,77 C 89,88 78,95 64,98 C 51,100 39,96 27,90 C 16,84 7,73 4,60 C 1,46 5,31 13,20 C 21,9 36,3 50,2 Z';
    const innerCushionPath =
      'M 50,9 C 62,8 71,11 79,18 C 87,25 91,35 91,46 C 91,55 93,64 87,73 C 81,82 71,88 59,90 C 48,92 38,89 28,83 C 19,77 12,67 10,56 C 8,44 11,33 18,23 C 25,14 37,9 50,9 Z';

    return (
      <div className="relative w-28 h-28 flex items-center justify-center select-none">
        {/* Diagonal Frayed Cream Raw-Silk Chiffon Ribbon Underlay (inspired by wax_seal_craftsmanship reference) */}
        <div
          className="absolute w-11 h-36 pointer-events-none chiffon-ribbon-frayed rounded-[2px] z-0 opacity-95"
          style={{
            transform: 'rotate(-24deg)',
            filter: 'drop-shadow(0 6px 12px rgba(8, 5, 3, 0.42))',
          }}
        />

        <svg
          viewBox="0 0 100 100"
          className="relative z-10 w-full h-full overflow-visible"
          style={{
            filter:
              'drop-shadow(0 12px 20px rgba(10, 6, 3, 0.56)) drop-shadow(0 3px 6px rgba(10, 6, 3, 0.42))',
          }}
        >
          <defs>
            <radialGradient id="molten-wax-body" cx="34%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#F5DE9E" />
              <stop offset="22%" stopColor="#D4AF37" />
              <stop offset="52%" stopColor={waxHex} />
              <stop offset="84%" stopColor={waxHex} />
              <stop offset="100%" stopColor="#1E0C05" />
            </radialGradient>
            <linearGradient id="molten-wax-bevel" x1="12%" y1="8%" x2="88%" y2="92%">
              <stop offset="0%" stopColor="#FCE8B2" stopOpacity="0.68" />
              <stop offset="40%" stopColor={foilHex} stopOpacity="0.38" />
              <stop offset="75%" stopColor={waxHex} stopOpacity="0.22" />
              <stop offset="100%" stopColor="#140702" stopOpacity="0.85" />
            </linearGradient>
            <radialGradient id="molten-wax-well" cx="56%" cy="60%" r="58%">
              <stop offset="0%" stopColor={waxHex} />
              <stop offset="62%" stopColor="#3B190B" />
              <stop offset="100%" stopColor="#180803" />
            </radialGradient>
            <linearGradient id="stamped-gold-relief" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3CC" />
              <stop offset="50%" stopColor="#E5C158" />
              <stop offset="100%" stopColor="#9A7426" />
            </linearGradient>
          </defs>

          {/* Organic Molten Outer Puddle Rim */}
          <path
            d={organicRimPath}
            fill="url(#molten-wax-body)"
            stroke="#240E05"
            strokeWidth="0.75"
          />

          {/* Sculpted Outer Cushion Lip (Matte Satin Relief — No Cartoon White Strokes) */}
          <path
            d={innerCushionPath}
            fill="none"
            stroke="url(#molten-wax-bevel)"
            strokeWidth="4.2"
          />

          {/* Brass Die Stamped Recessed Inner Well */}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="url(#molten-wax-well)"
            stroke="#1E0B04"
            strokeWidth="1.3"
          />
          <circle
            cx="50"
            cy="50"
            r="32.4"
            fill="none"
            stroke="url(#stamped-gold-relief)"
            strokeWidth="0.7"
            opacity="0.62"
          />

          {/* Continuous Symmetrical Botanical Laurel & Olive Wreath */}
          <g
            fill="url(#stamped-gold-relief)"
            opacity="0.82"
            transform="translate(50, 50)"
          >
            {Array.from({ length: 20 }).map((_, idx) => {
              const deg = idx * 18;
              return (
                <g key={idx} transform={`rotate(${deg}) translate(0, -27.8)`}>
                  <path d="M 0,0 C 1.5,-2.2 3.8,-2.2 5.0,-0.3 C 3.5,1.1 1.5,1.1 0,0 Z" />
                  <path d="M 0,0.4 C -1.4,-1.5 -3.4,-1.5 -4.4,0.2 C -3.0,1.4 -1.4,1.3 0,0.4 Z" opacity="0.75" />
                </g>
              );
            })}
          </g>

          {/* Inner Stamped Brass Ring Framing the Monogram */}
          <circle
            cx="50"
            cy="50"
            r="22.8"
            fill="none"
            stroke="url(#stamped-gold-relief)"
            strokeWidth="0.75"
            opacity="0.58"
          />
        </svg>

        {/* Dynamic Directional Specular Light Sheen (driven by Studio Lighting Azimuth/Elevation/Intensity CSS vars) */}
        <div
          className="absolute inset-2 rounded-full pointer-events-none z-15 mix-blend-soft-light transition-all duration-200"
          style={{
            background:
              'radial-gradient(circle at var(--wax-highlight-x, 34%) var(--wax-highlight-y, 28%), rgba(255, 250, 232, var(--wax-specular-alpha, 0.72)) 0%, rgba(255, 238, 188, 0.22) 38%, transparent 72%)',
          }}
        />

        {/* Embossed Monogram in Center of Wax Well with Deep Relief */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-2 z-20">
          <span
            dir="ltr"
            className="font-display-luxury text-base sm:text-lg font-bold tracking-wider whitespace-nowrap text-[#FCECC2]"
            style={{
              textShadow:
                '0 1.8px 2.4px rgba(15, 5, 2, 0.94), 0 -0.7px 0 rgba(255, 248, 220, 0.45)',
            }}
          >
            {monogram}
          </span>
        </div>
      </div>
    );
  };

  const sealDiscContent = renderClosureArt();

  const sealAnimClass =
    phase === 'sealed'
      ? 'wax-seal-sealed-state'
      : phase === 'cracking'
      ? 'envelope-wax-melt'
      : phase === 'flap-opening'
      ? 'envelope-wax-melt wax-seal-peel-float'
      : 'wax-seal-hidden-stage';

  return (
    <motion.button
      type="button"
      data-testid="wax-seal-trigger"
      data-seal-phase={phase}
      onClick={onActivate}
      disabled={isBroken}
      aria-label="باز کردن مهر مومی و پاکت دعوت‌نامه"
      className={`group relative w-32 h-32 flex items-center justify-center cursor-pointer focus:outline-none disabled:cursor-default ${sealAnimClass}`}
      style={{ transformStyle: 'preserve-3d' }}
      whileHover={!isBroken ? { scale: 1.04, y: -2 } : undefined}
      whileTap={!isBroken ? { scale: 0.96 } : undefined}
    >
      {/* Realistic Paper Contact Shadow under the Wax Seal */}
      <div
        className="pointer-events-none absolute inset-4 rounded-full transition-all duration-700"
        style={{
          background:
            'radial-gradient(circle, rgba(24, 15, 8, 0.45) 0%, rgba(24, 15, 8, 0.18) 58%, transparent 78%)',
          transform: isBroken
            ? 'translateY(22px) scale(0.75)'
            : 'translateY(5px) scale(0.96)',
          opacity: isBroken ? 0.12 : 0.76,
          filter: isBroken ? 'blur(10px)' : 'blur(4px)',
        }}
      />

      {/* Subtle Warm Gold Shimmer Ring when Sealed */}
      {!isBroken && (
        <motion.div
          className="pointer-events-none absolute inset-3 rounded-full border border-[#F5E6B3]/45"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.48, 0, 0.48],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Unified Seamless 3D Wax Medallion (peels & floats upward via CSS .wax-seal-peel-float) */}
      <div
        data-testid="wax-seal-disc"
        className="relative inset-0 flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span data-testid="wax-seal-left-half" className="sr-only" />
        <span data-testid="wax-seal-right-half" className="sr-only" />
        {sealDiscContent}
      </div>
    </motion.button>
  );
};

/**
 * Subtle tactile 'Paper Dust' particle emitter powered by Framer Motion.
 * Triggers when the 600gsm cotton card is pulled out of the envelope pocket,
 * releasing sunlit cotton fibers and microscopic gold flecks along the envelope throat.
 */
export const PaperDustEmitter: React.FC<{
  active: boolean;
  foilHex: string;
  burstKey: number;
}> = ({ active, foilHex, burstKey }) => {
  const particles = useMemo(() => generatePaperDustParticles(24), []);

  if (!active) {
    return null;
  }

  return (
    <div
      key={`paper-dust-burst-${burstKey}`}
      data-testid="paper-dust-emitter"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
      style={{ zIndex: 35 }}
    >
      {particles.map((p) => {
        const isFiber = p.kind === 'cotton-fiber';
        const width = p.sizePx;
        const height = Math.max(1.6, Number((p.sizePx * p.aspectRatio).toFixed(2)));

        return (
          <motion.span
            key={p.id}
            data-testid={`paper-dust-particle-${p.id}`}
            data-particle-kind={p.kind}
            className="pointer-events-none absolute rounded-full"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              background: isFiber
                ? 'radial-gradient(circle, rgba(255,252,245,0.96) 0%, rgba(242,233,216,0.78) 70%, rgba(226,214,193,0.15) 100%)'
                : `radial-gradient(circle, #FFFDF7 0%, ${foilHex} 65%, rgba(182,141,64,0.2) 100%)`,
              boxShadow: isFiber
                ? '0 0 6px rgba(255, 250, 238, 0.72)'
                : `0 0 8px ${foilHex}99`,
              filter: isFiber ? 'blur(0.25px)' : 'none',
            }}
            initial={{
              x: p.originX,
              y: p.originY,
              scale: 0.25,
              opacity: 0,
              rotate: p.rotationDeg * 0.2,
            }}
            animate={{
              x: [
                p.originX,
                p.originX + p.driftX * 0.58,
                p.originX + p.driftX,
              ],
              y: [
                p.originY,
                p.originY + p.driftY * 0.65,
                p.originY + p.driftY - 14,
              ],
              scale: [0.25, 1.12, 0.55],
              opacity: [0, p.peakOpacity, 0],
              rotate: [
                p.rotationDeg * 0.2,
                p.rotationDeg * 0.75,
                p.rotationDeg,
              ],
            }}
            transition={{
              duration: p.durationSec,
              delay: p.delaySec,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.32, 1],
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * =========================================================================
 * BESPOKE ENVELOPE SUITE ORNAMENTS
 * Harmonizes the envelope with the card's exact collection & ornamentStyle:
 * - Persian Heritage (Shamseh & Arabesque Tazhib)
 * - Botanical Olive (Laurel Wreath & Watercolor Olive Branches)
 * - Royal Couture (Versailles Acanthus Scrolls & Imperial Crown)
 * - Gatsby Art Deco (1920s Stepped Sunburst & Chevrons)
 * - Celestial Soirée (Starlight Arches & Constellations)
 * - Executive Atelier (Modern Minimal Precision Gold Rules)
 * =========================================================================
 */

export const EnvelopeFlapMotif: React.FC<{
  style: OrnamentStyle;
  foilFinish: FoilFinish;
  foilHex: string;
  monogram: string;
  uid: string;
}> = ({ style, foilFinish, foilHex, monogram, uid }) => {
  const colors = getFoilGradientColors(foilFinish, foilHex);
  const gradId = `flap-foil-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 500 218"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.stop1} />
          <stop offset="50%" stopColor={colors.stop2} />
          <stop offset="100%" stopColor={colors.stop3} />
        </linearGradient>
      </defs>

      {/* Sweeping 24K Gold Foil Deckle Flap Contour */}
      <path
        d="M 0,0 C 15,35 60,94 120,144 C 185,196 225,218 250,218 C 275,218 315,196 380,144 C 440,94 485,35 500,0"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="1.8"
        strokeOpacity="0.9"
      />
      {/* 1px Daylight Paper Catchlight */}
      <path
        d="M 3,0 C 17,34 61,92 121,142 C 186,194 225,216 250,216 C 275,216 314,194 379,142 C 439,92 483,34 497,0"
        fill="none"
        stroke="#FFF9EC"
        strokeWidth="0.8"
        strokeOpacity="0.65"
      />
      {/* Inset Hairline Gilded Stitch Contour */}
      <path
        d="M 8,0 C 22,32 64,88 123,138 C 187,190 225,212 250,212 C 275,212 313,190 377,138 C 436,88 478,32 492,0"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="0.8"
        strokeOpacity="0.5"
      />

      {/* THEMATIC FLAP CREST & WING EMBELLISHMENTS */}
      {style === 'persian-arabesque' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.92">
          {/* Central Persian Shamseh Medallion */}
          <circle cx="250" cy="38" r="14" strokeWidth="1.2" />
          <circle cx="250" cy="38" r="10" strokeWidth="0.8" strokeDasharray="2 1.5" />
          <circle cx="250" cy="38" r="2.5" fill={`url(#${gradId})`} />
          {/* 8 Radiating Shamseh Petals */}
          <path d="M 250,20 L 252,24 L 250,28 L 248,24 Z" fill={`url(#${gradId})`} />
          <path d="M 250,48 L 252,52 L 250,56 L 248,52 Z" fill={`url(#${gradId})`} />
          <path d="M 232,38 L 236,36 L 240,38 L 236,40 Z" fill={`url(#${gradId})`} />
          <path d="M 260,38 L 264,36 L 268,38 L 264,40 Z" fill={`url(#${gradId})`} />
          {/* Shah Abbasi Floral Arabesque Scrolls Flanking the Flap */}
          <path d="M 230,38 Q 195,30 160,50 Q 130,68 100,102" strokeWidth="1" />
          <path d="M 270,38 Q 305,30 340,50 Q 370,68 400,102" strokeWidth="1" />
          <circle cx="160" cy="50" r="2" fill={`url(#${gradId})`} />
          <circle cx="340" cy="50" r="2" fill={`url(#${gradId})`} />
        </g>
      )}

      {style === 'botanical-olive' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.92">
          {/* Central Laurel Wreath Encircling Monogram */}
          <path d="M 232,38 C 232,24 242,16 250,16 C 258,16 268,24 268,38 C 268,52 258,60 250,60 C 242,60 232,52 232,38" strokeWidth="1.2" />
          {/* Olive Leaf Sprigs Flanking Flap */}
          <ellipse cx="236" cy="24" rx="4.5" ry="1.8" transform="rotate(-30 236 24)" fill={`url(#${gradId})`} />
          <ellipse cx="264" cy="24" rx="4.5" ry="1.8" transform="rotate(30 264 24)" fill={`url(#${gradId})`} />
          <ellipse cx="228" cy="38" rx="4.5" ry="1.8" transform="rotate(-60 228 38)" fill={`url(#${gradId})`} />
          <ellipse cx="272" cy="38" rx="4.5" ry="1.8" transform="rotate(60 272 38)" fill={`url(#${gradId})`} />
          {/* Flowing Olive Vines along Flap Wings */}
          <path d="M 226,48 Q 180,48 140,78 Q 110,102 85,130" strokeWidth="1" />
          <path d="M 274,48 Q 320,48 360,78 Q 390,102 415,130" strokeWidth="1" />
          <ellipse cx="170" cy="55" rx="5" ry="2" transform="rotate(-15 170 55)" />
          <ellipse cx="330" cy="55" rx="5" ry="2" transform="rotate(15 330 55)" />
        </g>
      )}

      {style === 'baroque-crest' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.92">
          {/* Imperial Versailles Crown */}
          <path d="M 236,46 L 232,28 L 242,34 L 250,22 L 258,34 L 268,28 L 264,46 Z" strokeWidth="1.2" />
          <circle cx="232" cy="26" r="1.8" fill={`url(#${gradId})`} />
          <circle cx="250" cy="20" r="2.2" fill={`url(#${gradId})`} />
          <circle cx="268" cy="26" r="1.8" fill={`url(#${gradId})`} />
          <line x1="234" y1="42" x2="266" y2="42" strokeWidth="1" />
          {/* Acanthus Leaf Scroll Supporters */}
          <path d="M 228,36 C 200,26 170,36 145,60 C 120,84 95,116 75,145" strokeWidth="1.1" />
          <path d="M 272,36 C 300,26 330,36 355,60 C 380,84 405,116 425,145" strokeWidth="1.1" />
        </g>
      )}

      {style === 'art-deco-geometric' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.92">
          {/* 1920s Gatsby Tiered Sunburst */}
          <polygon points="250,16 262,32 250,48 238,32" strokeWidth="1.2" />
          <polygon points="250,22 258,32 250,42 242,32" fill={`url(#${gradId})`} opacity="0.3" />
          <line x1="250" y1="10" x2="250" y2="4" strokeWidth="1.5" />
          <line x1="266" y1="20" x2="272" y2="16" strokeWidth="1.2" />
          <line x1="234" y1="20" x2="228" y2="16" strokeWidth="1.2" />
          {/* Stepped Chevron Rules */}
          <path d="M 228,32 L 190,32 L 150,65 L 120,95 L 90,130" strokeWidth="1" />
          <path d="M 272,32 L 310,32 L 350,65 L 380,95 L 410,130" strokeWidth="1" />
        </g>
      )}

      {style === 'celestial-arch' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.92">
          {/* 8-Pointed Celestial Starburst */}
          <path d="M 250,18 L 252,28 L 262,30 L 252,32 L 250,42 L 248,32 L 238,30 L 248,28 Z" fill={`url(#${gradId})`} />
          <circle cx="250" cy="30" r="15" strokeWidth="0.8" strokeDasharray="3 2" />
          {/* Crescent Moon & Stardust Arch */}
          <circle cx="215" cy="38" r="2" fill={`url(#${gradId})`} />
          <circle cx="285" cy="38" r="2" fill={`url(#${gradId})`} />
          <circle cx="175" cy="58" r="1.5" fill={`url(#${gradId})`} />
          <circle cx="325" cy="58" r="1.5" fill={`url(#${gradId})`} />
          <circle cx="130" cy="90" r="1.2" fill={`url(#${gradId})`} />
          <circle cx="370" cy="90" r="1.2" fill={`url(#${gradId})`} />
        </g>
      )}

      {style === 'minimal-atelier' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Minimal Atelier Diamond Crest */}
          <polygon points="250,22 258,32 250,42 242,32" strokeWidth="1.2" />
          <circle cx="250" cy="32" r="2" fill={`url(#${gradId})`} />
          <line x1="210" y1="32" x2="236" y2="32" strokeWidth="1" />
          <line x1="264" y1="32" x2="290" y2="32" strokeWidth="1" />
        </g>
      )}

      {/* Center Monogram Penning on Flap */}
      <text
        x="250"
        y="58"
        textAnchor="middle"
        className="font-display-luxury text-[11px] font-bold tracking-[0.24em]"
        fill={`url(#${gradId})`}
        style={{
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.65))',
        }}
      >
        ✦ {monogram} ✦
      </text>
    </svg>
  );
};

export const EnvelopePocketMotif: React.FC<{
  style: OrnamentStyle;
  foilFinish: FoilFinish;
  foilHex: string;
  template: InvitationTemplate;
  uid: string;
}> = ({ style, foilFinish, foilHex, template, uid }) => {
  const colors = getFoilGradientColors(foilFinish, foilHex);
  const gradId = `pocket-foil-grad-${uid}`;

  return (
    <svg
      viewBox="0 0 500 365"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.stop1} />
          <stop offset="50%" stopColor={colors.stop2} />
          <stop offset="100%" stopColor={colors.stop3} />
        </linearGradient>
      </defs>

      {/* =====================================================================
          1. NATURAL EMBOSSED POCKET THROAT LIP (Solid Paper Catchlight & Shadow)
          - Replaces weird dashed wireframes with real physical cotton paper throat contour
          ===================================================================== */}
      {/* Soft Cavity Drop Shadow along the Curving Throat */}
      <path
        d="M 0,44 C 90,85 170,128 250,128 C 330,128 410,85 500,44"
        fill="none"
        stroke="rgba(10,7,5,0.45)"
        strokeWidth="2.5"
      />
      {/* 1px Daylight Paper Catchlight along Lip */}
      <path
        d="M 0,44 C 90,85 170,128 250,128 C 330,128 410,85 500,44"
        fill="none"
        stroke="#FFF9EC"
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />
      {/* 24K Gold Foil Deckle Stitch Line along Throat */}
      <path
        d="M 0,47 C 90,88 170,131 250,131 C 330,131 410,88 500,47"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="1.2"
        strokeOpacity="0.75"
      />

      {/* =====================================================================
          2. VINTAGE COUTURE AIRMAIL / DIPLOMATIC POSTMARK STAMP (Top Right Flank)
          - Safely positioned on envelope body, 100% visible and unclipped
          ===================================================================== */}
      <g transform="translate(395, 145)" opacity="0.85" stroke={`url(#${gradId})`}>
        {/* Scalloped / Perforated Stamp Outer Frame */}
        <rect
          x="0"
          y="0"
          width="50"
          height="60"
          rx="3"
          fill="none"
          strokeWidth="1.2"
          strokeDasharray="3 1.5"
        />
        <rect x="3" y="3" width="44" height="54" rx="2" fill="none" strokeWidth="0.8" />
        <circle cx="25" cy="26" r="15" fill="none" strokeWidth="0.9" />
        <circle cx="25" cy="26" r="11" fill="none" strokeWidth="0.6" strokeDasharray="2 1.5" />
        <text
          x="25"
          y="30"
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontSize="8"
          fontFamily="serif"
          fontWeight="bold"
        >
          {template.waxSealMonogram}
        </text>
        <text
          x="25"
          y="50"
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontSize="5.5"
          letterSpacing="1"
        >
          MAISON
        </text>
        {/* Postal Cancellation Waves extending towards center */}
        <path d="M -8,15 C -18,11 -28,19 -38,15 C -48,11 -58,19 -68,15" fill="none" strokeWidth="0.85" />
        <path d="M -8,25 C -18,21 -28,29 -38,25 C -48,21 -58,29 -68,25" fill="none" strokeWidth="0.85" />
        <path d="M -8,35 C -18,31 -28,39 -38,35 C -48,31 -58,39 -68,35" fill="none" strokeWidth="0.85" />
      </g>

      {/* =====================================================================
          3. DEDICATED 4-CORNER EMBELLISHMENTS MATCHING INVITATION CARD STYLE
          ===================================================================== */}
      {style === 'persian-arabesque' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Bottom Left Persian Tazhib Spandrel */}
          <g transform="translate(18, 290)">
            <path d="M 4 60 L 4 20 C 4 45 25 60 60 60 Z" strokeWidth="1.2" />
            <path d="M 12 56 C 12 40 28 40 38 56" strokeWidth="0.8" />
            <circle cx="22" cy="44" r="2.5" fill={`url(#${gradId})`} />
            <path d="M 4 35 Q 25 35 45 55" strokeWidth="0.8" />
          </g>
          {/* Bottom Right Persian Tazhib Spandrel */}
          <g transform="translate(482, 290) scale(-1, 1)">
            <path d="M 4 60 L 4 20 C 4 45 25 60 60 60 Z" strokeWidth="1.2" />
            <path d="M 12 56 C 12 40 28 40 38 56" strokeWidth="0.8" />
            <circle cx="22" cy="44" r="2.5" fill={`url(#${gradId})`} />
            <path d="M 4 35 Q 25 35 45 55" strokeWidth="0.8" />
          </g>
        </g>
      )}

      {style === 'botanical-olive' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Bottom Left Botanical Olive Sprig */}
          <g transform="translate(18, 295)">
            <path d="M 6 58 Q 28 40 54 48" strokeWidth="1.2" />
            <ellipse cx="22" cy="46" rx="6" ry="2.5" transform="rotate(-25 22 46)" fill={`url(#${gradId})`} opacity="0.6" />
            <ellipse cx="36" cy="44" rx="6" ry="2.5" transform="rotate(20 36 44)" fill={`url(#${gradId})`} opacity="0.6" />
            <ellipse cx="48" cy="48" rx="5" ry="2" transform="rotate(-15 48 48)" fill={`url(#${gradId})`} opacity="0.6" />
            <circle cx="28" cy="50" r="2" fill={`url(#${gradId})`} />
          </g>
          {/* Bottom Right Botanical Olive Sprig */}
          <g transform="translate(482, 295) scale(-1, 1)">
            <path d="M 6 58 Q 28 40 54 48" strokeWidth="1.2" />
            <ellipse cx="22" cy="46" rx="6" ry="2.5" transform="rotate(-25 22 46)" fill={`url(#${gradId})`} opacity="0.6" />
            <ellipse cx="36" cy="44" rx="6" ry="2.5" transform="rotate(20 36 44)" fill={`url(#${gradId})`} opacity="0.6" />
            <ellipse cx="48" cy="48" rx="5" ry="2" transform="rotate(-15 48 48)" fill={`url(#${gradId})`} opacity="0.6" />
            <circle cx="28" cy="50" r="2" fill={`url(#${gradId})`} />
          </g>
        </g>
      )}

      {style === 'baroque-crest' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Bottom Left Baroque Acanthus Scroll */}
          <g transform="translate(18, 290)">
            <path d="M 6 58 C 6 30 30 30 40 58" strokeWidth="1.2" />
            <path d="M 6 58 L 24 58 L 6 40 Z" fill={`url(#${gradId})`} opacity="0.4" />
            <circle cx="24" cy="40" r="2.5" fill={`url(#${gradId})`} />
          </g>
          {/* Bottom Right Baroque Acanthus Scroll */}
          <g transform="translate(482, 290) scale(-1, 1)">
            <path d="M 6 58 C 6 30 30 30 40 58" strokeWidth="1.2" />
            <path d="M 6 58 L 24 58 L 6 40 Z" fill={`url(#${gradId})`} opacity="0.4" />
            <circle cx="24" cy="40" r="2.5" fill={`url(#${gradId})`} />
          </g>
        </g>
      )}

      {style === 'art-deco-geometric' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Bottom Left 1920s Art Deco Fan */}
          <g transform="translate(18, 300)">
            <path d="M 4 52 L 52 52 M 4 52 L 4 4" strokeWidth="1.2" />
            <path d="M 12 52 L 12 24 L 32 44" strokeWidth="0.8" />
            <path d="M 4 42 L 28 42" strokeWidth="0.8" />
            <polygon points="12,12 18,18 12,24 6,18" fill={`url(#${gradId})`} />
          </g>
          {/* Bottom Right 1920s Art Deco Fan */}
          <g transform="translate(482, 300) scale(-1, 1)">
            <path d="M 4 52 L 52 52 M 4 52 L 4 4" strokeWidth="1.2" />
            <path d="M 12 52 L 12 24 L 32 44" strokeWidth="0.8" />
            <path d="M 4 42 L 28 42" strokeWidth="0.8" />
            <polygon points="12,12 18,18 12,24 6,18" fill={`url(#${gradId})`} />
          </g>
        </g>
      )}

      {style === 'celestial-arch' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.85">
          {/* Bottom Left Celestial Starburst Cluster */}
          <g transform="translate(24, 305)">
            <path d="M 20 20 L 22 28 L 30 30 L 22 32 L 20 40 L 18 32 L 10 30 L 18 28 Z" fill={`url(#${gradId})`} />
            <circle cx="34" cy="22" r="1.5" fill={`url(#${gradId})`} />
            <circle cx="12" cy="44" r="1.5" fill={`url(#${gradId})`} />
            <circle cx="28" cy="46" r="1" fill={`url(#${gradId})`} />
          </g>
          {/* Bottom Right Celestial Starburst Cluster */}
          <g transform="translate(476, 305) scale(-1, 1)">
            <path d="M 20 20 L 22 28 L 30 30 L 22 32 L 20 40 L 18 32 L 10 30 L 18 28 Z" fill={`url(#${gradId})`} />
            <circle cx="34" cy="22" r="1.5" fill={`url(#${gradId})`} />
            <circle cx="12" cy="44" r="1.5" fill={`url(#${gradId})`} />
            <circle cx="28" cy="46" r="1" fill={`url(#${gradId})`} />
          </g>
        </g>
      )}

      {style === 'minimal-atelier' && (
        <g stroke={`url(#${gradId})`} fill="none" opacity="0.8">
          {/* Bottom Left Minimal Atelier Rule */}
          <g transform="translate(20, 310)">
            <line x1="4" y1="44" x2="44" y2="44" strokeWidth="1.2" />
            <line x1="4" y1="44" x2="4" y2="4" strokeWidth="1.2" />
            <circle cx="4" cy="44" r="2.2" fill={`url(#${gradId})`} />
          </g>
          {/* Bottom Right Minimal Atelier Rule */}
          <g transform="translate(480, 310) scale(-1, 1)">
            <line x1="4" y1="44" x2="44" y2="44" strokeWidth="1.2" />
            <line x1="4" y1="44" x2="4" y2="4" strokeWidth="1.2" />
            <circle cx="4" cy="44" r="2.2" fill={`url(#${gradId})`} />
          </g>
        </g>
      )}
    </svg>
  );
};
