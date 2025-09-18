import { motion } from 'framer-motion';
import CBCReportUploadCard from './CBCReportUploadCard';
import { BarChart3, PieChart, LineChart, ArrowUpRight, Upload, Brain, Loader2, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';
import { useState } from 'react';

// Sample data for charts
const dailyData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const AnalyticsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');

  const handleExploreAnalysis = () => {
    const el = document.getElementById('analysis-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageAndResults = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPrediction(null);
    // Reset file input
    const fileInput = document.getElementById('fracture-file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const simulateLoadingProgress = () => {
    const stages = [
      { stage: 'Preprocessing image...', duration: 800 },
      { stage: 'Analyzing bone structure...', duration: 1000 },
      { stage: 'Detecting fractures...', duration: 700 },
      { stage: 'Generating report...', duration: 500 }
    ];

    let currentProgress = 0;
    let stageIndex = 0;

    const updateProgress = () => {
      if (stageIndex < stages.length) {
        setLoadingStage(stages[stageIndex].stage);
        const stageProgress = 100 / stages.length;
        const targetProgress = (stageIndex + 1) * stageProgress;
        
        const progressInterval = setInterval(() => {
          currentProgress += 2;
          setLoadingProgress(Math.min(currentProgress, targetProgress));
          
          if (currentProgress >= targetProgress) {
            clearInterval(progressInterval);
            stageIndex++;
            setTimeout(updateProgress, 100);
          }
        }, stages[stageIndex].duration / 50);
      }
    };

    updateProgress();
  };

  const handleFractureAnalysis = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setLoadingProgress(0);
    setPrediction(null);
    
    // Start loading animation
    simulateLoadingProgress();

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        // Add minimum 3-second delay for loading experience
        const analysisPromise = fetch('http://localhost:5000/api/fracture/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData: imageData,
            filename: selectedFile.name
          }),
        });

        const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));
        
        const [response] = await Promise.all([analysisPromise, delayPromise]);

        if (response.ok) {
          const result = await response.json();
          setLoadingProgress(100);
          setLoadingStage('Analysis complete!');
          
          // Small delay to show completion
          setTimeout(() => {
            setPrediction(result.prediction);
            setIsLoading(false);
          }, 500);
        } else {
          const errorData = await response.json();
          console.error('Prediction failed:', errorData.message);
          alert(errorData.message || 'Failed to analyze X-ray image');
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading image file');
        setIsLoading(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to analysis server');
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-accent-50 to-white dark:from-accent-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                AI-Powered Medical Analytics
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Advanced CBC analysis and bone fracture detection using cutting-edge AI technology for accurate medical diagnostics.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button onClick={handleExploreAnalysis} className="btn-accent">Explore Analysis</button>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <motion.div 
                className="glass-card p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={dailyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                          borderColor: '#E5E7EB',
                          borderRadius: '0.375rem'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#0EA5E9" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Analysis Features */}
      <section id="analysis-section" className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Medical Analysis
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload medical reports and X-ray images for instant AI-powered analysis
            </p>
          </motion.div>

          {/* Side-by-side Analysis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* CBC Analysis Card */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-3">
                  <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">CBC Report Analysis</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload your Complete Blood Count report for AI-powered analysis and insights.
              </p>
              <CBCReportUploadCard />
            </motion.div>

            {/* Bone Fracture Detection Card */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-3">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bone Fracture Detection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Upload X-ray images for AI-powered fracture detection and risk assessment.
              </p>
              
              {/* File Upload Area */}
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded X-ray" 
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                    />
                    <button 
                      onClick={clearImageAndResults}
                      className="absolute top-3 right-3 bg-gray-800 bg-opacity-70 hover:bg-opacity-90 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="fracture-file-input"
                    />
                    <label htmlFor="fracture-file-input" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Click to upload X-ray image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                    </label>
                  </div>
                )}

                {/* Enhanced Analyze Button with Loading */}
                <button
                  onClick={handleFractureAnalysis}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium relative overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing X-ray...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="h-5 w-5" />
                      <span>Analyze X-ray</span>
                    </div>
                  )}
                </button>

                {/* Loading Progress Indicator */}
                {isLoading && (
                  <motion.div 
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {loadingStage}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Math.round(loadingProgress)}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                      <motion.div 
                        className="bg-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    {/* Medical Analysis Animation */}
                    <div className="flex items-center justify-center space-x-4 text-purple-600">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 0
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </motion.div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 0.3
                        }}
                      >
                        <Brain className="h-4 w-4" />
                      </motion.div>
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          delay: 0.6
                        }}
                      >
                        <Activity className="h-4 w-4" />
                      </motion.div>
                    </div>
                    
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                      AI is analyzing your X-ray image for fractures and abnormalities
                    </p>
                  </motion.div>
                )}

                {/* Prediction Results */}
                {prediction && !isLoading && (
                  <motion.div 
                    className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Analysis Results</h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Prediction</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{prediction.class}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Confidence</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Risk Level</p>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskLevel)}`}>
                        {prediction.riskLevel}
                      </span>
                    </div>

                    {prediction.recommendations && (
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Recommendations</p>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {prediction.recommendations.slice(0, 3).map((rec: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Analytics Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Turn your healthcare data into actionable insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Operational Analytics",
                description: "Track and optimize key hospital metrics like bed utilization, wait times, and resource allocation."
              },
              {
                icon: <LineChart className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Clinical Analytics",
                description: "Monitor treatment outcomes, identify patterns in patient care, and improve clinical protocols."
              },
              {
                icon: <PieChart className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Financial Analytics",
                description: "Analyze revenue cycles, identify cost-saving opportunities, and improve financial performance."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center text-accent-600 dark:text-accent-400 font-medium hover:text-accent-700 dark:hover:text-accent-300 transition-colors duration-200"
                >
                  Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Analytics Dashboard
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Customizable dashboards that provide real-time insights into your healthcare data
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Patient Visits
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={dailyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderColor: '#E5E7EB',
                        borderRadius: '0.375rem'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0EA5E9" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Performance Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Average Wait Time", value: "28 mins", change: "-12%", positive: true },
                  { label: "Bed Occupancy Rate", value: "84%", change: "+3%", positive: true },
                  { label: "Patient Satisfaction", value: "4.8/5", change: "+0.3", positive: true },
                  { label: "Revenue per Patient", value: "₹12,450", change: "+8%", positive: true },
                ].map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                    <div className={`flex items-center mt-1 ${metric.positive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      <ArrowUpRight size={14} className={`${!metric.positive && 'rotate-180'}`} />
                      <span className="text-sm font-medium ml-1">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent-600 dark:bg-accent-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Unlock Insights From Your Healthcare Data?
            </motion.h2>
            <motion.p 
              className="text-lg text-accent-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Start making data-driven decisions to improve patient outcomes and operational efficiency.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/"
                className="bg-white text-accent-600 hover:bg-accent-50 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Get Started
              </Link>
              <Link 
                to="/"
                className="bg-transparent border border-white text-white hover:bg-accent-700 dark:hover:bg-accent-900 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Request Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AnalyticsPage;