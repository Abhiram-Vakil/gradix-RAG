import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2, Info } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Knowledge Ingestion
        </h1>
        <p className="text-lg text-base-content/60">
            Upload course materials (PDF) or paste syllabus text to train the grading AI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Col: File Upload */}
        <div className="card bg-base-200/50 backdrop-blur border border-base-content/5 shadow-xl">
            <div className="card-body">
                <h2 className="card-title flex items-center gap-2 text-xl mb-4">
                    <FileText className="text-primary"/> Upload Document
                </h2>
                
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Select PDF Files</span>
                    </label>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        multiple 
                        className="file-input file-input-bordered file-input-primary w-full h-12" 
                        onChange={handleFileChange}
                    />
                    <label className="label">
                        <span className="label-text-alt text-base-content/50">Supported: .pdf (Max 10MB)</span>
                    </label>
                </div>

                <div className="divider text-sm font-medium opacity-50">OR</div>

                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Paste Text Content</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered h-40 text-base leading-relaxed focus:border-primary transition-colors" 
                        placeholder="Paste raw text from syllabus or notes here..."
                        value={textContent}
                        onChange={(e) => setTextContent(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>

        {/* Right Col: Status & Actions */}
        <div className="space-y-6">
            <div className="card bg-base-100 border border-base-content/10 shadow-lg">
                <div className="card-body items-center text-center py-12">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${isUploading ? 'bg-primary/10 text-primary scale-110' : 'bg-base-200 text-base-content/30'}`}>
                        {isUploading ? <Loader2 size={40} className="animate-spin" /> : <Upload size={40} />}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1">
                        {isUploading ? 'Processing Content...' : 'Ready to Ingest'}
                    </h3>
                    <p className="text-sm text-base-content/60 max-w-xs">
                        {isUploading 
                            ? 'Extracting text, cleaning, chunking, and vectorizing...' 
                            : 'Select files or paste text on the left to begin.'}
                    </p>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="w-full max-w-xs mt-6 space-y-2">
                            <progress className="progress progress-primary w-full h-3" value={uploadProgress} max="100"></progress>
                            <div className="flex justify-between text-xs font-semibold opacity-70">
                                <span>{statusMessage}</span>
                                <span>{uploadProgress}%</span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button 
                        className={`btn btn-primary btn-lg w-full max-w-xs mt-8 shadow-lg shadow-primary/20 ${isUploading ? 'loading' : ''}`}
                        onClick={handleUpload}
                        disabled={(!textContent && files.length === 0) || isUploading}
                    >
                        {!isUploading && <Upload className="mr-2" size={20} />}
                        {isUploading ? 'Ingesting...' : 'Start Ingestion'}
                    </button>
                </div>
            </div>

            {/* Hint Card */}
            <div className="alert bg-base-200/50 shadow-sm border border-base-content/5 text-sm">
                <Info size={20} className="text-info" />
                <span>Uploaded content will immediately be available for the Auto-Grader and ChatBot.</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectUpload;
