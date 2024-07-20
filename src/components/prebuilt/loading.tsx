import React from 'react';

const LoadingMap = () => {
  return (
    <div className='relative h-full w-full md:h-[80vh] md:w-auto md:mb-2 rounded'>
      <div className='absolute inset-0 flex items-center justify-center text-gray-500 font-semibold'>
        Loading Map...
      </div>
    </div>
  );
}

export default LoadingMap;