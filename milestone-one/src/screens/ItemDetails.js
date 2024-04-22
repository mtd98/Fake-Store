import { StyleSheet, View, Text, Button, Image } from 'react-native';


export default function ItemDetails({ route, navigation }) {
  const {item} = route.params;

  return (
    <View>
      <View>
        <Image style={styles.tinyLogo} source={{uri: item.image,}}/>
      </View>
      <Text>{item.title}</Text>
      <View>
        <Text>{item.rating.rate}</Text>
        <Text>({item.rating.count})</Text>
        <Text>{item.price}</Text>
      </View>
      <View>
        <Button><Text>Add to Cart</Text></Button>
      </View>
      <View>
        <Text>{item.description}</Text>
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

