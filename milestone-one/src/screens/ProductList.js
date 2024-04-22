import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

export default function ProductList({ route, navigation}) {
  const {filterData} = route.params;
  //console.log(filterData);

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('ItemDetails', {item})}>
        <View>
          <Image style={styles.tinyLogo} source={{uri: item.image,}}/>
        </View>
        <Text>{item.title}</Text>
        <Text>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text>List of Filtered Products</Text>
      <View>
        <FlatList
          data={filterData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    width: 50,
    height: 50,
  },
});

