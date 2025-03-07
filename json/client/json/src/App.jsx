import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Moon, Sun } from 'lucide-react';

// Define keyframes for animations
const rotateY = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(180deg);
  }
`;

const rotateYBack = keyframes`
  0% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  transition: colors 0.3s;
  background-color: #FFB8E0; /* Updated background color */
  color: ${(props) => (props.darkMode ? '#cbd5e0' : '#2d3748')};
  font-family: 'Nunito Sans', sans-serif;
  position: relative;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ThemeButton = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  background-color: ${(props) => (props.darkMode ? '#4a5568' : '#e2e8f0')};
  color: ${(props) => (props.darkMode ? '#cbd5e0' : '#2d3748')};
  border: none;
  cursor: pointer;
  z-index: 1000;
`;

const CreateButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #76BA1B; /* Light theme button color */
  color: #ffffff;
  border: none;
  cursor: pointer;
  z-index: 1000;

  &:hover {
    background-color: #63a310;
  }
`;

const FormContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent white */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  backdrop-filter: blur(10px); /* Blur effect for glass look */
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  display: ${(props) => (props.visible ? 'block' : 'none')};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => (props.darkMode ? '#4a5568' : '#cbd5e0')};
  border-radius: 4px;
  background-color: ${(props) => (props.darkMode ? '#1a202c' : '#edf2f7')};
  color: ${(props) => (props.darkMode ? '#cbd5e0' : '#2d3748')};
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid ${(props) => (props.darkMode ? '#4a5568' : '#cbd5e0')};
  border-radius: 4px;
  background-color: ${(props) => (props.darkMode ? '#1a202c' : '#edf2f7')};
  color: ${(props) => (props.darkMode ? '#cbd5e0' : '#2d3748')};
  height: 100px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.darkMode ? '#9333ea' : '#76BA1B')};
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.darkMode ? '#8b5cf6' : '#63a310')};
  }
`;

const Toast = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.type === 'success' ? '#4caf50' : '#e74c3c')};
  color: #ffffff;
  padding: 1rem;
  border-radius: 4px;
  z-index: 1000;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const Card = styled.div`
  perspective: 1000px;
  cursor: pointer;
  position: relative;
`;

const Front = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: 8px;
  background-color: ${(props) => (props.darkMode ? '#000000' : '#ffffff')}; /* Background color */
  color: ${(props) => (props.darkMode ? '#ffffff' : '#000000')}; /* Text color */
  position: relative;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 0.6s;

  ${Card}:hover & {
    animation: ${rotateY} 0.6s forwards;
  }
`;

const Back = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border-radius: 8px;
  background-color: ${(props) => (props.darkMode ? '#000000' : '#ffffff')}; /* Background color */
  color: ${(props) => (props.darkMode ? '#ffffff' : '#000000')}; /* Text color */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backface-visibility: hidden;
  transform: rotateY(-180deg);
  transform-style: preserve-3d;
  transition: transform 0.6s;
  padding: 1rem;

  ${Card}:hover & {
    animation: ${rotateYBack} 0.6s forwards;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const DeleteButton = styled(Button)`
  background-color: #e53e3e;

  &:hover {
    background-color: #c53030;
  }
`;

const EditButton = styled(Button)`
  background-color: #4299e1;

  &:hover {
    background-color: #3182ce;
  }
`;

const App = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: '', title: '', body: '', userId: 1 });
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${formData.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) throw new Error('Failed to update post');
        const updatedPost = await response.json();
        setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
        console.log('Post updated successfully:', updatedPost);
        showToast('Post updated successfully!', 'success');
      } else {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({ title: formData.title, body: formData.body, userId: formData.userId }),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        if (!response.ok) throw new Error('Failed to create post');
        const newPost = await response.json();
        newPost.id = Date.now();
        setPosts([newPost, ...posts]);
        console.log('Post created successfully:', newPost);
        showToast('Post created successfully!', 'success');
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      showToast('An error occurred', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter((post) => post.id !== id));
      showToast('Post deleted successfully!', 'success');
    } catch (err) {
      setError(err.message);
      showToast('Failed to delete post', 'error');
    }
  };

  const handleEdit = (post) => {
    setFormData({ id: post.id, title: post.title, body: post.body, userId: post.userId });
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', body: '', userId: 1 });
    setIsEditing(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    resetForm();
  };

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast({ message: '', type: '', visible: false });
    }, 3000);
  };

  if (loading) return (
    <Container darkMode={darkMode}>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-xl">Loading posts...</div>
      </div>
    </Container>
  );

  if (error) return (
    <Container darkMode={darkMode}>
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    </Container>
  );

  return (
    <Container darkMode={darkMode}>
      <Header>
        <Title>CRUD App</Title>
        <CreateButton onClick={toggleForm}>
          {showForm ? 'Close' : 'Create Post'}
        </CreateButton>
      </Header>
      <FormContainer visible={showForm} darkMode={darkMode}>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            darkMode={darkMode}
          />
          <TextArea
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Body"
            required
            darkMode={darkMode}
          />
          <Button type="submit" darkMode={darkMode}>
            {isEditing ? 'Update Post' : 'Create Post'}
          </Button>
          {isEditing && (
            <Button type="button" onClick={resetForm} darkMode={darkMode}>
              Cancel
            </Button>
          )}
          <Button type="button" onClick={() => setShowForm(false)} darkMode={darkMode}>
            Exit
          </Button>
        </Form>
      </FormContainer>
      <CardContainer>
        {posts.map((post) => (
          <Card key={post.id}>
            <Front darkMode={darkMode}>
              <h3>{post.title}</h3>
            </Front>
            <Back darkMode={darkMode}>
              <p>{post.body}</p>
              <ActionButtons>
                <EditButton onClick={() => handleEdit(post)} darkMode={darkMode}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(post.id)} darkMode={darkMode}>Delete</DeleteButton>
              </ActionButtons>
            </Back>
          </Card>
        ))}
      </CardContainer>
      <ThemeButton onClick={toggleDarkMode} darkMode={darkMode}>
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </ThemeButton>
      <Toast type={toast.type} visible={toast.visible}>
        {toast.message}
      </Toast>
    </Container>
  );
};

export default App;
