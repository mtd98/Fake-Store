import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, Platform, ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { connect } from 'react-redux';
import Ionicons from "@expo/vector-icons/Ionicons";

import { addToCart } from '../components/Store';
import { IconButton } from '../components/IconButton';
import { backgroundColour } from '../constants/Color';

const { width, height } = Dimensions.get('window');

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
          <Text>Sold: ({item.rating.count})</Text>
        </View>
        <Text style={styles.price}>Price: ${item.price}</Text>
        <View style={styles.buttonContainer}>
          <IconButton name="backspace-outline" fun={navGoBack}/>
          <IconButton name="cart-outline" fun={handleAddToCart}/>
        </View>
        <Text style={styles.description}>{item.description}</Text>
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
  },
  image: {
    width: width * 0.3,
    aspectRatio: 1, 
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    marginRight: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
  },
});

export default connect(null, { addToCart })(ItemDetails);