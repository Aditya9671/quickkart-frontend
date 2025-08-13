import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/api.js'

export const createOrder = createAsyncThunk('orders/create', async (payload, thunkAPI) => {
  try { const { data } = await api.post('/api/orders', payload, { headers: { Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}` } }); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})
export const payOrder = createAsyncThunk('orders/pay', async (orderId, thunkAPI) => {
  try { const { data } = await api.post(`/api/orders/${orderId}/pay`, {}, { headers: { Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}` } }); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})
export const myOrders = createAsyncThunk('orders/my', async (_, thunkAPI) => {
  try { const { data } = await api.get('/api/orders/my', { headers: { Authorization: `Bearer ${thunkAPI.getState().auth.user?.token}` } }); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const slice = createSlice({
  name: 'orders',
  initialState: { list: [], current: null, status: 'idle', error: null },
  reducers: {
    setCurrentOrder: (s, a) => { s.current = a.payload }
  },
  extraReducers: (b) => {
    b.addCase(createOrder.fulfilled, (s,a)=>{ s.current = a.payload })
     .addCase(myOrders.fulfilled, (s,a)=>{ s.list = a.payload })
     .addMatcher((a)=>a.type.startsWith('orders/') && a.type.endsWith('/pending'), (s)=>{ s.status='loading'; s.error=null })
     .addMatcher((a)=>a.type.startsWith('orders/') && a.type.endsWith('/rejected'), (s,a)=>{ s.status='failed'; s.error=a.payload })
     .addMatcher((a)=>a.type.startsWith('orders/') && a.type.endsWith('/fulfilled'), (s)=>{ s.status='succeeded' })
  }
})

export const { setCurrentOrder } = slice.actions
export default slice.reducer
