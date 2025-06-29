import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Modal, ButtonGroup, InputGroup, Alert } from 'react-bootstrap';
import { categoryService } from '../services/categoryService';
import { isAdmin } from '../services/authService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0
  });

  // Error states
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  
  // Role-based access control
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Add Category modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

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

  const loadCategories = async (page = 0) => {
    try {
      const response = await categoryService.getAllCategoriesPaginated(page, 20);
      const categoriesList = response.content || [];
      setCategories(categoriesList);
      setFilteredCategories(categoriesList);
      setPageInfo({
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.number || 0
      });
    } catch (err) {
      console.error(err);
      setCategories([]);
      setFilteredCategories([]);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim()) {
        const results = await categoryService.searchCategory(searchTerm, { page: 0, size: 100 });
        setFilteredCategories(results.content || results || []);
      } else {
        setFilteredCategories(categories);
      }
    } catch (err) {
      console.error(err);
      setError('Search failed: ' + getErrorMessage(err));
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredCategories(categories);
    setError(''); // Clear any previous errors
  };

  const isValidCategoryName = (name) => /^[A-Za-z\s]+$/.test(name);

  const handleAddCategory = () => {
    if (!userIsAdmin) return;
    setAddName('');
    setAddDescription('');
    setModalError('');
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addName.trim() || !userIsAdmin) return;

    if (!isValidCategoryName(addName.trim())) {
      setModalError('Category name must contain only letters and spaces.');
      return;
    }

    // Show success message
    setSuccessMessage(`Category "${addName.trim()}" has been successfully added!`);
      
    // Clear any existing errors
    setError('');

    setModalError('');

    try {
      const newCategory = await categoryService.createCategory({
        name: addName.trim(),
        description: addDescription.trim()
      });

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);

      if (searchTerm.trim() === '' ||
        newCategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredCategories(prev => [...prev, newCategory]);
      }

      setShowAddModal(false);
      setAddName('');
      setAddDescription('');
    } catch (err) {
      console.error(err);
      setModalError(getErrorMessage(err));
    }
  };

  const handleEdit = (category) => {
    if (!userIsAdmin) return;
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setModalError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !userIsAdmin) return;

    if (!isValidCategoryName(editName.trim())) {
      setModalError('Category name must contain only letters and spaces.');
      return;
    }

    setModalError('');

    try {
      const updated = await categoryService.updateCategory(editingCategory.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });

      const updatedCategories = categories.map(c =>
        c.id === editingCategory.id ? updated : c
      );

      setCategories(updatedCategories);
      setFilteredCategories(updatedCategories.filter(c =>
        searchTerm.trim() === '' ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      setShowEditModal(false);
      const categoryName = editingCategory.name;
      setEditingCategory(null);

      // Show success message
      setSuccessMessage(`Category "${categoryName}" has been successfully updated!`);
      
      // Clear any existing errors
      setError('');

    } catch (err) {
      console.error(err);
      setModalError(getErrorMessage(err));
    }
  };

  const handleDeleteConfirm = (category) => {
    if (!userIsAdmin) return;
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete || !userIsAdmin) return;

    try {
      const categorytName = categoryToDelete.name;
      await categoryService.deleteCategory(categoryToDelete.id);
      const updatedCategories = categories.filter(c => c.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      setFilteredCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);

      // Show success message
      setSuccessMessage(`Category "${categorytName}" has been successfully deleted!`);
      
      // Clear any existing errors
      setError('');

    } catch (err) {
      console.error(err);
      setError('Failed to delete category: ' + getErrorMessage(err));
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3>Categories</h3>
        </Col>
        {userIsAdmin && (
          <Col xs="auto">
            <Button variant="primary" onClick={handleAddCategory}>
              Add New Category
            </Button>
          </Col>
        )}
      </Row>

      {/* Success Message Alert */}
      {successMessage && (
        <Alert variant="success" dismissible onClose={() => setSuccessMessage('')} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
        </Alert>
      )}

      {/* Global Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search categories by name..."
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

      {/* Categories Table */}
      <Card>
        <Card.Body>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                {userIsAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={userIsAdmin ? 4 : 3} className="text-center text-muted">
                    {searchTerm ? 'No matching categories found' : 'No categories found'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td><strong>{category.name}</strong></td>
                    <td className="text-muted">{category.description || '-'}</td>
                    {userIsAdmin && (
                      <td>
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-primary" 
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => handleDeleteConfirm(category)}
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
        </Card.Body>
      </Card>

      {/* Add Category Modal - Only for Admin */}
      {userIsAdmin && (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Form onSubmit={handleAddSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalError && (
                <Alert variant="danger" dismissible onClose={() => setModalError('')}>
                  {modalError}
                </Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={addName}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(input)) setAddName(input);
                  }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter description (optional)"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Category
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Edit Category Modal - Only for Admin */}
      {userIsAdmin && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Form onSubmit={handleEditSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalError && (
                <Alert variant="danger" dismissible onClose={() => setModalError('')}>
                  {modalError}
                </Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editName}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^[A-Za-z\s]*$/.test(input)) setEditName(input);
                  }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Category
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
            Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Category
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Categories;