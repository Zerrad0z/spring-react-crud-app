import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col } from 'react-bootstrap';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts({ page: 0, size: 100 }),
        categoryService.getAllCategories()
      ]);
      
      setProducts(productsData.content || productsData || []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.content || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !categoryId) return;

    try {
      const newProduct = await productService.createProduct({
        name: name.trim(),
        price: parseFloat(price),
        categoryId: parseInt(categoryId)
      });    
      const category = categories.find(cat => cat.id === parseInt(categoryId));
      const productWithCategory = {
        ...newProduct,
        categoryName: category?.name || 'Unknown'
      };
      
      setProducts([...products, productWithCategory]);
      setName('');
      setPrice('');
      setCategoryId('');
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Container className="py-4">
      <h3 className="mb-4">Products</h3>
      
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button type="submit" variant="primary">
                  Add Product
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td><strong>{product.name}</strong></td>
                    <td className="text-success">{formatPrice(product.price)}</td>
                    <td className="text-muted">{product.categoryName || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Products;