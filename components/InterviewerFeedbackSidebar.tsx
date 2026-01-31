'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  User, 
  X, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  Download,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const interviewerQuestions = [
  {
    id: 'edu-1',
    question: 'How would you describe the candidate’s educational background?',
    answers: [
      'Has a strong educational foundation relevant to the job.',
      'Educational background is fairly related to the position.',
      'Education is somewhat related but lacks depth in key areas.',
      'Education does not match the requirements of the role.',
    ],
  },
  {
    id: 'exp-1',
    question: 'How relevant and valuable is the candidate’s past work experience?',
    answers: [
      'Highly relevant experience with clear achievements and growth.',
      'Has good experience that fits most of the job requirements.',
      'Limited relevant experience but shows potential to adapt.',
      'Experience is not related or sufficient for the role.',
    ],
  },
  {
    id: 'tech-1',
    question: 'How would you rate the candidate’s technical skills?',
    answers: [
      'Excellent technical knowledge and problem-solving ability.',
      'Good technical understanding with some minor gaps.',
      'Basic technical skills that need improvement.',
      'Lacks technical proficiency for the position.',
    ],
  },
  {
    id: 'comm-1',
    question: 'How well did the candidate communicate during the interview?',
    answers: [
      'Communicated ideas clearly and confidently.',
      'Generally clear but sometimes needed clarification.',
      'Struggled to express thoughts effectively.',
      'Poor communication and unclear responses.',
    ],
  },
  {
    id: 'int-1',
    question: 'How interested and motivated did the candidate seem about the role?',
    answers: [
      'Showed strong enthusiasm and clear motivation to join.',
      'Appeared interested but not deeply engaged.',
      'Showed limited enthusiasm or unclear career motivation.',
      'Seemed disinterested or unmotivated about the role.',
    ],
  },
  {
    id: 'org-1',
    question: 'How well did the candidate understand our company and the position?',
    answers: [
      'Clearly researched our company and understood the role well.',
      'Had some basic knowledge of the company and role.',
      'Limited understanding of our organization.',
      'No preparation or awareness about the company.',
    ],
  },
  {
    id: 'team-1',
    question: 'How strong are the candidate’s teamwork and interpersonal skills?',
    answers: [
      'Excellent team player — communicates and collaborates naturally.',
      'Good teamwork skills but could be more assertive or flexible.',
      'Some difficulty collaborating or adjusting to team dynamics.',
      'Poor interpersonal or teamwork abilities.',
    ],
  },
  {
    id: 'init-1',
    question: 'How proactive or self-motivated is the candidate?',
    answers: [
      'Very proactive and takes initiative naturally.',
      'Shows motivation with occasional guidance needed.',
      'Sometimes waits for direction or lacks drive.',
      'Shows little initiative or ownership.',
    ],
  },
  {
    id: 'time-1',
    question: 'How effective is the candidate at managing time and tasks?',
    answers: [
      'Manages time and priorities efficiently.',
      'Generally organized but could improve planning.',
      'Sometimes loses focus or misses time balance.',
      'Poor time management and organization skills.',
    ],
  },
  {
    id: 'cs-1',
    question: 'If applicable, how well does the candidate handle customer or client situations?',
    answers: [
      'Excellent customer focus — empathetic and solution-oriented.',
      'Good with customers but can improve communication tone.',
      'Basic customer understanding but lacks confidence.',
      'Struggles to handle customer interactions professionally.',
    ],
  },
  {
    id: 'beh-1',
    question: 'How would you describe the candidate’s behavior and attitude during the interview?',
    answers: [
      'Very positive, respectful, and confident attitude.',
      'Professional attitude with minor nervousness or hesitation.',
      'Neutral or inconsistent attitude at times.',
      'Unprofessional or negative behavior observed.',
    ],
  },
  {
    id: 'prob-1',
    question: 'How well did the candidate handle problem-solving or critical thinking tasks?',
    answers: [
      'Strong analytical thinker — provided creative and logical solutions.',
      'Good reasoning skills with minor gaps in logic.',
      'Struggled with complex or situational questions.',
      'Unable to demonstrate problem-solving ability.',
    ],
  },
  {
    id: 'fit-1',
    question: 'How well do you think the candidate fits our team and culture?',
    answers: [
      'Excellent cultural and team fit — would blend in well.',
      'Good fit with minor areas to adapt.',
      'Neutral fit — unsure how well they’d adjust.',
      'Not a good cultural or team fit.',
    ],
  },
  {
    id: 'rec-1',
    question: 'What is your overall recommendation for this candidate?',
    answers: [
      'Strongly recommend for hire.',
      'Recommend with some reservations.',
      'Would consider for other roles or future opportunities.',
      'Do not recommend for this position.',
    ],
  },
];


interface InterviewerFeedbackSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateId: string;
  interviewerId: string;
  roomId: string;
}

const InterviewerFeedbackSidebar = ({ 
  isOpen, 
  onClose, 
  candidateName, 
  candidateId, 
  interviewerId, 
  roomId 
}: InterviewerFeedbackSidebarProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [overallRating, setOverallRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const totalSteps = interviewerQuestions.length + 2; // +1 for overall rating, +1 for notes
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload = {
        candidateId,
        interviewerId,
        interviewRequestId: roomId,
        userType: 'interviewer',
        feedback: {
          questions: interviewerQuestions.map(q => ({
            question: q.question,
            answer: selectedAnswers[q.id] || 'No answer provided'
          })),
          overallRating: overallRating.toString(),
          additionalNotes: additionalNotes.trim()
        },
        timestamp: new Date().toISOString()
      };

      // Use a fallback API endpoint if environment variable is not set
      const apiEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/interviewer/feedback`
        : '/api/feedback';

      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      });

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Server error';
          setSubmitError(`Failed to submit feedback: ${errorMessage}`);
        } else if (error.request) {
          setSubmitError('Failed to submit feedback: Network error. Please check your connection.');
        } else {
          setSubmitError('Failed to submit feedback: Please try again.');
        }
      } else {
        setSubmitError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step: number) => {
    if (step === 1) return "Welcome";
    if (step === totalSteps - 1) return "Overall Rating";
    if (step === totalSteps) return "Additional Notes";
    return `Question ${step - 1} of ${interviewerQuestions.length}`;
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep <= interviewerQuestions.length + 1) {
      const questionIndex = currentStep - 2;
      const question = interviewerQuestions[questionIndex];
      return question ? selectedAnswers[question.id] : false;
    }
    if (currentStep === totalSteps - 1) return overallRating > 0;
    return true;
  };

  const handleDownload = () => {
    const data = {
      candidateName,
      candidateId,
      interviewerId,
      roomId,
      feedback: {
        questions: interviewerQuestions.map(q => ({
          question: q.question,
          answer: selectedAnswers[q.id] || 'No answer provided'
        })),
        overallRating,
        additionalNotes
      },
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${candidateName}-${roomId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop for mobile */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isMobile ? 0 : 400 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed ${
          isMobile 
            ? 'inset-0 z-50' 
            : 'right-0 top-0 h-full z-50'
        } bg-white shadow-2xl flex flex-col ${
          isMobile ? 'w-full' : 'w-96 lg:w-[28rem] xl:w-[32rem]'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg lg:text-xl font-bold">Candidate Evaluation</h2>
                <p className="text-white/90 text-sm">
                  Evaluating {candidateName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-white/90 mb-2">
              <span>{getStepTitle(currentStep)}</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div 
                className="bg-white h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 max-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Candidate Evaluation
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Please evaluate {candidateName}'s performance across different areas. 
                    Your assessment will help us make informed hiring decisions.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Evaluation Process</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Answer 10 comprehensive questions</li>
                    <li>• Provide an overall rating</li>
                    <li>• Add any additional notes</li>
                    <li>• Submit your feedback</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Questions */}
            {currentStep > 1 && currentStep <= interviewerQuestions.length + 1 && (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {(() => {
                  const questionIndex = currentStep - 2;
                  const question = interviewerQuestions[questionIndex];
                  
                  if (!question) return null;
                  
                  return (
                    <>
                      <div className="text-center mb-6">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
                          Question {currentStep - 1} of {interviewerQuestions.length}
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {question.question}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Select the most appropriate answer
                        </p>
                      </div>

                      <div className="space-y-3">
                        {question.answers.map((answer, index) => (
                          <label
                            key={index}
                            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              selectedAnswers[question.id] === answer
                                ? 'bg-blue-50 border-blue-500 shadow-md'
                                : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={answer}
                              checked={selectedAnswers[question.id] === answer}
                              onChange={() => handleAnswerSelect(question.id, answer)}
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 leading-relaxed">
                              {answer}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {/* Overall Rating */}
            {currentStep === totalSteps - 1 && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Overall Rating
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Please provide an overall rating for this candidate
                  </p>
                </div>

                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setOverallRating(rating)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-lg transition-all hover:scale-110 ${
                        overallRating === rating
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                          : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>

                {overallRating > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      You rated this candidate a <span className="font-bold text-blue-600">{overallRating}/5</span>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Additional Notes */}
            {currentStep === totalSteps && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Additional Notes
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Add any additional comments or observations
                  </p>
                </div>

                {/* Overall Rating Display */}
                {overallRating > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Star className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Your Overall Rating</h4>
                    </div>
                    <div className="flex justify-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div
                          key={rating}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            rating <= overallRating
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {rating}
                        </div>
                      ))}
                    </div>
                    <p className="text-blue-800 font-medium text-center text-sm">
                      You rated this candidate a{' '}
                      <span className="font-bold text-blue-600">
                        {overallRating}/5
                      </span>
                    </p>
                  </div>
                )}

                <Textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Enter any additional comments, observations, or recommendations..."
                  className="min-h-32 resize-none"
                />

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Feedback Summary</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Questions answered: {Object.keys(selectedAnswers).length}/{interviewerQuestions.length}</p>
                    <p>Overall rating: {overallRating}/5</p>
                    <p>Additional notes: {additionalNotes.trim() ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Feedback Submitted!
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Thank you for your evaluation. The feedback has been recorded successfully.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-medium text-sm">{submitError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 lg:p-6 flex-shrink-0">
          <div className="flex flex-col gap-4">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress: {currentStep} of {totalSteps}</span>
              <span>{Object.keys(selectedAnswers).length} questions answered</span>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {currentStep > 1 && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                )}
              </div>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewerFeedbackSidebar;
