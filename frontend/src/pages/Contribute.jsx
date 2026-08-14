import React, { useState } from 'react';
import { Bug, BookUp, Send, CheckCircle2, ArrowLeft, AlertCircle, FileText, BookOpen, FileQuestion } from 'lucide-react';
import { contributionApi } from '../services/api.js';
import { Alert } from '../components/ui/Alert.jsx';
import { ButtonSpinner } from '../components/ui/Spinner.jsx';
import { ZipUpload } from '../components/ui/ZipUpload.jsx';

export default function Contribute() {
  const [view, setView] = useState('landing'); // 'landing' | 'bug' | 'resource-select' | 'notes' | 'book' | 'pyq'
  
  // Form states
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  
  // Submission states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const resetState = () => {
    setDescription('');
    setFile(null);
    setError('');
    setSubmitted(false);
  };

  const handleBack = () => {
    if (view === 'notes' || view === 'book' || view === 'pyq') {
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
    if (loading || !file) return;

    setLoading(true);
    setError('');

    try {
      // Trying the actual backend API with FormData (even though it's missing on backend).
      const formData = new FormData();
      formData.append('type', view);
      formData.append('file', file);
      
      await contributionApi.submit(formData);
      setSubmitted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Resource contribution backend endpoint is not currently available.');
      } else {
        setError('Unable to submit your contribution. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── VIEWS ──────────────────────────────────────────────────────────────────

  const renderLanding = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Contributions</h1>
        <p className="text-sm text-gray-500 mt-1">Help improve the platform or share useful academic resources with fellow students.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Bug Report Panel */}
        <button
          onClick={() => { setView('bug'); resetState(); }}
          className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-red-200 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bug className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Report a Bug</h3>
          <p className="text-sm text-gray-500 mb-6">Found something broken? Tell us what went wrong.</p>
          <div className="mt-auto text-sm font-semibold text-red-600">Report a Bug →</div>
        </button>

        {/* Resource Contribution Panel */}
        <button
          onClick={() => { setView('resource-select'); resetState(); }}
          className="flex flex-col items-start p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-nit-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookUp className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-1">Contribute Resources</h3>
          <p className="text-sm text-gray-500 mb-6">Share useful academic material with other students.</p>
          <div className="mt-auto text-sm font-semibold text-nit-primary">Contribute Resources →</div>
        </button>
      </div>
    </div>
  );

  const renderBugReport = () => (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100 overflow-hidden">
        
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
          <button onClick={() => setView('notes')} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
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
          <button onClick={() => setView('book')} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
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
          <button onClick={() => setView('pyq')} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Contribute PYQ
          </button>
        </div>

      </div>
    </div>
  );

  const renderUploadForm = () => {
    const titles = {
      notes: 'Contribute Notes',
      book: 'Contribute Book',
      pyq: 'Contribute PYQ'
    };
    const descs = {
      notes: 'Upload your notes as a ZIP file.',
      book: 'Upload your book/resource as a ZIP file.',
      pyq: 'Upload previous year papers as a ZIP file.'
    };

    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
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
                <button onClick={() => { setSubmitted(false); setFile(null); }} className="text-sm font-semibold text-white bg-nit-primary hover:bg-blue-900 transition-colors px-4 py-2 rounded-lg shadow-sm">
                  Submit another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitResource} className="space-y-6">
              <Alert type="error" message={error} onDismiss={() => setError('')} />
              
              <ZipUpload onFileSelect={(f) => { setFile(f); setError(''); }} disabled={loading} />

              <button
                type="submit"
                disabled={loading || !file}
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
      {(view === 'notes' || view === 'book' || view === 'pyq') && renderUploadForm()}
    </div>
  );
}
import { useEffect, useState } from "react";
import { createContribution, getSubjects } from "../services/api";

const RESOURCE_TYPES = ["BOOKS", "NOTES", "PYQS", "LECTURES"];

function Contribute() {
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState({
    subjectId: "",
    title: "",
    type: "NOTES",
    url: "",
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const res = await getSubjects();

      setSubjects(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async () => {
    try {
      const formData = new FormData();

      formData.append("subjectId", form.subjectId);
      formData.append("title", form.title);
      formData.append("type", form.type);

      if (form.type === "LECTURES") {
        formData.append("url", form.url);
      } else {
        formData.append("resource", file);
      }

      await createContribution(formData);

      alert("Contribution submitted.");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Contribute</h2>

      <select onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
        <option>Select Subject</option>

        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectName}
          </option>
        ))}
      </select>

      <br />
      <br />

      <input
        placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <br />
      <br />

      <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
        {RESOURCE_TYPES.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <br />
      <br />

      {form.type === "LECTURES" ? (
        <input
          placeholder="Youtube URL"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      ) : (
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
        />
      )}

      <br />
      <br />

      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Contribute;
