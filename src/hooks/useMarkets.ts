import { useQuery } from '@tanstack/react-query';
import { polymarketService, Event } from '@/services/polymarket';

export function useMarkets() {
  return useQuery<Event[]>({
    queryKey: ['markets'],
    queryFn: () => polymarketService.getEvents(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
} 