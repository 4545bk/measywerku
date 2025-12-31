
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Building2, Users, MapPin, TrendingUp, AlertCircle, CheckCircle2, 
  Eye, MousePointer2, Plus, ArrowUpRight
} from 'lucide-react';
import { INITIAL_PROPERTIES, INITIAL_LOCATIONS } from '../constants';

const COLORS = ['#d97706', '#0f172a', '#3b82f6', '#8b5cf6'];

export const AdminDashboard = () => {
  const stats = useMemo(() => {
    const totalViews = INITIAL_PROPERTIES.reduce((acc, p) => acc + p.views, 0);
    const totalInquiries = INITIAL_PROPERTIES.reduce((acc, p) => acc + p.inquiries, 0);
    const byType = INITIAL_PROPERTIES.reduce((acc: any, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.keys(byType).map(key => ({ name: key, value: byType[key] }));
    
    return {
      totalProperties: INITIAL_PROPERTIES.length,
      totalViews,
      totalInquiries,
      totalLocations: INITIAL_LOCATIONS.length,
      typeData
    };
  }, []);

  const trafficData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 600 },
    { name: 'Thu', views: 800 },
    { name: 'Fri', views: 500 },
    { name: 'Sat', views: 900 },
    { name: 'Sun', views: 1100 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">System Analytics</h1>
          <p className="text-slate-500">Real-time performance metrics for Addis Luxury Estates</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-slate-800 transition-all">
          <Plus className="w-5 h-5" />
          <span>New Property</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
              +12% <TrendingUp className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalProperties}</div>
          <div className="text-sm text-slate-500 font-medium">Total Listings</div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
              +24% <TrendingUp className="w-3 h-3 ml-1" />
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalViews.toLocaleString()}</div>
          <div className="text-sm text-slate-500 font-medium">Monthly Views</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
              <MousePointer2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-red-600 flex items-center bg-red-50 px-2 py-1 rounded-full">
              -3% <TrendingUp className="w-3 h-3 ml-1 rotate-180" />
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalInquiries}</div>
          <div className="text-sm text-slate-500 font-medium">Lead Conversions</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-400 px-2 py-1 rounded-full">
              Static
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalLocations}</div>
          <div className="text-sm text-slate-500 font-medium">Active Regions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-amber-600" />
             Traffic Overview
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="views" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Type Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Property Inventory</h3>
          <div className="h-[250px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {stats.typeData.map((type, i) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-sm font-medium text-slate-600">{type.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{type.value} items</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance List */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-8">
             <h3 className="text-lg font-bold text-slate-900">Listing Performance</h3>
             <button className="text-amber-600 text-sm font-bold flex items-center hover:underline">
               Full Report <ArrowUpRight className="w-4 h-4 ml-1" />
             </button>
           </div>
           
           <div className="space-y-6">
              {INITIAL_PROPERTIES.sort((a, b) => b.views - a.views).slice(0, 4).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200">
                      <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">{p.type} • {p.purpose}</div>
                    </div>
                  </div>
                  <div className="flex space-x-8">
                    <div className="text-center">
                       <div className="text-sm font-bold text-slate-900">{p.views}</div>
                       <div className="text-[10px] text-slate-400 uppercase">Views</div>
                    </div>
                    <div className="text-center">
                       <div className="text-sm font-bold text-slate-900">{p.inquiries}</div>
                       <div className="text-[10px] text-slate-400 uppercase">Leads</div>
                    </div>
                    <div className="flex items-center">
                      {p.inquiries > 30 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center space-x-2 mb-8">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-slate-900" />
                </div>
                <h3 className="text-xl font-serif font-bold italic">Addis Luxe Insights</h3>
             </div>
             
             <div className="space-y-6">
                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                   <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">Demand Warning</div>
                   <p className="text-slate-200 text-sm leading-relaxed">
                     Apartments in <span className="text-white font-bold">Bole</span> are selling 40% faster this month. Consider adjusting prices for remaining 3 bedroom units to maximize ROI.
                   </p>
                </div>
                <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                   <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2">SEO Opportunity</div>
                   <p className="text-slate-200 text-sm leading-relaxed">
                     Search volume for "Commercial Office Kazanchis" has doubled. New listings in this category will likely reach top page results within 48 hours.
                   </p>
                </div>
             </div>
             
             <button className="mt-8 w-full py-4 bg-amber-500 text-slate-900 font-bold rounded-2xl hover:bg-amber-400 transition-all">
                Generate Full Quarterly Report
             </button>
           </div>
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </div>
      </div>
    </div>
  );
};
