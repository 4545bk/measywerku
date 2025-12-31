
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { PublicLayout } from './components/Layout';
import { Home } from './pages/Home';
import { PropertyDetail } from './pages/PropertyDetail';
import { Properties } from './pages/Properties';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { PropertyManagement } from './pages/PropertyManagement';
import { LocationManagement } from './pages/LocationManagement';
import { SiteSettings } from './pages/SiteSettings';
import { SubmitTestimonial } from './pages/SubmitTestimonial';
import { TestimonialManagement } from './pages/TestimonialManagement';
import { AccountSettings } from './pages/AccountSettings';
import { DynamicPage } from './pages/DynamicPage';
import { LayoutDashboard, Building2, MapPin, User, LogOut, Settings, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin layout component with sidebar navigation and authentication check
const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/login');
  };

  const sidebarItems = [
    { name: 'Analytics', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Properties', path: '/admin/properties', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Locations', path: '/admin/locations', icon: <MapPin className="w-5 h-5" /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    { name: 'Account', path: '/admin/account', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-slate-900">
            Ghion Homes<span className="text-amber-600">.</span> <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded ml-2 uppercase tracking-widest">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-8">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${location.pathname === item.path
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-12 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            {/* Fix: Wrapped "/" in a string literal to prevent parser from confusing it with a RegExp literal which was breaking subsequent JSX parsing */}
            Dashboard {" / "} {location.pathname.split('/').pop() || 'Overview'}
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">Mesay Worku</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Administrator</span>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
              <img src="/images/imagemesay.jpg" className="w-full h-full object-cover" alt="Admin Avatar" />
            </div>
          </div>
        </header>
        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Wrapped in PublicLayout for consistent branding */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/properties" element={<PublicLayout><Properties /></PublicLayout>} />
      <Route path="/properties/:location" element={<PublicLayout><Properties /></PublicLayout>} />
      <Route path="/property/:id" element={<PublicLayout><PropertyDetail /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><DynamicPage type="about" title="About Mesay Werku" /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><DynamicPage type="contact" title="Contact Us" /></PublicLayout>} />
      <Route path="/locations" element={<PublicLayout><DynamicPage type="locations" title="Locations Portfolio" /></PublicLayout>} />

      {/* Public Testimonial Submission */}
      <Route path="/testimonial/submit" element={<SubmitTestimonial />} />

      {/* Auth Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes - Wrapped in AdminLayout for authentication and sidebar */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/properties" element={<AdminLayout><PropertyManagement /></AdminLayout>} />
      <Route path="/admin/locations" element={<AdminLayout><LocationManagement /></AdminLayout>} />
      <Route path="/admin/testimonials" element={<AdminLayout><TestimonialManagement /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><SiteSettings /></AdminLayout>} />
      <Route path="/admin/account" element={<AdminLayout><AccountSettings /></AdminLayout>} />
    </Routes>
  );
};

export default App;
