import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import { MaterialReactTable } from 'material-react-table';
import { TextField, Button, Rating } from '@mui/material';
import config from '../../config';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';

const TestimonialsAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const [selectedTestiId, setSelectedTestiId] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [newTestimonial, setNewTestimonial] = useState({
        name: '',
        feedback: '',
        company: '',
        designation: '',
        imageUrl: null,
        rating: 5,
    });

    const columns = [
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <Button onClick={() => handleSelectTesti(row.original)}>Select</Button>
            ),
        },
        {
            accessorKey: 'imageUrl', header: 'Image',
            size: 100,
            Cell: ({ cell }) => (
                cell.getValue() ? (
                    <img
                        src={cell.getValue()}
                        alt="Testimonial"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },
        { accessorKey: 'name', header: 'Name', size: 100 },
        { accessorKey: 'company', header: 'Company', size: 60 },
        { accessorKey: 'designation', header: 'Designation', size: 90 },
        { accessorKey: 'feedback', header: 'Feedback', size: 90 },
        {
            accessorKey: 'rating',
            header: 'Rating',
            size: 90,
            Cell: ({ cell }) => (
                <Rating
                    value={cell.getValue()}
                    readOnly
                    precision={0.5}
                    size="small"
                />
            ),
        },
        { accessorKey: '_id', header: 'ID', size: 90 },
    ];

    const fetchAllTestimonials = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}testimonial/getAllTestimonials`);
            if (res.status === 200) setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTesti = (testi) => {
        setSelectedTestiId(testi._id);
        setNewTestimonial({
            name: testi.name,
            feedback: testi.feedback,
            company: testi.company,
            designation: testi.designation,
            imageUrl: testi.imageUrl,
            rating: testi.rating,
        });
        setImagePreview(testi.imageUrl || null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTestimonial({ ...newTestimonial, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewTestimonial({ ...newTestimonial, imageUrl: file || null });

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

    const handleRatingChange = (value) => {
        setNewTestimonial({ ...newTestimonial, rating: value });
    };

    const handleSaveTestimonial = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("name", newTestimonial.name)
        formData.append("company", newTestimonial.company)
        formData.append("designation", newTestimonial.designation)
        formData.append("feedback", newTestimonial.feedback)
        formData.append("rating", newTestimonial.rating)
        if (newTestimonial.imageUrl) {
            formData.append("imageUrl", newTestimonial.imageUrl);
        }
        try {
            const res = await axios.post(`${config.API_URL}testimonial/addNewTestimonial`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            })

            if (res.status === 200) {
                Toastify({
                    text: "New Testimonial added successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                resetForm();
                fetchAllTestimonials();
            }
        } catch (error) {
            console.log(error)
            // Show error notification
            Toastify({
                text: "Error While Creating Testimonial. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateTestimonial = async () => {
        setLoading(true)
        const formData = new FormData();
        formData.append("name", newTestimonial.name)
        formData.append("company", newTestimonial.company)
        formData.append("designation", newTestimonial.designation)
        formData.append("feedback", newTestimonial.feedback)
        formData.append("rating", newTestimonial.rating)
        if (newTestimonial.imageUrl) {
            formData.append("imageUrl", newTestimonial.imageUrl);
        }
        try {

            const res = await axios.put(`${config.API_URL}testimonial/updateTestimonial/${selectedTestiId}`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            })

            if (res.status === 200) {
                Toastify({
                    text: "Testimonial Updated successfully !",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                resetForm();
                fetchAllTestimonials();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Updating Testimonial. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteTestimonial = async () => {
        try {
            const res = await axios.delete(`${config.API_URL}testimonial/deleteTestimonial/${selectedTestiId}`, {
                headers: {
                    Authorization: token,
                },
            })
            if (res.status === 200) {
                Toastify({
                    text: "Testimonial Deleted successfully !",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                resetForm();
                fetchAllTestimonials();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Deleting Testimonial. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setNewTestimonial({
            name: '',
            feedback: '',
            company: '',
            designation: '',
            imageUrl: null,
            rating: 5,
        });
        setImagePreview(null);
        setSelectedTestiId(0);
    };

    useEffect(() => {
        fetchAllTestimonials();
        const authtoken = Cookies.get('authToken');
        setToken(authtoken)
    }, []);

    return (
        <Layout>
            <div className="header sticky top-0 p-3 bg-gray-300 m-1 z-10">
                <p className="text-start">
                    <span className="font-bold">Dashboard</span>/Testimonials
                </p>
            </div>
            <div className="mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="skill-info">
                    <h4 className="text-2xl font-bold border-b border-gray-300 pb-3">Manage Testimonials</h4>
                </div>
                {/* Testimonials Form */}
                {loading ? (<Loading />) : (
                    <div className="space-y-6 skill-form">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                            <TextField
                                label="Name"
                                name="name"
                                size='small'
                                value={newTestimonial.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Company"
                                name="company"
                                size='small'
                                value={newTestimonial.company}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Designation"
                                name="designation"
                                size='small'
                                value={newTestimonial.designation}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </div>

                        <TextField
                            label="Feedback"
                            name="feedback"
                            size='small'
                            value={newTestimonial.feedback}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            required
                        />

                        <div className="flex items-center gap-4 items-center justify-center flex-col-reverse">
                            <Button variant="outlined" component="label">
                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
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
                        <p>Rating</p>
                        <Rating
                            name="rating"
                            label="Rating"
                            value={newTestimonial.rating}
                            onChange={(event, value) => handleRatingChange(value)}
                            precision={0.5}
                        />
                        <div className="flex space-x-3 justify-center">
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                onClick={selectedTestiId === 0 ? handleSaveTestimonial : handleUpdateTestimonial}
                            >
                                {selectedTestiId === 0 ? 'Add New Testimonial' : 'Update Testimonial'}
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={resetForm}>
                                Cancel
                            </Button>
                            {selectedTestiId !== 0 && (
                                <Button
                                    variant="contained"
                                    disabled={loading}
                                    color="error"
                                    onClick={handleDeleteTestimonial}
                                >
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Testimonials List */}
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableDensityToggle={false}
                    enableColumnVisibility
                    initialState={{
                        density: 'compact',
                        columnVisibility: { _id: false },
                    }}
                    state={{ isLoading: loading }}
                />
            </div>
        </Layout>
    );
};

export default TestimonialsAdmin;
