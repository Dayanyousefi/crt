import React from 'react';
import {
  AnimationChoreography,
  CardCutShape,
  FoilFinish,
  InvitationTemplate,
  LUXURY_PALETTES,
  OrnamentStyle,
} from '../utils/templateAdapter';

interface CustomizationBarProps {
  template: InvitationTemplate;
  language: 'fa' | 'en';
  onLanguageChange: (lang: 'fa' | 'en') => void;
  onUpdateTemplate: (updated: InvitationTemplate) => void;
}

export const CustomizationBar: React.FC<CustomizationBarProps> = ({
  template,
  language,
  onLanguageChange,
  onUpdateTemplate,
}) => {
  return (
    <div className="rounded-2xl bg-white border border-[#E5DEC9] p-6 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-[#EFEAE0]">
        <div>
          <h3 className="text-base font-bold text-[#1C1917]">
            میز کار شخصی‌سازی زنده (متن، متریال، طلاکوب و انیمیشن)
          </h3>
          <p className="text-xs text-[#78716C] mt-0.5">
            هر تغییری بلافاصله روی کارت سه‌بعدی و پاکت دعوت‌نامه اعمال می‌شود
          </p>
        </div>

        {/* Bilingual Switcher inside Workspace Toolbar (not in Top Bar) */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F0E6]">
          <button
            type="button"
            onClick={() => onLanguageChange('fa')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              language === 'fa'
                ? 'bg-[#1C1917] text-[#F7F4EF]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            چیدمان فارسی
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              language === 'en'
                ? 'bg-[#1C1917] text-[#F7F4EF]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            English Editorial
          </button>
        </div>
      </div>

      {/* Text & Event Customization Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div>
          <label
            htmlFor="studio-host-names"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            نام میزبانان / عروس و داماد
          </label>
          <input
            id="studio-host-names"
            type="text"
            value={language === 'fa' ? template.hostNamesFa : template.hostNamesEn}
            onChange={(e) =>
              onUpdateTemplate(
                language === 'fa'
                  ? { ...template, hostNamesFa: e.target.value }
                  : { ...template, hostNamesEn: e.target.value }
              )
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          />
        </div>

        <div>
          <label
            htmlFor="studio-event-date"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            تاریخ برگزاری مراسم
          </label>
          <input
            id="studio-event-date"
            type="text"
            value={language === 'fa' ? template.eventDateFa : template.eventDateEn}
            onChange={(e) =>
              onUpdateTemplate(
                language === 'fa'
                  ? { ...template, eventDateFa: e.target.value }
                  : { ...template, eventDateEn: e.target.value }
              )
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          />
        </div>

        <div>
          <label
            htmlFor="studio-venue"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            نام عمارت / تالار پذیرایی
          </label>
          <input
            id="studio-venue"
            type="text"
            value={language === 'fa' ? template.venueFa : template.venueEn}
            onChange={(e) =>
              onUpdateTemplate(
                language === 'fa'
                  ? { ...template, venueFa: e.target.value }
                  : { ...template, venueEn: e.target.value }
              )
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          />
        </div>

        <div>
          <label
            htmlFor="studio-monogram"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            حروف روی مهر مومی (Monogram)
          </label>
          <input
            id="studio-monogram"
            dir="ltr"
            type="text"
            maxLength={6}
            value={template.waxSealMonogram}
            onChange={(e) =>
              onUpdateTemplate({ ...template, waxSealMonogram: e.target.value })
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917] font-display-luxury text-center"
          />
        </div>
      </div>

      {/* Tactile Material, Cut Shape, Foil & Animation Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#EFEAE0]">
        <div>
          <label
            htmlFor="studio-palette-select"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            پالت رنگ کاغذ کتان و پاکت
          </label>
          <select
            id="studio-palette-select"
            value={template.palette.nameEn}
            onChange={(e) => {
              const found = LUXURY_PALETTES.find((p) => p.nameEn === e.target.value);
              if (found) {
                onUpdateTemplate({ ...template, palette: found });
              }
            }}
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          >
            {LUXURY_PALETTES.map((pal) => (
              <option key={pal.nameEn} value={pal.nameEn}>
                {pal.nameFa}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="studio-shape-select"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            قالب برش لبه مقوا (Die-Cut)
          </label>
          <select
            id="studio-shape-select"
            value={template.cardShape}
            onChange={(e) =>
              onUpdateTemplate({
                ...template,
                cardShape: e.target.value as CardCutShape,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          >
            <option value="arch">برش طاقی سلطنتی (Arch)</option>
            <option value="classic-frame">مستطیل کلاسیک ورسای</option>
            <option value="chamfered">برش گوشه‌پخ جواهری (Chamfered)</option>
            <option value="scalloped">لبه‌موج‌دار آتلیه‌ای (Scalloped)</option>
            <option value="imperial-booklet">فرم دفترچه‌ای دوبرگه</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="studio-ornament-select"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            طرح قاب طلاکوب و تذهیب
          </label>
          <select
            id="studio-ornament-select"
            value={template.ornamentStyle}
            onChange={(e) =>
              onUpdateTemplate({
                ...template,
                ornamentStyle: e.target.value as OrnamentStyle,
              })
            }
            className="w-full px-3 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
          >
            <option value="persian-arabesque">اسلیمی و شمسه صفوی</option>
            <option value="botanical-olive">شاخه زیتون مدیترانه‌ای</option>
            <option value="art-deco-geometric">هندسی آرت‌دکو گتسبی</option>
            <option value="baroque-crest">تاج کلاسیک ورسای</option>
            <option value="celestial-arch">طاق آینه‌کاری قاجار</option>
            <option value="minimal-atelier">مینیمال آتلیه پاریس</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="studio-anim-select"
            className="block text-xs font-medium text-[#44403C] mb-1.5"
          >
            نوع انیمیشن بازگشایی و ورق طلا
          </label>
          <div className="flex gap-2">
            <select
              id="studio-anim-select"
              value={template.animationType}
              onChange={(e) =>
                onUpdateTemplate({
                  ...template,
                  animationType: e.target.value as AnimationChoreography,
                })
              }
              className="flex-1 px-2.5 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
            >
              <option value="wax-seal">پاکت و مهر مومی</option>
              <option value="silk-ribbon">روبان ابریشمی</option>
              <option value="luxury-box">جعبه مخمل</option>
              <option value="booklet">دفترچه دوبرگه</option>
              <option value="editorial-reveal">بازگشایی سینمایی</option>
            </select>

            <select
              aria-label="رنگ ورق طلاکوب"
              value={template.foilFinish}
              onChange={(e) =>
                onUpdateTemplate({
                  ...template,
                  foilFinish: e.target.value as FoilFinish,
                })
              }
              className="w-28 px-2.5 py-2 text-xs rounded-lg border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917]"
            >
              <option value="gold">طلاکوب ۲۴ عیار</option>
              <option value="rose-gold">رزگلد ونیزی</option>
              <option value="silver">نقره‌کوب</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
