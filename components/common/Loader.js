import React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  Skeleton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';

// Different loader types
export const LoaderTypes = {
  CIRCULAR: 'circular',
  LINEAR: 'linear',
  SKELETON: 'skeleton',
  SPINNER: 'spinner',
  FULL_PAGE: 'full_page'
};

// Main Loader Component
const Loader = ({ 
  type = LoaderTypes.CIRCULAR, 
  size = 40, 
  message = 'Loading...',
  fullHeight = false,
  color = 'primary',
  thickness = 3.6
}) => {
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    ...(fullHeight && { minHeight: '50vh' })
  };

  const renderLoader = () => {
    switch (type) {
      case LoaderTypes.LINEAR:
        return <LinearProgress sx={{ width: '100%' }} />;
      
      case LoaderTypes.SKELETON:
        return <Skeleton variant="circular" width={size} height={size} />;
      
      case LoaderTypes.SPINNER:
        return (
          <CircularProgress 
            size={size} 
            color={color}
            thickness={thickness}
          />
        );
      
      case LoaderTypes.FULL_PAGE:
        return (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              gap: 2
            }}
          >
            <CircularProgress size={60} color={color} thickness={thickness} />
            {message && (
              <Typography variant="h6" color="textSecondary">
                {message}
              </Typography>
            )}
          </Box>
        );
      
      case LoaderTypes.CIRCULAR:
      default:
        return (
          <CircularProgress 
            size={size} 
            color={color}
            thickness={thickness}
          />
        );
    }
  };

  if (type === LoaderTypes.FULL_PAGE) {
    return renderLoader();
  }

  return (
    <Box sx={containerStyles}>
      {renderLoader()}
      {message && type !== LoaderTypes.LINEAR && (
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

// Specialized Loader Components
export const PageLoader = ({ message = 'Loading page...' }) => (
  <Loader 
    type={LoaderTypes.FULL_PAGE} 
    message={message}
    size={60}
  />
);

export const ButtonLoader = ({ size = 20, color = 'inherit' }) => (
  <CircularProgress 
    size={size} 
    color={color}
    thickness={4}
  />
);

export const CardLoader = ({ count = 3 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} sx={{ maxWidth: 600 }}>
        <CardContent>
          <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" height={24} width="60%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" height={32} width={80} />
          <Skeleton variant="rectangular" height={32} width={80} />
        </CardActions>
      </Card>
    ))}
  </Box>
);

export const PostCardLoader = ({ count = 6 }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index}>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={32} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={20} width="60%" />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" height={32} width={60} sx={{ mr: 1 }} />
          <Skeleton variant="rectangular" height={32} width={60} sx={{ mr: 1 }} />
          <Skeleton variant="rectangular" height={32} width={70} />
        </CardActions>
      </Card>
    ))}
  </Box>
);

export const FormLoader = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={56} />
    </CardContent>
  </Card>
);

export const TableLoader = ({ rows = 5, columns = 4 }) => (
  <Box>
    <Skeleton variant="rectangular" height={56} sx={{ mb: 1 }} />
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <Box key={rowIndex} sx={{ display: 'flex', gap: 1, mb: 1 }}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={colIndex} 
            variant="rectangular" 
            height={48} 
            sx={{ flex: 1 }}
          />
        ))}
      </Box>
    ))}
  </Box>
);

export default Loader;
