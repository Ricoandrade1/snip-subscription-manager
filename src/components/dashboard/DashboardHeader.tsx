import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="text-center space-y-4">
      <h1 className="text-4xl font-bold text-barber-gold">
        Dashboard
      </h1>
      <p className="text-barber-light/60 max-w-2xl mx-auto">
        Visão geral do seu negócio
      </p>
    </header>
  );
};

export default DashboardHeader;