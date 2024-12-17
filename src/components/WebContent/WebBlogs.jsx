import React, { useState, useEffect } from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import axios from 'axios';
import config from '../config';
import Loading from '../Admin/Loading';
import DOMPurify from 'dompurify';

const WebBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false)


    const fatchAllBlogs = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${config.API_URL}blogs/getAllBlogs`)
            setBlogs(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    // Simulate API call
    useEffect(() => {
        fatchAllBlogs();
    }, []);

    const handleShowMore = (blog) => {
        setSelectedBlog(blog);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedBlog(null);
    };

    if (loading) {
        return <Loading />
    }

    return (
        <section id='blogs' className='p-0 sm:p-16'>
            <h2 className='text-2xl font-bold mb-4'>Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

                {blogs.map((blog) => (
                    <Card key={blog.id} className="shadow-md">
                        <CardMedia
                            component="img"
                            height="150"
                            image={blog.coverImage}
                            alt={blog.title}
                        />
                        <CardContent>
                            <Typography variant="p" className='text-xl font-bold' sx={{mb:3}} gutterBottom>
                                {blog.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{mt:3}}>
                                By  <span className='font-semibold'>{blog.author}</span>
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => handleShowMore(blog)}
                            >
                                Show More
                            </Button>
                        </CardActions>
                    </Card>
                ))}

                {/* Dialog for Show More */}
                {selectedBlog && (
                    <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md">
                        <DialogTitle>{selectedBlog.title}</DialogTitle>
                        <DialogContent>
                            {selectedBlog.coverImage && (
                                <img
                                    src={selectedBlog.coverImage}
                                    alt={selectedBlog.title}
                                    className="w-full mb-4"
                                    style={{
                                        height: '300px',   // Set fixed height
                                        objectFit: 'cover', // Ensure image aspect ratio is maintained
                                    }}
                                />
                            )}
                            <Typography
                                variant="body1"
                                gutterBottom
                                component="div"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedBlog.content) }}
                            />
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mt: 4, fontStyle: 'italic' }}  // Custom style for author
                            >
                                By {selectedBlog.author}
                            </Typography>

                            {/* Render tags as chips */}
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                Tags:
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {selectedBlog.tags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            color="gray"  // Adjust the color of the chip
                                            size="small"     // Adjust the size of the chip
                                            sx={{ margin: '2px', padding: "5px" }}  // Add some spacing between chips
                                        />
                                    ))}
                                </div>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </div>
        </section>

    );
};

export default WebBlogs;
