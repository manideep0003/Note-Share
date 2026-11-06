import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Bookmark,
  Library,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import notesService from '../services/notesService';
import bookmarkService from '../services/bookmarkService';
import { APP_ROUTES } from '../utils/constants';
import { formatDate, getFileDownloadUrl } from '../utils/formatters';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myUploads, setMyUploads] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [uploadsRes, bookmarksRes] = await Promise.allSettled([
          notesService.getMyUploads(),
          bookmarkService.getBookmarks(),
        ]);

        if (isMounted) {
          if (uploadsRes.status === 'fulfilled') {
            const uploadsData =
              uploadsRes.value?.data?.notes ||
              uploadsRes.value?.data ||
              uploadsRes.value?.notes ||
              [];
            setMyUploads(uploadsData);
          }

          if (bookmarksRes.status === 'fulfilled') {
            const rawBookmarks =
              bookmarksRes.value?.data?.bookmarks ||
              bookmarksRes.value?.data ||
              bookmarksRes.value?.bookmarks ||
              [];
            const validBookmarks = rawBookmarks.filter(
              (b) => Boolean(b && (b.note || b._id || b.title))
            );
            setBookmarks(validBookmarks);
          }

          if (uploadsRes.status === 'rejected' && bookmarksRes.status === 'rejected') {
            throw uploadsRes.reason;
          }
        }
      } catch (err) {
        if (isMounted) {
          const msg = getApiErrorMessage(
            err,
            'Unable to synchronize student workspace data from backend.'
          );
          setErrorMessage(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const totalUploadsCount = myUploads.length;
  const totalBookmarksCount = bookmarks.length;
  const recentUploads = myUploads.slice(0, 4);
  const recentBookmarks = bookmarks.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header Banner */}
      <div className="clay-card rounded-academic-xl p-6 sm:p-8 border border-ivory-300 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 border border-sage-200 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
              <span>Verified Scholar Workspace</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900">
              Welcome back, {user?.name || 'Scholar'}
            </h1>
            <p className="text-sm text-navy-800/70">
              Manage your published course materials, track saved notes, and collaborate across campus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              leftIcon={Plus}
              onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
            >
              Upload Notes
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={BookOpen}
              onClick={() => navigate(APP_ROUTES.NOTES)}
            >
              Explore Catalog
            </Button>
          </div>
        </div>
      </div>

      {/* Error state if server unreachable */}
      {errorMessage && (
        <div className="clay-card p-5 rounded-academic-lg border border-red-200 bg-red-50/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={() => setRefreshKey((k) => k + 1)}>
            Retry
          </Button>
        </div>
      )}

      {/* 2. Real Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Uploads Count */}
        <div className="clay-card p-5 rounded-academic-lg space-y-2 border border-ivory-300">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-navy-700/70">
              Published Notes
            </span>
            <div className="w-8 h-8 rounded-md bg-navy-900/5 text-navy-900 flex items-center justify-center">
              <Library className="w-4 h-4" />
            </div>
          </div>
          <div className="font-editorial text-3xl text-navy-900">
            {isLoading ? <span className="text-base text-navy-400">Loading...</span> : totalUploadsCount}
          </div>
          <p className="text-[11px] text-navy-700/70">
            Materials shared to the campus archive
          </p>
        </div>

        {/* Bookmarks Count */}
        <div className="clay-card p-5 rounded-academic-lg space-y-2 border border-ivory-300">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-navy-700/70">
              Saved Bookmarks
            </span>
            <div className="w-8 h-8 rounded-md bg-lavender-100 text-lavender-900 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-lavender-700" />
            </div>
          </div>
          <div className="font-editorial text-3xl text-navy-900">
            {isLoading ? <span className="text-base text-navy-400">Loading...</span> : totalBookmarksCount}
          </div>
          <p className="text-[11px] text-navy-700/70">
            Curated reading list for midterm revision
          </p>
        </div>

        {/* Academic Role */}
        <div className="clay-card p-5 rounded-academic-lg space-y-2 border border-ivory-300">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-navy-700/70">
              Academic Standing
            </span>
            <div className="w-8 h-8 rounded-md bg-sage-100 text-sage-900 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-sage-700" />
            </div>
          </div>
          <div className="font-editorial text-2xl text-navy-900 capitalize">
            {user?.role || 'Student'}
          </div>
          <p className="text-[11px] text-sage-700 font-medium">
            Verified institutional membership
          </p>
        </div>
      </div>

      {/* 3. Recent Uploads & Bookmarks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Your Recent Uploads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
            <h2 className="font-semibold text-base text-navy-900 flex items-center gap-2">
              <Library className="w-4 h-4 text-navy-700" />
              <span>Your Recent Uploads</span>
            </h2>
            <Link
              to={APP_ROUTES.MY_UPLOADS}
              className="text-xs font-semibold text-navy-800 hover:text-navy-950 inline-flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="clay-card p-4 rounded-academic space-y-2 animate-pulse">
                  <div className="h-4 bg-ivory-300 rounded w-2/3" />
                  <div className="h-3 bg-ivory-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && recentUploads.length > 0 && (
            <div className="space-y-3">
              {recentUploads.map((note) => (
                <div
                  key={note._id || note.id}
                  className="clay-card p-4 rounded-academic flex items-center justify-between gap-3 border border-ivory-300 hover:shadow-academic transition-all"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.2 text-[9px] font-semibold uppercase rounded bg-sage-100 text-sage-900">
                        {note.subject || 'General'}
                      </span>
                      {note.semester && (
                        <span className="px-2 py-0.2 text-[9px] font-semibold uppercase rounded bg-lavender-100 text-lavender-900">
                          {note.semester}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-navy-900 truncate">{note.title}</p>
                    <p className="text-[10px] text-navy-700/70 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(note.createdAt)}</span>
                    </p>
                  </div>

                  {getFileDownloadUrl(note.fileUrl || note.file) && (
                    <a
                      href={getFileDownloadUrl(note.fileUrl || note.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-medium bg-ivory-200/80 hover:bg-ivory-300 text-navy-900 rounded-academic shrink-0"
                    >
                      View PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && recentUploads.length === 0 && (
            <div className="clay-card p-6 rounded-academic text-center space-y-3 border border-ivory-300">
              <FileText className="w-8 h-8 text-navy-400 mx-auto" />
              <p className="text-xs text-navy-700/80">
                You have not uploaded any lecture materials yet.
              </p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={Plus}
                onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
              >
                Upload First Note
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Your Saved Bookmarks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-ivory-300 pb-3">
            <h2 className="font-semibold text-base text-navy-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-lavender-700" />
              <span>Saved Reading List</span>
            </h2>
            <Link
              to={APP_ROUTES.BOOKMARKS}
              className="text-xs font-semibold text-navy-800 hover:text-navy-950 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="clay-card p-4 rounded-academic space-y-2 animate-pulse">
                  <div className="h-4 bg-ivory-300 rounded w-2/3" />
                  <div className="h-3 bg-ivory-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && recentBookmarks.length > 0 && (
            <div className="space-y-3">
              {recentBookmarks.map((b) => {
                const noteObj = b.note || b;
                return (
                  <div
                    key={b._id || b.id || noteObj._id}
                    className="clay-card p-4 rounded-academic flex items-center justify-between gap-3 border border-ivory-300 hover:shadow-academic transition-all"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="px-2 py-0.2 text-[9px] font-semibold uppercase rounded bg-sage-100 text-sage-900">
                        {noteObj.subject || 'General'}
                      </span>
                      <p className="text-xs font-semibold text-navy-900 truncate">
                        {noteObj.title || 'Saved Note'}
                      </p>
                      <p className="text-[10px] text-navy-700/70">
                        {noteObj.uploadedBy?.name || 'Campus Scholar'}
                      </p>
                    </div>

                    <Link
                      to={`${APP_ROUTES.NOTES}?search=${encodeURIComponent(noteObj.title || '')}`}
                      className="px-2.5 py-1 text-xs font-medium bg-ivory-200/80 hover:bg-ivory-300 text-navy-900 rounded-academic shrink-0"
                    >
                      Open Note
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && recentBookmarks.length === 0 && (
            <div className="clay-card p-6 rounded-academic text-center space-y-3 border border-ivory-300">
              <Bookmark className="w-8 h-8 text-navy-400 mx-auto" />
              <p className="text-xs text-navy-700/80">
                No bookmarked study materials in your reading list.
              </p>
              <Button
                variant="outline"
                size="sm"
                leftIcon={BookOpen}
                onClick={() => navigate(APP_ROUTES.NOTES)}
              >
                Browse Catalog
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
