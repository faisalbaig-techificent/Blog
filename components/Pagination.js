import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root': {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    minWidth: '44px',
    height: '44px',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderRadius: '12px',
    margin: '0 4px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
      fontWeight: 600,
      boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'translateY(-2px)',
        boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
      },
    },
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.action.disabledBackground,
    },
  },
  '& .MuiPaginationItem-previousNext': {
    fontWeight: 'bold',
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
    },
  },
  '& .MuiPaginationItem-firstLast': {
    borderRadius: '12px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
    },
  },
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(3, 2),

  borderRadius: '16px',

  margin: theme.spacing(4, 0),
}));

const PaginationInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
  textAlign: 'center',
}));

const PostsCountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: '0.75rem',
  height: '28px',
  borderRadius: '14px',
}));

export default function PaginationComponent({
  currentPage,
  totalPages,
  totalPosts,
  onPageChange,
  loading = false
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * 6 + 1;
  const endItem = Math.min(currentPage * 6, totalPosts);

  return (
    <PaginationContainer>
      {/* Posts Count Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PostsCountChip 
          label={`${totalPosts} Total Posts`} 
          size="small"
        />
        <Typography variant="body2" color="text.secondary">
          Showing {startItem}-{endItem}
        </Typography>
      </Box>

      {/* Pagination Controls */}
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledPagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => onPageChange(page)}
          disabled={loading}
          size={isMobile ? "small" : "medium"}
          showFirstButton
          showLastButton
          color="primary"
          shape="rounded"
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={isMobile ? 1 : 2}
        />
      </Stack>

      {/* Page Info */}
      <PaginationInfo>
        Page {currentPage} of {totalPages}
      </PaginationInfo>
    </PaginationContainer>
  );
}
