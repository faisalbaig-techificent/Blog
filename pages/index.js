import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  Alert
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getPosts, deletePost } from '../services/api';
import { useMessage } from '../contexts/MessageContext';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import DeleteModal from '../components/DeleteModal';
import Pagination from '../components/Pagination';
import { PostCardLoader, Loader } from '../components/common';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null, postTitle: '' });
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 6
  });
  const { showSuccess, showError, showInfo } = useMessage();

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPosts(page, 6);
      setPosts(response.data || []);
      
      // Update pagination state
      if (response.pagination) {
        setPagination(response.pagination);
      }
      
      // Show backend message if available
      if (response.message && response.success) {
        showInfo(response.message);
      } else if (response.data && response.data.length === 0) {
        showInfo('No posts found. Create your first post!');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch posts. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, title) => {
    setDeleteModal({ open: true, postId: id, postTitle: title });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeletingPostId(deleteModal.postId);
      const response = await deletePost(deleteModal.postId);
      
      // Refresh the current page to get updated data
      await fetchPosts(pagination.currentPage);
      
      // Show backend success message
      if (response.message) {
        showSuccess(response.message);
      } else {
        showSuccess('Post deleted successfully!');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete post. Please try again.';
      showError(errorMessage);
      console.error('Error deleting post:', err);
    } finally {
      setDeletingPostId(null);
      setDeleteModal({ open: false, postId: null, postTitle: '' });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, postId: null, postTitle: '' });
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  if (loading) {
    return (
      <Box>
        <Typography variant="h1" component="h1" gutterBottom>
          Blog Posts
        </Typography>
        
        <Loader type="linear" message="Loading posts..." />
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[...Array(6)].map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>
        Blog Posts
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {posts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="textSecondary">
              No posts found. Create your first post!
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
              component={Link} 
              href="/posts/new" 
              variant="contained" 
              fullWidth
            >
              Create New Post
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post._id}>
              <PostCard
                post={post}
                onDeleteClick={handleDeleteClick}
                deletingPostId={deletingPostId}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination Component */}
      {posts.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalPosts={pagination.totalPosts}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={deleteModal.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        postTitle={deleteModal.postTitle}
        loading={!!deletingPostId}
      />
    </Box>
  );
}
