import React, { useRef } from 'react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CheatSheetView = ({ sheet, onBack, onEdit }) => {
  const contentRef = useRef(null);

  const downloadPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${sheet.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  if (!sheet) return null;

  return (
    <div className="cheat-sheet-view">
      <div className="view-header">
        <button onClick={onBack} className="btn secondary">Back</button>
        <div>
          <button onClick={downloadPDF} className="btn secondary" style={{marginRight: '0.5rem'}}>Download PDF</button>
          <button onClick={onEdit} className="btn primary">Edit</button>
        </div>
      </div>
      
      <div className="sheet-content" ref={contentRef} style={{padding: '20px', background: 'white'}}>
        <h1>{sheet.title}</h1>
        <div className="latex-rendered">
          <ReactMarkdown 
            remarkPlugins={[remarkMath]} 
            rehypePlugins={[rehypeKatex]}
          >
            {sheet.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default CheatSheetView;
