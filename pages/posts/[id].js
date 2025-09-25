import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Typography, 
  Alert
} from '@mui/material';
import { getPost, deletePost } from '../../services/api';
import { useMessage } from '../../contexts/MessageContext';
import PostDetail from '../../components/PostDetail';
import DeleteModal from '../../components/DeleteModal';
import { PageLoader } from '../../components/common';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showSuccess, showError, showInfo } = useMessage();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPost(id);
      setPost(response.data);
      
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
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const response = await deletePost(id);
      
      // Show backend success message
      if (response.message) {
        showSuccess(response.message);
      } else {
        showSuccess('Post deleted successfully!');
      }
      
      router.push('/');
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete post. Please try again.';
      showError(errorMessage);
      console.error('Error deleting post:', err);
    } finally {
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };


  if (loading) {
    return <PageLoader message="Loading post..." />;
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          component={Link} 
          href="/" 
          startIcon={<ArrowBack />}
        >
          Back to Posts
        </Button>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Post not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PostDetail
        post={post}
        onDeleteClick={handleDeleteClick}
        deleting={deleting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
