import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button, Switch, TextField, Autocomplete, Chip } from '@mui/material';
import config from '../../config';
import Layout from '../Layout';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';

const ProjectAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [token, setToken] = useState('')
    const [selectedProjectId, setSelectedProjectId] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        image: null,
        description: [], // Array for bullet points
        techStack: [],
        projectSummary: '',
        projectUrl: '',
        githubUrl: '',
        status: 'In Progress',
    });

    const columns = [
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <Button onClick={() => handleSelectProject(row.original)}>Select</Button>
            ),
        },
        {
            accessorKey: 'image',
            header: 'Image',
            size: 100,
            Cell: ({ cell }) => (
                cell.getValue() ? (
                    <img
                        src={cell.getValue()}
                        alt="Skill"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },
        { accessorKey: 'title', header: 'Title', size: 100 },
        { accessorKey: 'projectSummary', header: 'Summary', size: 60 },
        { accessorKey: 'projectUrl', header: 'ProjectUrl', size: 90 },
        { accessorKey: 'githubUrl', header: 'GithubUrl', size: 90 },
        {
            accessorKey: 'techStack',
            header: 'TechStack',
            size: 180,
            Cell: ({ cell }) => (
                <div className="flex flex-wrap gap-1">
                    {cell.getValue().map((tech, index) => (
                        <Chip key={index} label={tech} size="small" />
                    ))}
                </div>
            ),
        },
        { accessorKey: 'status', header: 'Status', size: 90 },
        {
            accessorKey: 'description',
            header: 'Description',
            size: 100,
            Cell: ({ cell }) => {
                const value = cell.getValue();
                // Ensure the value is an array before mapping
                if (Array.isArray(value)) {
                    return (
                        <ul className="list-disc pl-5">
                            {value.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    );
                }
                // Handle non-array values gracefully
                return <span>{value || 'No Description'}</span>;
            },
        },
        { accessorKey: '_id', header: 'ID', size: 90 },
    ];

    const technologiesList = [
        // Frontend Technologies
        'React JS',
        'Next.js',
        'Vue.js',
        'Angular',
        'Svelte',
        'Redux',
        'Tailwind CSS',
        'Bootstrap',
        'Material UI',
        'Chakra UI',
        'Three.js',
        'TypeScript',
        'HTML',
        'CSS',
      
        // Backend Technologies
        'Node.js',
        'Express.js',
        'NestJS',
        'Django',
        'Flask',
        'Ruby on Rails',
        'Spring Boot',
        'ASP.NET Core',
        'GraphQL',
        'Fastify',
      
        // Databases
        'MongoDB',
        'MySQL',
        'PostgreSQL',
        'SQLite',
        'Firebase',
        'DynamoDB',
        'Redis',
        'Cassandra',
        'Elasticsearch',
      
        // DevOps and Deployment
        'Docker',
        'Kubernetes',
        'Jenkins',
        'GitHub Actions',
        'AWS',
        'Azure',
        'Google Cloud Platform',
        'Netlify',
        'Vercel',
        'Heroku',
      
        // Programming Languages
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'C++',
        'C#',
        'PHP',
        'Ruby',
        'Go',
        'Rust',
      
        // Mobile Development
        'React Native',
        'Flutter',
        'Ionic',
        'Swift',
        'Kotlin',
      
        // Testing and Debugging
        'Jest',
        'Mocha',
        'Chai',
        'Cypress',
        'Enzyme',
        'Postman',
        'Selenium',
        'Puppeteer',
      
        // Other Tools and Frameworks
        'Webpack',
        'Babel',
        'ESLint',
        'Prettier',
        'Storybook',
        'JIRA',
        'Figma',
        'Adobe XD',
        'Tailwind CSS'
      ];
      

    const fetchAllProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}projects/getAllProjects`);
            if (res.status === 200) setData(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectProject = (pro) => {
        setSelectedProjectId(pro._id);
        setNewProject({
            title: pro.title,
            description: pro.description || [],
            techStack: pro.techStack,
            projectSummary: pro.projectSummary,
            projectUrl: pro.projectUrl,
            githubUrl: pro.githubUrl,
            status: pro.status,
            image: pro.image || null,
        });
        setImagePreview(pro.image || null);
        const offset = 100;
        window.scrollTo({
            top: document.querySelector('.skill-form').offsetTop - offset,
            behavior: 'smooth',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleAutocompleteChange = (value) => {
        setNewProject({ ...newProject, techStack: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewProject({ ...newProject, image: file || null });

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleDescriptionChange = (index, value) => {
        const updatedDescription = [...newProject.description];
        updatedDescription[index] = value;
        setNewProject({ ...newProject, description: updatedDescription });
    };

    const addDescriptionBullet = () => {
        setNewProject({ ...newProject, description: [...newProject.description, ''] });
    };

    const removeDescriptionBullet = (index) => {
        const updatedDescription = newProject.description.filter((_, i) => i !== index);
        setNewProject({ ...newProject, description: updatedDescription });
    };

    const handleSaveProject = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(newProject).forEach(([key, value]) => {
                if (key === 'description' || key === 'techStack') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const res = await axios.post(`${config.API_URL}projects/createNewProject`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                },
            }
            );

            if (res.status === 200) {
                resetForm();
                Toastify({
                    text: "New Project Created successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllProjects();
            }
        } catch (error) {
            console.log(error);
            Toastify({
                text: "Error While Creating New Project. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false);
        }
    };


    const handleUpdateProject = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(newProject).forEach(([key, value]) => {
                if (key === 'description' || key === 'techStack') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            const res = await axios.put(`${config.API_URL}projects/updateProject/${selectedProjectId}`, formData, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'multipart/form-data',
                },
            }
            );

            if (res.status === 200) {
                resetForm();
                Toastify({
                    text: "Project Updated successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllProjects();
            }
        } catch (error) {
            console.log(error);
            Toastify({
                text: "Error While Updating Project. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        setLoading(true)
        try {
            const res = await axios.delete(`${config.API_URL}projects/deleteProject/${selectedProjectId}`, {
                headers: {
                    Authorization: token,
                },
            })
            if (res.status === 200) {
                resetForm();
                Toastify({
                    text: "Project Deleted successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllProjects();
            }

        } catch (error) {
            console.log(error);
            Toastify({
                text: "Error While Deleting Project. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false);
        }
    }

    const resetForm = () => {
        setNewProject({
            title: '',
            image: null,
            description: [],
            techStack: [],
            projectSummary: '',
            projectUrl: '',
            githubUrl: '',
            status: 'In Progress',
        });
        setImagePreview(null);
        setSelectedProjectId(0);
    };

    useEffect(() => {
        fetchAllProjects();
        const authtoken = Cookies.get('authToken');
        setToken(authtoken)
    }, []);
    return (
        <Layout>
            <div className="header sticky top-0 p-3 bg-gray-300 m-1 z-10">
                <p className="text-start">
                    <span className="font-bold">Dashboard</span>/Projects
                </p>
            </div>
            <div className="mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="skill-info">
                    <h4 className="text-2xl font-bold border-b border-gray-300 pb-3">Manage Projects</h4>
                </div>
                {/* Project Form */}
                {loading ? (<Loading />) : (
                    <div className="space-y-6 skill-form">
                        <div className="space-y-6 project-form">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                <TextField
                                    label="Title"
                                    name="title"
                                    size="small"
                                    value={newProject.title}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Project Title"
                                    fullWidth
                                    required
                                />
                                <div className='flex items-center justify-center flex-col-reverse'>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        color="primary"
                                        style={{ marginTop: '8px' }}
                                    >
                                        {imagePreview ? 'Change Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            hidden
                                        />
                                    </Button>
                                    <div
                                        className="mt-3 border border-gray-300 rounded-md p-3 flex justify-center items-center"
                                        style={{ width: '150px', height: '150px' }}
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                            />
                                        ) : (
                                            <span className="text-gray-500">No Image Selected</span>
                                        )}
                                    </div>
                                </div>
                            </div>


                            <div>
                                <h4 className='my-2'>Description</h4>
                                {newProject.description.map((bullet, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <TextField
                                            label={`Bullet ${index + 1}`}
                                            value={bullet}
                                            sx={{ my: 1 }}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            size="small"
                                            fullWidth
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeDescriptionBullet(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outlined" color="dark" onClick={addDescriptionBullet}>
                                    Add More
                                </Button>
                            </div>

                            <Autocomplete
                                multiple
                                options={technologiesList}
                                getOptionLabel={(option) => option}
                                size='small'
                                value={newProject.techStack}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Tech Stack" placeholder="Select technologies" />
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                                <TextField
                                    label="Project Summary"
                                    name="projectSummary"
                                    size="small"
                                    value={newProject.projectSummary}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Brief Summary"
                                    fullWidth
                                />
                                <TextField
                                    label="Project URL"
                                    name="projectUrl"
                                    size="small"
                                    value={newProject.projectUrl}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="Live Project URL"
                                    fullWidth
                                />
                                <TextField
                                    label="GitHub URL"
                                    name="githubUrl"
                                    size="small"
                                    value={newProject.githubUrl}
                                    onChange={(e) => handleChange(e)}
                                    placeholder="GitHub Repository URL"
                                    fullWidth
                                />
                            </div>
                            <TextField
                                label="Status"
                                name="status"
                                size="small"
                                select
                                value={newProject.status}
                                onChange={(e) => handleChange(e)}
                                fullWidth
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                {['In Progress', 'Completed', 'On Hold'].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </TextField>
                            <div className="flex space-x-3">
                                <Button
                                    variant="contained"
                                    color="success"
                                    disabled={loading}
                                    onClick={selectedProjectId === 0 ? handleSaveProject : handleUpdateProject}
                                >
                                    {selectedProjectId === 0 ? 'Add New Project' : 'Update Project'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                                {selectedProjectId !== 0 && (
                                    <Button
                                        variant="contained"
                                        disabled={loading}
                                        color="error"
                                        onClick={handleDeleteProject}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                        </div>


                    </div>
                )}

            </div>
            <div>
                {/* Project List */}
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableDensityToggle={false}
                    enableColumnVisibility
                    initialState={{
                        density: 'compact',
                        columnVisibility: {
                            _id: false,
                        },
                    }}
                    state={{ isLoading: loading }}
                />
            </div>
        </Layout >
    )
}

export default ProjectAdmin
