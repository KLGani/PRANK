import React, { useState } from 'react';
import { User, StudentPerformance, HistoryEntry } from '../../types';
import { storage } from '../../utils/storage';
import { predictPerformance } from '../../utils/prediction';
import { Upload, CheckCircle, AlertCircle, FileText } from 'lucide-react';

interface BulkUploadProps {
  user: User;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ user }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [processedCount, setProcessedCount] = useState(0);

  const processCSV = (text: string) => {
    try {
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      const requiredHeaders = ['studentid', 'studentname', 'attendance', 'assignmentscore', 'quizscore', 'midtermscore', 'previousresult', 'studyhoursperdday', 'extracurricularactivities'];
      
      const performanceDataArray: StudentPerformance[] = [];
      const historyEntries: HistoryEntry[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < 5) continue;

        const getVal = (key: string) => {
          const idx = headers.indexOf(key);
          return idx >= 0 ? values[idx] : '';
        };

        const performance: StudentPerformance = {
          studentId: getVal('studentid') || `student-${i}`,
          studentName: getVal('studentname') || `Student ${i}`,
          email: getVal('email') || `student${i}@school.com`,
          class: getVal('class') || '10',
          section: getVal('section') || 'A',
          attendance: parseFloat(getVal('attendance')) || 85,
          assignmentScore: parseFloat(getVal('assignmentscore')) || 75,
          quizScore: parseFloat(getVal('quizscore')) || 75,
          midtermScore: parseFloat(getVal('midtermscore')) || 75,
          previousResult: parseFloat(getVal('previousresult')) || 75,
          studyHoursPerDay: parseFloat(getVal('studyhoursperdday') || getVal('studyhoursperday')) || 4,
          extracurricularActivities: parseInt(getVal('extracurricularactivities')) || 1,
          timestamp: new Date().toISOString(),
        };

        const prediction = predictPerformance(performance);
        
        const entry: HistoryEntry = {
          id: `${performance.studentId}-${Date.now()}-${i}`,
          studentId: performance.studentId,
          performance,
          prediction,
          timestamp: new Date().toISOString(),
        };

        performanceDataArray.push(performance);
        historyEntries.push(entry);
      }

      storage.saveMultipleStudentData(performanceDataArray);
      historyEntries.forEach(entry => storage.saveHistory(entry));

      setProcessedCount(performanceDataArray.length);
      setUploadStatus('success');
      setMessage(`Successfully processed ${performanceDataArray.length} student records!`);
    } catch (err) {
      setUploadStatus('error');
      setMessage('Error processing CSV. Please check the file format.');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setMessage('Please upload a CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const sampleCSV = `studentId,studentName,email,class,section,attendance,assignmentScore,quizScore,midtermScore,previousResult,studyHoursPerDay,extracurricularActivities
STU001,John Doe,john@school.com,10,A,85,78,82,75,80,4,2
STU002,Jane Smith,jane@school.com,10,A,92,88,90,85,87,5,3
STU003,Bob Wilson,bob@school.com,10,B,72,65,70,68,71,3,1`;

  const downloadSample = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_student_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Upload className="w-6 h-6 text-blue-600" />
          Bulk Upload
        </h2>
        <p className="text-gray-600 mb-6">Upload a CSV file to import student performance data in bulk.</p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">Drag & drop your CSV file here</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Browse Files
            <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
          </label>
        </div>

        {/* Status */}
        {uploadStatus !== 'idle' && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            uploadStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {uploadStatus === 'success' ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            )}
            <p className={uploadStatus === 'success' ? 'text-green-700' : 'text-red-700'}>{message}</p>
          </div>
        )}
      </div>

      {/* Sample Template */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          CSV Template
        </h3>
        <p className="text-gray-600 mb-4">Download the sample template to see the required format.</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
          <pre className="text-xs text-gray-700 font-mono">{sampleCSV}</pre>
        </div>

        <button
          onClick={downloadSample}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Download Sample CSV
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-blue-800 mb-2">Required Columns:</p>
          <ul className="text-sm text-blue-700 space-y-1 grid grid-cols-2 gap-1">
            <li>• studentId</li>
            <li>• studentName</li>
            <li>• attendance (0-100)</li>
            <li>• assignmentScore (0-100)</li>
            <li>• quizScore (0-100)</li>
            <li>• midtermScore (0-100)</li>
            <li>• previousResult (0-100)</li>
            <li>• studyHoursPerDay (0-12)</li>
            <li>• extracurricularActivities (0-10)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
