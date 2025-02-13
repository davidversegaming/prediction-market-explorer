'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Event, Market } from '@/services/polymarket';
import { format } from 'date-fns';
import { ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { polymarketService } from '@/services/polymarket';

function MarketCard({ market }: { market: Market }) {
  const formatPercentage = (priceStr: string) => {
    try {
      const price = Number(priceStr);
      return (price * 100).toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 1
      });
    } catch {
      return '0.0';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        {market.active && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Active
          </span>
        )}
        {market.closed && (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            Closed
          </span>
        )}
        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
          {market.marketType}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {market.question}
      </h3>
      <p className="text-gray-600 mb-4">{market.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500">Volume</p>
          <p className="font-semibold">${Number(market.volume).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Liquidity</p>
          <p className="font-semibold">${Number(market.liquidity).toLocaleString()}</p>
        </div>
      </div>

      {market.outcomes && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Current Odds:</p>
          <div className="flex flex-wrap gap-2">
            {(() => {
              try {
                const outcomes = JSON.parse(market.outcomes);
                const prices = JSON.parse(market.outcomePrices);

                if (!Array.isArray(outcomes) || !Array.isArray(prices)) {
                  return <span className="text-gray-500">No odds available</span>;
                }

                return outcomes.map((outcome: string, index: number) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-white text-gray-700 rounded-full text-sm shadow-sm"
                  >
                    {outcome}: {formatPercentage(prices[index])}%
                  </span>
                ));
              } catch {
                return <span className="text-gray-500">Error loading odds</span>;
              }
            })()}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Best Bid</p>
            <p className="font-semibold">{(market.bestBid * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-500">Best Ask</p>
            <p className="font-semibold">{(market.bestAsk * 100).toFixed(1)}%</p>
          </div>
        </div>
        <p className="mt-2">Last Trade: {market.lastTradePrice > 0 ? `${(market.lastTradePrice * 100).toFixed(1)}%` : 'No trades'}</p>
      </div>
    </div>
  );
}

function EventDetails() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.slug) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      try {
        const data = await polymarketService.getEventBySlug(params.slug as string);
        if (!data) {
          throw new Error('Event not found');
        }
        setEvent(data);
        setError(null);
      } catch (error) {
        console.error('Error loading event:', error);
        setError(error instanceof Error ? error.message : 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center text-red-500 py-8">
        {error || 'Event not found'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {event.image && (
          <div className="w-full h-64 relative bg-gray-100">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
              onError={(e) => {
                const imgElement = e.target as HTMLImageElement;
                imgElement.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="p-8">
          <div className="flex items-center gap-2 mb-4">
            {event.active && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </span>
            )}
            {event.closed && (
              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                Closed
              </span>
            )}
            {event.category && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {event.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">{event.description}</p>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <ChartBarIcon className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-gray-500">Total Volume</p>
                <p className="text-xl font-semibold">${event.volume.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BeakerIcon className="h-6 w-6 text-gray-500" />
              <div>
                <p className="text-gray-500">Total Liquidity</p>
                <p className="text-xl font-semibold">${event.liquidity.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Markets ({event.markets.length})</h2>
            <div className="space-y-6">
              {event.markets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>Event Start: {format(new Date(event.startDate), 'PPP')}</p>
            <p>Event End: {format(new Date(event.endDate), 'PPP')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <EventDetails />
    </main>
  );
} 