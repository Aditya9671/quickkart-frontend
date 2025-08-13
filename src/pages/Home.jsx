import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../slices/productSlice.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Home(){
  const dispatch = useDispatch()
  const { items, page, pages, status } = useSelector(s=>s.products)
  const [keyword, setKeyword] = useState('')

  useEffect(()=>{ dispatch(fetchProducts({})) }, [dispatch])

  const search = (e) => {
    e.preventDefault()
    dispatch(fetchProducts({ keyword }))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={search} className="flex gap-2">
        <input className="input" placeholder="Search products..." value={keyword} onChange={e=>setKeyword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      {status==='loading' ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(p => <ProductCard key={p._id} p={p} />)}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button className="btn btn-outline" disabled={page<=1} onClick={()=>dispatch(fetchProducts({ page: page-1, keyword }))}>Prev</button>
        <span className="text-sm">Page {page} of {pages}</span>
        <button className="btn btn-outline" disabled={page>=pages} onClick={()=>dispatch(fetchProducts({ page: page+1, keyword }))}>Next</button>
      </div>
    </div>
  )
}
