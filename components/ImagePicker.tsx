import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { CameraIcon, XIcon } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerProps {
  value?: ImagePicker.ImagePickerAsset;
  onBlur: () => void;
  onChange: (file: ImagePicker.ImagePickerAsset) => void;
  onCancel: () => void;
}

const ImagePickerInput: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  onBlur,
  onCancel,
}) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | undefined>(
    undefined
  );
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (value) {
      setImage(value);
      setImageUri(value?.uri);
    }
  }, [value]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result?.assets[0]?.uri);
      setImage(result?.assets[0]);
      onChange(result?.assets[0]);
    } else {
      onBlur();
    }
  };

  return (
    <TouchableOpacity
      disabled={!!image}
      onPress={pickImage}
      className="relative w-[180px] h-[180px] rounded-[15px] items-center justify-center px-[10px] border border-input bg-background"
    >
      {imageUri ? (
        <>
          <TouchableOpacity
            onPressIn={onCancel}
            className="absolute top-[5px] right-[5px] w-[30px] h-[30px] rounded-[15px] border justify-center items-center z-10 bg-white"
          >
            <XIcon size={18} color="black" />
          </TouchableOpacity>
          <Image
            source={{ uri: imageUri }}
            className="w-[180px] h-[180px] rounded-[15px]"
          />
        </>
      ) : (
        <View className="justify-center items-center">
          <View className="w-[60px] h-[60px] rounded-full justify-center items-center">
            <CameraIcon size={40} color="white" />
          </View>
          <Text className="mt-[10px] text-center text-accent-foreground">
            Selecciona Una Imagen
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerInput;
