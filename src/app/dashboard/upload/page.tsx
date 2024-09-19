import React from 'react';
import { Container, Typography } from '@mui/material';

import { FileUpload } from '@/components/dashboard/upload/FileUpload';

const UploadPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        File Upload
      </Typography>
      <FileUpload />
    </Container>
  );
};

export default UploadPage;
