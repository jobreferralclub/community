import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../../../components/landing/Navigation";
import './ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.toLowerCase().split('.').pop();
      if (fileExtension === 'pdf' || fileExtension === 'docx') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload a PDF or DOCX file');
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Store result in sessionStorage and navigate to result page
        sessionStorage.setItem('analysisResult', JSON.stringify(result.data));
        navigate('/analyzer-result');
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: "🧠",
      title: "AI",
      subtitle: "Resume Analysis",
      description: "Smart algorithms parse and rank resumes automatically"
    },
    {
      icon: "🎯",
      title: "Smart",
      subtitle: "Match Accuracy",
      description: "Precise candidate-job matching with ML algorithms"
    },
    {
      icon: "⚡",
      title: "Lightning",
      subtitle: "Fast Ranking",
      description: "Process hundreds of resumes in seconds"
    }
  ];

  return (
    <div className="app-container">
      <Navigation />

      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <div className="loading-title">Analyzing Your Resume</div>
            <div className="loading-subtitle">AI is evaluating your professional profile...</div>
          </div>
        </div>
      )}

      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="main-title">AI Resume Analyzer</h1>
          <p className="subtitle">
            Get your resume ATS-ready and stand out to recruiters — powered by AI insights.
          </p>

          {/* Feature Cards Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-title">{feature.title}</div>
                <div className="feature-subtitle">{feature.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="file-upload-area">
              <div className="file-upload-content">
                <div className="upload-icon">📄</div>
                <h3 style={{color: '#00ff88', marginBottom: '0.5rem', fontWeight: '700'}}>
                  Upload Your Resume
                </h3>
                <p style={{color: '#a0a0a0', fontSize: '0.9rem', marginBottom: '1rem'}}>
                  Support for PDF, DOCX formats
                </p>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="file-input"
                  required
                />
                {selectedFile && (
                  <div style={{marginTop: '1rem', padding: '0.5rem 1rem', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '8px', color: '#00ff88', fontSize: '0.9rem', fontWeight: '600'}}>
                    ✅ Selected: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="error-card">
                <div className="error-text">
                  <span>⚠️</span>
                  {error}
                </div>
              </div>
            )}

            <div style={{textAlign: 'center'}}>
              <button
                type="submit"
                disabled={!selectedFile || isLoading}
                className="analyze-button"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner">🔄</span>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Analyze My Resume
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
