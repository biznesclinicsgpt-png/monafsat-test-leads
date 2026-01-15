import React, { useState, useEffect } from 'react';
import { Icons, COLORS } from '../constants';

const MessagesPage = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'whatsapp' | 'unread'>('all');
    const [activeChatId, setActiveChatId] = useState<string | null>('1');
    const [whatsappConnected, setWhatsappConnected] = useState(false);
    const [showQrScanner, setShowQrScanner] = useState(false);

    // Mock Data
    const [chats, setChats] = useState([
        { id: '1', name: 'أحمد علي', type: 'whatsapp', lastMsg: 'شكراً لك، سأراجع العرض', time: '10:30 ص', unread: 2, avatar: 'A', phone: '+966 50 123 4567', email: 'ahmed@example.com', status: 'online' },
        { id: '2', name: 'سارة خالد', type: 'system', lastMsg: 'هل يمكن تأجيل الاجتماع؟', time: 'أمس', unread: 0, avatar: 'S', phone: '+966 55 987 6543', email: 'sara@company.com', status: 'offline' },
        { id: '3', name: 'محمد سالم', type: 'whatsapp', lastMsg: 'تم تحويل الدفعة الأولى', time: 'الأحد', unread: 0, avatar: 'M', phone: '+966 54 321 0987', email: 'mohammed@business.sa', status: 'online' },
        { id: '4', name: 'شركة التقنية الحديثة', type: 'system', lastMsg: 'نحتاج لتحديث البيانات', time: 'الخميس', unread: 1, avatar: 'T', phone: '+966 11 222 3333', email: 'info@tech-modern.com', status: 'away' },
    ]);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'them', text: 'مرحباً، هل العرض جاهز؟', time: '10:15 ص' },
        { id: 2, sender: 'me', text: 'أهلاً أستاذ أحمد، نعم العرض جاهز.', time: '10:20 ص' },
        { id: 3, sender: 'me', text: 'سأرسله لك الآن.', time: '10:20 ص' },
        { id: 4, sender: 'them', text: 'شكراً لك، سأراجع العرض', time: '10:30 ص' },
    ]);

    const filteredChats = chats.filter(chat => {
        if (activeTab === 'whatsapp') return chat.type === 'whatsapp';
        if (activeTab === 'unread') return chat.unread > 0;
        return true;
    });

    const activeChat = chats.find(c => c.id === activeChatId);

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (activeChat && activeChat.type === 'whatsapp') {
            // Check if we have a phone number
            if (!activeChat.phone) return;

            // Clean phone number
            const phone = activeChat.phone.replace(/\s+/g, '');
            // In a real app we would get the message from input, here we open with empty text or draft
            const url = `https://web.whatsapp.com/send?phone=${phone}&text=`;
            window.open(url, '_blank');
            return;
        }
        // Mock send for internal
    };

    const openWhatsappWeb = () => {
        window.open('https://web.whatsapp.com/', '_blank');
    };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-slate-800" dir="rtl">

            {/* Left Pane: Conversations List */}
            <div className="w-80 flex flex-col border-l border-slate-200 bg-white">
                {/* Search & Tabs */}
                <div className="p-4 border-b border-slate-200 space-y-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="بحث..."
                            className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <div className="absolute right-3 top-2.5 text-slate-400">
                            <Icons.Search />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'all' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setActiveTab('whatsapp')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'whatsapp' ? 'bg-green-100 text-green-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            واتساب
                        </button>
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'unread' ? 'bg-orange-100 text-orange-700' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            غير مقروء
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors relative group ${activeChatId === chat.id ? 'bg-blue-50/50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${chat.type === 'whatsapp' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                        {chat.avatar}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-sm ${activeChatId === chat.id ? 'text-blue-700' : 'text-slate-800'}`}>{chat.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[140px]">{chat.lastMsg}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                    {chat.unread > 0 && (
                                        <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                            {chat.unread}
                                        </span>
                                    )}
                                    {chat.type === 'whatsapp' && (
                                        <span className="text-green-500" title="WhatsApp">
                                            <Icons.WhatsApp />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Pane: Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-50 relative">
                {/* Specific WhatsApp Connection State */}
                {activeTab === 'whatsapp' && !whatsappConnected ? (
                    <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                        <div className="w-64 h-64 bg-slate-100 rounded-xl mb-6 shadow-inner flex items-center justify-center relative overflow-hidden group border border-slate-300">
                            <span className="text-green-500 transform scale-150">
                                <Icons.WhatsApp />
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">ربط واتساب ويب</h2>
                        <p className="text-slate-500 mb-6 max-w-sm text-sm leading-relaxed">
                            لأسباب أمنية وتقنية، يجب فتح واتساب ويب في نافذة جديدة لربط جهازك.
                            <br />
                            اضغط أدناه لفتح الموقع الرسمي، ثم عد إلى هنا لتأكيد الربط.
                        </p>
                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={openWhatsappWeb}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Icons.WhatsApp />
                                فتح واتساب ويب
                            </button>
                            <button
                                onClick={() => setWhatsappConnected(true)}
                                className="bg-white border border-slate-300 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                            >
                                تم ربط الجهاز
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        {activeChat ? (
                            <div className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${activeChat.type === 'whatsapp' ? 'bg-green-500' : 'bg-blue-600'}`}>
                                        {activeChat.avatar}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-slate-800">{activeChat.name}</h2>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <span className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                            {activeChat.status === 'online' ? 'متصل الآن' : 'غير متصل'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors">
                                        <Icons.Phone />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                                        <Icons.MoreVertical />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-16 bg-white border-b border-slate-200"></div>
                        )}

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: activeChat?.type === 'whatsapp' ? 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' : 'none', backgroundSize: '400px' }}> {/* Simple pattern background for WhatsApp feel */}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm relative group ${msg.sender === 'me'
                                        ? (activeChat?.type === 'whatsapp' ? 'bg-[#d9fdd3] text-slate-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tl-none')
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-tr-none'
                                        }`}>
                                        <p>{msg.text}</p>
                                        <span className={`text-[9px] mt-1 block text-right ${msg.sender === 'me' && activeChat?.type !== 'whatsapp' ? 'text-blue-100' : 'text-slate-400'}`}>
                                            {msg.time}
                                            {msg.sender === 'me' && (
                                                <span className="inline-block mr-1">
                                                    <Icons.DoubleCheck />
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="flex items-center gap-2 max-w-4xl mx-auto">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <Icons.Attachment />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="اكتب رسالتك..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={(e) => handleSendMessage(e)}
                                    className={`p-3 rounded-full text-white shadow-md transition-transform hover:scale-105 ${activeChat?.type === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    <Icons.Send />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Right Pane: Contact Details (Visible if chat selected) */}
            {activeChat && (
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto hidden lg:flex">
                    <div className="p-8 flex flex-col items-center border-b border-slate-100">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-md ${activeChat.type === 'whatsapp' ? 'bg-green-500' : 'bg-blue-600'}`}>
                            {activeChat.avatar}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{activeChat.name}</h3>
                        <p className="text-slate-500 text-sm mb-4">عميل محتمل</p>

                        <div className="flex gap-3 w-full">
                            <button className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                <Icons.Phone />
                                اتصال
                            </button>
                            <button className="flex-1 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                                <Icons.Email />
                                بريد
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">معلومات الاتصال</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 text-sm">
                                    <span className="text-slate-400 mt-0.5"><Icons.Phone /></span>
                                    <span className="text-slate-700 dir-ltr text-right">{activeChat.phone}</span>
                                </div>
                                <div className="flex items-start gap-3 text-sm">
                                    <span className="text-slate-400 mt-0.5"><Icons.Email /></span>
                                    <span className="text-slate-700 break-all">{activeChat.email}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">التصنيفات</h4>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">مهتم</span>
                                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">B2B</span>
                                <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs font-medium">جديد</span>
                            </div>
                        </div>

                        {activeChat.type === 'whatsapp' && (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <h4 className="text-green-800 font-bold text-sm mb-2 flex items-center gap-2">
                                    <Icons.WhatsApp />
                                    حالة واتساب
                                </h4>
                                <p className="text-xs text-green-700 leading-relaxed">
                                    تم ربط المحادثة بنجاح. يمكنك استهداف هذا العميل بالحملات التسويقية.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                    box-shadow: 0 0 4px #22c55e;
                }
                .dir-ltr {
                    direction: ltr;
                }
            `}</style>
        </div>
    );
};

export default MessagesPage;
