import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import NoteCard from '../components/notes/NoteCard';
import bookmarkService from '../services/bookmarkService';
import { APP_ROUTES } from '../utils/constants';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Bookmarks = () => {
  const navigate = useNavigate();

  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadBookmarks = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await bookmarkService.getBookmarks();
        if (isMounted) {
          const rawList =
            response?.data?.bookmarks ||
            response?.data ||
            response?.bookmarks ||
            [];
          // Filter out dangling records where the referenced note was deleted
          const validList = rawList.filter(
            (item) => Boolean(item && (item.note || item._id || item.title))
          );
          setSavedBookmarks(validList);
        }
      } catch (err) {
        if (isMounted) {
          const msg = getApiErrorMessage(
            err,
            'Unable to load your saved reading list. Please check connectivity.'
          );
          setErrorMessage(msg);
          setSavedBookmarks([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBookmarks();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleRemoveBookmark = async (noteId) => {
    setRemovingId(noteId);
    try {
      await bookmarkService.removeBookmark(noteId);
      // Remove from list
      setSavedBookmarks((prev) =>
        prev.filter((b) => {
          const noteObj = b.note || b;
          const currentId = noteObj._id || noteObj.id || b._id || b.id;
          return currentId !== noteId;
        })
      );
      toast.success('Note removed from your reading list.');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to remove bookmark.');
      toast.error(msg);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ivory-300 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
            Personal Reading List
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900 mt-1">
            Saved Course Bookmarks
          </h1>
          <p className="text-sm text-navy-800/70 mt-1 max-w-xl">
            Important lecture summaries and exam revision guides you have bookmarked for quick reference.
          </p>
        </div>

        <Button
          variant="outline"
          leftIcon={BookOpen}
          onClick={() => navigate(APP_ROUTES.NOTES)}
        >
          Explore Catalog
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="clay-card rounded-academic-lg p-5 space-y-4 animate-pulse">
              <div className="h-4 bg-ivory-300 rounded w-1/3" />
              <div className="h-5 bg-ivory-300 rounded w-3/4" />
              <div className="h-16 bg-ivory-200/70 rounded" />
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
              Unable to Retrieve Saved Notes
            </h3>
            <p className="text-xs sm:text-sm text-navy-800/80 leading-relaxed max-w-md mx-auto">
              {errorMessage}
            </p>
          </div>
          <div className="pt-2">
            <Button variant="outline" leftIcon={RefreshCw} onClick={() => setRefreshKey((k) => k + 1)}>
              Retry Reading List Query
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && savedBookmarks.length === 0 && (
        <div className="clay-card p-10 rounded-academic-xl text-center space-y-4 border border-ivory-300 max-w-xl mx-auto shadow-academic-sm">
          <div className="w-14 h-14 rounded-full bg-lavender-100 text-lavender-800 mx-auto flex items-center justify-center">
            <Bookmark className="w-7 h-7 text-lavender-700" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl text-navy-900">
              No Saved Bookmarks
            </h3>
            <p className="text-sm text-navy-800/70 max-w-md mx-auto leading-relaxed">
              You haven&apos;t saved any notes yet. As you browse the catalog, click the bookmark icon on lecture cards to curate your revision list.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              leftIcon={BookOpen}
              onClick={() => navigate(APP_ROUTES.NOTES)}
            >
              Browse Course Catalog
            </Button>
          </div>
        </div>
      )}

      {/* Bookmarks Grid */}
      {!isLoading && !errorMessage && savedBookmarks.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-navy-700/70 font-semibold uppercase tracking-wider">
            Saved Notes ({savedBookmarks.length})
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBookmarks.map((item) => {
              // Handle populating either note object directly or wrapped { note: { ... } }
              const noteData = item.note || item;
              const noteId = noteData._id || noteData.id || item._id;

              return (
                <NoteCard
                  key={item._id || noteId}
                  note={noteData}
                  isBookmarked={true}
                  onToggleBookmark={() => handleRemoveBookmark(noteId)}
                  isBookmarkLoading={removingId === noteId}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
