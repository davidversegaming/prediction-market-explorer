import axios from 'axios';

const POLYMARKET_API_URL = 'https://clob.polymarket.com';

export interface Market {
  id: string;
  question: string;
  description: string;
  volume: string;
  lastPrice: string;
  expiresAt: string;
  imageHash?: string;
}

interface PolymarketApiResponse {
  markets: {
    id: string;
    question: string;
    description?: string;
    volume?: string;
    lastPrice?: string;
    expiresAt: string;
    imageHash?: string;
  }[];
}

export const polymarketService = {
  async getMarkets(): Promise<Market[]> {
    try {
      const response = await axios.get<PolymarketApiResponse>(`${POLYMARKET_API_URL}/markets`);
      return response.data.markets.map((market) => ({
        id: market.id,
        question: market.question,
        description: market.description || '',
        volume: market.volume || '0',
        lastPrice: market.lastPrice || '0',
        expiresAt: market.expiresAt,
        imageHash: market.imageHash
      }));
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }
}; 