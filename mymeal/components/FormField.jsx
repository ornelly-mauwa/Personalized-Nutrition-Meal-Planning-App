import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className=" text-base  text-secondary-300 font-pmedium">{title}</Text>

      <View className="  w-full bg-secondary-200  h-16 px-5 rounded-2xl border-2 border-primary-100 focus:border-secondary-100 flex flex-row items-center"   >
        <TextInput
          className="flex-1 text-grey-100 font-kregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#AFADAD"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
