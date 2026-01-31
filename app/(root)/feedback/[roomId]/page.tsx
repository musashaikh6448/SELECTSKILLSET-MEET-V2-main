'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Star,
  MessageSquare,
  User,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

const interviewerQuestions = [
  {
    id: 'edu-1',
    question: 'Has relevant educational background for the role',
    answers: [
      "Completed Bachelor's in Computer Science and relevant online courses.",
      'Has relevant degree in the field.',
      'Shows strong academic foundation.',
      'Has additional certifications in relevant areas.',
    ],
  },
  {
    id: 'edu-2',
    question: 'Demonstrated strong academic performance',
    answers: [
      'Graduated with first-class distinction.',
      'Maintained high GPA throughout studies.',
      'Received academic awards or recognition.',
      'Shows consistent academic excellence.',
    ],
  },
  {
    id: 'edu-3',
    question: 'Shows commitment to continuous learning',
    answers: [
      'Regularly takes new certifications and participates in hackathons.',
      'Stays updated with latest industry trends.',
      'Participates in online courses and workshops.',
      'Shows initiative in self-improvement.',
    ],
  },
  {
    id: 'edu-4',
    question: 'Has relevant certifications or training',
    answers: [
      'Certified in AWS Cloud Practitioner and React.js.',
      'Has industry-recognized certifications.',
      'Completed relevant training programs.',
      'Shows commitment to professional development.',
    ],
  },
  {
    id: 'tech-1',
    question: 'Demonstrated strong technical skills',
    answers: [
      'Excellent in React, Node.js, and MongoDB development.',
      'Shows proficiency in required technologies.',
      'Can solve complex technical problems.',
      'Demonstrates deep understanding of technical concepts.',
    ],
  },
  {
    id: 'comm-1',
    question: 'Communicated ideas clearly and effectively',
    answers: [
      'Explained project workflows with clear reasoning and examples.',
      'Articulated thoughts in a structured manner.',
      'Used appropriate technical terminology.',
      'Made complex concepts easy to understand.',
    ],
  },
  {
    id: 'int-1',
    question: 'Shows genuine enthusiasm for the role',
    answers: [
      'Very motivated to join a fast-paced environment and contribute to team success.',
      'Demonstrated passion for the industry.',
      'Shows excitement about the opportunity.',
      'Expressed genuine interest in the company.',
    ],
  },
  {
    id: 'org-1',
    question: 'Came well-prepared for the interview',
    answers: [
      'Reviewed company projects, values, and recent releases in advance.',
      'Researched the company thoroughly.',
      'Prepared thoughtful questions about the role.',
      'Shows genuine interest in the organization.',
    ],
  },
  {
    id: 'init-1',
    question: 'Shows proactive approach to work',
    answers: [
      'Frequently identifies issues early and suggests improvements.',
      'Takes initiative without being asked.',
      'Proactively seeks solutions to problems.',
      'Shows self-motivation and drive.',
    ],
  },
  {
    id: 'rec-1',
    question: 'Strongly recommend for hire',
    answers: [
      'Would be a great fit for this position due to both technical and interpersonal strengths.',
      'Meets all requirements and shows potential for growth.',
      'Would add value to the team immediately.',
      'Shows all qualities needed for success in this role.',
    ],
  },
];

const candidateQuestions = [
  {
    id: 'clarity',
    question: "How clearly did the interviewer communicate and explain things?",
    answers: [
      "Everything was explained very clearly and easy to follow.",
      "Mostly clear, with only a few moments of confusion.",
      "Sometimes hard to understand or not well explained.",
      "Frequently unclear or confusing.",
    ],
  },
  {
    id: 'professionalism',
    question: "How would you describe the interviewer’s professionalism and respect?",
    answers: [
      "Very polite, respectful, and professional throughout.",
      "Generally professional and courteous.",
      "Occasionally seemed impatient or distracted.",
      "Unprofessional or disrespectful behavior noticed.",
    ],
  },
  {
    id: 'knowledge',
    question: "Did the interviewer seem knowledgeable about the role and company?",
    answers: [
      "Had a strong understanding of the role and company details.",
      "Knew most of the important points about the role.",
      "Seemed unsure about a few aspects of the position.",
      "Did not seem familiar with the role or company.",
    ],
  },
  {
    id: 'interest',
    question: "Did the interviewer seem genuinely interested in what you shared?",
    answers: [
      "Very engaged and interested in my answers.",
      "Listened most of the time with fair interest.",
      "Seemed distracted or only partially listening.",
      "Did not seem interested or responsive at all.",
    ],
  },
  {
    id: 'behavior',
    question: "How would you describe the interviewer’s behavior and attitude?",
    answers: [
      "Very friendly, positive, and encouraging.",
      "Polite and neutral in behavior.",
      "A bit rushed or impatient at times.",
      "Rude or negative attitude noticed.",
    ],
  },
  {
    id: 'structure',
    question: "Was the interview process organized and easy to follow?",
    answers: [
      "Very well-organized with a smooth flow.",
      "Mostly organized but could be improved.",
      "A bit unstructured or confusing at times.",
      "Poorly planned and hard to follow.",
    ],
  },
  {
    id: 'time',
    question: "Was the interview conducted within the expected time limit?",
    answers: [
      "Perfectly timed — not too long or short.",
      "Slightly longer or shorter but fine overall.",
      "Felt rushed or went too long.",
      "Very poor time management.",
    ],
  },
  {
    id: 'opportunity',
    question: "Did you get a chance to ask your own questions during the interview?",
    answers: [
      "Yes, the interviewer encouraged my questions and answered clearly.",
      "Yes, but only briefly.",
      "Not much time was given for my questions.",
      "No opportunity to ask any questions.",
    ],
  },
  {
    id: 'fairness',
    question: "Were the interview questions fair and related to the job?",
    answers: [
      "All questions were fair and relevant to the role.",
      "Most questions were fair and related.",
      "Some questions felt unrelated or unclear.",
      "Many questions seemed unfair or irrelevant.",
    ],
  },
  {
    id: 'communication',
    question: "How would you rate the interviewer’s overall communication skills?",
    answers: [
      "Excellent — clear, confident, and easy to talk to.",
      "Good — communicated well most of the time.",
      "Okay — a bit unclear at times.",
      "Poor — hard to communicate or understand.",
    ],
  },
  {
    id: 'next-steps',
    question: "Did the interviewer clearly explain what happens after the interview?",
    answers: [
      "Yes, next steps were explained clearly.",
      "Partly explained but not very detailed.",
      "Unclear about what happens next.",
      "No information given about next steps.",
    ],
  },
  {
    id: 'overall',
    question: "How would you describe your overall interview experience?",
    answers: [
      "Excellent — very positive and professional experience.",
      "Good — mostly positive, with a few small issues.",
      "Average — okay but could be better.",
      "Poor — not a good experience overall.",
    ],
  },
];


const FeedbackPage = ({ params }: { params: { roomId: string } }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateName = searchParams.get('name') || 'Candidate';
  const userType = searchParams.get('usertype') || 'candidate';
  const candidateId = searchParams.get('candidateId');
  const interviewerId = searchParams.get('interviewerId');

  // Get room ID from URL params
  const roomId = params.roomId;

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [overallRating, setOverallRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const isInterviewer = userType === 'interviewer';
  const questions = isInterviewer ? interviewerQuestions : candidateQuestions;
  const totalSteps = questions.length + 2; // +1 for welcome, +1 for notes

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate required parameters
    if (!roomId) {
      setSubmitError(
        'Room ID is missing. Please ensure you accessed this page from a valid meeting link.',
      );
      setIsSubmitting(false);
      return;
    }

    if (!candidateId) {
      setSubmitError(
        'Candidate ID is missing. Please ensure you accessed this page from a valid meeting link.',
      );
      setIsSubmitting(false);
      return;
    }

    if (!interviewerId) {
      setSubmitError(
        'Interviewer ID is missing. Please ensure you accessed this page from a valid meeting link.',
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        candidateId,
        interviewerId,
        interviewRequestId: roomId,
        userType,
        feedback: {
          questions: questions.map((q) => ({
            question: q.question,
            answer: selectedAnswers[q.id] || 'No answer provided',
          })),
          overallRating: overallRating.toString(),
          additionalNotes: additionalNotes.trim(),
        },
        timestamp: new Date().toISOString(),
      };

      // Use fallback API endpoint if environment variable is not set
      const apiEndpoint = process.env.NEXT_PUBLIC_API_BASE_URL
        ? isInterviewer
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/interviewer/feedback`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/candidate/feedback`
        : '/api/feedback';

      // Call API using axios
      const response = await axios.post(apiEndpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 second timeout
      });

      if (response.status === 200 || response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/?feedback=submitted');
        }, 3000);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);

      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || 'Server error';
          setSubmitError(`Failed to submit feedback: ${errorMessage}`);
        } else if (error.request) {
          // Request was made but no response received
          setSubmitError(
            'Failed to submit feedback: Network error. Please check your connection.',
          );
        } else {
          // Something else happened
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
    if (step === 1) return 'Welcome';
    if (step === totalSteps - 1) return 'Overall Rating';
    if (step === totalSteps) return 'Additional Notes';
    return `Question ${step - 1} of ${questions.length}`;
  };


  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep <= questions.length + 1) {
      const questionIndex = currentStep - 2;
      const question = questions[questionIndex];
      return question ? selectedAnswers[question.id] : false;
    }
    if (currentStep === totalSteps - 1) return overallRating > 0;
    return true;
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Feedback Form
            </h2>
            <p className="text-gray-600">
              Please wait while we prepare your feedback form...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isInterviewer ? 'Candidate Evaluation' : 'Interview Feedback'}
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              {isInterviewer
                ? `Evaluate ${candidateName}'s performance in the interview`
                : `Provide feedback about your interview experience with the interviewer`}
            </p>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{getStepTitle(currentStep)}</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {isInterviewer
                      ? 'Candidate Evaluation Process'
                      : 'Interview Feedback Process'}
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {isInterviewer
                      ? `Please evaluate ${candidateName}'s performance across different areas. Your assessment will help us make informed hiring decisions.`
                      : `Thank you for participating in the interview. Your feedback about the interview process will help us improve our hiring experience.`}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Process Overview
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-2 text-left">
                    <li>• Answer {questions.length} comprehensive questions</li>
                    <li>• Provide an overall rating</li>
                    <li>• Add any additional notes (optional)</li>
                    <li>• Submit your feedback</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Questions */}
            {currentStep > 1 && currentStep <= questions.length + 1 && (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                {(() => {
                  const questionIndex = currentStep - 2;
                  const question = questions[questionIndex];

                  if (!question) return null;

                  return (
                    <>
                      <div className="text-center mb-8">
                        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                          Question {questionIndex + 1} of {questions.length}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {question.question}
                        </h3>
                        <p className="text-gray-600">
                          Please select the most appropriate answer
                        </p>
                      </div>

                      <div className="space-y-4">
                        {question.answers.map((answer, index) => (
                          <label
                            key={index}
                            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
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
                              onChange={() =>
                                handleAnswerSelect(question.id, answer)
                              }
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 leading-relaxed">
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
                className="p-8 text-center space-y-8"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Overall Rating
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Please provide an overall rating for this{' '}
                    {isInterviewer ? 'candidate' : 'interview experience'}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setOverallRating(rating)}
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xl transition-all hover:scale-110 ${
                        overallRating === rating
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                          : 'border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
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
                className="p-8 space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Additional Notes
                  </h3>
                  <p className="text-gray-600">
                    Add any additional comments or observations (optional)
                  </p>
                </div>

                {/* Overall Rating Display */}
                {overallRating > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Star className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Your Overall Rating</h4>
                    </div>
                    <div className="flex justify-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div
                          key={rating}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            rating <= overallRating
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {rating}
                        </div>
                      ))}
                    </div>
                    <p className="text-blue-800 font-medium text-center">
                      You rated this {isInterviewer ? 'candidate' : 'interview'}{' '}
                      a{' '}
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

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Feedback Summary
                  </h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Questions answered: {Object.keys(selectedAnswers).length}/
                      {questions.length}
                    </p>
                    <p>Overall rating: {overallRating}/5</p>
                    <p>
                      Additional notes: {additionalNotes.trim() ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Feedback Submitted Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for your feedback. Your response has been recorded
                    and will help us improve our processes.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-green-800 text-sm">
                    You will be redirected to the home page shortly...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg mx-8 mb-4"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 font-medium">{submitError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Footer */}
          {!isSuccess && (
            <div className="border-t bg-gray-50 px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {Object.keys(selectedAnswers).length} answered
                  </span>

                  {currentStep < totalSteps ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !canProceed()}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
