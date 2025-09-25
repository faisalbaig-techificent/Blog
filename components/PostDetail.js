import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Container,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit, Delete, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import API_CONFIG from '../config/api';
import { ButtonLoader } from './common';

const PostDetail = ({ 
  post, 
  onDeleteClick, 
  deleting = false 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Button 
          component={Link} 
          href="/" 
          startIcon={<ArrowBack />}
          sx={{ 
            mb: { xs: 1.5, md: 2 },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }}
        >
          Back to Posts
        </Button>
        
        <Typography 
          variant={isMobile ? "h2" : "h1"} 
          component="h1" 
          gutterBottom
          sx={{
            fontSize: { 
              xs: '1.75rem', 
              sm: '2rem', 
              md: '2.5rem' 
            },
            lineHeight: { xs: 1.3, md: 1.2 },
            wordBreak: 'break-word'
          }}
        >
          {post.title}
        </Typography>
        
        <Stack 
          direction={isSmallMobile ? "column" : "row"} 
          spacing={1.5}
          sx={{ 
            mb: 2,
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <Chip 
            label={`By ${post.author}`} 
            color="primary" 
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          />
          <Chip 
            label={`Created: ${formatDate(post.createdAt)}`} 
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          />
          {post.updatedAt !== post.createdAt && (
            <Chip 
              label={`Updated: ${formatDate(post.updatedAt)}`} 
              variant="outlined"
              size={isMobile ? "small" : "medium"}
            />
          )}
        </Stack>
      </Box>

      {/* Post Image */}
      <Box sx={{ 
        mb: { xs: 2, md: 3 },
        mx: { xs: -2, sm: 0 }, // Full width on mobile with negative margin
        borderRadius: { xs: 0, sm: 2 },
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box
          component="img"
          src={getImageSrc(post.image, post._id)}
          alt={post.title}
          sx={{
            width: '100%',
            height: { xs: 'auto', sm: 'auto', md: 'auto' },
            maxHeight: { xs: '250px', sm: '400px', md: '500px', lg: '600px' },
            minHeight: { xs: '200px', sm: '300px', md: '400px' },
            objectFit: 'contain', // Changed from 'cover' to 'contain' to show full image
            objectPosition: 'center',
            borderRadius: { xs: 0, sm: 2 },
            boxShadow: { xs: 'none', sm: '0 4px 8px rgba(0,0,0,0.1)' },
            display: 'block',
            backgroundColor: '#f5f5f5' // Background color for better image visibility
          }}
          onError={(e) => {
            // If the uploaded image fails to load, fallback to default image
            if (post.image) {
              e.target.src = `${API_CONFIG.ASSETS_PATH}blog.jpg`;
            }
          }}
        />
      </Box>

      <Card sx={{ 
        boxShadow: { xs: 'none', sm: 1 },
        borderRadius: { xs: 0, sm: 2 }
      }}>
        <CardContent sx={{ 
          px: { xs: 0, sm: 3 },
          py: { xs: 2, sm: 3 }
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: { xs: 1.6, md: 1.8 },
              fontSize: { xs: '1rem', md: '1.1rem' },
              wordBreak: 'break-word'
            }}
          >
            {post.content}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: { xs: 2, md: 3 } }} />

      <Stack 
        direction={isSmallMobile ? "column" : "row"} 
        spacing={2}
        sx={{ 
          gap: 2,
          '& .MuiButton-root': {
            minWidth: { xs: '100%', sm: 'auto' },
            fontSize: { xs: '0.875rem', md: '1rem' }
          }
        }}
      >
        <Button 
          variant="contained" 
          startIcon={<Edit />}
          component={Link}
          href={`/posts/${post._id}/edit`}
          fullWidth={isSmallMobile}
        >
          Edit Post
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          startIcon={deleting ? <ButtonLoader size={20} /> : <Delete />}
          onClick={onDeleteClick}
          disabled={deleting}
          fullWidth={isSmallMobile}
        >
          {deleting ? 'Deleting...' : 'Delete Post'}
        </Button>
      </Stack>
    </Container>
  );
};

export default PostDetail;
