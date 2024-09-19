'use client';

import React from 'react';

interface PDFViewerProps {
  file: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  return (
    <iframe src={`${file}#toolbar=0`} width="100%" height="500px" style={{ border: 'none' }} title="PDF Preview" />
  );
};

export default PDFViewer;
