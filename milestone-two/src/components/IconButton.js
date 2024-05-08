import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { buttonColour } from "../constants/Color";

export const IconButton =({
  name,
  fun = () => {
  },
}) => {
  return (
    <Pressable onPress={fun}>
      <View style={styles.container}>
        <Ionicons name={name} color="white" size={30}/>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
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