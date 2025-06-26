import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Modal, ButtonGroup, InputGroup } from 'react-bootstrap';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts({ page: 0, size: 100 }),
        categoryService.getAllCategories()
      ]);
      
      const productsList = productsData.content || productsData || [];
      setProducts(productsList);
      setFilteredProducts(productsList);
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.content || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim()) {
        const results = await productService.searchProduct(searchTerm, { page: 0, size: 100 });
        setFilteredProducts(results.content || results || []);
      } else {
        setFilteredProducts(products);
      }
    } catch (err) {
      console.error(err);
      alert('Search failed: ' + err.message);
    }
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
      
      const updatedProducts = [...products, productWithCategory];
      setProducts(updatedProducts);
      
      // Update filtered products if the new product matches the search term
      if (searchTerm.trim() === '' || 
          productWithCategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredProducts(prev => [...prev, productWithCategory]);
      }
      
      setName('');
      setPrice('');
      setCategoryId('');
    } catch (err) {
      console.error(err);
      alert('Failed to create product: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditCategoryId(product.categoryId?.toString() || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPrice || !editCategoryId) return;

    try {
      const updatedProduct = await productService.updateProduct(editingProduct.id, {
        name: editName.trim(),
        price: parseFloat(editPrice),
        categoryId: parseInt(editCategoryId)
      });
      
      const category = categories.find(cat => cat.id === parseInt(editCategoryId));
      const productWithCategory = {
        ...updatedProduct,
        categoryName: category?.name || 'Unknown'
      };

      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? productWithCategory : p
      );
      
      setProducts(updatedProducts);
      
      // Update filtered products
      if (searchTerm.trim() === '' || 
          productWithCategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredProducts(updatedProducts.filter(p => 
          searchTerm.trim() === '' || 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        setFilteredProducts(prev => prev.filter(p => p.id !== editingProduct.id));
      }
      
      setShowEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update product: ' + err.message);
    }
  };

  const handleDeleteConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      setProducts(updatedProducts);
      setFilteredProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product: ' + err.message);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(products);
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
      
      {/* Search Bar */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                Search
              </Button>
              {searchTerm && (
                <Button variant="outline-danger" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Add Product Form */}
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

      {/* Products Table */}
      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    {searchTerm ? 'No matching products found' : 'No products found'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td><strong>{product.name}</strong></td>
                    <td className="text-success">{formatPrice(product.price)}</td>
                    <td className="text-muted">{product.categoryName || '-'}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleDeleteConfirm(product)}
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Product
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Products;