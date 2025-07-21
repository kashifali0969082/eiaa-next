"use client"
import React, { useState } from 'react';
import { Download, FileText, Calendar, Trash2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface CompletedFile {
  id: string;
  name: string;
  originalName: string;
  processedAt: Date;
  size: string;
  data: any;
}

interface CompletedFilesSectionProps {
  files: CompletedFile[];
  onDownload: (file: CompletedFile) => void;
  onDelete: (fileId: string) => void;
}

export const CompletedFilesSection: React.FC<CompletedFilesSectionProps> = ({
  files,
  onDownload,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (files.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gradient-to-r from-seagreen-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="p-2 bg-seagreen-100 dark:bg-seagreen-900 rounded-lg">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-seagreen-600 dark:text-seagreen-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Completed Files ({files.length})
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Your processed files are ready for download
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex-shrink-0"
          >
            {isExpanded ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4" />}
            <span className="text-xs sm:text-sm">{isExpanded ? 'Hide' : 'Show'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="p-3 sm:p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01]"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInUp 0.5s ease-out forwards'
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-seagreen-100 to-emerald-100 dark:from-seagreen-900 dark:to-emerald-900 rounded-lg flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-seagreen-600 dark:text-seagreen-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      Original: {file.originalName}
                    </p>
                    <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-2 h-2 sm:w-3 sm:h-3" />
                        <span>{file.processedAt.toLocaleDateString()}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 sm:ml-4">
                  <button
                    onClick={() => onDownload(file)}
                    className="bg-gradient-to-r from-seagreen-500 to-emerald-500 hover:from-seagreen-600 hover:to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 sm:space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base flex-1 sm:flex-initial justify-center"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Get</span>
                  </button>
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-shrink-0"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};