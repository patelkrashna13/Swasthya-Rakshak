import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertTriangle, CheckCircle, Clock, Activity, Brain, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface PredictionResult {
  class: string;
  confidence: number;
  probabilities: Record<string, number>;
  riskLevel: string;
  recommendations: string[];
}

interface ModelInfo {
  accuracy: number;
  classes: string[];
  modelVersion: string;
  lastUpdated: string;
}

interface FractureResponse {
  success: boolean;
  prediction: PredictionResult;
  modelInfo: ModelInfo;
  timestamp: string;
}

const XRayFractureUploadCard = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setPrediction(null);
    await predictFracture(selectedFile);
  };

  const predictFracture = async (imageFile: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('xray', imageFile);

      const response = await fetch('/api/fracture/predict', {
        method: 'POST',
        body: formData,
      });

      const data: FractureResponse = await response.json();

      if (data.success) {
        setPrediction(data.prediction);
        setModelInfo(data.modelInfo);
      } else {
        setError('Prediction failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPrediction(null);
    setModelInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getClassColor = (className: string) => {
    switch (className.toLowerCase()) {
      case 'normal': return 'text-green-600';
      case 'crack': return 'text-yellow-600';
      case 'fracture': return 'text-orange-600';
      case 'hemorrhage': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getClassIcon = (className: string) => {
    switch (className.toLowerCase()) {
      case 'normal': return <CheckCircle className="h-5 w-5" />;
      case 'crack': return <AlertTriangle className="h-5 w-5" />;
      case 'fracture': return <Activity className="h-5 w-5" />;
      case 'hemorrhage': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Section */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-full">
            <Brain className="h-6 w-6 text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Powered Bone Fracture Detection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload X-ray images for instant fracture analysis with 99.2% accuracy
            </p>
          </div>
        </div>

        {!file ? (
          <motion.div
            className="border-2 border-dashed border-accent-300 dark:border-accent-700 rounded-lg p-8 text-center hover:border-accent-400 dark:hover:border-accent-600 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-accent-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload X-Ray Image
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop or click to select JPEG, PNG, or JPG files
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Maximum file size: 10MB
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={URL.createObjectURL(file)}
                  alt="X-ray preview"
                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-600"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Analyzing X-ray image...
                  </span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Prediction Results */}
      <AnimatePresence>
        {prediction && modelInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Prediction Card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                  Fracture Analysis Results
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>Real-time analysis</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Primary Prediction */}
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${getClassColor(prediction.class)}`}>
                        {getClassIcon(prediction.class)}
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          Predicted Condition
                        </h5>
                        <p className={`text-lg font-bold ${getClassColor(prediction.class)}`}>
                          {prediction.class}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Confidence
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-accent-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Risk Assessment
                    </h5>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                      {prediction.riskLevel} Risk
                    </span>
                  </div>
                </div>

                {/* Probability Distribution */}
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    Probability Distribution
                  </h5>
                  {Object.entries(prediction.probabilities).map(([className, probability]) => (
                    <div key={className} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {className}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {(probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            className === prediction.class ? 'bg-accent-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Medical Recommendations
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <ul className="space-y-2">
                  {prediction.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-blue-800 dark:text-blue-300 text-sm">
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Model Information */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>Model Accuracy: {(modelInfo.accuracy * 100).toFixed(1)}%</span>
                  <span>Version: {modelInfo.modelVersion}</span>
                </div>
                <span>Last Updated: {new Date(modelInfo.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default XRayFractureUploadCard;
