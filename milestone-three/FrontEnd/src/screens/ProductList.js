import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';

import { Title } from '../components/Title';
import { IconButton } from '../components/IconButton';
import { backgroundColour, borderColour, mainComponentColour, secondaryTextColour } from '../constants/Color';

const ProductAPIURL = 'https://fakestoreapi.com/products';

const {width, height } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export default function ProductList({ route, navigation}) {
  const { category } = route.params;

  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);
  const [cachedProducts, setCachedProducts] = React.useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      //console.log("Fetch from API")
      const getProduct = await fetch(ProductAPIURL);
      const productJSON = await getProduct.json();
      const filteredProducts = productJSON.filter(
        (product) => product.category === category
      );
      setProducts([...filteredProducts]);
      await AsyncStorage.setItem('products', JSON.stringify(filteredProducts));
      setCachedProducts([...filteredProducts]);
    } catch (error) {
      console.log("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDataFromCache = async () => {
    setLoading(true);
    try {
      //console.log("Fetch from Cache")
      const cachedData = await AsyncStorage.getItem('products');
      if (cachedData) {
        const parsedProducts = JSON.parse(cachedData);
        setProducts([...parsedProducts]);
        setCachedProducts([...parsedProducts]);
      } else {
        await fetchData();
      }
    } catch (error) {
      console.log("Failed to get data from cache", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadDataFromCache();
  }, []);

  useFocusEffect(() => {
    if (category !== cachedProducts[0]?.category) {
      fetchData();
    }
  });

  const navGoBack = () => navigation.goBack();
  
  const capitaliseCategory = (string) => {        
    let words = string.split(" ");
    for (let i = 0; i < words.length; i ++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    return words;
  };

  const capitalizedCategory = capitaliseCategory(category);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ItemDetails', {item})}>
      <View style={styles.itemContainer}>
        <Image style={styles.image} source={{uri: item.image,}}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={4}>{item.title}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Title text={capitalizedCategory}/>
      <View style={styles.itemBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff"/>
        ) : (
          <FlatList data={products} renderItem={renderItem} keyExtractor={(item) => item.id.toString()}/>
        )}
      </View>
      <IconButton name="backspace-outline" fun={navGoBack} text="Go Back"/>
      <StatusBar style='auto'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColour,
    paddingTop: 40,
    alignItems: "center",
  },
  itemBox: {
    margin: 10,
    width: '90%',
    height: '70%',
    borderWidth: 2,
    borderColor: borderColour,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: mainComponentColour,
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: isWeb ? 150 : width * 0.2,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    width: width * 0.6,
  },
  title: {
    fontSize: isWeb ? 24 : width * 0.045,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: isWeb ? 32 : width * 0.045,
    color: secondaryTextColour,
  },
});

