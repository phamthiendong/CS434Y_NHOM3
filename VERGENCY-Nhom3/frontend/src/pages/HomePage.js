import React from 'react';
import MainBanner from '../components/MainBanner.js';
import PolicySection from '../components/PolicySection.js';

const HomePage = () => {
  return (
    <>
      <MainBanner />
    
      <main className="container">
        <PolicySection />
        
        <section className="about-section-home">
            <h2 className="section-title">VERGENCY</h2>
            <p className="about-text">Satisfy You - Happy Us.</p>
        </section>

      </main>
    </>
  );
};

export default HomePage;