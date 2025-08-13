import { useEffect, useState } from 'react'
import api from '../lib/api.js'
import { useSelector } from 'react-redux'

export default function Admin(){
  const { user } = useSelector(s=>s.auth)
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name:'', brand:'', category:'', description:'', price:0, countInStock:0, images:[] })
  const token = user?.token

  const load = async () => {
    const { data } = await api.get('/api/products')
    setProducts(data.products)
  }

  useEffect(()=>{ load() }, [])

  const submit = async (e)=>{
    e.preventDefault()
    await api.post('/api/products', form, { headers: { Authorization: `Bearer ${token}` } })
    setForm({ name:'', brand:'', category:'', description:'', price:0, countInStock:0, images:[] })
    await load()
  }

  const del = async (id)=>{
    await api.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    await load()
  }

  const onImageUpload = async (file) => {
    const fd = new FormData()
    fd.append('image', file)
    const { data } = await api.post('/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setForm(prev => ({ ...prev, images: [...prev.images, data.url] }))
  }

  if (!user?.isAdmin) return <p>Admin access only.</p>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Add Product</h2>
        <form onSubmit={submit} className="space-y-2">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Brand" value={form.brand} onChange={e=>setForm({...form, brand: e.target.value})} />
            <input className="input" placeholder="Category" value={form.category} onChange={e=>setForm({...form, category: e.target.value})} />
          </div>
          <textarea className="input" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
          <div className="grid grid-cols-2 gap-2">
            <input className="input" type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price: Number(e.target.value)})} />
            <input className="input" type="number" placeholder="Stock" value={form.countInStock} onChange={e=>setForm({...form, countInStock: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
            <input type="file" onChange={e=>onImageUpload(e.target.files[0])} />
            <div className="flex gap-2">
              {form.images.map((img,i)=>(<img key={i} src={img} className="w-14 h-14 object-cover rounded-lg border" />))}
            </div>
          </div>
          <button className="btn btn-primary w-full" type="submit">Create</button>
        </form>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-bold">Products</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {products.map(p => (
            <div key={p._id} className="card">
              <div className="flex gap-3">
                <img src={p.images?.[0]} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">₹{Number(p.price).toFixed(2)} · Stock {p.countInStock}</p>
                </div>
                <button className="btn btn-outline" onClick={()=>del(p._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
