import React, { useState, useRef } from 'react';
import { UploadCloud, FileArchive, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ButtonSpinner } from './Spinner.jsx';

export function ZipUpload({ onFileSelect, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return false;

    // Check if it's a zip file
    const isZip = selectedFile.type === 'application/zip' || 
                  selectedFile.type === 'application/x-zip-compressed' || 
                  selectedFile.name.endsWith('.zip');
                  
    if (!isZip) {
      setError('Please upload a .zip file.');
      return false;
    }

    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    }
  };

  const removeFile = () => {
    if (disabled) return;
    setFile(null);
    setError('');
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-slate-300' :
            dragActive ? 'border-nit-accent bg-blue-50/50' : 'border-gray-300 hover:border-nit-primary hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".zip,application/zip"
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-100 text-nit-accent' : 'bg-gray-100 text-gray-400'}`}>
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {dragActive ? 'Drop your ZIP file here' : 'Drag & drop or browse'}
              </p>
              <p className="text-xs text-gray-500 mt-1">.ZIP files only</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-slate-300 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileArchive className="w-5 h-5 text-nit-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={removeFile}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-600 animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
