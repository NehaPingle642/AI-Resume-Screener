
import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { DocumentIcon } from './icons/DocumentIcon';


interface ResumeUploaderProps {
  onFileChange: (file: File) => void;
  fileName: string | null;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onFileChange, fileName }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFileChange(event.target.files[0]);
    }
  };
  
  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">Upload Resume</label>
      <div
        onClick={handleButtonClick}
        className="flex justify-center items-center w-full h-32 px-6 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.png,.jpg,.jpeg"
        />
        {fileName ? (
          <div className="text-center text-slate-700">
            <DocumentIcon className="w-8 h-8 mx-auto mb-2 text-sky-600"/>
            <p className="font-semibold">{fileName}</p>
            <p className="text-xs text-slate-500">Click to change file</p>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <UploadIcon className="w-8 h-8 mx-auto mb-2"/>
            <p className="font-semibold">Click to upload a file</p>
            <p className="text-xs">PDF, PNG, JPG, or JPEG</p>
          </div>
        )}
      </div>
    </div>
  );
};
