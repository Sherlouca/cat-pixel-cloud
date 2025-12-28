import { useCallback } from "react";
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  iconActive: React.ComponentProps<typeof IconSymbol>["name"];
}

const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Home", icon: "house.fill", iconActive: "house.fill" },
  { path: "/favorites", label: "Favoritos", icon: "heart", iconActive: "heart.fill" },
  { path: "/generate", label: "Criar", icon: "sparkles", iconActive: "sparkles" },
  { path: "/profile", label: "Perfil", icon: "person.fill", iconActive: "person.fill" },
];

interface ResponsiveShellProps {
  children: React.ReactNode;
}

export function ResponsiveShell({ children }: ResponsiveShellProps) {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  const handleNavPress = useCallback(
    (path: string) => {
      router.push(path as any);
    },
    [router]
  );

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return pathname === "/" || pathname === "/index";
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  // Desktop/Tablet layout with sidebar
  if (isDesktop || isTablet) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Sidebar */}
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: colors.surface,
              borderRightColor: colors.border,
              paddingTop: insets.top + 16,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.foreground }]}>
              🐱 Cats
            </Text>
            <Text style={[styles.logoSubtext, { color: colors.muted }]}>
              Wallpaper
            </Text>
          </View>

          {/* Navigation */}
          <View style={styles.navContainer}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <Pressable
                  key={item.path}
                  onPress={() => handleNavPress(item.path)}
                  style={({ pressed }) => [
                    styles.navItem,
                    {
                      backgroundColor: active
                        ? `${colors.primary}15`
                        : "transparent",
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <IconSymbol
                    name={active ? item.iconActive : item.icon}
                    size={22}
                    color={active ? colors.primary : colors.muted}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      {
                        color: active ? colors.primary : colors.foreground,
                        fontWeight: active ? "600" : "400",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.sidebarFooter}>
            <Text style={[styles.footerText, { color: colors.muted }]}>
              Fotos por Pexels
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>{children}</View>
      </View>
    );
  }

  // Mobile layout - just render children (tabs handle navigation)
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    width: 260,
    borderRightWidth: 1,
    paddingHorizontal: 16,
  },
  logoContainer: {
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  logoSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  navContainer: {
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 15,
    marginLeft: 12,
  },
  sidebarFooter: {
    paddingHorizontal: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)",
  },
  footerText: {
    fontSize: 12,
  },
  mainContent: {
    flex: 1,
  },
});
