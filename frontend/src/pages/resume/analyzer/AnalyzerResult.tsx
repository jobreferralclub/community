import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import './AnalyzerResult.css';

interface AnalysisResult {
  candidate_name: string;
  scores: {
    content_quality: number;
    resume_structure: number;
    ats_essentials: number;
    overall_score: number;
  };
  subpoints: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
  suggestions: {
    [key: string]: string;
  };
}

const AnalyzerResult: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('analysisResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // If no result found, redirect to analyzer
      navigate('/resume-analyzer');
    }
  }, [navigate]);

  const handleNewAnalysis = () => {
    // Clear stored result and navigate back to analyzer
    sessionStorage.removeItem('analysisResult');
    navigate('/resume-analyzer');
  };

  if (!result) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-spinner">🔄</div>
            <div className="loading-title">Analyzing Your Resume...</div>
          </div>
        </div>
      </div>
    );
  }

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const formatSectionTitle = (title: string) => {
    return title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSubpointText = (text: string) => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (

    <div className="app-container">
      <Navigation />

      

      {/* Back Button */}
      <button style={{ marginTop: '2rem' , marginLeft: '2rem' }}
        onClick={handleNewAnalysis}
        className="back-button"
      >
        <span>←</span>
        New Analysis
      </button>

      <div className="main-content">
        <div className="results-container">
          {/* Header */}
          <div className="header-card">
            <h1 className="report-title">
              <span className="report-icon">📊</span>
              Resume Analysis Report
            </h1>
            <div className="candidate-name">
              {result.candidate_name}
            </div>
          </div>

          {/* Overall Score Highlight */}
          <div className="overall-score-card">
            <div className="overall-score-label">
              <span className="score-icon">📈</span>
              Overall Resume Score
            </div>
            <div className="overall-score-value">
              {result.scores.overall_score}/100
            </div>
          </div>

          {/* Sections Grid */}
          <div className="sections-grid">
            {Object.entries(result.scores).map(([section, score]) => {
              if (section === 'overall_score') return null;
              
              return (
                <div key={section} className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">{formatSectionTitle(section)}</h3>
                    <div className={`score-badge ${getScoreClass(score)}`}>
                      {score}/100
                    </div>
                  </div>

                  <div className="subpoints-list">
                    {result.subpoints[section] && Object.entries(result.subpoints[section]).map(([subpoint, passed]) => (
                      <div key={subpoint} className={`subpoint-item ${passed ? 'passed' : 'failed'}`}>
                        <span className="subpoint-icon">
                          {passed ? '✅' : '❌'}
                        </span>
                        <span className="subpoint-text">{formatSubpointText(subpoint)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="suggestion-box">
                    <div className="suggestion-icon">💡</div>
                    <div className="suggestion-text">
                      {result.suggestions[section]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Suggestions */}
          <div className="overall-suggestions-card">
            <div className="suggestions-header">
              <span className="suggestions-icon">✨</span>
              <span className="suggestions-title">Key Improvement Areas</span>
            </div>
            <div className="suggestions-content">
              {result.suggestions.overall}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerResult;