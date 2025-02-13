'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMarkets } from '@/hooks/useMarkets';
import { format } from 'date-fns';

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
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {market.question}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {market.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Last Price</p>
                <p className="font-semibold">${Number(market.lastPrice).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Volume</p>
                <p className="font-semibold">${Number(market.volume).toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Expires: {format(new Date(market.expiresAt), 'PPP')}
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
