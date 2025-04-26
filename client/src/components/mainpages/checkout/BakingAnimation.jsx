import React from 'react';
import Lottie from 'react-lottie';
import bakingAnimation from '../../../images/baking.json';

const BakingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: bakingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="w-64 h-64">
        <Lottie options={defaultOptions} />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Baking your order...</h2>
        <p className="text-gray-600 mt-2">Please wait while we process your payment</p>
      </div>
    </div>
  );
};

export default BakingAnimation;