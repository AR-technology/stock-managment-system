import { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Analytics = () => {
  const [filter, setFilter] = useState('monthly');
  const [data, setData] = useState({ summary: { income: 0, expense: 0, profit: 0 }, chart: [] });

  useEffect(() => {
    axios.get(`http://localhost:3001/financial-stats?filter=${filter}`).then(res => {
      setData({ summary: res.data.summary, chart: res.data.chart.length > 0 ? res.data.chart : [{name: 'No Data', income: 0}] });
    });
  }, [filter]);

  return (
    <div className="p-8 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      
      <div className="flex justify-between items-center mb-8 gap-4">
        <div><h1 className="text-3xl font-bold text-slate-800 dark:text-white">Reports</h1><p className="text-slate-500 dark:text-slate-400">Financial analysis.</p></div>
        <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400" size={18} />
            <select className="pl-10 pr-4 py-2 rounded-lg font-bold outline-none border cursor-pointer appearance-none bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="daily">Daily</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="p-6 rounded-2xl shadow-sm border flex justify-between items-center bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div><p className="text-xs font-bold uppercase text-slate-400">Income</p><h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">${data.summary.income}</h3></div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600 dark:bg-emerald-500/20 dark:text-emerald-400"><TrendingUp size={24} /></div>
         </div>
         <div className="p-6 rounded-2xl shadow-sm border flex justify-between items-center bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div><p className="text-xs font-bold uppercase text-slate-400">Expense</p><h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">${data.summary.expense}</h3></div>
            <div className="p-3 rounded-xl bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400"><TrendingDown size={24} /></div>
         </div>
         <div className="p-6 rounded-2xl shadow-sm border flex justify-between items-center bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div><p className="text-xs font-bold uppercase text-slate-400">Profit</p><h3 className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">${data.summary.profit}</h3></div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"><DollarSign size={24} /></div>
         </div>
      </div>

      <div className="p-8 rounded-2xl shadow-sm border mb-8 bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
         <h3 className="font-bold text-lg mb-6 text-slate-800 dark:text-white">Performance</h3>
         <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default Analytics;