import { Image } from "expo-image";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Wallpaper } from "@/shared/types";
import { IconSymbol } from "./ui/icon-symbol";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPress: () => void;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
}

export function WallpaperCard({
  wallpaper,
  onPress,
  isFavorite = false,
  onFavoritePress,
}: WallpaperCardProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: wallpaper.avgColor || colors.surface },
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{ uri: wallpaper.thumbnailUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      />
      {onFavoritePress && (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
          style={({ pressed }) => [
            styles.favoriteButton,
            { backgroundColor: "rgba(0,0,0,0.4)" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <IconSymbol
            name={isFavorite ? "heart.fill" : "heart"}
            size={18}
            color={isFavorite ? colors.heart : "#FFFFFF"}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 0.6,
    borderRadius: 12,
    overflow: "hidden",
    margin: 4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
