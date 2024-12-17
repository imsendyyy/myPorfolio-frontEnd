import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Avatar, IconButton, Typography, Box } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Layout from '../Layout';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';

const ProfileAdmin = () => {
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const [profileData, setProfileData] = useState({
        name: '',
        title: '',
        bio: '',
        profileImage: null,
        contactEmail: '',
        location: '',
        resume: null,
        github: '',
        linkedin: '',
        personalWebsite: '',
        education: [
            {
                degree: '',
                institution: '',
                startDate: '',
                endDate: '',
                description: '',
            },
        ],
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setProfileData({ ...profileData, [field]: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Update the image preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        console.log(profileData); // Log updated data to console
        const formData = new FormData();
        formData.append("name", profileData.name)
        formData.append("title", profileData.title)
        formData.append("bio", profileData.bio)
        formData.append("contactEmail", profileData.contactEmail)
        formData.append("github", profileData.github)
        formData.append("linkedin", profileData.linkedin)
        formData.append("personalWebsite", profileData.personalWebsite)
        formData.append("location", profileData.location)
        if (profileData.profileImage) formData.append('profileImage', profileData.profileImage);
        if (profileData.resume) formData.append('resume', profileData.resume);

        // Append education as a JSON string
        formData.append('education', JSON.stringify(profileData.education));
        console.log(formData)
        try {
            const res = await axios.put(`${config.API_URL}userInfo/createOrUpdateUserInfo`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                },
            })

            if (res.status === 200) {
                Toastify({
                    text: "User Info Updated successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
            }
        } catch (error) {
            console.error('Error:', error);
            Toastify({
                text: "Error While Updating User Info. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false);
        }
    };


    const getUserInfos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}userInfo/getUserInfo`);
            if (res.status === 200) {
                const data = res.data;
                
                // Format the startDate and endDate to 'YYYY-MM-DD' format
                data.education = data.education.map((edu) => {
                    return {
                        ...edu,
                        startDate: edu.startDate ? edu.startDate.split('T')[0] : '', // Convert to YYYY-MM-DD
                        endDate: edu.endDate ? edu.endDate.split('T')[0] : '',         // Convert to YYYY-MM-DD
                    };
                });
    
                setProfileData(data);
                setImagePreview(data.profileImage);
            }
        } catch (error) {
            console.log(error);
            Toastify({
                text: "Error While fetching User Info. Please try again.",
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
    

    useEffect(() => {
        getUserInfos();
        console.log(profileData);
    }, []);

    useEffect(() => {
        const authtoken = Cookies.get('authToken');
        setToken(authtoken)
    }, [])

    return (
        <Layout>
            {loading ? ( <Loading/>) :(
                <Box sx={{ p: 5, mx: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                    Profile Information
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>

                        {/* Profile Image */}
                        <Grid item xs={12} sm={6}>
                            <Avatar
                                src={imagePreview}
                                alt="Profile Preview"
                                sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
                            />
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="label"
                                sx={{ display: 'block', mx: 'auto' }}
                            >
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={(e) => handleFileChange(e, 'profileImage')}
                                />
                                <PhotoCamera />
                            </IconButton>
                        </Grid>

                        {/* Name & Title */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Name"
                                name="name"
                                size='small'
                                value={profileData.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Title"
                                name="title"
                                size='small'
                                value={profileData.title}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Bio */}
                        <Grid item xs={12}>
                            <TextField
                                label="Bio"
                                name="bio"
                                size='small'
                                value={profileData.bio}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        {/* Contact Email & Location */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Contact Email"
                                name="contactEmail"
                                type="email"
                                size='small'
                                value={profileData.contactEmail}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Location"
                                name="location"
                                size='small'
                                value={profileData.location}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        {/* Social Links */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Social Links
                            </Typography>
                        </Grid>
                        
                            <Grid item xs={12} sm={4} >
                                <TextField
                                    label='gitHub URL'
                                    name={'github'}
                                    size='small'
                                    value={profileData.github}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <TextField
                                    label='Linkedin URL'
                                    name={'linkedin'}
                                    size='small'
                                    value={profileData.linkedin}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} >
                                <TextField
                                    label='Personal Website'
                                    name={'personalWebsite'}
                                    size='small'
                                    value={profileData.personalWebsite}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                        
                        {/* Education */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Education
                            </Typography>
                        </Grid>
                        {profileData.education.map((edu, index) => (
                            <Grid container spacing={2} key={index}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Degree"
                                        value={edu.degree}
                                        size='small'
                                        onChange={(e) => {
                                            const newEducation = [...profileData.education];
                                            newEducation[index].degree = e.target.value;
                                            setProfileData({ ...profileData, education: newEducation });
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Institution"
                                        value={edu.institution}
                                        size='small'
                                        onChange={(e) => {
                                            const newEducation = [...profileData.education];
                                            newEducation[index].institution = e.target.value;
                                            setProfileData({ ...profileData, education: newEducation });
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Start Date"
                                        type="date"
                                        size='small'
                                        InputLabelProps={{ shrink: true }}
                                        value={edu.startDate}
                                        onChange={(e) => {
                                            const newEducation = [...profileData.education];
                                            newEducation[index].startDate = e.target.value;
                                            setProfileData({ ...profileData, education: newEducation });
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="End Date"
                                        type="date"
                                        size='small'
                                        InputLabelProps={{ shrink: true }}
                                        value={edu.endDate}
                                        onChange={(e) => {
                                            const newEducation = [...profileData.education];
                                            newEducation[index].endDate = e.target.value;
                                            setProfileData({ ...profileData, education: newEducation });
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        value={edu.description}
                                        size='small'
                                        onChange={(e) => {
                                            const newEducation = [...profileData.education];
                                            newEducation[index].description = e.target.value;
                                            setProfileData({ ...profileData, education: newEducation });
                                        }}
                                        fullWidth
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                        sx={{ mt: 4 }}
                    >
                        Save Profile
                    </Button>
                </form>
            </Box>
            )}
            
        </Layout>
    );
};

export default ProfileAdmin;
