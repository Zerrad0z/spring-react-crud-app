import React, { useState } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

const LoginForm = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username.trim() && formData.password.trim()) {
      onLogin(formData);
    }
  };

  return (
    <Card className="shadow">
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <i className="bi bi-box-seam display-4 text-primary"></i>
          <h3 className="mt-2">Product Manager</h3>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-person me-2"></i>
              Username
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <i className="bi bi-lock me-2"></i>
              Password
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={loading || !formData.username.trim() || !formData.password.trim()}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Sign In
              </>
            )}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Contact admin for account access
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;