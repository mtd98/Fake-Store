import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <ImageBackground source={require('../img/Background.jpeg')} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Fake Store</Text>
        <Image source={require('../img/ShoppingBag.png')} style={styles.shoppingBags} />
      </View>
    </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  shoppingBags: {
    width: '30%', 
    height: undefined, 
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});

