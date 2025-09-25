import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Skeleton
} from '@mui/material';

const PostSkeleton = () => (
  <Grid item xs={12} md={6} lg={4}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} width="60%" />
      </CardContent>
      <CardActions>
        <Skeleton variant="rectangular" height={32} width={60} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" height={32} width={60} sx={{ mr: 1 }} />
        <Skeleton variant="rectangular" height={32} width={70} />
      </CardActions>
    </Card>
  </Grid>
);

export default PostSkeleton;
