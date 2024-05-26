
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, Dimensions, Platform  } from 'react-native';

import CustomModal from "../components/Modal";
import { Title } from '../components/Title';
import { updateUserProfile } from '../components/Store';
import { borderColour, buttonColour, mainComponentColour, textColour, secondaryTextColour } from '../constants/Color';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function UpdateModal({ isVisible, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [newUserName, setNewUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [message, setMessage] = useState("");

  const togglePopup = (msg = "") => {
    setMessage(msg);
    setPopupVisible(!isPopupVisible);
  };

  const handleCancel = () => {
    onClose();
  };

  const handleUpdate = async () => {
    try {
      const { token } = user;
      const requestBody = {
        name: newUserName,
        password: newPassword,
      };
      const response = await fetch('http://192.168.0.149:3000/users/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      if (responseData.status === 'OK') {
        togglePopup('The user name and password have been successfully updated');
        const updatedUserInfo = {
          name: responseData.name,
        };
        dispatch(updateUserProfile(updatedUserInfo));
        setTimeout(() => {
          onClose(); 
        }, 2000);
      } else {
        console.log('Sign in failed:', responseData.message);
        togglePopup(responseData.message);
      }
    } catch (error) {
      console.error('Error during signin:', error);
      togglePopup("An error occurred. Please try again.");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>      
          <Title text={"Update Profile"}/>
          <Text style={styles.modalMessage}></Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>New User Name:</Text>
            <TextInput style={styles.input} onChangeText={setNewUserName} value={newUserName} placeholder="Enter new username"/>
            <Text style={styles.label}>New Password:</Text>
            <TextInput style={styles.input} onChangeText={setNewPassword} value={newPassword} placeholder="Enter new password" secureTextEntry={true}/>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleUpdate(newUserName, newPassword)}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <View style={styles.buttonSpace} />
            <TouchableOpacity style={[styles.button, styles.signOut]} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: mainComponentColour,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalMessage: {
    marginBottom: 10,
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: secondaryTextColour,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
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
