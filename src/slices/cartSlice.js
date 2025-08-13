import { createSlice } from '@reduxjs/toolkit'

const cartFromStorage = JSON.parse(localStorage.getItem('qk_cart') || '[]')

const slice = createSlice({
  name: 'cart',
  initialState: { items: cartFromStorage },
  reducers: {
    addToCart: (s, a) => {
      const item = a.payload
      const exist = s.items.find(i => i.product === item.product)
      if (exist) exist.qty = Math.min(exist.qty + item.qty, 10)
      else s.items.push(item)
      localStorage.setItem('qk_cart', JSON.stringify(s.items))
    },
    updateQty: (s, a) => {
      const { product, qty } = a.payload
      const it = s.items.find(i => i.product === product)
      if (it) it.qty = qty
      localStorage.setItem('qk_cart', JSON.stringify(s.items))
    },
    removeFromCart: (s, a) => {
      s.items = s.items.filter(i => i.product !== a.payload)
      localStorage.setItem('qk_cart', JSON.stringify(s.items))
    },
    clearCart: (s) => { s.items = []; localStorage.removeItem('qk_cart') }
  }
})

export const { addToCart, updateQty, removeFromCart, clearCart } = slice.actions
export default slice.reducer
