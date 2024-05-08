import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  totalItems: 0,
};

const ADD_TO_CART = 'ADD_TO_CART';

export const addToCart = (item, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { ...item, quantity}
  
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const updatedCartItems = [...state.cartItems, action.payload];
      const totalQuantity = updatedCartItems.reduce((total, item) => total + item.quantity, 0);
      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: totalQuantity,
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
