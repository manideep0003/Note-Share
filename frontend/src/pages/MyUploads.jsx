import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Library,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import useAuth from '../hooks/useAuth';
import notesService from '../services/notesService';
import { APP_ROUTES, SUBJECT_CATEGORIES, SEMESTERS } from '../utils/constants';
import { formatDate, getFileDownloadUrl } from '../utils/formatters';
import { getApiErrorMessage } from '../utils/errorHelper';
import { checkNoteOwnership } from '../utils/ownershipHelper';

export const MyUploads = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Edit Modal State
  const [editingNote, setEditingNote] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    subject: '',
    semester: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingNote, setDeletingNote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await notesService.getMyUploads({
          page: currentPage,
          limit: 10,
        });

        if (isMounted) {
          const userNotes =
            response?.data?.notes ||
            response?.data ||
            response?.notes ||
            [];
          const paginationData = response?.data?.pagination || response?.pagination || {
            page: currentPage,
            limit: 10,
            total: userNotes.length,
            totalPages: Math.max(1, Math.ceil(userNotes.length / 10)),
          };

          setNotes(userNotes);
          setPagination(paginationData);
        }
      } catch (err) {
        if (isMounted) {
          const msg = getApiErrorMessage(
            err,
            'Unable to load your uploads. Please verify server connection.'
          );
          setErrorMessage(msg);
          setNotes([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle Edit initiation
  const handleOpenEdit = (note) => {
    // Missing uploadedBy is never treated as ownership
    if (!checkNoteOwnership(note, user)) {
      toast.error('You do not have permission to edit this note.');
      return;
    }

    setEditingNote(note);
    setEditFormData({
      title: note.title || '',
      description: note.description || '',
      subject: note.subject || '',
      semester: note.semester || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingNote) return;

    if (!editFormData.title.trim() || !editFormData.subject || !editFormData.semester) {
      toast.error('Title, subject, and semester are required fields.');
      return;
    }

    setIsUpdating(true);
    try {
      const noteId = editingNote._id || editingNote.id;
      // Agreed backend fields: title, description, subject, semester
      const res = await notesService.updateNote(noteId, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        subject: editFormData.subject,
        semester: editFormData.semester,
      });

      const updated = res?.data?.note || res?.data || res?.note || {
        ...editingNote,
        ...editFormData,
      };

      setNotes((prev) =>
        prev.map((n) => ((n._id || n.id) === noteId ? { ...n, ...updated } : n))
      );

      toast.success('Lecture note details updated successfully!');
      setEditingNote(null);
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update note details.');
      toast.error(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete execution
  const handleDeleteConfirm = async () => {
    if (!deletingNote) return;

    // Missing uploadedBy is never treated as ownership
    if (!checkNoteOwnership(deletingNote, user)) {
      toast.error('You do not have permission to delete this note.');
      setDeletingNote(null);
      return;
    }

    setIsDeleting(true);
    const noteId = deletingNote._id || deletingNote.id;

    try {
      await notesService.deleteNote(noteId);
      toast.success('Lecture note removed from the repository.');
      setDeletingNote(null);
      // Reset to page 1 or previous page if current page became empty
      if (notes.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to delete note.');
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ivory-300 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
            Student Contribution Archive
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900 mt-1">
            My Uploaded Notes
          </h1>
          <p className="text-sm text-navy-800/70 mt-1 max-w-xl">
            Review, edit course metadata, or remove lecture summaries you have published to the collegiate network.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={Plus}
          onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
        >
          Upload New Material
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="clay-card p-5 rounded-academic-lg space-y-3 animate-pulse">
              <div className="h-5 bg-ivory-300 rounded w-1/3" />
              <div className="h-4 bg-ivory-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <div className="clay-card p-8 rounded-academic-xl border border-red-200 bg-red-50/20 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-editorial text-2xl text-navy-900">
              Unable to Retrieve Your Uploads
            </h3>
            <p className="text-xs sm:text-sm text-navy-800/80 leading-relaxed max-w-md mx-auto">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" leftIcon={RefreshCw} onClick={() => setRefreshKey((k) => k + 1)}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && notes.length === 0 && (
        <div className="clay-card p-10 rounded-academic-xl text-center space-y-4 border border-ivory-300 max-w-xl mx-auto shadow-academic-sm">
          <div className="w-14 h-14 rounded-full bg-navy-900/10 text-navy-900 mx-auto flex items-center justify-center">
            <Library className="w-7 h-7 text-navy-800" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl text-navy-900">
              No Published Notes Yet
            </h3>
            <p className="text-sm text-navy-800/70 max-w-md mx-auto leading-relaxed">
              You haven&apos;t uploaded any course summaries yet. Share your lecture notes to help classmates and build your academic contribution record.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              leftIcon={Plus}
              onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
            >
              Upload Your First Note
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {!isLoading && !errorMessage && notes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-navy-700/70">
            <span className="font-semibold uppercase tracking-wider">
              Total Contributions ({pagination.total || notes.length})
            </span>
            {pagination.totalPages > 1 && (
              <span>
                Page {pagination.page || currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {notes.map((note) => {
              const noteId = note._id || note.id;
              // Agreed backend field: fileUrl (Cloudinary)
              const fileLink = note.fileUrl || note.file || note.filePath;
              const downloadUrl = fileLink ? getFileDownloadUrl(fileLink) : null;

              // Contract Ownership Verification: only present edit/delete actions if user is confirmed author
              // Missing uploadedBy must never be treated as ownership
              const isOwner = checkNoteOwnership(note, user);

              return (
                <div
                  key={noteId}
                  className="clay-card p-5 rounded-academic-lg border border-ivory-300 hover:shadow-academic transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-sage-100 text-sage-900 border border-sage-200">
                        {note.subject || 'General'}
                      </span>
                      {note.semester && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-lavender-100 text-lavender-900 border border-lavender-200">
                          {note.semester}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-navy-900 text-base leading-snug">
                      {note.title}
                    </h3>

                    <p className="text-xs text-navy-700/80 line-clamp-2 max-w-3xl">
                      {note.description || 'No summary description provided.'}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-navy-700/70 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Uploaded {formatDate(note.createdAt)}</span>
                      </span>

                      {typeof note.downloads === 'number' && (
                        <span className="flex items-center gap-1" title="Total downloads">
                          <Download className="w-3.5 h-3.5 text-navy-600" />
                          <span>{note.downloads} downloads</span>
                        </span>
                      )}

                      {downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-navy-900 hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>View PDF</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions (Only presented if ownership is confirmed) */}
                  {isOwner && (
                    <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-ivory-300/60 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={Edit2}
                        onClick={() => handleOpenEdit(note)}
                      >
                        Edit Note
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={Trash2}
                        onClick={() => setDeletingNote(note)}
                        className="text-red-700 hover:text-red-800 hover:bg-red-50/50"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-ivory-300">
              <Button
                variant="outline"
                size="sm"
                leftIcon={ChevronLeft}
                disabled={currentPage <= 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>

              <span className="text-xs font-semibold px-4 text-navy-900">
                Page {currentPage} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                rightIcon={ChevronRight}
                disabled={currentPage >= pagination.totalPages || isLoading}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Edit Note Modal */}
      <Modal
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title="Edit Course Note Metadata"
        subtitle="Update subject tagging, semester attribution, and syllabus summary"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Note Title"
            required
            value={editFormData.title}
            onChange={(e) => setEditFormData((p) => ({ ...p, title: e.target.value }))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-800">
                Subject Faculty
              </label>
              <select
                value={editFormData.subject}
                onChange={(e) => setEditFormData((p) => ({ ...p, subject: e.target.value }))}
                className="bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border border-ivory-300 py-2.5 px-3"
              >
                {SUBJECT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-800">
                Semester
              </label>
              <select
                value={editFormData.semester}
                onChange={(e) => setEditFormData((p) => ({ ...p, semester: e.target.value }))}
                className="bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border border-ivory-300 py-2.5 px-3"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-navy-800">
              Document Summary
            </label>
            <textarea
              rows={3}
              value={editFormData.description}
              onChange={(e) => setEditFormData((p) => ({ ...p, description: e.target.value }))}
              className="bg-[#FCFBF9] text-navy-900 text-sm font-sans rounded-academic border border-ivory-300 p-3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-ivory-300">
            <Button variant="ghost" onClick={() => setEditingNote(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Save Updates
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingNote)}
        onClose={() => setDeletingNote(null)}
        title="Confirm Note Removal"
        subtitle="This action will permanently remove this material from the university repository."
        footer={
          <>
            <Button
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeletingNote(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
            >
              Delete Note Permanently
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-navy-800 leading-relaxed">
            Are you sure you want to delete{' '}
            <strong className="text-navy-950 font-semibold">
              &quot;{deletingNote?.title}&quot;
            </strong>
            ? Classmates will no longer be able to discover or download this PDF document.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default MyUploads;
