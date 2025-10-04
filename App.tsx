
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ResumeUploader } from './components/ResumeUploader';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ScreeningReport } from './components/ScreeningReport';
import { Loader } from './components/Loader';
import { Welcome } from './components/Welcome';
import { screenResume } from './services/geminiService';
import type { ScreeningReport as ScreeningReportType } from './types';
import { RocketLaunchIcon } from './components/icons/RocketLaunchIcon';

const App: React.FC = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [report, setReport] = useState<ScreeningReportType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScreenResume = useCallback(async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      const screeningResult = await screenResume(resumeFile, jobDescription);
      setReport(screeningResult);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeFile, jobDescription]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-700">Screening Details</h2>
            <ResumeUploader 
              onFileChange={setResumeFile} 
              fileName={resumeFile?.name || null} 
            />
            <JobDescriptionInput 
              value={jobDescription}
              onChange={setJobDescription}
            />
            <button
              onClick={handleScreenResume}
              disabled={!resumeFile || !jobDescription.trim() || isLoading}
              className="flex items-center justify-center gap-2 w-full bg-sky-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              <RocketLaunchIcon className="w-5 h-5" />
              {isLoading ? 'Analyzing...' : 'Screen Resume'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          {/* Output Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-700 mb-6">Screening Report</h2>
            <div className="relative min-h-[60vh]">
              {isLoading && <Loader />}
              {!isLoading && report && <ScreeningReport report={report} />}
              {!isLoading && !report && <Welcome />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
