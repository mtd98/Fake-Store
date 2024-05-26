import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { backgroundColour, buttonColour, mainComponentColour, textColour, secondaryTextColour, borderColour } from '../constants/Color';
import { signInSuccess } from '../components/Store';
import CustomModal from "../components/Modal";
import { Title } from '../components/Title';

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export default function LoginPage({ navigation }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  const togglePopup = (msg = "") => {
    setMessage(msg);
    setPopupVisible(!isPopupVisible);
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  const handleSignIn = async () => {
    try {
      const requestBody = {
        email: email,
        password: password,
      };
      const response = await fetch('http://192.168.0.149:3000/users/signin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
      if (responseData.status === 'OK') {
        dispatch(signInSuccess({
          id: responseData.id,
          name: responseData.name,
          email: responseData.email,
          token: responseData.token,
        }));
        navigation.navigate("ProfileScreen");
      } else {
        console.log('Sign in failed:', responseData.message);
        togglePopup(responseData.message);
      }
    } catch (error) {
      console.error('Error during signin:', error);
      togglePopup("An error occurred. Please try again.");
    }
  };

  const navToSignup = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <View style={styles.container}>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <View style={styles.formContainer}>
        <Title text={"Sign In with your Email and Password"}/>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.switchButton} onPress={navToSignup}>
        <Text style={styles.switchButtonText}>Switch To: Sign Up</Text>
      </TouchableOpacity>
      <StatusBar style='auto'/>
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
    width: isWeb ? '40%' : '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: borderColour,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
    marginHorizontal: 5,
  },
  clearButton: {
    backgroundColor: borderColour,
  },
  buttonText: {
    color: textColour,
    fontSize: isWeb ? 18 : width * 0.04,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 10,
  },
  switchButtonText: {
    color: secondaryTextColour,
    fontSize: isWeb ? 18 : width * 0.04,
    fontWeight: 'bold',
  },
});