import React from 'react';

interface QualitySliderProps {
  quality: number;
  setQuality: (value: number) => void;
  disabled?: boolean;
}

const QualitySlider: React.FC<QualitySliderProps> = ({ quality, setQuality, disabled }) => {
  const getQualityLabel = (q: number) => {
    if (q >= 80) return 'Low Compression (Best Quality)';
    if (q >= 50) return 'Balanced';
    return 'High Compression (Smallest Size)';
  };

  const getColor = (q: number) => {
    if (q >= 80) return 'text-green-600';
    if (q >= 50) return 'text-indigo-600';
    return 'text-amber-600';
  };

  return (
    <div className="w-full space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-end">
        <div>
          <label htmlFor="quality-range" className="block text-sm font-semibold text-slate-700 mb-1">
            Compression Level
          </label>
          <p className="text-xs text-slate-500">Adjust the trade-off between file size and image quality.</p>
        </div>
        <div className={`text-right ${getColor(quality)}`}>
          <span className="text-2xl font-bold">{quality}%</span>
        </div>
      </div>

      <input
        id="quality-range"
        type="range"
        min="10"
        max="90"
        step="5"
        value={quality}
        onChange={(e) => setQuality(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
      />

      <div className="flex justify-between text-xs font-medium text-slate-400">
        <span>Max Compression</span>
        <span className={getColor(quality)}>{getQualityLabel(quality)}</span>
        <span>Best Quality</span>
      </div>
    </div>
  );
};

export default QualitySlider;