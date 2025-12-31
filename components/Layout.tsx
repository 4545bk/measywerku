
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Facebook, Twitter, PhoneCall } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Locations', path: '/locations' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-serif font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Ghion Homes<span className="text-amber-600">.</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all hover:text-amber-600 ${location.pathname === link.path ? 'text-amber-600' : 'text-slate-500'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="bg-white border-2 border-slate-100 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
            >
              Contact Us
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-6 py-6 border-b border-slate-50 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-bold text-slate-900"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-slate-900 text-white py-4 rounded-2xl font-bold"
          >
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-slate-900">Ghion Homes<span className="text-amber-600">.</span></span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-8 font-medium">
              Mesay Worku - Premium real estate consultancy in Addis Ababa. We connect you with luxury residences and high-value investment opportunities.
            </p>
            <div className="flex space-x-4">
              {[PhoneCall, Instagram, Facebook, Twitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-all cursor-pointer shadow-sm">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-slate-900 font-bold mb-8 uppercase tracking-widest text-[10px]">Quick Links</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><Link to="/" className="hover:text-amber-600 transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-amber-600 transition-colors">Property Listings</Link></li>
              <li><Link to="/about" className="hover:text-amber-600 transition-colors">About Mesay</Link></li>
              <li><Link to="/contact" className="hover:text-amber-600 transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-slate-900 font-bold mb-8 uppercase tracking-widest text-[10px]">Information</h3>
            <ul className="space-y-4 text-sm font-semibold text-slate-500">
              <li><span className="hover:text-amber-600 transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-amber-600 transition-colors cursor-pointer">Terms & Conditions</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Ghion Homes by Mesay Werku. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0">
            <span>Powered by Addis Luxe</span>
            <span>Ethiopia Office</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};
