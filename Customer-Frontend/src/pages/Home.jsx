import React from 'react';
import './Home.css';
import myGif from '../assets/Generique.gif';

function Home() {
  return (
    <div id='Home'>
      <div className='left-half'>
        <div className='home-content'>
          <h1>Our Secret</h1>
          <p>We strive to bring you the finest ingredient by only selecting the freshest produce. We priotize locally grown ingredients to ensure the freshest, most flavorful dishes. All while supporting local farmers.</p>
        </div>
      </div>
      <div className='right-half'>
        <img src={myGif} alt="My GIF" className ="gif-image" style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
    </div>
  );
}

export default Home;
