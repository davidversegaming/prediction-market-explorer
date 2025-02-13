'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/useMarkets';
import { format } from 'date-fns';
import { TagIcon, ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const queryClient = new QueryClient();

function MarketsList() {
  const { data: markets, isLoading, error } = useMarkets();

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
        Error loading markets. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets?.map((market) => (
        <div
          key={market.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {market.image && (
            <div className="w-full h-48 relative">
              <Image
                src={market.image}
                alt={market.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              {market.status.active && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
              {market.status.closed && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  Closed
                </span>
              )}
              {market.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {market.category}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {market.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {market.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Volume</p>
                  <p className="font-semibold">${market.volume.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BeakerIcon className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-gray-500">Liquidity</p>
                  <p className="font-semibold">${market.liquidity.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {market.markets?.[0] && market.markets[0].outcomes && (
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Outcomes:</p>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const outcomes = JSON.parse(market.markets[0].outcomes);
                    const prices = JSON.parse(market.markets[0].outcomePrices);
                    return outcomes.map((outcome: string, index: number) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {outcome}: {(Number(prices[index]) * 100).toFixed(1)}%
                      </span>
                    ));
                  })()}
                </div>
              </div>
            )}
            {market.tags && market.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {market.tags.map((tag) => (
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
              <p>Starts: {format(new Date(market.startDate), 'PPP')}</p>
              <p>Ends: {format(new Date(market.endDate), 'PPP')}</p>
            </div>
          </div>
        </div>
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
            Polymarket Prediction Markets
          </h1>
          <MarketsList />
        </div>
      </main>
    </QueryClientProvider>
  );
}
