import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const Correction = () => {
  const [question, setQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [rubrics, setRubrics] = useState('');
  const [gradingResult, setGradingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGrade = async () => {
    setIsLoading(true);
    setGradingResult(null);

    try {
        const response = await axios.post('http://localhost:8000/grade', {
            question,
            student_answer: studentAnswer,
            rubric: rubrics
        });
        setGradingResult(response.data);
    } catch (error) {
        console.error("Grading failed:", error);
        alert('Grading failed. Check console for details.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content">Answer Correction</h1>
        <p className="text-base-content/70 mt-2">Input the question, student answer, and grading criteria.</p>
      </div>

      <div className="grid gap-6">
        {/* Question Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-lg">Question</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24 text-base" 
            placeholder="Enter the question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
        </div>

        {/* Student Answer Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-lg">Student Answer</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-48 text-base" 
            placeholder="Paste the student's answer here..."
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
          ></textarea>
        </div>

        {/* Rubrics Input */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold text-lg">Grading Rubrics / Criteria</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-32 text-base" 
            placeholder="e.g., Key points expected, marking scheme..."
            value={rubrics}
            onChange={(e) => setRubrics(e.target.value)}
          ></textarea>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-6">
          <button 
            className="btn btn-primary btn-wide"
            onClick={handleGrade}
            disabled={!question || !studentAnswer || isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
            {isLoading ? 'Grading...' : 'Grade Answer'}
          </button>
        </div>

        {/* Results Section */}
        {gradingResult && (
            <div className="card bg-base-200 shadow-xl mt-8">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Grading Results</h2>
                    
                    {/* Score */}
                    <div className="stats shadow w-full mb-6">
                        <div className="stat place-items-center">
                            <div className="stat-title">Total Score</div>
                            <div className="stat-value text-primary">
                                {gradingResult.grading_result.total_marks_awarded} / {gradingResult.grading_result.total_possible_marks}
                            </div>
                            <div className="stat-desc">{gradingResult.grading_result.percentage}%</div>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-4">
                        <div className="alert alert-info">
                            <div>
                                <h3 className="font-bold">Overall Feedback</h3>
                                <p>{gradingResult.grading_result.overall_feedback}</p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div>
                            <h3 className="font-bold text-lg mb-2">Component Breakdown</h3>
                            <div className="overflow-x-auto">
                                <table className="table w-full bg-base-100">
                                    <thead>
                                        <tr>
                                            <th>Component</th>
                                            <th>Score</th>
                                            <th>Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradingResult.grading_result.component_breakdown?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="font-medium">{item.component}</td>
                                                <td>{item.marks_awarded} / {item.max_marks}</td>
                                                <td className="text-sm opacity-80">{item.feedback}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Improvements */}
                        {gradingResult.grading_result.improvement_suggestions?.length > 0 && (
                            <div className="bg-base-100 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-warning">Improvements</h3>
                                <ul className="list-disc list-inside">
                                    {gradingResult.grading_result.improvement_suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="mb-1">{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* Ideal Answer Toggle (Optional) */}
                        <div className="collapse collapse-arrow bg-base-100 border border-base-300">
                            <input type="checkbox" /> 
                            <div className="collapse-title text-md font-medium">
                                View Ideal Generated Answer
                            </div>
                            <div className="collapse-content"> 
                                <p className="whitespace-pre-wrap text-sm">{gradingResult.ideal_answer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Correction;
