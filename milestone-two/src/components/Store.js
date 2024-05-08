import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const ADD_TO_CART = 'ADD_TO_CART';

export const addToCart = (item, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { ...item, quantity}
  
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    cart: reducer,
    },
  });

export default store;
