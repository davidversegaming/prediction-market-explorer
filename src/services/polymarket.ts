import axios from 'axios';

export interface Market {
  id: string;
  slug: string;
  title: string;
  description: string;
  volume: number;
  liquidity: number;
  startDate: string;
  endDate: string;
  category: string;
  image?: string;
  active: boolean;
  closed: boolean;
  status: {
    active: boolean;
    closed: boolean;
  };
  markets?: Array<{
    outcomes: string;
    outcomePrices: string;
  }>;
  tags: Array<{
    id: string;
    label: string;
    slug: string;
  }>;
}

type PolymarketApiResponse = Market[];

export const polymarketService = {
  async getMarkets(): Promise<Market[]> {
    try {
      const response = await axios.get<PolymarketApiResponse>('/api/markets');
      
      return response.data.map((market) => ({
        id: market.id,
        slug: market.slug,
        title: market.title,
        description: market.description,
        volume: Number(market.volume) || 0,
        liquidity: Number(market.liquidity) || 0,
        startDate: market.startDate,
        endDate: market.endDate,
        category: market.category || '',
        image: market.image,
        active: market.active,
        closed: market.closed,
        status: {
          active: market.active,
          closed: market.closed
        },
        markets: market.markets,
        tags: market.tags
      }));
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }
}; 