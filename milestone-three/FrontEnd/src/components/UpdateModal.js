
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Button, TextInput, Modal, Alert } from 'react-native';

import CustomModal from "../components/Modal";
import { Title } from '../components/Title';
import { updateUserProfile } from '../components/Store';

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
      console.log("Request Body:", requestBody);

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
      console.log('Response', responseData);
      if (responseData.status === 'OK') {
        console.log("Update successful")
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <CustomModal isVisible={isPopupVisible} onClose={() => setPopupVisible(false)} message={message} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>      
          <Title text={"Update Profile"}/>
          <Text style={styles.modalMessage}></Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>New User Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewUserName}
              value={newUserName}
              placeholder="Enter new username"
            />
            <Text style={styles.label}>New Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewPassword}
              value={newPassword}
              placeholder="Enter new password"
              secureTextEntry={true}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={() => handleUpdate(newUserName, newPassword)} />
            <View style={styles.buttonSpace} />
            <Button title="Cancel" onPress={handleCancel} />
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
    backgroundColor: 'white',
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
  },
  buttonSpace: {
    width: 10,
  },
});
