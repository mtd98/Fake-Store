import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { StyleSheet, View, Text, Image, Dimensions, Platform, ActivityIndicator, ScrollView} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Title } from '../components/Title';
import Ionicons from "@expo/vector-icons/Ionicons";
import { addToCart } from '../components/Store';
import { IconButton } from '../components/IconButton';
import { backgroundColour, buttonColour, secondaryTextColour, textColour, borderColour } from '../constants/Color';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export let itemCache = {};

export const clearItemCache = async () => {
  itemCache = {};
};

function ItemDetails({ route, navigation }) {
  const {item} = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const cachedItem = itemCache[item.id];
    if (cachedItem) {
      setData(cachedItem);
      setLoading(false);
    } else {
      setTimeout(() => {
        itemCache[item.id] = item;
        setData(item);
        setLoading(false);
      }, 2000);
    }
  }, [item]);

  const navGoBack = () => navigation.goBack();

  const handleAddToCart = async () => {
    try {
      dispatch(addToCart(item));
    } catch (error) {
      console.log('Error while adding item', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Title text={"Product Details"}/>
      {loading ? (
        <ActivityIndicator size="large" color={buttonColour} />
      ) : ( 
      <View style={styles.itemContainer}>
        <Image style={styles.image} source={{uri: item.image,}}/>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star-outline" color="yellow"size={isWeb ? width * 0.020 : width * 0.04}/>  
          <Text style={styles.rating}>{item.rating.rate}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>Sold: ({item.rating.count})</Text>
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
    width: isWeb ? width * 0.35 : width * 0.5,
    aspectRatio: 1, 
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: isWeb ? width * 0.03 : width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: secondaryTextColour,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: isWeb ? width * 0.02 : width * 0.03,
    marginRight: 5,
    color: textColour,
  },
  price: {
    fontSize: isWeb ? width * 0.03 : width * 0.08,
    fontWeight: 'bold',
    marginBottom: 10,
    color: secondaryTextColour,
  },
  descriptionContainer: {
    maxHeight: 150,
    backgroundColor: "white",
    borderColor: borderColour,
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: isWeb ? width * 0.02 : width * 0.029,
    textAlign: 'center',
 
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ItemDetails;