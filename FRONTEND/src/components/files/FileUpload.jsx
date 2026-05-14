import React, { useRef } from 'react';
import { Paperclip, X, File, Image as ImageIcon, Film } from 'lucide-react';

const FileAttachment = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return (
    <div className="relative group w-20 h-20 rounded-lg border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-surface overflow-hidden">
      {isImage ? (
        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-2">
          {isVideo ? <Film className="h-6 w-6 text-primary" /> : <File className="h-6 w-6 text-primary" />}
          <span className="text-[10px] truncate w-full text-center mt-1 text-light-muted dark:text-dark-muted">
            {file.name}
          </span>
        </div>
      )}
      <button
        onClick={() => onRemove(file)}
        className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};

const FileUpload = ({ onFilesSelected, selectedFiles, onRemoveFile }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelected(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-light-bg dark:bg-dark-bg rounded-t-lg border-x border-t border-light-border dark:border-dark-border">
          {selectedFiles.map((file, idx) => (
            <FileAttachment key={idx} file={file} onRemove={onRemoveFile} />
          ))}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-2 text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
        title="Attach files"
      >
        <Paperclip className="h-5 w-5" />
      </button>
    </div>
  );
};

export default FileUpload;
