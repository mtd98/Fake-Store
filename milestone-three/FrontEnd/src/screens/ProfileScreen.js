import { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { saveCart, signOut } from '../components/Store';
import UpdateModal from "../components/UpdateModal";
import { Title } from '../components/Title';

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
    await dispatch(saveCart({ token: userToken, cartItems }))
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
          <Button title="Update" onPress={handleUpdate} style={styles.button} />
          <View style={styles.buttonSpace} />
          <Button title="Sign Out" onPress={handleSignOut} style={[styles.button, styles.signOut]} />
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  text: {
    flex: 1,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  signOut: {
    marginRight: 10,
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonSpace: {
    width: 10,
  }
});