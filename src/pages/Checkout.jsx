import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { createOrder, payOrder, setCurrentOrder } from '../slices/orderSlice.js'
import { clearCart } from '../slices/cartSlice.js'

export default function Checkout(){
  const { items } = useSelector(s=>s.cart)
  const { user } = useSelector(s=>s.auth)
  const { current } = useSelector(s=>s.orders)
  const dispatch = useDispatch()
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' })
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const prices = {
    itemsPrice: Number(items.reduce((a,c)=>a + c.price*c.qty, 0).toFixed(2)),
    shippingPrice: items.length ? 4.99 : 0,
    taxPrice: 0,
  }
  const totalPrice = Number((prices.itemsPrice + prices.shippingPrice + prices.taxPrice).toFixed(2))

  const placeOrder = async ()=>{
    const payload = {
      orderItems: items,
      shippingAddress: address,
      paymentMethod,
      ...prices,
      totalPrice
    }
    const res = await dispatch(createOrder(payload))
    if (res.meta.requestStatus==='fulfilled'){
      dispatch(clearCart())
      dispatch(setCurrentOrder(res.payload))
    }
  }

  const doPay = async ()=>{
    if (!current) return
    const res = await dispatch(payOrder(current._id))
    // No UI for card entry here, backend mocks payment if Stripe not set.
    alert(res.payload?.message || 'Paid')
  }

  if (!user) return <p>Please login to checkout.</p>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Shipping</h2>
        <input className="input" placeholder="Address" value={address.address} onChange={e=>setAddress({...address, address:e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="City" value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} />
          <input className="input" placeholder="Postal Code" value={address.postalCode} onChange={e=>setAddress({...address, postalCode:e.target.value})} />
        </div>
        <input className="input" placeholder="Country" value={address.country} onChange={e=>setAddress({...address, country:e.target.value})} />
        <div>
          <label className="mr-3">Payment</label>
          <select className="input" value={paymentMethod} onChange={e=>setPaymentMethod(e.target.value)}>
            <option>COD</option>
            <option>Card</option>
          </select>
        </div>
      </div>
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Summary</h2>
        <p>Items: ₹{prices.itemsPrice.toFixed(2)}</p>
        <p>Shipping: ₹{prices.shippingPrice.toFixed(2)}</p>
        <p>Tax: ₹{prices.taxPrice.toFixed(2)}</p>
        <p className="font-bold">Total: ₹{totalPrice.toFixed(2)}</p>
        <button className="btn btn-primary w-full" onClick={placeOrder}>Place Order</button>
        {current && <button className="btn btn-outline w-full" onClick={doPay}>Pay Now</button>}
      </div>
    </div>
  )
}
