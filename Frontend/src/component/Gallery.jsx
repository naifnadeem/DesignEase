import React, { useEffect, useState } from "react";
import axios from "axios";
import { ImageOutlined, VideoLibrary, Description, DeleteOutline } from '@mui/icons-material';
import { Button, Card, CardContent, CardMedia, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, CircularProgress } from '@mui/material';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [htmlFiles, setHtmlFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const [imagesRes, videosRes, htmlRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/images`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/videos`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/gallery/html`)
      ]);
      setImages(imagesRes.data);
      setVideos(videosRes.data);
      setHtmlFiles(htmlRes.data);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (type, filename) => {
    setFileToDelete({ type, filename });
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
  
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/gallery/${fileToDelete.type}/${fileToDelete.filename}`);
      if (fileToDelete.type === 'images') {
        setImages(images.filter(image => image !== fileToDelete.filename));
      } else if (fileToDelete.type === 'videos') {
        setVideos(videos.filter(video => video !== fileToDelete.filename));
      } else if (fileToDelete.type === 'html') {
        setHtmlFiles(htmlFiles.filter(html => html.file !== fileToDelete.filename));
      }
    } catch (error) {
      console.error(`Error deleting ${fileToDelete.type}:`, error);
    } finally {
      setOpenDialog(false);
      setFileToDelete(null);
    }
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  const MediaCard = ({ type, src, alt, filename }) => (
    <Card>
      <CardMedia
        component={type === 'video' ? 'video' : 'img'}
        height="140"
        image={src}
        alt={alt}
        controls={type === 'video'}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" noWrap>
          {filename}
        </Typography>
        <Button
          startIcon={<DeleteOutline />}
          color="error"
          onClick={() => handleDeleteClick(type + 's', filename)}
        >
          Delete
        </Button>
        {type === 'image' && <ImageOutlined />}
        {type === 'video' && <VideoLibrary />}
        {type === 'html' && <Description />}
      </CardContent>
    </Card>
  );

  return (
    <div>
      {/* <Typography variant="h4" gutterBottom>
        Media Gallery
      </Typography> */}
       {/* HTML Files Section */}
       <Typography className="text-white" variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
        HTML Templates
      </Typography>
      <Grid container spacing={2}>
        {htmlFiles.map((htmlFile, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MediaCard
              type="html"
              src={`${import.meta.env.VITE_API_URL}/uploads/html/${htmlFile.file}.png`}
              alt={`Thumbnail for ${htmlFile.file}`}
              filename={htmlFile.file}
            />
          </Grid>
        ))}
      </Grid>
      
      {/* Images Section */}
      <Typography className="text-white" variant="h5" gutterBottom>
        Images
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MediaCard
              type="image"
              src={`${import.meta.env.VITE_API_URL}/uploads/images/${image}`}
              alt={`Uploaded image ${index}`}
              filename={image}
            />
          </Grid>
        ))}
      </Grid>

      {/* Videos Section */}
      {/* <Typography variant="h5" gutterBottom style={{ marginTop: '2rem' }}>
        Videos
      </Typography> */}
      <Grid container spacing={2}>
        {videos.map((video, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <MediaCard
              type="video"
              src={`${import.meta.env.VITE_API_URL}/uploads/videos/${video}`}
              filename={video}
            />
          </Grid>
        ))}
      </Grid>

     

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Gallery;