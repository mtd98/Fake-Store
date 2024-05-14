import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { Title } from '../components/Title';
import { IconButton } from '../components/IconButton';
import { backgroundColour, borderColour, mainComponentColour, secondaryTextColour } from '../constants/Color';

const {width, height } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export default function ProductList({ route, navigation}) {
  const {filterData} = route.params;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData(filterData);
      setLoading(false);
    }, 2000);
  }, [filterData]);

  const navGoBack = () => navigation.goBack();

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
      <Title text={"List of Filtered Products"}/>
      <View style={styles.itemBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff"/>
        ) : (
          <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.id.toString()}/>
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
    //flexShrink: 1,
    //flexWrap: 'wrap',
    //lineHeight: 20,
  },
  price: {
    fontSize: isWeb ? 32 : width * 0.045,
    color: secondaryTextColour,
  },
});

