import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const CreateCheatSheet = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [content, setContent] = useState(initialData ? initialData.content : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content });
  };

  return (
    <div className="create-cheat-sheet">
      <h2>{initialData ? 'Edit Cheat Sheet' : 'Create New Cheat Sheet'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />
        </div>
        
        <div className="editor-container">
          <div className="input-section">
            <label htmlFor="content">Content (Markdown + LaTeX supported):</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your content here. Use **bold**, # Header, and $E=mc^2$ for math."
              className="textarea-field"
            />
          </div>
          
          <div className="preview-section">
            <label>Preview:</label>
            <div className="preview-box">
              <h3>{title || 'Untitled'}</h3>
              <div className="latex-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="btn primary">Save</button>
          <button type="button" onClick={onCancel} className="btn secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCheatSheet;
