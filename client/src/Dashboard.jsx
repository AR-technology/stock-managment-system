import { useState, useEffect } from 'react';
import { DollarSign, Package, Users, ShoppingCart, ArrowUpRight, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

// STAT CARD: Adapts to Light/Dark
const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:-translate-y-1
                  bg-white border-slate-200 
                  dark:bg-slate-800 dark:border-slate-700 dark:shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-slate-800 dark:text-white">{value}</h3>
        <p className="text-xs font-bold mt-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ArrowUpRight size={12} /> {trend}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-').replace('500', '600') + ' dark:text-white'} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [recentSales, setRecentSales] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, stock: 0, clients: 0 });
  const [filter, setFilter] = useState('total'); 

  useEffect(() => {
    axios.get(`http://localhost:3001/dashboard-stats?filter=${filter}`).then(res => setStats(res.data));
    axios.get('http://localhost:3001/recent-sales').then(res => setRecentSales(res.data));
    axios.get(`http://localhost:3001/sales-chart?filter=${filter}`).then(res => {
      setChartData(res.data.length > 0 ? res.data : []);
    });
  }, [filter]);

  return (
    // MAIN BG: Light Gray in Light Mode, Dark Slate in Dark Mode
    <div className="p-8 min-h-screen transition-colors duration-300
                    bg-slate-50 text-slate-800
                    dark:bg-slate-900 dark:text-slate-200">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening in your business.</p>
        </div>
        
        {/* Dropdown */}
        <div className="flex items-center gap-3">
           <div className="relative">
             <Calendar className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" size={18} />
             <select 
               className="pl-10 pr-4 py-2 rounded-lg font-bold outline-none cursor-pointer transition appearance-none shadow-sm border focus:ring-2 focus:ring-blue-500
                          bg-white border-slate-200 text-slate-700 hover:bg-slate-50
                          dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700"
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
             >
               <option value="total">Lifetime Total</option>
               <option value="today">Today</option>
               <option value="week">This Week</option>
               <option value="month">This Month</option>
               <option value="year">This Year</option>
             </select>
           </div>
           
           <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Today</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm">{new Date().toLocaleDateString()}</p>
           </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title={filter === 'total' ? "Total Revenue" : `Revenue (${filter})`} value={`$${stats.revenue.toLocaleString()}`} icon={DollarSign} color="bg-blue-600" trend="All Time" />
        <StatCard title="Total Stock" value={`${stats.stock} Slabs`} icon={Package} color="bg-purple-600" trend="In Warehouse" />
        <StatCard title="Active Clients" value={stats.clients} icon={Users} color="bg-orange-500" trend="Registered" />
        <StatCard title="System Status" value="Online" icon={ShoppingCart} color="bg-emerald-500" trend="Stable" />
      </div>

      {/* Graph & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl shadow-sm border transition-all duration-300
                        bg-white border-slate-200
                        dark:bg-slate-800 dark:border-slate-700 dark:shadow-lg">
          <h3 className="font-bold text-lg mb-6 capitalize text-slate-800 dark:text-white">{filter} Performance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-2xl shadow-sm border transition-all duration-300
                        bg-white border-slate-200
                        dark:bg-slate-800 dark:border-slate-700 dark:shadow-lg">
          <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Recent Sales</h3>
          <div className="space-y-6">
            {recentSales.length === 0 ? (
                <p className="text-slate-400 text-sm text-center">No sales found yet.</p>
            ) : (
                recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg transition
                                              hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border transition-colors
                                    bg-blue-50 text-blue-600 border-blue-100
                                    dark:bg-slate-700 dark:text-blue-400 dark:border-slate-600">
                        {sale.client_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{sale.client_name}</p>
                        <p className="text-xs text-slate-500">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    </div>
                    <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        +${sale.total_amount.toLocaleString()}
                    </span>
                </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;