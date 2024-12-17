import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaUser,
    FaCode,
    FaProjectDiagram,
    FaBriefcase,
    FaQuoteLeft,
    FaBlog,
    FaBars,
} from 'react-icons/fa';

const SideBar = () => {
    const [isOpen, setIsOpen] = useState(true); // State to manage sidebar visibility
    const [isSmallScreen, setIsSmallScreen] = useState(false); // State to detect small screens

    // Effect to listen for screen resize
    useEffect(() => {
        const handleResize = () => {
            const isSmall = window.innerWidth < 800; // Adjust breakpoint as needed
            setIsSmallScreen(isSmall);
            if (isSmall) {
                setIsOpen(false); // Automatically close sidebar on small screens
            } else {
                setIsOpen(true); // Automatically open sidebar on larger screens
            }
        };

        // Initialize state on component mount
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            className={`flex flex-col h-[100vh] ${isOpen ? 'w-[250px]' : 'w-[60px]'
                } bg-gray-300 sticky top-0 left-0 transition-all duration-300`}
        >
            {/* Toggle Button */}
            <button
                className="p-2 text-gray-600 hover:bg-gray-200 rounded self-end mr-2 mt-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaBars size={20} />
            </button>

            {/* Sidebar Content */}
            <nav className="p-3 space-y-4">
                <ul>
                    <li>
                        <NavLink
                            to="/dashboard/admin-myprofile"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded cursor-pointer ${isActive ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'
                                }`
                            }
                        >
                            <FaUser className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">My Profile</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/admin-skills"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded cursor-pointer ${isActive ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'
                                }`
                            }
                        >
                            <FaCode className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">Skills</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/admin-project"
                            className={({ isActive }) =>
                                `flex items-center p-3 rounded cursor-pointer ${isActive ? 'bg-gray-400 text-white' : 'hover:bg-gray-200'
                                }`
                            }
                        >
                            <FaProjectDiagram className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">Projects</span>}
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/dashboard/admin-experiance"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded cursor-pointer ${isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <FaBriefcase className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">Experience</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/admin-testimonials"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded cursor-pointer ${isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <FaQuoteLeft className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">Testimonials</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/admin-blogs"
                            className={({ isActive }) =>
                                `flex items-center space-x-3 p-3 rounded cursor-pointer ${isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
                                }`
                            }
                        >
                            <FaBlog className="text-gray-600" />
                            {!isSmallScreen && isOpen && <span className="ml-3">Blogs</span>}

                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SideBar;



