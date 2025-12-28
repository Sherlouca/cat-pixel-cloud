import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  Share,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useWallpaperStore } from "@/stores/wallpaper-store";

export default function WallpaperDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    id: string;
    url: string;
    thumbnailUrl: string;
    photographer: string;
    photographerUrl: string;
    width: string;
    height: string;
    avgColor: string;
  }>();

  const { toggleFavorite, isFavorite } = useWallpaperStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const wallpaperId = params.id || "";
  const isFav = isFavorite(wallpaperId);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleToggleFavorite = useCallback(() => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleFavorite(wallpaperId);
  }, [wallpaperId, toggleFavorite]);

  const handleDownload = useCallback(async () => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      // For web, open image in new tab
      if (typeof window !== "undefined") {
        window.open(params.url, "_blank");
      }
      return;
    }

    try {
      setIsDownloading(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para salvar a imagem na galeria."
        );
        return;
      }

      // Download the image
      const filename = `cat_wallpaper_${params.id}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;

      const downloadResult = await FileSystem.downloadAsync(params.url, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error("Download failed");
      }

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(downloadResult.uri);

      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      Alert.alert("Sucesso!", "Wallpaper salvo na galeria.");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Erro", "Não foi possível baixar o wallpaper.");
    } finally {
      setIsDownloading(false);
    }
  }, [params.url, params.id]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Confira esse wallpaper de gato incrível! ${params.url}`,
        url: params.url,
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  }, [params.url]);

  const handleToggleInfo = useCallback(() => {
    setShowInfo((prev) => !prev);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: params.avgColor || colors.background }]}>
      {/* Background Image */}
      <Pressable style={styles.imageContainer} onPress={handleToggleInfo}>
        <Image
          source={{ uri: params.url }}
          style={styles.image}
          contentFit="cover"
          transition={300}
          placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
        />
      </Pressable>

      {/* Overlay with controls */}
      {showInfo && (
        <>
          {/* Top bar */}
          <View
            style={[
              styles.topBar,
              { paddingTop: insets.top + 8 },
            ]}
          >
            <Pressable
              onPress={handleBack}
              style={({ pressed }) => [
                styles.iconButton,
                { backgroundColor: "rgba(0,0,0,0.4)" },
                pressed && { opacity: 0.7 },
              ]}
            >
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </Pressable>

            <View style={styles.topActions}>
              <Pressable
                onPress={handleToggleFavorite}
                style={({ pressed }) => [
                  styles.iconButton,
                  { backgroundColor: "rgba(0,0,0,0.4)" },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <IconSymbol
                  name={isFav ? "heart.fill" : "heart"}
                  size={24}
                  color={isFav ? colors.heart : "#FFFFFF"}
                />
              </Pressable>
            </View>
          </View>

          {/* Bottom info and actions */}
          <View
            style={[
              styles.bottomBar,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            {/* Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.photographerText}>
                📸 {params.photographer}
              </Text>
              <Text style={styles.dimensionsText}>
                {params.width} × {params.height}
              </Text>
            </View>

            {/* Action buttons */}
            <View style={styles.actionsRow}>
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: "rgba(255,255,255,0.2)" },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <IconSymbol name="square.and.arrow.up" size={20} color="#FFFFFF" />
                <Text style={styles.actionText}>Compartilhar</Text>
              </Pressable>

              <Pressable
                onPress={handleDownload}
                disabled={isDownloading}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.8 },
                  isDownloading && { opacity: 0.6 },
                ]}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <IconSymbol name="arrow.down.circle.fill" size={20} color="#FFFFFF" />
                    <Text style={styles.actionText}>Baixar</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  infoContainer: {
    marginBottom: 16,
  },
  photographerText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dimensionsText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    flex: 1.5,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
