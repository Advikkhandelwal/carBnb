const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const supabase = require('../config/supabase');

// Use memory storage instead of disk storage since we're uploading to Supabase
const storage = multer.memoryStorage();

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
    // allows only image 
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Middleware to handle Supabase upload after multer has placed file in memory
const uploadToSupabase = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const file = req.file;
        const fileExt = path.extname(file.originalname);
        const fileName = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;

        console.log(`📤 Uploading file to Supabase: ${fileName} (${file.size} bytes)`);

        // Upload to Supabase Storage 'car-images' bucket
        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error("❌ Supabase upload error:", error);
            throw error;
        }

        console.log(`✅ Upload successful! Path: ${data.path}`);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName);

        // Attach the Supabase URL to the request so the controller can save it to the database
        req.file.supabaseUrl = publicUrl;

        next();
    } catch (error) {
        console.error("Supabase upload error (Full):", error);
        res.status(500).json({
            error: 'Failed to upload image to cloud storage',
            message: error.message,
            details: error
        });
    }
};

module.exports = {
    upload,
    uploadToSupabase
};
