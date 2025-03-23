import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
// import { upload } from '../server.js';
// import upload from '../middleware/multer.js';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');  // specify the folder to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });


const router = express.Router();

// Get all products
router.get('/all-product', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      sort,
      search,
      disease,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (disease) filter.diseases = disease;

    // Price range
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subDescription: { $regex: search, $options: 'i' } }
      ];
    }

    // Only active products for regular users
    // filter.isActive = true;

    // Build sort object
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { finalPrice: 1 };
          break;
        case 'price_desc':
          sortOption = { finalPrice: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { ratings: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
    // .populate('category', 'name')
    // .populate('subcategory', 'name')
    // .populate('colors', 'name code')
    // .populate('sizes', 'name')
    // .populate('tags', 'name')
    // .populate('diseases', 'name');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
console.log("XXXXXXXXXXXXXXX", products)
    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message
    });
  }
});

// Get product by ID
router.get('/get_product_by_id/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('herbsId')
    // .populate('subcategory', 'name')
    // .populate('colors', 'name code')
    // .populate('sizes', 'name')
    // .populate('tags', 'name')
    // .populate('diseases', 'name')
    // .populate({
    //   path: 'reviews.user',
    //   select: 'name profilePic'
    // });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
});

// Create new product (admin only)
router.post('/create-product', upload.fields([{ name: 'productImages', maxCount: 8 }, { name: 'blogImages', maxCount: 4 }]), async (req, res) => {
  try {
    const {
      productName,
      productSubDescription,
      productDescription,
      Variant,
      herbs,
      faqs,
      urls,
      herbsId, // Added for clarity
    } = req.body;

    // Log the incoming data for debugging purposes
    console.log("Incoming Data:", req.body);
    console.log("Received files:", req?.files)

    // Parse JSON strings if they are provided as strings
    const parsedVariants = typeof Variant === 'string' ? JSON.parse(Variant) : Variant;
    const parsedHerbs = typeof herbs === 'string' ? JSON.parse(herbs) : herbs;
    const parsedFaqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
    const parsedUrls = typeof urls === 'string' ? JSON.parse(urls) : urls;

    // Check for undefined or empty herbsId and parse if it's a valid JSON string
    let parsedHerbsId = [];
    if (herbsId) {
      try {
        parsedHerbsId = JSON.parse(herbsId); // If it's valid JSON, parse it
      } catch (err) {
        console.error("Error parsing herbsId:", err);
      }
    }

    // Process uploaded images (product images)
    const productImages = req.files['productImages'] ? req.files['productImages'].map(file => file.filename) : [];
    const blogImages = req.files['blogImages'] ? req.files['blogImages'].map(file => file.filename) : [];


    // Construct the Variant array
    const variants = parsedVariants.map((v) => ({
      price: parseFloat(v.price),
      discountPrice: parseFloat(v.discountPrice),
      finalPrice: parseFloat(v.finalPrice).toFixed(2), // Ensure finalPrice is a number with 2 decimal places
      day: v.day,
      bottle: v.bottle,
      tex: v.tex
    }));

    // Construct the Herbs array and handle empty images gracefully
    const herbsArray = parsedHerbs || []; // Default to empty array if undefined

    // Construct the FAQ array
    const faqsArray = parsedFaqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer
    }));

    // Construct the URLs array
    const urlsArray = parsedUrls.map((url) => ({
      url: url.url
    }));

    // Create a new Product document
    const product = new Product({
      productName,
      productSubDescription,
      productDescription,
      variant: variants,
      herbs: herbsArray,
      herbsId: parsedHerbsId, // Add the parsed herbsId
      faqs: faqsArray,
      urls: urlsArray,
      productImages,
      blogImages,
    });

    // Save the product to the database
    await product.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    // Log and return error if something fails
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
});



router.post('/update-product/:id', upload.fields([{ name: 'productImages', maxCount: 8 }, { name: 'blogImages', maxCount: 4 }]), async (req, res) => {
  try {
    const {
      productName,
      productSubDescription,
      productDescription,
      Variant,
      herbs,
      faqs,
      urls,
      herbsId, // Added for clarity
    } = req.body;

    // Log the incoming data for debugging purposes
    console.log("Incoming Data:", req.body);
    console.log("Received files:", req?.files);

    // Parse JSON strings if they are provided as strings
    const parsedVariants = typeof Variant === 'string' ? JSON.parse(Variant) : Variant;
    const parsedHerbs = typeof herbs === 'string' ? JSON.parse(herbs) : herbs;
    const parsedFaqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
    const parsedUrls = typeof urls === 'string' ? JSON.parse(urls) : urls;

    // Check for undefined or empty herbsId and parse if it's a valid JSON string
    let parsedHerbsId = [];
    if (herbsId) {
      try {
        parsedHerbsId = JSON.parse(herbsId); // If it's valid JSON, parse it
      } catch (err) {
        console.error("Error parsing herbsId:", err);
      }
    }

    // Find the product to update
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Process uploaded images (product images)
    const productImages = req.files['productImages'] ? req.files['productImages'].map(file => file.filename) : [];
    const blogImages = req.files['blogImages'] ? req.files['blogImages'].map(file => file.filename) : [];

    // Construct the Variant array
    const variants = parsedVariants.map((v) => ({
      price: parseFloat(v.price) || 0,
      discountPrice: parseFloat(v.discountPrice) || 0,
      finalPrice: parseFloat(v.finalPrice).toFixed(2) || '0.00',
      day: v.day || '',
      bottle: v.bottle || '',
      tex: v.tex || '0',
    }));

    // Construct the Herbs array and handle empty images gracefully
    const herbsArray = parsedHerbs || []; // Default to empty array if undefined

    // Construct the FAQ array
    const faqsArray = parsedFaqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    }));

    // Construct the URLs array
    const urlsArray = parsedUrls.map((url) => ({
      url: url.url,
    }));

    // If product images or blog images were uploaded, merge them with the existing ones
    let updatedProductImages = product.productImages || [];
    if (productImages.length > 0) {
      updatedProductImages = [...updatedProductImages, ...productImages];
    }

    let updatedBlogImages = product.blogImages || [];
    if (blogImages.length > 0) {
      updatedBlogImages = [...updatedBlogImages, ...blogImages];
    }

    // Handle moving files using fs for both productImages and blogImages
    // const moveFiles = (files, folder) => {
    //   files.forEach((file) => {
    //     const oldPath = path.join(__dirname, '..', 'tmp', file.filename);
    //     const newPath = path.join(__dirname, '..', 'uploads', folder, file.filename);

    //     if (!fs.existsSync(path.dirname(newPath))) {
    //       fs.mkdirSync(path.dirname(newPath), { recursive: true });
    //     }

    //     fs.renameSync(oldPath, newPath);
    //   });
    // };

    // if (req.files['productImages']) {
    //   moveFiles(req.files['productImages'], 'products');
    // }

    // if (req.files['blogImages']) {
    //   moveFiles(req.files['blogImages'], 'blog');
    // }

    // Update product properties
    product.productName = productName || product.productName;
    product.productSubDescription = productSubDescription || product.productSubDescription;
    product.productDescription = productDescription || product.productDescription;
    product.variant = variants.length > 0 ? variants : product.variant; // Handle variants if provided
    product.herbs = herbsArray;
    product.herbsId = parsedHerbsId; // Add the parsed herbsId
    product.faqs = faqsArray;
    product.urls = urlsArray;
    product.productImages = updatedProductImages;
    product.blogImages = updatedBlogImages;

    // Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
});


// // Add product review
// router.post('/:id/reviews', authenticateToken, async (req, res) => {
//   try {
//     const { rating, comment } = req.body;

//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     // Check if user already reviewed
//     const alreadyReviewed = product.reviews.find(
//       review => review.user.toString() === req.user.id
//     );

//     if (alreadyReviewed) {
//       return res.status(400).json({
//         success: false,
//         message: 'You have already reviewed this product'
//       });
//     }

//     // Add review
//     const review = {
//       user: req.user.id,
//       name: req.user.name,
//       rating: Number(rating),
//       comment
//     };

//     product.reviews.push(review);

//     // Update product ratings
//     product.numReviews = product.reviews.length;
//     product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

//     await product.save();

//     res.status(201).json({
//       success: true,
//       message: 'Review added successfully',
//       review
//     });
//   } catch (error) {
//     console.error('Add review error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to add review',
//       error: error.message
//     });
//   }
// });


router.get("/delete-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product has images and delete them from the file system
    if (product.productImages && product.productImages.length > 0) {
      // Loop through each image and delete it from the file system
      for (let i = 0; i < product.productImages.length; i++) {
        fs.unlinkSync(`uploads/products/${product.productImages[i]}`);
      }
    }

    // Delete the product from the database
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

router.post('/change-status', async (req, res) => {
  const { productId, isActive } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = isActive; // Update the status
    await product.save();

    res.status(200).json({ success: true, message: 'Product status updated successfully' });
  } catch (error) {
    console.error('Error updating Product status:', error);
    res.status(500).json({ success: false, message: 'Failed to update Product status' });
  }
});

router.post('/change-status-wellnessKits', async (req, res) => {
  const { productId, wellnessKits } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.wellnessKits = wellnessKits; // Update the status
    await product.save();

    res.status(200).json({ success: true, message: 'Product wellness Kits status updated successfully' });
  } catch (error) {
    console.error('Error updating Product status:', error);
    res.status(500).json({ success: false, message: 'Failed to update Product status' });
  }
});

export default router;