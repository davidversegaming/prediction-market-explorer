import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const POLYMARKET_API_URL = 'https://gamma-api.polymarket.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Use the correct endpoint for fetching a specific event
    const response = await axios.get(`${POLYMARKET_API_URL}/events/${params.slug}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching from Polymarket API:', error);
    
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
} 