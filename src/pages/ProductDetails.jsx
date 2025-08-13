import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../slices/productSlice.js'
import { addToCart } from '../slices/cartSlice.js'

export default function ProductDetails(){
  const { id } = useParams()
  const dispatch = useDispatch()
  const { current: p } = useSelector(s=>s.products)
  const [qty, setQty] = useState(1)

  useEffect(()=>{ dispatch(fetchProduct(id)) }, [dispatch, id])

  if (!p) return <p>Loading...</p>
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card">
        <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full"/> : <span className="text-gray-400">No Image</span>}
        </div>
        <div className="flex gap-2">
          {p.images?.slice(1,4)?.map((img,i)=> (
            <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{p.name}</h1>
        <p className="text-gray-600">{p.description}</p>
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">₹{Number(p.price).toFixed(2)}</span>
          <span className={p.countInStock>0 ? 'text-green-600' : 'text-red-600'}>
            {p.countInStock>0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label>Qty</label>
          <select className="input w-24" value={qty} onChange={e=>setQty(Number(e.target.value))}>
            {Array.from({ length: Math.min(10, p.countInStock || 10) }).map((_,i)=> <option key={i+1}>{i+1}</option>)}
          </select>
        </div>
        <button
          className="btn btn-primary"
          disabled={p.countInStock===0}
          onClick={()=>dispatch(addToCart({ product: p._id, name: p.name, price: p.price, image: p.images?.[0], qty }))}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
