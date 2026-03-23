import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiCheckCircle, FiBookOpen } from 'react-icons/fi';
import api from '../services/api';
import './InterviewQuestions.css';

const InterviewQuestions = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedResume) {
      setError('Please select a resume');
      return;
    }

    setLoading(true);
    setError('');
    setQuestions([]);
    setAnsweredQuestions(new Set());

    try {
      const res = await api.post('/ai/interview-questions', {
        resumeId: selectedResume,
        difficulty,
        count
      });

      setQuestions(res.data.questions);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating questions');
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswered = (questionId) => {
    const newAnswered = new Set(answeredQuestions);
    if (newAnswered.has(questionId)) {
      newAnswered.delete(questionId);
    } else {
      newAnswered.add(questionId);
    }
    setAnsweredQuestions(newAnswered);
  };

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', color: '#10B981' },
    { value: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
    { value: 'advanced', label: 'Advanced', color: '#EF4444' }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Basics': '#3B82F6',
      'Technical': '#8B5CF6',
      'Behavioral': '#EC4899',
      'System Design': '#F59E0B',
      'Database': '#10B981',
      'DevOps': '#14B8A6',
      'Architecture': '#6366F1'
    };
    return colors[category] || '#667EEA';
  };

  return (
    <div className="interview-questions-page">
      <div className="interview-container">
        <div className="page-header">
          <h1>
            <FiMessageCircle /> AI Interview Questions Generator
          </h1>
          <p>Practice with AI-generated interview questions based on your resume</p>
        </div>

        {/* Settings Section */}
        <div className="settings-section">
          <div className="settings-grid">
            <div className="form-group">
              <label>Select Your Resume</label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="form-select"
              >
                <option value="">Choose a resume...</option>
                {resumes.map((resume) => (
                  <option key={resume._id} value={resume._id}>
                    {resume.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <div className="difficulty-options">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`difficulty-btn ${difficulty === option.value ? 'active' : ''}`}
                    style={{
                      borderColor: difficulty === option.value ? option.color : 'var(--border)',
                      backgroundColor: difficulty === option.value ? `${option.color}20` : 'transparent'
                    }}
                    onClick={() => setDifficulty(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Number of Questions: {count}</label>
              <input
                type="range"
                min="5"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="range-slider"
              />
              <div className="range-labels">
                <span>5</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary btn-generate"
          >
            {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
          </button>
        </div>

        {/* Questions Display */}
        {questions.length > 0 && (
          <div className="questions-section">
            <div className="questions-header">
              <h3>
                <FiBookOpen /> Interview Questions ({questions.length})
              </h3>
              <div className="progress-indicator">
                <span>
                  Answered: {answeredQuestions.size} / {questions.length}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(answeredQuestions.size / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="questions-list">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`question-card ${answeredQuestions.has(question.id) ? 'answered' : ''}`}
                >
                  <div className="question-header">
                    <div className="question-number">Q{question.id}</div>
                    <div
                      className="question-category"
                      style={{ backgroundColor: getCategoryColor(question.category) }}
                    >
                      {question.category}
                    </div>
                    <button
                      className="mark-answered-btn"
                      onClick={() => toggleAnswered(question.id)}
                    >
                      {answeredQuestions.has(question.id) ? (
                        <>
                          <FiCheckCircle /> Answered
                        </>
                      ) : (
                        'Mark as Answered'
                      )}
                    </button>
                  </div>
                  <p className="question-text">{question.question}</p>
                  {question.type === 'behavioral' && (
                    <div className="question-tip">
                      <strong>Tip:</strong> Use the STAR method (Situation, Task, Action, Result)
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="practice-tips">
              <h4>Practice Tips:</h4>
              <ul>
                <li>Answer each question out loud or write down your response</li>
                <li>Time yourself - aim for 2-3 minutes per technical question</li>
                <li>Use the STAR method for behavioral questions</li>
                <li>Practice with a friend or record yourself</li>
                <li>Focus on clarity, structure, and real examples</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;
