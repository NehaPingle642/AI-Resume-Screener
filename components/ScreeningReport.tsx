
import React from 'react';
import type { ScreeningReport as ScreeningReportType } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

// A simple utility to render text with markdown-like bullet points
const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').map((line, index) => {
    line = line.trim();
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return (
        <li key={index} className="ml-5 list-disc">
          {line.substring(2)}
        </li>
      );
    }
    return <p key={index}>{line}</p>;
  });

  return <div className="space-y-2">{lines}</div>;
};


const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
            {icon}
            <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="text-slate-600 text-sm prose prose-sm max-w-none">
            {children}
        </div>
    </div>
);


export const ScreeningReport: React.FC<{ report: ScreeningReportType }> = ({ report }) => {
    const scoreColorClass = report.matchScore >= 75 ? 'text-green-600' : report.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-100 rounded-lg">
                <div className="flex-shrink-0">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center bg-white shadow-inner ${scoreColorClass}`}>
                        <span className="text-5xl font-bold">{report.matchScore}</span>
                        <span className="text-2xl font-semibold mt-1">%</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-700">Candidate Summary</h3>
                    <p className="text-slate-600 text-sm">{report.summary}</p>
                </div>
            </div>

            <ReportCard title="Strengths" icon={<CheckCircleIcon className="w-5 h-5 text-green-500" />}>
                <MarkdownRenderer text={report.strengths} />
            </ReportCard>
            
            <ReportCard title="Weaknesses / Gaps" icon={<XCircleIcon className="w-5 h-5 text-red-500" />}>
                <MarkdownRenderer text={report.weaknesses} />
            </ReportCard>

            <ReportCard title="Suggested Interview Questions" icon={<QuestionMarkCircleIcon className="w-5 h-5 text-sky-500" />}>
                <ol className="space-y-2 list-decimal list-inside">
                    {report.interviewQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ol>
            </ReportCard>
        </div>
    );
};
