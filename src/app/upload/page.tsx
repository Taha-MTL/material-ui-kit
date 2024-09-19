'use client';

import { ChangeEvent, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Handle HTTP errors
        setMessage(`Upload failed: ${response.statusText}`);
        setLoading(false);
        return;
      }

      // Ensure response has a valid JSON body
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('An error occurred during the upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          File Upload
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Select File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleUpload} fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Upload'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              {message}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
