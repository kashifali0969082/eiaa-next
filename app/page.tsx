"use client";
import React, { useState } from "react";
import {
  FileSpreadsheet,
  Sparkles,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./Components/ThemeToggle";
import { FileUpload } from "./Components/FileUpload";
import { DataPreview } from "./Components/DataPreview";
import { AIFormatter, FormattingOptions } from "./Components/AiFormatter";
import { DownloadSection } from "./Components/DownloadSection";
import { CompletedFilesSection } from "./Components/CompletedFileSection";
import {
  processExcelFile,
  formatDataWithAI,
  downloadFormattedFile,
  ProcessedData,
} from "./Utils/excelProcessor";

type AppState = "upload" | "processing" | "complete";
interface PasswordModalProps {
  onPasswordCorrect: () => void;
}
interface APIResponse {
  download_url: string;
  filename: string;
  processed_data?: any;
  message?: string;
}

function App() {
  const [state, setState] = useState<AppState>("upload");
  const [originalData, setOriginalData] = useState<ProcessedData | null>(null);
  const [formattedData, setFormattedData] = useState<ProcessedData | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedFiles, setCompletedFiles] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);

  const handlePasswordCorrect = (): void => {
    setIsAuthenticated(false);
  };
  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    setState("processing");

    try {
      const data = await processExcelFile(file);
      setOriginalData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the file"
      );
      setState("upload");
    }
  };

  const handleAPIResponse = (response: APIResponse) => {
    setApiResponse(response);
    setState("complete");
    setIsProcessing(false);
  };

  const handleAPIError = (errorMessage: string) => {
    setError(errorMessage);
    setState("upload");
    setIsProcessing(false);
  };

  const handleDownloadFromAPI = () => {
    if (apiResponse?.download_url) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = apiResponse.download_url;
      link.download = apiResponse.filename || `processed_${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add to completed files
      const completedFile = {
        id: Date.now().toString(),
        name: apiResponse.filename || `processed_${fileName}`,
        originalName: fileName,
        processedAt: new Date(),
        size: "API Processed",
        downloadUrl: apiResponse.download_url,
      };
      setCompletedFiles((prev) => [completedFile, ...prev]);
    }
  };

  const handleDownloadCompleted = (file: any) => {
    if (file.downloadUrl) {
      const link = document.createElement("a");
      link.href = file.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file.data) {
      downloadFormattedFile(file.data, file.originalName);
    }
  };

  const handleDeleteCompleted = (fileId: string) => {
    setCompletedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleStartOver = () => {
    setState("upload");
    setOriginalData(null);
    setFormattedData(null);
    setFileName("");
    setError(null);
    setApiResponse(null);
    setIsProcessing(false);
  };

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <>
          {" "}
          <PasswordModal onPasswordCorrect={handlePasswordCorrect} />
        </>
      ) : (
        <>
          <div className="min-h-screen bg-gradient-to-br from-seagreen-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-all duration-500">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
              <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="p-2 bg-gradient-to-r from-seagreen-500 to-emerald-500 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-200">
                      <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        AI File Processor
                      </h1>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 hidden sm:block">
                        Transform your files with intelligent processing
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
              {error && (
                <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slideInDown">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Completed Files Section */}
                {completedFiles.length > 0 && (
                  <div className="animate-fadeIn">
                    <CompletedFilesSection
                      files={completedFiles}
                      onDownload={handleDownloadCompleted}
                      onDelete={handleDeleteCompleted}
                    />
                  </div>
                )}

                {/* Step 1: Upload */}
                {state === "upload" && (
                  <div className="text-center animate-fadeIn">
                    <div className="mb-6 sm:mb-8">
                      <div className="relative inline-block">
                        <Sparkles className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-seagreen-600 dark:text-seagreen-400 mx-auto mb-3 sm:mb-4 animate-pulse" />
                        <div className="absolute inset-0 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-seagreen-400 rounded-full opacity-20 animate-ping mx-auto"></div>
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Upload Your File
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-4">
                        Let AI transform your data into a perfectly formatted
                        file
                      </p>
                    </div>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      setState={setState}
                    />
                  </div>
                )}

                {/* Step 2: Processing */}
                {state === "processing" && (
                  <div className="text-center animate-fadeIn">
                    <div className="mb-6 sm:mb-8">
                      <div className="relative inline-block">
                        <RefreshCw className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-seagreen-600 dark:text-seagreen-400 mx-auto mb-4 sm:mb-6 animate-spin" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Processing Your File
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-4">
                        AI is analyzing and formatting your data...
                      </p>
                    </div>

                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md mx-auto">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-seagreen-500 rounded-full animate-pulse"></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            Uploading file...
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-seagreen-500 rounded-full animate-pulse animation-delay-200"></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            Analyzing data structure...
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-seagreen-500 rounded-full animate-pulse animation-delay-400"></div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                            Applying AI formatting...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Complete */}
                {state === "complete" && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-slideInUp">
                    <div className="text-center">
                      <div className="relative inline-block mb-4 sm:mb-6">
                        <Download className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-seagreen-600 dark:text-seagreen-400 mx-auto animate-bounce" />
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Processing Complete!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg px-4">
                        Your file has been processed and is ready for download
                      </p>
                    </div>

                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
                      <div className="text-center space-y-4 sm:space-y-6">
                        <div className="space-y-2">kashif si a</div>

                        <button
                          onClick={handleDownloadFromAPI}
                          className="w-full sm:w-auto bg-gradient-to-r from-seagreen-500 to-emerald-500 hover:from-seagreen-600 hover:to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                          <Download className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
                          Download Processed File
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleStartOver}
                        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                      >
                        Process Another File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-16">
              <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <p className="text-sm sm:text-base">
                    Built with AI-powered file processing capabilities
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </>
      )}
    </ThemeProvider>
  );
}

export default App;

const PasswordModal: React.FC<PasswordModalProps> = ({ onPasswordCorrect }) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a brief loading state for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === "123") {
      onPasswordCorrect();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && password.trim() && !isLoading) {
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-seagreen-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="p-4 bg-gradient-to-r from-seagreen-500 to-emerald-500 rounded-full shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-seagreen-400 rounded-full opacity-20 animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please enter the password to continue
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-seagreen-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slideInDown">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !password.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-seagreen-600 to-emerald-600 hover:from-seagreen-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure access to AI File Processor
          </p>
        </div>
      </div>
    </div>
  );
};
