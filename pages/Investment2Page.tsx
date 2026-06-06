import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Database,
  LineChart,
  PhoneCall,
  ShieldCheck,
  Target,
  UserRoundCheck,
  Users,
} from 'lucide-react';
import { FlowRail } from '../components/InvestmentV3/FlowRail';
import { SectionBridge } from '../components/InvestmentV3/SectionBridge';
import { StatsRow } from '../components/InvestmentV3/dashboard/StatsRow';
import { PartnersMarqueeSection } from '../components/InvestmentV3/PartnersMarqueeSection';
import { OpportunitySourcesSection } from '../components/InvestmentV3/OpportunitySourcesSection';
import { UseCasesSection } from '../components/InvestmentV3/UseCasesSection';
import { GrowthCalculatorSection } from '../components/InvestmentV3/GrowthCalculatorSection';
import { MonafsatNetworkSection } from '../components/InvestmentV3/MonafsatNetworkSection';
import { GrowthTriangleSection } from '../components/InvestmentV3/GrowthTriangleSection';
import { WorkStagesSection } from '../components/InvestmentV3/WorkStagesSection';
import { SmartDashboardSection } from '../components/InvestmentV3/SmartDashboardSection';
import { HumanTeamSection } from '../components/InvestmentV3/HumanTeamSection';
import { DeliverablesSection } from '../components/InvestmentV3/DeliverablesSection';
import { AssetsSection } from '../components/InvestmentV3/AssetsSection';
import { FutureSection } from '../components/InvestmentV3/FutureSection';
import { SmartPortfolioSection } from '../components/InvestmentV3/SmartPortfolioSection';
import { cn } from '../lib/utils';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const SectionHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-14"
  >
    {eyebrow && (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-black">{eyebrow}</span>
      </div>
    )}
    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto">
      {title}
    </h2>
    {description && (
      <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mt-5">
        {description}
      </p>
    )}
  </motion.div>
);

const HeroSection2 = () => (
  <section className="relative min-h-[92vh] bg-[#050505] overflow-hidden flex items-center py-24 border-b border-slate-900/70">
    <div className="absolute inset-0 opacity-25">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415533_1px,transparent_1px),linear-gradient(to_bottom,#33415533_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_20%,#000_60%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-10 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
    </div>

    <div className="container mx-auto px-4 max-w-6xl relative z-10">
      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 text-right">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 mb-7"
          >
            <Target className="w-4 h-4" />
            <span className="text-xs font-black">Investment 2 | اختبار A/B</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight max-w-5xl"
          >
            اتفق معنا على مستهدف مبيعات خلال 90 يوم...
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-cyan-300 to-white mt-3">
              ونبني لك طريق الوصول إليه
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-slate-300 leading-relaxed mt-7 max-w-4xl"
          >
            نحدد معك القطاع، صناع القرار، متوسط قيمة الصفقة، وحجم الوصول المطلوب. ثم نشغل فريقك الحالي مع وكلاء النينجا وفريق منافسات الموازي لتحويل السوق إلى محادثات، اجتماعات، عروض، وصفقات.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-9"
          >
            <button
              onClick={() => scrollToSection('growth-calculator')}
              className="px-7 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition-colors shadow-[0_0_30px_rgba(52,211,153,0.22)]"
            >
              احسب مستهدفك خلال 90 يوم
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="px-7 py-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-white font-black hover:border-cyan-500/50 hover:text-cyan-200 transition-colors"
            >
              ابدأ بتجربة قطاع واحد
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 bg-slate-950/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md"
        >
          <div className="text-sm font-black text-slate-300 mb-6 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-emerald-300" />
            طريق 90 يوم المختصر
          </div>
          {[
            ['نحدد الهدف', 'المنتج، القطاع، قيمة الصفقة، وعدد الصفقات المطلوبة'],
            ['نستخرج السوق الأنسب', 'أفضل الحسابات وصناع القرار بدل استهداف الجميع'],
            ['نشغل 3 محركات', 'فريقك، وكلاء النينجا، وكادر منافسات الموازي'],
            ['نقيس القمع أسبوعيًا', 'محادثات ← اجتماعات ← عروض ← تفاوض ← صفقات'],
          ].map(([title, text], idx) => (
            <div key={title} className="flex gap-4 pb-5 last:pb-0">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black text-sm">
                  {idx + 1}
                </div>
                {idx < 3 && <div className="w-px flex-1 bg-slate-800 mt-2" />}
              </div>
              <div>
                <h3 className="text-white font-black mb-1">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

const EnginesSection = () => {
  const engines = [
    {
      title: 'كادر تطوير المبيعات',
      text: 'يدرب، يتابع، يحلل، ويطور أداء فريقك أسبوعيًا عبر الرسائل، المكالمات، الاعتراضات، وتقارير الأداء.',
      icon: Users,
      color: 'emerald',
    },
    {
      title: 'وكلاء النينجا الذكيين',
      text: 'يحللون السوق، يجهزون البيانات، يحددون القنوات، يثرون معلومات صناع القرار، ويشغلون المتابعة.',
      icon: Bot,
      color: 'cyan',
    },
    {
      title: 'كادر منافسات الموازي',
      text: 'يفتح فرصًا مباشرة من نفس القطاع بمدخل مختلف لصالح فريقك، لزيادة سرعة الوصول والردود.',
      icon: BriefcaseBusiness,
      color: 'violet',
    },
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-slate-900/60">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="المعادلة البسيطة"
          title="3 محركات تعمل على نفس مستهدفك البيعي"
          description="لا نعتمد على قناة واحدة أو أداة واحدة. نربط بين تطوير فريقك، وكلاء ذكاء اصطناعي، وكادر منافسات الموازي لتوليد فرص وتحويلها إلى مبيعات قابلة للقياس."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {engines.map((engine, idx) => (
            <motion.div
              key={engine.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="bg-slate-950/55 border border-slate-800/80 rounded-3xl p-7 text-right hover:border-emerald-500/30 transition-colors"
            >
              <div
                className={cn(
                  'w-13 h-13 rounded-2xl border flex items-center justify-center mb-6',
                  engine.color === 'emerald' && 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300',
                  engine.color === 'cyan' && 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300',
                  engine.color === 'violet' && 'bg-violet-500/10 border-violet-500/25 text-violet-300'
                )}
              >
                <engine.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-3">{engine.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{engine.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const OneSalespersonSection = () => (
  <section className="py-24 bg-[#080808] border-t border-slate-900/60">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-5 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8"
        >
          <UserRoundCheck className="w-12 h-12 text-emerald-300 mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
            حتى لو لديك موظف مبيعات واحد فقط
          </h2>
          <p className="text-slate-300 leading-relaxed">
            لا تحتاج فريقًا كبيرًا لتبدأ. نساعدك على تحويل موظف واحد قابل للتطوير إلى قناة مبيعات منظمة، مزودة بالبيانات، الرسائل، القنوات، والمتابعة.
          </p>
        </motion.div>
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {[
            'قائمة يومية بحسابات وصناع قرار مناسبين',
            'رسائل وقنوات تواصل جاهزة حسب القطاع',
            'نظام متابعة يوضح الخطوة التالية لكل فرصة',
            'مراجعة أسبوعية لتحسين الأداء بدل الاجتهاد الفردي',
          ].map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-300 mt-1 shrink-0" />
              <span className="text-slate-200 font-bold text-sm leading-relaxed">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TargetFirstSection = () => {
  const items = ['المنتج أو الخدمة', 'القطاع المستهدف', 'صناع القرار', 'متوسط قيمة الصفقة', 'المستهدف البيعي', 'عدد الصفقات المطلوبة', 'حجم الوصول اللازم'];

  return (
    <section className="py-24 bg-[#050505] border-t border-slate-900/60">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="نبدأ من الهدف وليس الأدوات"
          title="اتفق معنا على مستهدف مبيعات خلال 90 يوم... ونبني لك طريق الوصول إليه"
          description="قبل أن نتحدث عن قواعد البيانات أو الوكلاء أو القنوات، نحدد المطلوب تجاريًا ثم نترجم الهدف إلى قمع مبيعات قابل للتشغيل."
        />
        <div className="grid md:grid-cols-7 gap-3">
          {items.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-center min-h-[92px] flex flex-col justify-center"
            >
              <span className="text-emerald-300 font-black text-sm mb-2">{idx + 1}</span>
              <span className="text-white font-black text-xs leading-relaxed">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FocusedTargetingSection = () => (
  <section className="py-24 bg-[#080808] border-t border-slate-900/60">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6">
          <SectionHeader
            eyebrow="استهداف أدق"
            title="لا نستهدف الجميع... نستخرج الأقرب للشراء"
            description="لو منتجك يناسب شريحة محددة فقط، لا نضيع وقت فريقك على آلاف غير مناسبين. نحلل السوق ونستخرج أفضل الحسابات وصناع القرار حسب القطاع، المنطقة، حجم الشركة، الاحتياج، واحتمالية الاستجابة."
          />
        </div>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-6 bg-slate-950/75 border border-slate-800 rounded-3xl p-7"
        >
          <div className="grid gap-4">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="text-red-300 font-black text-sm mb-2">بدون فلترة</div>
              <div className="text-4xl font-black text-white font-sans">300,000</div>
              <div className="text-xs text-slate-500 font-bold mt-1">جهة عامة يصعب تشغيلها بذكاء</div>
            </div>
            <ArrowLeft className="w-7 h-7 text-emerald-300 mx-auto -rotate-90 lg:rotate-0" />
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="text-emerald-300 font-black text-sm mb-2">بعد تحليل الملاءمة</div>
              <div className="text-4xl font-black text-white font-sans">800 - 2,000</div>
              <div className="text-xs text-slate-400 font-bold mt-1">حساب مناسب يمكن تحويله إلى محادثات واجتماعات</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const DailySalesSystemSection = () => {
  const fields = [
    ['اسم الشركة', Database],
    ['اسم صانع القرار', UserRoundCheck],
    ['المنصب', BriefcaseBusiness],
    ['رقم الهاتف', PhoneCall],
    ['البريد', ClipboardList],
    ['LinkedIn', Users],
    ['نبذة مختصرة', ClipboardList],
    ['درجة ملاءمة العميل', Target],
    ['أفضل قناة تواصل', BarChart3],
    ['رسالة مقترحة', ClipboardList],
    ['حالة المتابعة', CalendarCheck],
    ['الخطوة التالية', ArrowLeft],
  ];

  return (
    <section className="py-24 bg-[#050505] border-t border-slate-900/60">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="مخرجات ملموسة"
          title="ماذا يستلم فريق المبيعات لديك يوميًا؟"
          description="بدل كلمة منظومة بشكل عام، يرى موظفك قائمة تشغيل واضحة: من يتواصل معه، لماذا هو مناسب، ما الرسالة المقترحة، وما الخطوة التالية."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fields.map(([field, Icon], idx) => (
            <motion.div
              key={field as string}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.025 }}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3"
            >
              <Icon className="w-5 h-5 text-cyan-300 shrink-0" />
              <span className="text-sm font-black text-slate-200">{field as string}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WeeklyReviewSection = () => {
  const metrics = ['الجهات المستهدفة', 'الرسائل المرسلة', 'المكالمات', 'الردود', 'المهتمون', 'الاجتماعات المحجوزة', 'الاجتماعات المؤهلة', 'عروض السعر', 'التفاوض', 'الصفقات', 'نقاط التعطل', 'خطة الأسبوع القادم'];

  return (
    <section className="py-24 bg-[#080808] border-t border-slate-900/60">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="تشغيل منضبط"
          title="كل أسبوع نراجع: هل اقتربنا من المستهدف؟"
          description="نتعامل مع المبيعات مثل التشخيص. نقيس حركة المبيعات من أول الاستهداف حتى التفاوض، ونحدد أين يتوقف الفريق، وما الذي يجب تحسينه في الأسبوع التالي."
        />
        <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 md:p-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((metric, idx) => (
              <div key={metric} className="rounded-xl bg-black/35 border border-slate-900 px-4 py-3 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-black">
                  {idx + 1}
                </span>
                <span className="text-xs font-black text-slate-300">{metric}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TrustStatsIntro = () => (
  <section className="py-20 bg-[#050505] border-t border-slate-900/60">
    <div className="container mx-auto px-4 max-w-6xl">
      <SectionHeader
        eyebrow="أرقام الثقة"
        title="منظومة مجربة داخل السوق السعودي"
        description="هذه الأرقام ليست للتباهي، بل لأنها تساعدنا على اختصار الطريق وتحسين دقة الاستهداف."
      />
      <StatsRow />
    </div>
  </section>
);

const PricingSection2 = () => {
  const tiers = [
    {
      name: 'تجربة شهرية',
      price: '4,000 ريال / شهر',
      icon: Target,
      features: ['تجربة قطاع واحد', 'قائمة فرص أولية', 'تشغيل قنوات أساسية', 'تقرير أداء شهري'],
    },
    {
      name: 'تشغيل 90 يوم',
      price: '9,000 ريال / 3 شهور',
      icon: ShieldCheck,
      recommended: true,
      features: ['بناء قناة مبيعات كاملة', 'بيانات ورسائل ومتابعة', 'تطوير أداء الفريق أسبوعيًا', 'قياس القمع حتى العروض والتفاوض'],
    },
    {
      name: 'شراكة سنوية',
      price: 'تسعير حسب المستهدف',
      icon: BriefcaseBusiness,
      features: ['تشغيل مستمر متعدد القطاعات', 'مدير حساب ومراجعات استراتيجية', 'أصول بيانات ولوحات أوسع', 'نموذج مشاركة نجاح مخصص'],
    },
  ];

  return (
    <section className="py-28 bg-[#050505] border-t border-slate-900/60" id="pricing">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeader
          eyebrow="خطة التشغيل"
          title="خطة تشغيل 90 يوم لبناء قناة مبيعات جديدة"
          description="أنت لا تدفع مقابل أداة فقط. أنت تدفع لتجهيز البيانات، تشغيل القنوات، تدريب فريقك، متابعة الأداء، وتحريك الفرص. وجزء كبير من نجاحنا مرتبط بنتائجك الفعلية."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className={cn(
                'relative rounded-3xl p-7 border bg-slate-950/60',
                tier.recommended ? 'border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.16)]' : 'border-slate-800'
              )}
            >
              {tier.recommended && (
                <div className="absolute top-0 inset-x-0 bg-emerald-400 text-slate-950 text-center text-xs font-black py-1 rounded-t-3xl">
                  الأنسب لاختبار 90 يوم
                </div>
              )}
              <div className={cn('pt-4', tier.recommended && 'pt-7')}>
                <tier.icon className="w-10 h-10 text-emerald-300 mb-5" />
                <h3 className="text-2xl font-black text-white mb-3">{tier.name}</h3>
                <div className="text-xl md:text-2xl font-black text-emerald-300 mb-6">{tier.price}</div>
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-1 shrink-0" />
                      <span className="font-bold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => scrollToSection('final-cta')}
                  className={cn(
                    'w-full mt-8 rounded-xl py-3 font-black transition-colors',
                    tier.recommended ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'bg-slate-900 text-white hover:bg-slate-800'
                  )}
                >
                  ابدأ بهذا المسار
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RevenueShareSimpleSection = () => (
  <section className="py-24 bg-[#080808] border-t border-slate-900/60">
    <div className="container mx-auto px-4 max-w-5xl text-center">
      <SectionHeader
        eyebrow="مشاركة النجاح"
        title="نربح أكثر عندما تربح أكثر"
        description="جزء من نموذجنا مرتبط بالصفقات الناتجة من الفرص التي نوفرها ونساعد في تحريكها. نبدأ بشرح واضح للنموذج، ثم يتم تفصيل النسب حسب حجم الصفقة وطبيعة دورة البيع."
      />
      <div className="grid md:grid-cols-3 gap-4">
        {['فرصة مؤهلة', 'اجتماع وعرض سعر', 'صفقة ونمو فعلي'].map((step, idx) => (
          <div key={step} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6">
            <div className="text-3xl font-black text-emerald-300 mb-2">{idx + 1}</div>
            <div className="text-white font-black">{step}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FinalCtaSection2 = () => (
  <section className="py-28 bg-[#050505] border-t border-slate-900/60" id="final-cta">
    <div className="container mx-auto px-4 max-w-5xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-3xl bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-slate-950 border border-emerald-500/30 p-8 md:p-12"
      >
        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
          ابدأ بتجربة 90 يوم على منتج واحد وقطاع واحد
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
          نحدد المستهدف، نختار القطاع، نجهز البيانات، ونبدأ تشغيل فريقك مع المنظومة.
        </p>
        <button
          onClick={() => scrollToSection('growth-calculator')}
          className="px-8 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition-colors"
        >
          احسب مستهدفك خلال 90 يوم
        </button>
      </motion.div>
    </div>
  </section>
);

const Investment2Page = () => {
  return (
    <div
      className="min-h-screen selection:bg-emerald-500/30 font-sans relative overflow-x-hidden pt-[60px] md:pt-0"
      dir="rtl"
      style={{
        fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif",
        background: '#050505',
        color: '#e2e8f0',
        lineHeight: 1.7,
      }}
    >
      <FlowRail />

      <div id="hero">
        <HeroSection2 />
      </div>
      <div id="engines">
        <EnginesSection />
      </div>
      <div id="one-salesperson">
        <OneSalespersonSection />
      </div>
      <div id="target-first">
        <TargetFirstSection />
      </div>
      <div id="focused-targeting">
        <FocusedTargetingSection />
      </div>
      <div id="daily-system">
        <DailySalesSystemSection />
      </div>
      <div id="weekly-review">
        <WeeklyReviewSection />
      </div>
      <div id="stats-row">
        <TrustStatsIntro />
      </div>

      <SectionBridge label="شركات خاضت التجربة معنا" color="aqua" />
      <div id="partners">
        <PartnersMarqueeSection />
      </div>

      <SectionBridge label="جهات وقطاعات ظهرت منها فرص" color="aqua" />
      <div id="opportunity-sources">
        <OpportunitySourcesSection />
      </div>

      <SectionBridge label="نماذج من فرص تحولت إلى اجتماعات مؤهلة" color="emerald" />
      <div id="use-cases">
        <UseCasesSection />
      </div>

      <SectionBridge label="حوّل المستهدف إلى أرقام تشغيل واضحة" color="emerald" />
      <div id="growth-calculator">
        <GrowthCalculatorSection />
      </div>

      <SectionBridge label="تفاصيل المنظومة لمن يريد فهم التشغيل بعمق" color="purple" />
      <div id="radar-system">
        <MonafsatNetworkSection />
      </div>
      <div id="growth-triangle">
        <GrowthTriangleSection />
      </div>
      <div id="work-stages">
        <WorkStagesSection />
      </div>
      <div id="dashboard-cmd">
        <SmartDashboardSection />
      </div>
      <div id="human-team">
        <HumanTeamSection />
      </div>
      <div id="deliverables">
        <DeliverablesSection />
      </div>

      <SectionBridge label="البنية التقنية والأصول التي تبقى للشركة" color="emerald" />
      <div id="tech-assets">
        <AssetsSection />
      </div>
      <div id="future">
        <FutureSection />
      </div>

      <div id="pricing">
        <PricingSection2 />
      </div>
      <div id="revenue-share">
        <RevenueShareSimpleSection />
      </div>

      <SectionBridge label="تريد اجتماعات فقط بدون تشغيل كامل؟" color="aqua" />
      <div id="smart-portfolio">
        <SmartPortfolioSection />
      </div>

      <FinalCtaSection2 />
    </div>
  );
};

export default Investment2Page;
