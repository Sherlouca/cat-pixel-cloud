import { Pressable, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, isSelected, onPress }: CategoryChipProps) {
  const colors = useColors();

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: isSelected ? "#FFFFFF" : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
});
