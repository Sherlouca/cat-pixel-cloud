import { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { usePremiumStore, SUBSCRIPTION_PLANS, FREE_LIMITS } from "@/stores/premium-store";

const PREMIUM_FEATURES = [
  {
    icon: "sparkles" as const,
    title: "Gerador de IA Ilimitado",
    description: `Crie quantos wallpapers quiser (grátis: ${FREE_LIMITS.AI_GENERATIONS_PER_DAY}/dia)`,
  },
  {
    icon: "photo.fill" as const,
    title: "Wallpapers Ilimitados",
    description: `Acesse todos os wallpapers (grátis: ${FREE_LIMITS.WALLPAPERS_PER_DAY}/dia)`,
  },
  {
    icon: "star.fill" as const,
    title: "Qualidade 4K",
    description: "Baixe em resolução máxima para telas grandes",
  },
  {
    icon: "xmark" as const,
    title: "Sem Anúncios",
    description: "Experiência limpa e sem interrupções",
  },
  {
    icon: "cat.fill" as const,
    title: "Categorias Exclusivas",
    description: "Acesso a Filhotes, Raças Raras e Artístico",
  },
  {
    icon: "clock.fill" as const,
    title: "Acesso Antecipado",
    description: "Veja novos wallpapers antes de todos",
  },
];

export default function PremiumScreen() {
  const colors = useColors();
  const router = useRouter();
  const { isPremium, setPremium, subscriptionPlan, subscriptionExpiry } = usePremiumStore();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = useCallback(async () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsProcessing(true);

    try {
      // Simular processo de compra
      // Em produção, aqui você integraria com Google Play Billing ou Apple IAP
      
      // Calcular data de expiração
      const expiryDate = new Date();
      if (selectedPlan === "monthly") {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      // Por enquanto, simular sucesso
      // TODO: Integrar com Google Play Billing / Apple IAP
      Alert.alert(
        "Assinatura Premium",
        "Para ativar a assinatura, você precisará configurar o Google Play Billing na Play Console após publicar o app.\n\nPor enquanto, vou ativar o modo premium para demonstração.",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Ativar Demo",
            onPress: async () => {
              await setPremium(selectedPlan, expiryDate.toISOString());
              if (Platform.OS === "ios" || Platform.OS === "android") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
              Alert.alert(
                "Bem-vindo ao Premium! 🎉",
                "Agora você tem acesso a todos os recursos premium.",
                [{ text: "Aproveitar!", onPress: () => router.back() }]
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Subscription error:", error);
      Alert.alert("Erro", "Não foi possível processar a assinatura. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPlan, setPremium, router]);

  const handleRestore = useCallback(() => {
    Alert.alert(
      "Restaurar Compras",
      "Esta funcionalidade estará disponível após a integração com Google Play Billing.",
      [{ text: "OK" }]
    );
  }, []);

  // Se já é premium, mostrar status
  if (isPremium) {
    return (
      <ScreenContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          {/* Header */}
          <View className="pt-2 pb-6 items-center">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary }}
            >
              <IconSymbol name="star.fill" size={40} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-bold text-foreground">Você é Premium! 🎉</Text>
            <Text className="text-base text-muted mt-2 text-center">
              Aproveite todos os recursos exclusivos
            </Text>
          </View>

          {/* Status Card */}
          <View
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-lg font-semibold text-foreground mb-3">
              Detalhes da Assinatura
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-muted">Plano</Text>
              <Text className="text-foreground font-medium">
                {subscriptionPlan === "monthly" ? "Mensal" : "Anual"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">Válido até</Text>
              <Text className="text-foreground font-medium">
                {subscriptionExpiry
                  ? new Date(subscriptionExpiry).toLocaleDateString("pt-BR")
                  : "-"}
              </Text>
            </View>
          </View>

          {/* Features List */}
          <Text className="text-lg font-semibold text-foreground mb-4">
            Seus Benefícios
          </Text>
          {PREMIUM_FEATURES.map((feature, index) => (
            <View
              key={index}
              className="flex-row items-center mb-4"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <IconSymbol name={feature.icon} size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium">{feature.title}</Text>
                <Text className="text-sm text-muted">{feature.description}</Text>
              </View>
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
            </View>
          ))}

          {/* Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: "center",
                marginTop: 16,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-white font-semibold text-base">Voltar ao App</Text>
          </Pressable>
        </ScrollView>
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
        <View className="pt-2 pb-4 items-center">
          <Text className="text-4xl mb-2">👑</Text>
          <Text className="text-3xl font-bold text-foreground">Cats Premium</Text>
          <Text className="text-base text-muted mt-2 text-center">
            Desbloqueie todo o potencial do app
          </Text>
        </View>

        {/* Features List */}
        <View
          className="rounded-2xl p-4 mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          {PREMIUM_FEATURES.map((feature, index) => (
            <View
              key={index}
              className={`flex-row items-center ${index < PREMIUM_FEATURES.length - 1 ? "mb-4 pb-4 border-b" : ""}`}
              style={{ borderColor: colors.border }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <IconSymbol name={feature.icon} size={24} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">{feature.title}</Text>
                <Text className="text-sm text-muted mt-0.5">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <Text className="text-lg font-semibold text-foreground mb-3">
          Escolha seu plano
        </Text>

        {/* Yearly Plan */}
        <Pressable
          onPress={() => setSelectedPlan("yearly")}
          style={({ pressed }) => [
            {
              borderWidth: 2,
              borderColor: selectedPlan === "yearly" ? colors.primary : colors.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              backgroundColor: selectedPlan === "yearly" ? `${colors.primary}10` : colors.surface,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-foreground">
                  {SUBSCRIPTION_PLANS.yearly.name}
                </Text>
                <View
                  className="ml-2 px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.success }}
                >
                  <Text className="text-white text-xs font-bold">
                    -{SUBSCRIPTION_PLANS.yearly.savings}
                  </Text>
                </View>
              </View>
              <Text className="text-muted text-sm mt-1">
                {SUBSCRIPTION_PLANS.yearly.description}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-foreground">
                {SUBSCRIPTION_PLANS.yearly.price}
              </Text>
              <Text className="text-muted text-sm">/{SUBSCRIPTION_PLANS.yearly.period}</Text>
            </View>
          </View>
        </Pressable>

        {/* Monthly Plan */}
        <Pressable
          onPress={() => setSelectedPlan("monthly")}
          style={({ pressed }) => [
            {
              borderWidth: 2,
              borderColor: selectedPlan === "monthly" ? colors.primary : colors.border,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              backgroundColor: selectedPlan === "monthly" ? `${colors.primary}10` : colors.surface,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-lg font-bold text-foreground">
                {SUBSCRIPTION_PLANS.monthly.name}
              </Text>
              <Text className="text-muted text-sm mt-1">
                {SUBSCRIPTION_PLANS.monthly.description}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-foreground">
                {SUBSCRIPTION_PLANS.monthly.price}
              </Text>
              <Text className="text-muted text-sm">/{SUBSCRIPTION_PLANS.monthly.period}</Text>
            </View>
          </View>
        </Pressable>

        {/* Subscribe Button */}
        <Pressable
          onPress={handleSubscribe}
          disabled={isProcessing}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              paddingVertical: 18,
              borderRadius: 14,
              alignItems: "center",
              opacity: pressed ? 0.8 : isProcessing ? 0.5 : 1,
            },
          ]}
        >
          <Text className="text-white font-bold text-lg">
            {isProcessing ? "Processando..." : "Assinar Agora"}
          </Text>
        </Pressable>

        {/* Restore & Terms */}
        <View className="mt-4 items-center">
          <Pressable onPress={handleRestore}>
            <Text style={{ color: colors.primary }} className="text-sm">
              Restaurar compras anteriores
            </Text>
          </Pressable>
          <Text className="text-xs text-muted mt-3 text-center leading-5">
            A assinatura será renovada automaticamente. Você pode cancelar a qualquer momento
            nas configurações da Play Store. Ao assinar, você concorda com nossos Termos de
            Uso e Política de Privacidade.
          </Text>
        </View>

        {/* Close Button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            {
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 16,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-muted font-medium">Continuar com versão gratuita</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
