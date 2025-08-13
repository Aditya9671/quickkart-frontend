import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { myOrders } from '../slices/orderSlice.js'

export default function Orders(){
  const dispatch = useDispatch()
  const { user } = useSelector(s=>s.auth)
  const { list } = useSelector(s=>s.orders)

  useEffect(()=>{ if (user) dispatch(myOrders()) }, [dispatch, user])

  if (!user) return <p>Please login to see orders.</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {list.map(o => (
        <div key={o._id} className="card">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">Order #{o._id.slice(-6)}</p>
              <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p>Status: <span className="font-semibold">{o.status}</span></p>
              <p>Paid: {o.isPaid ? 'Yes' : 'No'}</p>
              <p>Delivered: {o.isDelivered ? 'Yes' : 'No'}</p>
            </div>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {o.orderItems.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <img src={it.image} className="w-14 h-14 rounded-lg bg-gray-100 object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-sm text-gray-500">{it.qty} × ₹{Number(it.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
