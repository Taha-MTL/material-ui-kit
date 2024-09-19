'use client';

import React, { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { parse, ParseResult } from 'papaparse';
import { useDropzone } from 'react-dropzone';

import PDFViewer from './pdf-viewer';

type CSVRow = Record<string, string>;

type FilePreview = {
  file: File;
  preview: string | React.ReactNode;
};

export function FileUpload(): React.JSX.Element {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newPreviews = acceptedFiles.map((file): FilePreview | null => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const fileUrl = URL.createObjectURL(file);
          return { file, preview: fileUrl };
        } else if (file.type === 'application/pdf') {
          const fileUrl = URL.createObjectURL(file);
          return { file, preview: fileUrl };
        } else if (file.type === 'text/csv') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const csv = e.target?.result as string;
            const results: ParseResult<CSVRow> = parse(csv, { header: true, skipEmptyLines: true });

            const csvTable = (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {results.data[0] &&
                      Object.keys(results.data[0]).map((header, idx) => (
                        <th key={idx} style={{ border: '1px solid #ddd', padding: '8px' }}>
                          {header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {Object.values(row).map((cell, cellIdx) => (
                        <td key={cellIdx} style={{ border: '1px solid #ddd', padding: '8px' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
            setPreviews((prev) => [...prev, { file, preview: csvTable }]);
          };
          reader.readAsText(file);
          return null;
        }
        return null;
      });

      setPreviews((prev) => [...prev, ...newPreviews.filter((p): p is FilePreview => p !== null)]);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

  const handleRemoveFile = (file: File) => {
    setFiles(files.filter((f) => f !== file));
    setPreviews(previews.filter((p) => p && 'file' in p && p.file !== file));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      await axios.post('/your-upload-route', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Files uploaded successfully');
    } catch (error) {
      console.error('Error uploading files:', error);
    }

    setUploading(false);
    setFiles([]);
    setPreviews([]);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', textAlign: 'center' }}>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #cccccc',
          borderRadius: 2,
          padding: 4,
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main' },
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the files here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop files here, or click to select files</Typography>
        )}
      </Box>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Files Preview</Typography>
          {previews.map((item, index) => {
            if (!item || !('file' in item)) return null; // Safety check

            const file = item.file as File;
            const preview = item.preview;

            return (
              <Box key={index} sx={{ mt: 2, maxWidth: '100%', overflow: 'auto', position: 'relative' }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bgcolor: 'white',
                    color: 'red',
                    zIndex: 10, // Ensure the button is above other content
                    '&:hover': {
                      bgcolor: 'rgba(255, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => handleRemoveFile(file)}
                >
                  <CloseIcon />
                </IconButton>
                {file.type.startsWith('image/') && (
                  <img src={preview as string} alt={`Preview ${index}`} style={{ maxWidth: '100%' }} />
                )}
                {file.type === 'application/pdf' && <PDFViewer file={preview as string} />}
                {file.type === 'text/csv' && <Box sx={{ mt: 2 }}>{preview}</Box>}
                {file.type.startsWith('video/') && (
                  <video src={preview as string} controls style={{ maxWidth: '100%' }} />
                )}
              </Box>
            );
          })}
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={uploading} sx={{ mt: 2 }}>
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      )}
    </Box>
  );
}
