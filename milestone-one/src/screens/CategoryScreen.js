import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Platform} from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Title } from '../components/Title';

const CategoryAPIURL = 'https://fakestoreapi.com/products/categories';
const ProductAPIURL = 'https://fakestoreapi.com/products';
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function Categories({ navigation }) {
  const [categories, setCategories] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const getCategory = await fetch(CategoryAPIURL);
      const categoryJSON = await getCategory.json();
      setCategories(categoryJSON);
    } catch (error) {
      console.log("Failed to get Data")
    }
  };

  const getCategoryData = async (categories) => {
    try {
      const response = await fetch(ProductAPIURL);
      const productData = await response.json();
      const filterData = productData.filter(item => item.category === categories);
      return filterData;
    } catch (error){
      console.log("Get Category Failed")
    }
  };

  const navToProductList = async (item) =>{
    try {
      const filterData = await getCategoryData(item);
      navigation.navigate('ProductList', {filterData});
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
      <Title text={"Categories"}/>
      <View style={styles.itemBox}>
        <FlatList data={categories} renderItem={renderItem} keyExtractor={(item, index) => index.toString()}/>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
    alignItems: "center",
  },
  itemBox: {
    margin: 10,
    width: '90%',
    height: "70%",
    borderWidth: 2,
  },
  item: {
    backgroundColor: '#f9c2ff',
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
    fontSize: isWeb ? 34 : width * 0.1,
    color: '#444',
  },
});