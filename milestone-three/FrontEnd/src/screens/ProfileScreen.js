import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { saveCart, signOut } from '../components/Store';
import UpdateModal from "../components/UpdateModal";
import { Title } from '../components/Title';
import { backgroundColour, borderColour, buttonColour, mainComponentColour, textColour, secondaryTextColour } from '../constants/Color';
import { clearCategoryCache } from './CategoryScreen';
import { clearProductCache } from './ProductList';
import { clearItemCache } from './ItemDetails';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function ProfilePage({}){
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cartItems = useSelector(state => state.cart.cartItems);
  const userToken = useSelector(state => state.user.token);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleUpdate = () => {
    togglePopup();
  };

  const handleSignOut = async () => {
    await dispatch(saveCart({ token: userToken, cartItems }));
    await clearCategoryCache();
    await clearProductCache();
    await clearItemCache();
    //console.log("Caches cleared on sign out");
    dispatch(signOut());
  };

  return (
    <View style={styles.container}>
      <UpdateModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)}/>
      <View style={styles.formContainer}>
      <Title text={"Profile"}/>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.text}>{user.name}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>{user.email}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
          <View style={styles.buttonSpace} />
          <TouchableOpacity style={[styles.button, styles.signOut]} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: backgroundColour,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: mainComponentColour,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: isWeb ? '50%' : '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 40,
    borderColor: borderColour,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    color: secondaryTextColour,
  },
  text: {
    flex: 1,
    color: borderColour
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: buttonColour,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  signOut: {
    backgroundColor: borderColour,
  },
  buttonText: {
    color: textColour,
    fontSize: isWeb ? 18 : width * 0.04,
    fontWeight: 'bold',
  },
  buttonSpace: {
    width: 10,
  }
});