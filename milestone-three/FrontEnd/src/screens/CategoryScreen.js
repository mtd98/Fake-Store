import React , {useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Platform, ActivityIndicator} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Title } from '../components/Title';
import { backgroundColour, borderColour, mainComponentColour, textColour } from '../constants/Color';

const CategoryAPIURL = 'https://fakestoreapi.com/products/categories';
const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export let categoryCache = {};

export const clearCategoryCache = async () => {
  categoryCache = {};
  await AsyncStorage.removeItem('categories');
};

export default function Categories({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState('');

  const getData = React.useCallback(async () => {
    try {
      if (categoryCache.length > 0) {
        setCategories([...categoryCache, "Mason Dunbar"]);
        setLoading(false);
      } else {
        const getCategory = await fetch(CategoryAPIURL);
        const categoryJSON = await getCategory.json();
        setTimeout(async () => {
          await AsyncStorage.setItem('categories', JSON.stringify(categoryJSON));
          setCategories([...categoryJSON, "Mason Dunbar"]);
          categoryCache = [...categoryJSON, "Mason Dunbar"];
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log("Failed to get Data", error)
      setLoading(false);
    }
  }, []);

  useEffect(() => {
     getData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const navToProductList = async (item) =>{
    try {
      navigation.navigate('ProductList', { category: item});
    } catch (error) {
      console.log("Nav data error");
    }
  };

  const handleCategoryPress = (item) => {
    navToProductList(item);
  };

  const capitaliseCategories = (string) => {        
    let words = string.split(" ");
    for (let i = 0; i < words.length; i ++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    return words;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleCategoryPress(item)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{capitaliseCategories(item)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Title text={"Product Categories"}/>
      <View style={styles.itemBox}>
        {loading ? ( 
          <ActivityIndicator size="large" color="#0000ff"/>
        ) : (
          <FlatList data={categories} renderItem={renderItem} keyExtractor={(item, index) => index.toString()}/>
        )}
      </View>
      <StatusBar style="auto" />
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
  itemBox: {
    margin: 10,
    width: '90%',
    height: "70%",
    borderWidth: 2,
    borderColor: borderColour,
  },
  item: {
    backgroundColor: mainComponentColour,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 3,
  },  
  itemText: {
    fontSize: isWeb ? 34 : width * 0.07,
    color: textColour,
  },
});