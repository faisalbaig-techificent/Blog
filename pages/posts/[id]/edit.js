import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Button, 
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getPost, updatePost } from '../../../services/api';
import { useMessage } from '../../../contexts/MessageContext';
import PostForm from '../../../components/PostForm';
import { Loader, PageLoader } from '../../../components/common';

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const { showSuccess, showError, showInfo } = useMessage();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoadingPost(true);
      setError(null);
      const response = await getPost(id);
      const post = response.data;
      
      // Set post data for form
      setPostData({
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author
      });
      
      // Set existing image if available
      if (post.image) {
        setExistingImage(post.image);
      }
      
      // Show backend message if available
      if (response.message && response.success) {
        showInfo(response.message);
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch post. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error fetching post:', err);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await updatePost(id, formData);
      
      // Show backend success message
      if (response.message) {
        showSuccess(response.message);
      } else {
        showSuccess('Post updated successfully!');
      }
      
      router.push(`/posts/${id}`);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update post. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return <PageLoader message="Loading post data..." />;
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          href={`/posts/${id}`} 
          startIcon={<ArrowBack />}
          sx={{ mb: 2 }}
        >
          Back to Post
        </Button>
        
        <Typography variant="h1" component="h1" gutterBottom>
          Edit Post
        </Typography>
      </Box>

      {loading && <Loader type="linear" message="Updating post..." />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <PostForm
        onSubmit={handleSubmit}
        loading={loading}
        initialData={postData}
        existingImage={existingImage}
        submitText="Update Post"
      />
    </Box>
  );
}
