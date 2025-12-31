import React, { useState, useEffect } from 'react';
import { User, Lock, Bell, Activity, Camera, Save, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export const AccountSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [photoPreview, setPhotoPreview] = useState('/images/imagemesay.jpg');
    const [profileData, setProfileData] = useState({
        name: 'Mesay',
        email: 'admin@homezy.com',
        phone: '098 302 0552',
        address: 'Bole, Addis Ababa, Ethiopia',
        bio: 'Premier real estate consultant specializing in luxury properties and investment opportunities in Addis Ababa.',
        joinedDate: '2016-01-01'
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        newProperties: true,
        newTestimonials: true,
        newInquiries: true
    });

    const [stats, setStats] = useState({
        totalProperties: 12,
        activeListings: 8,
        soldProperties: 4,
        totalInquiries: 145,
        approvedTestimonials: 23,
        monthlyViews: 1250
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        // TODO: Implement profile update
        alert('Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        // TODO: Implement password change
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleSaveNotifications = () => {
        // TODO: Implement notification settings
        alert('Notification settings saved!');
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'security', name: 'Security', icon: Lock },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'activity', name: 'Activity', icon: Activity }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500 mt-1">Manage your profile and account preferences</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Total Properties', value: stats.totalProperties, color: 'purple' },
                    { label: 'Active Listings', value: stats.activeListings, color: 'green' },
                    { label: 'Sold', value: stats.soldProperties, color: 'blue' },
                    { label: 'Inquiries', value: stats.totalInquiries, color: 'amber' },
                    { label: 'Testimonials', value: stats.approvedTestimonials, color: 'pink' },
                    { label: 'Monthly Views', value: stats.monthlyViews, color: 'indigo' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-4 border border-slate-200">
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-200 flex overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-600'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            {/* Photo Upload */}
                            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-100">
                                        <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                                        <Camera className="w-5 h-5" />
                                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Photo</h3>
                                    <p className="text-sm text-slate-500 mb-4">
                                        Upload a professional photo for your profile. This will be displayed across the platform.
                                    </p>
                                    <p className="text-xs text-slate-400">Recommended: Square image, at least 400x400px</p>
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                <span className="text-sm font-semibold text-purple-900">
                                    Member since {new Date(profileData.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:shadow-2xl transition-all"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Profile Changes</span>
                            </button>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 max-w-2xl">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="text-sm font-semibold text-amber-900">
                                    🔒 Keep your account secure by using a strong password and changing it regularly.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                onClick={handleChangePassword}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:shadow-2xl transition-all"
                            >
                                <Lock className="w-5 h-5" />
                                <span>Update Password</span>
                            </button>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6 max-w-2xl">
                            <p className="text-slate-600">Choose what notifications you want to receive.</p>

                            <div className="space-y-4">
                                {[
                                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                                    { key: 'newProperties', label: 'New Properties', desc: 'Notify when new properties are added' },
                                    { key: 'newTestimonials', label: 'New Testimonials', desc: 'Notify when customers submit testimonials' },
                                    { key: 'newInquiries', label: 'New Inquiries', desc: 'Notify when customers inquire about properties' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{item.label}</h4>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-block w-14 h-8 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={notifications[item.key as keyof typeof notifications]}
                                                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-8 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleSaveNotifications}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:shadow-2xl transition-all"
                            >
                                <Save className="w-5 h-5" />
                                <span>Save Notification Settings</span>
                            </button>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div className="space-y-4">
                            <p className="text-slate-600 mb-6">Recent account activity and login history.</p>

                            <div className="space-y-3">
                                {[
                                    { action: 'Approved testimonial from Abebe K.', time: '2 hours ago', type: 'success' },
                                    { action: 'Added new property: Luxury Penthouse', time: '5 hours ago', type: 'info' },
                                    { action: 'Updated profile information', time: '1 day ago', type: 'info' },
                                    { action: 'Login from Addis Ababa, Ethiopia', time: '2 days ago', type: 'success' },
                                    { action: 'Changed password', time: '1 week ago', type: 'warning' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'success' ? 'bg-green-500' :
                                                activity.type === 'warning' ? 'bg-amber-500' :
                                                    'bg-blue-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="font-semibold text-slate-900">{activity.action}</p>
                                            <p className="text-sm text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
