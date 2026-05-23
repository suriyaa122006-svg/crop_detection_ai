import React from 'react';
import { Calendar, Download, Trash2, ShieldCheck, AlertTriangle, CheckCircle2, Flame, Layers, Sparkles, Target, Activity, Eye } from 'lucide-react';
import { CropReport, RiskLevel } from '../types';

interface CropReportCardProps {
  report: CropReport;
  isDarkMode: boolean;
  labels?: {
    riskHigh: string;
    riskModerate: string;
    riskLow: string;
    riskHealthy: string;
    capturedOn: string;
    bioDiagnostic: string;
    damageSeverity: string;
    aiValidationConfidence: string;
    urgentAction: string;
    monitorMessage: string;
    stableMessage: string;
    modelValidationActive: string;
    detailedDiagnosticFile: string;
    pdfExport: string;
    deleteReportAria: string;
  };
  onViewReport: (report: CropReport) => void;
  onDownloadPDF: (report: CropReport) => void;
  onDeleteReport: (id: string) => void;
}

const getRiskStyles = (risk: RiskLevel, isDarkMode: boolean, labels: CropReportCardProps['labels']) => {
  switch (risk) {
    case 'high':
      return {
        badge: isDarkMode
          ? 'bg-red-950/40 text-red-300 border-red-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(239,68,68,0.15)]'
          : 'bg-red-100/90 text-red-800 border-red-300 shadow-sm',
        label: labels?.riskHigh || 'Critical Priority',
        dot: 'bg-red-500 shadow-[0_0_10px_rgb(239,68,68)]',
      };
    case 'moderate':
      return {
        badge: isDarkMode
          ? 'bg-amber-950/40 text-amber-300 border-amber-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(245,158,11,0.15)]'
          : 'bg-amber-100/90 text-amber-800 border-amber-300 shadow-sm',
        label: labels?.riskModerate || 'Warning / Monitor',
        dot: 'bg-amber-500 shadow-[0_0_10px_rgb(245,158,11)]',
      };
    case 'low':
      return {
        badge: isDarkMode
          ? 'bg-blue-950/40 text-blue-300 border-blue-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(59,130,246,0.15)]'
          : 'bg-blue-100/90 text-blue-800 border-blue-300 shadow-sm',
        label: labels?.riskLow || 'Low Severity',
        dot: 'bg-blue-500 shadow-[0_0_10px_rgb(59,130,246)]',
      };
    case 'healthy':
    default:
      return {
        badge: isDarkMode
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 backdrop-blur-md shadow-[0_0_12px_rgba(16,185,129,0.15)]'
          : 'bg-emerald-100/90 text-emerald-800 border-emerald-300 shadow-sm',
        label: labels?.riskHealthy || 'Healthy / Active',
        dot: 'bg-emerald-500 shadow-[0_0_10px_rgb(16,185,129)]',
      };
  }
};

const getCropGradient = (code: string) => {
  switch (code) {
    case 'TO': return 'from-red-500 to-rose-600';
    case 'CO': return 'from-amber-400 to-orange-500';
    case 'WH': return 'from-yellow-400 to-amber-600';
    case 'PO': return 'from-orange-400 to-red-600';
    default: return 'from-emerald-400 to-teal-600';
  }
};

export const CropReportCard: React.FC<CropReportCardProps> = ({
  report,
  isDarkMode,
  labels,
  onViewReport,
  onDownloadPDF,
  onDeleteReport,
}) => {
  const risk = getRiskStyles(report.riskLevel, isDarkMode, labels);
  const cropGrad = getCropGradient(report.cropCode);
  const avatarFallback = report.cropName.slice(0, 2).toUpperCase();

  return (
    <div
      id={`crop-card-${report.id}`}
      className={`w-full h-full min-h-[380px] rounded-[2rem] overflow-hidden border transition-all duration-700 backdrop-blur-3xl group relative flex flex-col ${isDarkMode
        ? 'bg-neutral-950/45 border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.8)] hover:border-white/20'
        : 'bg-white/55 border-neutral-350/50 shadow-[0_32px_64px_rgba(31,38,135,0.06),_0_12px_32px_rgba(0,0,0,0.02)] hover:border-neutral-400/60'
        }`}
    >
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-red-500/10 to-transparent rounded-full blur-3xl opacity-35 pointer-events-none`} />

      <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-7 gap-4 border-b transition-all duration-300 relative z-10 flex-shrink-0 ${isDarkMode
        ? 'bg-zinc-900/80 border-white/5 backdrop-blur-md'
        : 'bg-neutral-100/90 hover:bg-neutral-150/90 border-neutral-250/70 backdrop-blur-md'
        }`}>
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative h-16 w-16 shrink-0">
            {report.cropImage ? (
              <img
                src={report.cropImage}
                alt={report.cropName}
                className={`h-16 w-16 rounded-2xl object-cover border shadow-md ${isDarkMode ? 'border-white/15 bg-black/60' : 'border-neutral-300/80 bg-white'}`}
              />
            ) : (
              <div
                className={`h-16 w-16 rounded-2xl flex items-center justify-center font-mono font-extrabold text-xl tracking-wider border relative shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-md ${isDarkMode
                  ? 'bg-black/60 border-white/15 text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)]'
                  : 'bg-white border-neutral-300/80 text-neutral-900 shadow-[0_6px_15px_rgba(0,0,0,0.04)]'
                  }`}
              >
                <span className={`bg-gradient-to-br ${cropGrad} bg-clip-text text-transparent font-black`}>
                  {avatarFallback}
                </span>
              </div>
            )}

            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${risk.dot}`} />
              <span className={`relative inline-flex rounded-full h-4 w-4 ${risk.dot}`} />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className={`font-display text-2xl font-black tracking-tight transition-colors duration-300 truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {report.cropName}
              </h3>
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse hidden md:block shrink-0" />
            </div>

            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-550'}`}>
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <span>{labels?.capturedOn || 'Captured'} {report.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center sm:self-center self-start">
          <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase border font-display transition-all duration-300 ${risk.badge}`}>
            {report.riskLevel === 'high' && <Flame className="w-4 h-4 animate-bounce" />}
            {report.riskLevel === 'moderate' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {report.riskLevel === 'low' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
            {report.riskLevel === 'healthy' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {risk.label}
          </span>
        </div>
      </div>

      <div className={`p-7 grid grid-cols-1 md:grid-cols-3 gap-5 transition-colors duration-300 relative z-10 flex-1 ${isDarkMode ? 'bg-[#000000]/15' : 'bg-neutral-50/40'}`}>
        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkMode
          ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          : 'bg-white hover:bg-neutral-50/80 border-neutral-250/70 shadow-[0_4px_12px_rgba(0,0,0,0.01)]'
          }`}>
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <span className={`text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-500' : 'text-neutral-500'}`}>
              <Activity className="w-3.5 h-3.5 text-rose-500" />
              <span>{labels?.bioDiagnostic || 'Bio-Spectrum Diagnostic'}</span>
            </span>
          </div>

          <div className="space-y-1.5 flex-1 flex flex-col justify-center min-h-0">
            <h4 className={`font-display text-xl font-black leading-snug tracking-tight transition-colors duration-300 line-clamp-2 ${isDarkMode ? 'text-rose-300' : 'text-rose-950'}`}>
              {report.disease}
            </h4>
            <p className={`text-xs font-semibold leading-relaxed transition-colors duration-300 line-clamp-2 ${isDarkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
              {report.recommendation}
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkMode
          ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          : 'bg-white hover:bg-neutral-50/80 border-neutral-250/70 shadow-[0_4px_12px_rgba(0,0,0,0.01)]'
          }`}>
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <span className={`text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-500' : 'text-neutral-500'}`}>
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{labels?.damageSeverity || 'Damage Severity'}</span>
            </span>
            <span className={`text-sm font-mono font-black ${report.damage > 50 ? 'text-red-500' : report.damage > 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {report.damage}%
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((step) => {
                const threshold = step * 20;
                const isActive = report.damage >= threshold - 10;
                let stepColor = 'bg-neutral-200';

                if (isActive) {
                  stepColor = report.damage > 50
                    ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                    : report.damage > 20
                      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                      : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
                } else if (isDarkMode) {
                  stepColor = 'bg-zinc-800/60';
                }

                return (
                  <div
                    key={step}
                    className={`h-3 flex-1 rounded-md transition-all duration-500 ${stepColor}`}
                    title={`Severity threshold ${threshold}%`}
                  />
                );
              })}
            </div>

            <p className={`text-xs font-semibold transition-colors duration-300 ${isDarkMode ? 'text-zinc-400' : 'text-neutral-600'}`}>
              {report.damage > 50 ? (labels?.urgentAction || 'Urgent threat: direct action required') : report.damage > 20 ? (labels?.monitorMessage || 'Persistent layout: observe closely') : (labels?.stableMessage || 'Subcritical status: stable')}
            </p>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-300 hover:translate-y-[-2px] ${isDarkMode
          ? 'bg-white/[0.02] hover:bg-white/[0.04] border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          : 'bg-white hover:bg-neutral-50/80 border-neutral-250/70 shadow-[0_4px_12px_rgba(0,0,0,0.01)]'
          }`}>
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
            <span className={`text-[10px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 ${isDarkMode ? 'text-zinc-500' : 'text-neutral-500'}`}>
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>{labels?.aiValidationConfidence || 'AI Validation Confidence'}</span>
            </span>
            <span className="text-sm font-mono font-black text-indigo-500">
              {report.confidence}%
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <div className={`w-full h-2 rounded-full overflow-hidden transition-all duration-350 ${isDarkMode ? 'bg-black/50 border border-white/5' : 'bg-neutral-200/50'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all duration-700"
                style={{ width: `${report.confidence}%` }}
              />
            </div>

            <p className={`text-xs font-semibold h-4 transition-colors duration-300 flex items-center gap-1.5 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-850'}`}>
              <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{labels?.modelValidationActive || 'Diagnostic model validation is active'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-between p-5 px-7 gap-4 transition-all duration-300 relative z-10 mt-auto flex-shrink-0 ${isDarkMode ? 'bg-black/45 border-t border-white/5' : 'bg-[#fafbfc]/90 border-t border-neutral-250/50'}`}>
        <button
          id={`view-report-btn-${report.id}`}
          onClick={() => onViewReport(report)}
          className={`inline-flex items-center gap-2.5 text-sm font-extrabold tracking-wide transition-all duration-300 cursor-pointer group focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl py-2 px-3.5 -ml-2.5 ${isDarkMode
            ? 'text-neutral-200 hover:text-white hover:bg-white/5'
            : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100/70'
            }`}
        >
          <Eye className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-110 text-emerald-500" />
          <span>{labels?.detailedDiagnosticFile || 'Detailed Diagnostic File'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id={`download-pdf-btn-${report.id}`}
            onClick={() => onDownloadPDF(report)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 border cursor-pointer active:scale-95 shadow-sm ${isDarkMode
              ? 'bg-neutral-900 border-white/10 hover:bg-white/10 text-neutral-100'
              : 'bg-white border-neutral-300/80 hover:bg-neutral-50 text-neutral-800'
              }`}
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>{labels?.pdfExport || 'PDF Export'}</span>
          </button>

          <button
            id={`delete-report-btn-${report.id}`}
            onClick={() => onDeleteReport(report.id)}
            aria-label={labels?.deleteReportAria || 'Delete diagnostic report'}
            className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 shadow-sm ${isDarkMode
              ? 'bg-neutral-900 border-white/5 hover:border-red-900/40 text-neutral-400 hover:text-red-400 hover:bg-red-950/20'
              : 'bg-white border-neutral-300/80 hover:border-red-200 text-neutral-500 hover:text-red-600 hover:bg-red-50'
              }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
