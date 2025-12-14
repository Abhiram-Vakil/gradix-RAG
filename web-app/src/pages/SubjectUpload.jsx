import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import axios from 'axios';

const SubjectUpload = () => {
  const [textContent, setTextContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage('Uploading files...');
    
    const formData = new FormData();
    
    if (textContent.trim()) {
      formData.append('text_content', textContent);
    }

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8000/ingest/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          if (percentCompleted === 100) {
              setStatusMessage('Ingesting content to Vector DB...');
          }
        },
      });

      console.log('Upload success:', response.data);
      alert(`Success! processed ${response.data.total_chunks} chunks.`);
      
      // Clear form
      setTextContent('');
      setFiles([]);
      setUploadProgress(0);
      setStatusMessage('');
      
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Upload failed. Please check the console for details.');
      setStatusMessage('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content">Subject Upload</h1>
        <p className="text-base-content/70 mt-2">Upload reference materials (textbooks, notes) or paste content to train the grader.</p>
      </div>

      <div className="card w-full max-w-2xl bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          
          {/* Direct Text Input */}
          <div className="form-control w-full max-w-md flex flex-col gap-2 items-center justify-center">
             <label className="label justify-center">
              <span className="label-text font-bold">Paste Text Content</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              placeholder="Paste text content here..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
            ></textarea> 
          </div>

          <div className="divider w-full">OR</div>

          {/* File Upload Area */}
          <div className="form-control w-full max-w-md flex flex-col gap-2 items-center justify-center">
            <label className="label justify-center">
              <span className="label-text font-bold">Upload Documents (PDF, TXT)</span>
            </label>
            <input 
              type="file" 
              className="file-input file-input-bordered file-input-primary w-full" 
              multiple
              accept=".txt,.pdf,.docx"
              onChange={handleFileChange}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <h3 className="text-sm font-bold opacity-70 mb-3">Selected Files ({files.length})</h3>
              <div className="grid gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-lg text-left">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText size={18} className="text-primary flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs opacity-50 flex-shrink-0">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button 
                      onClick={() => removeFile(index)} 
                      className="btn btn-ghost btn-xs btn-circle text-error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-center mt-8 w-full flex-col gap-4">
            <button 
              className="btn btn-primary px-12"
              onClick={handleUpload}
              disabled={(!textContent && files.length === 0) || isUploading}
            >
              {isUploading ? <Upload size={18} className="animate-bounce"/> : <Upload size={18} />}
              {isUploading ? 'Processing...' : 'Upload & Ingest'}
            </button>

            {isUploading && (
                <div className="w-full max-w-xs flex flex-col gap-1">
                    <progress className="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
                    <span className="text-xs opacity-70">{statusMessage} {uploadProgress}%</span>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectUpload;
