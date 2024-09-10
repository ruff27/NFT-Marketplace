import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <img src="https://images.unsplash.com/photo-1642239817356-9dffb1bcc156" alt='background'/>
      <div className="about-us-text">
        <h3>About Us</h3>
      </div>
      <div className="homepage-text">
        <p>This is a Swinburne University of Technology project done by Group 1-31 in Semester 2 2023. The group members are Nur E Siam, Ruffin Remad & Tamjid Mostafa who have combined to make this project which is about making a responsive website on NFT Marketplace. The project requires further work on back-end development. This is just a front-end product.</p>
      </div>
    </div>
  );
}

export default HomePage;