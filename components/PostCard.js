import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import Link from 'next/link';
import API_CONFIG from '../config/api';
import { ButtonLoader } from './common';

const PostCard = ({ post, onDeleteClick, deletingPostId }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get the correct image source based on image format
  const getImageSrc = (image, postId) => {
    if (!image) {
      return `${API_CONFIG.ASSETS_PATH}blog.jpg`;
    }
    
    // Check if image is a string (old format - file path)
    if (typeof image === 'string') {
      // For old image paths, show default image since old files are no longer available
      if (image.startsWith('/uploads/')) {
        return `${API_CONFIG.ASSETS_PATH}blog.jpg`;
      }
      return `${API_CONFIG.BASE_URL}${image}`;
    }
    
    // Check if image is an object (new format - binary data)
    if (typeof image === 'object' && image.data) {
      return `${API_CONFIG.API_URL}/posts/${postId}/image`;
    }
    
    // Fallback to default image
    return `${API_CONFIG.ASSETS_PATH}blog.jpg`;
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Post Image */}
      <Box
        component="img"
        src={getImageSrc(post.image, post._id)}
        alt={post.title}
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          display: 'block'
        }}
        onError={(e) => {
          // If the uploaded image fails to load, fallback to default image
          e.target.src = `${API_CONFIG.ASSETS_PATH}blog.jpg`;
        }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {post.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.content}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip 
            label={`By ${post.author}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        </Box>
        
        <Typography variant="caption" color="textSecondary">
          Created: {formatDate(post.createdAt)}
        </Typography>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<Visibility />}
          component={Link}
          href={`/posts/${post._id}`}
        >
          View
        </Button>
        <Button 
          size="small" 
          startIcon={<Edit />}
          component={Link}
          href={`/posts/${post._id}/edit`}
        >
          Edit
        </Button>
        <Button 
          size="small" 
          startIcon={deletingPostId === post._id ? <ButtonLoader size={16} /> : <Delete />}
          color="error"
          onClick={() => onDeleteClick(post._id, post.title)}
          disabled={deletingPostId === post._id}
        >
          {deletingPostId === post._id ? 'Deleting...' : 'Delete'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PostCard;
