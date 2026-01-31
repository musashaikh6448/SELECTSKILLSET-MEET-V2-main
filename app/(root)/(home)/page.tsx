'use client';
import MeetingTypeList from '@/components/MeetingTypeList';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleStartInstantMeeting = () => {
    // This would typically open the instant meeting modal
    // For now, let's navigate to a meeting page
    router.push('/personal-room');
  };

  const handleLearnMore = () => {
    // Open SelectSkillSet about page in new tab
    window.open('https://selectskillset.com/about', '_blank');
  };

  return (
    <section className="flex size-full flex-col gap-12 pb-16 text-gray-900 relative overflow-hidden">
      {/* Hero Section */}
      <motion.div
        className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 border border-gray-100 shadow-xl "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 opacity-10 bg-hero bg-cover bg-center" />

        <div className="relative  flex h-full flex-col justify-center p-8 lg:p-16">
          <motion.div
            className="flex max-w-3xl flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Modern video meetings, simplified
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Create, join, and manage meetings instantly with a clean light
              interface and blazing performance.
            </motion.p>

            {/* Call to Action Buttons */}
            <motion.div
              className="flex flex-wrap gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <button
                onClick={handleStartInstantMeeting}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Start Instant Meeting
              </button>
              <button
                onClick={handleLearnMore}
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors hover:shadow-lg transform hover:-translate-y-0.5 "
              >
                Learn More
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="80" cy="20" r="20" fill="white" />
            <circle cx="70" cy="70" r="15" fill="white" />
          </svg>
        </div>
      </motion.div>

      {/* Meeting Types Section */}
      <motion.div
        className="relative "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-6 text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Start a Meeting
        </motion.h2>
        <MeetingTypeList />
      </motion.div>

      {/* Features Grid */}
      <motion.div
        className="relative "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold mb-6 text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          Why Choose Our Platform?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure by default
            </h3>
            <p className="text-gray-600">
              End-to-end encryption and modern security practices ensure your
              meetings remain private.
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fast and reliable
            </h3>
            <p className="text-gray-600">
              Low-latency video powered by advanced WebRTC technology ensures
              smooth communication.
            </p>
          </motion.div>

          <motion.div
            className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Simple sharing
            </h3>
            <p className="text-gray-600">
              Share a single URL and your meeting room is ready instantly for
              participants to join.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
