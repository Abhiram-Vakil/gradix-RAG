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
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2 text-base-content">
            AI Auto-Grader
        </h1>
        <p className="text-base-content/70">
            Submit student answers for instant, rubric-based evaluation.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Question Card */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-6">
                    <label className="label pt-0 px-0">
                        <span className="label-text font-bold text-lg">Question</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered h-24 text-base focus:border-primary" 
                        placeholder="Enter the examination question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* Answer Card */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-6">
                    <label className="label pt-0 px-0">
                        <span className="label-text font-bold text-lg">Student Answer</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered h-48 text-base font-mono text-sm leading-relaxed focus:border-primary" 
                        placeholder="Paste the student's full response..."
                        value={studentAnswer}
                        onChange={(e) => setStudentAnswer(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* Rubric Card */}
            <div className="card bg-base-100 border border-base-200 shadow-sm">
                <div className="card-body p-6">
                    <label className="label pt-0 px-0">
                        <span className="label-text font-bold text-lg">Grading Rubric</span>
                    </label>
                    <textarea 
                        className="textarea textarea-bordered h-32 text-base focus:border-primary" 
                        placeholder="e.g., 1. Definitions: 2 marks&#10;2. Key features: 3 marks..."
                        value={rubrics}
                        onChange={(e) => setRubrics(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
                <button 
                    className={`btn btn-primary btn-lg w-full ${isLoading ? 'loading' : ''}`}
                    onClick={handleGrade}
                    disabled={!question || !studentAnswer || isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                    {isLoading ? 'Grading...' : 'Grade Answer'}
                </button>
            </div>
        </div>

        {/* Right Column: Results (Sticky) */}
        <div className="lg:col-span-1">
            {gradingResult ? (
                <div className="card bg-base-100 border border-base-200 shadow-xl sticky top-8">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="card-title text-xl">Results</h2>
                            <div className={`badge ${gradingResult.grading_result.percentage >= 50 ? 'badge-success' : 'badge-error'} badge-lg text-white font-semibold`}>
                                {gradingResult.grading_result.percentage >= 50 ? 'PASS' : 'FAIL'}
                            </div>
                        </div>
                        
                        {/* Score Circle */}
                        <div className="flex justify-center mb-8">
                            <div className="radial-progress text-primary font-bold text-3xl" style={{"--value": gradingResult.grading_result.percentage, "--size": "8rem", "--thickness": "0.8rem"}} role="progressbar">
                                {gradingResult.grading_result.percentage}%
                            </div>
                        </div>

                        <div className="text-center mb-6">
                            <span className="text-4xl font-extrabold">{gradingResult.grading_result.total_marks_awarded}</span>
                            <span className="text-xl text-base-content/50"> / {gradingResult.grading_result.total_possible_marks}</span>
                            <p className="text-sm font-medium opacity-60 mt-1">Total Score</p>
                        </div>

                        <div className="divider my-4"></div>

                        {/* Brief Stats */}
                        <div className="space-y-4">
                            <div className="bg-base-200 rounded-lg p-3">
                                <h4 className="font-bold text-xs uppercase opacity-50 mb-1">Feedback</h4>
                                <p className="text-sm leading-relaxed">{gradingResult.grading_result.overall_feedback}</p>
                            </div>
                            
                            {/* Detailed Breakdown Toggle */}
                            <div className="collapse collapse-arrow border border-base-200 rounded-lg">
                                <input type="checkbox" /> 
                                <div className="collapse-title font-medium text-sm">
                                    Show Default Breakdown
                                </div>
                                <div className="collapse-content text-xs"> 
                                    {gradingResult.grading_result.component_breakdown?.map((item, index) => (
                                        <div key={index} className="mb-2 pb-2 border-b border-base-200 last:border-0">
                                            <div className="flex justify-between font-bold mb-1">
                                                <span>{item.component}</span>
                                                <span>{item.marks_awarded}/{item.max_marks}</span>
                                            </div>
                                            <p className="opacity-70">{item.feedback}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 border border-base-200 h-full min-h-[400px] flex items-center justify-center text-center p-8">
                    <div className="opacity-40 max-w-xs">
                        <CheckCircle size={48} className="mx-auto mb-4" />
                        <h3 className="font-bold text-lg">No Results Yet</h3>
                        <p className="text-sm mt-2">Fill out the form to generate a report.</p>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Correction;
