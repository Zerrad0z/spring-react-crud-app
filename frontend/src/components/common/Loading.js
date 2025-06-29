import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const Loading = ({ size = 'lg', text = 'Loading...' }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <div className="text-center">
        <Spinner animation="border" variant="primary" size={size} />
        <div className="mt-2 text-muted">{text}</div>
      </div>
    </Container>
  );
};

export default Loading;