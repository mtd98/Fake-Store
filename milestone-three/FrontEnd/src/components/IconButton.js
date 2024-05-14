import { View, StyleSheet, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { buttonColour } from "../constants/Color";

export const IconButton =({
  name,
  text,
  fun = () => {
  },
}) => {
  return (
    <Pressable onPress={fun}>
      <View style={styles.container}>
        <Ionicons name={name} color="black" size={30}/>
        <Text>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 10,
    backgroundColor: buttonColour,
  },
})