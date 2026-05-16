import { PersonEntity } from '@/types/data-center';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Helper to check if a value is meaningful
const isValidValue = (value: any): boolean => {
    if (!value) return false;
    if (typeof value !== 'string') return true;
    const str = value.trim().toLowerCase();
    return str !== '' && str !== 'n/a' && str !== 'null' && str !== 'undefined' && str !== '-';
};

export const validatePerson = (person: Partial<PersonEntity>): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 1. Check Name - Required but flexible
    const hasName = isValidValue(person.fullName) || isValidValue(person.firstName) || isValidValue(person.lastName);
    if (!hasName) {
        warnings.push('الاسم غير متوفر');
    }

    // 2. Validate Email Format
    const hasEmail = isValidValue(person.email);
    if (hasEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(person.email!)) {
            warnings.push('صيغة البريد الإلكتروني غير صحيحة');
        }
    }

    // 3. Check Phone
    const hasPhone = isValidValue(person.phone);
    if (hasPhone) {
        const digits = person.phone!.replace(/\D/g, '');
        if (digits.length < 7) {
            warnings.push('رقم الهاتف قصير جداً');
        }
    }

    // 4. Check LinkedIn
    const hasLinkedin = isValidValue(person.linkedinUrl);

    // 5. Minimum requirements - نحتاج الاسم + طريقة تواصل واحدة على الأقل
    // لكن إذا كان هناك اسم فقط، نقبل مع تحذير
    if (!hasName && !hasEmail && !hasPhone && !hasLinkedin) {
        errors.push('لا توجد بيانات كافية - يجب توفر الاسم أو طريقة تواصل');
    } else if (!hasEmail && !hasPhone && !hasLinkedin) {
        // لديه اسم فقط - نقبل مع تحذير
        warnings.push('لا توجد طريقة تواصل (بريد/هاتف/لينكدإن)');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};
