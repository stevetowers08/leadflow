import React from 'react';
import { FallbackAuth } from './FallbackAuth';

export const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <FallbackAuth />
      </div>
    </div>
  );
};
