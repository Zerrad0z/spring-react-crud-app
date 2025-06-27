import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

const LoginForm = ({ onLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Prevent multiple submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple rapid submissions
    if (isSubmitting || loading) {
      console.log(' Submission blocked - already in progress');
      return;
    }

    // Validate form data
    const username = formData.username.trim();
    const password = formData.password.trim();
    
    if (!username || !password) {
      console.log(' Submission blocked - missing credentials');
      return;
    }

    console.log(' Form submission started with:', {
      username,
      password: password ? '***' : 'MISSING',
      isSubmitting,
      loading
    });

    try {
      setIsSubmitting(true);
      
      // Create a clean credentials object
      const credentials = {
        username,
        password
      };
      
      // Call the onLogin function
      await onLogin(credentials);
      
      // Clear form only after successful login
      setFormData({
        username: '',
        password: ''
      });
      
      console.log('Login successful, form cleared');
      
    } catch (error) {
      console.error(' Login failed:', error);
      // Don't clear form on error so user can try again
    } finally {
      // Add a small delay to prevent rapid resubmissions
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const isFormDisabled = loading || isSubmitting;
  const canSubmit = formData.username.trim() && formData.password.trim() && !isFormDisabled;

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
              disabled={isFormDisabled}
              autoComplete="username"
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
              disabled={isFormDisabled}
              autoComplete="current-password"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={!canSubmit}
          >
            {isFormDisabled ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {isSubmitting ? 'Signing in...' : 'Processing...'}
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