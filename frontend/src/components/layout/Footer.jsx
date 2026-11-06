import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../utils/constants';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-ivory-300 bg-ivory-200/50 text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-ivory-100" />
              </div>
              <span className="font-editorial text-2xl text-navy-900">NoteShare</span>
            </div>
            <p className="text-sm text-navy-800/80 max-w-md leading-relaxed font-sans">
              A peer-reviewed collaborative student notes exchange platform. Empowering university students to organize, preserve, and share academic knowledge with clean peer accountability.
            </p>
            <div className="flex items-center gap-2 text-xs text-navy-700/70 pt-1">
              <ShieldCheck className="w-4 h-4 text-sage-600" />
              <span>Verified Campus Academic Repository</span>
            </div>
          </div>

          {/* Quick Academic Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Academic Hub
            </h4>
            <ul className="space-y-2 text-sm text-navy-800/80">
              <li>
                <Link to={APP_ROUTES.NOTES} className="hover:text-navy-950 transition-colors">
                  Course Notes Catalog
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.UPLOAD_NOTE} className="hover:text-navy-950 transition-colors">
                  Upload Lecture Materials
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.BOOKMARKS} className="hover:text-navy-950 transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to={APP_ROUTES.MY_UPLOADS} className="hover:text-navy-950 transition-colors">
                  My Repository
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines & Integrity */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
              Honor Code
            </h4>
            <ul className="space-y-2 text-sm text-navy-800/80">
              <li>
                <span className="cursor-default">Academic Integrity Standard</span>
              </li>
              <li>
                <span className="cursor-default">Peer Review Protocol</span>
              </li>
              <li>
                <span className="cursor-default">Markdown &amp; PDF Guidelines</span>
              </li>
              <li>
                <span className="cursor-default">Student Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ivory-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-700/70">
          <p>© {CURRENT_YEAR} NoteShare Platform. Designed for university learning communities.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with academic precision for collaborative student success</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
