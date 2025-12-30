import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileBooking from './MobileBooking';
import BookingCalendar from './BookingCalendar';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingCalendar />} />
      <Route path="/mobile" element={<MobileBooking />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
