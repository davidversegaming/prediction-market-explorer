import axios from 'axios';

export interface Market {
  id: string;
  question: string;
  description: string;
  image?: string;
  icon?: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  liquidity: string;
  active: boolean;
  closed: boolean;
  startDate: string;
  endDate: string;
  category: string;
  volumeNum: number;
  liquidityNum: number;
  marketType: string;
  bestBid: number;
  bestAsk: number;
  lastTradePrice: number;
  tags?: Array<{
    id: string;
    label: string;
    slug: string;
  }>;
}

export interface Event {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  category?: string;
  volume: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  startDate: string;
  endDate: string;
  markets: Market[];
  tags: Array<{
    id: string;
    label: string;
    slug: string;
  }>;
}

export const polymarketService = {
  async getEvents(): Promise<Event[]> {
    try {
      const response = await axios.get('/api/proxy', {
        params: {
          path: '/events',
          limit: 50,
          order: 'volume',
          ascending: false,
          active: true,
          closed: false
        }
      });

      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to fetch events');
    }
  },

  async getEventById(eventId: string): Promise<Event | null> {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    try {
      const response = await axios.get('/api/proxy', {
        params: {
          path: `/events/${eventId}`
        }
      });

      if (!response.data) {
        throw new Error('Event not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Failed to fetch event');
    }
  }
}; 