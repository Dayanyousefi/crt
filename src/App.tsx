import React, { useState } from 'react';
import {
  InvitationTemplate,
  RsvpEntry,
  buildUnified250Templates,
} from './utils/templateAdapter';
import { LuxuryCardStage } from './components/LuxuryCardStage';
import { CustomizationBar } from './components/CustomizationBar';
import { TemplateMarketplace } from './components/TemplateMarketplace';
import { GitHubBridgePanel } from './components/GitHubBridgePanel';

const INITIAL_RSVP_LIST: RsvpEntry[] = [
  {
    id: 'rsvp-1',
    guestName: 'دکتر کوروش فرهادی و بانو',
    attending: 'yes',
    guestCount: 2,
    dietaryPreference: 'پذیرایی کامل شام',
    message: 'با آرزوی خوشبختی و پیوند ابدی برای شما عزیزان',
    createdAt: '2026-05-01',
  },
  {
    id: 'rsvp-2',
    guestName: 'مهندس نیلوفر رادمنش',
    attending: 'yes',
    guestCount: 3,
    dietaryPreference: 'پذیرایی کامل شام',
    message: 'بی‌صبرانه منتظر دیدار شما در این شب باشکوه هستیم',
    createdAt: '2026-05-02',
  },
];

export default function App() {
  const [templates, setTemplates] = useState<InvitationTemplate[]>(() =>
    buildUnified250Templates()
  );
  const [activeTemplate, setActiveTemplate] = useState<InvitationTemplate>(
    () => buildUnified250Templates()[0]
  );
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');
  const [rsvpList, setRsvpList] = useState<RsvpEntry[]>(INITIAL_RSVP_LIST);

  const handleSelectTemplate = (tpl: InvitationTemplate) => {
    setActiveTemplate(tpl);
    const studioEl = document.getElementById('studio-section');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateActiveTemplate = (updated: InvitationTemplate) => {
    setActiveTemplate(updated);
    setTemplates((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleAddRsvp = (entry: Omit<RsvpEntry, 'id' | 'createdAt'>) => {
    const newEntry: RsvpEntry = {
      ...entry,
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setRsvpList((prev) => [newEntry, ...prev]);
  };

  const handleImportCustomTemplates = (newOnes: InvitationTemplate[]) => {
    setTemplates((prev) => [...newOnes, ...prev]);
    if (newOnes.length > 0) {
      setActiveTemplate(newOnes[0]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EF] text-[#1C1917]">
      {/* Top Bar Contract: Strictly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-12 py-4 bg-[#F7F4EF]/95 backdrop-blur-xs border-b border-[#E5DEC9]">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#studio-section"
          className="font-display-luxury text-2xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0"
        >
          Maison D&apos;Or
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]">
          <a
            href="#studio-section"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            استودیو سه‌بعدی
          </a>
          <a
            href="#marketplace-section"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            ویترین ۲۵۰ قالب
          </a>
          <a
            href="#craftsmanship-section"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            اصالت متریال
          </a>
          <a
            href="#github-bridge-section"
            className="hover:text-[#1C1917] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            آداپتور گیت‌هاب
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <a
            href="#marketplace-section"
            className="px-4 py-2 text-xs font-semibold text-[#F7F4EF] bg-[#1C1917] rounded-lg hover:bg-[#332E2A] transition-colors whitespace-nowrap shrink-0"
          >
            انتخاب از ۲۵۰ قالب
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 lg:px-12">
        {/* SECTION 1: Hero Introduction + Live 3D Envelope & Card Studio */}
        <section id="studio-section" className="pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <p className="text-xs font-medium text-[#8C6D3F] mb-3">
                معماری کارت‌های دعوت لوکس در تراز Paperless Post و Greenvelope
              </p>
              <h1
                className="font-display-luxury text-3xl sm:text-5xl font-bold text-[#1C1917] leading-tight mb-4"
                style={{ textWrap: 'balance' }}
              >
                کارت دعوت دیجیتال با بافت کاغذ کتان، طلاکوب برجسته و پاکت سه‌بعدی
              </h1>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed max-w-2xl mb-6">
                تمام ۲۵۰ قالب از ۶ مجموعه (عروسی سلطنتی، نگارگری ایرانی، نامزدی، تولد، گالا شرکتی و سالگرد) از طریق موتور Adapter یکپارچه به این استودیو متصل شده‌اند. همین الان پاکت را ببندید، مهر مومی را لمس کنید یا متن و برش کارت را تغییر دهید.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#57534E]">
                <span>۲۵۰ قالب با اسلاگ و شناسه یکتا</span>
                <span aria-hidden="true">·</span>
                <span>۵ انیمیشن سینمایی با Fallback هوشمند</span>
                <span aria-hidden="true">·</span>
                <span>پشتیبانی دوزبانه فارسی و انگلیسی</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[240px] rounded-2xl overflow-hidden border border-[#E5DEC9] bg-[#EAE2D3]">
                <img
                  src="/src/assets/images/luxury_stationery_hero_1794128512443.jpg"
                  alt="مجموعه کارت دعوت لوکس با پاکت مخمل زرشکی، مهر مومی طلایی و کاغذ کتان دست‌ساز"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-5 text-[#FAF7F2]">
                  <span className="text-xs text-[#E5C168]">
                    استاندارد متریال ۶۰۰ گرم کتان و ورق طلا
                  </span>
                  <p className="font-display-luxury text-xl font-semibold mt-0.5">
                    جزئیات ملموس پاکت، آستر ابریشمی و مهر مومی دست‌ساز
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Customization Controls */}
          <CustomizationBar
            template={activeTemplate}
            language={language}
            onLanguageChange={setLanguage}
            onUpdateTemplate={handleUpdateActiveTemplate}
          />

          {/* Interactive 3D Envelope & Cardstock Stage + Live Guest RSVP */}
          <LuxuryCardStage
            template={activeTemplate}
            language={language}
            rsvpList={rsvpList}
            onAddRsvp={handleAddRsvp}
          />
        </section>

        {/* SECTION 2: Unified 250-Template Marketplace */}
        <TemplateMarketplace
          templates={templates}
          selectedTemplateId={activeTemplate.id}
          language={language}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* SECTION 3: Tactile Craftsmanship Proof + GitHub / ChatGPT 250-Template Adapter Bridge */}
        <section
          id="craftsmanship-section"
          className="py-12 border-t border-[#E5DEC9]"
        >
          <div className="mb-8">
            <p className="text-xs font-medium text-[#8C6D3F] mb-2">
              تفاوت کارت‌های حرفه‌ای با باکس‌های ساده وب
            </p>
            <h2 className="font-display-luxury text-3xl font-bold text-[#1C1917]">
              جزئیات بصری و مهندسی متریال در هر ۲۵۰ قالب
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col">
              <div className="h-64 bg-[#EAE2D3] overflow-hidden">
                <img
                  src="/src/assets/images/wax_seal_craftsmanship_1794128514877.jpg"
                  alt="نمای نزدیک مهر مومی طلایی برجسته روی پاکت کتان سبز زیتونی"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1C1917] mb-2">
                  ۰۱. مهر مومی سه‌بعدی، روبان ابریشمی و پاکت بافت‌دار
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  هر قالب دارای سناریوی بازگشایی اختصاصی (مهر مومی، روبان ابریشم، جعبه مخمل یا دفترچه دوبرگه) است و اگر قالبی در فایل ZIP انیمیشن ناشناخته داشته باشد، به صورت خودکار به پاکت و مهر مومی سلطنتی متصل می‌شود.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-[#E5DEC9] overflow-hidden flex flex-col">
              <div className="h-64 bg-[#132B47] overflow-hidden">
                <img
                  src="/src/assets/images/persian_gold_calligraphy_card_1794128516448.jpg"
                  alt="کارت دعوت طاقی سرمه‌ای با قاب اسلیمی طلاکوب برجسته"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#1C1917] mb-2">
                  ۰۲. برش‌های طاقی (Arch) و قاب‌های طلاکوب وکتوری
                </h3>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  به جای مستطیل‌های ساده و یکنواخت، کارت‌ها با ۵ فرم برش مقوا (طاقی، گوشه‌پخ جواهری، موج‌دار، کلاسیک و دفترچه‌ای) و ۶ سبک قاب SVG طلاکوب، رزگلد و نقره‌کوب رندر می‌شوند.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub & ChatGPT ZIP Adapter Bridge */}
        <GitHubBridgePanel
          templates={templates}
          onImportCustomTemplates={handleImportCustomTemplates}
        />
      </main>

      {/* Quiet Footer */}
      <footer className="mt-16 border-t border-[#E5DEC9] bg-white py-8 px-6 lg:px-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <span className="font-display-luxury text-base font-bold text-[#1C1917]">
            Maison D&apos;Or — Couture Digital Stationery
          </span>
          <span>
            موتور یکپارچه ۲۵۰ قالب دعوت‌نامه دیجیتال · آماده اتصال به شاخه feat/250-template-library-integration
          </span>
        </div>
      </footer>
    </div>
  );
}
