import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Upload,
  Bookmark,
  ShieldCheck,
  FileText,
  Clock,
  User,
  CheckCircle2,
  Laptop,
  Calculator,
  Cpu,
  Wrench,
  TrendingUp,
  Atom,
  Sparkles,
} from 'lucide-react';
import Button from '../components/common/Button';
import AcademicIllustration from '../components/common/AcademicIllustration';
import useAuth from '../hooks/useAuth';
import notesService from '../services/notesService';
import { APP_ROUTES, SUBJECT_CATEGORIES } from '../utils/constants';

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Live recent notes state from GET /notes?limit=4
  const [recentNotes, setRecentNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notesError, setNotesError] = useState(null);

  // Fetch recent notes from real API
  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      try {
        setIsLoadingNotes(true);
        setNotesError(null);
        const res = await notesService.getNotes({ limit: 4 });
        if (isMounted) {
          // Expected backend structure: { success: true, data: { notes: [...], pagination: {...} } }
          const notesList = res?.data?.notes || res?.notes || [];
          setRecentNotes(notesList);
        }
      } catch (err) {
        if (isMounted) {
          // Do not throw fake data on error; report state honestly
          setNotesError(
            err?.code === 'ERR_NETWORK' || (!err?.response && err?.message === 'Network Error')
              ? 'The academic notes repository server is currently offline or unreachable. Notes will appear here as soon as the service connects.'
              : err?.response?.data?.message || 'Unable to load recent notes from repository.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingNotes(false);
        }
      }
    };

    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${APP_ROUTES.NOTES}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(APP_ROUTES.NOTES);
    }
  };

  const getSubjectIcon = (iconName) => {
    switch (iconName) {
      case 'Laptop':
        return Laptop;
      case 'Calculator':
        return Calculator;
      case 'Cpu':
        return Cpu;
      case 'Wrench':
        return Wrench;
      case 'TrendingUp':
        return TrendingUp;
      case 'Atom':
        return Atom;
      default:
        return BookOpen;
    }
  };

  const popularKeywords = [
    'Data Structures',
    'Linear Algebra',
    'Operating Systems',
    'Calculus',
    'Microeconomics',
    'Thermodynamics',
  ];

  return (
    <div className="space-y-20 py-4 sm:py-6">
      {/* 1. PROFESSIONAL HERO SECTION */}
      <section className="relative overflow-hidden rounded-academic-xl bg-[#FAF9F5] border border-ivory-300 p-8 sm:p-12 lg:p-14 shadow-academic">
        {/* Soft atmospheric gradient accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sage-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-24 w-96 h-96 rounded-full bg-lavender-100/50 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/5 border border-navy-900/10 text-navy-900 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-navy-900" />
              <span>Collegiate Academic Repository • Spring Semester</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-navy-900 leading-[1.12] tracking-tight">
              Exchange Knowledge. <br />
              <span className="italic text-navy-700">Elevate Campus Scholarship.</span>
            </h1>

            <p className="text-base sm:text-lg text-navy-800/80 leading-relaxed font-sans max-w-xl">
              A peer-reviewed academic notes exchange platform engineered for university departments.
              Explore verified lecture summaries, course syllabi, and curated study materials submitted across campus.
            </p>

            {/* 2. HERO SEARCH INTERFACE */}
            <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl">
              <div className="clay-card p-2 rounded-academic-lg flex flex-col sm:flex-row items-center gap-2 border border-ivory-300">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-700/60 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by subject, course code, or topic (e.g. CS101, Algorithms)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-transparent text-navy-900 placeholder:text-navy-900/40 text-sm font-sans focus:outline-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" rightIcon={ArrowRight} className="w-full sm:w-auto shrink-0">
                  Search Notes
                </Button>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs text-navy-700/70">
                <span className="font-semibold text-navy-900">Popular:</span>
                {popularKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => navigate(`${APP_ROUTES.NOTES}?search=${encodeURIComponent(keyword)}`)}
                    className="px-2.5 py-1 rounded-md bg-ivory-200/80 hover:bg-ivory-300 text-navy-800 text-[11px] font-medium transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                rightIcon={ArrowRight}
                onClick={() => navigate(APP_ROUTES.NOTES)}
              >
                Browse Course Catalog
              </Button>

              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(APP_ROUTES.REGISTER)}
                >
                  Join NoteShare
                </Button>
              ) : (
                <Button
                  variant="clay"
                  size="lg"
                  leftIcon={Upload}
                  onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
                >
                  Share Lecture Material
                </Button>
              )}
            </div>
          </div>

          {/* Hero Right: Academic Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <AcademicIllustration className="w-full h-auto drop-shadow-md" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. BROWSE BY SUBJECT CATEGORIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ivory-300 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
              Departmental Archives
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-navy-900 mt-1">
              Browse Notes by Subject Faculty
            </h2>
            <p className="text-sm text-navy-800/70 mt-0.5">
              Access curated lecture archives and syllabus materials organized by discipline.
            </p>
          </div>
          <Link
            to={APP_ROUTES.NOTES}
            className="text-xs font-semibold uppercase tracking-wider text-navy-900 hover:text-navy-700 inline-flex items-center gap-1 shrink-0"
          >
            <span>View All Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUBJECT_CATEGORIES.map((cat) => {
            const IconComponent = getSubjectIcon(cat.iconName);
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`${APP_ROUTES.NOTES}?subject=${encodeURIComponent(cat.id)}`)}
                className="clay-card p-5 rounded-academic-lg cursor-pointer group hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-academic bg-navy-900/5 text-navy-900 flex items-center justify-center border border-navy-900/10 group-hover:bg-navy-900 group-hover:text-ivory-50 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 text-base group-hover:text-navy-800">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-navy-700/70 mt-1 leading-relaxed">
                      {cat.count}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-ivory-300/60 flex items-center justify-between text-xs text-navy-800/80 font-medium">
                  <span>Explore Faculty Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RECENTLY UPLOADED NOTES (LIVE API DRIVEN) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ivory-300 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
              Fresh Submissions
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-navy-900 mt-1">
              Recently Uploaded Course Notes
            </h2>
            <p className="text-sm text-navy-800/70 mt-0.5">
              Live peer materials freshly uploaded to the collegiate repository.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            rightIcon={ArrowRight}
            onClick={() => navigate(APP_ROUTES.NOTES)}
          >
            Explore Complete Catalog
          </Button>
        </div>

        {/* Loading Skeleton */}
        {isLoadingNotes && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="clay-card p-5 rounded-academic-lg space-y-3 animate-pulse">
                <div className="h-4 bg-ivory-300 rounded w-3/4" />
                <div className="h-3 bg-ivory-200 rounded w-1/2" />
                <div className="h-14 bg-ivory-200/60 rounded" />
                <div className="h-4 bg-ivory-300 rounded w-1/3 pt-2" />
              </div>
            ))}
          </div>
        )}

        {/* Real Notes Returned from API */}
        {!isLoadingNotes && !notesError && recentNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentNotes.map((note) => (
              <div
                key={note._id || note.id}
                className="clay-card p-5 rounded-academic-lg flex flex-col justify-between space-y-4 hover:shadow-academic transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-sage-100 text-sage-900 border border-sage-200">
                      {note.subject || 'General'}
                    </span>
                    {note.semester && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-lavender-100 text-lavender-900 border border-lavender-200">
                        {note.semester}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-navy-900 text-sm line-clamp-2 leading-snug">
                    {note.title}
                  </h3>
                  <p className="text-xs text-navy-700/70 line-clamp-2">
                    {note.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-ivory-300/80 flex items-center justify-between text-[11px] text-navy-700/80">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-navy-600" />
                    <span>{note.uploadedBy?.name || note.user?.name || 'Scholar'}</span>
                  </span>
                  <Link
                    to={`${APP_ROUTES.NOTES}?search=${encodeURIComponent(note.title)}`}
                    className="font-semibold text-navy-900 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State (API active, but zero notes uploaded yet) */}
        {!isLoadingNotes && !notesError && recentNotes.length === 0 && (
          <div className="clay-card p-8 rounded-academic-xl text-center space-y-4 border border-ivory-300">
            <div className="w-12 h-12 rounded-full bg-navy-900/10 text-navy-900 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-editorial text-2xl text-navy-900">
                Campus Archive Ready for Contributions
              </h3>
              <p className="text-sm text-navy-800/70 max-w-md mx-auto">
                No course notes have been uploaded to the repository yet. Be the first student or faculty member to publish lecture materials.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                leftIcon={Upload}
                onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
              >
                Upload Lecture Notes
              </Button>
            </div>
          </div>
        )}

        {/* Honest Network/Connection State (If Backend is offline) */}
        {!isLoadingNotes && notesError && (
          <div className="clay-card p-6 rounded-academic-lg border border-ivory-300 bg-ivory-50/70 space-y-2">
            <div className="flex items-center gap-2 text-navy-900 font-semibold text-sm">
              <Clock className="w-4 h-4 text-navy-700" />
              <span>Academic Repository Status</span>
            </div>
            <p className="text-xs text-navy-800/80 leading-relaxed max-w-2xl">
              {notesError}
            </p>
          </div>
        )}
      </section>

      {/* 5. HOW NOTESHARE WORKS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
            Campus Workflow
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-navy-900">
            How Peer Note Sharing Works
          </h2>
          <p className="text-sm text-navy-800/70">
            A transparent academic workflow built for collaborative scholarship and exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="clay-card p-6 rounded-academic-xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-3xl text-navy-900/30">01</span>
              <div className="w-10 h-10 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-ivory-100" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-navy-900">Upload Course Notes</h3>
            <p className="text-xs text-navy-800/80 leading-relaxed">
              Upload your handwritten lecture digests, formula guides, or syllabus summaries in PDF format with course title, semester, and department tags.
            </p>
          </div>

          {/* Step 2 */}
          <div className="clay-card p-6 rounded-academic-xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-3xl text-navy-900/30">02</span>
              <div className="w-10 h-10 rounded-academic bg-sage-100 text-sage-900 border border-sage-200 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sage-700" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-navy-900">Peer Taxonomy &amp; Indexing</h3>
            <p className="text-xs text-navy-800/80 leading-relaxed">
              Notes are categorized cleanly into faculty subjects and semester cohorts, making materials instantly searchable by course code or professor.
            </p>
          </div>

          {/* Step 3 */}
          <div className="clay-card p-6 rounded-academic-xl space-y-4 relative">
            <div className="flex items-center justify-between">
              <span className="font-editorial text-3xl text-navy-900/30">03</span>
              <div className="w-10 h-10 rounded-academic bg-lavender-100 text-lavender-900 border border-lavender-200 flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-lavender-700" />
              </div>
            </div>
            <h3 className="font-semibold text-lg text-navy-900">Discover &amp; Excel</h3>
            <p className="text-xs text-navy-800/80 leading-relaxed">
              Read online, download original PDFs for offline review, bookmark crucial references for midterms, and accelerate your university learning.
            </p>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM BENEFITS */}
      <section className="rounded-academic-xl bg-[#FAF9F5] border border-ivory-300 p-8 sm:p-10 shadow-academic-sm space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
            Built for Academic Precision
          </span>
          <h2 className="font-editorial text-3xl text-navy-900">
            Why Students Depend on NoteShare
          </h2>
          <p className="text-sm text-navy-800/70">
            Engineered specifically to solve fragmented study groups and inaccessible lecture notes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-navy-900/10 text-navy-900 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-navy-800" />
            </div>
            <h4 className="font-semibold text-navy-900 text-sm">Verified Taxonomy</h4>
            <p className="text-xs text-navy-700/80 leading-relaxed">
              Filter systematically by Semester 1 through Semester 8 and academic department without cluttered noise.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-sage-100 text-sage-900 flex items-center justify-center">
              <FileText className="w-4 h-4 text-sage-700" />
            </div>
            <h4 className="font-semibold text-navy-900 text-sm">Direct PDF Downloads</h4>
            <p className="text-xs text-navy-700/80 leading-relaxed">
              Fast, uncompressed downloads of original lecture materials directly for offline tablet and paper annotation.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-lavender-100 text-lavender-900 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-lavender-700" />
            </div>
            <h4 className="font-semibold text-navy-900 text-sm">Personal Bookmarks</h4>
            <p className="text-xs text-navy-700/80 leading-relaxed">
              Curate a custom exam reading list synchronized with your student profile for focused end-of-term revision.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-navy-900/10 text-navy-900 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-navy-800" />
            </div>
            <h4 className="font-semibold text-navy-900 text-sm">Peer Accountability</h4>
            <p className="text-xs text-navy-700/80 leading-relaxed">
              Clear student and faculty author attribution ensures high academic integrity and constructive collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* 7. STUDENT COMMUNITY CALL-TO-ACTION */}
      <section className="clay-card rounded-academic-xl p-8 sm:p-12 border border-ivory-300 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-sage-700" />
            <span>Collegiate Student Network</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl text-navy-900">
            Ready to Share and Excel with Your Peers?
          </h2>

          <p className="text-sm sm:text-base text-navy-800/80 leading-relaxed max-w-xl mx-auto font-sans">
            Join students across all faculties contributing to the campus syllabus archive.
            Free access, open collaboration, and pure academic excellence.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!isAuthenticated ? (
            <Button
              variant="primary"
              size="lg"
              rightIcon={ArrowRight}
              onClick={() => navigate(APP_ROUTES.REGISTER)}
            >
              Create Free Student Account
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              leftIcon={Upload}
              onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
            >
              Upload Lecture Materials
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(APP_ROUTES.NOTES)}
          >
            Explore Notes Catalog
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
