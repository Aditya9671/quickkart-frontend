import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../slices/authSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('demo@quickkart.dev')
  const [password, setPassword] = useState('Demo@123')
  const dispatch = useDispatch()
  const { status, error, user } = useSelector(s=>s.auth)
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    const res = await dispatch(login({ email, password }))
    if (res.meta.requestStatus==='fulfilled') nav('/')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={status==='loading'}>Login</button>
      </form>
    </div>
  )
}
