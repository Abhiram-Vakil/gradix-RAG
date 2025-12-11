import React, { useState } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const SubjectUpload = () => {
  const [subjectName, setSubjectName] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    console.log('Uploading:', { subjectName, files });
    // TODO: Implement backend integration
    alert('Upload functionality will be implemented in the backend phase.');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content">Subject Upload</h1>
        <p className="text-base-content/70 mt-2">Upload reference materials (textbooks, notes) to train the grader.</p>
      </div>

      <div className="card w-full max-w-2xl bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          {/* Subject Name Input */}
          <div className="form-control w-full max-w-md flex flex-col gap-2 items-center justify-center">
            <label className="label justify-center">
              <span className="label-text font-bold">Subject Name</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g., Computer Networks - Unit 1" 
              className="input input-bordered w-full text-center"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>

          <div className="divider w-full">Reference Materials</div>

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
          <div className="card-actions justify-center mt-8 w-full">
            <button 
              className="btn btn-primary px-12"
              onClick={handleUpload}
              disabled={!subjectName || files.length === 0}
            >
              <Upload size={18} />
              Upload & Ingest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectUpload;
