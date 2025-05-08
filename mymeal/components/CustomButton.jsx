import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={` mt-10 bg-secondary-100 rounded-[25px] min-h-[62px] min-w-[50%] justify-center items-center${containerStyles} ${isLoading ? "opacity-50" : ""
        }`}
      disabled={isLoading}
    >
      <Text className={`text-primary  font-ibold text-lg text-center ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#f55"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
