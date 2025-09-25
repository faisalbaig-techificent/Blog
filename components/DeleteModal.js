import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ButtonLoader } from './common';

const DeleteModal = ({ 
  open, 
  onClose, 
  onConfirm, 
  postTitle, 
  loading 
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Delete Post
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {postTitle 
            ? `Are you sure you want to delete the post "${postTitle}"? This action cannot be undone.`
            : 'Are you sure you want to delete this post? This action cannot be undone.'
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <ButtonLoader size={20} /> : <Delete />}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
