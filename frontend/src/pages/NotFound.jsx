import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import { APP_ROUTES } from '../utils/constants';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-academic-xl bg-ivory-200 border border-ivory-300 text-navy-900 flex items-center justify-center shadow-academic-sm">
        <BookOpen className="w-8 h-8 text-navy-800" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-bold uppercase tracking-widest text-navy-700/60">
          Error 404 • Missing Citation
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-navy-900">
          Page Not Found
        </h1>
        <p className="text-sm text-navy-800/70 leading-relaxed">
          The requested course archive, note index, or page could not be located in the NoteShare registry.
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          leftIcon={ArrowLeft}
          onClick={() => navigate(APP_ROUTES.HOME)}
        >
          Return to Campus Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

