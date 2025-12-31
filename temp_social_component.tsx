
// Social Actions Component
const SocialActions = () => {
    const { showInfo, showSuccess } = useToast();

    const handleAction = (type: string, value: string, label: string) => {
        if (type === 'info') {
            navigator.clipboard.writeText(value);
            showSuccess(`${label} copied: ${value}`);
        } else if (type === 'link') {
            window.open(value, '_blank');
        }
    };

    const socialLinks = [
        {
            icon: Phone,
            label: 'Phone',
            type: 'info',
            value: '+251 98 302 0552'
        },
        {
            icon: Instagram,
            label: 'Instagram',
            type: 'link',
            value: 'https://instagram.com'
        },
        {
            icon: Facebook,
            label: 'Facebook',
            type: 'link',
            value: 'https://facebook.com'
        },
        {
            icon: Send,
            label: 'Telegram',
            type: 'link',
            value: 'https://t.me/mesay'
        },
        {
            icon: Mail,
            label: 'Email',
            type: 'info',
            value: 'info@homezy.com'
        }
    ];

    return (
        <div className="flex space-x-4">
            {socialLinks.map((item, i) => (
                <button
                    key={i}
                    onClick={() => handleAction(item.type, item.value, item.label)}
                    className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-amber-600 hover:-translate-y-1 transition-all cursor-pointer shadow-lg shadow-slate-900/10"
                    title={item.type === 'info' ? `Click to copy ${item.label}` : `Visit ${item.label}`}
                >
                    <item.icon className="w-5 h-5" />
                </button>
            ))}
        </div>
    );
};
