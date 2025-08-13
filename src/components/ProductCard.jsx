import { Link } from 'react-router-dom'

export default function ProductCard({ p }){
  return (
    <div className="card">
      <Link to={`/product/${p._id}`}>
        <div className="aspect-[4/3] bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
          {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="object-cover w-full h-full"/> : <span className="text-gray-400">No Image</span>}
        </div>
      </Link>
      <div className="space-y-1">
        <h3 className="font-semibold">{p.name}</h3>
        <p className="text-sm text-gray-500">{p.brand} · {p.category}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold">₹{Number(p.price).toFixed(2)}</span>
          <Link to={`/product/${p._id}`} className="btn btn-primary">View</Link>
        </div>
      </div>
    </div>
  )
}
