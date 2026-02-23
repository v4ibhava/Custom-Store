import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

function OTPInput({ length = 6, onComplete, isLoading = false }) {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        if (newOtp.every(digit => digit !== "")) {
            const otpValue = newOtp.join("");
            onComplete(otpValue);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1].focus();
            } else if (otp[index] !== "") {
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

            const lastFilledIndex = newOtp.findIndex(digit => digit === "");
            const focusIndex = lastFilledIndex === -1 ? length - 1 : lastFilledIndex;
            inputRefs.current[focusIndex].focus();

            if (newOtp.every(digit => digit !== "")) {
                const otpValue = newOtp.join("");
                onComplete(otpValue);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 my-4">
            <div className="flex gap-3 justify-center items-center">
                {otp.map((data, index) => (
                    <div key={index} className="relative">
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => e.target.select()}
                            onPaste={handlePaste}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className={`
                                w-11 h-14 sm:w-12 sm:h-16
                                text-2xl font-black text-center 
                                text-gray-900 bg-white
                                border-2 rounded-2xl
                                transition-all duration-200
                                focus:outline-none focus:scale-105
                                ${data
                                    ? 'border-pink-500 bg-pink-50/10'
                                    : 'border-gray-100 bg-gray-50/30 hover:border-pink-200'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                            disabled={isLoading}
                            aria-label={`OTP digit ${index + 1}`}
                        />
                        {data && (
                            <motion.div
                                layoutId="dot"
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-pink-500"
                            />
                        )}
                    </div>
                ))}
            </div>

            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className="w-2 h-2 rounded-full bg-pink-500"
                            />
                        ))}
                    </div>
                    <p className="text-pink-500 text-xs font-bold tracking-widest uppercase">Verifying</p>
                </motion.div>
            )}
        </div>
    );
}

export default OTPInput;

