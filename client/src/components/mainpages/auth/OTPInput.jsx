import React, { useState, useRef, useEffect } from 'react';

function OTPInput({ length = 6, onComplete, isLoading = false }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        // Only allow numeric input
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Auto-move to next input
        if (element.value !== "" && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Auto-submit when all digits are filled
        if (newOtp.every(digit => digit !== "")) {
            const otpValue = newOtp.join("");
            onComplete(otpValue);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1].focus();
            } else if (otp[index] !== "") {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedOtp = pastedData.replace(/\D/g, '').slice(0, length).split('');

        if (pastedOtp.length > 0) {
            const newOtp = [...otp];
            pastedOtp.forEach((digit, index) => {
                if (index < length) {
                    newOtp[index] = digit;
                }
            });
            setOtp(newOtp);

            // Focus on the last filled input or the next empty one
            const lastFilledIndex = newOtp.findIndex(digit => digit === "");
            const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
            inputRefs.current[focusIndex].focus();

            // Auto-submit if all filled
            if (newOtp.every(digit => digit !== "")) {
                const otpValue = newOtp.join("");
                onComplete(otpValue);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 my-8">
            {/* OTP Input Container - Fixed width to prevent wrapping */}
            <div className="flex gap-2 sm:gap-3 justify-center items-center">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                        onPaste={handlePaste}
                        ref={(el) => (inputRefs.current[index] = el)}
                        className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 text-xl sm:text-2xl md:text-3xl font-black text-center text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        disabled={isLoading}
                        aria-label={`OTP digit ${index + 1}`}
                    />
                ))}
            </div>

            {isLoading && (
                <div className="flex items-center gap-2 animate-in fade-in duration-300">
                    <span className="loading loading-spinner loading-sm text-pink-600"></span>
                    <p className="text-pink-600 text-sm font-bold">Verifying OTP...</p>
                </div>
            )}
        </div>
    );
}

export default OTPInput;

