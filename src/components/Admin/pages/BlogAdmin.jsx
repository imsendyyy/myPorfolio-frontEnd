import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { MaterialReactTable } from 'material-react-table';
import {
    Button,
    TextField,
    Switch,
    Box,
    FormControlLabel,
    Chip,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import config from '../../config';
import Cookies from 'js-cookie';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Loading from '../Loading';

const BlogAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [newBlog, setNewBlog] = useState({
        title: '',
        content: '',
        author: '',
        tags: [],
        published: true,
        coverImage: null,
    });
    const [selectedBlogId, setSelectedBlogId] = useState(0);
    const [imagePreview, setImagePreview] = useState(null);
    const [data, setData] = useState([]);

    const columns = [
        // Existing columns
        {
            accessorKey: 'actions',
            header: 'Actions',
            size: 100,
            Cell: ({ row }) => (
                <Button onClick={() => handleSelectBlog(row.original)}>Select</Button>
            ),
        },
        {
            accessorKey: 'coverImage',
            header: 'Image',
            size: 100,
            Cell: ({ cell }) => (
                cell.getValue() ? (
                    <img
                        src={cell.getValue()}
                        alt="Blog"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                ) : (
                    <span>No Image</span>
                )
            ),
        },
        { accessorKey: 'title', header: 'Title', size: 100 },
        { accessorKey: 'author', header: 'Author', size: 60 },
        { accessorKey: 'tags', header: 'Tags', size: 90 },
        { accessorKey: 'published', header: 'Published', size: 90 },
        { accessorKey: 'content', header: 'Content', size: 90 },
        { accessorKey: '_id', header: 'ID', size: 90 },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBlog({ ...newBlog, [name]: value });
    };

    const handleContentChange = (value) => {
        setNewBlog({ ...newBlog, content: value });
    };

    const handleSwitchChange = (e) => {
        setNewBlog({ ...newBlog, published: e.target.checked });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewBlog({ ...newBlog, coverImage: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleTagsChange = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            setNewBlog((prev) => ({
                ...prev,
                tags: [...prev.tags, e.target.value.trim()],
            }));
            e.target.value = ''; // Clear the input
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setNewBlog((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToDelete),
        }));
    };

    const fetchAllBlogs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${config.API_URL}blogs/getAllBlogs`);
            if (res.status === 200) setData(res.data);
        } catch (error) {
            console.error('Error fetching Blogs:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleSelectBlog = (blog) => {
        setSelectedBlogId(blog._id);
        setImagePreview(blog.coverImage);
        setNewBlog({
            title: blog.title,
            content: blog.content,
            author: blog.author,
            tags: blog.tags,
            published: blog.published,
            coverImage: blog.coverImage,
        });

        const offset = 100;
        window.scrollTo({
            top: document.querySelector('.blog-form').offsetTop - offset,
            behavior: 'smooth',
        });
    };

    const handleAddBlog = async () => {
        setLoading(true)
        console.log(newBlog);
        const formData = new FormData();
        formData.append('title', newBlog.title)
        formData.append('author', newBlog.author)
        formData.append('published', newBlog.published)
        formData.append('content', newBlog.content)
        if (newBlog.coverImage) formData.append('coverImage', newBlog.coverImage);
        formData.append('tags', JSON.stringify(newBlog.tags));
        try {
            const res = await axios.post(`${config.API_URL}blogs/addNewBlog`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                }
            })
            if (res.status === 200) {
                resetSelectedData();
                Toastify({
                    text: "New Blog added successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllBlogs();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Creating Blog. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateBlog = async () => {
        setLoading(true)
        console.log(newBlog);
        const formData = new FormData();
        formData.append('title', newBlog.title)
        formData.append('author', newBlog.author)
        formData.append('published', newBlog.published)
        formData.append('content', newBlog.content)
        if (newBlog.coverImage) formData.append('coverImage', newBlog.coverImage);
        formData.append('tags', JSON.stringify(newBlog.tags));
        try {
            const res = await axios.put(`${config.API_URL}blogs/updateBlog/${selectedBlogId}`, formData, {
                headers: {
                    Authorization: token,
                    "Content-Type": "multipart/form-data",
                }

            })

            if (res.status === 200) {
                resetSelectedData();
                Toastify({
                    text: "Blog Updated successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllBlogs();
            }

        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Updating Blog. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const handleDeleteBlog = async () => {
        setLoading(true)
        try {
            const res = await axios.delete(`${config.API_URL}blogs/deleteBlog/${selectedBlogId}`, {
                headers: {
                    Authorization: token,
                }
            })

            if (res.status === 200) {
                resetSelectedData();
                Toastify({
                    text: "Blog Deleted successfully!",
                    duration: 3000,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center`, or `right`
                    backgroundColor: "#4CAF50",
                }).showToast();
                fetchAllBlogs();
            }
        } catch (error) {
            console.log(error)
            Toastify({
                text: "Error While Updating Blog. Please try again.",
                duration: 3000,
                gravity: "top",
                position: "center",
                backgroundColor: "#F44336",
            }).showToast();
        } finally {
            setLoading(false)
        }
    };

    const resetSelectedData = () => {
        setNewBlog({
            title: '',
            content: '',
            author: '',
            tags: [],
            published: true,
            coverImage: null,
        });
        setSelectedBlogId(0);
        setImagePreview(null);
    };

    useEffect(() => {
        fetchAllBlogs();
        const authtoken = Cookies.get('authToken');
        setToken(authtoken);
    }, []);

    return (
        <Layout>
            <div className="header sticky top-0 p-3 bg-gray-300 m-1 z-10">
                <p className="text-start">
                    <span className="font-bold">Dashboard</span>/Blogs
                </p>
            </div>
            <Box className="mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md">
                <div className="skill-info">
                    <h4 className="text-2xl font-bold border-b border-gray-300 pb-3">
                        Manage Blogs
                    </h4>
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <Box className="blog-form space-y-6">
                        <TextField
                            label="Blog Title"
                            name="title"
                            size="small"
                            value={newBlog.title}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Author"
                            name="author"
                            size="small"
                            value={newBlog.author}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                        />
                        <ReactQuill
                            theme="snow"
                            value={newBlog.content}
                            onChange={handleContentChange}
                            placeholder="Write your blog content here..."
                        />
                        <TextField
                            label="Add Tags"
                            placeholder="Press Enter to add tag"
                            size="small"
                            variant="outlined"
                            onKeyDown={handleTagsChange}
                        />
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {newBlog.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                />
                            ))}
                        </Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newBlog.published}
                                    onChange={handleSwitchChange}
                                />
                            }
                            label="Published"
                        />
                        <Box>
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Blog Preview"
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                sx={{ mx: 2 }}
                                color={selectedBlogId ? 'primary' : 'success'}
                                onClick={selectedBlogId === 0 ? handleAddBlog : handleUpdateBlog}
                            >
                                {selectedBlogId ? 'Update Blog' : 'Add Blog'}
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ mx: 2 }} onClick={() => resetSelectedData()}>
                                Cancel
                            </Button>
                            {selectedBlogId !== 0 && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ mx: 2 }}
                                    onClick={handleDeleteBlog}
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

export default BlogAdmin;