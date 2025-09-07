// src/components/PDFViewer.tsx
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  return (
    <div style={{ height: '600px' }}>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
        <Viewer fileUrl={fileUrl} />
      </Worker>
    </div>
  );
};

export default PDFViewer;
