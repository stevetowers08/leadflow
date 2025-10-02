import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AgencyDashboard from "@/pages/AgencyDashboard";
import EventDashboard from "@/pages/EventDashboard";
import Reporting from "@/pages/Reporting";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventDashboard />} />
        <Route path="/agency" element={<AgencyDashboard />} />
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/client/:clientId" element={<Reporting />} />
        <Route path="/reporting" element={<Reporting />} />
        {/* Redirect any other routes to event dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
