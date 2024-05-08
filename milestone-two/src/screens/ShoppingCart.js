import { StyleSheet, Text, View, FlatList, Button, Image, Dimensions, } from 'react-native';
import { connect } from 'react-redux';
import store from '../components/Store';

const { width, height } = Dimensions.get('window');

function ShoppingCart ({cartItems}) {
  store.subscribe(() => {
    const state = store.getState(); 
    console.log('Total items in cart:', state.cart.totalItems);
  });
  
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.image} source={{uri: item.image,}}/>
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ${item.price}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
        <View style={styles.buttonContainer}>
          <Button title="+" onPress={() => dispatch({ type: 'INCREMENT_QUANTITY', payload: item.id })} />
          <View style={styles.buttonSpace} />
          <Button title="-" onPress={() => dispatch({ type: 'DECREMENT_QUANTITY', payload: item.id })} />
        </View>
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
    {cartItems.length === 0 ? (
      <Text style={styles.emptyText}>Cart Empty</Text>
    ):(
      <View>
        <Text style={styles.cartHeaderText}>Cart Items</Text>
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
  //console.log('Redux state', state);
  return {
    cartItems: state.cart.cartItems,
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
  },
  cartHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpace: {
    width: 10,
  }
});
export default connect(mapStateToProps)(ShoppingCart);

