import { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Switch,
  ActivityIndicator,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { getLoginUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";
import { useWallpaperStore } from "@/stores/wallpaper-store";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePremiumStore, FREE_LIMITS } from "@/stores/premium-store";

interface SettingItemProps {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement, badge, badgeColor }: SettingItemProps) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 16,
          backgroundColor: colors.surface,
          borderRadius: 12,
          marginBottom: 8,
          opacity: pressed && onPress ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <IconSymbol name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "500" }}>
            {title}
          </Text>
          {badge && (
            <View
              style={{
                backgroundColor: badgeColor || colors.primary,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 10,
                marginLeft: 8,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "700" }}>
                {badge}
              </Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (onPress && <IconSymbol name="chevron.right" size={20} color={colors.muted} />)}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { favorites } = useWallpaperStore();
  const { 
    isPremium, 
    subscriptionPlan, 
    subscriptionExpiry, 
    loadPremiumStatus,
    getRemainingAIGenerations,
    getRemainingWallpaperViews,
  } = usePremiumStore();

  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadPremiumStatus();
  }, [loadPremiumStatus]);

  const handleLogin = useCallback(async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const loginUrl = getLoginUrl();
    if (Platform.OS === "web") {
      window.location.href = loginUrl;
    } else {
      await WebBrowser.openAuthSessionAsync(loginUrl);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await logout();
  }, [logout]);

  const handleToggleDarkMode = useCallback((value: boolean) => {
    setIsDarkMode(value);
  }, []);

  const handleToggleNotifications = useCallback((value: boolean) => {
    setNotificationsEnabled(value);
  }, []);

  const handleOpenPremium = useCallback(() => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/premium");
  }, [router]);

  const handleOpenTheCatAPI = useCallback(() => {
    Linking.openURL("https://thecatapi.com");
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="pt-2 pb-6">
          <Text className="text-3xl font-bold text-foreground">👤 Perfil</Text>
        </View>

        {/* Premium Card */}
        <Pressable
          onPress={handleOpenPremium}
          style={({ pressed }) => [
            {
              padding: 20,
              borderRadius: 16,
              marginBottom: 16,
              backgroundColor: isPremium ? colors.primary : `${colors.primary}15`,
              borderWidth: isPremium ? 0 : 1,
              borderColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          {isPremium ? (
            <View>
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">👑</Text>
                <Text className="text-xl font-bold text-white">Cats Premium</Text>
              </View>
              <Text className="text-white opacity-90">
                Plano {subscriptionPlan === "monthly" ? "Mensal" : "Anual"} • Válido até{" "}
                {subscriptionExpiry
                  ? new Date(subscriptionExpiry).toLocaleDateString("pt-BR")
                  : "-"}
              </Text>
              <View className="flex-row items-center mt-3">
                <Text className="text-white font-medium">Gerenciar assinatura</Text>
                <IconSymbol name="chevron.right" size={16} color="#FFFFFF" />
              </View>
            </View>
          ) : (
            <View>
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">👑</Text>
                <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                  Seja Premium
                </Text>
              </View>
              <Text className="text-muted mb-1">
                Desbloqueie gerações ilimitadas de IA, qualidade 4K e muito mais!
              </Text>
              <Text className="text-sm text-muted">
                A partir de R$ 4,90/mês
              </Text>
              <View className="flex-row items-center mt-3">
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Ver planos</Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </View>
            </View>
          )}
        </Pressable>

        {/* Usage Stats (for free users) */}
        {!isPremium && (
          <View
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-semibold text-foreground mb-3">
              Uso Diário (Gratuito)
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">Gerações de IA</Text>
              <Text className="text-foreground font-medium">
                {FREE_LIMITS.AI_GENERATIONS_PER_DAY - getRemainingAIGenerations()}/{FREE_LIMITS.AI_GENERATIONS_PER_DAY}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Wallpapers visualizados</Text>
              <Text className="text-foreground font-medium">
                {FREE_LIMITS.WALLPAPERS_PER_DAY - getRemainingWallpaperViews()}/{FREE_LIMITS.WALLPAPERS_PER_DAY}
              </Text>
            </View>
          </View>
        )}

        {/* User Card */}
        <View
          className="p-5 rounded-2xl mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          {isAuthenticated && user ? (
            <View className="flex-row items-center">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: colors.primary }}
              >
                {user.name ? (
                  <Text className="text-2xl font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                ) : (
                  <IconSymbol name="person.fill" size={28} color="#FFFFFF" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  {user.name || "Usuário"}
                </Text>
                {user.email && (
                  <Text className="text-sm text-muted mt-1">{user.email}</Text>
                )}
              </View>
            </View>
          ) : (
            <View className="items-center py-4">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: colors.background }}
              >
                <IconSymbol name="person.fill" size={36} color={colors.muted} />
              </View>
              <Text className="text-lg font-semibold text-foreground mb-2">
                Entre na sua conta
              </Text>
              <Text className="text-sm text-muted text-center mb-4">
                Sincronize seus favoritos em todos os dispositivos
              </Text>
              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    paddingHorizontal: 32,
                    paddingVertical: 12,
                    borderRadius: 24,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text className="text-white font-semibold text-base">Entrar</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Stats */}
        <View className="flex-row mb-6">
          <View
            className="flex-1 p-4 rounded-xl mr-2 items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-primary">{favorites.length}</Text>
            <Text className="text-sm text-muted mt-1">Favoritos</Text>
          </View>
          <View
            className="flex-1 p-4 rounded-xl ml-2 items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-2xl font-bold text-primary">0</Text>
            <Text className="text-sm text-muted mt-1">Downloads</Text>
          </View>
        </View>

        {/* Settings Section */}
        <Text className="text-sm font-semibold text-muted uppercase mb-3 ml-1">
          Configurações
        </Text>

        <SettingItem
          icon="star.fill"
          title="Cats Premium"
          subtitle={isPremium ? "Gerenciar assinatura" : "Desbloqueie todos os recursos"}
          badge={isPremium ? "ATIVO" : ""}
          badgeColor={colors.success}
          onPress={handleOpenPremium}
        />

        <SettingItem
          icon="moon.fill"
          title="Modo Escuro"
          subtitle="Tema escuro para seus olhos"
          rightElement={
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingItem
          icon="bell.fill"
          title="Notificações"
          subtitle="Novos wallpapers e atualizações"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          }
        />

        {/* About Section */}
        <Text className="text-sm font-semibold text-muted uppercase mb-3 ml-1 mt-4">
          Sobre
        </Text>

        <SettingItem
          icon="info.circle.fill"
          title="Versão"
          subtitle="1.0.0"
        />

        <SettingItem
          icon="cat.fill"
          title="Fotos por The Cat API"
          subtitle="Imagens de gatos gratuitas"
          onPress={handleOpenTheCatAPI}
        />

        {/* Logout Button */}
        {isAuthenticated && (
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              {
                marginTop: 24,
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: colors.error,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">Sair da conta</Text>
          </Pressable>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
