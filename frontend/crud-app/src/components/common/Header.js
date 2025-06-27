import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Call isAuthenticated as a function
  if (!isAuthenticated()) {
    return null; 
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Product Manager
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Only show Dashboard link for admin users */}
            {isAdmin() && (
              <Nav.Link as={Link} to="/dashboard">
                <i className="bi bi-house me-1"></i>
                Dashboard
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/products">
              <i className="bi bi-box me-1"></i>
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/categories">
              <i className="bi bi-tags me-1"></i>
              Categories
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Navbar.Text className="me-3">
              <i className="bi bi-person-circle me-1"></i>
              {user?.username} 
              <span className={`badge ms-2 ${isAdmin() ? 'bg-danger' : 'bg-secondary'}`}>
                {user?.role}
              </span>
            </Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    );
};

export default Header;