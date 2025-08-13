import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/api.js'

const userFromStorage = JSON.parse(localStorage.getItem('qk_user') || 'null')

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try { const { data } = await api.post('/api/auth/register', payload); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})
export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try { const { data } = await api.post('/api/auth/login', payload); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try { const { data } = await api.post('/api/auth/logout'); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: userFromStorage, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (s, a) => { s.user = a.payload; localStorage.setItem('qk_user', JSON.stringify(a.payload)) })
      .addCase(login.fulfilled, (s, a) => { s.user = a.payload; localStorage.setItem('qk_user', JSON.stringify(a.payload)) })
      .addCase(logout.fulfilled, (s) => { s.user = null; localStorage.removeItem('qk_user') })
      .addMatcher((a) => a.type.endsWith('/pending'), (s) => { s.status = 'loading'; s.error = null })
      .addMatcher((a) => a.type.endsWith('/rejected'), (s, a) => { s.status = 'failed'; s.error = a.payload || 'Error' })
      .addMatcher((a) => a.type.endsWith('/fulfilled'), (s) => { s.status = 'succeeded' })
  }
})
export default slice.reducer
