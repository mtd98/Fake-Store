import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Icon =({
  name,
  fun = () => {
  },
}) => {
  return (
    <Pressable onPress={fun}>
      <View>
        <Ionicons name={name} color="black" size={30}/>
      </View>
    </Pressable>
  );
};