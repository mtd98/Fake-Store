import { View, Text, StyleSheet, ImageBackground, Image, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from "@expo/vector-icons/Ionicons";

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function SplashScreen() {
  const iconSize = width * 0.55;
  return (
    <ImageBackground source={require('../img/Background.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContent}>
            <Image source={require('../img/ShoppingBag.png')} style={styles.shoppingBags} />
            <Text style={styles.logoText} numberOfLines={1}>Fake Store</Text>
          </View>
        </View>
      </View>
      <StatusBar style='auto'/>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
    borderRadius: 10,
    maxWidth: '80%',
  },
  logoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContent: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoText: {
    fontSize: isWeb ? 34 : width * 0.1,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 10,
    position: 'absolute',
    transform: [{translateY: width * 0.065}],
  },
  shoppingBags: {
    width: isWeb ? width * 1.9 : width * 1.6, 
    height: undefined,
    marginLeft: 60,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  icon: {
    backgroundColor: '#F6964E',
    margin: 5,
    borderRadius: 1,
    borderColor: "black",
    borderWidth: 5,
  }
});

