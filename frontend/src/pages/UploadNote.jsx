import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import notesService from '../services/notesService';
import { APP_ROUTES, SUBJECT_CATEGORIES, SEMESTERS } from '../utils/constants';
import { getApiErrorMessage } from '../utils/errorHelper';

// Contract validation limit: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const UploadNote = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Schema fields: title, description, subject, semester, file
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateFile = (file) => {
    if (!file) {
      setFileError('Please select a PDF document to upload.');
      return false;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setFileError('Only PDF files (.pdf) are permitted in the academic repository.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the agreed 10 MB limit.`
      );
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Course note title is required.';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }

    if (!formData.description.trim()) {
      errors.description = 'A summary or syllabus description is required.';
    }

    if (!formData.subject) {
      errors.subject = 'Please select an academic faculty subject.';
    }

    if (!formData.semester) {
      errors.semester = 'Please select a course semester.';
    }

    if (!selectedFile) {
      setFileError('A lecture notes PDF document is required.');
      errors.file = true;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && !fileError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Build multipart/form-data payload with exact field name "file"
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      payload.append('subject', formData.subject);
      payload.append('semester', formData.semester);
      // Exact agreed multipart field name
      payload.append('file', selectedFile);

      const response = await notesService.createNote(payload, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      toast.success(response?.message || 'Lecture note successfully published to the archive!');
      // Reset form state after successful upload
      setFormData({
        title: '',
        description: '',
        subject: '',
        semester: '',
      });
      setSelectedFile(null);
      setFileError(null);
      setFormErrors({});
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      navigate(APP_ROUTES.MY_UPLOADS);
    } catch (err) {
      const errorMsg = getApiErrorMessage(
        err,
        'Failed to upload lecture note. Please check file format and connection.'
      );
      toast.error(errorMsg);
      setFormErrors((prev) => ({ ...prev, submit: errorMsg }));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-ivory-300 pb-5">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="mb-1"
        >
          Back
        </Button>
        <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
          Academic Contribution
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900">
          Upload Lecture Note
        </h1>
        <p className="text-sm text-navy-800/70">
          Publish comprehensive lecture digests, syllabi summaries, or formula guides in PDF format to the campus repository.
        </p>
      </div>

      {/* Main Upload Form */}
      <div className="clay-card rounded-academic-xl p-6 sm:p-8 border border-ivory-300 space-y-6">
        {formErrors.submit && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-academic text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formErrors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Note Title */}
          <Input
            label="Note Title / Lecture Topic"
            name="title"
            required
            placeholder="e.g. Graph Algorithms & Shortest Path Digest (Lecture 12)"
            value={formData.title}
            onChange={handleInputChange}
            error={formErrors.title}
          />

          {/* Subject & Semester Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Select */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="subject"
                className="text-xs font-semibold uppercase tracking-wider text-navy-800"
              >
                Subject Faculty <span className="text-red-600">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`
                  w-full bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border py-2.5 px-3.5
                  ${formErrors.subject ? 'border-red-500' : 'border-ivory-300'}
                  focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 shadow-academic-sm
                `}
              >
                <option value="">Select Department Subject</option>
                {SUBJECT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {formErrors.subject && (
                <p className="text-xs text-red-600 mt-0.5">{formErrors.subject}</p>
              )}
            </div>

            {/* Semester Select */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="semester"
                className="text-xs font-semibold uppercase tracking-wider text-navy-800"
              >
                Course Semester <span className="text-red-600">*</span>
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className={`
                  w-full bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border py-2.5 px-3.5
                  ${formErrors.semester ? 'border-red-500' : 'border-ivory-300'}
                  focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 shadow-academic-sm
                `}
              >
                <option value="">Select Semester</option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
              {formErrors.semester && (
                <p className="text-xs text-red-600 mt-0.5">{formErrors.semester}</p>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-wider text-navy-800"
            >
              Document Summary &amp; Key Concepts <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Outline the key theorems, chapter coverage, or lecture topics included in this PDF..."
              className={`
                w-full bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border p-3.5
                ${formErrors.description ? 'border-red-500' : 'border-ivory-300'}
                focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 shadow-academic-sm
              `}
            />
            {formErrors.description && (
              <p className="text-xs text-red-600 mt-0.5">{formErrors.description}</p>
            )}
          </div>

          {/* PDF File Upload Zone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-800 flex items-center justify-between">
              <span>
                Upload PDF Document <span className="text-red-600">*</span>
              </span>
              <span className="text-[11px] text-navy-700/60 lowercase">max 10 mb</span>
            </label>

            {!selectedFile ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-academic-lg p-8 text-center cursor-pointer transition-all
                  ${
                    isDragging
                      ? 'border-navy-900 bg-sage-50/50'
                      : 'border-ivory-300 hover:border-navy-800 bg-[#FCFBF9]'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-navy-900/10 text-navy-900 mx-auto flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6 text-navy-800" />
                </div>
                <p className="text-sm font-semibold text-navy-900">
                  Click to select or drag and drop your PDF file here
                </p>
                <p className="text-xs text-navy-700/70 mt-1">
                  Single PDF file up to 10 MB. Verified for clear reading on mobile and tablet.
                </p>
              </div>
            ) : (
              /* Selected File Preview */
              <div className="p-4 rounded-academic bg-ivory-200/60 border border-ivory-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5 text-sage-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-navy-700/70">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Application/PDF
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                  className="p-1.5 text-navy-700/70 hover:text-red-700 rounded-md hover:bg-ivory-300 transition-colors"
                  aria-label="Remove selected file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium text-navy-800">
                <span>Streaming PDF to repository...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-ivory-300 overflow-hidden">
                <div
                  className="h-full bg-navy-900 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-navy-700/80">
              <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
              <span>Attributed to your registered student scholar profile</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isUploading}
              loadingText={`Publishing (${uploadProgress}%)...`}
              className="w-full sm:w-auto"
            >
              Publish Lecture Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadNote;
