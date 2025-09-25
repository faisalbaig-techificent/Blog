import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Button, 
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { createPost } from '../../services/api';
import { useMessage } from '../../contexts/MessageContext';
import PostForm from '../../components/PostForm';
import { Loader } from '../../components/common';

export default function NewPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useMessage();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await createPost(formData);
      
      // Show backend success message
      if (response.message) {
        showSuccess(response.message);
      } else {
        showSuccess('Post created successfully!');
      }
      
      router.push('/');
    } catch (err) {
      const errorMessage = err.message || 'Failed to create post. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          href="/" 
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Posts
        </Button>
        
        <Typography variant="h1" component="h1" gutterBottom>
          Create New Post
        </Typography>
      </Box>

      {loading && <Loader type="linear" message="Creating post..." />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <PostForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Post"
      />
    </Box>
  );
}
