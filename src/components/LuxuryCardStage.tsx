import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  BookOpen,
  MailOpen,
  RefreshCw,
  Hand,
  ArrowUp,
  Navigation,
  Copy,
  Check,
  X,
  Sun,
} from 'lucide-react';
import {
  CardFaceSide,
  ENVELOPE_STYLE_VARIANTS,
  EnvelopeStagePhase,
  EnvelopeStyleVariant,
  InvitationTemplate,
  RsvpEntry,
  calculateRsvpSummary,
  computeHorizontalCardRotation,
  generateEnvelopeOpeningWavDataUri,
  getAdaptiveHeadingSizeClass,
  getCardSurfaceDebossStyle,
  getDefaultEnvelopeStyleForAnimation,
  getDressCodeSwatches,
  getEnvelopeLayerSeparationStyle,
  getEnvelopePhaseTimings,
  getInteractiveStageStep,
  getPaperTextureBlendStyle,
  getStudioLightingStyle,
} from '../utils/templateAdapter';
import {
  FracturingWaxSeal3D,
  PaperDustEmitter,
} from './BespokeOrnaments';

interface LuxuryCardStageProps {
  template: InvitationTemplate;
  language: 'fa' | 'en';
  rsvpList: RsvpEntry[];
  onAddRsvp: (entry: Omit<RsvpEntry, 'id' | 'createdAt'>) => void;
}

export const LuxuryCardStage: React.FC<LuxuryCardStageProps> = ({
  template,
  language,
  rsvpList,
  onAddRsvp,
}) => {
  // Step 1 by default: Start on the sealed envelope (never jump straight to the card)
  const [phase, setPhase] = useState<EnvelopeStagePhase>('sealed');
  const [cardFace, setCardFace] = useState<CardFaceSide>('front');
  const [envelopeStyle, setEnvelopeStyle] = useState<EnvelopeStyleVariant>(() =>
    getDefaultEnvelopeStyleForAnimation(template.animationType)
  );
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [dustBurstKey, setDustBurstKey] = useState<number>(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [showLocationDrawer, setShowLocationDrawer] = useState<boolean>(false);
  const [addressCopied, setAddressCopied] = useState<boolean>(false);
  const [calendarSaved, setCalendarSaved] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);
  const prevTemplateIdRef = useRef<string>(template.id);
  const dragStartYRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const didHorizontalSwipeRef = useRef<boolean>(false);
  const [liveDragDeltaX, setLiveDragDeltaX] = useState<number>(0);
  const [hoverTiltY, setHoverTiltY] = useState<number>(0);
  const [hoverTiltX, setHoverTiltX] = useState<number>(0);
  const [paperTextureSlider, setPaperTextureSlider] = useState<number>(0);
  const [lightAzimuth, setLightAzimuth] = useState<number>(135);
  const [lightElevation, setLightElevation] = useState<number>(42);
  const [lightIntensity, setLightIntensity] = useState<number>(85);
  const [audioPlayCount, setAudioPlayCount] = useState<number>(0);
  const envelopeAudioRef = useRef<HTMLAudioElement | null>(null);
  const envelopeOpeningWavUri = generateEnvelopeOpeningWavDataUri();

  // RSVP form states
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [dietaryPreference] = useState('پذیرایی کامل شام');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const summary = calculateRsvpSummary(rsvpList);
  const timings = getEnvelopePhaseTimings(template.animationType);
  const stepInfo = getInteractiveStageStep(phase, cardFace);
  const activeEnvelopeMeta =
    ENVELOPE_STYLE_VARIANTS.find((v) => v.id === envelopeStyle) ??
    ENVELOPE_STYLE_VARIANTS[0];
  const dressCodeSwatches = getDressCodeSwatches(template.palette);

  const displayHostNames =
    language === 'fa' ? template.hostNamesFa : template.hostNamesEn;
  const hostHeadingSizeClass = getAdaptiveHeadingSizeClass(displayHostNames, 'stage');

  const clearChoreographyTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearChoreographyTimers();
  }, []);

  // Sync envelope style when template or its animationType changes, and reset to Step 1 (Sealed)
  useEffect(() => {
    setEnvelopeStyle(getDefaultEnvelopeStyleForAnimation(template.animationType));
  }, [template.animationType]);

  useEffect(() => {
    if (prevTemplateIdRef.current !== template.id) {
      prevTemplateIdRef.current = template.id;
      clearChoreographyTimers();
      setCardFace('front');
      setIsFlipping(false);
      setPhase('sealed');
    }
  }, [template.id]);

  // Subtle Web Audio tactile wax-crack + flap sound
  const playWaxCrackSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [196.0, 293.66, 392.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx === 0 ? 'triangle' : 'sine';
        const start = ctx.currentTime + idx * 0.1;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.05, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.8);
      });
    } catch {
      // Ignore audio context autoplay restrictions
    }
  };

  // Subtle tactile 600gsm cotton card slide / flip sound
  const playCardSlideOrFlipSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [329.63, 440.0, 587.33];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.04, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch {
      // Ignore audio context autoplay restrictions
    }
  };

  // Web Audio gentle harp/chime chord so audio works reliably without external MP3 dependencies
  const toggleAmbientChime = () => {
    const nextState = !isMusicPlaying;
    setIsMusicPlaying(nextState);
    if (nextState && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const notes = [261.63, 329.63, 392.0, 523.25];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
            gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.14);
            gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.14 + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.14 + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.14);
            osc.stop(ctx.currentTime + idx * 0.14 + 1.9);
          });
        }
      } catch {
        // Ignore audio context restriction if any
      }
    }
  };

  /**
   * STEP 1 -> STEP 2 (TOUCH 1):
   * Cracks the wax seal / unties the silk ribbon (`cracking`) and rotates the 3D top flap open (`flap-opening`).
   * Stops at `flap-opening` so the top of the card peeks out of the envelope pocket,
   * waiting for the user's second touch or upward drag to pull the card out!
   */
  const triggerEnvelopeOpeningAudio = () => {
    setAudioPlayCount((prev) => prev + 1);
    if (envelopeAudioRef.current) {
      try {
        envelopeAudioRef.current.currentTime = 0;
        const playPromise = envelopeAudioRef.current.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch {
        // Ignore browser autoplay restrictions if any
      }
    }
    playWaxCrackSound();
  };

  const handleOpenFlapStep = () => {
    if (phase !== 'sealed') return;
    clearChoreographyTimers();
    setCardFace('front');
    setIsFlipping(false);
    triggerEnvelopeOpeningAudio();
    setPhase('cracking');

    const tFlap = window.setTimeout(() => {
      setPhase('flap-opening');
    }, timings.flapOpenDelayMs);

    timersRef.current.push(tFlap);
  };

  /**
   * STEP 2 -> STEP 3 (TOUCH 2 or DRAG UPWARD):
   * Pulls the peeking invitation card out of the open envelope pocket (`card-rising`)
   * with `easeOut`, sunlit paper-dust particles (`PaperDustEmitter`), and subtle micro-bounce settle into `opened`.
   */
  const handleExtractCardStep = () => {
    if (phase !== 'flap-opening') return;
    clearChoreographyTimers();
    setCardFace('front');
    setIsFlipping(false);
    playCardSlideOrFlipSound();
    setDustBurstKey((prev) => prev + 1);
    setPhase('card-rising');

    const tOpened = window.setTimeout(() => {
      setPhase('opened');
    }, timings.cardRiseDurationMs);

    timersRef.current.push(tOpened);
  };

  /**
   * STEP 3 <-> STEP 4 (TOUCH 3):
   * Rotates the opened 600gsm card 180 degrees in 3D space (`rotateY`)
   * so the guest can read the back of the card (ceremony schedule, dress code, host note)
   * or flip back to the front cover.
   */
  const handleFlipCard = (targetFace?: CardFaceSide) => {
    if (phase !== 'opened') return;
    const nextFace: CardFaceSide =
      targetFace ?? (cardFace === 'front' ? 'back' : 'front');
    if (nextFace === cardFace && targetFace !== undefined) return;

    playCardSlideOrFlipSound();
    setDustBurstKey((prev) => prev + 1);
    setIsFlipping(true);
    setCardFace(nextFace);

    const tFlipDone = window.setTimeout(() => {
      setIsFlipping(false);
    }, 680);
    timersRef.current.push(tFlipDone);
  };

  const handleCloseToSealed = () => {
    clearChoreographyTimers();
    setCardFace('front');
    setIsFlipping(false);
    setPhase('sealed');
  };

  const handleCopyAddress = () => {
    const fullAddress = `${template.venueFa} — ${template.addressFa}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullAddress).catch(() => {});
    }
    setAddressCopied(true);
    window.setTimeout(() => setAddressCopied(false), 2200);
  };

  const handleDownloadCalendarIcs = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:ضیافت ${template.hostNamesFa}`,
      `DESCRIPTION:${template.invitationProseFa}`,
      `LOCATION:${template.venueFa} - ${template.addressFa}`,
      'DTSTART:20260514T160000Z',
      'DTEND:20260514T203000Z',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    try {
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.slug}-invitation.ics`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Ignore blob download restrictions if any
    }
    setCalendarSaved(true);
    window.setTimeout(() => setCalendarSaved(false), 2400);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setFormError('لطفاً نام و نام خانوادگی مهمان را وارد فرمایید.');
      return;
    }
    setFormError('');
    onAddRsvp({
      guestName: guestName.trim(),
      attending,
      guestCount,
      dietaryPreference,
      message: message.trim(),
    });
    setRsvpSubmitted(true);
    setGuestName('');
    setMessage('');
  };

  const shapeClass =
    template.cardShape === 'arch'
      ? 'shape-arch'
      : template.cardShape === 'chamfered'
      ? 'shape-chamfered'
      : template.cardShape === 'scalloped'
      ? 'shape-scalloped'
      : template.cardShape === 'imperial-booklet'
      ? 'shape-imperial-booklet'
      : 'shape-classic-frame';

  const foilTextClass =
    template.foilFinish === 'rose-gold'
      ? 'foil-rosegold-text'
      : template.foilFinish === 'silver'
      ? 'foil-silver-text'
      : template.palette.isDarkCard
      ? 'printed-foil-stamp-dark'
      : 'printed-foil-stamp-light';

  const inkTextClass = template.palette.isDarkCard
    ? 'printed-letterpress-light'
    : 'printed-letterpress-dark';

  const etchedRuleClass = template.palette.isDarkCard
    ? 'printed-etched-rule-dark'
    : 'printed-etched-rule-light';

  const cottonDebossClass = template.palette.isDarkCard
    ? 'cotton-card-deboss-dark'
    : 'cotton-card-deboss-light';

  const frontDebossStyle = getCardSurfaceDebossStyle(
    template.palette,
    phase,
    'front',
    paperTextureSlider
  );
  const backDebossStyle = getCardSurfaceDebossStyle(
    template.palette,
    phase,
    'back',
    paperTextureSlider
  );
  const paperTextureBlend = getPaperTextureBlendStyle(
    paperTextureSlider,
    template.palette.isDarkCard,
    phase === 'opened' || phase === 'card-rising'
  );
  const studioLighting = getStudioLightingStyle(
    lightAzimuth,
    lightElevation,
    lightIntensity
  );
  const envelopeLayerSeparation = getEnvelopeLayerSeparationStyle(phase);

  const phaseBadgeFa: Record<EnvelopeStagePhase, string> = {
    sealed: 'گام ۱: پاکت بسته · لمس اول برای باز شدن درب پاکت',
    cracking: 'در حال نرم شدن مهر مومی و باز شدن درب پاکت...',
    'flap-opening': 'گام ۲: درب پاکت باز شد · لمس یا کشیدن کارت به بالا برای خروج',
    'card-rising': 'خروج کارت کتان همراه با ذرات کاغذ...',
    opened:
      cardFace === 'front'
        ? 'گام ۳: روی کارت دعوت · لمس کارت برای چرخش به پشت کارت'
        : 'گام ۴: پشت کارت دعوت (برنامه زمان‌بندی و راهنمای مهمان)',
  };

  const isFlapOpen =
    phase === 'flap-opening' || phase === 'card-rising' || phase === 'opened';

  return (
    <div
      data-testid="luxury-card-stage-root"
      data-paper-texture-value={paperTextureBlend.sliderValue}
      data-light-azimuth={studioLighting.azimuthDeg}
      data-light-elevation={studioLighting.elevationDeg}
      data-light-intensity={studioLighting.intensityPct}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      style={
        {
          ...paperTextureBlend.cssVariables,
          ...studioLighting.cssVariables,
        } as React.CSSProperties
      }
    >
      {/* Subtle Paper-Tear & Envelope-Opening HTML5 Audio Element */}
      <audio
        ref={envelopeAudioRef}
        data-testid="envelope-opening-audio"
        data-play-count={audioPlayCount}
        src={envelopeOpeningWavUri}
        preload="auto"
        className="hidden"
        aria-hidden="true"
      />
      {/* Left / Main Stage: 5 Envelope Styles + 4-Step Touch/Drag Ceremony + Floating Stage HUD */}
      <div className="lg:col-span-7 flex flex-col items-center">
        {/* Top Stage Header & Current Step Status */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3 px-4 py-3 rounded-xl bg-white/95 border border-[#E5DEC9] shadow-xs">
          <div className="flex items-center gap-2.5 text-xs text-[#57534E]">
            <span className="font-semibold text-[#1C1917]">{template.titleFa}</span>
            <span aria-hidden="true">·</span>
            <span
              data-testid="envelope-phase-indicator"
              className="text-[#9A7432] font-medium"
            >
              {phaseBadgeFa[phase]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Step-Aware Primary Action Button */}
            {phase === 'sealed' ? (
              <button
                type="button"
                data-testid="replay-open-animation-btn"
                onClick={handleOpenFlapStep}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1C1917] text-[#F7F4EF] hover:bg-[#332E2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MailOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تاچ ۱: باز کردن مهر و درب پاکت</span>
              </button>
            ) : phase === 'flap-opening' ? (
              <button
                type="button"
                data-testid="extract-card-btn"
                onClick={handleExtractCardStep}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1C1917] text-[#F7F4EF] hover:bg-[#332E2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>تاچ ۲: بیرون کشیدن دعوت‌نامه از پاکت</span>
              </button>
            ) : phase === 'opened' ? (
              <button
                type="button"
                data-testid="flip-card-3d-btn"
                onClick={() => handleFlipCard()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-[#1C1917] text-[#F7F4EF] hover:bg-[#332E2A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {cardFace === 'front'
                    ? 'تاچ ۳: چرخش کارت به پشت دعوت‌نامه'
                    : 'چرخش به روی کارت دعوت'}
                </span>
              </button>
            ) : null}

            {/* Close to Sealed State Button */}
            {phase !== 'sealed' && (
              <button
                type="button"
                data-testid="close-envelope-btn"
                onClick={handleCloseToSealed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D6CEBF] bg-white text-[#1C1917] hover:bg-[#F5F0E6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>بستن پاکت (شروع مجدد)</span>
              </button>
            )}
          </div>
        </div>

        {/* 5 Distinct Envelope Style Switcher Bar */}
        <div
          data-testid="envelope-style-switcher"
          className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9]"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#44403C]">
              مدل پاکت و مهر:
            </span>
            <span className="hidden sm:inline text-[11px] text-[#78716C]">
              ({activeEnvelopeMeta.descriptionFa})
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {ENVELOPE_STYLE_VARIANTS.map((variant) => (
              <button
                key={variant.id}
                type="button"
                data-testid={`envelope-style-${variant.id}`}
                onClick={() => {
                  setEnvelopeStyle(variant.id);
                  if (phase === 'opened') {
                    handleCloseToSealed();
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  envelopeStyle === variant.id
                    ? 'bg-[#1C1917] text-[#FFF8EA] border border-[#D4AF37]/60 shadow-2xs'
                    : 'bg-white text-[#57534E] border border-[#E2D9C8] hover:bg-[#F3ECE0]'
                }`}
              >
                {variant.sealLabelFa}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Step Interactive Ceremony Stepper Bar */}
        <div
          data-testid="interactive-step-bar"
          className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-4 p-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9]"
        >
          <button
            type="button"
            data-testid="step-btn-1"
            onClick={handleCloseToSealed}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              stepInfo.stepNumber === 1
                ? 'bg-[#1C1917] text-[#FFF8EA] shadow-xs'
                : 'text-[#57534E] hover:bg-white/80'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#D4AF37]/25 text-[#D4AF37]">
              ۱
            </span>
            <span className="truncate">۱. پاکت بسته</span>
          </button>

          <button
            type="button"
            data-testid="step-btn-2"
            onClick={() => {
              if (phase === 'sealed') {
                handleOpenFlapStep();
              } else if (phase === 'opened') {
                clearChoreographyTimers();
                setCardFace('front');
                setPhase('flap-opening');
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              stepInfo.stepNumber === 2
                ? 'bg-[#1C1917] text-[#FFF8EA] shadow-xs'
                : 'text-[#57534E] hover:bg-white/80'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#D4AF37]/25 text-[#D4AF37]">
              ۲
            </span>
            <span className="truncate">۲. تاچ ۱: باز شدن پاکت</span>
          </button>

          <button
            type="button"
            data-testid="step-btn-3"
            onClick={() => {
              if (phase === 'sealed') {
                handleOpenFlapStep();
              } else if (phase === 'flap-opening') {
                handleExtractCardStep();
              } else if (phase === 'opened' && cardFace === 'back') {
                handleFlipCard('front');
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              stepInfo.stepNumber === 3
                ? 'bg-[#1C1917] text-[#FFF8EA] shadow-xs'
                : 'text-[#57534E] hover:bg-white/80'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#D4AF37]/25 text-[#D4AF37]">
              ۳
            </span>
            <span className="truncate">۳. تاچ/کشیدن: خروج کارت</span>
          </button>

          <button
            type="button"
            data-testid="step-btn-4"
            onClick={() => {
              if (phase === 'opened') {
                handleFlipCard('back');
              }
            }}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              stepInfo.stepNumber === 4
                ? 'bg-[#1C1917] text-[#FFF8EA] shadow-xs'
                : 'text-[#57534E] hover:bg-white/80'
            }`}
          >
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#D4AF37]/25 text-[#D4AF37]">
              ۴
            </span>
            <span className="truncate">۴. تاچ کارت: چرخش پشت</span>
          </button>
        </div>

        {/* Unified 3D Interactive Stage with Architectural Travertine & Linen Surface (Zero Double-Envelope Clutter) */}
        <div
          id="studio-card-stage"
          data-testid="card-3d-stage"
          data-phase={phase}
          data-card-face={cardFace}
          data-envelope-style={envelopeStyle}
          className="relative w-full min-h-[760px] rounded-2xl border border-[#D8CFC0] p-5 sm:p-7 flex flex-col items-center justify-between overflow-hidden travertine-stage-surface"
        >

          {/* Editorial Flat-Lay Prop: Fresh Olive Branch on Deckled Cotton Travertine */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 sm:w-60 h-48 sm:h-60 opacity-80 mix-blend-multiply z-0 select-none">
            <img
              src="/src/assets/images/olive_branch_prop_1794304548402.jpg"
              alt="Botanical Olive Prop"
              className="w-full h-full object-contain filter drop-shadow(12px 18px 24px rgba(28,20,12,0.35)) rounded-full"
              loading="lazy"
            />
          </div>

          {/* =====================================================================
              TOP STAGE HUD BAR (Non-overlapping flex row + Guidance Pill)
              - Left: دریافت آدرس و لوکیشن + افزودن به تقویم
              - Right: دکمه میوت و با صدا کردن آهنگ دعوت‌نامه
              ===================================================================== */}
          <div className="relative z-50 w-full flex flex-col gap-2.5">
            <div
              dir="ltr"
              className="w-full flex flex-wrap items-center justify-between gap-2"
            >
              {/* Left Side of Stage: Get Address & Save to Calendar */}
              <div dir="rtl" className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="stage-location-btn"
                  onClick={() => setShowLocationDrawer((prev) => !prev)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C1917]/92 backdrop-blur-md text-[#FFF8EA] border border-[#D4AF37]/60 text-xs font-semibold shadow-md hover:bg-[#1C1917] transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>دریافت آدرس و لوکیشن</span>
                </button>

                <button
                  type="button"
                  data-testid="stage-calendar-btn"
                  onClick={handleDownloadCalendarIcs}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/92 backdrop-blur-md text-[#1C1917] border border-[#D6CEBF] text-xs font-semibold shadow-sm hover:bg-white transition-all cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#9A7432] shrink-0" />
                  <span>
                    {calendarSaved ? 'در تقویم ذخیره شد ✓' : 'افزودن به تقویم'}
                  </span>
                </button>
              </div>

              {/* Right Side of Stage: Music Mute / Unmute Button */}
              <div dir="rtl">
                <button
                  type="button"
                  data-testid="stage-music-toggle-btn"
                  onClick={toggleAmbientChime}
                  aria-label={isMusicPlaying ? 'قطع صدای موسیقی' : 'پخش صدای موسیقی'}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-md border text-xs font-semibold shadow-md transition-all cursor-pointer ${
                    isMusicPlaying
                      ? 'bg-[#1C1917] text-[#D4AF37] border-[#D4AF37]'
                      : 'bg-white/92 text-[#1C1917] border-[#D6CEBF] hover:bg-white'
                  }`}
                >
                  {isMusicPlaying ? (
                    <Volume2 className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-[#78716C]" />
                  )}
                  <span>{isMusicPlaying ? 'با صدا (Mute)' : 'پخش آهنگ'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Next-Touch Guidance Pill Centered Below HUD Row */}
            <div className="w-full flex items-center justify-center">
              <div
                data-testid="stage-touch-hint"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917]/90 backdrop-blur-xs text-[#FFF8EA] text-xs font-medium border border-[#D4AF37]/50 shadow-sm"
              >
                <Hand className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{stepInfo.nextTouchHintFa}</span>
              </div>
            </div>
          </div>

          {/* =====================================================================
              INTERACTIVE LOCATION & NAVIGATION MODAL DRAWER ON STAGE (سمت چپ)
              ===================================================================== */}
          <AnimatePresence>
            {showLocationDrawer && (
              <motion.div
                data-testid="stage-location-drawer"
                initial={{ opacity: 0, x: -24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -24, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute left-5 top-20 z-50 w-72 sm:w-80 rounded-2xl bg-[#1C1917]/96 backdrop-blur-md border border-[#D4AF37]/65 p-4 text-[#FFF8EA] shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="text-xs font-bold">آدرس و مسیریابی تالار</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLocationDrawer(false)}
                    className="p-1 rounded-lg text-[#E7DEC8] hover:bg-white/10 cursor-pointer"
                    aria-label="بستن پنجره آدرس"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="my-3 space-y-1.5 text-xs">
                  <p className="font-bold text-[#F5E6B3]">{template.venueFa}</p>
                  <p className="text-[#E7DEC8] leading-relaxed">
                    {template.addressFa}
                  </p>
                  <p className="text-[11px] text-[#C8BFA8] tabular-nums">
                    زمان پذیرش: {template.eventDateFa} · ساعت {template.eventTime}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      template.venueFa + ' ' + template.cityFa
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#D4AF37] text-[#1C1917] text-[11px] font-bold hover:bg-[#E5C352] transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>گوگل مپ</span>
                  </a>

                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(
                      template.venueFa + ' ' + template.cityFa
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/12 text-[#FFF8EA] border border-white/20 text-[11px] font-semibold hover:bg-white/20 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>مسیریاب Waze</span>
                  </a>
                </div>

                <button
                  type="button"
                  data-testid="copy-address-btn"
                  onClick={handleCopyAddress}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 border border-[#D4AF37]/40 text-[11px] font-medium text-[#FFF8EA] hover:bg-white/15 transition-colors cursor-pointer"
                >
                  {addressCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">آدرس کامل کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>کپی متنی آدرس برای ارسال</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D SCENE ROOT (1500px perspective for genuine translateZ depth emergence) */}
          <div
            className="relative w-full max-w-[520px] min-h-[580px] flex flex-col items-center justify-center my-2 perspective-stage"
            style={{ perspective: '1500px' }}
          >
            {/* =====================================================================
                1. PHOTOREALISTIC 3D LINEN ENVELOPE BACK & BOTANICAL / TAZHIB SILK LINER (z-10)
                - In Step 1 (`sealed`): Touching anywhere opens the seal & flap (`handleOpenFlapStep`).
                - In Step 2 (`flap-opening`): Touching or dragging upward pulls the card out (`handleExtractCardStep`).
                ===================================================================== */}
            <div
              data-testid="envelope-3d-assembly"
              onClick={() => {
                if (phase === 'sealed') {
                  handleOpenFlapStep();
                } else if (phase === 'flap-opening') {
                  handleExtractCardStep();
                }
              }}
              className={`absolute inset-x-0 mx-auto w-full max-w-[500px] h-[340px] rounded-[6px] select-none envelope-layer-smooth-transition ${
                phase === 'sealed' || phase === 'flap-opening'
                  ? 'cursor-pointer'
                  : ''
              }`}
              style={{
                zIndex: 10,
                pointerEvents:
                  phase === 'sealed' || phase === 'flap-opening' ? 'auto' : 'none',
                transform: `translate3d(0px, ${envelopeLayerSeparation.bodyTranslateYPx}px, 0px) scale(${envelopeLayerSeparation.bodyScale})`,
                opacity: envelopeLayerSeparation.bodyOpacity,
              }}
            >
              {/* Hidden Global SVG Clip Definitions for Authentic Royal Euro-Flap 4-Flap Cotton Envelope */}
              <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
                <defs>
                  {/* Left Wing Flap Contour (Sculpted curved shoulder tucking under bottom pocket) */}
                  <clipPath id="sculptedLeftWingClip" clipPathUnits="objectBoundingBox">
                    <path d="M 0,0 L 0.54,0.44 Q 0.58,0.50 0.54,0.57 L 0.34,1 L 0,1 Z" />
                  </clipPath>
                  {/* Right Wing Flap Contour (Sculpted curved shoulder tucking under bottom pocket) */}
                  <clipPath id="sculptedRightWingClip" clipPathUnits="objectBoundingBox">
                    <path d="M 1,0 L 0.46,0.44 Q 0.42,0.50 0.46,0.57 L 0.66,1 L 1,1 Z" />
                  </clipPath>
                  {/* Top Deep Euro Flap Contour (Gently tapered sides meeting at a broad sculpted rounded tongue) */}
                  <clipPath id="sculptedEuroFlapClip" clipPathUnits="objectBoundingBox">
                    <path d="M 0,0 L 1,0 L 0.575,0.885 Q 0.5,0.995 0.425,0.885 Z" />
                  </clipPath>
                  {/* Inset Die-Cut Liner inside the Top Euro Flap (leaves a real 600gsm cotton margin around the edge) */}
                  <clipPath id="sculptedEuroLinerClip" clipPathUnits="objectBoundingBox">
                    <path d="M 0.032,0.025 L 0.968,0.025 L 0.56,0.855 Q 0.5,0.955 0.44,0.855 Z" />
                  </clipPath>
                  {/* Bottom High-Waist Trapezoid Pocket Flap with Wide Flat Plateau Throat */}
                  <clipPath id="sculptedBottomFlapClip" clipPathUnits="objectBoundingBox">
                    <path d="M 0,1 L 0.24,0.50 Q 0.28,0.45 0.35,0.45 L 0.65,0.45 Q 0.72,0.45 0.76,0.50 L 1,1 Z" />
                  </clipPath>
                </defs>
              </svg>

              {/* 1A. ENVELOPE BACK CHASSIS & DIE-CUT SILK / BOTANICAL INNER LINER */}
              <div
                data-testid="envelope-back-chassis"
                className="w-full h-full rounded-[6px] overflow-hidden paper-grain-surface handmade-cotton-flap photorealistic-envelope-chassis relative"
                style={{
                  backgroundColor: template.palette.envelopeBg,
                  backgroundImage: `linear-gradient(180deg, rgba(255,252,245,0.08) 0%, rgba(10,8,6,0.52) 100%)`,
                }}
              >
                {/* Inset Die-Cut Botanical / Tazhib Liner visible inside the throat with a real 10px cotton paper border */}
                <div
                  className="absolute inset-x-[10px] top-[8px] bottom-[20px] rounded-[4px] overflow-hidden pointer-events-none"
                  style={{
                    backgroundColor: template.palette.cardBg,
                    backgroundImage: `url("${template.palette.artworkUrl}")`,
                    backgroundSize: template.palette.artworkBgSize,
                    backgroundPosition: template.palette.artworkBgPos,
                    boxShadow: 'inset 0 4px 14px rgba(8,6,4,0.32)',
                    border: `1px solid ${template.palette.foilHex}44`,
                  }}
                />
                {/* Deep Pocket Interior Shadow where the 600gsm card rests */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[76%] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(8,6,4,0.08) 0%, rgba(8,6,4,0.48) 42%, rgba(8,6,4,0.88) 100%)',
                  }}
                />
              </div>
            </div>

            {/* =====================================================================
                2. PHOTOREALISTIC 600GSM TWO-SIDED 3D INVITATION CARD (z-20)
                - Supports interactive left/right 3D rotation & swipe-to-flip (`چپ و راست کردن نامه`)
                - Calibrated per-template `safePadding` so zero text ever overflows the frame
                ===================================================================== */}
            <motion.div
              data-testid="luxury-invitation-card"
              data-translate-z={timings.stageTranslateZ[phase]}
              data-rotation-y={
                computeHorizontalCardRotation(liveDragDeltaX, cardFace).rotateYDeg +
                hoverTiltY
              }
              onPointerDown={(e) => {
                if (phase === 'flap-opening') {
                  dragStartYRef.current = e.clientY;
                } else if (phase === 'opened') {
                  dragStartXRef.current = e.clientX;
                  didHorizontalSwipeRef.current = false;
                }
              }}
              onPointerMove={(e) => {
                if (phase !== 'opened') return;
                const rect = e.currentTarget.getBoundingClientRect();
                const relX = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
                const relY = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;

                if (dragStartXRef.current !== null) {
                  const deltaX = e.clientX - dragStartXRef.current;
                  setLiveDragDeltaX(deltaX);
                  if (Math.abs(deltaX) > 12) {
                    didHorizontalSwipeRef.current = true;
                  }
                } else {
                  setHoverTiltY(Number((relX * 18).toFixed(2)));
                  setHoverTiltX(Number((-relY * 8).toFixed(2)));
                }
              }}
              onPointerLeave={() => {
                setHoverTiltY(0);
                setHoverTiltX(0);
                if (dragStartXRef.current !== null) {
                  dragStartXRef.current = null;
                  setLiveDragDeltaX(0);
                }
              }}
              onPointerUp={(e) => {
                if (phase === 'flap-opening' && dragStartYRef.current !== null) {
                  const deltaY = dragStartYRef.current - e.clientY;
                  dragStartYRef.current = null;
                  if (deltaY > 15) {
                    handleExtractCardStep();
                    return;
                  }
                }
                if (phase === 'opened' && dragStartXRef.current !== null) {
                  const deltaX = e.clientX - dragStartXRef.current;
                  dragStartXRef.current = null;
                  setLiveDragDeltaX(0);
                  const { shouldFlip } = computeHorizontalCardRotation(
                    deltaX,
                    cardFace
                  );
                  if (shouldFlip) {
                    didHorizontalSwipeRef.current = true;
                    handleFlipCard();
                    return;
                  }
                }
              }}
              onClick={() => {
                if (phase === 'flap-opening') {
                  handleExtractCardStep();
                } else if (phase === 'opened') {
                  if (didHorizontalSwipeRef.current) {
                    didHorizontalSwipeRef.current = false;
                    return;
                  }
                  handleFlipCard();
                }
              }}
              role="button"
              tabIndex={phase === 'opened' || phase === 'flap-opening' ? 0 : -1}
              aria-label={
                phase === 'flap-opening'
                  ? 'کارت داخل پاکت بازشده — برای بیرون کشیدن کارت کلیک کنید یا به بالا بکشید'
                  : cardFace === 'front'
                  ? 'روی کارت دعوت — برای چرخش سه‌بعدی به چپ یا راست بکشید یا کلیک کنید'
                  : 'پشت کارت دعوت — برای بازگشت به روی کارت به چپ یا راست بکشید یا کلیک کنید'
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (phase === 'flap-opening') {
                    handleExtractCardStep();
                  } else if (phase === 'opened') {
                    handleFlipCard();
                  }
                } else if (
                  phase === 'opened' &&
                  (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                ) {
                  e.preventDefault();
                  handleFlipCard();
                }
              }}
              className={`relative w-full max-w-[408px] min-h-[568px] select-none touch-pan-y ${
                phase === 'opened'
                  ? 'cursor-grab active:cursor-grabbing'
                  : phase === 'flap-opening'
                  ? 'cursor-pointer'
                  : ''
              }`}
              style={{
                zIndex: 20,
                perspective: '1500px',
                pointerEvents:
                  phase === 'opened' || phase === 'flap-opening' ? 'auto' : 'none',
                clipPath:
                  phase === 'flap-opening'
                    ? 'inset(-40px -40px 36% -40px)'
                    : undefined,
              }}
              initial={{
                y: 54,
                z: timings.stageTranslateZ.sealed,
                scale: 0.72,
                rotateX: 14,
                opacity: 0,
              }}
              animate={
                phase === 'sealed'
                  ? {
                      y: 48,
                      z: timings.stageTranslateZ.sealed,
                      scale: 0.72,
                      rotateX: 12,
                      opacity: 0,
                    }
                  : phase === 'cracking'
                  ? {
                      y: 42,
                      z: timings.stageTranslateZ.cracking,
                      scale: 0.74,
                      rotateX: 10,
                      opacity: 0,
                    }
                  : phase === 'flap-opening'
                  ? {
                      y: 34,
                      z: timings.stageTranslateZ['flap-opening'],
                      scale: 0.8,
                      rotateX: 4,
                      rotateZ: 0,
                      opacity: 1,
                    }
                  : phase === 'card-rising'
                  ? {
                      y: timings.cardBounceKeyframesY,
                      z: timings.cardBounceKeyframesZ,
                      scale: [0.8, 0.99, 1.012, 0.997, 1.003, 1],
                      rotateX: [4, -3.5, 1.2, -0.5, 0.2, 0],
                      rotateZ: timings.cardBounceKeyframesRotateZ,
                      opacity: 1,
                    }
                  : {
                      y: 0,
                      z: timings.stageTranslateZ.opened,
                      scale: 1,
                      rotateX: hoverTiltX,
                      rotateZ: 0,
                      opacity: 1,
                    }
              }
              whileHover={
                phase === 'flap-opening'
                  ? {
                      y: 16,
                      z: -18,
                      scale: 0.82,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    }
                  : phase === 'opened'
                  ? {
                      y: -4,
                      z: timings.stageTranslateZ.opened + 10,
                      transition: { duration: 0.25, ease: 'easeOut' },
                    }
                  : undefined
              }
              transition={
                phase === 'card-rising'
                  ? {
                      duration: timings.cardRiseDurationMs / 1000,
                      ease: timings.cardRiseEase,
                      times: timings.cardBounceTimes,
                    }
                  : {
                      duration: 0.36,
                      ease: 'easeOut',
                    }
              }
            >
              {/* 3D 180-DEGREE ROTATING FLIPPER CONTAINER (Interactive Left/Right Drag & Hover Tilt) */}
              <motion.div
                data-testid="card-3d-flipper"
                data-card-face={cardFace}
                className="relative w-full min-h-[568px]"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                initial={false}
                animate={{
                  rotateY:
                    computeHorizontalCardRotation(liveDragDeltaX, cardFace)
                      .rotateYDeg + hoverTiltY,
                  scale: isFlipping ? [1, 1.04, 1] : 1,
                  y: isFlipping ? [0, -10, 0] : 0,
                }}
                transition={{
                  duration: liveDragDeltaX !== 0 ? 0.08 : 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* ===============================================================
                    2A. FRONT FACE OF THE CARD (`cardFace === 'front'`, rotateY: 0deg)
                    - Single Unified 600gsm Cotton Surface with per-template `safePadding`
                    - Natural cotton ink absorption (no double-shadow halo)
                    =============================================================== */}
                <article
                  data-testid="card-face-front"
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-between text-center overflow-hidden ${shapeClass} ${cottonDebossClass}`}
                  style={{
                    backgroundColor: template.palette.cardBg,
                    backgroundImage: `url("${template.palette.artworkUrl}")`,
                    backgroundSize: template.palette.artworkBgSize,
                    backgroundPosition: template.palette.artworkBgPos,
                    backgroundRepeat: 'no-repeat',
                    padding: template.palette.safePadding,
                    color: template.palette.textPrimary,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: frontDebossStyle.transform,
                    borderStyle: frontDebossStyle.borderStyle,
                    borderWidth: frontDebossStyle.borderWidth,
                    borderColor: frontDebossStyle.borderColor,
                    boxShadow: frontDebossStyle.boxShadow,
                  }}
                >
                  {/* Top Debossed Hot-Foil Monogram & Poetic Kicker Directly on Cotton Surface */}
                  <header className="w-full flex flex-col items-center">
                    <span
                      className={`font-display-luxury text-[11px] sm:text-xs font-bold tracking-[0.22em] ${foilTextClass}`}
                      style={{
                        textShadow: frontDebossStyle.foilTextShadow,
                      }}
                    >
                      ✦ {template.waxSealMonogram} ✦
                    </span>

                    <p
                      className={`mt-1 text-[10px] sm:text-[11px] tracking-normal font-semibold max-w-[195px] leading-snug ${inkTextClass}`}
                      style={{
                        color: template.palette.textMuted,
                        textShadow: frontDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      {language === 'fa' ? template.kickerFa : template.kickerEn}
                    </p>
                  </header>

                  {/* Centerpiece 3D Hot-Foil & Sunken Letterpress Host Names + Prose Directly on Surface */}
                  <div className="w-full my-0.5 px-0.5 flex flex-col items-center">
                    <span
                      className={`text-[9px] tracking-[0.1em] uppercase mb-0.5 font-display-luxury font-bold ${foilTextClass}`}
                      style={{ textShadow: frontDebossStyle.foilTextShadow }}
                    >
                      {language === 'fa'
                        ? template.collectionNameFa
                        : template.collectionNameEn}
                    </span>

                    <h2
                      className={`font-display-luxury ${hostHeadingSizeClass} font-bold max-w-[205px] break-words leading-tight ${foilTextClass}`}
                      style={{
                        textShadow: frontDebossStyle.foilTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      {displayHostNames}
                    </h2>

                    {/* 1px Debossed Groove Hairline Pressed Into Cotton Paper via box-shadow */}
                    <span
                      aria-hidden="true"
                      className={`my-1.5 block w-20 h-[1px] opacity-75 ${etchedRuleClass}`}
                      style={{
                        backgroundColor: template.palette.foilHex,
                        boxShadow: frontDebossStyle.debossedGrooveBoxShadow,
                      }}
                    />

                    <p
                      className={`text-[10px] sm:text-[11px] font-medium leading-relaxed max-w-[198px] break-words ${inkTextClass}`}
                      style={{
                        color: template.palette.textPrimary,
                        textShadow: frontDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      {language === 'fa'
                        ? template.invitationProseFa
                        : template.invitationProseEn}
                    </p>
                  </div>

                  {/* Sunken Letterpress Event Date, Time & Venue Directly Printed Into Cotton Paper */}
                  <footer className="w-full flex flex-col items-center space-y-0.5">
                    <span
                      aria-hidden="true"
                      className={`mb-1 block w-28 h-[1px] opacity-60 ${etchedRuleClass}`}
                      style={{
                        backgroundColor: template.palette.foilHex,
                        boxShadow: frontDebossStyle.debossedGrooveBoxShadow,
                      }}
                    />

                    <p className="w-full max-w-[198px] flex flex-wrap items-center justify-center gap-1 text-[10px] font-bold">
                      <span
                        className={inkTextClass}
                        style={{ textShadow: frontDebossStyle.inkTextShadow }}
                      >
                        {language === 'fa' ? template.eventDateFa : template.eventDateEn}
                      </span>
                      <span
                        className={foilTextClass}
                        style={{ textShadow: frontDebossStyle.foilTextShadow }}
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                      <span
                        className={`tabular-nums ${foilTextClass}`}
                        style={{ textShadow: frontDebossStyle.foilTextShadow }}
                      >
                        ساعت {template.eventTime}
                      </span>
                    </p>

                    <p
                      className={`text-[11px] font-bold max-w-[195px] leading-snug ${inkTextClass}`}
                      style={{
                        color: template.palette.textPrimary,
                        textShadow: frontDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      {language === 'fa' ? template.venueFa : template.venueEn}
                    </p>
                    <p
                      className={`text-[9.5px] font-medium max-w-[190px] leading-snug ${inkTextClass}`}
                      style={{
                        color: template.palette.textMuted,
                        textShadow: frontDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      {template.addressFa}
                    </p>
                  </footer>
                </article>

                {/* ===============================================================
                    2B. BACK FACE OF THE CARD (`cardFace === 'back'`, rotateY: 180deg)
                    - Twin-matched to the Front Face with identical `safePadding`
                    =============================================================== */}
                <article
                  data-testid="card-face-back"
                  className={`absolute inset-0 w-full h-full flex flex-col items-center justify-between text-center overflow-hidden ${shapeClass} ${cottonDebossClass}`}
                  style={{
                    backgroundColor: template.palette.cardBg,
                    backgroundImage: `url("${template.palette.artworkUrl}")`,
                    backgroundSize: template.palette.artworkBgSize,
                    backgroundPosition: template.palette.artworkBgPos,
                    backgroundRepeat: 'no-repeat',
                    padding: template.palette.safePadding,
                    color: template.palette.textPrimary,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: backDebossStyle.transform,
                    borderStyle: backDebossStyle.borderStyle,
                    borderWidth: backDebossStyle.borderWidth,
                    borderColor: backDebossStyle.borderColor,
                    boxShadow: backDebossStyle.boxShadow,
                  }}
                >
                  {/* Top Debossed Monogram & Back Header Directly on Cotton Surface */}
                  <header className="w-full flex flex-col items-center">
                    <span
                      className={`font-display-luxury text-[11px] sm:text-xs font-bold tracking-[0.22em] ${foilTextClass}`}
                      style={{
                        textShadow: backDebossStyle.foilTextShadow,
                      }}
                    >
                      ✦ {template.waxSealMonogram} ✦
                    </span>

                    <span
                      className={`mt-1 text-[9px] tracking-[0.08em] uppercase font-display-luxury font-bold ${foilTextClass}`}
                      style={{ textShadow: backDebossStyle.foilTextShadow }}
                    >
                      پشت کارت دعوت · برنامه ضیافت
                    </span>
                    <h3
                      className={`font-display-luxury text-sm sm:text-base font-bold mt-0.5 max-w-[195px] leading-snug ${inkTextClass}`}
                      style={{
                        color: template.palette.textPrimary,
                        textShadow: backDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      برنامه مراسم {template.hostNamesFa}
                    </h3>
                  </header>

                  {/* Sunken Letterpress Ceremony Schedule Directly on Cotton Surface */}
                  <dl className="w-full my-0.5 px-0.5 space-y-1.5 text-[10px]">
                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <dt
                          className={`font-semibold text-right truncate ${inkTextClass}`}
                          style={{ textShadow: backDebossStyle.inkTextShadow }}
                        >
                          پذیرایی خوش‌آمدگویی و موسیقی
                        </dt>
                        <dd
                          className={`tabular-nums font-bold shrink-0 ${foilTextClass}`}
                          style={{ textShadow: backDebossStyle.foilTextShadow }}
                        >
                          ۱۹:۳۰
                        </dd>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`block w-full h-[1px] opacity-50 ${etchedRuleClass}`}
                        style={{
                          backgroundColor: template.palette.foilHex,
                          boxShadow: backDebossStyle.debossedGrooveBoxShadow,
                        }}
                      />
                    </div>

                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <dt
                          className={`font-semibold text-right truncate ${inkTextClass}`}
                          style={{ textShadow: backDebossStyle.inkTextShadow }}
                        >
                          آیین رسمی و ورود میزبانان
                        </dt>
                        <dd
                          className={`tabular-nums font-bold shrink-0 ${foilTextClass}`}
                          style={{ textShadow: backDebossStyle.foilTextShadow }}
                        >
                          ۲۰:۳۰
                        </dd>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`block w-full h-[1px] opacity-50 ${etchedRuleClass}`}
                        style={{
                          backgroundColor: template.palette.foilHex,
                          boxShadow: backDebossStyle.debossedGrooveBoxShadow,
                        }}
                      />
                    </div>

                    <div className="flex flex-col space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <dt
                          className={`font-semibold text-right truncate ${inkTextClass}`}
                          style={{ textShadow: backDebossStyle.inkTextShadow }}
                        >
                          ضیافت شام سلطنتی و برش کیک
                        </dt>
                        <dd
                          className={`tabular-nums font-bold shrink-0 ${foilTextClass}`}
                          style={{ textShadow: backDebossStyle.foilTextShadow }}
                        >
                          ۲۲:۰۰
                        </dd>
                      </div>
                      <span
                        aria-hidden="true"
                        className={`block w-full h-[1px] opacity-50 ${etchedRuleClass}`}
                        style={{
                          backgroundColor: template.palette.foilHex,
                          boxShadow: backDebossStyle.debossedGrooveBoxShadow,
                        }}
                      />
                    </div>
                  </dl>

                  {/* Debossed Dress Code Swatches & Venue Address Directly on Cotton Surface */}
                  <footer className="w-full pt-0.5 flex flex-col items-center space-y-0.5">
                    <div className="w-full flex items-center justify-between gap-1 px-0.5">
                      <span
                        className={`text-[9.5px] font-bold ${foilTextClass}`}
                        style={{ textShadow: backDebossStyle.foilTextShadow }}
                      >
                        پوشش: رسمی (Black Tie)
                      </span>
                      <div
                        className="flex items-center gap-1"
                        title="پالت رنگ پیشنهادی لباس مهمانان"
                      >
                        {dressCodeSwatches.map((sw) => (
                          <span
                            key={sw.labelFa}
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: sw.hex,
                              boxShadow:
                                'inset 0 1px 1.5px rgba(0,0,0,0.42), 0 0.5px 0 rgba(255,255,255,0.75)',
                            }}
                            title={sw.labelFa}
                          />
                        ))}
                      </div>
                    </div>
                    <p
                      className={`text-[9px] font-medium leading-snug max-w-[190px] ${inkTextClass}`}
                      style={{
                        color: template.palette.textMuted,
                        textShadow: backDebossStyle.inkTextShadow,
                        textWrap: 'balance',
                      }}
                    >
                      نشانی: {template.venueFa} — {template.addressFa}
                    </p>
                  </footer>
                </article>
              </motion.div>
            </motion.div>

            {/* =====================================================================
                3. PHOTOREALISTIC 3-FLAP OVERLAPPING ENVELOPE POCKET (z-30)
                - Built from 3 separate overlapping physical cotton rag flaps:
                  1) Left Wing Flap casting right-ward drop shadow
                  2) Right Wing Flap casting left-ward drop shadow
                  3) Bottom Trapezoid Pocket Flap overlapping both wings & casting upward shadow
                ===================================================================== */}
            <div
              data-testid="envelope-front-pocket"
              onClick={() => {
                if (phase === 'sealed') {
                  handleOpenFlapStep();
                }
              }}
              className={`absolute inset-x-0 mx-auto w-full max-w-[500px] h-[340px] rounded-[6px] select-none envelope-layer-smooth-transition ${
                phase === 'sealed' ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              style={{
                zIndex: 30,
                pointerEvents: phase === 'sealed' ? 'auto' : 'none',
                transform: `translate3d(0px, ${envelopeLayerSeparation.bodyTranslateYPx}px, 0px) scale(${envelopeLayerSeparation.bodyScale})`,
                opacity:
                  phase === 'card-rising' || phase === 'opened'
                    ? 0
                    : envelopeLayerSeparation.bodyOpacity,
              }}
            >
              <div className="absolute inset-0 rounded-[6px] overflow-hidden pointer-events-none">
                {/* 3A. LEFT WING FLAP (Sculpted curved shoulder with 3D rolled fold cushion & blind-debossed scoring) */}
                <div
                  className="absolute inset-0 envelope-pocket-wing-transition"
                  style={{
                    transform: envelopeLayerSeparation.leftWingTransform,
                    filter:
                      'drop-shadow(6px 2px 11px rgba(5, 3, 2, 0.48)) drop-shadow(1px 0 0 rgba(255, 250, 240, 0.22))',
                  }}
                >
                  <div
                    className="w-full h-full paper-grain-surface handmade-cotton-flap"
                    style={
                      {
                        '--grain-offset-x': '17px',
                        '--grain-offset-y': '43px',
                        '--weave-angle': '28deg',
                        clipPath: 'url(#sculptedLeftWingClip)',
                        backgroundColor: template.palette.envelopeBg,
                        backgroundImage:
                          'linear-gradient(90deg, rgba(255,252,245,0.22) 0%, rgba(255,252,245,0.06) 4%, transparent 12%), linear-gradient(118deg, rgba(255,252,245,0.15) 0%, rgba(255,252,245,0.03) 46%, rgba(6,4,2,0.36) 100%)',
                      } as React.CSSProperties
                    }
                  >
                    {/* Blind-Debossed Scoring Groove & Bevel along Left Wing Flap */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      aria-hidden="true"
                    >
                      <path
                        d="M 0,0 L 54,44 Q 58,50 54,57 L 34,100"
                        fill="none"
                        stroke="rgba(255, 250, 238, 0.28)"
                        strokeWidth="0.65"
                      />
                      <path
                        d="M 0,2.2 L 51.4,44.8 Q 55.2,50 51.4,56.2 L 31.8,100"
                        fill="none"
                        stroke="rgba(6, 4, 2, 0.45)"
                        strokeWidth="0.45"
                      />
                      <path
                        d="M 0,2.6 L 51.0,45.1 Q 54.8,50 51.0,56.0 L 31.4,100"
                        fill="none"
                        stroke="rgba(255, 248, 228, 0.18)"
                        strokeWidth="0.35"
                      />
                    </svg>
                  </div>
                </div>

                {/* 3B. RIGHT WING FLAP (Sculpted curved shoulder with 3D rolled fold cushion & blind-debossed scoring) */}
                <div
                  className="absolute inset-0 envelope-pocket-wing-transition"
                  style={{
                    transform: envelopeLayerSeparation.rightWingTransform,
                    filter:
                      'drop-shadow(-6px 2px 11px rgba(5, 3, 2, 0.48)) drop-shadow(-1px 0 0 rgba(255, 250, 240, 0.22))',
                  }}
                >
                  <div
                    className="w-full h-full paper-grain-surface handmade-cotton-flap"
                    style={
                      {
                        '--grain-offset-x': '89px',
                        '--grain-offset-y': '19px',
                        '--weave-angle': '-28deg',
                        clipPath: 'url(#sculptedRightWingClip)',
                        backgroundColor: template.palette.envelopeBg,
                        backgroundImage:
                          'linear-gradient(270deg, rgba(255,252,245,0.18) 0%, rgba(255,252,245,0.04) 4%, transparent 12%), linear-gradient(242deg, rgba(255,252,245,0.13) 0%, rgba(255,252,245,0.02) 46%, rgba(6,4,2,0.40) 100%)',
                      } as React.CSSProperties
                    }
                  >
                    {/* Blind-Debossed Scoring Groove & Bevel along Right Wing Flap */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      aria-hidden="true"
                    >
                      <path
                        d="M 100,0 L 46,44 Q 42,50 46,57 L 66,100"
                        fill="none"
                        stroke="rgba(255, 250, 238, 0.28)"
                        strokeWidth="0.65"
                      />
                      <path
                        d="M 100,2.2 L 48.6,44.8 Q 44.8,50 48.6,56.2 L 68.2,100"
                        fill="none"
                        stroke="rgba(6, 4, 2, 0.45)"
                        strokeWidth="0.45"
                      />
                      <path
                        d="M 100,2.6 L 49.0,45.1 Q 45.2,50 49.0,56.0 L 68.6,100"
                        fill="none"
                        stroke="rgba(255, 248, 228, 0.18)"
                        strokeWidth="0.35"
                      />
                    </svg>
                  </div>
                </div>

                {/* 3C. BOTTOM HIGH-WAIST TRAPEZOID POCKET FLAP (Wide plateau throat overlapping both wings) */}
                <div
                  className="absolute inset-0 envelope-pocket-wing-transition"
                  style={{
                    transform: envelopeLayerSeparation.bottomPocketTransform,
                    filter:
                      'drop-shadow(0 -7px 15px rgba(5, 3, 2, 0.54)) drop-shadow(0 -1px 0 rgba(255, 250, 240, 0.24))',
                  }}
                >
                  <div
                    className="w-full h-full flex flex-col items-center justify-end pb-4 px-6 text-center paper-grain-surface handmade-cotton-flap relative"
                    style={
                      {
                        '--grain-offset-x': '134px',
                        '--grain-offset-y': '97px',
                        '--weave-angle': '0deg',
                        clipPath: 'url(#sculptedBottomFlapClip)',
                        backgroundColor: template.palette.envelopeBg,
                        backgroundImage:
                          'linear-gradient(0deg, rgba(6,4,2,0.42) 0%, rgba(255,252,245,0.12) 3.5%, transparent 9%), linear-gradient(to top, rgba(8,6,4,0.34) 0%, rgba(255,252,245,0.05) 68%, rgba(255,252,245,0.20) 100%)',
                      } as React.CSSProperties
                    }
                  >
                    {/* Blind-Debossed Double Scoring Groove & 24K Gold Hairline along the Bottom Pocket Flap Edge */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      aria-hidden="true"
                    >
                      {/* Outer 600gsm Paper Rim Bevel */}
                      <path
                        d="M 0,100 L 24,50 Q 28,45 35,45 L 65,45 Q 72,45 76,50 L 100,100"
                        fill="none"
                        stroke="rgba(255, 250, 238, 0.34)"
                        strokeWidth="0.7"
                      />
                      {/* Sunken Blind-Debossed Crease Valley */}
                      <path
                        d="M 1.8,99 L 25.0,51.4 Q 28.8,46.6 35.2,46.6 L 64.8,46.6 Q 71.2,46.6 75.0,51.4 L 98.2,99"
                        fill="none"
                        stroke="rgba(5, 3, 2, 0.55)"
                        strokeWidth="0.5"
                      />
                      {/* Warm Gold-Foil / Ivory Debossed Ridge */}
                      <path
                        d="M 2.2,99 L 25.3,51.8 Q 29.0,47.0 35.4,47.0 L 64.6,47.0 Q 71.0,47.0 74.7,51.8 L 97.8,99"
                        fill="none"
                        stroke={template.palette.foilHex}
                        strokeOpacity="0.34"
                        strokeWidth="0.4"
                      />
                    </svg>

                    {/* Style-Specific Horizontal Satin Ribbon / Velvet Belt / Golden Twine Across Pocket */}
                    {envelopeStyle === 'silk-ribbon' && (
                      <div
                        className="absolute top-[186px] inset-x-0 h-8 pointer-events-none z-10"
                        style={{
                          background: `linear-gradient(180deg, #8A6421 0%, ${template.palette.foilHex} 22%, #FFF9E6 50%, ${template.palette.foilHex} 78%, #8A6421 100%)`,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.32)',
                        }}
                      />
                    )}

                    {envelopeStyle === 'velvet-clasp' && (
                      <div
                        className="absolute top-[186px] inset-x-0 h-7 pointer-events-none border-y border-[#F5E6B3]/50 z-10"
                        style={{
                          background:
                            'linear-gradient(180deg, #14110F 0%, #2C2523 50%, #14110F 100%)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.42)',
                        }}
                      />
                    )}

                    {envelopeStyle === 'vintage-botanical' && (
                      <div
                        className="absolute top-[188px] inset-x-0 h-1.5 pointer-events-none z-10"
                        style={{
                          background:
                            'repeating-linear-gradient(45deg, #FFF3D1 0px, #D4AF37 3px, #7C581E 6px)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                        }}
                      />
                    )}

                    {/* MINIMALIST 24K GOLD-FOIL CALLIGRAPHY IMPRESSED ON LOWER POCKET FLAP */}
                    <div
                      data-testid="envelope-calligraphy-plaque"
                      className="relative z-10 w-72 sm:w-84 pt-0 pb-1 flex flex-col items-center justify-center text-center"
                    >
                      {/* Delicate Gold Filigree Accent */}
                      <div className="flex items-center justify-center gap-2 mb-1 opacity-75">
                        <span
                          className="block w-8 h-[1px]"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${template.palette.foilHex} 100%)`,
                          }}
                        />
                        <span
                          className="text-[9px] tracking-[0.2em] font-display-luxury"
                          style={{ color: template.palette.foilHex }}
                        >
                          ✦
                        </span>
                        <span
                          className="block w-8 h-[1px]"
                          style={{
                            background: `linear-gradient(90deg, ${template.palette.foilHex} 0%, transparent 100%)`,
                          }}
                        />
                      </div>

                      {/* Host Names in Bespoke Hot-Foil Display Typography */}
                      <p
                        className="font-display-luxury text-lg sm:text-xl font-bold leading-snug tracking-wide truncate"
                        style={{
                          color: '#F6E7C1',
                          textShadow:
                            '0 1.5px 2px rgba(6,4,2,0.85), 0 -0.5px 0 rgba(255,250,235,0.52)',
                        }}
                      >
                        {displayHostNames}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================================
                4. 3D DEEP ROYAL EURO ENVELOPE FLAP (z-36 when sealed, z-12 when open)
                - Plunges past the envelope center (`h-[234px]` on `340px` body = 68.8%)
                  to eliminate the symmetric X-cross look and create a true luxury Euro silhouette
                ===================================================================== */}
            <div
              data-testid="envelope-top-flap-layer"
              onClick={() => {
                if (phase === 'sealed') {
                  handleOpenFlapStep();
                } else if (phase === 'flap-opening') {
                  handleExtractCardStep();
                }
              }}
              className={`absolute inset-x-0 mx-auto w-full max-w-[500px] h-[340px] rounded-[6px] select-none envelope-layer-smooth-transition ${
                phase === 'sealed' ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              style={{
                zIndex: isFlapOpen ? 12 : 36,
                pointerEvents: phase === 'sealed' ? 'auto' : 'none',
                transform: `translate3d(0px, ${envelopeLayerSeparation.bodyTranslateYPx}px, 0px) scale(${envelopeLayerSeparation.bodyScale})`,
                opacity: envelopeLayerSeparation.bodyOpacity,
              }}
            >
              <div
                className="absolute top-0 inset-x-0 w-full h-[234px] envelope-flap-smooth-transition"
                style={{
                  perspective: '1300px',
                  filter: isFlapOpen
                    ? 'drop-shadow(0 -8px 18px rgba(10,7,5,0.34))'
                    : 'drop-shadow(0 13px 22px rgba(5,3,2,0.58)) drop-shadow(0 3px 6px rgba(5,3,2,0.44)) drop-shadow(0 1px 0 rgba(255,250,240,0.26))',
                }}
              >
                <div
                  data-testid="envelope-3d-flap"
                  className="w-full h-full origin-top envelope-flap-smooth-transition"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate3d(0px, ${envelopeLayerSeparation.flapTranslateYPx}px, ${envelopeLayerSeparation.flapTranslateZPx}px) rotateX(${envelopeLayerSeparation.flapRotateXDeg}deg)`,
                  }}
                >
                  {/* Physical 600gsm Cotton Deep Euro Flap Body */}
                  <div
                    className="w-full h-[234px] rounded-t-[6px] overflow-hidden paper-grain-surface handmade-cotton-flap relative"
                    style={
                      {
                        '--grain-offset-x': '53px',
                        '--grain-offset-y': '71px',
                        '--weave-angle': '45deg',
                        clipPath: 'url(#sculptedEuroFlapClip)',
                        backgroundColor: template.palette.envelopeFlapBg,
                        backgroundImage:
                          'linear-gradient(180deg, rgba(255,252,245,0.30) 0%, rgba(255,252,245,0.08) 4%, rgba(6,4,2,0.20) 7%, transparent 12%), linear-gradient(178deg, rgba(255,252,245,0.20) 0%, rgba(255,252,245,0.04) 52%, rgba(8,6,4,0.42) 100%)',
                      } as React.CSSProperties
                    }
                  >
                    {/* Blind-Debossed Fold Crease along Top Hinge */}
                    <div
                      className="absolute top-[3px] inset-x-0 h-[2px] pointer-events-none z-10"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(255,252,245,0.22) 100%)',
                      }}
                    />

                    {/* Dual Blind-Debossed Scoring Groove & 24K Gold-Foil Trim Following the Deep Euro Flap Contour */}
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      aria-hidden="true"
                    >
                      {/* Outer 600gsm Paper Edge Highlight */}
                      <path
                        d="M 0,0 L 100,0 L 57.5,88.5 Q 50,99.5 42.5,88.5 Z"
                        fill="none"
                        stroke="rgba(255, 250, 238, 0.36)"
                        strokeWidth="0.75"
                      />
                      {/* Sunken Blind-Debossed Crease Valley */}
                      <path
                        d="M 2.0,1.2 L 98.0,1.2 L 56.6,86.4 Q 50,96.8 43.4,86.4 Z"
                        fill="none"
                        stroke="rgba(5, 3, 2, 0.58)"
                        strokeWidth="0.55"
                      />
                      {/* Warm Gold-Foil / Ivory Debossed Ridge */}
                      <path
                        d="M 2.4,1.6 L 97.6,1.6 L 56.2,85.8 Q 50,96.0 43.8,85.8 Z"
                        fill="none"
                        stroke={template.palette.foilHex}
                        strokeOpacity="0.42"
                        strokeWidth="0.4"
                      />
                    </svg>

                    {/* Die-Cut Inset Botanical / Silk Liner Revealed on Inner Flap Surface when Open */}
                    {isFlapOpen && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          clipPath: 'url(#sculptedEuroLinerClip)',
                          backgroundColor: template.palette.cardBg,
                          backgroundImage: `url("${template.palette.artworkUrl}")`,
                          backgroundSize: template.palette.artworkBgSize,
                          backgroundPosition: template.palette.artworkBgPos,
                          boxShadow: 'inset 0 0 12px rgba(8,6,4,0.28)',
                        }}
                      />
                    )}

                    {/* Style-Specific Vertical Closure Strap on Closed Top Flap */}
                    {!isFlapOpen && (
                      <>
                        {envelopeStyle === 'silk-ribbon' && (
                          <div
                            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-11 pointer-events-none"
                            style={{
                              background: `linear-gradient(90deg, #8A6421 0%, ${template.palette.foilHex} 22%, #FFF9E6 50%, ${template.palette.foilHex} 78%, #8A6421 100%)`,
                              boxShadow: '0 0 12px rgba(0,0,0,0.32)',
                            }}
                          />
                        )}

                        {envelopeStyle === 'velvet-clasp' && (
                          <div
                            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-9 pointer-events-none border-x border-[#F5E6B3]/50"
                            style={{
                              background:
                                'linear-gradient(90deg, #14110F 0%, #2C2523 50%, #14110F 100%)',
                              boxShadow: '0 0 12px rgba(0,0,0,0.42)',
                            }}
                          />
                        )}

                        {envelopeStyle === 'vintage-botanical' && (
                          <div
                            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1.5 pointer-events-none"
                            style={{
                              background:
                                'repeating-linear-gradient(45deg, #FFF3D1 0px, #D4AF37 3px, #7C581E 6px)',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =====================================================================
                5. 3D WAX SEAL PEEL-AND-FLOAT LAYER (z-42)
                - Positioned precisely over the sculpted tip of the Deep Euro Flap
                ===================================================================== */}
            <div
              data-testid="envelope-wax-seal-layer"
              className="absolute inset-x-0 mx-auto w-full max-w-[500px] h-[340px] pointer-events-none select-none"
              style={{
                zIndex: 42,
                transform: 'translateY(18px)',
              }}
            >
              <div
                className="absolute left-1/2 top-[198px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  pointerEvents: phase === 'sealed' ? 'auto' : 'none',
                }}
              >
                <FracturingWaxSeal3D
                  monogram={template.waxSealMonogram}
                  waxHex={template.palette.waxSealHex}
                  foilHex={template.palette.foilHex}
                  envelopeStyle={envelopeStyle}
                  phase={phase}
                  onActivate={handleOpenFlapStep}
                />
              </div>
            </div>

            {/* =====================================================================
                6. TACTILE 'PAPER DUST' PARTICLE BURST (z-35: Cotton fibers & gold motes)
                ===================================================================== */}
            <PaperDustEmitter
              active={phase === 'card-rising' || phase === 'opened'}
              foilHex={template.palette.foilHex}
              burstKey={dustBurstKey}
            />
          </div>

          {/* Bottom Stage Action Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 z-40">
            {phase === 'opened' ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  data-testid="bottom-flip-card-btn"
                  onClick={() => handleFlipCard()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1917] border border-[#D4AF37]/55 text-xs font-semibold text-[#FFF8EA] shadow-sm hover:bg-[#2E2925] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>
                    {cardFace === 'front'
                      ? 'چرخش سه‌بعدی به پشت کارت (یا کشیدن کارت به چپ و راست)'
                      : 'چرخش مجدد به روی کارت دعوت'}
                  </span>
                </button>
              </div>
            ) : phase === 'flap-opening' ? (
              <button
                type="button"
                data-testid="bottom-extract-card-btn"
                onClick={handleExtractCardStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1C1917] text-[#FFF8EA] border border-[#D4AF37] text-xs font-semibold shadow-md hover:bg-[#2E2925] transition-colors cursor-pointer"
              >
                <ArrowUp className="w-4 h-4 text-[#D4AF37]" />
                <span>تاچ دوم یا کشیدن به بالا: بیرون کشیدن دعوت‌نامه از پاکت</span>
              </button>
            ) : phase === 'sealed' ? (
              <button
                type="button"
                data-testid="bottom-open-envelope-btn"
                onClick={handleOpenFlapStep}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1C1917]/95 text-[#FFF8EA] border border-[#D4AF37]/50 text-xs font-semibold shadow-md hover:bg-[#1C1917] transition-colors cursor-pointer"
              >
                <MailOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>تاچ اول: باز کردن مهر و درب پاکت دعوت‌نامه</span>
              </button>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xs text-xs text-[#FFF8EA] border border-white/15">
                {phaseBadgeFa[phase]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Sidebar Paper Texture Slider & Guest Interactive Suite (Countdown, Map, Live RSVP) */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        {/* 0. Sidebar Paper Texture Slider (Classic Cotton 600gsm -> Modern Velvet) */}
        <div
          data-testid="sidebar-paper-texture-panel"
          className="rounded-xl bg-white border border-[#E5DEC9] p-5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFEAE0]">
            <div>
              <p className="text-xs text-[#9A7432] font-semibold">
                تنظیم‌کننده زنده متریال و سایه‌های سه‌بعدی
              </p>
              <h3 className="text-base font-bold text-[#1C1917] mt-0.5">
                بافت کاغذ و مقوا (از کتان کلاسیک تا مخمل مدرن)
              </h3>
            </div>
            <span
              data-testid="paper-texture-percentage"
              className="px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold tabular-nums text-[#1C1917]"
            >
              {paperTextureBlend.sliderValue}٪ مخمل
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-[#57534E]">
              <span>کتان کلاسیک ۶۰۰ گرم (۰٪)</span>
              <span
                data-testid="paper-texture-active-label"
                className="text-[#9A7432] font-semibold"
              >
                {paperTextureBlend.textureNameFa}
              </span>
              <span>مخمل مدرن سلطنتی (۱۰۰٪)</span>
            </div>

            <input
              id="sidebar-paper-texture-slider"
              data-testid="paper-texture-slider"
              type="range"
              min={0}
              max={100}
              step={1}
              value={paperTextureSlider}
              aria-label="تنظیم‌کننده بافت کاغذ از کتان کلاسیک تا مخمل مدرن"
              onChange={(e) => setPaperTextureSlider(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-l from-[#1C1917] via-[#9A7432] to-[#E5DEC9] accent-[#9A7432]"
            />

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { value: 0, label: 'کتان کلاسیک' },
                { value: 50, label: 'ابریشم و کتان' },
                { value: 100, label: 'مخمل مدرن' },
              ].map((preset) => {
                const isSelected = paperTextureSlider === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    data-testid={`texture-preset-${preset.value}`}
                    onClick={() => setPaperTextureSlider(preset.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1917] text-[#FFF8EA] border-[#D4AF37]'
                        : 'bg-[#FAF7F2] text-[#44403C] border-[#E5DEC9] hover:bg-[#F0EAE0]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 0B. Studio Lighting Controls Panel (Azimuth, Elevation & Intensity for Wax Seal & Paper Surface) */}
        <div
          data-testid="sidebar-lighting-controls-panel"
          className="rounded-xl bg-white border border-[#E5DEC9] p-5 shadow-xs"
        >
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EFEAE0]">
            <div>
              <p className="text-xs text-[#9A7432] font-semibold">
                کنترل زاویه تابش نور و درخشش مهر مومی
              </p>
              <h3 className="text-base font-bold text-[#1C1917] mt-0.5">
                نورپردازی سه‌بعدی آتلیه (Azimuth / Elevation)
              </h3>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold tabular-nums text-[#1C1917]">
              <Sun className="w-3.5 h-3.5 text-[#B68D40]" />
              <span data-testid="lighting-summary-badge">
                {studioLighting.azimuthDeg}° / {studioLighting.elevationDeg}°
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3.5">
            {/* Azimuth Angle Slider (0° to 360°) */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#57534E] mb-1">
                <label htmlFor="light-azimuth-slider">
                  زاویه افقی تابش نور (Azimuth)
                </label>
                <span
                  data-testid="light-azimuth-value"
                  className="tabular-nums font-bold text-[#1C1917]"
                >
                  {studioLighting.azimuthDeg}°
                </span>
              </div>
              <input
                id="light-azimuth-slider"
                data-testid="light-azimuth-slider"
                type="range"
                min={0}
                max={360}
                step={1}
                value={lightAzimuth}
                aria-label="زاویه افقی تابش نور Azimuth"
                onChange={(e) => setLightAzimuth(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#E5DEC9] accent-[#9A7432]"
              />
            </div>

            {/* Elevation Angle Slider (10° to 90°) */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#57534E] mb-1">
                <label htmlFor="light-elevation-slider">
                  ارتفاع تابش نور (Elevation)
                </label>
                <span
                  data-testid="light-elevation-value"
                  className="tabular-nums font-bold text-[#1C1917]"
                >
                  {studioLighting.elevationDeg}°
                </span>
              </div>
              <input
                id="light-elevation-slider"
                data-testid="light-elevation-slider"
                type="range"
                min={10}
                max={90}
                step={1}
                value={lightElevation}
                aria-label="ارتفاع تابش نور Elevation"
                onChange={(e) => setLightElevation(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#E5DEC9] accent-[#9A7432]"
              />
            </div>

            {/* Light Intensity Slider (20% to 100%) */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-[#57534E] mb-1">
                <label htmlFor="light-intensity-slider">
                  شدت روشنایی و کنتراست سایه (Intensity)
                </label>
                <span
                  data-testid="light-intensity-value"
                  className="tabular-nums font-bold text-[#1C1917]"
                >
                  {studioLighting.intensityPct}٪
                </span>
              </div>
              <input
                id="light-intensity-slider"
                data-testid="light-intensity-slider"
                type="range"
                min={20}
                max={100}
                step={1}
                value={lightIntensity}
                aria-label="شدت روشنایی نور Intensity"
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#E5DEC9] accent-[#9A7432]"
              />
            </div>

            {/* Quick Studio Lighting Presets */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: 'نور طلایی صبح', az: 135, el: 42, int: 85 },
                { label: 'نور مستقیم آتلیه', az: 90, el: 75, int: 95 },
                { label: 'سایه دراماتیک عصر', az: 315, el: 22, int: 75 },
              ].map((preset) => {
                const isSelected =
                  lightAzimuth === preset.az && lightElevation === preset.el;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setLightAzimuth(preset.az);
                      setLightElevation(preset.el);
                      setLightIntensity(preset.int);
                    }}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1C1917] text-[#FFF8EA] border-[#D4AF37]'
                        : 'bg-[#FAF7F2] text-[#44403C] border-[#E5DEC9] hover:bg-[#F0EAE0]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1. Event Summary & Countdown Card */}
        <div className="rounded-xl bg-white border border-[#E5DEC9] p-6">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EFEAE0]">
            <div>
              <p className="text-xs text-[#78716C]">امکانات تعاملی مهمانان</p>
              <h3 className="text-lg font-bold text-[#1C1917]">
                شمارش معکوس و اطلاعات مکان
              </h3>
            </div>
            <Sparkles className="w-5 h-5 text-[#B68D40]" />
          </div>

          {/* Tabular Countdown */}
          <div className="grid grid-cols-4 gap-3 my-4 text-center">
            {[
              { value: '۴۸', label: 'روز' },
              { value: '۱۴', label: 'ساعت' },
              { value: '۳۲', label: 'دقیقه' },
              { value: '۱۹', label: 'ثانیه' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E7E0D3]"
              >
                <div className="text-xl font-bold tabular-nums text-[#1C1917]">
                  {item.value}
                </div>
                <div className="text-xs text-[#78716C] mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-[#44403C] pt-2">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#9A7432] shrink-0" />
              <span>{template.eventDateFa}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#9A7432] shrink-0" />
              <span>ساعت پذیرش: {template.eventTime}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#9A7432] shrink-0" />
              <span>
                {template.venueFa} — {template.addressFa}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#EFEAE0] flex flex-wrap gap-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                template.venueFa + ' ' + template.cityFa
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#D6CEBF] text-xs font-medium text-[#1C1917] hover:bg-[#F0EAE0] transition-colors whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#9A7432]" />
              <span>مسیریابی در Google Maps</span>
            </a>
          </div>
        </div>

        {/* 2. Interactive Guest RSVP Form */}
        <div className="rounded-xl bg-white border border-[#E5DEC9] p-6">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EFEAE0]">
            <div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                فرم ثبت حضور مهمان (RSVP)
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                پاسخ مهمانان بلافاصله در پنل میزبان ثبت می‌شود
              </p>
            </div>
            <div className="text-left text-xs text-[#57534E] tabular-nums">
              <span>{summary.attendingHeadcount} نفر تایید شده</span>
            </div>
          </div>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 mt-4">
            <div>
              <label
                htmlFor="rsvp-guest-name"
                className="block text-xs font-medium text-[#292524] mb-1.5"
              >
                نام و نام خانوادگی مهمان
              </label>
              <input
                id="rsvp-guest-name"
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (formError) setFormError('');
                  if (rsvpSubmitted) setRsvpSubmitted(false);
                }}
                placeholder="مثلاً: دکتر سهند فرهادی و خانواده"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917] focus:outline-none focus:border-[#9A7432]"
              />
              {formError && (
                <p className="text-xs text-red-700 mt-1.5">{formError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="rsvp-status"
                  className="block text-xs font-medium text-[#292524] mb-1.5"
                >
                  وضعیت حضور
                </label>
                <select
                  id="rsvp-status"
                  value={attending}
                  onChange={(e) =>
                    setAttending(e.target.value as 'yes' | 'no' | 'maybe')
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
                >
                  <option value="yes">با افتخار حضور دارم</option>
                  <option value="maybe">هنوز مطمئن نیستم</option>
                  <option value="no">متاسفانه امکان حضور ندارم</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="rsvp-count"
                  className="block text-xs font-medium text-[#292524] mb-1.5"
                >
                  تعداد همراهان
                </label>
                <select
                  id="rsvp-count"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  disabled={attending === 'no'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917] tabular-nums"
                >
                  <option value={1}>۱ نفر</option>
                  <option value={2}>۲ نفر</option>
                  <option value={3}>۳ نفر</option>
                  <option value={4}>۴ نفر</option>
                  <option value={5}>۵ نفر</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="rsvp-message"
                className="block text-xs font-medium text-[#292524] mb-1.5"
              >
                یادداشت یا پیام تبریک برای میزبان
              </label>
              <input
                id="rsvp-message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="با آرزوی خوشبختی و شادی ابدی..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#1C1917] text-[#F7F4EF] text-xs font-semibold hover:bg-[#332E2A] transition-colors cursor-pointer"
            >
              ثبت حضور در لیست مهمانان
            </button>

            {rsvpSubmitted && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>پاسخ شما با موفقیت در لیست مهمانان ثبت شد.</span>
              </div>
            )}
          </form>

          {/* Recent Guest Responses */}
          <div className="mt-5 pt-4 border-t border-[#EFEAE0]">
            <div className="flex items-center justify-between text-xs text-[#57534E] mb-2.5">
              <span className="font-semibold text-[#1C1917]">آخرین پاسخ‌های مهمانان</span>
              <span className="tabular-nums">{summary.totalResponses} پاسخ ثبت‌شده</span>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {rsvpList.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-[#FAF7F2]"
                >
                  <div>
                    <span className="font-medium text-[#1C1917]">{item.guestName}</span>
                    {item.message && (
                      <p className="text-[11px] text-[#78716C] truncate max-w-[200px]">
                        «{item.message}»
                      </p>
                    )}
                  </div>
                  <div className="text-left tabular-nums text-[#57534E]">
                    {item.attending === 'yes'
                      ? `حضور (${item.guestCount} نفر)`
                      : item.attending === 'no'
                      ? 'عدم حضور'
                      : 'نامشخص'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
