import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice.js'

export default function Navbar(){
  const { user } = useSelector(s=>s.auth)
  const cartCount = useSelector(s=>s.cart.items.reduce((a,c)=>a+c.qty,0))
  const dispatch = useDispatch()
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-2xl font-bold">QuickKart</Link>
        <nav className="flex items-center gap-4">
          <Link to="/cart" className="btn btn-outline">Cart ({cartCount})</Link>
          {user ? (
            <>
              <Link to="/orders" className="btn btn-outline">My Orders</Link>
              {user.isAdmin && <Link to="/admin" className="btn btn-outline">Admin</Link>}
              <button onClick={()=>dispatch(logout())} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
