import { NextRequest } from 'next/server';
import axios from 'axios';

const POLYMARKET_API_URL = 'https://gamma-api.polymarket.com';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');

  if (!path) {
    return Response.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${POLYMARKET_API_URL}${path}`, {
      params: Object.fromEntries(searchParams.entries()),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    return Response.json(response.data);
  } catch (error) {
    console.error('Error proxying request to Polymarket API:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return Response.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 