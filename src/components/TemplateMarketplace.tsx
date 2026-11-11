import React, { useState } from 'react';
import { Search, Eye, SlidersHorizontal, RotateCcw, RefreshCw } from 'lucide-react';
import {
  AnimationChoreography,
  CardCutShape,
  CardFaceSide,
  CollectionId,
  COLLECTION_METADATA,
  InvitationTemplate,
  MarketplaceFilterOptions,
  filterTemplates,
  getAdaptiveHeadingSizeClass,
} from '../utils/templateAdapter';

interface TemplateMarketplaceProps {
  templates: InvitationTemplate[];
  selectedTemplateId: string;
  language: 'fa' | 'en';
  onSelectTemplate: (template: InvitationTemplate) => void;
}

const COLLECTION_TABS: Array<{ id: CollectionId | 'all'; labelFa: string }> = [
  { id: 'all', labelFa: 'همه ۲۵۰ قالب' },
  { id: 'wedding-royal', labelFa: 'عروسی سلطنتی (۵۰)' },
  { id: 'persian-heritage', labelFa: 'نگارگری ایرانی (۴۵)' },
  { id: 'engagement-botanical', labelFa: 'نامزدی و عقد (۴۵)' },
  { id: 'birthday-editorial', labelFa: 'تولد اختصاصی (۴۰)' },
  { id: 'corporate-gala', labelFa: 'گالا و VIP (۳۵)' },
  { id: 'special-soiree', labelFa: 'سالگرد و مهمانی (۳۵)' },
];

const ANIMATION_FILTERS: Array<{ id: AnimationChoreography | 'all'; labelFa: string }> = [
  { id: 'all', labelFa: 'همه انیمیشن‌ها' },
  { id: 'wax-seal', labelFa: 'پاکت و مهر مومی' },
  { id: 'silk-ribbon', labelFa: 'روبان ابریشمی' },
  { id: 'luxury-box', labelFa: 'جعبه مخمل' },
  { id: 'booklet', labelFa: 'دفترچه دوبرگه' },
  { id: 'editorial-reveal', labelFa: 'بازگشایی سینمایی' },
];

const SHAPE_FILTERS: Array<{ id: CardCutShape | 'all'; labelFa: string }> = [
  { id: 'all', labelFa: 'همه برش‌ها' },
  { id: 'arch', labelFa: 'طاقی (Arch)' },
  { id: 'classic-frame', labelFa: 'کلاسیک ورسای' },
  { id: 'chamfered', labelFa: 'گوشه‌پخ جواهری' },
  { id: 'scalloped', labelFa: 'موج‌دار آتلیه‌ای' },
  { id: 'imperial-booklet', labelFa: 'دفترچه‌ای سلطنتی' },
];

const ANIMATION_NAMES_FA: Record<AnimationChoreography, string> = {
  'wax-seal': 'پاکت مهر مومی',
  'silk-ribbon': 'پاکت روبان ابریشمی',
  'luxury-box': 'پاکت مخمل و سگک',
  booklet: 'پاکت طاقی صفوی',
  'editorial-reveal': 'پاکت گیاهی دست‌ساز',
};

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({
  templates,
  selectedTemplateId,
  language,
  onSelectTemplate,
}) => {
  const [filters, setFilters] = useState<MarketplaceFilterOptions>({
    collectionId: 'all',
    animationType: 'all',
    cardShape: 'all',
    searchQuery: '',
  });
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, CardFaceSide>>({});

  const filtered = filterTemplates(templates, filters);
  const visibleItems = filtered.slice(0, visibleCount);

  const toggleMiniCardFace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCardIds((prev) => ({
      ...prev,
      [id]: prev[id] === 'back' ? 'front' : 'back',
    }));
  };

  const resetFilters = () => {
    setFilters({
      collectionId: 'all',
      animationType: 'all',
      cardShape: 'all',
      searchQuery: '',
    });
    setVisibleCount(12);
  };

  return (
    <section id="marketplace-section" className="py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-xs font-medium text-[#8C6D3F] mb-2">
            موتور یکپارچه ۶ مجموعه · طراحی دورو (روی کارت و پشت کارت هماهنگ)
          </p>
          <h2 className="font-display-luxury text-3xl sm:text-4xl font-bold text-[#1C1917]">
            ویترین ۲۵۰ کارت دعوت لوکس و پاکت‌های اختصاصی
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#78716C] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            aria-label="جست‌وجو در بین ۲۵۰ قالب"
            value={filters.searchQuery}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
              setVisibleCount(12);
            }}
            placeholder="جست‌وجوی نام قالب، شهر، رنگ یا کد..."
            className="w-full pr-10 pl-4 py-2.5 text-xs rounded-xl bg-white border border-[#DCD4C4] text-[#1C1917] focus:outline-none focus:border-[#9A7432]"
          />
        </div>
      </div>

      {/* Interactive Filter Control Bar */}
      <div className="space-y-4 mb-8 p-4 rounded-2xl bg-white border border-[#E5DEC9]">
        {/* Primary Collection Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {COLLECTION_TABS.map((tab) => {
            const active = filters.collectionId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, collectionId: tab.id }));
                  setVisibleCount(12);
                }}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1C1917] text-[#F7F4EF]'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#F5F0E6]'
                }`}
              >
                {tab.labelFa}
              </button>
            );
          })}
        </div>

        {/* Secondary Animation & Cut Shape Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EFEAE0]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-[#78716C] ml-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>مدل پاکت و بازگشایی:</span>
            </span>
            {ANIMATION_FILTERS.map((anim) => {
              const active = filters.animationType === anim.id;
              return (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, animationType: anim.id }))
                  }
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#C5A059]/20 text-[#1C1917] font-semibold border border-[#C5A059]'
                      : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917]'
                  }`}
                >
                  {anim.labelFa}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="shape-filter-select" className="text-xs text-[#78716C]">
              فرم برش کارت:
            </label>
            <select
              id="shape-filter-select"
              value={filters.cardShape}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  cardShape: e.target.value as CardCutShape | 'all',
                }))
              }
              className="px-3 py-1.5 text-xs rounded-lg border border-[#D6CEBF] bg-[#FAF7F2] text-[#1C1917]"
            >
              {SHAPE_FILTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.labelFa}
                </option>
              ))}
            </select>

            <span className="text-xs text-[#57534E] font-mono-tabular">
              نمایش {visibleItems.length} از {filtered.length} قالب
            </span>
          </div>
        </div>
      </div>

      {/* Empty Filter State */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E5DEC9] p-12 text-center">
          <p className="text-base font-semibold text-[#1C1917] mb-2">
            هیچ قالبی با این ترکیب فیلتر پیدا نشد
          </p>
          <p className="text-xs text-[#78716C] mb-5">
            می‌توانید فیلترها را بازنشانی کنید تا هر ۲۵۰ قالب کتابخانه نمایش داده شوند.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C1917] text-[#F7F4EF] text-xs font-medium cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی فیلترها</span>
          </button>
        </div>
      ) : (
        <>
          {/* 3-Column Uniform Luxury Stationery Suite Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {visibleItems.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              const activeFace: CardFaceSide = flippedCardIds[tpl.id] ?? 'front';
              const miniShapeClass =
                tpl.cardShape === 'arch'
                  ? 'shape-arch-mini'
                  : tpl.cardShape === 'chamfered'
                  ? 'shape-chamfered'
                  : tpl.cardShape === 'scalloped'
                  ? 'shape-scalloped'
                  : tpl.cardShape === 'imperial-booklet'
                  ? 'shape-imperial-booklet'
                  : 'shape-classic-frame';

              const foilText =
                tpl.foilFinish === 'rose-gold'
                  ? 'foil-rosegold-text'
                  : tpl.foilFinish === 'silver'
                  ? 'foil-silver-text'
                  : tpl.palette.isDarkCard
                  ? 'printed-foil-stamp-dark'
                  : 'printed-foil-stamp-light';

              const inkText = tpl.palette.isDarkCard
                ? 'printed-letterpress-light'
                : 'printed-letterpress-dark';

              const hostDisplay =
                language === 'fa' ? tpl.hostNamesFa : tpl.hostNamesEn;
              const miniHostSize = getAdaptiveHeadingSizeClass(hostDisplay, 'mini');

              return (
                <article
                  key={tpl.id}
                  className={`group rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-1 flex flex-col overflow-hidden ${
                    isSelected
                      ? 'border-[#9A7432] ring-2 ring-[#C5A059]/30'
                      : 'border-[#E5DEC9] hover:border-[#C5A059]'
                  }`}
                >
                  {/* Composed Stationery Suite Flatlay: Bespoke Envelope + Twin-Face Miniature Card */}
                  <div
                    className="relative h-92 p-5 flex items-center justify-center overflow-hidden paper-grain-surface"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 42%, #F6F0E4 0%, #EAE0CE 62%, #DDD0BA 100%)',
                    }}
                  >
                    {/* Top-Right Quick Face Flip Button (روی کارت / پشت کارت) */}
                    <button
                      type="button"
                      onClick={(e) => toggleMiniCardFace(tpl.id, e)}
                      className="absolute top-3 left-3 z-30 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1917]/85 backdrop-blur-xs text-[#FFF8EA] border border-[#D4AF37]/50 text-[10px] font-medium hover:bg-[#1C1917] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
                      <span>
                        {activeFace === 'front' ? 'مشاهده پشت کارت' : 'مشاهده روی کارت'}
                      </span>
                    </button>

                    {/* Matching Bespoke 3D Miniature Envelope Tucked Behind Card */}
                    <div
                      aria-hidden="true"
                      className="absolute w-54 h-66 rounded-xl -rotate-6 -translate-x-5 translate-y-2 transition-transform duration-300 group-hover:-rotate-8 group-hover:-translate-x-7 paper-grain-surface"
                      style={{
                        backgroundColor: tpl.palette.envelopeBg,
                        boxShadow: '0 18px 34px -8px rgba(15, 12, 10, 0.42)',
                        border: `1px solid ${tpl.palette.foilHex}66`,
                      }}
                    >
                      {/* Envelope Flap V-Gold Trim */}
                      <svg
                        viewBox="0 0 200 120"
                        className="w-full h-28"
                        preserveAspectRatio="none"
                      >
                        <polygon
                          points="0,0 200,0 100,105"
                          fill={tpl.palette.envelopeFlapBg}
                        />
                        <path
                          d="M 2 1 L 100 104 L 198 1"
                          fill="none"
                          stroke={tpl.palette.foilHex}
                          strokeWidth="1.8"
                          strokeOpacity="0.85"
                        />
                      </svg>
                      {/* Mini Seal on Envelope */}
                      <div
                        className="w-7 h-7 rounded-full mx-auto -mt-4 border border-[#FFF3D1]/60 shadow-md"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, #FCE6AE 0%, ${tpl.palette.waxSealHex} 60%, #4A2E0B 100%)`,
                        }}
                      />
                    </div>

                    {/* Miniature 600gsm Photorealistic Cardstock (Single-Surface Direct Letterpress & Foil Print) */}
                    <div
                      onClick={() => onSelectTemplate(tpl)}
                      className={`relative z-10 w-54 h-76 flex flex-col items-center justify-between text-center transition-all duration-300 group-hover:scale-[1.02] translate-x-2 cursor-pointer overflow-hidden ${miniShapeClass}`}
                      style={{
                        backgroundColor: tpl.palette.cardBg,
                        backgroundImage: `url("${tpl.palette.artworkUrl}")`,
                        backgroundSize: tpl.palette.artworkBgSize,
                        backgroundPosition: tpl.palette.artworkBgPos,
                        backgroundRepeat: 'no-repeat',
                        padding: tpl.palette.safePadding,
                        color: tpl.palette.textPrimary,
                        boxShadow:
                          '0 22px 42px -8px rgba(18, 16, 14, 0.48), 0 8px 18px rgba(0,0,0,0.24), inset 0 1px 1px rgba(255,255,255,0.58), inset 0 -2px 2px rgba(24,18,12,0.28)',
                      }}
                    >
                      {/* Direct Letterpress & Hot-Foil Print Inside Artwork's Built-In Frame */}
                      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between text-center overflow-hidden">
                        {activeFace === 'front' ? (
                          <>
                            <span
                              className={`text-[7.5px] font-semibold max-w-[125px] leading-tight ${inkText}`}
                              style={{
                                color: tpl.palette.textMuted,
                                textWrap: 'balance',
                              }}
                            >
                              {language === 'fa' ? tpl.kickerFa : tpl.kickerEn}
                            </span>

                            <div className="my-0.5 px-0.5 flex flex-col items-center w-full">
                              <p
                                className={`font-display-luxury ${miniHostSize} font-bold max-w-full break-words ${foilText}`}
                                style={{
                                  textWrap: 'balance',
                                }}
                              >
                                {hostDisplay}
                              </p>
                              <div
                                className="mx-auto my-1 w-7 h-[1px] opacity-75"
                                style={{ backgroundColor: tpl.palette.foilHex }}
                              />
                              <p
                                className={`text-[7.5px] font-semibold leading-tight ${inkText}`}
                                style={{ color: tpl.palette.textMuted }}
                              >
                                {tpl.eventDateFa}
                              </p>
                              <p
                                className={`text-[7.5px] font-bold mt-0.5 leading-tight ${inkText}`}
                                style={{ color: tpl.palette.textPrimary }}
                              >
                                {tpl.cityFa} · ساعت {tpl.eventTime}
                              </p>
                            </div>

                            <div>
                              <span
                                dir="ltr"
                                className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-display-luxury font-bold tracking-widest border ${foilText}`}
                                style={{
                                  borderColor: `${tpl.palette.foilHex}70`,
                                }}
                              >
                                {tpl.waxSealMonogram}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col items-center pt-0.5">
                              <span
                                dir="ltr"
                                className={`inline-block px-2 py-0.5 rounded-full text-[7.5px] font-display-luxury font-bold tracking-widest border ${foilText}`}
                                style={{
                                  borderColor: `${tpl.palette.foilHex}70`,
                                }}
                              >
                                {tpl.waxSealMonogram}
                              </span>
                              <span
                                className={`mt-1 text-[8px] font-bold ${foilText}`}
                              >
                                پشت کارت · برنامه ضیافت
                              </span>
                            </div>

                            <div className="w-full space-y-1 text-[8px] px-0.5">
                              <div
                                className="flex justify-between border-b border-dotted pb-0.5"
                                style={{ borderColor: `${tpl.palette.foilHex}65` }}
                              >
                                <span className={inkText}>پذیرایی خوش‌آمدگویی</span>
                                <span className={`tabular-nums font-bold ${foilText}`}>
                                  ۱۹:۳۰
                                </span>
                              </div>
                              <div
                                className="flex justify-between border-b border-dotted pb-0.5"
                                style={{ borderColor: `${tpl.palette.foilHex}65` }}
                              >
                                <span className={inkText}>آیین رسمی پیوند</span>
                                <span className={`tabular-nums font-bold ${foilText}`}>
                                  ۲۰:۳۰
                                </span>
                              </div>
                              <div
                                className="flex justify-between border-b border-dotted pb-0.5"
                                style={{ borderColor: `${tpl.palette.foilHex}65` }}
                              >
                                <span className={inkText}>ضیافت شام سلطنتی</span>
                                <span className={`tabular-nums font-bold ${foilText}`}>
                                  ۲۲:۰۰
                                </span>
                              </div>
                            </div>

                            <p
                              className={`text-[7.5px] font-semibold pb-0.5 leading-tight max-w-[130px] ${inkText}`}
                              style={{ color: tpl.palette.textMuted }}
                            >
                              {tpl.venueFa}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clean Unboxed Metadata & Primary Action */}
                  <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      {/* Unboxed Metadata with Middot Separators */}
                      <div className="flex items-center gap-1.5 text-xs text-[#78716C] mb-1.5">
                        <span>{COLLECTION_METADATA[tpl.collectionId].nameFa}</span>
                        <span aria-hidden="true">·</span>
                        <span>{ANIMATION_NAMES_FA[tpl.animationType]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">کد {tpl.id.slice(-3)}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#1C1917] mb-1">
                        {language === 'fa' ? tpl.titleFa : tpl.titleEn}
                      </h3>

                      <p className="text-xs text-[#57534E]">
                        {tpl.palette.nameFa} · {tpl.tierLabelFa}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
                      <span className="text-xs text-[#57534E]">
                        طراحی دورو (پشت و رو هماهنگ)
                      </span>

                      <button
                        type="button"
                        onClick={() => onSelectTemplate(tpl)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#9A7432] text-white'
                            : 'bg-[#1C1917] text-[#F7F4EF] hover:bg-[#332E2A]'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>
                          {isSelected ? 'در حال نمایش در استودیو' : 'باز کردن و شخصی‌سازی'}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Controls */}
          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 18)}
                className="px-6 py-3 rounded-xl bg-white border border-[#D6CEBF] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                نمایش قالب‌های بیشتر ({filtered.length - visibleCount} قالب دیگر باقی مانده)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
