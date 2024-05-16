import { View, Text, StyleSheet, Button } from 'react-native';
import Modal from 'react-native-modal';

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
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  message: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default CustomModal;
