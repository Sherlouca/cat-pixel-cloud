import { useCallback, useEffect } from "react";
import { useWallpaperStore, CATEGORIES, pexelsToWallpaper } from "@/stores/wallpaper-store";
import { trpc } from "@/lib/trpc";

const PER_PAGE = 20;

export function useWallpapers() {
  const {
    wallpapers,
    isLoading,
    error,
    page,
    hasMore,
    selectedCategory,
    selectedTab,
    favorites,
    setWallpapers,
    appendWallpapers,
    setLoading,
    setError,
    setPage,
    setHasMore,
    setSelectedCategory,
    setSelectedTab,
    toggleFavorite,
    isFavorite,
    reset,
  } = useWallpaperStore();

  // Get the query for the selected category
  const getQuery = useCallback(() => {
    const category = CATEGORIES.find((c) => c.id === selectedCategory);
    return category?.query || "cat";
  }, [selectedCategory]);

  // Fetch wallpapers from server
  const fetchWallpapersMutation = trpc.wallpapers.search.useMutation();

  const fetchWallpapers = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      if (isLoading) return;

      setLoading(true);
      setError(null);

      try {
        const query = getQuery();
        const result = await fetchWallpapersMutation.mutateAsync({
          query,
          page: pageNum,
          perPage: PER_PAGE,
        });

        const newWallpapers = result.photos.map(pexelsToWallpaper);

        if (append) {
          appendWallpapers(newWallpapers);
        } else {
          setWallpapers(newWallpapers);
        }

        setPage(pageNum);
        setHasMore(newWallpapers.length === PER_PAGE);
      } catch (err) {
        console.error("Error fetching wallpapers:", err);
        setError("Erro ao carregar wallpapers. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [
      isLoading,
      getQuery,
      setLoading,
      setError,
      setWallpapers,
      appendWallpapers,
      setPage,
      setHasMore,
      fetchWallpapersMutation,
    ]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchWallpapers(page + 1, true);
    }
  }, [isLoading, hasMore, page, fetchWallpapers]);

  const refresh = useCallback(() => {
    reset();
    fetchWallpapers(1, false);
  }, [reset, fetchWallpapers]);

  // Get favorite wallpapers
  const getFavoriteWallpapers = useCallback(() => {
    return wallpapers.filter((w) => favorites.includes(w.id));
  }, [wallpapers, favorites]);

  return {
    wallpapers,
    isLoading,
    error,
    hasMore,
    selectedCategory,
    selectedTab,
    favorites,
    categories: CATEGORIES,
    fetchWallpapers,
    loadMore,
    refresh,
    setSelectedCategory,
    setSelectedTab,
    toggleFavorite,
    isFavorite,
    getFavoriteWallpapers,
  };
}
