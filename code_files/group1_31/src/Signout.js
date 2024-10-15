import React from 'react';

function SignOut({ onLogout }) {
  return (
    <div>
      <button onClick={onLogout}>Sign Out</button>
    </div>
  );
}

export default SignOut;