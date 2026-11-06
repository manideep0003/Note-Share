import React from 'react';
import { Bookmark, Download, FileText, User, Calendar, ExternalLink } from 'lucide-react';
import { formatDate, getFileDownloadUrl } from '../../utils/formatters';

export const NoteCard = ({
  note,
  isBookmarked = false,
  onToggleBookmark,
  isBookmarkLoading = false,
  onViewDetails,
}) => {
  const authorName =
    note.uploadedBy?.name ||
    note.user?.name ||
    (typeof note.uploadedBy === 'string' ? note.uploadedBy : 'Student Contributor');

  // Agreed backend field: fileUrl (Cloudinary)
  const filePath = note.fileUrl || note.file || note.filePath;
  const downloadUrl = filePath ? getFileDownloadUrl(filePath) : null;
  const downloadCount = typeof note.downloads === 'number' ? note.downloads : null;

  return (
    <div className="clay-card rounded-academic-lg p-5 flex flex-col justify-between border border-ivory-300 hover:shadow-academic transition-all space-y-4 group">
      {/* Card Header & Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.subject && (
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-sage-100 text-sage-900 border border-sage-200">
                {note.subject}
              </span>
            )}
            {note.semester && (
              <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-lavender-100 text-lavender-900 border border-lavender-200">
                {note.semester}
              </span>
            )}
          </div>

          {/* Bookmark Trigger */}
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(note._id || note.id)}
              disabled={isBookmarkLoading}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this note'}
              className={`p-1.5 rounded-md transition-colors ${
                isBookmarked
                  ? 'bg-lavender-100 text-lavender-800'
                  : 'text-navy-700/60 hover:text-navy-900 hover:bg-ivory-200'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? 'fill-current text-lavender-700' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Note Title */}
        <h3
          onClick={onViewDetails ? () => onViewDetails(note) : undefined}
          className={`font-semibold text-navy-900 text-base leading-snug group-hover:text-navy-800 transition-colors line-clamp-2 ${
            onViewDetails ? 'cursor-pointer hover:underline' : ''
          }`}
        >
          {note.title}
        </h3>

        {/* Note Description */}
        <p className="text-xs text-navy-700/80 leading-relaxed line-clamp-3">
          {note.description || 'No detailed course description provided with this submission.'}
        </p>
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div className="pt-3 border-t border-ivory-300/80 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-navy-700/70 font-sans">
          <span className="flex items-center gap-1.5 truncate max-w-[150px]">
            <User className="w-3.5 h-3.5 text-navy-600 shrink-0" />
            <span className="truncate">{authorName}</span>
          </span>

          <div className="flex items-center gap-2.5 shrink-0">
            {downloadCount !== null && (
              <span className="flex items-center gap-1 text-[11px] text-navy-700/70" title="Total downloads">
                <Download className="w-3 h-3 text-navy-500" />
                <span>{downloadCount}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-navy-500" />
              <span>{formatDate(note.createdAt)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {downloadUrl ? (
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-navy-700 bg-ivory-200/70 hover:bg-ivory-300 px-3 py-1.5 rounded-academic transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-navy-800" />
              <span>Download PDF</span>
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-navy-700/60 px-2 py-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Lecture Note</span>
            </span>
          )}

          <div className="flex items-center gap-1.5">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(note)}
                className="text-xs font-semibold text-navy-800 hover:text-navy-950 hover:bg-ivory-200/80 px-2.5 py-1.5 rounded-academic transition-colors"
              >
                Details
              </button>
            )}
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open document in new window"
                className="text-navy-700/60 hover:text-navy-900 p-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
