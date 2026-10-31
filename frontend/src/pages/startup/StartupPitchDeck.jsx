import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { pitchDeckApi, startupApi } from '../../api/client';
import { 
  FileText, 
  UploadCloud, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  Trash2,
  Clock,
  Shield,
  Layers
} from 'lucide-react';

const StartupPitchDeck = () => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [deck, setDeck] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fetchDeckInfo = async () => {
    if (!user?.userId) return;
    try {
      const res = await pitchDeckApi.getInfo(user.userId);
      setDeck(res.data);
    } catch (err) {
      // 404 or no deck uploaded yet
      setDeck(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeckInfo();
  }, [user?.userId]);

  const validateFile = (file) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'ppt', 'pptx'].includes(ext)) {
      setErrorMsg('Invalid format. Only PDF, PPT, and PPTX files are supported.');
      return false;
    }
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setErrorMsg('File size exceeds the 50MB limit.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.userId) return;
    setUploading(true);
    setUploadProgress(0);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await pitchDeckApi.upload(
        user.userId,
        formData,
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      setDeck(res.data);
      setSelectedFile(null);
      setSuccessMsg('Pitch deck uploaded successfully! Investors can now inspect your presentation.');
      
      // Refresh current startup profile in context
      const startupRes = await startupApi.getById(user.userId);
      updateProfile(startupRes.data);

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please ensure file is valid.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading pitch deck status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Pitch Deck Vault
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload and manage your investor presentation deck. Supported formats include PDF, PPT, and PPTX up to 50MB.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-sm text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-sm text-rose-300 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Existing Pitch Deck Card */}
      {deck && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 to-indigo-950/20 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Active Pitch Deck Attached
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Uploaded {new Date(deck.uploadedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{deck.originalFileName}</h4>
                <p className="text-xs text-slate-400">
                  Size: {formatFileSize(deck.fileSize)} • Type: {deck.fileType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={pitchDeckApi.getDownloadUrl(user.userId)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download</span>
              </a>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Deck</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div className="p-8 rounded-3xl bg-[#120b2e]/90 border border-purple-500/20 backdrop-blur-xl shadow-card space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-purple-400" />
          <span>{deck ? 'Replace Existing Pitch Deck' : 'Upload New Pitch Deck'}</span>
        </h3>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-purple-400 bg-purple-600/10 scale-[1.01]'
              : 'border-purple-500/30 hover:border-purple-400/60 bg-[#0d0724]/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h4 className="text-base font-bold text-white mb-1">
            {selectedFile ? selectedFile.name : 'Choose a file or drag & drop here'}
          </h4>

          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-3">
            {selectedFile
              ? `Ready to upload: ${formatFileSize(selectedFile.size)}`
              : 'Accepts PDF, PPT, or PPTX presentation decks up to 50 MB'}
          </p>

          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-purple-300">
            Browse Computer
          </span>
        </div>

        {/* Upload Progress Indicator */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Uploading Pitch Deck...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {selectedFile && !uploading && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Selected: <strong className="text-white">{selectedFile.name}</strong> ({formatFileSize(selectedFile.size)})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleUpload}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all"
              >
                Start Upload
              </button>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            Storage security: All uploaded files are stored safely on the host server filesystem and streamed with authentication headers.
          </span>
        </div>

      </div>

    </div>
  );
};

export default StartupPitchDeck;
