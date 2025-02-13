import { useQuery } from '@tanstack/react-query';
import { polymarketService, Market } from '@/services/polymarket';

export function useMarkets() {
  return useQuery<Market[]>({
    queryKey: ['markets'],
    queryFn: () => polymarketService.getMarkets(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
} 