import React, { useState, useEffect } from 'react';

const slides = [
    { image: '/images/slide_index_1.jpg', alt: 'Vergency Banner 1' },
    { image: '/images/slide_index_2.jpg', alt: 'Vergency Banner 2' },
];

const MainBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
        }, 5000); 

        return () => clearInterval(slideInterval);
    }, []); 

    return (
        <div className="main-slider-container">
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div key={index} className="slide">
                        <img src={slide.image} alt={slide.alt} />
                    </div>
                ))}
            </div>
            
            <div className="slider-dots">
                {slides.map((_, index) => (
                    <button 
                        key={index} 
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default MainBanner;