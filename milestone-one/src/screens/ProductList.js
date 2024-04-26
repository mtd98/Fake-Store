import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Title } from '../components/Title';
import { IconButton } from '../components/IconButton';

const {width, height } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export default function ProductList({ route, navigation}) {
  const {filterData} = route.params;

  const navGoBack = () => navigation.goBack();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ItemDetails', {item})}>
      <View style={styles.itemContainer}>
        <Image style={styles.image} source={{uri: item.image,}}/>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>Price: ${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Title text={"List of Filtered Products"}/>
      <View style={styles.itemBox}>
        <FlatList data={filterData} renderItem={renderItem} keyExtractor={(item) => item.id.toString()}/>
      </View>
      <IconButton name="backspace-outline" fun={navGoBack}/>
      <StatusBar style='auto'/>
    </View>
  );
};

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
    height: height * 0.6,
    borderWidth: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: width * 0.1,
    aspectRatio: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    width: width * 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});

