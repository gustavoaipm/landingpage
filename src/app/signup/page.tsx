import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Coming soon! This feature is under development.
        </p>
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
