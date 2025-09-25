import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  FormControl,
  FormHelperText
} from '@mui/material';
import { Image, Delete } from '@mui/icons-material';
import API_CONFIG from '../config/api';

const ImageUpload = ({
  selectedFile,
  imagePreview,
  fileError,
  onFileSelect,
  onRemoveFile,
  isEditing = false
}) => {
  return (
    <>
      {/* Image Upload */}
      <FormControl fullWidth margin="normal">
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />
        <Button
          variant="outlined"
          component="label"
          startIcon={<Image />}
          sx={{ mb: 1 }}
        >
          {selectedFile 
            ? 'Change Image' 
            : isEditing 
              ? 'Upload New Image (Optional)' 
              : 'Upload Image (Optional)'
          }
          <input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            style={{ display: 'none' }}
          />
        </Button>
        {fileError && (
          <FormHelperText error>{fileError}</FormHelperText>
        )}
        <FormHelperText>
          Maximum file size: 15MB. Supported formats: JPG, PNG, GIF, WebP
        </FormHelperText>
      </FormControl>
      
      {/* Image Preview */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="subtitle2">
            {selectedFile 
              ? (isEditing ? 'New Image Preview:' : 'Image Preview:')
              : imagePreview && imagePreview !== `${API_CONFIG.ASSETS_PATH}blog.jpg`
                ? 'Current Image:'
                : 'Default Image Preview:'
            }
          </Typography>
          {selectedFile && (
            <IconButton
              size="small"
              color="error"
              onClick={onRemoveFile}
              title={isEditing ? "Remove new image" : "Remove image"}
            >
              <Delete />
            </IconButton>
          )}
        </Box>
        <Avatar
          src={imagePreview || `${API_CONFIG.ASSETS_PATH}blog.jpg`}
          variant="rounded"
          sx={{ 
            width: 200, 
            height: 150,
            border: '1px solid #ddd'
          }}
        />
        {selectedFile && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            {isEditing ? 'New file' : 'File'}: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </Typography>
        )}
        {!selectedFile && !imagePreview && (
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            Default blog image will be used if no image is uploaded
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ImageUpload;

