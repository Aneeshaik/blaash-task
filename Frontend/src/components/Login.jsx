import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const navigate = useNavigate();

    const sendOtp = async () => {
        try {
            const response = await fetch('http://localhost:3000/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            localStorage.setItem('email', email);
            const data = await response.json();
            if (data.success) {
                alert('OTP sent to your email.');
                setIsOtpSent(true);
            } else {
                alert('Error sending OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await fetch('http://localhost:3000/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });
            const data = await response.json();
            if (data.success) {
                alert('OTP verified successfully');
                setIsOtpVerified(true);
                window.location.href = 'http://localhost:3000/auth/google';
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100vh' }}>
            {!isOtpSent ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <div style={{backgroundColor: '#27272f', padding: '20px', borderRadius: '10px'}}>
                    <h3 style={{color: '#fff', textAlign: 'center'}}>Login with Email</h3>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{marginBottom: '10px', padding: '10px 15px', borderRadius: '10px', width: '300px !important' }}
                    />
                    <button onClick={sendOtp} style={{ padding: '10px 15px', backgroundColor: '#006BCE', color: '#fff', borderRadius: '10px', border: '0px', cursor: 'pointer' }}>Send OTP</button>
                    </div>
                    </div>
                </div>
            ) : !isOtpVerified && (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <div style={{backgroundColor: '#27272f', padding: '20px', borderRadius: '10px'}}>
                    <h3 style={{color: '#fff', textAlign: 'center'}}>Verify OTP</h3>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
                    <input
                        type="text"
                        placeholder="Enter the OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{ display: 'block', marginBottom: '10px', padding: '10px 15px', borderRadius: '10px', width: '300px !important' }}
                    />
                    <button onClick={verifyOtp} style={{ padding: '10px 15px', backgroundColor: '#006BCE', color: '#fff', borderRadius: '10px', border: '0px', cursor: 'pointer' }}>Verify OTP</button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
