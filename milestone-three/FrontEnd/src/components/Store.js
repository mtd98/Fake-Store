import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  name: '',
  email: '',
  token: '',
  //cartItems: [],
  //totalItems: 0,
  //totalPrice: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
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

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export default store;

/*
const ADD_TO_CART = 'ADD_TO_CART';
const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';
const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

export const addToCart = (item, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { ...item, quantity, totalPrice: item.price * quantity},
});

export const updateCartItemQuantity = (itemId, quantity) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: { itemId, quantity },
});

export const incrementQuantity = (itemId) => ({
  type: INCREMENT_QUANTITY,
  payload: itemId,
});

export const decrementQuantity = (itemId) => ({
  type: DECREMENT_QUANTITY,
  payload: itemId,
});

export const removeFromCart = (itemId) => ({ 
  type: REMOVE_FROM_CART,
  payload: itemId,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex !== -1) {
        const updatedCartItems = state.cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + action.payload.quantity,
              totalPrice: (item.quantity + action.payload.quantity) * item.price
            };
          }
        return item;
      });
      const totalQuantity = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updateCartItems.reduce((total, item) => total + item.totalPrice, 0);
      console.log(totalPrice)
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: totalQuantity,
        totalPrice: totalPrice,
      };
    } else {
      const updatedCartItems = [...state.cartItems, action.payload];
      const totalQuantity = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = updatedCartItems.reduce((total, item) => total + item.totalPrice, 0);
      console.log(totalPrice)
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: totalQuantity,
        totalPrice: totalPrice,
        
      };
    }

    case UPDATE_CART_ITEM_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload.itemId ? { ...item, quantity: action.payload.quantity } : item
        ),
        totalItems: state.cartItems.reduce((total, item) => total + item.quantity, 0),
      };

    case INCREMENT_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
        totalItems: state.totalItems + 1,
      };

    case DECREMENT_QUANTITY:
      const updatedCartItems = state.cartItems.map(item =>
        item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0);  
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: state.totalItems > 0 ? state.totalItems - 1 : 0,
      };

    default:
      return state;
  };
};

const store = configureStore({
  reducer: {
    cart: reducer,
  },
});

export default store;*/