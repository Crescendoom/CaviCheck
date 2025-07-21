import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import './css/App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import GradientBackground from './components/GradientBg' 
import Home from './pages/Home'
import About from './pages/About'
import ContactUs from './pages/Contact-Us'
import Upload from './pages/Upload'
import Result from './pages/Result'
import { ToastProvider } from './components/ToastContext'

function App() {
  const location = useLocation();
  const isResultPage = location.pathname === '/result';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // If it's the result page, render it differently
  if (isResultPage) {
    return (
      <div className="app">
        <GradientBackground /> {/* Add gradient background */}
        <Header />
        <Routes>
          <Route path="/result" element={<Result />} />
        </Routes>
        <Footer />
      </div>
    );
  }

  // Normal layout for other pages
  return (
    <ToastProvider>
    <div className="app">
      <GradientBackground /> {/* Add gradient background */}
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              <section id="home">
                <Home />
              </section>
              <section id="about">
                <About />
              </section>
              <section id="upload">
                <Upload />
              </section>
              <section id="contact-us">
                <ContactUs />
              </section>
            </>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
    </ToastProvider>
  )
}

export default App