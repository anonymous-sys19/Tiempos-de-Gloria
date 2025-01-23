interface ErrorDisplayProps {
    message: string;
  }
  
  export function ErrorDisplay({ message }: ErrorDisplayProps) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    );
  }