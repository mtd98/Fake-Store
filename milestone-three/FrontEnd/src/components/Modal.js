import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';

import { mainComponentColour, secondaryTextColour } from '../constants/Color';
const CustomModal = ({ isVisible, onClose, message }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <Text style={styles.message}>{message}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 20,
    backgroundColor: mainComponentColour,
    borderRadius: 10,
    elevation: 5,
  },
  message: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: secondaryTextColour,
  },
});

export default CustomModal;
