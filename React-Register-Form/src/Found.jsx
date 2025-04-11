import './Found.css';
import { Link } from 'react-router-dom';

export default function Found() {
  return (
    <div className="container">
    <div className="found-container">
      <h1>404 - Page Not Found</h1>
      <p>click here to Login .</p>
      <Link to="/">Go to Login</Link>
    </div>
    </div>
    
  );
}
