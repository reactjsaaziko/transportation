interface StatsCardsProps {
  activeTab: string;
}

interface CardData {
  title: string;
  bgColor: string;
  textColor: string;
  orderLabel: string;
  totalLabel: string;
}

const StatsCards = ({ activeTab }: StatsCardsProps) => {
  const getCardsByTab = (tab: string): CardData[] => {
    switch (tab) {
      case 'CHA':
        return [
          {
            title: 'Transport',
            bgColor: 'bg-gradient-to-br from-orange-100 to-orange-50',
            textColor: 'text-orange-800',
            orderLabel: 'Order:',
            totalLabel: 'Trip:',
          },
          {
            title: 'CHA',
            bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
            textColor: 'text-blue-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
          {
            title: 'Warehouse',
            bgColor: 'bg-gradient-to-br from-teal-100 to-teal-50',
            textColor: 'text-teal-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
          {
            title: 'Warehouse',
            bgColor: 'bg-gradient-to-br from-pink-100 to-pink-50',
            textColor: 'text-pink-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
        ];
      case 'Warehouse':
        return [
          {
            title: 'Warehouse A',
            bgColor: 'bg-gradient-to-br from-teal-100 to-teal-50',
            textColor: 'text-teal-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
          {
            title: 'Warehouse B',
            bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
            textColor: 'text-blue-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
        ];
      case 'Freight Forwarding':
        return [
          {
            title: 'Air Freight',
            bgColor: 'bg-gradient-to-br from-sky-100 to-sky-50',
            textColor: 'text-sky-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
          {
            title: 'Sea Freight',
            bgColor: 'bg-gradient-to-br from-blue-100 to-blue-50',
            textColor: 'text-blue-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
        ];
      case 'Inspection':
        return [
          {
            title: 'Quality Check',
            bgColor: 'bg-gradient-to-br from-green-100 to-green-50',
            textColor: 'text-green-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
        ];
      case 'Insurance':
        return [
          {
            title: 'Cargo Insurance',
            bgColor: 'bg-gradient-to-br from-purple-100 to-purple-50',
            textColor: 'text-purple-800',
            orderLabel: 'Order:',
            totalLabel: 'Total:',
          },
        ];
      default:
        return [];
    }
  };

  const cards = getCardsByTab(activeTab);

  return (
    <div className="relative">
      {/* Pink Background Banner */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 rounded-t-2xl -z-10"></div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 pb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-xl shadow-lg p-6 transform transition-all hover:scale-105 hover:shadow-xl`}
          >
            <h3 className={`text-lg font-semibold ${card.textColor} mb-4`}>
              {card.title}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${card.textColor}`}>
                  {card.orderLabel}
                </span>
                <span className={`text-sm font-semibold ${card.textColor}`}>
                  0
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${card.textColor}`}>
                  {card.totalLabel}
                </span>
                <span className={`text-sm font-semibold ${card.textColor}`}>
                  0
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
