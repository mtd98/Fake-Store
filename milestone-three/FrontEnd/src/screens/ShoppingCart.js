import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { StyleSheet, Text, View, FlatList, Button, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { incrementQuantity, decrementQuantity, clearCart,  saveCart, fetchCart, addOrder, fetchOrders } from '../components/Store';
import CustomModal from "../components/Modal";
import { Title } from '../components/Title';
import { backgroundColour, borderColour, buttonColour, mainComponentColour, textColour, secondaryTextColour } from '../constants/Color';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

function ShoppingCart () {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const userToken = useSelector(state => state.user.token);
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * Number(item.quantity)), 0);
  const totalItems = cartItems.reduce((total, item) => total + Number(item.quantity), 0);

  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userToken) {
      dispatch(fetchCart(userToken));
    }
  }, [userToken, dispatch]);

  useEffect(() => {
    const saveCartItems = async () => {
      dispatch(saveCart({token: userToken, cartItems}));
    }
  }, [cartItems, dispatch, userToken]);

  const togglePopup = (msg = "") => {
    setMessage(msg);
    setPopupVisible(!isPopupVisible);
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity({ id }));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity({ id }));
  };

  const handleCheckout = async () => {
    try {
      const requestBody = {
        items: cartItems
      };
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
      if (responseData.status === 'OK') {
        dispatch(addOrder(responseData.order));
        dispatch(clearCart());
        dispatch(saveCart({ token: userToken, cartItems: []}));
        dispatch(fetchOrders(userToken));
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
      <Image style={styles.image} source={{uri: item.image}}/>
      <View style={styles.itemDetails}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>Price: ${item.price}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <View style={styles.buttonContainer}>
          <Button title="+" onPress={() => handleIncrement(item.id)} />
          <View style={styles.buttonSpace} />
          <Button title="-" onPress={() => handleDecrement(item.id)} />
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
          <View style={styles.contentContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.cartHeaderText}>Cart Total Price: ${totalPrice.toFixed(2)}</Text>
              <Text style={styles.cartHeaderText}>Item Total:{totalItems}</Text>
              <FlatList 
                data={cartItems}
                renderItem={renderItem} 
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Check Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColour,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    alignItems: "center",
  },  
  itemContainer: {
    flex: 1,
    margin: 10,
    width: '90%',
    borderWidth: 2,
    borderColor: borderColour,
    padding: 10,
    backgroundColor: mainComponentColour,
    borderRadius: 10,
  },
  contentContainer: {
    flex: 1,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
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
    borderColor: borderColour,
    borderWidth: 1,
    width: '100%',
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
    fontSize: isWeb ? 30 : width * 0.035,
    fontWeight: 'bold',
    color: secondaryTextColour,
  },
  price: {
    fontSize: isWeb ? 25 : width * 0.035,
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
  },
  checkoutButton: {
    backgroundColor: buttonColour,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  checkoutButtonText: {
    fontSize: isWeb ? 25 : width * 0.05,
    color: textColour,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default ShoppingCart;