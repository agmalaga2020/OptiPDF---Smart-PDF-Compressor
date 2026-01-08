import React from 'react';
import { Download, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { CompressionResult } from '../types';

interface ResultCardProps {
  result: CompressionResult;
  onReset: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const reduction = ((result.originalSize - result.compressedSize) / result.originalSize) * 100;
  const isReductionPositive = reduction > 0;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header Statistics */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{result.fileName}</h3>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  Compression Successful
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="text-slate-500">
                <p className="text-xs uppercase tracking-wider font-semibold">Original</p>
                <p className="font-mono text-lg">{formatBytes(result.originalSize)}</p>
              </div>
              <ArrowRight className="text-slate-300 w-5 h-5" />
              <div className="text-indigo-600">
                <p className="text-xs uppercase tracking-wider font-semibold">Compressed</p>
                <p className="font-mono text-lg font-bold">{formatBytes(result.compressedSize)}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg ${isReductionPositive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                <span className="font-bold">{isReductionPositive ? `-${reduction.toFixed(1)}%` : '0%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Iframe */}
        <div className="w-full h-[500px] bg-slate-200">
          <iframe 
            src={`${result.downloadUrl}#toolbar=0&view=FitH`} 
            className="w-full h-full border-0" 
            title="PDF Preview"
          />
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Compress Another</span>
          </button>
          
          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto font-medium"
          >
            <Download className="w-5 h-5" />
            <span>Download Compressed PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;