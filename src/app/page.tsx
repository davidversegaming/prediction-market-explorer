'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/useMarkets';
import { format } from 'date-fns';
import { TagIcon, ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

const queryClient = new QueryClient();

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    return format(date, 'PPP');
  } catch {
    return 'Date not available';
  }
};

function EventsList() {
  const { data: events, isLoading, error } = useMarkets();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading events. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events?.map((event) => (
        <Link
          href={`/events/${event.slug}`}
          key={event.id}
          className="block"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {event.image && (
              <div className="w-full h-48 relative bg-gray-100">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
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
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {event.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Volume</p>
                    <p className="font-semibold">${event.volume.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BeakerIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-gray-500">Liquidity</p>
                    <p className="font-semibold">${event.liquidity.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              {event.markets[0] && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Current Odds:</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const outcomes = JSON.parse(event.markets[0].outcomes);
                        const prices = JSON.parse(event.markets[0].outcomePrices);

                        if (!Array.isArray(outcomes) || !Array.isArray(prices)) {
                          return <span className="text-gray-500">No odds available</span>;
                        }

                        return outcomes.map((outcome: string, index: number) => {
                          const price = Number(prices[index] || 0);
                          const percentage = (price * 100).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 1
                          });

                          return (
                            <span
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {outcome}: {percentage}%
                            </span>
                          );
                        });
                      } catch (error) {
                        console.error('Error parsing outcomes:', error);
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}
              {event.tags && event.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 space-y-1 text-sm text-gray-500">
                <p>Starts: {formatDate(event.startDate)}</p>
                <p>Ends: {formatDate(event.endDate)}</p>
                <p className="mt-2 text-blue-600">
                  {event.markets.length} market{event.markets.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Polymarket Prediction Events
          </h1>
          <EventsList />
        </div>
      </main>
    </QueryClientProvider>
  );
}
