import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';
import store from '../components/Store';



function ShoppingCart ({cartItems}) {
  console.log('cart items:', cartItems);
  
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.price}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Button title="+" onPress={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: item.id })} />
      <Button title="-" onPress={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: item.id })} />
    </View>
  );


  return (
    <View>
    {cartItems.length === 0 ? (
      <Text>Cart Empty</Text>
    ):(
      <View>
        <Text>Cart Items</Text>
        <FlatList 
          data={cartItems}
          renderItem={renderItem} 
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )}
    </View>
  );
}

const mapStateToProps = (state) => {
  console.log('Redux state', state);
  return {
    cartItems: state.cart.cartItems,
  }
};

export default connect(mapStateToProps)(ShoppingCart);

