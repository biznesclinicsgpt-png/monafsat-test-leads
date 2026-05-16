import { PersonEntity } from '@/types/data-center';

export interface ScoreResult {
    score: number; // 0-100
    factors: string[];
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export const calculateScore = (person: Partial<PersonEntity>): ScoreResult => {
    let score = 0;
    const factors: string[] = [];

    // ==========================================
    // 1. اكتمال البيانات (40 نقطة كحد أقصى)
    // ==========================================

    // البريد الإلكتروني (15 نقطة)
    if (person.email && person.email !== 'N/A') {
        score += 15;
        factors.push('بريد إلكتروني (+15)');
    }

    // الهاتف (10 نقاط)
    if (person.phone && person.phone !== 'N/A') {
        score += 10;
        factors.push('رقم هاتف (+10)');
    }

    // لينكدإن (10 نقاط)
    if (person.linkedinUrl && person.linkedinUrl !== 'N/A') {
        score += 10;
        factors.push('حساب لينكدإن (+10)');
    }

    // الاسم الكامل (5 نقاط)
    if (person.fullName && person.fullName.trim().length > 3) {
        score += 5;
        factors.push('اسم كامل (+5)');
    }

    // ==========================================
    // 2. جودة العميل المحتمل (35 نقطة كحد أقصى)
    // ==========================================

    // المسمى الوظيفي ومستوى القرار
    if (person.title) {
        const title = person.title.toLowerCase();

        // C-Level و المؤسسين (25 نقطة)
        if (title.includes('ceo') || title.includes('cto') || title.includes('cfo') ||
            title.includes('founder') || title.includes('owner') || title.includes('chief') ||
            title.includes('president') || title.includes('مدير عام') || title.includes('رئيس')) {
            score += 25;
            factors.push('صانع قرار رئيسي (+25)');
        }
        // VP و Directors (18 نقطة)
        else if (title.includes('vp') || title.includes('vice president') ||
                 title.includes('director') || title.includes('head of') ||
                 title.includes('مدير') || title.includes('رئيس قسم')) {
            score += 18;
            factors.push('مدير تنفيذي (+18)');
        }
        // Managers (10 نقاط)
        else if (title.includes('manager') || title.includes('lead') ||
                 title.includes('supervisor') || title.includes('مشرف')) {
            score += 10;
            factors.push('مدير / مشرف (+10)');
        }
        // Other roles (5 نقاط)
        else {
            score += 5;
            factors.push('موظف (+5)');
        }
    }

    // القسم المستهدف (10 نقاط)
    if (person.department) {
        const dept = person.department.toLowerCase();
        if (dept.includes('engineering') || dept.includes('technology') ||
            dept.includes('it') || dept.includes('operations') ||
            dept.includes('تقنية') || dept.includes('هندسة')) {
            score += 10;
            factors.push('قسم مستهدف (+10)');
        }
    }

    // ==========================================
    // 3. معلومات الشركة (25 نقطة كحد أقصى)
    // ==========================================

    // اسم الشركة متوفر (10 نقاط)
    const companyName = (person as any).companyName || (person as any).company;
    if (companyName && companyName !== 'N/A') {
        score += 10;
        factors.push('شركة محددة (+10)');

        // صناعة مستهدفة (15 نقطة إضافية)
        const company = companyName.toLowerCase();
        const targetIndustries = ['tech', 'construction', 'real estate', 'عقار', 'مقاولات',
                                  'software', 'digital', 'رقمي', 'تقني', 'engineering', 'هندس'];
        if (targetIndustries.some(ind => company.includes(ind))) {
            score += 15;
            factors.push('صناعة مستهدفة (+15)');
        }
    }

    // الموقع الجغرافي (5 نقاط)
    if (person.locationCity || person.locationCountry) {
        score += 5;
        factors.push('موقع جغرافي (+5)');
    }

    // ==========================================
    // حساب الدرجة النهائية
    // ==========================================

    // التأكد من أن النتيجة بين 0 و 100
    score = Math.min(100, Math.max(0, score));

    // تحديد التقدير
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 80) grade = 'A';
    else if (score >= 60) grade = 'B';
    else if (score >= 40) grade = 'C';
    else if (score >= 20) grade = 'D';
    else grade = 'F';

    return { score, factors, grade };
};
