import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MarketPlace.css';
import axios from 'axios';

function MarketPlace() {
  
  // Initial items with sample data


  const initialItems = [
    {
      name: 'LiteCoin',
      image: 'https://images.unsplash.com/photo-1641959928811-9ebfd8f214c0',
      description: 'Description for LiteCoin',
      price: '0.2 ETH',
      is_bought: false,
      is_sold: false,
    },
    {
      name: 'ShibaInu',
      image: 'https://images.unsplash.com/photo-1642388538891-38b2d14e750e',
      description: 'Description for ShibaInu',
      price: '0.1 ETH',
      is_bought: false,
      is_sold: false,
    },
    {
      name: 'XRPUSDT',
      image: 'https://images.unsplash.com/photo-1656523864170-d4a1b4a263b5',
      description: 'Description for XRPUSDT',
      price: '0.3 ETH',
      is_bought: false,
      is_sold: false,
    },
    {
      name: 'CyberUSDT',
      image: 'https://images.unsplash.com/photo-1618060932014-4deda4932554',
      description: 'Description for CyberUSDT',
      price: '0.4 ETH',
      is_bought: false,
      is_sold: false,
    },
    {
      name: 'TezosCoin',
      image: 'https://images.unsplash.com/photo-1639468599871-184271aa14fb',
      description: 'Description for TezosCoin',
      price: '0.2 ETH',
      is_bought: false,
      is_sold: false,
    },
    {
      name: 'Ethereum',
      image: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae',
      description: 'Description for Ethereum',
      price: '1.0 ETH',
      is_bought: false,
      is_sold: false,
    },
  ];

  // State variables to manage filtering and search

  const [filteredItems, setFilteredItems] = useState(initialItems);
  const [filterValue, setFilterValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const handleFilterChange = (e) => {
    const filtered = initialItems.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterValue(e.target.value);
    setFilteredItems(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    const filtered = initialItems.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Handle the buy action

  const handleBuy = (index) => {
    axios
      .post(`http://127.0.0.1:8000/buy-nft/${index}`)
      .then((response) => {
        const updatedItems = [...filteredItems];
        updatedItems[index].is_bought = true;
        setFilteredItems(updatedItems);

        console.log(response.data);
      })
      .catch((error) => {
        console.error("there are errors:", error);
      });
  };

  // Handle the sell action

  const handleSell = (index) => {
    axios
      .post(`http://127.0.0.1:8000/sell-nft/${index}`)
      .then((response) => {
        const updatedItems = [...filteredItems];
        updatedItems[index].is_sold = true;
        setFilteredItems(updatedItems);

        console.log(response.data);
      })
      .catch((error) => {
        console.error("there are errors:", error);
      });
  };

  return (
    <div className="marketplace">
      <div className="filter-input">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterValue}
          onChange={handleFilterChange}
        />
      </div>
      <div className="search-input">
        <input
          type="text"
          placeholder="Search by name"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="items-container">
        {filteredItems.map((item, index) => (
          <div key={index} className="item">
            <figure>
              <img src={item.image} alt={item.name} />
              <figcaption>
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <Link
                  to={`/buy/${index + 1}`}
                  className={`buy-button ${item.is_bought ? 'disabled' : ''}`}
                  onClick={() => handleBuy(index)}
                >
                  Buy
                </Link>
                <Link
                  to={`/sell/${index + 1}`}
                  className={`sell-button ${item.is_sold ? 'disabled' : ''}`}
                  onClick={() => handleSell(index)}
                >
                  Sell
                </Link>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketPlace;
