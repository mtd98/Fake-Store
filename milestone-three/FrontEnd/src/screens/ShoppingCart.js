import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, Dimensions, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';


import { incrementQuantity, decrementQuantity, addOrder, clearCart, updateTotalNewOrders } from '../components/Store';
import CustomModal from "../components/Modal";
import { Title } from '../components/Title';
import { backgroundColour, borderColour } from '../constants/Color';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

function ShoppingCart () {
  const cartItems = useSelector(state => state.cart.cartItems);
  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.token);
  const userId = useSelector(state => state.user.id);

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * Number(item.quantity)), 0);
  const totalItems = cartItems.reduce((total, item) => total + Number(item.quantity), 0);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  const togglePopup = (msg = "") => {
    setMessage(msg);
    setPopupVisible(!isPopupVisible);
  };

  const handleCheckout = async () => {
    console.log("Handle checkout function called");
    try {
      const requestBody = {
        items: cartItems
      };
      //console.log("Request Body:", requestBody);

      const response = await fetch('http://192.168.0.149:3000/orders/neworder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
      //console.log('Response', responseData);
      if (responseData.status === 'OK') {
        //console.log("Order Created successful")
        dispatch(addOrder(responseData.order));

        dispatch(clearCart());
        //console.log("Cart after clearing:", cartItems);
        togglePopup("A new order has been created");
      } else {
        console.log('Creating Order failed:', responseData.message);
        togglePopup(responseData.message);
      }
    } catch (error) {
      console.error('Error during Order:', error);
      togglePopup("An error occurred. Please try again.");
    }
  };

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
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <Title text={"Shopping Cart"}/>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your Cart is Empty</Text>
        ):(
          <View>
            <View style={styles.itemContainer}>
              <Text style={styles.cartHeaderText}>Cart Total Price: ${totalPrice.toFixed(2)}</Text>
              <Text style={styles.cartHeaderText}>Item Total:{totalItems}</Text>
              <FlatList 
                data={cartItems}
                renderItem={renderItem} 
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Button title="Check Out" onPress={handleCheckout}/>
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