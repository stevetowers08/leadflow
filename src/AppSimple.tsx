import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const AppSimple = () => {
  console.log('🚀 AppSimple rendering');
  
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>App Simple Test</h1>
        <p>If you can see this, React Router is working!</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </BrowserRouter>
  );
};

export default AppSimple;
