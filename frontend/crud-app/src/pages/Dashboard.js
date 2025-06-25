import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const categories = await categoryService.getAllCategories();
      const products = await productService.getAllProducts({ page: 0, size: 5 });
      
      setStats({
        totalProducts: products.totalElements || 0,
        totalCategories: categories.length || 0,
        recentProducts: products.content || []
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.username}!</p>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-primary">{stats.totalProducts}</h2>
              <p>Total Products</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <h2 className="text-success">{stats.totalCategories}</h2>
              <p>Total Categories</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Quick Actions</h5>
          <Link to="/products" className="me-3">
            <Button variant="primary">Manage Products</Button>
          </Link>
          <Link to="/categories">
            <Button variant="success">Manage Categories</Button>
          </Link>
        </Card.Body>
      </Card>

      {/* Recent Products */}
      <Card>
        <Card.Body>
          <h5 className="mb-3">Recent Products</h5>
          {stats.recentProducts.length === 0 ? (
            <p className="text-muted">
              No products yet. <Link to="/products">Create your first product!</Link>
            </p>
          ) : (
            <Row>
              {stats.recentProducts.map(product => (
                <Col md={6} key={product.id} className="mb-3">
                  <Card className="border-light">
                    <Card.Body>
                      <h6>{product.name}</h6>
                      <p className="text-success mb-1">${product.price}</p>
                      <small className="text-muted">{product.categoryName}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;