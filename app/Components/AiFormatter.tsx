import React, { useState } from 'react';
import { Brain, Settings, Wand2, CheckCircle, Clock } from 'lucide-react';

interface AIFormatterProps {
  onFormat: (options: FormattingOptions) => void;
  isProcessing: boolean;
}

export interface FormattingOptions {
  cleanData: boolean;
  standardizeHeaders: boolean;
  removeEmpty: boolean;
  formatDates: boolean;
  addSummary: boolean;
  customPrompt?: string;
}

export const AIFormatter: React.FC<AIFormatterProps> = ({ onFormat, isProcessing }) => {
  const [options, setOptions] = useState<FormattingOptions>({
    cleanData: true,
    standardizeHeaders: true,
    removeEmpty: true,
    formatDates: true,
    addSummary: false,
    customPrompt: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptionChange = (key: keyof FormattingOptions, value: boolean | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleFormat = () => {
    onFormat(options);
  };

  const formatOptions = [
    {
      key: 'cleanData' as keyof FormattingOptions,
      label: 'Clean Data',
      description: 'Remove inconsistencies and standardize formatting',
      icon: <Wand2 className="w-5 h-5" />
    },
    {
      key: 'standardizeHeaders' as keyof FormattingOptions,
      label: 'Standardize Headers',
      description: 'Convert headers to consistent naming conventions',
      icon: <Settings className="w-5 h-5" />
    },
    {
      key: 'removeEmpty' as keyof FormattingOptions,
      label: 'Remove Empty Rows/Columns',
      description: 'Clean up empty cells and rows automatically',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      key: 'formatDates' as keyof FormattingOptions,
      label: 'Format Dates',
      description: 'Standardize date formats across the spreadsheet',
      icon: <Clock className="w-5 h-5" />
    }
  ];

  return (
    // <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 transition-all duration-300 hover:shadow-xl">
    //   <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
    //     <div className="p-2 bg-seagreen-100 dark:bg-seagreen-900 rounded-lg">
    //       <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-seagreen-600 dark:text-seagreen-400" />
    //     </div>
    //     <div>
    //       <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">AI Formatting Options</h3>
    //       <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Choose how you want to enhance your data</p>
    //     </div>
    //   </div>

    //   <div className="space-y-3 sm:space-y-4">
    //     {formatOptions.map((option) => (
    //       <div key={option.key} className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]">
    //         <div className="flex-shrink-0 mt-1">
    //           <label className="relative inline-flex items-center cursor-pointer">
    //             <input
    //               type="checkbox"
    //               checked={options[option.key] as boolean}
    //               onChange={(e) => handleOptionChange(option.key, e.target.checked)}
    //               className="sr-only peer"
    //             />
    //             <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-seagreen-300 dark:peer-focus:ring-seagreen-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-seagreen-600"></div>
    //           </label>
    //         </div>
    //         <div className="flex-1">
    //           <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
    //             {option.icon}
    //             <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{option.label}</h4>
    //           </div>
    //           <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
    //         </div>
    //       </div>
    //     ))}

    //     <div className="border-t border-gray-200 dark:border-gray-600 pt-3 sm:pt-4">
    //       <button
    //         onClick={() => setShowAdvanced(!showAdvanced)}
    //         className="text-xs sm:text-sm text-seagreen-600 dark:text-seagreen-400 hover:text-seagreen-700 dark:hover:text-seagreen-300 font-medium transition-colors duration-200"
    //       >
    //         {showAdvanced ? 'Hide' : 'Show'} Advanced Options
    //       </button>
    //     </div>

    //     {showAdvanced && (
    //       <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600 animate-slideInDown">
    //         <div className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
    //           <div className="flex-shrink-0 mt-1">
    //             <label className="relative inline-flex items-center cursor-pointer">
    //               <input
    //                 type="checkbox"
    //                 checked={options.addSummary}
    //                 onChange={(e) => handleOptionChange('addSummary', e.target.checked)}
    //                 className="sr-only peer"
    //               />
    //               <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-seagreen-300 dark:peer-focus:ring-seagreen-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-seagreen-600"></div>
    //             </label>
    //           </div>
    //           <div className="flex-1">
    //             <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base">Add Data Summary</h4>
    //             <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Generate insights and summary statistics</p>
    //           </div>
    //         </div>

    //         <div>
    //           <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    //             Custom AI Instructions (Optional)
    //           </label>
    //           <textarea
    //             value={options.customPrompt}
    //             onChange={(e) => handleOptionChange('customPrompt', e.target.value)}
    //             placeholder="Enter specific instructions for how you want your data formatted..."
    //             className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-seagreen-500 focus:border-seagreen-500 resize-none transition-all duration-200 text-sm sm:text-base"
    //             rows={3}
    //           />
    //         </div>
    //       </div>
    //     )}
    //   </div>

    //   <div className="mt-4 sm:mt-6 flex justify-end">
    //     <button
    //       onClick={handleFormat}
    //       disabled={isProcessing}
    //       className={`
    //         px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 text-sm sm:text-base
    //         ${isProcessing
    //           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
    //           : 'bg-gradient-to-r from-seagreen-600 to-emerald-600 text-white hover:from-seagreen-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105'
    //         }
    //       `}
    //     >
    //       {isProcessing ? (
    //         <>
    //           <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
    //           <span>Processing...</span>
    //         </>
    //       ) : (
    //         <>
    //           <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
    //           <span>Format with AI</span>
    //         </>
    //       )}
    //     </button>
    //   </div>
    // </div>
    <>
    </>
  );
};