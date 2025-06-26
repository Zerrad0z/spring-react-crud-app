import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Row, Col, Modal, ButtonGroup, InputGroup } from 'react-bootstrap';
import { categoryService } from '../services/categoryService';

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

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Delete modal state
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newCategory = await categoryService.createCategory({
        name: name.trim(),
        description: description.trim()
      });
      
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      
      // Update filtered categories if the new category matches the search term
      if (searchTerm.trim() === '' || 
          newCategory.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredCategories(prev => [...prev, newCategory]);
      }
      
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Failed to create category: ' + err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;

    try {
      const updated = await categoryService.updateCategory(editingCategory.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });

      const updatedCategories = categories.map(c =>
        c.id === editingCategory.id ? updated : c
      );
      
      setCategories(updatedCategories);
      
      if (searchTerm.trim() === '' || 
          updated.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        setFilteredCategories(updatedCategories.filter(c => 
          searchTerm.trim() === '' || 
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        setFilteredCategories(prev => prev.filter(c => c.id !== editingCategory.id));
      }
      
      setShowEditModal(false);
      setEditingCategory(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update category: ' + err.message);
    }
  };

  const handleDeleteConfirm = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

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

      {/* Add Form */}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <Button type="submit" variant="primary">
                  Add Category
                </Button>
              </Col>
            </Row>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    {searchTerm ? 'No matching categories found' : 'No categories found'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map(category => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td><strong>{category.name}</strong></td>
                    <td className="text-muted">{category.description || '-'}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button variant="outline-primary" onClick={() => handleEdit(category)}>Edit</Button>
                        <Button variant="outline-danger" onClick={() => handleDeleteConfirm(category)}>Delete</Button>
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
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category "<strong>{categoryToDelete?.name}</strong>"? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Categories;