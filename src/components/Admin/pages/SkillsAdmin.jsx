import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { MaterialReactTable } from 'material-react-table';
import {
    Button,
    TextField,
    Autocomplete,
    Box,
} from '@mui/material';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';


const SkillsAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('')
    const [newSkill, setNewSkill] = useState({
        name: '',
        category: '',
        proficiency: 'Beginner',
        description: '',
        imageUrl: null,
    });
    const [selectedSkillId, setSelectedSkillId] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const columns = [
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <Button onClick={() => handleSelectSkill(row.original)}>Select</Button>
            ),
        },
        {
            accessorKey: 'imageUrl',
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
        { accessorKey: 'name', header: 'Name', size: 100 },
        { accessorKey: 'category', header: 'Category', size: 60 },
        { accessorKey: 'proficiency', header: 'Proficiency', size: 90 },
        { accessorKey: 'description', header: 'Description', size: 90 },
        { accessorKey: '_id', header: 'id', size: 90 },
    ];
    const [data, setData] = useState([]);

    const proficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSkill({ ...newSkill, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewSkill({ ...newSkill, imageUrl: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSelectSkill = (skill) => {
        setSelectedSkillId(skill._id);
        setImagePreview(skill.imageUrl);
        setNewSkill({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
            description: skill.description,
        });

        const offset = 100;
        window.scrollTo({
            top: document.querySelector('.skill-form').offsetTop - offset,
            behavior: 'smooth',
        });
    };

    const fetchAllSkills = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}skills/getAllSkills`);
            if (res.status === 200) setData(res.data);
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSkill = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('name', newSkill.name);
        formData.append('category', newSkill.category);
        formData.append('proficiency', newSkill.proficiency);
        formData.append('description', newSkill.description);
        if (newSkill.imageUrl) formData.append('imageUrl', newSkill.imageUrl);

        try {
            const res = await axios.post(`${config.API_URL}skills/addNewSkill`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            })
            if (res.status === 200) {
                console.log(res)
                // Show success notification
                Toastify({
                    text: "Skill added successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();

                fetchAllSkills(); // Refresh the skills list
                resetSelectedData(); // Reset the form
            }

        } catch (error) {
            console.error('Error saving skill:', error);

            // Show error notification
            Toastify({
                text: "Error saving skill. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateSkill = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append('name', newSkill.name);
        formData.append('category', newSkill.category);
        formData.append('proficiency', newSkill.proficiency);
        formData.append('description', newSkill.description);
        if (newSkill.imageUrl) formData.append('imageUrl', newSkill.imageUrl);
        try {
            const res = await axios.put(`${config.API_URL}skills/updateSkill/${selectedSkillId}`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            })
            if (res.status === 200) {
                console.log(res)
                // Show success notification
                Toastify({
                    text: "Skill Updated successfully !",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();

                fetchAllSkills(); // Refresh the skills list
                resetSelectedData(); // Reset the form
            }
        } catch (error) {
            console.error('Error Updating skill:', error);

            // Show error notification
            Toastify({
                text: "Error Updeting skill. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSkill = async () => {
        setLoading(true)
        try {
            const res = await axios.delete(`${config.API_URL}skills/deleteSkill/${selectedSkillId}`, {
                headers: {
                    Authorization: token,
                },
            });
            if (res.status === 200) {
                fetchAllSkills();
                resetSelectedData();
                Toastify({
                    text: "Skill Deleted successfully !",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
            }

        } catch (error) {
            console.error('Error deleting skill:', error);
            Toastify({
                text: "Error deleting skill. Please try again.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const resetSelectedData = () => {
        setNewSkill({
            name: '',
            category: '',
            proficiency: 'Beginner',
            description: '',
            imageUrl: null,
        });
        setSelectedSkillId(0);
        setImagePreview(null);
    };

    useEffect(() => {
        fetchAllSkills();
        const authtoken = Cookies.get('authToken');
        setToken(authtoken)
    }, []);

    return (
        <Layout>
            <div className="header sticky top-0 p-3 bg-gray-300 m-1 z-10">
                <p className="text-start">
                    <span className="font-bold">Dashboard</span>/Skills
                </p>
            </div>
            <Box className="mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="skill-info">
                    <h4 className="text-2xl font-bold border-b border-gray-300 pb-3">
                        Manage Skills
                    </h4>
                </div>
                {loading ? (<Loading />) : (
                    <Box className="skill-form space-y-6">
                        <TextField
                            label="Skill Name"
                            name="name"
                            size='small'
                            value={newSkill.name}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Category"
                            name="category"
                            size='small'
                            value={newSkill.category}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <Autocomplete
                            options={proficiencies}
                            value={newSkill.proficiency}
                            onChange={(e, newValue) =>
                                setNewSkill({ ...newSkill, proficiency: newValue })
                            }
                            renderInput={(params) => (
                                <TextField {...params} size='small' label="Proficiency" variant="outlined" />
                            )}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={newSkill.description}
                            onChange={handleChange}
                            size='small'
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                        <Box>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Skill Preview"
                                    className="w-48 h-48 object-cover rounded mb-4"
                                />
                            )}
                            <Button variant="outlined" component="label">
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 2, // Add margin-top for spacing from other elements
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                disabled={loading}
                                color={selectedSkillId ? 'primary' : 'success'}
                                onClick={selectedSkillId === 0 ? handleSaveSkill : handleUpdateSkill}
                            >
                                {selectedSkillId ? 'Update Skill' : 'Add Skill'}
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ mx: 2 }} onClick={resetSelectedData}>
                                Cancel
                            </Button>
                            {selectedSkillId !== 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mx: 2 }}
                                    onClick={handleDeleteSkill}
                                >
                                    Delete
                                </Button>
                            )}
                        </Box>

                    </Box>
                )}

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
            </Box>
        </Layout>
    );
};

export default SkillsAdmin;

