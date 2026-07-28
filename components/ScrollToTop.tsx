import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// react-router doesn't reset scroll position on navigation like a full page
// load would — this restores that behavior for every route change.
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // behavior: 'instant' overrides the global `scroll-behavior: smooth` in
    // index.css — a route change should jump, not visibly animate up.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
