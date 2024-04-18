import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';

const CategoryAPIURL = 'https://fakestoreapi.com/products/categories';
const ProductAPIURL = 'https://fakestoreapi.com/products';

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
     console.log(filterData)
     return filterData;
    } catch (error){
      console.log("Get Category Failed")
    }
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
    <TouchableOpacity onPress={() => getCategoryData(item)}>
      <View style={styles.item}>
        <Text style={styles.itemText}>{capitaliseCategories(item)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Categories</Text>
      <View style={styles.itemBox}>
        <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(index) => index.toString()} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  itemBox: {
    width: "95%",
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
});