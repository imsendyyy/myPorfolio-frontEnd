import React, { useState, useEffect } from 'react';
import { FaUser, FaCode, FaProjectDiagram, FaBriefcase, FaQuoteLeft, FaBlog } from 'react-icons/fa';

// Section Data
const sections = [
    { id: 'myprofile', label: 'My Profile', icon: <FaUser /> },
    { id: 'skills', label: 'Skills', icon: <FaCode /> },
    { id: 'experience', label: 'Experience', icon: <FaBriefcase /> },
    { id: 'projects', label: 'Projects', icon: <FaProjectDiagram /> },
    { id: 'testimonials', label: 'Testimonials', icon: <FaQuoteLeft /> },
    { id: 'blogs', label: 'Blogs', icon: <FaBlog /> },
];

const WebSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => {
            const isSmall = window.innerWidth < 800;
            setIsSmallScreen(isSmall);
            setIsOpen(!isSmall); // Close sidebar on small screens by default
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle scroll and update active section
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            let foundActiveSection = '';

            // Check each section's offset and set active if in view
            sections.forEach(({ id }) => {
                const section = document.getElementById(id);
                if (section) {
                    const { offsetTop, offsetHeight } = section;
                    if (scrollPosition >= offsetTop - 50 && scrollPosition < offsetTop + offsetHeight) {
                        foundActiveSection = id;
                    }
                }
            });

            setActiveSection(foundActiveSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to section
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div
            className={`flex flex-col h-screen ${isOpen ? 'w-[250px]' : 'w-[42px]'} bg-gray-300 sticky top-0 left-0 transition-all duration-300`}
        >
            <nav className="flex flex-col justify-center items-center h-full space-y-4">
                <ul>
                    {sections.map(({ id, label, icon }) => (
                        <li key={id}>
                            <button
                                onClick={() => scrollToSection(id)}
                                aria-current={activeSection === id ? 'page' : undefined}
                                className={`flex items-center p-3 rounded w-full text-left group ${activeSection === id ? 'bg-gray-400 text-white' : 'hover:bg-gray-200 text-gray-600'}`}
                            >
                                <span className="text-lg">{icon}</span>
                                {!isSmallScreen && isOpen && (
                                    <span className="ml-3 group-hover:font-medium">{label}</span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default WebSidebar;
