import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, AlertOctagon, RefreshCw } from 'lucide-react';
import Dropzone from './components/Dropzone';
import QualitySlider from './components/QualitySlider';
import ResultCard from './components/ResultCard';
import { compressPdf, checkBackendHealth } from './services/api';
import { CompressionResult, ProcessingStatus } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(60);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendReady, setBackendReady] = useState<boolean>(false);
  const [checkingBackend, setCheckingBackend] = useState<boolean>(false);

  const verifyBackend = async () => {
    setCheckingBackend(true);
    const isHealthy = await checkBackendHealth();
    setBackendReady(isHealthy);
    setCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStatus(ProcessingStatus.IDLE);
  };

  const handleCompress = async () => {
    if (!file) return;

    setStatus(ProcessingStatus.UPLOADING);
    setProgress(0);
    setError(null);

    try {
      const resultData = await compressPdf(file, { quality }, (percent) => {
        // Only track upload progress up to 50%, rest is processing
        setProgress(Math.round(percent * 0.5));
      });
      
      // Simulate processing progress (backend doesn't send socket updates in this simple version)
      setStatus(ProcessingStatus.COMPRESSING);
      let fakeProgress = 50;
      const interval = setInterval(() => {
        fakeProgress += 5;
        if (fakeProgress > 95) clearInterval(interval);
        setProgress(Math.min(fakeProgress, 99));
      }, 200);

      // Once we have the result, we are done
      clearInterval(interval);
      setProgress(100);
      setResult(resultData);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message);
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const resetApp = () => {
    setFile(null);
    setResult(null);
    setStatus(ProcessingStatus.IDLE);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              OptiPDF
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${backendReady ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
            <span className="text-slate-500">
              {backendReady ? 'System Operational' : 'Backend Offline'}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!backendReady && (
           <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
             <div className="flex items-start gap-3">
               <AlertOctagon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
               <div>
                 <h3 className="font-semibold text-amber-800">Backend Connection Required</h3>
                 <p className="text-sm text-amber-700 mt-1">
                   The Python backend server is not detected at <code>http://localhost:8000</code>. 
                   Please start the server using <code>python backend_main.py</code>.
                 </p>
               </div>
             </div>
             <button 
               onClick={verifyBackend}
               disabled={checkingBackend}
               className="flex items-center space-x-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
             >
               <RefreshCw className={`w-4 h-4 ${checkingBackend ? 'animate-spin' : ''}`} />
               <span>{checkingBackend ? 'Checking...' : 'Retry Connection'}</span>
             </button>
           </div>
        )}

        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Compress PDF Files Online
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Reduce PDF file size securely without losing quality. Your documents are processed privately and deleted automatically.
          </p>
        </div>

        {!result ? (
          <div className="grid gap-8 animate-fadeIn">
            
            {/* Step 1: Upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
               <div className="mb-6 flex items-center space-x-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                 <h2 className="text-xl font-semibold">Upload Document</h2>
               </div>
               
               {!file ? (
                 <Dropzone onFileSelect={handleFileSelect} disabled={!backendReady} />
               ) : (
                 <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                   <div className="flex items-center space-x-3 overflow-hidden">
                     <div className="p-2 bg-indigo-200 rounded-lg">
                       <ShieldCheck className="w-6 h-6 text-indigo-700" />
                     </div>
                     <div className="truncate">
                       <p className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                       <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                   </div>
                   <button 
                    onClick={() => setFile(null)}
                    className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1"
                   >
                     Remove
                   </button>
                 </div>
               )}
            </div>

            {/* Step 2: Settings */}
            <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-opacity ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
               <div className="mb-6 flex items-center space-x-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                 <h2 className="text-xl font-semibold">Compression Settings</h2>
               </div>
               <QualitySlider quality={quality} setQuality={setQuality} />
            </div>

            {/* Action Button */}
            <div className={`flex flex-col items-center space-y-4 ${!file ? 'opacity-50 pointer-events-none' : ''}`}>
              <button
                onClick={handleCompress}
                disabled={status === ProcessingStatus.UPLOADING || status === ProcessingStatus.COMPRESSING}
                className={`
                  w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1
                  ${status === ProcessingStatus.UPLOADING || status === ProcessingStatus.COMPRESSING
                    ? 'bg-slate-100 text-slate-400 cursor-wait shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }
                `}
              >
                {status === ProcessingStatus.UPLOADING && `Uploading... ${progress}%`}
                {status === ProcessingStatus.COMPRESSING && `Optimizing Images... ${progress}%`}
                {status === ProcessingStatus.IDLE && 'Compress PDF Now'}
                {status === ProcessingStatus.ERROR && 'Try Again'}
              </button>
              
              {status === ProcessingStatus.COMPRESSING && (
                <div className="w-full max-w-md h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium">
                  Error: {error}
                </div>
              )}
            </div>

          </div>
        ) : (
          <ResultCard result={result} onReset={resetApp} />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto text-center text-slate-400 text-sm mt-12 px-6">
        <p>© {new Date().getFullYear()} OptiPDF. Files are automatically deleted from the server after 1 hour.</p>
      </footer>
    </div>
  );
};

export default App;