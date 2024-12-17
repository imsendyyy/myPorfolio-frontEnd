import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button, Switch, TextField, Autocomplete, Chip } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import config from '../../config';
import Layout from '../Layout';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';


const ExperianceAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const [selectedExpId, setSelectedExpId] = useState(0);
    const [newExp, setNewExp] = useState({
        title: '',
        company: '',
        location: '',
        startDate: null,
        endDate: null,
        description: [],
        technologies: [],
        isCurrent: false,
    });

    const columns = [
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <Button onClick={() => handleSelectExp(row.original)}>Select</Button>
            ),
        },
        { accessorKey: 'title', header: 'Role', size: 100 },
        { accessorKey: 'company', header: 'Company Name', size: 60 },
        { accessorKey: 'location', header: 'Location', size: 90 },
        {
            accessorKey: 'technologies',
            header: 'Technologies',
            size: 90,
            Cell: ({ cell }) => (
                <div className="flex flex-wrap gap-1">
                    {cell.getValue().map((tech, index) => (
                        <Chip key={index} label={tech} size="small" />
                    ))}
                </div>
            ),
        },
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
      

    const fatchAllExperiances = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}experience/getAllExperiences`);
            if (res.status === 200) setData(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectExp = (exp) => {
        setSelectedExpId(exp._id);
        setNewExp({
            title: exp.title,
            company: exp.company,
            location: exp.location,
            startDate: exp.startDate ? dayjs(exp.startDate) : null,
            endDate: exp.endDate ? dayjs(exp.endDate) : null,
            description: exp.description,
            technologies: exp.technologies,
            isCurrent: exp.isCurrent,
        });

        const offset = 100;
        window.scrollTo({
            top: document.querySelector('.skill-form').offsetTop - offset,
            behavior: 'smooth',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExp({ ...newExp, [name]: value });
    };

    const handleDateChange = (name, date) => {
        setNewExp({ ...newExp, [name]: date });
    };

    const handleToggleIsCurrent = () => {
        setNewExp({ ...newExp, isCurrent: !newExp.isCurrent });
    };

    const handleDescriptionChange = (index, value) => {
        const updatedDescription = [...newExp.description];
        updatedDescription[index] = value;
        setNewExp({ ...newExp, description: updatedDescription });
    };

    const addDescriptionBullet = () => {
        setNewExp({ ...newExp, description: [...newExp.description, ''] });
    };

    const removeDescriptionBullet = (index) => {
        const updatedDescription = newExp.description.filter((_, i) => i !== index);
        setNewExp({ ...newExp, description: updatedDescription });
    };


    const handleAddExp = async () => {
        console.log(newExp);

        try {
            const res = await axios.post(`${config.API_URL}experience/addNewExperience`, newExp,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                })

            if (res.status === 200) {
                console.log(res.data)
                resetSeletedData();
                Toastify({
                    text: "New Experiance Added successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fatchAllExperiances();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Adding New Experiance. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        }
    };

    const handleUpdateExp = async () => {
        try {
            const res = await axios.put(`${config.API_URL}experience/updateExperience/${selectedExpId}`, newExp, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            })

            if (res.status === 200) {
                console.log(res.data)
                resetSeletedData();
                Toastify({
                    text: "Experiance Updated successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fatchAllExperiances();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Updating Experiance. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        }
    }


    const handleDeleteExp = async () => {
        try {
            const res = await axios.delete(`${config.API_URL}experience/deleteExperience/${selectedExpId}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            if (res.status === 200) {
                console.log(res.data)
                resetSeletedData();
                Toastify({
                    text: "Experiance Deleted successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fatchAllExperiances();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Deleting Experiance. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        }
    }

    const resetSeletedData = () => {
        setNewExp({
            title: '',
            company: '',
            location: '',
            startDate: null,
            endDate: null,
            description: [],
            technologies: [],
            isCurrent: false,
        });
        setSelectedExpId(0);
    };

    useEffect(() => {
        fatchAllExperiances();
        const authtoken = Cookies.get('authToken');
        setToken(authtoken)
    }, []);

    return (
        <Layout>
            <div className="header sticky top-0 p-3 bg-gray-300 m-1 z-10">
                <p className="text-start">
                    <span className="font-bold">Dashboard</span>/Experience
                </p>
            </div>
            <div className="mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="skill-info">
                    <h4 className="text-2xl font-bold border-b border-gray-300 pb-3">Manage Experience</h4>
                </div>
                {/* Experience Form */}
                {loading ? (<Loading />) : (
                    <div className="space-y-6 skill-form">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                            <TextField
                                label="Role"
                                name="title"
                                size='small'
                                value={newExp.title}
                                onChange={handleChange}
                                placeholder="Role (Ex: Jr Developer)"
                                fullWidth
                            />
                            <TextField
                                label="Company"
                                name="company"
                                size='small'
                                value={newExp.company}
                                onChange={handleChange}
                                placeholder="Company Name"
                                fullWidth
                            />
                            <TextField
                                label="Location"
                                name="location"
                                size='small'
                                value={newExp.location}
                                onChange={handleChange}
                                placeholder="Location"
                                fullWidth
                            />
                        </div>
                        <Autocomplete
                            multiple
                            options={technologiesList}
                            value={newExp.technologies}
                            onChange={(event, value) => setNewExp({ ...newExp, technologies: value })}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Technologies"
                                    placeholder="Select Technologies"
                                    size="small"
                                />
                            )}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                                <DatePicker
                                    label="Start Date"
                                    value={newExp.startDate}
                                    slotProps={{ textField: { size: 'small' } }}
                                    onChange={(date) => handleDateChange('startDate', date)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={newExp.endDate}
                                    onChange={(date) => handleDateChange('endDate', date)}
                                    slotProps={{ textField: { size: 'small' } }}
                                    renderInput={(params) => <TextField {...params} size='small' />}
                                    disabled={newExp.isCurrent}
                                />
                                <div className="flex items-center">
                                    <label className="mr-3">Is Current</label>
                                    <Switch
                                        checked={newExp.isCurrent}
                                        onChange={handleToggleIsCurrent}
                                        color="primary"
                                    />
                                </div>
                            </div>
                        </LocalizationProvider>
                        <div>
                            <h4 className='my-2'>Description</h4>
                            {newExp.description.map((bullet, index) => (
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
                        <div className="flex space-x-3">
                            <Button
                                variant="contained"
                                disabled={loading}
                                color={selectedExpId === 0 ? 'success' : 'primary'}
                                onClick={selectedExpId === 0 ? handleAddExp : handleUpdateExp}
                            >
                                {selectedExpId === 0 ? 'Add New Experience' : 'Update Experience'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={resetSeletedData}
                            >
                                Cancel
                            </Button>
                            {selectedExpId !== 0 && (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    color="error"
                                    onClick={handleDeleteExp}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Experience List */}
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
        </Layout>
    );
};

export default ExperianceAdmin;

