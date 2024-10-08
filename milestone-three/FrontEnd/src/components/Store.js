import { configureStore, createSlice, createAsyncThunk, getDefaultMiddleware } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (token) => {
  const response = await fetch('http://192.168.0.149:3000/Cart', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  const data = await response.json();
  console.log('Fetched cart data:', data);
  return data;
});

export const saveCart = createAsyncThunk('cart/saveCart', async ({ token, cartItems }) => {
  console.log('Saving cart:', cartItems);
  const response = await fetch('http://192.168.0.149:3000/Cart', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items: cartItems }),
  });
  if (!response.ok) {
    throw new Error('Failed to save cart');
  }
  const data = await response.json();
  console.log("Saved cart data:", data);
  return data;
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (token) => {
  console.log("Fetch Orders called");
  const response = await fetch('http://192.168.0.149:3000/orders/all', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const responseData = await response.json();
  return responseData.orders;
});


const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    name: '',
    email: '',
    token: '',
    isLoggedIn: false,
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
      state.name = action.payload.name;
    },
    signOut(state) {
      state.id = null;
      state.name = '';
      state.email = '';
      state.token = '';
      state.isLoggedIn = false;
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
    setCart: (state, action) => {
      //console.log('Setting cart with items:', action.payload);
      state.cartItems = action.payload;
    },
    addToCart: (state, action) => {
      //console.log('Adding to cart:', action.payload);
      const { id } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({...action.payload, quantity: 1});
      }      
    },
    incrementQuantity: (state, action) => {
      const { id } = action.payload;
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const { id } = action.payload;
      const itemIndex = state.cartItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        const item = state.cartItems[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems.splice(itemIndex, 1);
        }
      }
    },
    clearCart: (state) => {
      //console.log('Clearing cart');
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userSlice.actions.signOut, (state => {
      //console.log('Sign out - Clearing cart');
      state.cartItems = [];
    }));
  },
});

export const { setCart, addToCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    totalNewOrders: 0,
  },
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      console.log("Add Order called");
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.totalNewOrders = action.payload.filter(order => !order.is_paid && !order.is_delivered).length;
      console.log("Set Orders called");
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
      state.totalNewOrders = action.payload.filter(order => !order.is_paid && !order.is_delivered).length;
    })
    .addCase(userSlice.actions.signOut, (state) => {
      console.log("Sign out - clearing orders");
      state.orders = [];
      state.totalNewOrders = 0;
    })
  }
});

export const { addOrder, setOrders } = orderSlice.actions;

const reducer = {
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  order: orderSlice.reducer,
};

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    thunk: true,
  }),
});

export default store;