import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../slices/authSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { status, error } = useSelector(s=>s.auth)
  const nav = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    const res = await dispatch(register({ name, email, password }))
    if (res.meta.requestStatus==='fulfilled') nav('/')
  }

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn btn-primary w-full" disabled={status==='loading'}>Sign Up</button>
      </form>
    </div>
  )
}
