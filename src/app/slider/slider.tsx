import React, { useState } from 'react';
import Head from 'next/head';

const Slider = () => {
  const [sliderValue, setSliderValue] = useState(25);

  const handleSliderInput = (e) => {
    const value = e.target.value;
    setSliderValue(Number(value));
  };

  return (
    <>
      <Head>
        {/* Make sure the path to the CSS file is correct */}
        <link rel="stylesheet" href="/slider.css" />
        {/* Make sure the path to the JS file is correct. Use 'defer' to execute it after the document has been parsed */}
        <script src="/slider.js" defer />
      </Head>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderInput}
          className="slider" // This class should match a class in your slider.css
        />
        {/* Include any additional HTML structure as needed for your slider */}
      </div>
    </>
  );
};

export default Slider;
