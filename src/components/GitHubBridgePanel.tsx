import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  FileJson,
  GitBranch,
  Layers,
  Upload,
} from 'lucide-react';
import {
  InvitationTemplate,
  adaptRawTemplateToCanonical,
  validateTemplateLibrary,
} from '../utils/templateAdapter';

interface GitHubBridgePanelProps {
  templates: InvitationTemplate[];
  onImportCustomTemplates: (newTemplates: InvitationTemplate[]) => void;
}

export const GitHubBridgePanel: React.FC<GitHubBridgePanelProps> = ({
  templates,
  onImportCustomTemplates,
}) => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [importStatus, setImportStatus] = useState<string>('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const report = validateTemplateLibrary(templates);

  const handleImportJson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jsonInput.trim()) {
      setImportStatus('لطفاً آرایه یا آبجکت JSON قالب‌های ChatGPT را وارد کنید.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const rawList: Record<string, unknown>[] = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.templates)
        ? parsed.templates
        : [parsed];

      const adapted = rawList.map((item, idx) =>
        adaptRawTemplateToCanonical(item, templates.length + idx)
      );
      onImportCustomTemplates(adapted);
      setImportStatus(
        `${adapted.length} قالب جدید با موفقیت از طریق Adapter به Schema اصلی تبدیل و به ویترین اضافه شد.`
      );
      setJsonInput('');
    } catch {
      setImportStatus('ساختار JSON معتبر نیست. لطفاً یک JSON استاندارد وارد کنید.');
    }
  };

  const loadSampleChatGptBatch = () => {
    const sample = JSON.stringify(
      [
        {
          id: 'chatgpt-zip-royal-251',
          slug: 'chatgpt-zip-qajar-emerald-251',
          name_fa: 'قالب اختصاصی ZIP — تذهیب زمردی کاخ نیاوران',
          name_en: 'Niavaran Emerald Illumination Suite',
          category: 'سنتی ایرانی',
          openingType: 'wax-seal',
          shape: 'arch',
          hostNamesFa: 'مهربانو و کیارش',
          hostNamesEn: 'Mehrbanou & Kiarash',
        },
      ],
      null,
      2
    );
    setJsonInput(sample);
    setImportStatus('');
  };

  const gitHubPromptForChatGpt = `بر روی شاخه feat/250-template-library-integration دقیقاً این معماری ۴ مرحله‌ای که تایید شد را اجرا و کامیت کن:
1. فایل src/utils/templateAdapter.ts را به عنوان تنها منبع حقیقت (Single Source of Truth) قرار بده تا هر ۶ مجموعه داخل فایل ZIP با تابع adaptRawTemplateToCanonical به Schema واحد تبدیل شوند.
2. در کامپوننت کارت‌ها، به جای باکس ساده CSS از لایه بافت کاغذ کتان (paper-grain-surface)، طلاکوب متالیک (foil-gold-text)، برش‌های طاقی و گوشه‌پخ (shape-arch / shape-chamfered) و قاب‌های SVG استفاده کن.
3. انیمیشن‌های پاکت سه‌بعدی، مهر مومی برجسته، روبان ابریشمی، جعبه مخمل و دفترچه دوبرگه را با Fallback امن به پاکت و مهر مومی وصل کن.
4. تست اعتبارسنجی ۲۵۰ شناسه و اسلاگ یکتا (validateTemplateLibrary) و npm run build را اجرا کن و خروجی واقعی را گزارش بده.`;

  const copyPromptToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(gitHubPromptForChatGpt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  return (
    <section
      id="github-bridge-section"
      className="py-12 border-t border-[#E5DEC9]"
    >
      <div className="mb-8">
        <p className="text-xs font-medium text-[#8C6D3F] mb-2">
          پل ارتباطی مستقیم با شاخه feat/250-template-library-integration
        </p>
        <h2 className="font-display-luxury text-3xl font-bold text-[#1C1917]">
          موتور آداپتور و اعتبارسنجی ۲۵۰ قالب گیت‌هاب و ChatGPT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Live Schema Validation Report (Phase 1 & Phase 4 Proof) */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E5DEC9] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#9A7432]" />
              <div>
                <h3 className="text-base font-bold text-[#1C1917]">
                  گزارش زنده اعتبارسنجی کتابخانه (Schema &amp; Slug Audit)
                </h3>
                <p className="text-xs text-[#78716C]">
                  بررسی خودکار یکتا بودن شناسه‌ها، اسلاگ‌ها و انیمیشن‌ها
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-800">
              {report.isValid ? '۱۰۰٪ تاییدشده' : 'نیازمند بررسی'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D3]">
              <div className="text-2xl font-bold font-mono-tabular text-[#1C1917]">
                {report.totalCount}
              </div>
              <div className="text-xs text-[#78716C] mt-1">کل قالب‌های فعال</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D3]">
              <div className="text-2xl font-bold font-mono-tabular text-[#1C1917]">
                {report.uniqueIdsCount}
              </div>
              <div className="text-xs text-[#78716C] mt-1">شناسه (ID) یکتا</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D3]">
              <div className="text-2xl font-bold font-mono-tabular text-[#1C1917]">
                {report.uniqueSlugsCount}
              </div>
              <div className="text-xs text-[#78716C] mt-1">اسلاگ (Slug) یکتا</div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <p className="font-semibold text-[#1C1917]">
              تفکیک ۶ مجموعه متصل‌شده در Adapter:
            </p>
            <div className="grid grid-cols-2 gap-2 tabular-nums text-[#44403C]">
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۱. عروسی سلطنتی:</span>
                <span>{report.collectionsBreakdown['wedding-royal']} قالب</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۲. نگارگری ایرانی:</span>
                <span>{report.collectionsBreakdown['persian-heritage']} قالب</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۳. نامزدی و عقد:</span>
                <span>{report.collectionsBreakdown['engagement-botanical']} قالب</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۴. تولد اختصاصی:</span>
                <span>{report.collectionsBreakdown['birthday-editorial']} قالب</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۵. گالا و شرکتی:</span>
                <span>{report.collectionsBreakdown['corporate-gala']} قالب</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#FAF7F2]">
                <span>۶. سالگرد و مهمانی:</span>
                <span>{report.collectionsBreakdown['special-soiree']} قالب</span>
              </div>
            </div>
          </div>

          {/* Copyable Instruction for ChatGPT Branch */}
          <div className="pt-4 border-t border-[#EFEAE0]">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C1917]">
                <GitBranch className="w-3.5 h-3.5 text-[#9A7432]" />
                <span>دستور هماهنگ‌سازی شاخه گیت‌هاب برای ChatGPT</span>
              </span>
              <button
                type="button"
                onClick={copyPromptToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1917] text-[#F7F4EF] text-xs font-medium hover:bg-[#332E2A] transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedPrompt ? 'کپی شد' : 'کپی دستور گیت‌هاب'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5DEC9] text-[11px] text-[#44403C] whitespace-pre-wrap leading-relaxed font-sans-luxury">
              {gitHubPromptForChatGpt}
            </pre>
          </div>
        </div>

        {/* Right: Live JSON Adapter Importer for ChatGPT ZIP Templates */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E5DEC9] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <FileJson className="w-5 h-5 text-[#9A7432]" />
                <div>
                  <h3 className="text-base font-bold text-[#1C1917]">
                    تزریق مستقیم JSON قالب‌های ChatGPT به موتور لوکس
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    هر فایل JSON از داخل ZIP را اینجا قرار دهید تا خودکار استانداردسازی و رندر شود
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={loadSampleChatGptBatch}
                className="px-3 py-1.5 rounded-lg border border-[#D6CEBF] text-xs font-medium text-[#1C1917] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
              >
                بارگذاری نمونه JSON
              </button>
            </div>

            <form onSubmit={handleImportJson} className="space-y-4">
              <div>
                <label
                  htmlFor="chatgpt-json-input"
                  className="block text-xs font-medium text-[#292524] mb-1.5"
                >
                  کد JSON قالب یا آرایه قالب‌ها:
                </label>
                <textarea
                  id="chatgpt-json-input"
                  dir="ltr"
                  rows={8}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"name_fa": "کارت عروسی طلاکوب", "category": "persian", "openingType": "wax-seal"}]'
                  className="w-full p-3 text-xs font-mono-tabular rounded-xl border border-[#D6CEBF] bg-[#FCFBF9] text-[#1C1917] focus:outline-none focus:border-[#9A7432]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1C1917] text-[#F7F4EF] text-xs font-semibold hover:bg-[#332E2A] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#D4AF37]" />
                <span>تبدیل با Adapter و افزودن به ویترین زنده</span>
              </button>

              {importStatus && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FAF7F2] border border-[#D6CEBF] text-xs text-[#1C1917]">
                  <CheckCircle2 className="w-4 h-4 text-[#9A7432] shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}
            </form>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#E7E0D3] text-xs text-[#57534E] leading-relaxed">
            <strong className="text-[#1C1917] block mb-1">
              چرا این Adapter جلوی خراب شدن کارت‌ها را می‌گیرد؟
            </strong>
            حتی اگر در فایل ZIP فیلدهایی مثل کد رنگ، نوع برش کارت، یا نام انیمیشن خالی یا متفاوت باشند، تابع{' '}
            <code className="font-mono-tabular text-[#9A7432]">
              adaptRawTemplateToCanonical
            </code>{' '}
            به صورت خودکار پالت کاغذ کتان، طلاکوب و انیمیشن جایگزین (Fallback) را به آن اختصاص می‌دهد تا هیچ کارتی هنگام باز شدن سفید نشود.
          </div>
        </div>
      </div>
    </section>
  );
};
