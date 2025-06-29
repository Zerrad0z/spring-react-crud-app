import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Modal, ButtonGroup, InputGroup, Alert, Pagination } from 'react-bootstrap';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { isAdmin } from '../services/authService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  
  // Error states
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  
  // Role-based access control
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  
  // Add Product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addCategoryId, setAddCategoryId] = useState('');
  
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
    // Check admin status when component mounts and update state
    const checkAdminStatus = () => {
      try {
        setUserIsAdmin(isAdmin());
      } catch (error) {
        console.error('Error checking admin status:', error);
        setUserIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, []);

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize, filterCategoryId]); 

  useEffect(() => {
    loadCategories();
  }, []);

  const getErrorMessage = (error) => {
    // Handle ErrorResponse structure from backend
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Handle string responses (fallback)
    if (typeof error.response?.data === 'string') {
      return error.response.data;
    }
    
    // Handle direct error message
    if (error.message) {
      return error.message;
    }
    
    // Default fallback
    return 'An unexpected error occurred';
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAllCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.content || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      let productsData;
      
      if (isSearching && searchTerm.trim()) {
        // Search products
        productsData = await productService.searchProduct(searchTerm, { 
          page: currentPage, 
          size: pageSize 
        });
      } else if (filterCategoryId) {
        // Filter by category 
        productsData = await productService.getProductsByCategory(filterCategoryId, {
          page: currentPage,
          size: pageSize
        });
      } else {
        // Get all products
        productsData = await productService.getAllProducts({ 
          page: currentPage, 
          size: pageSize 
        });
      }
      
      // Handle paginated response
      if (productsData && productsData.content) {
        setProducts(productsData.content);
        setTotalPages(productsData.totalPages || 0);
        setTotalElements(productsData.totalElements || 0);
      } else {
        // Handle non-paginated response (fallback)
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalPages(1);
        setTotalElements(Array.isArray(productsData) ? productsData.length : 0);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load products: ' + getErrorMessage(err));
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setFilterCategoryId(''); // Clear category filter when searching
    setCurrentPage(0); // Reset to first page when searching
    
    try {
      if (searchTerm.trim()) {
        const results = await productService.searchProduct(searchTerm, { 
          page: 0, 
          size: pageSize 
        });
        
        if (results && results.content) {
          setProducts(results.content);
          setTotalPages(results.totalPages || 0);
          setTotalElements(results.totalElements || 0);
        } else {
          setProducts(Array.isArray(results) ? results : []);
          setTotalPages(1);
          setTotalElements(Array.isArray(results) ? results.length : 0);
        }
      } else {
        setIsSearching(false);
        loadData();
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed: ' + getErrorMessage(err));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(0);
    setError(''); // Clear any previous errors
    loadData();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleAddProduct = () => {
    if (!userIsAdmin) return;
    setAddName('');
    setAddPrice('');
    setAddCategoryId('');
    setModalError('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addName.trim() || !addPrice || !addCategoryId || !userIsAdmin) return;

    // Validate price
    const priceValue = parseFloat(addPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      setModalError('Price must be a valid positive number.');
      return;
    }

    setModalError('');

    try {
      await productService.createProduct({
        name: addName.trim(),
        price: priceValue,
        categoryId: parseInt(addCategoryId)
      });    
      
      setShowAddModal(false);
      setAddName('');
      setAddPrice('');
      setAddCategoryId('');
      
      // Reload data to reflect changes
      loadData();
    } catch (err) {
      console.error('Failed to create product:', err);
      setModalError(getErrorMessage(err));
    }
  };

  const handleEdit = (product) => {
    if (!userIsAdmin) return;
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price.toString());
    setEditCategoryId(product.categoryId?.toString() || '');
    setModalError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !editPrice || !editCategoryId || !userIsAdmin) return;

    // Validate price
    const priceValue = parseFloat(editPrice);
    if (isNaN(priceValue) || priceValue <= 0) {
      setModalError('Price must be a valid positive number.');
      return;
    }

    setModalError('');

    try {
      await productService.updateProduct(editingProduct.id, {
        name: editName.trim(),
        price: priceValue,
        categoryId: parseInt(editCategoryId)
      });
      
      setShowEditModal(false);
      setEditingProduct(null);
      
      // Reload data to reflect changes
      loadData();
    } catch (err) {
      console.error('Failed to update product:', err);
      setModalError(getErrorMessage(err));
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setFilterCategoryId(categoryId);
    setIsSearching(false); // Clear search when filtering by category
    setSearchTerm(''); // Clear search term
    setCurrentPage(0); // Reset to first page
    setError(''); // Clear any previous errors
  };

  const handleClearCategoryFilter = () => {
    setFilterCategoryId('');
    setCurrentPage(0);
    setError(''); // Clear any previous errors
    loadData();
  };

  const handleDeleteConfirm = (product) => {
    if (!userIsAdmin) return;
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete || !userIsAdmin) return;

    try {
      await productService.deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
      
      // Reload data to reflect changes
      loadData();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product: ' + getErrorMessage(err));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Calculate start and end pages
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      items.push(
        <Pagination.Item key={0} onClick={() => handlePageChange(0)}>
          1
        </Pagination.Item>
      );
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Visible pages
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handlePageChange(page)}
        >
          {page + 1}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages - 1}
          onClick={() => handlePageChange(totalPages - 1)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  // Get current filter info for display
  const getCurrentFilterInfo = () => {
    if (isSearching && searchTerm) {
      return `filtered by "${searchTerm}"`;
    }
    if (filterCategoryId) {
      const category = categories.find(cat => cat.id.toString() === filterCategoryId.toString());
      return `filtered by category "${category?.name || 'Unknown'}"`;
    }
    return '';
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3>Products</h3>
        </Col>
        {userIsAdmin && (
          <Col xs="auto">
            <Button variant="primary" onClick={handleAddProduct}>
              Add New Product
            </Button>
          </Col>
        )}
      </Row>
      
      {/* Global Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          {error}
        </Alert>
      )}
      
      {/* Search Bar and Category Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={6}>
                <Form.Label>Search Products</Form.Label>
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
              </Col>
              <Col md={6}>
                <Form.Label>Filter by Category</Form.Label>
                <InputGroup>
                  <Form.Select
                    value={filterCategoryId}
                    onChange={(e) => handleCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                  {filterCategoryId && (
                    <Button variant="outline-danger" onClick={handleClearCategoryFilter}>
                      Clear Filter
                    </Button>
                  )}
                </InputGroup>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Products Table */}
      <Card>
        <Card.Body>
          {/* Results Info and Page Size Selector */}
          <Row className="mb-3 align-items-center">
            <Col md={8}>
              <small className="text-muted">
                Showing {products.length} of {totalElements} products
                {getCurrentFilterInfo() && ` (${getCurrentFilterInfo()})`}
              </small>
            </Col>
            <Col md={4} className="text-end">
              <Form.Select
                size="sm"
                style={{ width: 'auto', display: 'inline-block' }}
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </Form.Select>
            </Col>
          </Row>

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                {userIsAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={userIsAdmin ? 5 : 4} className="text-center text-muted">
                    {getCurrentFilterInfo() ? 'No matching products found' : 'No products found'}
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td><strong>{product.name}</strong></td>
                    <td className="text-success">{formatPrice(product.price)}</td>
                    <td className="text-muted">{product.categoryName || '-'}</td>
                    {userIsAdmin && (
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(0)}
                />
                <Pagination.Prev 
                  disabled={currentPage === 0}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {generatePaginationItems()}
                
                <Pagination.Next 
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
                <Pagination.Last 
                  disabled={currentPage === totalPages - 1}
                  onClick={() => handlePageChange(totalPages - 1)}
                />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Product Modal - Only for Admin */}
      {userIsAdmin && (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Form onSubmit={handleAddSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalError && (
                <Alert variant="danger" dismissible onClose={() => setModalError('')}>
                  {modalError}
                </Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={addCategoryId}
                  onChange={(e) => setAddCategoryId(e.target.value)}
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
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Product
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Edit Modal - Only for Admin */}
      {userIsAdmin && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Form onSubmit={handleEditSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalError && (
                <Alert variant="danger" dismissible onClose={() => setModalError('')}>
                  {modalError}
                </Alert>
              )}
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
      )}

      {/* Delete Confirmation Modal - Only for Admin */}
      {userIsAdmin && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the product "<strong>{productToDelete?.name}</strong>"? This action cannot be undone.
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
      )}
    </Container>
  );
};

export default Products;