import { createContext, useContext, useState, ReactNode } from 'react';

type BuyerContextType = {
  isBuyerMode: boolean;
  setIsBuyerMode: (value: boolean) => void;
  toggleBuyerMode: () => void;
};

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const BuyerProvider = ({ children }: { children: ReactNode }) => {
  const [isBuyerMode, setIsBuyerMode] = useState(false);

  const toggleBuyerMode = () => {
    setIsBuyerMode((prev) => !prev);
  };

  return (
    <BuyerContext.Provider value={{ isBuyerMode, setIsBuyerMode, toggleBuyerMode }}>
      {children}
    </BuyerContext.Provider>
  );
};

export const useBuyer = () => {
  const context = useContext(BuyerContext);
  if (!context) {
    throw new Error('useBuyer must be used within a BuyerProvider');
  }
  return context;
};
