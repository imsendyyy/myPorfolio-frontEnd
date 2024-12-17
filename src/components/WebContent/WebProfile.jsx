import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import config from '../config';
import Loading from '../Admin/Loading';

const WebProfile = () => {
    const [profileData, setProfileData] = useState(null);

    // Fetch data from the backend
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await axios.get(`${config.API_URL}userInfo/getUserInfo`);
                setProfileData(res.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        fetchProfileData();
    }, []);

    const extractYear = (dateString) => {
        return new Date(dateString).getFullYear();
    };

    if (!profileData) {
        return <Loading />;
    }

    return (
        <section
            id="myprofile"
            className="flex flex-col items-center bg-white text-black px-0 py-10 sm:px-8 relative"
        >
            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className="w-80 h-80 bg-yellow-100 rounded-full blur-3xl absolute top-10 left-10"></div>
                <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl absolute bottom-40 right-20"></div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen md:flex-row items-center max-w-6xl space-y-8 md:space-y-0 md:space-x-12 relative z-10 mb-10">
                {/* Left: Profile Image */}
                <div className="flex-shrink-0">
                    {profileData.profileImage ? (
                        <div className="w-[200px] h-[200px] sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 perspective-effect">
                            <img
                                src={profileData.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-lg shadow-lg transform rotateY-15"
                                style={{
                                    perspective: "1500px",
                                    transform: "rotateY(15deg)",
                                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                                }}
                            />
                        </div>
                    ) : (
                        <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>

                {/* Right: Profile Details */}
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-bold leading-tight">
                        Hello, I'm <span className="text-blue-600">{profileData.name}</span>
                    </h1>
                    <p className="text-2xl font-medium mt-4">
                        A Passionate <span className="text-blue-600">{profileData.title}</span>
                    </p>


                    {/* Contact Links */}
                    <div className="flex justify-center md:justify-start space-x-6 mt-6">
                        {profileData.contactEmail && (
                            <a
                                href={`mailto:${profileData.contactEmail}`}
                                className="text-gray-600 hover:text-blue-600"
                                aria-label="Email"
                            >
                                <FaEnvelope size={28} />
                            </a>
                        )}
                        {profileData.linkedin && (
                            <a
                                href={profileData.linkedin}
                                className="text-gray-600 hover:text-blue-600"
                                aria-label="LinkedIn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin size={28} />
                            </a>
                        )}
                        {profileData.github && (
                            <a
                                href={profileData.github}
                                className="text-gray-600 hover:text-blue-600"
                                aria-label="GitHub"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaGithub size={28} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start py-10">
                {/* Left Side: About Me */}
                <div className="space-y-6 py-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">About Me</h2>
                        {/* Render bio as multiple paragraphs */}
                        {profileData.bio.split('\n').map((paragraph, index) => (
                            <p key={index} className="text-gray-700 mt-2">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Right Side: Education */}
                <div
                    className="bg-white p-4 rounded-lg shadow-lg ps-10 py-10 h-[100%] flex flex-col items-center justify-center"
                    style={{
                        perspective: "1000px", // Adds 3D depth
                        transform: "rotateX(10deg) rotateY(15deg)", // Adjust rotation for 3D effect
                        boxShadow: "rgba(0, 0, 0, 0.25) 0px 25px 50px -12px",
                    }}
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Education</h2>
                    <div className="space-y-4">
                        {profileData.education?.map((edu, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-semibold text-blue-600">{edu.degree}</h3>
                                <p className="text-gray-800">{edu.institution}</p>
                                <p className="text-gray-500">
                                    {extractYear(edu.startDate)} - {extractYear(edu.endDate)}
                                </p>
                                <p className="text-gray-700">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default WebProfile;


