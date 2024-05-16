import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

import CustomModal from "../components/Modal";
import { Title } from '../components/Title';

export default function LoginPage({ navigation }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      console.log("Request Body:", requestBody);

      const response = await fetch('http://192.168.0.149:3000/users/signin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const responseData = await response.json();
      console.log('Response', responseData);
      if (responseData.status === 'OK') {
        console.log("Sign In successful")
      } else {
        console.log('Sign in failed:', responseData.message);
        togglePopup(responseData.message);
      }
    } catch (error) {
      console.error('Error during signin:', error);
      togglePopup("An error occurred. Please try again.");
    }
  };
;

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
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  clearButton: {
    marginRight: 10,
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  switchButton: {
    marginBottom: 10,
  },
  switchButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});