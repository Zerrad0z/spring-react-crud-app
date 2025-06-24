import React from "react";
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import {LinkContainer} from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const {user, isAuthenticated, isAdmin, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <i className="bi bi-box-seam me-2"></i>
          Product Manager
        </Navbar.Brand>
        
        {isAuthenticated() && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <LinkContainer to="/">
                  <Nav.Link>
                    <i className="bi bi-house me-1"></i>
                    Dashboard
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/products">
                  <Nav.Link>
                    <i className="bi bi-box me-1"></i>
                    Products
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/categories">
                  <Nav.Link>
                    <i className="bi bi-tags me-1"></i>
                    Categories
                  </Nav.Link>
                </LinkContainer>
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
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;