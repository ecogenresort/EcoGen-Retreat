import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import BookingPage from './pages/BookingPage';
import Admin from './pages/Admin';

function SiteLayout() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Admin dashboard is standalone — no public Navbar/Footer/Chatbot */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<SiteLayout />} />
      </Routes>
    </HashRouter>
  );
}

export default App;