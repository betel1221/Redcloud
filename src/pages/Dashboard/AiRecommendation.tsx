import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../api/dashboard';
import './AiRecommendation.css';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence?: number;
}

const AiRecommendation: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRecommendations();
        if (data && data.length > 0) {
          setRecommendation(data[0]); // Take the first recommendation
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="card ai-recommendation"><div className="ai-text"><p>Loading recommendations...</p></div></div>;
  }

  if (!recommendation) {
    return (
      <div className="card ai-recommendation">
        <h2 className="card-title">AI Recommendation</h2>
        <div className="ai-text"><p>No new recommendations at this time.</p></div>
      </div>
    );
  }

  return (
    <div className="card ai-recommendation">
      <h2 className="card-title">AI Recommendation</h2>
      <div className="ai-content">
        <div className="ai-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div className="ai-text">
          <h3>{recommendation.title}</h3>
          <p>{recommendation.description}</p>
        </div>
      </div>
      <div className="ai-footer">
        <div className="confidence">
          <span className="dot"></span>
          {recommendation.confidence || 90}% Confidence
        </div>
        <button className="action-button">Apply Fix</button>
      </div>
    </div>
  );
};

export default AiRecommendation;
