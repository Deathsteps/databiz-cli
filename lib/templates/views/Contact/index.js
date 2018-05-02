import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div>
        <h3 style={{ color: "green" }}> Hello, Contact! </h3>
        <Link to="/">Go to home</Link>
      </div>
    );
  }
}

export default Home;
