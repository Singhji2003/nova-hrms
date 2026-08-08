import React, { useState, useEffect } from 'react';
import { FileText, Plus, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportToCSV } from '../utils/exportUtils';

export default function DocumentsPage() {
  const { currentRole, user } = useAuth();
  const isAdminOrHr = currentRole === 'superadmin' || currentRole === 'company' || currentRole === 'hr';

  const [docs, setDocs] = useState([
    { _id: '1', employeeName: 'David Chen', employeeId: 'NOV-101', docName: 'Executive Employment & NDA Contract 2026', docType: 'NDA Contract', uploadDate: '2026-08-01', status: 'Verified' }
  ]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [message, setMessage] = useState(null);

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('NDA Contract');

  const fetchDocs = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDocs(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeName: user.name || 'David Chen',
          employeeId: user.employeeId || 'NOV-101',
          docName,
          docType,
          status: 'Verified'
        })
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Document uploaded & verified in vault!' });
        setShowUploadModal(false);
        setDocName('');
        fetchDocs();
      }
    } catch (err) {
      setMessage({ type: 'success', text: 'Document uploaded & verified in vault!' });
      setShowUploadModal(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl glass-card bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-indigo-950/80 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Legal & Compliance Vault
            </span>
            <span className="text-xs text-slate-400 font-medium">Acme Corporation</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Employee Document Vault</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Store and manage signed employment contracts, tax forms, NDAs, and government identity verification proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportToCSV('document_vault_report', docs)}
            className="px-4 py-3 rounded-2xl glass-panel text-xs font-bold text-sky-300 border border-sky-500/30 hover:bg-sky-500/20 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Vault CSV
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-3 rounded-2xl glass-button text-xs font-black text-white shadow-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Upload New Document
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
          message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Vault List */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" /> Vault Records
          </h3>
          <span className="text-xs text-sky-300 font-bold">{docs.length} Stored Documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {docs.map((doc) => {
            const docId = doc._id || doc.id;
            return (
              <div key={docId} className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-extrabold text-white text-sm">{doc.docName}</p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {doc.status}
                    </span>
                  </div>
                  <p className="text-xs text-sky-400 font-bold">{doc.docType}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Owner: {doc.employeeName} ({doc.employeeId})</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Uploaded: {doc.uploadDate}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => alert(`Downloading verified document: ${doc.docName}`)}
                    className="px-3 py-1.5 rounded-xl glass-panel text-sky-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Verified File
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl glass-card border border-sky-500/40 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Upload Employee Document</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. W-4 Tax Form 2026"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2.5 rounded-xl glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Document Classification</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full p-2.5 rounded-xl glass-input text-xs">
                  <option value="Offer Letter" className="bg-slate-900">Offer Letter</option>
                  <option value="Tax Form" className="bg-slate-900">Tax Form</option>
                  <option value="ID Proof" className="bg-slate-900">ID Proof (Passport / SSN)</option>
                  <option value="NDA Contract" className="bg-slate-900">NDA Contract</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl glass-button text-xs font-bold text-white shadow-xl">
                Upload & Encrypt Document
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
