import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === 'web';

export const Title = ({ text }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    textAlign: "center",
    fontSize: isWeb ? 44 : width * 0.1,
    fontWeight: "bold",
    marginBottom: 10,
    top: 20,
  }
});
