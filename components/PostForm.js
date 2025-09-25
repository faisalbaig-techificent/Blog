import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImageUpload from './ImageUpload';
import API_CONFIG from '../config/api';
import { ButtonLoader } from './common';

const schema = yup.object({
  title: yup.string().required('Title is required').max(200, 'Title cannot exceed 200 characters'),
  content: yup.string().required('Content is required').max(5000, 'Content cannot exceed 5000 characters'),
  author: yup.string().required('Author is required').max(100, 'Author name cannot exceed 100 characters')
});

const PostForm = ({ 
  onSubmit, 
  loading, 
  initialData = null,
  submitText = 'Create Post',
  submitIcon = <Save />,
  existingImage = null
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileError, setFileError] = useState(null);

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

  // Set existing image preview when editing
  useEffect(() => {
    if (existingImage && !selectedFile && initialData?._id) {
      setImagePreview(getImageSrc(existingImage, initialData._id));
    } else if (!existingImage && !selectedFile) {
      // Show default image preview when no existing image and no file selected
      setImagePreview(`${API_CONFIG.ASSETS_PATH}blog.jpg`);
    }
  }, [existingImage, selectedFile, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {}
  });

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setFileError(null);

    if (file) {
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        setFileError('File size must be less than 15MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setFileError('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.value = '';
    }
    // Set preview back to existing image or default image
    if (existingImage && initialData?._id) {
      setImagePreview(getImageSrc(existingImage, initialData._id));
    } else {
      setImagePreview(`${API_CONFIG.ASSETS_PATH}blog.jpg`);
    }
  };

  const handleFormSubmit = async (data) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('author', data.author);
    
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    await onSubmit(formData);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            fullWidth
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
            variant="outlined"
          />
          
          <TextField
            fullWidth
            label="Author"
            {...register('author')}
            error={!!errors.author}
            helperText={errors.author?.message}
            margin="normal"
            variant="outlined"
          />
          
          <ImageUpload
            selectedFile={selectedFile}
            imagePreview={imagePreview}
            fileError={fileError}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeFile}
            isEditing={!!initialData}
          />
          
          <TextField
            fullWidth
            label="Content"
            {...register('content')}
            error={!!errors.content}
            helperText={errors.content?.message}
            margin="normal"
            variant="outlined"
            multiline
            rows={8}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <ButtonLoader size={20} /> : submitIcon}
              disabled={loading}
              size="large"
            >
              {loading ? 'Processing...' : submitText}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostForm;
