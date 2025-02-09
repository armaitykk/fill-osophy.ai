import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-container" style={{ backgroundColor: "#02343d" , paddingTop: "20px"}}>
        <img src="./logo.png" alt="Logo" className="logo" style={{ width: "5%" }} />
        <h1 className="app-name">LAW<span style={{ color:"white", marginTop: "2px", paddingBottom:"10px",fontWeight: '400' }}>gorithm</span></h1>

      </div>
    </header>
  );
}

export default Header;