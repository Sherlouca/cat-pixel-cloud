import { useCallback, useMemo } from "react";
import {
  FlatList,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { WallpaperCard } from "@/components/wallpaper-card";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useWallpaperStore } from "@/stores/wallpaper-store";
import { Wallpaper } from "@/shared/types";

export default function FavoritesScreen() {
  const colors = useColors();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : 2;

  const { wallpapers, favorites, toggleFavorite, isFavorite } = useWallpaperStore();

  // Get favorite wallpapers from the loaded wallpapers
  const favoriteWallpapers = useMemo(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  const handleWallpaperPress = useCallback(
    (wallpaper: Wallpaper) => {
      router.push({
        pathname: "/wallpaper/[id]",
        params: {
          id: wallpaper.id,
          url: wallpaper.url,
          thumbnailUrl: wallpaper.thumbnailUrl,
          photographer: wallpaper.photographer,
          photographerUrl: wallpaper.photographerUrl,
          width: wallpaper.width.toString(),
          height: wallpaper.height.toString(),
          avgColor: wallpaper.avgColor,
        },
      });
    },
    [router]
  );

  const renderWallpaper = useCallback(
    ({ item }: { item: Wallpaper }) => (
      <View style={{ flex: 1 / numColumns }}>
        <WallpaperCard
          wallpaper={item}
          onPress={() => handleWallpaperPress(item)}
          isFavorite={isFavorite(item.id)}
          onFavoritePress={() => toggleFavorite(item.id)}
        />
      </View>
    ),
    [numColumns, handleWallpaperPress, isFavorite, toggleFavorite]
  );

  const renderHeader = useCallback(
    () => (
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold text-foreground">❤️ Favoritos</Text>
        <Text className="text-sm text-muted mt-1">
          {favorites.length} {favorites.length === 1 ? "wallpaper salvo" : "wallpapers salvos"}
        </Text>
      </View>
    ),
    [favorites.length]
  );

  const renderEmpty = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-20">
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <IconSymbol name="heart" size={48} color={colors.muted} />
        </View>
        <Text className="text-xl font-semibold text-foreground mb-2">
          Nenhum favorito ainda
        </Text>
        <Text className="text-muted text-center px-8">
          Toque no coração em qualquer wallpaper para salvá-lo aqui
        </Text>
        <Pressable
          onPress={() => router.push("/")}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View
            className="mt-6 px-6 py-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-semibold">Explorar wallpapers</Text>
          </View>
        </Pressable>
      </View>
    ),
    [colors, router]
  );

  return (
    <ScreenContainer>
      <FlatList
        data={favoriteWallpapers}
        renderItem={renderWallpaper}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 20, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
