// src/App.jsx

import React, { useState, useCallback } from 'react';
import './App.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import TripForm from './components/TripForm/TripForm';
import TripResults from './components/TripResults/TripResults';
import { useTripCalculation } from './hooks/useTripCalculation';

function App() {
  const { data, loading, error, calculateTrip, reset } = useTripCalculation();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = useCallback(async (formData) => {
    setIsCalculating(true);
    try {
      await calculateTrip(formData);
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsCalculating(false);
    }
  }, [calculateTrip]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {!data ? (
            <TripForm
              onSubmit={handleCalculate}
              loading={loading || isCalculating}
              error={error}
            />
          ) : (
            <TripResults
              data={data}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;