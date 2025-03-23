import express from 'express';
import Banner from '../models/Banner.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/banners");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ position: 1 });

    res.status(200).json({
      success: true,
      banners
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banners',
      error: error.message
    });
  }
});


// Get banner by ID
router.get('/get-single-banner/:id', async (req, res) => {
  try {
    // console.log("hhhhhhhhhhhhh:==", req.params.id)
    const banner = await Banner.findById(req.params.id);
    // console.log("banner", banner)
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      banner
    });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banner',
      error: error.message
    });
  }
});

// Create new banner (admin only)
router.post('/create-banners', upload.any('images'), async (req, res) => {
  try {
    const { name, type, link, startDate, endDate, position, isActive } = req.body;

    console.log('Body', req.body);
    console.log('Images', req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    // Ensure 'name', 'type', and 'isActive' are arrays and their lengths match the number of images
    const images = req.files.map(file => file.filename);

    // Check if the lengths of name, type, isActive, and images are the same
    if (name.length !== images.length || type.length !== images.length || isActive.length !== images.length) {
      return res.status(400).json({
        success: false,
        message: 'Mismatch between number of images and form data',
      });
    }

    // Loop through all the data and images and create a banner for each
    const banners = [];
    for (let i = 0; i < images.length; i++) {
      const banner = new Banner({
        name: name[i],  // Corresponding name for the image
        type: type[i],  // Corresponding type for the image
        images: [images[i]],  // We are assuming each image is part of its own banner (single image per banner)
        link,
        startDate: startDate || null,
        endDate: endDate || null,
        position: position || 0,
        isActive: isActive[i] === 'true',  // Ensure it’s a boolean value
      });

      banners.push(banner);
    }

    // Save all banners in the database
    await Banner.insertMany(banners);

    res.status(201).json({
      success: true,
      message: 'Banners created successfully',
      banners,
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banners',
      error: error.message,
    });
  }
});



// Update banner (admin only)
router.post('/update-banner/:id', upload.any('images'), async (req, res) => {
  try {
    const {
      name,
      type,
      link,
      oldImages,
      startDate,
      endDate,
      position,
      isActive
    } = req.body;

    // Find banner by ID
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }   

    // Process uploaded images
    let images = banner.images || [];
    if (req.files && req.files.length > 0) {
      // If new images are uploaded, map them to the correct path
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      images = [...images, ...newImages];
    }

    // Update fields with new values if provided, otherwise keep the current ones
    banner.name = name || banner.name;
    banner.type = type || banner.type;
    banner.link = link || banner.link; // If link is not provided, retain old link
    banner.startDate = startDate ? new Date(startDate) : banner.startDate; // Ensure correct date format
    banner.endDate = endDate ? new Date(endDate) : banner.endDate; // Ensure correct date format
    banner.position = position || banner.position; // Position can be optional
    banner.isActive = isActive !== undefined ? isActive === 'true' : banner.isActive;

    // Save the updated banner
    await banner.save();

    // Delete old images if new images are provided
    if (oldImages && Array.isArray(oldImages)) {
      oldImages.forEach(image => {
        const imagePath = path.join(__dirname, `../uploads/banners${image}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Remove old image files
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      banner
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: error.message
    });
  }
});

// Delete banner (admin only)
router.get('/delete-banner/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    console.log("dara", banner?.images)

    if (banner?.images?.length > 0) {
      for (let i = 0; i < banner?.images?.length; i++) {
        fs.unlinkSync(`uploads/banners/${banner?.images[i]}`);
      }
    }

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message
    });
  }
});

export default router;