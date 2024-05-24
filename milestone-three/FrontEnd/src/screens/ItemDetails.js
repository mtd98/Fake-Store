import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform, ActivityIndicator, ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from "@expo/vector-icons/Ionicons";

import { addToCart, saveCart } from '../components/Store';
import { IconButton } from '../components/IconButton';
import { Title } from '../components/Title';
import { backgroundColour } from '../constants/Color';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

function ItemDetails({ route, navigation }) {
  const {item} = route.params;

  const dispatch = useDispatch();
  const userToken = useSelector(state => state.user.token);
  const cartItems = useSelector(state => state.cart.cartItems);
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData(item);
      setLoading(false);
    }, 1000);
  }, [item]);

  const navGoBack = () => navigation.goBack();

  const handleAddToCart = async () => {
    try {
      //console.log('Item to add:', item);
      dispatch(addToCart(item));
      const updatedCartItems = [...cartItems, { ...item, quantity: 1}];
      //console.log('Updated cart items:', updatedCartItems);
      await dispatch(saveCart({ token: userToken, cartItems: updatedCartItems }));
    } catch (error) {
      console.log('Error while adding item', error);
    }
    
    /*try {
      //console.log("Item:", item);
      const requestBody = {
        items: [
          {
            id: item.id,
            price: item.price,
            count: 1,
          }
        ]
      };
      //console.log("Request Body:", requestBody);
    
      const response = await fetch('http://192.168.0.149:3000/cart', {
        method: 'PUT', 
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });
    
      const responseData = await response.json();
      //console.log('Response', responseData);
      if (response.ok) {
        //console.log("Items added to the cart successfully")
        dispatch(addToCart(item));
        //console.log(`${item.title} has been added to the cart.`);
      } else {
        console.log('Failed to add items to the cart:', responseData.error);
      }
    } catch (error) {
      console.error('Error while adding items to the cart:', error);
    }*/
  };
  
  return (
    <View style={styles.container}>
      <Title text={"Product Details"}/>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : ( 
      <View style={styles.itemContainer}>
        <Image style={styles.image} source={{uri: item.image,}}/>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star-outline" color="yellow" size={20}/>  
          <Text style={styles.rating}>{item.rating.rate}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text>Sold: ({item.rating.count})</Text>
        </View>
        <Text style={styles.price}>Price: ${item.price}</Text>
        <View style={styles.descriptionContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.description}>{item.description}</Text>
          </ScrollView> 
        </View>    
        <View style={styles.buttonContainer}>
          <IconButton name="backspace-outline" fun={navGoBack} text="Go Back"/>
          <IconButton name="cart-outline" fun={handleAddToCart} text="Add to Cart"/>
        </View>
      </View> 
      )}
      <StatusBar style='auto'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    alignItems: "center",
    backgroundColor: backgroundColour,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    height: '100%',
    alignContent: "center",
    alignSelf: "center",
  },
  image: {
    width: isWeb ? width * 0.17 : width * 0.5,
    aspectRatio: 1, 
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: isWeb ? width * 0.02 : width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 10,
  },
  rating: {
    fontSize: isWeb ? width * 0.01 : width * 0.06,
    marginRight: 5,
  },
  price: {
    fontSize: isWeb ? width * 0.02 : width * 0.08,
    fontWeight: 'bold',
    //marginBottom: 10,
  },
  descriptionContainer: {
    maxHeight: 150,
    backgroundColor: "white",
    borderColor:"black",
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    marginHorizontal: isWeb ? 150 : 10,
  },
  scrollView: {
    //flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: isWeb ? width * 0.02 : width * 0.029,
    textAlign: 'center',
 
  },
  buttonContainer: {
    //marginTop: 20,
    flexDirection: "row",
  },
});

export default ItemDetails;
//connect(null, { addToCart })(ItemDetails);