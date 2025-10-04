
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Welcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
            <SparklesIcon className="w-16 h-16 mb-4 text-sky-400" />
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Welcome to the AI Resume Screener</h2>
            <p className="max-w-md">
                Get started by uploading a candidate's resume and pasting a job description in the panel to your left.
                The AI will provide a detailed analysis and report here.
            </p>
        </div>
    );
};
