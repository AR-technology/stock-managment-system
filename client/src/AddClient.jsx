import { useState } from 'react';
import { Save, ArrowLeft, User, Phone, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', person: '', phone: '', email: '', address: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if(!formData.name || !formData.phone) return alert("Required fields missing");
    axios.post('http://localhost:3001/add-client', formData).then(res => {
        if(res.data.message) { alert("✅ Saved"); navigate('/customers'); }
    });
  };

  const inputClass = "w-full pl-12 pr-4 py-3 rounded-xl border outline-none font-medium bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-8 min-h-screen flex justify-center transition-colors duration-300 bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate('/customers')} className="p-2 rounded-full shadow-sm border bg-white border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition">
             <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
           </button>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Client</h1>
        </div>

        <div className="p-8 rounded-2xl shadow-sm border space-y-6 bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Company Name</label>
                <div className="relative"><User className="absolute left-4 top-3.5 text-slate-400" size={18} /><input name="name" onChange={handleChange} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Person</label><input name="person" onChange={handleChange} className={inputClass.replace('pl-12', 'p-3')} /></div>
                <div><label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Phone</label><div className="relative"><Phone className="absolute left-4 top-3.5 text-slate-400" size={18} /><input name="phone" onChange={handleChange} className={inputClass} /></div></div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Email</label>
                <div className="relative"><Mail className="absolute left-4 top-3.5 text-slate-400" size={18} /><input name="email" onChange={handleChange} className={inputClass} /></div>
            </div>
            <div>
                <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Address</label>
                <div className="relative"><MapPin className="absolute left-4 top-3.5 text-slate-400" size={18} /><textarea name="address" onChange={handleChange} rows="2" className={inputClass}></textarea></div>
            </div>
            <button onClick={handleSave} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex justify-center gap-2"><Save size={20} /> Save Client</button>
        </div>
      </div>
    </div>
  );
};

export default AddClient;