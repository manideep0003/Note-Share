import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Filter,
  X,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  Download,
  Bookmark as BookmarkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import NoteCard from '../components/notes/NoteCard';
import useAuth from '../hooks/useAuth';
import notesService from '../services/notesService';
import bookmarkService from '../services/bookmarkService';
import { APP_ROUTES, SUBJECT_CATEGORIES, SEMESTERS } from '../utils/constants';
import { formatDate, getFileDownloadUrl } from '../utils/formatters';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Notes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Extract query filters from URL
  const initialSearch = searchParams.get('search') || '';
  const initialSubject = searchParams.get('subject') || '';
  const initialSemester = searchParams.get('semester') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Local filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Data states
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // User's active bookmark IDs
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [bookmarkingId, setBookmarkingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch bookmarks if authenticated
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      bookmarkService
        .getBookmarks()
        .then((res) => {
          if (isMounted) {
            const list = res?.data?.bookmarks || res?.data || res?.bookmarks || [];
            const ids = new Set(
              list.map((b) => (b.note?._id || b.note || b._id || b.id))
            );
            setBookmarkedIds(ids);
          }
        })
        .catch(() => {
          // Non-critical, ignore if bookmarks fail on initial mount
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Synchronize URL search parameters with state
  const updateUrlParams = useCallback(
    (search, subject, semester, page) => {
      const params = {};
      if (search) params.search = search;
      if (subject) params.subject = subject;
      if (semester) params.semester = semester;
      if (page > 1) params.page = page.toString();
      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Fetch notes when filters or page change
  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const queryParams = {
          page: currentPage,
          limit: 12,
        };
        if (searchTerm.trim()) queryParams.search = searchTerm.trim();
        if (selectedSubject) queryParams.subject = selectedSubject;
        if (selectedSemester) queryParams.semester = selectedSemester;

        const response = await notesService.getNotes(queryParams);

        if (!isCancelled) {
          const fetchedNotes = response?.data?.notes || response?.notes || [];
          const paginationData = response?.data?.pagination || response?.pagination || {
            page: currentPage,
            limit: 12,
            total: fetchedNotes.length,
            totalPages: Math.max(1, Math.ceil(fetchedNotes.length / 12)),
          };

          setNotes(fetchedNotes);
          setPagination(paginationData);
        }
      } catch (err) {
        if (!isCancelled) {
          const message = getApiErrorMessage(
            err,
            'Unable to retrieve notes from the academic repository. Please verify connectivity.'
          );
          setErrorMessage(message);
          setNotes([]);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, searchTerm, selectedSubject, selectedSemester]);

  // Handle Search input form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams(searchTerm, selectedSubject, selectedSemester, 1);
  };

  // Handle Subject change
  const handleSubjectChange = (subjectId) => {
    const nextSubject = selectedSubject === subjectId ? '' : subjectId;
    setSelectedSubject(nextSubject);
    setCurrentPage(1);
    updateUrlParams(searchTerm, nextSubject, selectedSemester, 1);
  };

  // Handle Semester change
  const handleSemesterChange = (semesterVal) => {
    const nextSemester = selectedSemester === semesterVal ? '' : semesterVal;
    setSelectedSemester(nextSemester);
    setCurrentPage(1);
    updateUrlParams(searchTerm, selectedSubject, nextSemester, 1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedSemester('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Pagination navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      updateUrlParams(searchTerm, selectedSubject, selectedSemester, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Bookmark toggle
  const handleToggleBookmark = async (noteId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save notes to your personal bookmarks.');
      navigate(APP_ROUTES.LOGIN);
      return;
    }

    setBookmarkingId(noteId);
    const isCurrentlyBookmarked = bookmarkedIds.has(noteId);

    try {
      if (isCurrentlyBookmarked) {
        await bookmarkService.removeBookmark(noteId);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(noteId);
          return next;
        });
        toast.success('Note removed from bookmarks.');
      } else {
        await bookmarkService.addBookmark(noteId);
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.add(noteId);
          return next;
        });
        toast.success('Note saved to bookmarks!');
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update bookmark.');
      toast.error(msg);
    } finally {
      setBookmarkingId(null);
    }
  };

  const hasActiveFilters = Boolean(searchTerm.trim() || selectedSubject || selectedSemester);

  return (
    <div className="space-y-8 py-2">
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ivory-300 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
            University Repository Catalog
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900 mt-1">
            Explore Course Notes
          </h1>
          <p className="text-sm text-navy-800/70 mt-1 max-w-xl">
            Browse verified course materials, syllabi summaries, and student study guides indexed by semester and subject.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={Plus}
          onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
        >
          Share Lecture Notes
        </Button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="clay-card p-4 sm:p-5 rounded-academic-lg space-y-4 border border-ivory-300">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-700/60 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by note title, course code, professor, or topic (e.g. CS101, Algorithms)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] text-navy-900 placeholder:text-navy-900/40 text-sm font-sans rounded-academic border border-ivory-300 focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 shadow-academic-sm"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Filter Notes
          </Button>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="md"
              leftIcon={X}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          )}
        </form>

        {/* Filter Dropdowns & Selectors */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-ivory-300/80">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-900 shrink-0">
            <Filter className="w-3.5 h-3.5 text-navy-700" />
            <span>Refine By:</span>
          </div>

          {/* Subject Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              aria-label="Filter by academic subject"
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full sm:w-48 bg-[#FAF9F5] text-navy-900 text-xs font-medium py-2 px-3 rounded-academic border border-ivory-300 focus:outline-none focus:border-navy-900 shadow-academic-sm cursor-pointer"
            >
              <option value="">All Subjects</option>
              {SUBJECT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              aria-label="Filter by academic semester"
              value={selectedSemester}
              onChange={(e) => handleSemesterChange(e.target.value)}
              className="w-full sm:w-40 bg-[#FAF9F5] text-navy-900 text-xs font-medium py-2 px-3 rounded-academic border border-ivory-300 focus:outline-none focus:border-navy-900 shadow-academic-sm cursor-pointer"
            >
              <option value="">All Semesters</option>
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 ml-auto text-xs">
              {selectedSubject && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sage-100 text-sage-900 border border-sage-200 text-[11px] font-medium">
                  <span>Subject: {selectedSubject}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleSubjectChange(selectedSubject)} />
                </span>
              )}
              {selectedSemester && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-900 border border-lavender-200 text-[11px] font-medium">
                  <span>{selectedSemester}</span>
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleSemesterChange(selectedSemester)} />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Catalog Content Area */}
      {/* LOADING STATE */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="clay-card rounded-academic-lg p-5 space-y-4 animate-pulse">
              <div className="flex gap-2">
                <div className="h-4 bg-ivory-300 rounded w-20" />
                <div className="h-4 bg-ivory-200 rounded w-16" />
              </div>
              <div className="h-5 bg-ivory-300 rounded w-3/4" />
              <div className="h-16 bg-ivory-200/70 rounded" />
              <div className="h-8 bg-ivory-200 rounded pt-2" />
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && errorMessage && (
        <div className="clay-card p-8 rounded-academic-xl border border-red-200 bg-red-50/20 text-center space-y-4 max-w-2xl mx-auto shadow-academic-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-editorial text-2xl text-navy-900">
              Unable to Retrieve Notes
            </h3>
            <p className="text-xs sm:text-sm text-navy-800/80 leading-relaxed max-w-lg mx-auto">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              leftIcon={RefreshCw}
              onClick={() => {
                setCurrentPage(1);
                setSearchTerm((prev) => prev);
              }}
            >
              Retry Repository Query
            </Button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !errorMessage && notes.length === 0 && (
        <div className="clay-card p-10 rounded-academic-xl text-center space-y-4 border border-ivory-300 max-w-xl mx-auto shadow-academic-sm">
          <div className="w-14 h-14 rounded-full bg-navy-900/10 text-navy-900 mx-auto flex items-center justify-center">
            <FileQuestion className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl text-navy-900">
              No Course Notes Found
            </h3>
            <p className="text-sm text-navy-800/70 leading-relaxed">
              {hasActiveFilters
                ? 'No notes match your current search query and filters. Try adjusting your keywords or clearing the active filters.'
                : 'The campus notes repository has no documents listed yet. Be the first scholar to upload course summaries!'}
            </p>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Active Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              leftIcon={Plus}
              onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
            >
              Upload New Notes
            </Button>
          </div>
        </div>
      )}

      {/* NOTES GRID (REAL API DATA) */}
      {!isLoading && !errorMessage && notes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-navy-700/70">
            <span>
              Showing <strong className="text-navy-900">{notes.length}</strong> of{' '}
              <strong className="text-navy-900">{pagination.total || notes.length}</strong> notes
            </span>
            <span>
              Page {pagination.page || currentPage} of {pagination.totalPages || 1}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id || note.id}
                note={note}
                isBookmarked={bookmarkedIds.has(note._id || note.id)}
                onToggleBookmark={handleToggleBookmark}
                isBookmarkLoading={bookmarkingId === (note._id || note.id)}
                onViewDetails={setSelectedNote}
              />
            ))}
          </div>

          {/* 4. PAGINATION CONTROLS */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-ivory-300">
              <Button
                variant="outline"
                size="sm"
                leftIcon={ChevronLeft}
                disabled={currentPage <= 1}
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
                disabled={currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* 5. Note Details Modal */}
      {selectedNote && (
        <Modal
          isOpen={Boolean(selectedNote)}
          onClose={() => setSelectedNote(null)}
          title={selectedNote.title}
          subtitle={`Contributed by ${
            selectedNote.uploadedBy?.name ||
            selectedNote.user?.name ||
            (typeof selectedNote.uploadedBy === 'string' ? selectedNote.uploadedBy : 'Student Scholar')
          } • ${formatDate(selectedNote.createdAt)}`}
          size="lg"
          footer={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
              <div>
                {selectedNote.fileUrl ? (
                  <a
                    href={getFileDownloadUrl(selectedNote.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-ivory-50 bg-navy-900 hover:bg-navy-800 px-4 py-2 rounded-academic transition-colors shadow-academic-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF Document</span>
                  </a>
                ) : (
                  <span className="text-xs text-navy-700/60 italic">
                    PDF document link unavailable
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={BookmarkIcon}
                  onClick={() => handleToggleBookmark(selectedNote._id || selectedNote.id)}
                  disabled={bookmarkingId === (selectedNote._id || selectedNote.id)}
                >
                  {bookmarkedIds.has(selectedNote._id || selectedNote.id)
                    ? 'Saved in Bookmarks'
                    : 'Bookmark Note'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNote(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            {/* Subject and Semester Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {selectedNote.subject && (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-sage-100 text-sage-900 border border-sage-200">
                  {selectedNote.subject}
                </span>
              )}
              {selectedNote.semester && (
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-lavender-100 text-lavender-900 border border-lavender-200">
                  {selectedNote.semester}
                </span>
              )}
              {typeof selectedNote.downloads === 'number' && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-ivory-200 text-navy-800 border border-ivory-300">
                  {selectedNote.downloads} downloads
                </span>
              )}
            </div>

            {/* Note Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700/80">
                Course Description &amp; Summary
              </h4>
              <p className="text-sm text-navy-800/90 leading-relaxed whitespace-pre-line">
                {selectedNote.description || 'No detailed course description provided for this submission.'}
              </p>
            </div>

            {/* Academic Attribution Panel */}
            <div className="p-4 rounded-academic bg-ivory-200/50 border border-ivory-300/80 space-y-2 text-xs text-navy-800">
              <div className="flex items-center justify-between">
                <span className="text-navy-700/70 font-medium">Author Attribution:</span>
                <span className="font-semibold text-navy-900">
                  {selectedNote.uploadedBy?.name || selectedNote.user?.name || 'Verified Scholar'}
                </span>
              </div>
              {selectedNote.uploadedBy?.email && (
                <div className="flex items-center justify-between">
                  <span className="text-navy-700/70 font-medium">Campus Contact:</span>
                  <span className="font-mono text-[11px] text-navy-800">{selectedNote.uploadedBy.email}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-navy-700/70 font-medium">Date Published:</span>
                <span>{formatDate(selectedNote.createdAt)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notes;
