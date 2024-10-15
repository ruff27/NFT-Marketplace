import React from 'react';
import './History.css';

function History() {
  // Transaction data
    const transactions = [
    {
      id: 1,
      description: 'Sold LiteCoin',
      amount: '0.2 ETH',
      date: '2023-09-01',
    },
    {
      id: 2,
      description: 'Bought Ethereum',
      amount: '-0.5 ETH',
      date: '2023-08-28',
    },
    {
      id: 3,
      description: 'Sold ShibaInu',
      amount: '0.1 ETH',
      date: '2023-08-25',
    },
    {
      id: 4,
      description: 'Bought XRPUSDT',
      amount: '-0.3 ETH',
      date: '2023-08-20',
    },
    
  ];

  const remainingCredit = '2.0 ETH';

  return (
    <div className="history">
      <div className="header-box">
        <h2>Transaction History</h2>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="remaining-credit-box">
        <h2>Remaining Credit</h2>
        <p>{remainingCredit}</p>
      </div>
    </div>
  );
}

export default History;
