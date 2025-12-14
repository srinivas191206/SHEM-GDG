import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EnergyData {
  consumption: number; // in Watts
  cost: number; // in Rupees
}

interface EnergyDataContextType {
  energyData: EnergyData | null;
  loading: boolean;
  error: string | null;
}

const EnergyDataContext = createContext<EnergyDataContextType | undefined>(undefined);

interface EnergyDataProviderProps {
  children: ReactNode;
}

export const EnergyDataProvider: React.FC<EnergyDataProviderProps> = ({ children }) => {
  const [energyData, setEnergyData] = useState<EnergyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data fetching for now. Replace with WebSocket or polling in the future.
    const fetchEnergyData = () => {
      setLoading(true);
      setError(null);
      try {
        const mockData: EnergyData = {
          consumption: Math.floor(Math.random() * 1000) + 100, // 100-1099W
          cost: parseFloat((Math.random() * 500).toFixed(2)), // 0-500 INR
        };
        setEnergyData(mockData);
      } catch (err) {
        setError('Failed to fetch energy data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData(); // Initial fetch
    const interval = setInterval(fetchEnergyData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <EnergyDataContext.Provider value={{ energyData, loading, error }}>
      {children}
    </EnergyDataContext.Provider>
  );
};

export const useEnergyData = () => {
  const context = useContext(EnergyDataContext);
  if (context === undefined) {
    throw new Error('useEnergyData must be used within an EnergyDataProvider');
  }
  return context;
};