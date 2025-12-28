import { View, Text, Pressable, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { usePremiumStore } from "@/stores/premium-store";
import { useRouter } from "expo-router";

/**
 * AdBanner Component
 * 
 * Displays a banner ad for free users. Premium users don't see ads.
 * 
 * IMPORTANT: For production, you need to:
 * 1. Install expo-ads-admob: npx expo install expo-ads-admob
 * 2. Configure AdMob in app.config.ts with your AdMob App ID
 * 3. Replace this placeholder with actual AdMob BannerAd component
 * 
 * AdMob Setup:
 * 1. Create account at https://admob.google.com
 * 2. Add your app (Android/iOS)
 * 3. Create ad units (Banner, Interstitial, Rewarded)
 * 4. Get your App ID and Ad Unit IDs
 * 
 * Test Ad Unit IDs (for development):
 * - Android Banner: ca-app-pub-3940256099942544/6300978111
 * - iOS Banner: ca-app-pub-3940256099942544/2934735716
 */

interface AdBannerProps {
  size?: "banner" | "largeBanner" | "mediumRectangle";
}

export function AdBanner({ size = "banner" }: AdBannerProps) {
  const colors = useColors();
  const router = useRouter();
  const { isPremium, isLoading } = usePremiumStore();

  // Don't show ads for premium users
  if (isPremium || isLoading) {
    return null;
  }

  // Get banner height based on size
  const getHeight = () => {
    switch (size) {
      case "largeBanner":
        return 100;
      case "mediumRectangle":
        return 250;
      default:
        return 50;
    }
  };

  // Placeholder banner - replace with actual AdMob in production
  return (
    <View
      style={{
        height: getHeight(),
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
      }}
    >
      <Pressable
        onPress={() => router.push("/premium")}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>
          📢 Anúncio • {" "}
        </Text>
        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "600" }}>
          Remova anúncios com Premium
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * AdInterstitial Hook
 * 
 * Use this hook to show interstitial ads at natural break points
 * (e.g., after downloading a wallpaper, after generating with AI)
 * 
 * IMPORTANT: For production, implement with expo-ads-admob
 * 
 * Test Ad Unit IDs (for development):
 * - Android Interstitial: ca-app-pub-3940256099942544/1033173712
 * - iOS Interstitial: ca-app-pub-3940256099942544/4411468910
 */
export function useAdInterstitial() {
  const { isPremium } = usePremiumStore();

  const showInterstitial = async () => {
    if (isPremium) {
      return; // Don't show ads for premium users
    }

    // TODO: Implement with expo-ads-admob
    // const { loaded } = await AdMobInterstitial.getIsReadyAsync();
    // if (loaded) {
    //   await AdMobInterstitial.showAdAsync();
    // }
    
    console.log("[AdInterstitial] Would show interstitial ad here");
  };

  const loadInterstitial = async () => {
    if (isPremium) {
      return;
    }

    // TODO: Implement with expo-ads-admob
    // await AdMobInterstitial.setAdUnitID('your-ad-unit-id');
    // await AdMobInterstitial.requestAdAsync();
    
    console.log("[AdInterstitial] Would load interstitial ad here");
  };

  return {
    showInterstitial,
    loadInterstitial,
  };
}

/**
 * AdRewarded Hook
 * 
 * Use this hook to show rewarded ads that give users extra benefits
 * (e.g., extra AI generations, unlock premium wallpapers temporarily)
 * 
 * IMPORTANT: For production, implement with expo-ads-admob
 * 
 * Test Ad Unit IDs (for development):
 * - Android Rewarded: ca-app-pub-3940256099942544/5224354917
 * - iOS Rewarded: ca-app-pub-3940256099942544/1712485313
 */
export function useAdRewarded() {
  const { isPremium } = usePremiumStore();

  const showRewarded = async (): Promise<boolean> => {
    if (isPremium) {
      return true; // Premium users get rewards without watching ads
    }

    // TODO: Implement with expo-ads-admob
    // const { loaded } = await AdMobRewarded.getIsReadyAsync();
    // if (loaded) {
    //   await AdMobRewarded.showAdAsync();
    //   return true; // User watched the ad
    // }
    
    console.log("[AdRewarded] Would show rewarded ad here");
    return true; // For demo, always return true
  };

  const loadRewarded = async () => {
    if (isPremium) {
      return;
    }

    // TODO: Implement with expo-ads-admob
    // await AdMobRewarded.setAdUnitID('your-ad-unit-id');
    // await AdMobRewarded.requestAdAsync();
    
    console.log("[AdRewarded] Would load rewarded ad here");
  };

  return {
    showRewarded,
    loadRewarded,
  };
}
