import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    email: '',
    token: '',
  },
  reducers: {
    signInSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    },
    updateUserProfile(state, action) {
      return {
        ...state,
        name: action.payload.name,
      }
    },
    signOut(state) {
      return {
        ...initialState,
      };
    },
  },
});

export const { signInSuccess, updateUserProfile, signOut } = userSlice.actions;

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        state.cartItems.push({...action.payload, quantity: quantity || 1});
      }      
    },
    incrementQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity++;
      }
    },
    decrementQuantity: (state, action) => {
      const { id } = action.payload;
      const itemIndex = state.cartItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.cartItems.splice(itemIndex, 1);
        }
      }
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

const reducer = {
  user: userSlice.reducer,
  cart: cartSlice.reducer,
};

const store = configureStore({
  reducer,
});

export default store;