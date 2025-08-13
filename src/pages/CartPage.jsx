import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateQty } from '../slices/cartSlice.js'

export default function CartPage(){
  const { items } = useSelector(s=>s.cart)
  const nav = useNavigate()
  const dispatch = useDispatch()
  const total = items.reduce((a,c)=>a + c.price*c.qty, 0)

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {items.length===0 ? <p>Your cart is empty. <Link to="/" className="underline">Go shopping</Link></p> :
          items.map(it => (
            <div key={it.product} className="card flex items-center gap-4">
              <img src={it.image} className="w-20 h-20 object-cover rounded-xl bg-gray-100" />
              <div className="flex-1">
                <p className="font-semibold">{it.name}</p>
                <p className="text-sm text-gray-500">₹{Number(it.price).toFixed(2)}</p>
              </div>
              <select className="input w-24" value={it.qty} onChange={e=>dispatch(updateQty({ product: it.product, qty: Number(e.target.value) }))}>
                {Array.from({ length: 10 }).map((_,i)=> <option key={i+1}>{i+1}</option>)}
              </select>
              <button className="btn btn-outline" onClick={()=>dispatch(removeFromCart(it.product))}>Remove</button>
            </div>
          ))
        }
      </div>
      <div className="card space-y-3 h-max">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <p>Items: {items.length}</p>
        <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
        <button className="btn btn-primary w-full" disabled={items.length===0} onClick={()=>nav('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  )
}
