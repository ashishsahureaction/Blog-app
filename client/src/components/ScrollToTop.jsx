import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;


// window.scrollTo(0, 0) JS function call is used to scroll the window or a scrollable element to the top left corner of the viewport.
// This functionality is commonly used in web applications, especially after certain interactions or page changes, to ensure that the user's 
// viewport starts at the top of the page, providing a consistent and user-friendly experience.