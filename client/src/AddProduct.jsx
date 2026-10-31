import { useState } from 'react';
import { Upload, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', stock: '', description: '', cost_price: '', image_url: '' 
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image_url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if(!formData.name || !formData.price || !formData.stock) return alert("Fill required fields");
    axios.post('http://localhost:3001/add-product', formData)
      .then((res) => {
          if(res.data.success) { alert("✅ Saved"); navigate('/inventory'); } 
          else alert("❌ " + res.data.message);
      });
  };

  // Reusable Input Class to save space
  const inputClass = "w-full p-3 rounded-xl border outline-none font-medium transition-colors bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder-slate-600";

  return (
    <div className="p-8 min-h-screen flex justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => navigate('/inventory')} className="p-2 rounded-full shadow-sm border transition bg-white border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
             <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
           </button>
           <div>
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Product</h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm">Create a new stock item.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <div className="lg:col-span-2 space-y-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Product Name</label>
                    <input name="name" onChange={handleChange} type="text" placeholder="e.g. Carrara White" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Category</label>
                      <select name="category" onChange={handleChange} className={inputClass}>
                        <option value="">Select Category</option>
                        <option value="Marble">Marble</option>
                        <option value="Granite">Granite</option>
                        <option value="Travertine">Travertine</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Stock Qty</label>
                      <input name="stock" onChange={handleChange} type="number" placeholder="0" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Description</label>
                    <textarea name="description" onChange={handleChange} rows="4" className={inputClass}></textarea>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl shadow-sm border bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Selling Price</label>
                      <input name="price" onChange={handleChange} type="number" placeholder="0.00" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-slate-500 dark:text-slate-400">Cost Price</label>
                      <input name="cost_price" onChange={handleChange} type="number" placeholder="0.00" className={inputClass} />
                    </div>
                </div>
              </div>
           </div>

           {/* Image Upload */}
           <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl shadow-sm border sticky top-6 bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                 <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Product Image</h3>
                 <div className="relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition
                                 bg-slate-50 border-slate-300 hover:bg-slate-100 
                                 dark:bg-slate-900 dark:border-slate-600 dark:hover:bg-slate-900/80 dark:hover:border-blue-500">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <Upload size={32} className="mb-2 text-slate-400" />
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Upload Image</span>
                        <input type="file" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                 </div>
                 <button onClick={handleSave} className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                    <Save size={20} /> Save Product
                 </button>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;