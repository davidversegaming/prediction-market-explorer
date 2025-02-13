import axios from 'axios';

const POLYMARKET_API_URL = 'https://gamma-api.polymarket.com';

export interface Market {
  id: string;
  slug: string;
  question: string;
  description: string;
  volume: string;
  liquidity: string;
  startDate: string;
  endDate: string;
  tags: string[];
  status: {
    active: boolean;
    closed: boolean;
  };
}

interface PolymarketApiResponse {
  results: {
    id: string;
    slug: string;
    title: string;
    description: string;
    volume: string;
    liquidity: string;
    start_date: string;
    end_date: string;
    tags: Array<{ label: string }>;
    status: {
      active: boolean;
      closed: boolean;
    };
  }[];
}

export const polymarketService = {
  async getMarkets(): Promise<Market[]> {
    try {
      const response = await axios.get<PolymarketApiResponse>(`${POLYMARKET_API_URL}/events`, {
        params: {
          limit: 50,
          order: 'volume',
          ascending: false,
          active: true,
          closed: false
        }
      });

      return response.data.results.map((market) => ({
        id: market.id,
        slug: market.slug,
        question: market.title,
        description: market.description,
        volume: market.volume,
        liquidity: market.liquidity,
        startDate: market.start_date,
        endDate: market.end_date,
        tags: market.tags.map(tag => tag.label),
        status: market.status
      }));
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }
}; 