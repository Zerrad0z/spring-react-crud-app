import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Modal, ButtonGroup, InputGroup, Alert } from 'react-bootstrap';
import { categoryService } from '../services/categoryService';
import { isAdmin } from '../services/authService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageInfo, setPageInfo] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0
  });

  const [error, setError] = useState('');
  const [editError, setEditError] = useState('');
  const userIsAdmin = isAdmin();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
      alert('Search failed: ' + err.message);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredCategories(categories);
  };

  const isValidCategoryName = (name) => /^[A-Za-z\s]+$/.test(name);


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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !userIsAdmin) return;

    if (!isValidCategoryName(name.trim())) {
      setError('Category name must contain only letters and spaces.');
      return;
    }

    setError('');

    try {
      const newCategory = await categoryService.createCategory({
        name: name.trim(),
        description: description.trim()
      });

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);

      if (searchTerm.trim() === '' ||
        newCategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredCategories(prev => [...prev, newCategory]);
      }

      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (category) => {
    if (!userIsAdmin) return;
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim() || !userIsAdmin) return;

    if (!isValidCategoryName(editName.trim())) {
      setEditError('Category name must contain only letters and spaces.');
      return;
    }

    setEditError('');

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
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      setEditError(getErrorMessage(err));
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
      await categoryService.deleteCategory(categoryToDelete.id);
      const updatedCategories = categories.filter(c => c.id !== categoryToDelete.id);
      setCategories(updatedCategories);
      setFilteredCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete category: ' + err.message);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <Container className="py-4">
      <h3 className="mb-4">Categories</h3>

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
              <Button variant="outline-secondary" type="submit">Search</Button>
              {searchTerm && (
                <Button variant="outline-danger" onClick={handleClearSearch}>Clear</Button>
              )}
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      {userIsAdmin && (
        <Card className="mb-4">
          <Card.Body>
            {error && (
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => {
                      const input = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(input)) setName(input);
                    }}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Button type="submit" variant="primary">Add Category</Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      )}

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
                          <Button variant="outline-primary" onClick={() => handleEdit(category)}>Edit</Button>
                          <Button variant="outline-danger" onClick={() => handleDeleteConfirm(category)}>Delete</Button>
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

      {/* Edit Modal */}
      {userIsAdmin && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Form onSubmit={handleEditSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editError && (
                <Alert variant="danger" dismissible onClose={() => setEditError('')}>
                  {editError}
                </Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
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
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Save Changes</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      {/* Delete Modal */}
      {userIsAdmin && (
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Categories;
