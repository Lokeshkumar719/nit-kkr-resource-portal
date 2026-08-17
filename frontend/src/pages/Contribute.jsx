import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bug, BookUp, Send, CheckCircle2, ArrowLeft, ArrowRight, AlertCircle, FileText, BookOpen, FileQuestion, Video } from 'lucide-react';
import { contributionApi, createContribution, resourceApi } from '../services/api.js';
import { BRANCHES, BRANCH_LABELS, SEMESTERS } from '../constants/index.js';
import { Alert } from '../components/ui/Alert.jsx';
import { ButtonSpinner } from '../components/ui/Spinner.jsx';
import { ZipUpload } from '../components/ui/ZipUpload.jsx';
import { CustomSelect } from '../components/ui/CustomSelect.jsx';
import { parseRateLimitError } from '../utils/rateLimitUtils.js';
import { useRateLimitCountdown } from '../hooks/useRateLimitCountdown.js';

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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contributionRateLimit = useRateLimitCountdown('contribution');

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
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        contributionRateLimit.triggerRateLimit(retryAfterSeconds);
      } else if (err.response?.status === 404) {
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
      const { isRateLimited, retryAfterSeconds } = parseRateLimitError(err);
      if (isRateLimited) {
        contributionRateLimit.triggerRateLimit(retryAfterSeconds);
      } else if (err.response?.status === 404) {
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

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Bug Report Panel */}
        <div
          onClick={() => { setView('bug'); resetState(); }}
          className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-4 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm group-hover:scale-110">
              <Bug className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-nit-primary transition-colors">Report a Bug</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Found something broken? Tell us what went wrong so we can fix it.</p>

            <div className="mt-auto flex items-center justify-center w-full py-2.5 bg-white text-nit-primary border border-slate-200 rounded-xl text-sm font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
              Report a Bug <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Resource Contribution Panel */}
        <div
          onClick={() => { setView('resource-select'); resetState(); }}
          className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
        >
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-4 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm group-hover:scale-110">
              <BookUp className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-nit-primary transition-colors">Contribute Resources</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Share notes, books, PYQs, and lecture links to help fellow students.</p>

            <div className="mt-auto flex items-center justify-center w-full py-2.5 bg-white text-nit-primary border border-slate-200 rounded-xl text-sm font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
              Contribute Resources <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
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
            <p className="text-sm text-gray-500 mt-1">Thank you for helping improve NIT KKR Resource Portal.</p>
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
              disabled={loading || !description.trim() || contributionRateLimit.isRateLimited}
              className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-nit-primary"
            >
              {loading ? <ButtonSpinner /> : (!contributionRateLimit.isRateLimited && <Send className="w-4 h-4" />)}
              {loading ? 'Submitting...' : (contributionRateLimit.isRateLimited ? `Submit Again in ${contributionRateLimit.formattedCountdown}` : 'Submit Bug Report')}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const renderResourceSelect = () => (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Contribute Resources</h2>
          <p className="text-sm text-gray-500 mt-0.5">Select the resource category you'd like to share with fellow students.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        
        {/* Notes Card */}
<div
  onClick={() => setView('notes')}
  className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
>
  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
  <div className="p-5 flex-1 flex flex-col">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-3 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm">
      <FileText className="w-5 h-5" />
    </div>
    <h3 className="text-base font-bold text-slate-800 group-hover:text-nit-primary transition-colors">
      Notes
    </h3>
    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
      Upload subject notes in ZIP format for semester study.
    </p>
    <div className="mt-auto flex items-center justify-center w-full py-2 bg-white text-nit-primary border border-slate-200 rounded-xl text-xs font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
      Contribute Notes
      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
</div>

{/* Books Card */}
<div
  onClick={() => setView('book')}
  className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
>
  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
  <div className="p-5 flex-1 flex flex-col">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-3 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm">
      <BookOpen className="w-5 h-5" />
    </div>
    <h3 className="text-base font-bold text-slate-800 group-hover:text-nit-primary transition-colors">
      Books
    </h3>
    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
      Upload academic books or reference material in ZIP format.
    </p>
    <div className="mt-auto flex items-center justify-center w-full py-2 bg-white text-nit-primary border border-slate-200 rounded-xl text-xs font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
      Contribute Book
      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
</div>

{/* PYQs Card */}
<div
  onClick={() => setView('pyq')}
  className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
>
  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
  <div className="p-5 flex-1 flex flex-col">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-3 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm">
      <FileQuestion className="w-5 h-5" />
    </div>
    <h3 className="text-base font-bold text-slate-800 group-hover:text-nit-primary transition-colors">
      PYQs
    </h3>
    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
      Upload previous year exam question papers in ZIP format.
    </p>
    <div className="mt-auto flex items-center justify-center w-full py-2 bg-white text-nit-primary border border-slate-200 rounded-xl text-xs font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
      Contribute PYQ
      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
</div>

{/* Lectures Card */}
<div
  onClick={() => setView('lecture')}
  className="group cursor-pointer bg-slate-50/50 hover:bg-slate-100/60 border border-slate-200 hover:border-nit-primary/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
>
  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-nit-primary to-nit-accent opacity-80 group-hover:opacity-100 transition-opacity" />
  <div className="p-5 flex-1 flex flex-col">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-nit-primary flex items-center justify-center mb-3 group-hover:bg-nit-primary group-hover:text-white transition-all shadow-sm">
      <Video className="w-5 h-5" />
    </div>
    <h3 className="text-base font-bold text-slate-800 group-hover:text-nit-primary transition-colors">
      Lectures
    </h3>
    <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
      Share YouTube video or playlist links for course topics.
    </p>
    <div className="mt-auto flex items-center justify-center w-full py-2 bg-white text-nit-primary border border-slate-200 rounded-xl text-xs font-semibold group-hover:bg-nit-primary group-hover:text-white group-hover:border-nit-primary transition-all shadow-sm">
      Contribute Lecture
      <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
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
                    <CustomSelect
                      value={branch}
                      onChange={setBranch}
                      options={BRANCHES.map(b => ({ value: b, label: BRANCH_LABELS[b] }))}
                      placeholder="Select Branch"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <CustomSelect
                      value={semester}
                      onChange={(val) => setSemester(Number(val))}
                      options={SEMESTERS.map(s => ({ value: s, label: `Semester ${s}` }))}
                      placeholder="Select Semester"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <CustomSelect
                    value={subjectId}
                    onChange={setSubjectId}
                    options={subjects.map(s => ({ value: s._id, label: `${s.subjectName} (${s.subjectCode})` }))}
                    placeholder={subjects.length ? "Select Subject" : "Select Branch & Sem first"}
                  />
                  {subjects.length === 0 && branch && semester && (
                    <p className="text-xs text-amber-600 mt-1">No subjects found for this branch and semester.</p>
                  )}
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
                disabled={loading || !subjectId || (view === 'lecture' ? !url : !file) || contributionRateLimit.isRateLimited}
                className="w-full bg-nit-primary text-white py-2.5 rounded-lg font-medium hover:bg-blue-900 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:bg-nit-primary shadow-sm"
              >
                {loading ? <ButtonSpinner /> : (!contributionRateLimit.isRateLimited && <Send className="w-4 h-4" />)}
                {loading ? 'Submitting contribution...' : (contributionRateLimit.isRateLimited ? `Contribute Again in ${contributionRateLimit.formattedCountdown}` : 'Submit Contribution')}
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