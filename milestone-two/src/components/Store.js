import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalItems: 0,
};

const ADD_TO_CART = 'ADD_TO_CART';
const UPDATE_CART_ITEM_QUANTITY = 'UPDATE_CART_ITEM_QUANTITY';

export const addToCart = (item, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { ...item, quantity}
});

export const updateCartItemQuantity = (itemId, quantity) => ({
  type: UPDATE_CART_ITEM_QUANTITY,
  payload: { itemId, quantity },
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
              quantity: item.quantity + action.payload.quantity
            };
          }
        return item;
      });
      
      const totalQuantity = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: totalQuantity,
      };
    } else {
      const updatedCartItems = [...state.cartItems, action.payload];
      const totalQuantity = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: totalQuantity,
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
    default:
      return state;
  };
};

const store = configureStore({
  reducer: {
    cart: reducer,
  },
});

export default store;