import { useState, useEffect } from 'react';
import { Search, Plus, Phone, MapPin, Mail, User, Edit, Trash2, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState(null); 

  const fetchClients = () => {
    axios.get('http://localhost:3001/clients').then(res => setCustomers(res.data));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = (id) => {
    if(window.confirm("Delete client?")) {
        axios.delete(`http://localhost:3001/delete-client/${id}`).then(() => fetchClients());
    }
  };

  const handleUpdate = () => {
      axios.put('http://localhost:3001/update-client', editingClient).then(() => {
            alert("✅ Updated!");
            setEditingClient(null); fetchClients(); 
        });
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 relative">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Customers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage client details.</p>
        </div>
        <button onClick={() => navigate('/add-client')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition">
          <Plus size={20} /> Add New Client
        </button>
      </div>

      <div className="p-4 rounded-2xl shadow-sm border mb-8 bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-12 pr-4 py-3 rounded-xl font-medium outline-none transition
                       bg-slate-50 text-slate-700 focus:ring-2 focus:ring-blue-500
                       dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="p-6 rounded-2xl shadow-sm border hover:shadow-md transition duration-300 group
                                            bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md
                                    bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800">
                        {customer.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{customer.name}</h3>
                        <p className="text-xs font-medium flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <User size={12} /> {customer.person}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setEditingClient(customer)} className="p-2 rounded-lg transition bg-blue-50 text-blue-500 dark:bg-blue-500/10 dark:text-blue-400"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(customer.id)} className="p-2 rounded-lg transition bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"><Trash2 size={16} /></button>
                </div>
            </div>
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-500 dark:bg-slate-700 dark:text-blue-400"><Phone size={16} /></div> {customer.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-50 text-blue-500 dark:bg-slate-700 dark:text-blue-400"><MapPin size={16} /></div> {customer.address}
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="p-8 rounded-2xl w-full max-w-md shadow-2xl bg-white dark:bg-slate-800 dark:border dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Client</h2>
              <button onClick={() => setEditingClient(null)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"><X size={20} className="text-slate-500 dark:text-slate-400"/></button>
            </div>
            <div className="space-y-4">
              {['name', 'person', 'phone', 'email'].map(field => (
                  <input key={field} type="text" value={editingClient[field]} 
                    onChange={(e) => setEditingClient({...editingClient, [field]: e.target.value})}
                    className="w-full p-3 rounded-lg border outline-none bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                  />
              ))}
              <textarea rows="2" value={editingClient.address} onChange={(e) => setEditingClient({...editingClient, address: e.target.value})} className="w-full p-3 rounded-lg border outline-none bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-white"></textarea>
              <button onClick={handleUpdate} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 gap-2 flex justify-center"><Save size={18} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;