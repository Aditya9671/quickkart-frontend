import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/api.js'

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}, thunkAPI) => {
  try {
    const { keyword='', page=1, category='', brand='' } = params
    const { data } = await api.get(`/api/products?keyword=${keyword}&page=${page}&category=${category}&brand=${brand}`)
    return data
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data?.message || e.message)
  }
})

export const fetchProduct = createAsyncThunk('products/get', async (id, thunkAPI) => {
  try { const { data } = await api.get(`/api/products/${id}`); return data }
  catch (e) { return thunkAPI.rejectWithValue(e.response?.data?.message || e.message) }
})

const slice = createSlice({
  name: 'products',
  initialState: { items: [], page: 1, pages: 1, count: 0, current: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.fulfilled, (s,a)=>{ s.items=a.payload.products; s.page=a.payload.page; s.pages=a.payload.pages; s.count=a.payload.count })
     .addCase(fetchProduct.fulfilled, (s,a)=>{ s.current=a.payload })
     .addMatcher((a)=>a.type.startsWith('products/') && a.type.endsWith('/pending'), (s)=>{ s.status='loading'; s.error=null })
     .addMatcher((a)=>a.type.startsWith('products/') && a.type.endsWith('/rejected'), (s,a)=>{ s.status='failed'; s.error=a.payload })
     .addMatcher((a)=>a.type.startsWith('products/') && a.type.endsWith('/fulfilled'), (s)=>{ s.status='succeeded' })
  }
})
export default slice.reducer
