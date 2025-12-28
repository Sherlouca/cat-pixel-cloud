import { useCallback, useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { usePremiumStore, FREE_LIMITS } from "@/stores/premium-store";

const EXAMPLE_PROMPTS = [
  "Gato astronauta no espaço",
  "Gato samurai com armadura",
  "Gato dormindo em nuvens",
  "Gato cyberpunk neon",
  "Gato mago com chapéu",
  "Gato pirata no mar",
];

export default function GenerateScreen() {
  const colors = useColors();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    isPremium, 
    canGenerateAI, 
    getRemainingAIGenerations, 
    incrementAIGeneration,
    loadPremiumStatus,
    isLoading: isPremiumLoading 
  } = usePremiumStore();

  const generateMutation = trpc.generate.create.useMutation();

  // Load premium status on mount
  useEffect(() => {
    loadPremiumStatus();
  }, [loadPremiumStatus]);

  const remainingGenerations = getRemainingAIGenerations();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Digite uma descrição para o wallpaper");
      return;
    }

    // Check if user can generate
    if (!canGenerateAI()) {
      Alert.alert(
        "Limite Atingido",
        `Você atingiu o limite de ${FREE_LIMITS.AI_GENERATIONS_PER_DAY} gerações por dia.\n\nAssine o Premium para gerações ilimitadas!`,
        [
          { text: "Depois", style: "cancel" },
          { text: "Ver Premium", onPress: () => router.push("/premium") },
        ]
      );
      return;
    }

    if (Platform.OS === "ios" || Platform.OS === "android") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Increment usage before generating
      const allowed = await incrementAIGeneration();
      if (!allowed) {
        Alert.alert(
          "Limite Atingido",
          "Assine o Premium para gerações ilimitadas!",
          [
            { text: "Depois", style: "cancel" },
            { text: "Ver Premium", onPress: () => router.push("/premium") },
          ]
        );
        setIsGenerating(false);
        return;
      }

      const result = await generateMutation.mutateAsync({
        prompt: prompt.trim(),
      });

      setGeneratedImage(result.url || null);

      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Erro ao gerar wallpaper. Tente novamente.");
      if (Platform.OS === "ios" || Platform.OS === "android") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, generateMutation, canGenerateAI, incrementAIGeneration, router]);

  const handleShare = useCallback(async () => {
    if (!generatedImage) return;

    setIsSharing(true);

    try {
      if (Platform.OS === "web") {
        if (navigator.share) {
          await navigator.share({
            title: "Cat Pixel Cloud - IA",
            text: `🐱 Wallpaper de gato criado com IA!\n\n"${prompt}"\n\nCriado com Cat Pixel Cloud`,
            url: generatedImage,
          });
        } else {
          await navigator.clipboard.writeText(generatedImage);
          Alert.alert("Link copiado!", "O link do wallpaper foi copiado para a área de transferência.");
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          const filename = `cat_wallpaper_${Date.now()}.jpg`;
          const localUri = (FileSystem.cacheDirectory || '') + filename;
          
          const downloadResult = await FileSystem.downloadAsync(
            generatedImage,
            localUri
          );

          if (downloadResult.status === 200) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: "image/jpeg",
              dialogTitle: "Compartilhar Wallpaper",
              UTI: "public.jpeg",
            });

            if (Platform.OS === "ios" || Platform.OS === "android") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
          } else {
            throw new Error("Failed to download image");
          }
        } else {
          Alert.alert(
            "Compartilhamento indisponível",
            "O compartilhamento não está disponível neste dispositivo."
          );
        }
      }
    } catch (err) {
      console.error("Share error:", err);
      if ((err as Error).message !== "Share was cancelled") {
        Alert.alert("Erro", "Não foi possível compartilhar o wallpaper.");
      }
    } finally {
      setIsSharing(false);
    }
  }, [generatedImage, prompt]);

  const handleExamplePress = useCallback((example: string) => {
    setPrompt(example);
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setPrompt("");
    setGeneratedImage(null);
    setError(null);
  }, []);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="pt-2 pb-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-3xl font-bold text-foreground">✨ Criar Wallpaper</Text>
              {isPremium && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-xs font-bold">PREMIUM</Text>
                </View>
              )}
            </View>
            <Text className="text-sm text-muted mt-1">
              Use IA para criar wallpapers únicos de gatos
            </Text>
          </View>

          {/* Usage Counter (for free users) */}
          {!isPremium && !isPremiumLoading && (
            <Pressable
              onPress={() => router.push("/premium")}
              style={({ pressed }) => [
                {
                  backgroundColor: remainingGenerations <= 1 ? `${colors.warning}20` : colors.surface,
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View className="flex-row items-center">
                <IconSymbol 
                  name="sparkles" 
                  size={20} 
                  color={remainingGenerations <= 1 ? colors.warning : colors.primary} 
                />
                <Text 
                  className="ml-2 font-medium"
                  style={{ color: remainingGenerations <= 1 ? colors.warning : colors.foreground }}
                >
                  {remainingGenerations} {remainingGenerations === 1 ? "geração restante" : "gerações restantes"} hoje
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text style={{ color: colors.primary, fontSize: 13 }}>
                  Seja Premium
                </Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </View>
            </Pressable>
          )}

          {/* Input Section */}
          <View
            className="rounded-2xl p-4 mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm font-medium text-foreground mb-2">
              Descreva seu wallpaper
            </Text>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Ex: Gato fofo usando óculos de sol na praia..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              maxLength={500}
              returnKeyType="done"
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 14,
                color: colors.foreground,
                fontSize: 16,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
            <Text className="text-xs text-muted mt-2 text-right">
              {prompt.length}/500
            </Text>
          </View>

          {/* Example Prompts */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-muted mb-3">
              💡 Ideias para você
            </Text>
            <View className="flex-row flex-wrap">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleExamplePress(example)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 16,
                      marginRight: 8,
                      marginBottom: 8,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={{ color: colors.foreground, fontSize: 13 }}>
                    {example}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Generate Button */}
          <Pressable
            onPress={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                opacity: pressed ? 0.8 : isGenerating || !prompt.trim() ? 0.5 : 1,
                marginBottom: 16,
              },
            ]}
          >
            {isGenerating ? (
              <>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                  Gerando...
                </Text>
              </>
            ) : (
              <>
                <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold text-base ml-2">
                  Gerar Wallpaper
                </Text>
              </>
            )}
          </Pressable>

          {/* Error Message */}
          {error && (
            <View
              className="p-4 rounded-xl mb-4"
              style={{ backgroundColor: `${colors.error}20` }}
            >
              <Text style={{ color: colors.error, textAlign: "center" }}>
                {error}
              </Text>
            </View>
          )}

          {/* Generated Image Preview */}
          {generatedImage && (
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-foreground">
                  Resultado
                </Text>
                <Pressable
                  onPress={handleClear}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Text style={{ color: colors.primary, fontSize: 14 }}>
                    Limpar
                  </Text>
                </Pressable>
              </View>
              <View
                className="rounded-2xl overflow-hidden"
                style={{ aspectRatio: 0.5625 }}
              >
                <Image
                  source={{ uri: generatedImage }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={300}
                />
              </View>
              
              {/* Action Buttons */}
              <View className="flex-row mt-4 gap-3">
                <Pressable
                  onPress={() => {
                    // TODO: Implement download
                  }}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: colors.surface,
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <IconSymbol name="arrow.down.circle.fill" size={20} color={colors.foreground} />
                  <Text style={{ color: colors.foreground, marginLeft: 8, fontWeight: "600" }}>
                    Baixar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleShare}
                  disabled={isSharing}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: "#1DA1F2",
                      paddingVertical: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      opacity: pressed ? 0.8 : isSharing ? 0.5 : 1,
                    },
                  ]}
                >
                  {isSharing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <IconSymbol name="square.and.arrow.up" size={20} color="#FFFFFF" />
                      <Text className="text-white font-semibold ml-2">
                        Compartilhar
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>

              <Pressable
                onPress={handleGenerate}
                disabled={isGenerating}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.primary,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    opacity: pressed ? 0.8 : isGenerating ? 0.5 : 1,
                    marginTop: 12,
                  },
                ]}
              >
                <IconSymbol name="sparkles" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">
                  Regenerar
                </Text>
              </Pressable>
            </View>
          )}

          {/* Premium Upsell Card (for free users) */}
          {!isPremium && !isPremiumLoading && (
            <Pressable
              onPress={() => router.push("/premium")}
              style={({ pressed }) => [
                {
                  backgroundColor: `${colors.primary}15`,
                  borderRadius: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-lg mr-2">👑</Text>
                <Text className="text-lg font-bold" style={{ color: colors.primary }}>
                  Cats Premium
                </Text>
              </View>
              <Text className="text-sm text-muted leading-5">
                Desbloqueie gerações ilimitadas, qualidade 4K e muito mais!
              </Text>
              <View className="flex-row items-center mt-3">
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  Ver planos
                </Text>
                <IconSymbol name="chevron.right" size={16} color={colors.primary} />
              </View>
            </Pressable>
          )}

          {/* Info Card */}
          <View
            className="p-4 rounded-xl mt-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm text-muted leading-5">
              💡 <Text className="font-medium">Dica:</Text> Seja específico na descrição para
              obter melhores resultados. Inclua detalhes como estilo artístico, cores e cenário.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
