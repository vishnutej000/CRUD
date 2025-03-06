import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file



function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: '', title: '', body: '', userId: 1 });
  const [isEditing, setIsEditing] = useState(false);

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
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter((post) => post.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (post) => {
    setFormData({ id: post.id, title: post.title, body: post.body, userId: post.userId });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', body: '', userId: 1 });
    setIsEditing(false);
  };

  if (loading) return <div className="text-center p-4">Loading posts...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mb-6">
        <h1 className="text-2xl font-bold mb-4 text-center">CRUD App</h1>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-center">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded" />
            <textarea name="body" value={formData.body} onChange={handleChange} placeholder="Body" required className="w-full p-2 border rounded h-24" />
            <div className="flex justify-center space-x-2">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
              {isEditing && (
                <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {posts.length === 0 ? <p className="text-center">No posts available.</p> : posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg shadow-md bg-white">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <p className="mt-2 text-gray-700">{post.body}</p>
            <div className="mt-4 flex justify-between">
              <button onClick={() => handleEdit(post)} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
