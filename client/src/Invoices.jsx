import { useState, useEffect } from 'react';
import { Plus, Trash2, Printer, Save, FileText, User } from 'lucide-react';
import axios from 'axios';

const Invoices = () => {
  const [clients, setClients] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState([{ id: 1, product: '', price: 0, qty: 1, total: 0 }]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/clients').then(res => setClients(res.data));
    axios.get('http://localhost:3001/products').then(res => setProducts(res.data));
  }, []);

  const addItem = () => setItems([...items, { id: Date.now(), product: '', price: 0, qty: 1, total: 0 }]);
  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  const handleProductSelect = (id, name) => {
    const p = products.find(x => x.name === name);
    const newItems = items.map(item => item.id === id ? { ...item, product: name, price: p ? p.price : 0, total: (p ? p.price : 0) * item.qty } : item);
    setItems(newItems);
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value, total: value * (field === 'qty' ? item.price : item.qty) } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const finalTotal = subtotal - discount;

  const handleSave = () => {
    if (!customer) return alert("Select Client");
    axios.post('http://localhost:3001/add-invoice', { client_name: customer, total_amount: finalTotal, items })
         .then(res => { if(res.data.message) { alert("✅ Saved"); setItems([{ id: Date.now(), product: '', price: 0, qty: 1, total: 0 }]); setDiscount(0); setCustomer(''); }});
  };

  return (
    <div className="p-8 min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 print:bg-white print:text-black print:p-0">
      <datalist id="productOptions">{products.map(p => <option key={p.id} value={p.name}>${p.price}</option>)}</datalist>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 print:block print:w-full">
        
        {/* Invoice Paper */}
        <div className="lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 print:shadow-none print:border-none print:bg-white">
          
          <div className="p-8 border-b flex justify-between items-start border-slate-100 dark:border-slate-700 print:border-slate-200">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white print:text-black"><FileText className="text-blue-600" /> INVOICE</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Decent Marble</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400 print:text-black">Date Issued</p>
              <p className="font-bold text-slate-800 dark:text-white print:text-black">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="p-8 border-b bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 print:bg-white print:border-slate-200">
            <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400 print:text-black">Bill To</label>
            <div className="relative">
               <User className="absolute left-4 top-3.5 text-slate-400 print:hidden" size={18} />
               <select className="w-full pl-12 pr-4 py-3 rounded-xl outline-none font-medium appearance-none bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white print:border-none print:pl-0 print:text-xl print:font-bold print:bg-white print:text-black"
                 value={customer} onChange={(e) => setCustomer(e.target.value)}>
                 <option value="">Select Client...</option>
                 {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
               </select>
            </div>
          </div>

          <div className="p-8 print:p-4">
            <table className="w-full mb-6">
              <thead>
                <tr className="text-left text-xs font-bold uppercase border-b text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700 print:border-slate-200 print:text-black">
                  <th className="pb-3 w-5/12">Product</th><th className="pb-3 w-2/12">Price</th><th className="pb-3 w-2/12">Qty</th><th className="pb-3 w-2/12">Total</th><th className="pb-3 w-1/12 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700 print:divide-slate-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4"><input list="productOptions" type="text" placeholder="Item" className="w-full font-bold outline-none bg-transparent text-slate-700 dark:text-white print:text-black" value={item.product} onChange={(e) => handleProductSelect(item.id, e.target.value)}/></td>
                    <td className="py-4"><input type="number" className="w-20 p-2 rounded-lg outline-none bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 print:bg-white print:text-black print:p-0" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}/></td>
                    <td className="py-4"><input type="number" className="w-20 p-2 rounded-lg outline-none bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 print:bg-white print:text-black print:p-0" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}/></td>
                    <td className="py-4 font-bold text-slate-800 dark:text-white print:text-black">${item.total}</td>
                    <td className="py-4 text-right print:hidden"><button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 print:hidden"><Plus size={18} /> Add Item</button>
            
            {/* PRINT SUMMARY */}
            <div className="hidden print:block mt-8 border-t pt-4 border-slate-200 text-right">
                <p>Subtotal: ${subtotal}</p><p>Discount: -${discount}</p><p className="font-bold text-xl mt-2">Total: ${finalTotal}</p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="lg:col-span-1 space-y-6 print:hidden">
          <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="font-bold mb-6 text-slate-800 dark:text-white">Summary</h3>
            <div className="flex justify-between items-center mb-4 text-slate-500 dark:text-slate-400"><span>Discount ($)</span><input type="number" className="w-20 text-right p-1 rounded border outline-none bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-900 dark:border-slate-600 dark:text-white" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value)||0)}/></div>
            <div className="flex justify-between items-center mb-8"><span className="font-bold text-lg text-slate-800 dark:text-white">Total</span><span className="font-bold text-2xl text-blue-600 dark:text-blue-400">${finalTotal}</span></div>
            <button onClick={handleSave} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 mb-3 flex justify-center gap-2"><Save size={20} /> Save</button>
            <button onClick={() => window.print()} className="w-full py-4 border font-bold rounded-xl hover:bg-slate-50 flex justify-center gap-2 bg-white border-slate-200 text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:hover:bg-slate-600"><Printer size={20} /> Print</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Invoices;