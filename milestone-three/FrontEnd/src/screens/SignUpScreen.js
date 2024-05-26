import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Dimensions} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { backgroundColour, buttonColour, mainComponentColour, textColour, secondaryTextColour, borderColour } from '../constants/Color';
import { signInSuccess } from '../components/Store';
import CustomModal from "../components/Modal";
import { Title } from '../components/Title';

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export default function SignupPage({ navigation }){
  const [username, setUsername] = useState('');
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
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSignUp = async () => {
    
    try {
      const requestBody = {
        name: username,
        email: email,
        password: password,
      };
      console.log("Request Body:", requestBody);

      const response = await fetch('http://192.168.0.149:3000/users/signup', {
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
        console.log("Registration successful")
        dispatch(signInSuccess({
          id: responseData.id,
          name: responseData.name,
          email: responseData.email,
          token: responseData.token,
        }));
        navigation.navigate('ProfileScreen');
      } else {
        console.log('Registration failed:', responseData.message);
        togglePopup(responseData.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      togglePopup("An error occurred. Please try again.");
    }
  };

  const navToLogin = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <View style={styles.formContainer}>
        <Title text={"Sign Up a new user"}/>        
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
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
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.switchButton} onPress={navToLogin}>
        <Text style={styles.switchButtonText}>Switch To: Sign In</Text>
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