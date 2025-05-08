import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import GoogalLogo from './img/glogo.png';
import { IoMdAdd } from "react-icons/io";

function UserRegister() {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phone: '',
        skills: [],
        bio: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [userEnteredCode, setUserEnteredCode] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSkill = () => {
        if (skillInput.trim()) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('profilePictureInput').click();
    };

    const sendVerificationCode = async (email) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('verificationCode', code);
        try {
            await fetch('http://localhost:8080/sendVerificationCode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (formData.skills.length < 2) {
            alert("Please add at least two skills.");
            isValid = false;
        }
        if (!isValid) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    skills: formData.skills,
                    bio: formData.bio,
                }),
            });

            if (response.ok) {
                const userId = (await response.json()).id;

                if (profilePicture) {
                    const profileFormData = new FormData();
                    profileFormData.append('file', profilePicture);
                    await fetch(`http://localhost:8080/user/${userId}/uploadProfilePicture`, {
                        method: 'PUT',
                        body: profileFormData,
                    });
                }

                sendVerificationCode(formData.email);
                setIsVerificationModalOpen(true);
            } else if (response.status === 409) {
                alert('Email already exists!');
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerifyCode = () => {
        const savedCode = localStorage.getItem('verificationCode');
        if (userEnteredCode === savedCode) {
            alert('Verification successful!');
            localStorage.removeItem('verificationCode');
            window.location.href = '/';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.fullname || !formData.email || !formData.password || !formData.phone) {
                alert("Please fill all required fields");
                return;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                alert("Email is invalid");
                return;
            }
            if (!profilePicture) {
                alert("Profile picture is required");
                return;
            }
        }
        setCurrentStep(2);
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="form-field">
                            <div className="profile-icon-container" onClick={triggerFileInput}>
                                {previewImage ? (
                                    <img src={previewImage} alt="Selected Profile" className="selectedimagepreview" />
                                ) : (
                                    <FaUserCircle className="profileicon" />
                                )}
                            </div>
                            <input
                                id="profilePictureInput"
                                className="hidden-input"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="text"
                                name="fullname"
                                placeholder="Full Name"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    const re = /^[0-9\b]{0,10}$/;
                                    if (re.test(e.target.value)) {
                                        handleInputChange(e);
                                    }
                                }}
                                maxLength="10"
                                pattern="[0-9]{10}"
                                title="Please enter exactly 10 digits."
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="signin-btn" onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="form-field">
                            <div className="skills-container">
                                <div className="skills-list">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                                <div className="skill-input-group">
                                    <input
                                        type="text"
                                        placeholder="Add Skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                        style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            padding: '0.875rem',
                                            fontSize: '1rem',
                                            backgroundColor: 'white',
                                        }}
                                    />
                                    <button type="button" onClick={handleAddSkill} style={{color: '#4f46e5'}}>
                                        <IoMdAdd size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-field">
                            <textarea
                                name="bio"
                                placeholder="Tell us about yourself"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={3}
                                required
                                style={{
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                    padding: '0.875rem',
                                    fontSize: '1rem',
                                    backgroundColor: 'white',
                                    width: '100%',
                                }}
                            />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="back-btn" onClick={prevStep}>
                                Back
                            </button>
                            <button type="submit" className="signin-btn">
                                Create Account
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="login-page">
            <div className="login-left">
                <div className="brand-section">
                    <h1>BlogSpace</h1>
                    <p>Share your stories with the world</p>
                </div>
            </div>
            
            <div className="login-right">
                <div className="login-form-container">
                    <h2>Create Account</h2>
                    <p className="welcome-text">Start your journey with us today!</p>

                    <div className="stepper">
                        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                            <div className="step-number" style={{ backgroundColor: '#E6A817' }}>1</div>
                            <span style={{ color: currentStep >= 1 ? '#E6A817' : '#64748b' }}>Personal Info</span>
                        </div>
                        <div className={`step-line ${currentStep === 2 ? 'active' : ''}`} 
                             style={{ backgroundColor: currentStep === 2 ? '#D4901F' : '#e2e8f0' }}></div>
                        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                            <div className="step-number" style={{ backgroundColor: currentStep === 2 ? '#D4901F' : '#e2e8f0' }}>2</div>
                            <span style={{ color: currentStep === 2 ? '#D4901F' : '#64748b' }}>Additional Info</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {renderStep()}
                    </form>

                    {currentStep === 1 && (
                        <>
                            <div className="separator">
                                <span>or continue with</span>
                            </div>

                            <button 
                                type="button" 
                                className="google-button"
                                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                            >
                                <img src={GoogalLogo} alt="Google" />
                                Google
                            </button>

                            <p className="signup-prompt">
                                Already have an account?
                                <span onClick={() => window.location.href = '/'}>
                                    Sign In
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserRegister;
