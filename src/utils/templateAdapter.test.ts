import test from 'node:test';
import assert from 'node:assert/strict';
import {
  adaptRawTemplateToCanonical,
  buildUnified250Templates,
  validateTemplateLibrary,
  filterTemplates,
  calculateRsvpSummary,
  getEnvelopePhaseTimings,
  generatePaperDustParticles,
  ENVELOPE_STYLE_VARIANTS,
  LUXURY_PALETTES,
  getAdaptiveHeadingSizeClass,
  getCardSurfaceDebossStyle,
  getDressCodeSwatches,
  getInteractiveStageStep,
  resolveNextStageTouchAction,
} from './templateAdapter';

test('buildUnified250Templates produces 250 valid templates with unique IDs and slugs across all 6 collections', () => {
  const library = buildUnified250Templates();
  assert.equal(library.length, 250);

  const report = validateTemplateLibrary(library);
  assert.equal(report.isValid, true);
  assert.equal(report.uniqueIdsCount, 250);
  assert.equal(report.uniqueSlugsCount, 250);
  assert.equal(report.missingFieldsCount, 0);
  assert.equal(report.collectionsBreakdown['wedding-royal'], 50);
  assert.equal(report.collectionsBreakdown['persian-heritage'], 45);
  assert.equal(report.collectionsBreakdown['engagement-botanical'], 45);
  assert.equal(report.collectionsBreakdown['birthday-editorial'], 40);
  assert.equal(report.collectionsBreakdown['corporate-gala'], 35);
  assert.equal(report.collectionsBreakdown['special-soiree'], 35);
});

test('adaptRawTemplateToCanonical safely normalizes incomplete ChatGPT template records with fallback animation and palette', () => {
  const legacyRaw = {
    name_fa: 'کارت عروسی طلایی کاخ نیاوران',
    name_en: 'Niavaran Palace Gold Invitation',
    category: 'سنتی ایرانی',
    openingType: 'unknown-custom-animation',
  };

  const adapted = adaptRawTemplateToCanonical(legacyRaw, 7);
  assert.equal(adapted.collectionId, 'persian-heritage');
  assert.equal(adapted.titleFa, 'کارت عروسی طلایی کاخ نیاوران');
  assert.equal(adapted.titleEn, 'Niavaran Palace Gold Invitation');
  assert.ok(adapted.palette.cardBg.startsWith('#'));
  assert.ok(
    ['wax-seal', 'silk-ribbon', 'luxury-box', 'booklet', 'editorial-reveal'].includes(
      adapted.animationType
    )
  );
});

test('filterTemplates filters accurately by collection, animationType, shape, and search query', () => {
  const library = buildUnified250Templates();
  const persianOnly = filterTemplates(library, {
    collectionId: 'persian-heritage',
    animationType: 'all',
    cardShape: 'all',
    searchQuery: '',
  });
  assert.equal(persianOnly.length, 45);

  const waxSealArch = filterTemplates(library, {
    collectionId: 'all',
    animationType: 'wax-seal',
    cardShape: 'arch',
    searchQuery: '',
  });
  assert.ok(waxSealArch.length > 0);
  assert.ok(waxSealArch.every((t) => t.animationType === 'wax-seal' && t.cardShape === 'arch'));
});

test('calculateRsvpSummary computes attending headcount and response counts accurately', () => {
  const summary = calculateRsvpSummary([
    {
      id: '1',
      guestName: 'سارا محمدی',
      attending: 'yes',
      guestCount: 3,
      dietaryPreference: 'استاندارد',
      message: 'مبارک باشد',
      createdAt: '2026-05-01',
    },
    {
      id: '2',
      guestName: 'امیرحسین رضایی',
      attending: 'no',
      guestCount: 2,
      dietaryPreference: 'استاندارد',
      message: '',
      createdAt: '2026-05-01',
    },
  ]);

  assert.equal(summary.attendingHeadcount, 3);
  assert.equal(summary.declinedCount, 1);
  assert.equal(summary.totalResponses, 2);
});

test('getEnvelopePhaseTimings returns sequential 3D choreography timings with brisk easeOut card extraction, translateZ depth emergence, and subtle end micro-bounce', () => {
  const timings = getEnvelopePhaseTimings('wax-seal');
  assert.ok(timings.crackDurationMs >= 300);
  assert.ok(timings.flapOpenDelayMs < timings.cardRiseDelayMs);
  assert.ok(timings.cardRiseDurationMs <= 700);
  assert.equal(timings.cardRiseEase, 'easeOut');
  assert.equal(timings.cardBounceKeyframesY.length, 6);
  assert.equal(timings.cardBounceKeyframesZ.length, 6);
  assert.equal(timings.cardBounceKeyframesY[timings.cardBounceKeyframesY.length - 1], 0);
  assert.ok(timings.stageTranslateZ.sealed < 0);
  assert.ok(timings.stageTranslateZ['flap-opening'] < 0);
  assert.ok(timings.stageTranslateZ.opened > 0);
  assert.equal(
    timings.cardBounceKeyframesZ[timings.cardBounceKeyframesZ.length - 1],
    timings.stageTranslateZ.opened
  );
  assert.equal(timings.cardBounceKeyframesRotateZ[timings.cardBounceKeyframesRotateZ.length - 1], 0);
  assert.ok(timings.totalSequenceMs > timings.cardRiseDelayMs);
  assert.equal(timings.flapOpenAngleDeg, -172);
});

test('getCardSurfaceDebossStyle computes translateZ transform, border-inset, multi-layer inset shadows, and 3D letterpress text-shadow', () => {
  const lightPalette = LUXURY_PALETTES[0];
  const darkPalette = LUXURY_PALETTES[2];

  const frontOpened = getCardSurfaceDebossStyle(lightPalette, 'opened', 'front');
  assert.equal(frontOpened.borderStyle, 'inset');
  assert.ok(frontOpened.transform.includes('rotateY(0deg)'));
  assert.ok(frontOpened.transform.includes('translateZ(14px)'));
  assert.ok(frontOpened.boxShadow.includes('inset'));
  assert.ok(frontOpened.inkTextShadow.length > 0);
  assert.ok(frontOpened.debossedGrooveBoxShadow.includes('inset'));

  const backOpenedDark = getCardSurfaceDebossStyle(darkPalette, 'opened', 'back');
  assert.equal(backOpenedDark.borderStyle, 'inset');
  assert.ok(backOpenedDark.transform.includes('rotateY(180deg)'));
  assert.ok(backOpenedDark.transform.includes('translateZ(14px)'));
  assert.ok(backOpenedDark.boxShadow.includes('inset'));
});

test('generatePaperDustParticles creates balanced cotton-fiber and gold-mote particles along both sides of the envelope throat', () => {
  const particles = generatePaperDustParticles(24);
  assert.equal(particles.length, 24);
  const leftSide = particles.filter((p) => p.originX < 0);
  const rightSide = particles.filter((p) => p.originX > 0);
  assert.equal(leftSide.length, 12);
  assert.equal(rightSide.length, 12);
  assert.ok(particles.some((p) => p.kind === 'cotton-fiber'));
  assert.ok(particles.some((p) => p.kind === 'gold-mote'));
  assert.ok(particles.every((p) => p.driftY < 0 && p.durationSec >= 0.9));
});

test('getInteractiveStageStep and resolveNextStageTouchAction enforce 4-step progression: sealed -> open flap -> extract card -> 3D flip to back', () => {
  const step1 = getInteractiveStageStep('sealed', 'front');
  assert.equal(step1.stepNumber, 1);
  assert.equal(step1.canOpenEnvelope, true);
  assert.equal(step1.canExtractCard, false);
  assert.equal(step1.canFlipCard, false);
  assert.equal(resolveNextStageTouchAction('sealed', 'front'), 'open-flap');

  const step2 = getInteractiveStageStep('flap-opening', 'front');
  assert.equal(step2.stepNumber, 2);
  assert.equal(step2.canOpenEnvelope, false);
  assert.equal(step2.canExtractCard, true);
  assert.equal(step2.canFlipCard, false);
  assert.equal(resolveNextStageTouchAction('flap-opening', 'front'), 'extract-card');

  const step3 = getInteractiveStageStep('opened', 'front');
  assert.equal(step3.stepNumber, 3);
  assert.equal(step3.canOpenEnvelope, false);
  assert.equal(step3.canExtractCard, false);
  assert.equal(step3.canFlipCard, true);
  assert.equal(resolveNextStageTouchAction('opened', 'front'), 'flip-to-back');

  const step4 = getInteractiveStageStep('opened', 'back');
  assert.equal(step4.stepNumber, 4);
  assert.equal(step4.canFlipCard, true);
  assert.equal(resolveNextStageTouchAction('opened', 'back'), 'flip-to-front');
});

test('ENVELOPE_STYLE_VARIANTS defines 5 unique luxury envelope styles with distinct 3D closure kinds', () => {
  assert.equal(ENVELOPE_STYLE_VARIANTS.length, 5);
  const closureKinds = new Set(ENVELOPE_STYLE_VARIANTS.map((v) => v.closureKind));
  assert.equal(closureKinds.size, 5);
  assert.ok(closureKinds.has('wax-seal'));
  assert.ok(closureKinds.has('silk-bow'));
  assert.ok(closureKinds.has('jewelled-clasp'));
  assert.ok(closureKinds.has('persian-shamseh'));
  assert.ok(closureKinds.has('botanical-twine'));
});

test('getAdaptiveHeadingSizeClass and getDressCodeSwatches prevent text overflow and provide coordinated back-of-card swatches', () => {
  assert.equal(
    getAdaptiveHeadingSizeClass('آوا و سیاوش', 'stage'),
    'text-2xl sm:text-[28px] leading-snug'
  );
  assert.equal(
    getAdaptiveHeadingSizeClass('Persia Fine Arts & Maison Gala', 'stage'),
    'text-lg sm:text-xl leading-snug'
  );
  assert.equal(
    getAdaptiveHeadingSizeClass('Persia Fine Arts & Maison Gala', 'mini'),
    'text-[11px] leading-tight'
  );

  const swatches = getDressCodeSwatches(LUXURY_PALETTES[0]);
  assert.equal(swatches.length, 4);
  assert.ok(swatches.every((s) => s.hex.startsWith('#') && s.labelFa.length > 0));
});

test('computeHorizontalCardRotation calculates live Y-axis 3D rotation and swipe-to-flip threshold', async () => {
  const { computeHorizontalCardRotation } = await import('./templateAdapter');

  const stationaryFront = computeHorizontalCardRotation(0, 'front');
  assert.equal(stationaryFront.rotateYDeg, 0);
  assert.equal(stationaryFront.shouldFlip, false);

  const gentleDragRight = computeHorizontalCardRotation(18, 'front');
  assert.ok(gentleDragRight.rotateYDeg > 0 && gentleDragRight.rotateYDeg < 45);
  assert.equal(gentleDragRight.shouldFlip, false);

  const swipeLeftFlip = computeHorizontalCardRotation(-42, 'front');
  assert.equal(swipeLeftFlip.shouldFlip, true);
  assert.equal(swipeLeftFlip.nextFace, 'back');

  const swipeBackToFront = computeHorizontalCardRotation(48, 'back');
  assert.equal(swipeBackToFront.shouldFlip, true);
  assert.equal(swipeBackToFront.nextFace, 'front');
});

test('getPaperTextureBlendStyle interpolates from Classic Cotton (0) to Modern Velvet (100) and updates card shadows', async () => {
  const { getPaperTextureBlendStyle } = await import('./templateAdapter');

  const classicCotton = getPaperTextureBlendStyle(0, false, true);
  assert.equal(classicCotton.sliderValue, 0);
  assert.equal(classicCotton.cottonRatio, 1);
  assert.equal(classicCotton.velvetRatio, 0);
  assert.equal(classicCotton.cssVariables['--paper-cotton-opacity'], '1');
  assert.equal(classicCotton.cssVariables['--paper-velvet-opacity'], '0');
  assert.ok(classicCotton.textureNameFa.includes('کتان کلاسیک'));

  const modernVelvet = getPaperTextureBlendStyle(100, false, true);
  assert.equal(modernVelvet.sliderValue, 100);
  assert.equal(modernVelvet.cottonRatio, 0);
  assert.equal(modernVelvet.velvetRatio, 1);
  assert.equal(modernVelvet.cssVariables['--paper-cotton-opacity'], '0.18');
  assert.equal(modernVelvet.cssVariables['--paper-velvet-opacity'], '0.94');
  assert.ok(modernVelvet.textureNameFa.includes('مخمل مدرن'));

  // Verify getCardSurfaceDebossStyle reflects the texture slider change in boxShadow
  const cottonDeboss = getCardSurfaceDebossStyle(LUXURY_PALETTES[0], 'opened', 'front', 0);
  const velvetDeboss = getCardSurfaceDebossStyle(LUXURY_PALETTES[0], 'opened', 'front', 100);
  assert.notEqual(cottonDeboss.boxShadow, velvetDeboss.boxShadow);
  assert.notEqual(cottonDeboss.borderColor, velvetDeboss.borderColor);
});

test('getEnvelopeLayerSeparationStyle computes smooth CSS transition transforms separating flap and body layers', async () => {
  const { getEnvelopeLayerSeparationStyle } = await import('./templateAdapter');

  const sealed = getEnvelopeLayerSeparationStyle('sealed');
  assert.equal(sealed.flapRotateXDeg, 0);
  assert.equal(sealed.bodyTranslateYPx, 18);
  assert.equal(sealed.bodyScale, 1);
  assert.ok(sealed.transitionCss.includes('cubic-bezier(0.22, 1, 0.36, 1)'));

  const flapOpen = getEnvelopeLayerSeparationStyle('flap-opening');
  assert.ok(flapOpen.flapRotateXDeg < -150);
  assert.ok(flapOpen.flapTranslateYPx < 0);
  assert.ok(flapOpen.bodyTranslateYPx > sealed.bodyTranslateYPx);
  assert.notEqual(flapOpen.leftWingTransform, sealed.leftWingTransform);
  assert.notEqual(flapOpen.rightWingTransform, sealed.rightWingTransform);
  assert.notEqual(flapOpen.bottomPocketTransform, sealed.bottomPocketTransform);
});

test('getStudioLightingStyle computes dynamic CSS custom properties for azimuth, elevation, and intensity', async () => {
  const { getStudioLightingStyle } = await import('./templateAdapter');

  const morningLight = getStudioLightingStyle(135, 42, 85);
  assert.equal(morningLight.azimuthDeg, 135);
  assert.equal(morningLight.elevationDeg, 42);
  assert.equal(morningLight.intensityPct, 85);
  assert.equal(morningLight.cssVariables['--light-azimuth'], '135deg');
  assert.equal(morningLight.cssVariables['--light-elevation'], '42deg');
  assert.ok(morningLight.cssVariables['--wax-highlight-x'].endsWith('%'));
  assert.ok(morningLight.cssVariables['--wax-dynamic-shadow'].includes('drop-shadow'));

  const sunsetLight = getStudioLightingStyle(315, 22, 60);
  assert.notEqual(
    morningLight.cssVariables['--wax-highlight-x'],
    sunsetLight.cssVariables['--wax-highlight-x']
  );
  assert.notEqual(
    morningLight.cssVariables['--envelope-dynamic-shadow'],
    sunsetLight.cssVariables['--envelope-dynamic-shadow']
  );
});

test('generateEnvelopeOpeningWavDataUri creates a valid base64 WAV audio data URI for the envelope-opening Audio element', async () => {
  const { generateEnvelopeOpeningWavDataUri } = await import('./templateAdapter');

  const wavUri = generateEnvelopeOpeningWavDataUri();
  assert.ok(wavUri.startsWith('data:audio/wav;base64,UklGR'));
  assert.ok(wavUri.length > 1000);
});

