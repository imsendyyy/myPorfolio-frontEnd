// Import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y, EffectCards } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-cards';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import Loading from '../Admin/Loading';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default () => {
    const [projectData, setProjectData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // State for dialog box
    const [selectedProject, setSelectedProject] = useState(null); // State to hold the selected project's details

    const fetchAllProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}projects/getAllProjects`);
            setProjectData(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, []);

    const handleDialogOpen = (project) => {
        setSelectedProject(project); // Set the selected project
        setOpen(true); // Open the dialog
    };

    const handleDialogClose = () => {
        setOpen(false); // Close the dialog
        setSelectedProject(null); // Clear the selected project
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <section id="projects" className=" bg-gray-100 py-16 px-0 sm:px-8 relative">
            <div className="absolute inset-0">
                <div className="w-80 h-80 bg-fuchsia-100 rounded-full blur-3xl absolute top-10 left-10"></div>
                <div className="w-96 h-96 bg-blue-100 rounded-full blur-3xl absolute bottom-40 right-20"></div>
            </div>

            <h2 className="text-4xl font-extrabold text-center mb-10 py-10 text-gray-800">Projects</h2>

            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, EffectCards]}
                effect="cards"
                grabCursor={true}
                centeredSlides={true}
                spaceBetween={0}
                slidesPerView={1}
                breakpoints={{
                    499: { slidesPerView: 1, spaceBetween: 10 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                }}
                className="mySwiper"
            >
                {projectData.map((project, index) => (
                    <SwiperSlide key={index}>
                        <div className=" bg-white p-6 rounded-lg shadow-inner transition-all cursor-pointer">
                            {project.image && (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                            )}
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{project.title}</h3>
                            <p className="text-gray-700 mb-4">{project.projectSummary}</p>

                            <ul className="flex flex-wrap gap-2">
                                {project.techStack.slice(0, 3).map((tech, index) => (
                                    <li key={index} className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800">
                                        {tech}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className="mt-4 text-blue-600 hover:underline"
                                onClick={() => handleDialogOpen(project)}
                            >
                                More Details
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Dialog Component */}
            <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="md">
                <DialogTitle>{selectedProject?.title}</DialogTitle>
                <DialogContent>
                    {selectedProject?.image && (
                        <img
                            src={selectedProject.image}
                            alt={selectedProject.title}
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                    )}
                    <h4 className="font-semibold text-lg">Project Summary:</h4>
                    <p className="text-gray-700 mb-4">{selectedProject?.projectSummary}</p>

                    <h4 className="font-semibold text-lg mt-4">Description:</h4>
                    <ul className="list-disc ml-6 text-gray-800">
                        {selectedProject?.description.map((desc, index) => (
                            <li key={index} className="mb-2">
                                {desc}
                            </li>
                        ))}
                    </ul>

                        <h4 className="font-semibold text-lg mt-4">Important Links :</h4>
                        <p>Github url : <a href={`${selectedProject.github}`}> {selectedProject.github} </a></p>
                        <p>Project url : <a href={`${selectedProject.github}`}> {selectedProject.projectUrl} </a></p>


                    <h4 className="font-semibold text-lg mt-4">Tech Stack:</h4>
                    <ul className="flex flex-wrap gap-2">
                        {selectedProject?.techStack.map((tech, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                    {selectedProject?.projectUrl && (
                        <Button
                            onClick={() => window.open(selectedProject.projectUrl, '_blank')}
                            color="secondary"
                            variant="contained"
                        >
                            View Project
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </section>
    );
};
