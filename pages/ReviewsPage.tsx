import React from 'react';

const ReviewsPage = () => {
    const reviews = [
        { id: 1, name: 'سعد القحطاني', company: 'مطاعم لافندر', rating: 5, text: 'تجربة ممتازة مع الفريق، الاحترافية عالية والتسليم في الوقت المحدد.', date: 'منذ يومين' },
        { id: 2, name: 'نورة العتيبي', company: 'بوتيك الأناقة', rating: 4, text: 'النتائج فاقت التوقعات، لكن التواصل كان يحتاج لبعض التحسين في البداية.', date: 'منذ أسبوع' },
        { id: 3, name: 'فهد الزهراني', company: 'شركة التقنية المتقدمة', rating: 5, text: 'أنصح بالتعامل معهم بشدة، ساعدونا في تحقيق أهدافنا البيعية لهذا الربع.', date: 'منذ أسبوعين' },
    ];

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">تقييمات العملاء</h1>
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
                    <span className="text-yellow-600 font-bold text-lg">4.8</span>
                    <div className="flex text-yellow-400">
                        {'★★★★★'.split('').map((c, i) => <span key={i}>{c}</span>)}
                    </div>
                    <span className="text-xs text-yellow-600 font-bold">(24 تقييم)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                            {review.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800">{review.name}</h3>
                                    <div className="text-xs text-slate-400">{review.company}</div>
                                </div>
                                <span className="text-xs text-slate-400">{review.date}</span>
                            </div>

                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                ))}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                {review.text}
                            </p>

                            <div className="flex gap-4 pt-2">
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">رد على التقييم</button>
                                <button className="text-xs font-bold text-slate-400 hover:text-slate-600">الإبلاغ عن إساءة</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsPage;
