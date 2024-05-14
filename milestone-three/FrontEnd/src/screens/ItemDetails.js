import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform, ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import Ionicons from "@expo/vector-icons/Ionicons";

import { addToCart, updateTotalCartPrice } from '../components/Store';
import { IconButton } from '../components/IconButton';
import { backgroundColour } from '../constants/Color';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

function ItemDetails({ route, navigation, addToCart }) {
  const {item} = route.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData(item);
      setLoading(false);
    }, 1000);
  }, [item]);

  const navGoBack = () => navigation.goBack();

  const handleAddToCart = () => {
    addToCart(item);
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.description}>{item.description}</Text>       
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
    width: isWeb ? width * 0.2 : width * 0.5,
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
    marginBottom: 10,
  },
  rating: {
    fontSize: isWeb ? width * 0.01 : width * 0.06,
    marginRight: 5,
  },
  price: {
    fontSize: isWeb ? width * 0.01 : width * 0.08,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: isWeb ? width * 0.01 : width * 0.029,
    textAlign: 'center',
    backgroundColor: "white",
    borderColor:"black",
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    marginHorizontal: isWeb ? 150 : 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
  },
});

export default connect(null, { addToCart })(ItemDetails);