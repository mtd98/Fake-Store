import { StyleSheet, Text, View, FlatList, Button, Image, Dimensions, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';


import { incrementQuantity, decrementQuantity } from '../components/Store';
import { Title } from '../components/Title';
import { backgroundColour, borderColour } from '../constants/Color';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

function ShoppingCart () {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * Number(item.quantity)), 0);
  const totalItems = cartItems.reduce((total, item) => total + Number(item.quantity), 0);

  const renderItem = ({ item }) => (
    <View style={styles.listContainer}>
      <Image style={styles.image} source={{uri: item.image,}}/>
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ${item.price}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <View style={styles.buttonContainer}>
          <Button title="+" onPress={() => dispatch(incrementQuantity({ id: item.id }))} />
          <View style={styles.buttonSpace} />
          <Button title="-" onPress={() => dispatch(decrementQuantity({ id: item.id }))} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Title text={"Shopping Cart"}/>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
        ):(
          <View style={styles.itemContainer}>
            <Text style={styles.cartHeaderText}>Cart Total Price: ${totalPrice.toFixed(2)}</Text>
            <Text style={styles.cartHeaderText}>Item Total:{totalItems}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColour,
    paddingTop: 40,
    alignItems: "center",
  },
  itemContainer: {
    margin: 10,
    height: '75%',
    width: '90%',
    borderWidth: 2,
    borderColor: borderColour,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: isWeb ? 34 : width * 0.07,
    marginTop: isWeb ? 34 : width * 0.07,
    textAlign: 'center',
  },
  cartHeaderText: {
    fontSize: isWeb ? 34 : width * 0.07,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: isWeb ? 170 : width * 0.15,
    aspectRatio: 1,
    marginRight: 10,
    borderRadius: 5,
  },
  itemDetails: {
    flex: 1,
  },
  title: {
    fontSize: isWeb ? 34 : width * 0.035,
    fontWeight: 'bold',
  },
  price: {
    fontSize: isWeb ? 25 : width * 0.035,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    fontSize: isWeb ? 25 : width * 0.035,
    flexDirection: isWeb ? 'row' : 'column',
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

export default ShoppingCart;