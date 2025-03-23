import express from 'express';
import Blog from '../models/Blog.js'; // Adjust the import based on your file structure
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';  // Import fs to interact with the file system

const router = express.Router();

// Set up multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/blogs");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  },
});

const upload = multer({ storage: storage });

// 1. Create Blog
router.post('/create-Blog', upload.single('blogImage'), async (req, res) => {
  try {
    const { name, blogTitle, description, additionalDetails, isActive } = req.body;
    console.log("BODY", req.body)
    const newBlog = new Blog({
      name,
      blogTitle,
      description,
      blogImage: req.file.filename,  // Save the image path from multer
      additionalDetails,
      isActive: isActive === 'true',  // Convert to boolean
    });

    await newBlog.save();

    res.status(201).json({ status: true, message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error creating blog', error });
  }
});


// 2. Get All Blogs
router.get('/get-all-blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json({ status: true, blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
});

// 3. Get Blog by ID
router.get('/get-blog-by-id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ status: false, message: 'Blog not found' });
    }
    res.status(200).json({ status: true, blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error fetching blog', error });
  }
});

// 4. Update Blog by ID
router.post('/update-Blog/:id', upload.single('blogImage'), async (req, res) => {
  const { id } = req.params;
  const { name, blogTitle, description, additionalDetails, isActive } = req.body;

  const updatedData = {
    name,
    blogTitle,
    description,
    additionalDetails,
    isActive: isActive === 'true',
  };

  // If a new image is uploaded, we need to delete the old image file
  if (req.file) {
    try {
      const blog = await Blog.findById(id);
      if (blog) {
        // Delete the old image file if it exists
        if (blog.blogImage) {
          fs.unlinkSync(blog.blogImage);  // Delete the file from the file system
        }
      }
      updatedData.blogImage = req.file.path;  // Update image path if a new image is uploaded
    } catch (error) {
      console.error('Error deleting old image file:', error);
    }
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedBlog) {
      return res.status(404).json({ status: false, message: 'Blog not found' });
    }

    res.status(200).json({ status: true, message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Error updating blog', error });
  }
});

// 5. Delete Blog by ID
router.get('/delete-blog/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete the image file from the file system
    if (blog.blogImage) {
      fs.unlinkSync(`uploads/blogs/${blog.blogImage}`);  // Delete the file from the file system
    }

    await Blog.findByIdAndDelete(id);  // Delete the blog from the database

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog', error });
  }
});


router.post('/change-status', async (req, res) => {
  const { blogId, isActive } = req.body;

  try {
    const blogs = await Blog.findById(blogId);
    if (!blogs) {
      return res.status(404).json({ status: false, message: 'Blogs not found' });
    }

    blogs.isActive = isActive; // Update the status
    await blogs.save();

    res.status(200).json({ status: true, message: 'Blogs status updated successfully' });
  } catch (error) {
    console.error('Error updating blogs status:', error);
    res.status(500).json({ success: false, message: 'Failed to update blogs status' });
  }
});

export default router;
