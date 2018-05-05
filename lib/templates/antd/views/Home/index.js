import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="view">
        <h3 style={{ color: "purple" }}> Hello, Home! </h3>
        <Link to="/contact">Go to contact</Link>
      </div>
    );
  }
}

export default Home;
