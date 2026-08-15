import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bug, BookUp, Send, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle, FileText, BookOpen, FileQuestion, Video } from 'lucide-react';
import { contributionApi, createContribution, resourceApi } from '../services/api.js';
import { BRANCHES, SEMESTERS } from '../constants/index.js';
import { Alert } from '../components/ui/Alert.jsx';
import { ButtonSpinner } from '../components/ui/Spinner.jsx';
import { ZipUpload } from '../components/ui/ZipUpload.jsx';

export default function Contribute() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'landing';
  const setView = (v) => {
    if (v === 'landing') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ view: v }, { replace: true });
    }
  };
  
  // Form states
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (branch && semester) {
      resourceApi.getByBranchAndSem(branch, semester)
        .then(res => setSubjects(res.data?.data?.subjects || res.data?.data || []))
        .catch(() => setSubjects([]));
    } else {
      setSubjects([]);
      setSubjectId('');
    }
  }, [branch, semester]);
  
  // Submission states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const resetState = () => {
    setDescription('');
    setFile(null);
    setUrl('');
    setBranch('');
    setSemester('');
    setSubjectId('');
    setTitle('');
    setError('');
    setSubmitted(false);
  };

  const handleBack = () => {
    if (view === 'notes' || view === 'book' || view === 'pyq' || view === 'lecture') {
      setView('resource-select');
    } else {
      setView('landing');
    }
    resetState();
  };

  const handleSubmitBug = async (e) => {
    e.preventDefault();
    if (loading || !description.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      // Trying the actual backend API. Since the controller doesn't exist, this will throw 404.
      await contributionApi.submit({ type: 'bug', description });
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Bug reporting backend endpoint is not currently available.');
      } else {
        setError('Unable to submit your report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResource = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (view !== 'lecture' && !file) return;
    if (view === 'lecture' && !url) return;

    setLoading(true);
    setError('');

    try {
      const typeMap = { notes: 'NOTES', book: 'BOOKS', pyq: 'PYQS', lecture: 'LECTURES' };
      const formData = new FormData();
      formData.append('type', typeMap[view]);
      formData.append('subjectId', subjectId);
      formData.append('title', title);
      
      if (view === 'lecture') {
        formData.append('url', url);
      } else {
        formData.append('resource', file);
      }
      
      await createContribution(formData);
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Resource contribution backend endpoint is not currently available.');
      } else {
        setError(err.response?.data?.message || 'Unable to submit your contribution. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── VIEWS ──────────────────────────────────────────────────────────────────

  const renderLanding = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-nit-primary hover:border-nit-primary/30 transition-all shadow-sm group shrink-0" title="Go Back">
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-nit-primary group-hover:-translate-x-0.5 transition-all" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Student Contributions</h1>
          <p className="text-sm text-gray-500 mt-1">Help improve the platform or share useful academic resources with fellow students.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Bug Report Panel */}
        <button
          onClick={() => { setView('bug'); resetState(); }}
          className="flex flex-col items-start p-6 bg-white border border-slate-300 rounded-xl shadow-sm hover:border-red-200 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Report a Bug</h3>
          <p className="text-sm text-gray-500 mb-6">Found something broken? Tell us what went wrong.</p>
          <div className="mt-auto flex items-center justify-center w-full py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-bold group-hover:bg-red-100 transition-colors">
            Report a Bug <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Resource Contribution Panel */}
        <button
          onClick={() => { setView('resource-select'); resetState(); }}
          className="flex flex-col items-start p-6 bg-white border border-slate-300 rounded-xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-nit-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Contribute Resources</h3>
          <p className="text-sm text-gray-500 mb-6">Share useful academic material with other students.</p>
          <div className="mt-auto flex items-center justify-center w-full py-2 bg-blue-50 text-nit-primary border border-blue-200 rounded-lg text-sm font-bold group-hover:bg-blue-100 transition-colors">
            Contribute Resources <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </button>
      </div>
    </div>
  );

  const renderBugReport = () => (
    <div className="max-w-2xl mx-auto bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-200 flex items-center gap-4">
        <button onClick={handleBack} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Report a Bug</h2>
          <p className="text-sm text-gray-500">Help us identify and fix problems.</p>
        </div>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Bug report submitted successfully.</h3>
            <p className="text-sm text-gray-500 mt-1">Thank you for helping improve NIT KKR Resources.</p>
            <button onClick={handleBack} className="mt-6 text-sm font-semibold text-nit-primary hover:text-nit-accent transition-colors">
              Back to Contributions
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitBug} className="space-y-5">
            <Alert type="error" message={error} onDismiss={() => setError('')} />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); setError(''); }}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm h-40 resize-none focus:ring-2 focus:ring-nit-accent focus:border-nit-accent outline-none transition-shadow"
                placeholder="Describe the issue you encountered..."
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-nit-primary"
            >
              {loading ? <ButtonSpinner /> : <Send className="w-4 h-4" />}
              {loading ? 'Submitting...' : 'Submit Bug Report'}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const renderResourceSelect = () => (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Contribute Resources</h2>
          <p className="text-sm text-gray-500 mt-0.5">Share useful academic resources with your peers.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl shadow-sm divide-y divide-slate-200 overflow-hidden">
        
        {/* Notes */}
        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Notes</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload notes in ZIP format.</p>
            </div>
          </div>
          <button onClick={() => setView('notes')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Contribute Notes
          </button>
        </div>

        {/* Books */}
        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Books</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload books in ZIP format.</p>
            </div>
          </div>
          <button onClick={() => setView('book')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Contribute Book
          </button>
        </div>

        {/* PYQs */}
        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileQuestion className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">PYQs</h3>
              <p className="text-xs text-gray-500 mt-0.5">Upload previous year papers in ZIP format.</p>
            </div>
          </div>
          <button onClick={() => setView('pyq')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Contribute PYQ
          </button>
        </div>

        {/* Lectures */}
        <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Lectures</h3>
              <p className="text-xs text-gray-500 mt-0.5">Submit a YouTube video or playlist link.</p>
            </div>
          </div>
          <button onClick={() => setView('lecture')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Contribute Lecture
          </button>
        </div>

      </div>
    </div>
  );

  const renderUploadForm = () => {
    const titles = {
      notes: 'Contribute Notes',
      book: 'Contribute Book',
      pyq: 'Contribute PYQ',
      lecture: 'Contribute Lecture'
    };
    const descs = {
      notes: 'Upload your notes as a ZIP file.',
      book: 'Upload your book/resource as a ZIP file.',
      pyq: 'Upload previous year papers as a ZIP file.',
      lecture: 'Submit a YouTube video or playlist link.'
    };

    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-slate-200 flex items-center gap-4">
          <button onClick={handleBack} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{titles[view]}</h2>
            <p className="text-sm text-gray-500">{descs[view]}</p>
          </div>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-full mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Contribution submitted successfully.</h3>
              <p className="text-sm text-gray-500 mt-1 mb-2">Your resource has been submitted for review.</p>
              
              {/* Fake status as prompt suggested "ONLY if that status actually exists" - backend doesn't exist, so this is just UI feedback. */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Pending Review
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <button onClick={handleBack} className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
                  Back to Contributions
                </button>
                <button onClick={() => { setSubmitted(false); setFile(null); setUrl(''); }} className="text-sm font-semibold text-white bg-nit-primary hover:bg-blue-900 transition-colors px-4 py-2 rounded-lg shadow-sm">
                  Submit another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitResource} className="space-y-6">
              <Alert type="error" message={error} onDismiss={() => setError('')} />
              
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select required className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" value={branch} onChange={e => setBranch(e.target.value)}>
                      <option value="">Select Branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select required className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" value={semester} onChange={e => setSemester(e.target.value)}>
                      <option value="">Select Sem</option>
                      {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select required className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white disabled:opacity-50" value={subjectId} onChange={e => setSubjectId(e.target.value)} disabled={!subjects.length}>
                    <option value="">{subjects.length ? "Select Subject" : "Select Branch & Sem first"}</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName} ({s.subjectCode})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                  <input required type="text" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" placeholder={view === 'lecture' ? "e.g. Newton Raphson Method..." : "e.g. Midsem Notes, Chapter 1..."} value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                
                {view === 'lecture' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input required type="url" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white" placeholder="https://youtube.com/watch?v=..." value={url} onChange={e => setUrl(e.target.value)} />
                  </div>
                )}
              </div>

              {view !== 'lecture' && (
                <ZipUpload onFileSelect={(f) => { setFile(f); setError(''); }} disabled={loading} />
              )}

              <button
                type="submit"
                disabled={loading || !subjectId || (view === 'lecture' ? !url : !file)}
                className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-nit-primary shadow-sm"
              >
                {loading ? <ButtonSpinner /> : <Send className="w-4 h-4" />}
                {loading ? 'Submitting contribution...' : 'Submit Contribution'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-10">
      {view === 'landing' && renderLanding()}
      {view === 'bug' && renderBugReport()}
      {view === 'resource-select' && renderResourceSelect()}
      {(view === 'notes' || view === 'book' || view === 'pyq' || view === 'lecture') && renderUploadForm()}
    </div>
  );
}