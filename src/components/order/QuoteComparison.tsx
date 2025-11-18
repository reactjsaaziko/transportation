import { useState } from 'react';
import { Check } from 'lucide-react';

type Quote = {
  id: string;
  provider: string;
  logo: string;
  coverType: string;
  recommended: boolean;
  topCoverages: string[];
  features: string[];
  price: string;
  priceInINR: string;
  addToCompare: boolean;
};

const QuoteComparison = () => {
  const [quotes] = useState<Quote[]>([
    {
      id: '1',
      provider: 'digit',
      logo: '🔷',
      coverType: 'All Risk Cover',
      recommended: true,
      topCoverages: ['Theft/Burglary', 'Loading and unloading', 'Malicious damage'],
      features: ['Is data covered'],
      price: '₹ 4,41,948',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '2',
      provider: 'digit',
      logo: '🔷',
      coverType: 'Basic Cover',
      recommended: false,
      topCoverages: ['Loading and unloading', 'Collision', 'Fire, lightning or explosion'],
      features: ['Is data covered'],
      price: '₹ 850',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '3',
      provider: 'Marsh',
      logo: '🔵',
      coverType: 'All Risk Cover',
      recommended: false,
      topCoverages: ['Theft/Burglary', 'Loading and unloading', 'Malicious damage'],
      features: ['Is data covered'],
      price: '₹ 1,200',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '4',
      provider: 'Marsh',
      logo: '🔵',
      coverType: 'Basic Cover',
      recommended: false,
      topCoverages: ['Loading and unloading', 'Collision', 'Fire, lightning or explosion'],
      features: ['Is data covered'],
      price: '₹ 1,200',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '5',
      provider: 'Bajaj Allianz',
      logo: '🔴',
      coverType: 'All Risk Cover',
      recommended: false,
      topCoverages: ['Theft/Burglary', 'Loading and unloading', 'Malicious damage'],
      features: ['Is data covered'],
      price: '₹ 1,900',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '6',
      provider: 'Bajaj Allianz',
      logo: '🔴',
      coverType: 'Basic Cover',
      recommended: false,
      topCoverages: ['Loading and unloading', 'Collision', 'Fire, lightning or explosion'],
      features: ['Is data covered'],
      price: '₹ 2,000',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '7',
      provider: 'Oriental',
      logo: '🟣',
      coverType: 'All Risk Cover',
      recommended: false,
      topCoverages: ['Theft/Burglary', 'Loading and unloading', 'Malicious damage'],
      features: ['Is data covered'],
      price: '₹ 900',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '8',
      provider: 'Oriental',
      logo: '🟣',
      coverType: 'Basic Cover',
      recommended: false,
      topCoverages: ['Loading and unloading', 'Collision', 'Fire, lightning or explosion'],
      features: ['Is data covered'],
      price: '₹ 900',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '9',
      provider: 'TATA AIG',
      logo: '🔵',
      coverType: 'All Risk Cover',
      recommended: false,
      topCoverages: ['Theft/Burglary', 'Loading and unloading', 'Malicious damage'],
      features: ['Is data covered'],
      price: '₹ 1,980',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
    {
      id: '10',
      provider: 'TATA AIG',
      logo: '🔵',
      coverType: 'Basic Cover',
      recommended: false,
      topCoverages: ['Loading and unloading', 'Collision', 'Fire, lightning or explosion'],
      features: ['Is data covered'],
      price: '₹ 1,700',
      priceInINR: '₹ 4,41,948',
      addToCompare: false,
    },
  ]);

  const toggleCompare = (id: string) => {
    // Toggle compare functionality
  };

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
                quote.recommended ? 'border-blue-500 border-2' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Left Section - Provider Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                        {quote.logo}
                      </div>

                      {/* Provider Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-gray-900">{quote.provider}</span>
                          {quote.recommended && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
                              ★ Recommended
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {quote.coverType}
                          </span>
                        </div>

                        {/* Top Coverages */}
                        <div className="mb-3">
                          <p className="text-xs font-medium text-green-600 mb-2">Top coverages</p>
                          <div className="flex flex-wrap gap-2">
                            {quote.topCoverages.map((coverage, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                <Check className="h-3 w-3 text-green-500" />
                                <span>{coverage}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {quote.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                              <Check className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                              <button className="text-green-600 hover:text-green-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Price & Actions */}
                  <div className="flex flex-col items-end gap-3 ml-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Current amount</p>
                      <p className="text-2xl font-bold text-gray-900">{quote.price}</p>
                      <p className="text-xs text-gray-500">{quote.priceInINR}</p>
                    </div>
                    <button className="rounded-lg bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors">
                      ₹ {quote.price.replace('₹ ', '')}
                    </button>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quote.addToCompare}
                        onChange={() => toggleCompare(quote.id)}
                        className="rounded border-gray-300"
                      />
                      Add to compare
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;
