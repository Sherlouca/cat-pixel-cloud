import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import { ScreenContainer } from "@/components/screen-container";
import { CategoryChip } from "@/components/category-chip";
import { useColors } from "@/hooks/use-colors";
import { Wallpaper } from "@/shared/types";

// Categories for cat wallpapers
const CATEGORIES = [
  { id: "all", name: "Todos", query: "cat" },
  { id: "cute", name: "Fofinhos", query: "cute cat" },
  { id: "funny", name: "Engraçados", query: "funny cat" },
  { id: "sleeping", name: "Dormindo", query: "sleeping cat" },
  { id: "kitten", name: "Filhotes", query: "kitten" },
  { id: "black", name: "Pretos", query: "black cat" },
  { id: "white", name: "Brancos", query: "white cat" },
  { id: "orange", name: "Laranja", query: "orange cat" },
];

const TABS = [
  { id: "popular", label: "Populares" },
  { id: "new", label: "Novos" },
  { id: "foryou", label: "Para Você" },
] as const;

// Static cat wallpapers using The Cat API CDN
const STATIC_WALLPAPERS: Wallpaper[] = [
  { id: "MTY3ODIyMQ", url: "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg", width: 500, height: 750, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#8B7355", source: "catapi" },
  { id: "9j5", url: "https://cdn2.thecatapi.com/images/9j5.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/9j5.jpg", width: 500, height: 333, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#D4A574", source: "catapi" },
  { id: "a2", url: "https://cdn2.thecatapi.com/images/a2.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/a2.jpg", width: 500, height: 334, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#C4A484", source: "catapi" },
  { id: "bi", url: "https://cdn2.thecatapi.com/images/bi.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/bi.jpg", width: 334, height: 500, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#F5DEB3", source: "catapi" },
  { id: "ck", url: "https://cdn2.thecatapi.com/images/ck.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/ck.jpg", width: 500, height: 375, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#DEB887", source: "catapi" },
  { id: "d8c", url: "https://cdn2.thecatapi.com/images/d8c.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/d8c.jpg", width: 500, height: 334, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#2F4F4F", source: "catapi" },
  { id: "e1l", url: "https://cdn2.thecatapi.com/images/e1l.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/e1l.jpg", width: 500, height: 375, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#FFE4C4", source: "catapi" },
  { id: "MTUwMjA0Mw", url: "https://cdn2.thecatapi.com/images/MTUwMjA0Mw.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTUwMjA0Mw.jpg", width: 500, height: 333, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#FAEBD7", source: "catapi" },
  { id: "MTUxNzIxNw", url: "https://cdn2.thecatapi.com/images/MTUxNzIxNw.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTUxNzIxNw.jpg", width: 500, height: 375, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#D2B48C", source: "catapi" },
  { id: "MTU0NTY3MQ", url: "https://cdn2.thecatapi.com/images/MTU0NTY3MQ.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTU0NTY3MQ.jpg", width: 500, height: 333, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#BC8F8F", source: "catapi" },
  { id: "MTU5MzM5OA", url: "https://cdn2.thecatapi.com/images/MTU5MzM5OA.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTU5MzM5OA.jpg", width: 500, height: 375, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#F0E68C", source: "catapi" },
  { id: "MTYwMjc4OA", url: "https://cdn2.thecatapi.com/images/MTYwMjc4OA.jpg", thumbnailUrl: "https://cdn2.thecatapi.com/images/MTYwMjc4OA.jpg", width: 500, height: 334, photographer: "The Cat API", photographerUrl: "https://thecatapi.com", avgColor: "#E6E6FA", source: "catapi" },
];

// Simple wallpaper card component using expo-image
function WallpaperItem({ 
  wallpaper, 
  onPress, 
  isFavorite, 
  onFavoritePress 
}: { 
  wallpaper: Wallpaper; 
  onPress: () => void;
  isFavorite: boolean;
  onFavoritePress: () => void;
}) {
  const colors = useColors();
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          margin: 4,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: wallpaper.avgColor || colors.surface,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={{ aspectRatio: 3 / 4, position: "relative" }}>
        <Image
          source={wallpaper.thumbnailUrl}
          style={{ 
            width: "100%", 
            height: "100%",
          }}
          contentFit="cover"
          placeholder={wallpaper.avgColor}
          placeholderContentFit="cover"
          transition={200}
        />
        
        {/* Favorite button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>
            {isFavorite ? "❤️" : "🤍"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // Calculate number of columns based on screen width
  const numColumns = width >= 1024 ? 4 : width >= 768 ? 3 : 2;

  // Use static data
  const [wallpapers] = useState<Wallpaper[]>(STATIC_WALLPAPERS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState<"popular" | "new" | "foryou">("popular");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

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
      <WallpaperItem
        wallpaper={item}
        onPress={() => handleWallpaperPress(item)}
        isFavorite={favorites.includes(item.id)}
        onFavoritePress={() => toggleFavorite(item.id)}
      />
    ),
    [handleWallpaperPress, favorites, toggleFavorite]
  );

  const renderHeader = useCallback(
    () => (
      <View className="mb-4">
        {/* App Title */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-foreground">🐱 Cat Pixel Cloud</Text>
          <Text className="text-sm text-muted mt-1">
            Os melhores papéis de parede de gatos
          </Text>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          className="mb-4"
        >
          {CATEGORIES.map((category) => (
            <CategoryChip
              key={category.id}
              label={category.name}
              isSelected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </ScrollView>

        {/* Tabs */}
        <View className="flex-row px-4 mb-2">
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setSelectedTab(tab.id)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View
                className="mr-6 pb-2"
                style={{
                  borderBottomWidth: selectedTab === tab.id ? 2 : 0,
                  borderBottomColor: colors.primary,
                }}
              >
                <Text
                  className="text-base font-medium"
                  style={{
                    color: selectedTab === tab.id ? colors.primary : colors.muted,
                  }}
                >
                  {tab.label}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    ),
    [selectedCategory, selectedTab, colors]
  );

  return (
    <ScreenContainer>
      <FlatList
        data={wallpapers}
        renderItem={renderWallpaper}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
