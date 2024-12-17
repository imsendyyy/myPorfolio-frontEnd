import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import Loading from '../Admin/Loading';

const WebSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch skills data from API
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const res = await axios.get(`${config.API_URL}skills/getAllSkills`);
                setSkills(res.data); // Assuming res.data is an array of skills
                setLoading(false);
            } catch (error) {
                console.error('Error fetching skills data:', error);
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <section id="skills" className=" bg-white py-16 px-0 sm:px-8 relative">

            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className="w-96 h-96 bg-indigo-100 rounded-full blur-3xl absolute top-10 left-10"></div>
                <div className="w-96 h-96 bg-orange-100 rounded-full blur-3xl absolute bottom-10 right-20"></div>
            </div>
            <div className="container mx-auto ">
                <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Skills</h2>

                {/* Grid Layout for Skills */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-8">
                    {skills.map((skill, index) => (
                        <div
                        key={index}
                        className="flex flex-col p-4 items-center rounded-lg space-y-4 group transform transition-transform duration-500 hover:scale-110 hover:rotate-3 hover:shadow-2xl perspective"
                    >
                        {/* Skill Image */}
                        <div className="w-20 h-20 bg-white rounded shadow-md transform transition-transform duration-500 group-hover:rotate-y-180">
                            <img
                                src={skill.imageUrl}
                                alt={skill.name}
                                className="w-full h-full object-contain rounded"
                            />
                        </div>
                    
                        {/* Skill Name */}
                        <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300 text-center">
                            {skill.name}
                        </h3>
                    </div>
                    
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WebSkills;

