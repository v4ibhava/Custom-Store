const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const fs = require("fs");
const Settings = require("../models/settingsModel");
const Products = require("../models/productModels");


// Helper to configure Cloudinary dynamically from DB or .env fallback
const configureCloudinary = async () => {
    try {
        const settings = await Settings.findOne();
        const cloud_name = settings?.cloudinaryCloudName || process.env.CLOUD_NAME;
        const api_key = settings?.cloudinaryApiKey || process.env.CLOUD_API_KEY;
        const api_secret = settings?.cloudinaryApiSecret || process.env.CLOUD_API_SECRET;
        const folder = settings?.cloudinaryFolder || "cake-avenue";

        if (cloud_name && api_key && api_secret) {
            cloudinary.config({ cloud_name, api_key, api_secret });
        }

        return {
            cloud_name: cloud_name || "",
            api_key: api_key || "",
            api_secret: api_secret || "",
            folder: folder || "cake-avenue",
            isConfigured: Boolean(cloud_name && api_key && api_secret)
        };
    } catch (err) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });
        return {
            cloud_name: process.env.CLOUD_NAME || "",
            api_key: process.env.CLOUD_API_KEY || "",
            api_secret: process.env.CLOUD_API_SECRET || "",
            folder: "cake-avenue",
            isConfigured: Boolean(process.env.CLOUD_NAME)
        };
    }
};

// Storage Stats & Cloud Analytics route
router.get('/storage-stats', auth, authAdmin, async (req, res) => {
    try {
        const config = await configureCloudinary();
        const productsCount = await Products.countDocuments();
        
        let liveUsage = null;
        if (config.isConfigured) {
            try {
                liveUsage = await new Promise((resolve) => {
                    cloudinary.api.usage((err, result) => {
                        if (err) resolve(null);
                        else resolve(result);
                    });
                });
            } catch (err) {
                liveUsage = null;
            }
        }

        res.json({
            cloudName: config.cloud_name || 'Not Configured',
            isConfigured: config.isConfigured,
            folder: config.folder,
            totalProducts: productsCount,
            usage: liveUsage
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

// Upload route
router.post('/upload', auth, authAdmin, async (req, res) => {
    try {
        const config = await configureCloudinary();

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ msg: "No files were uploaded" });
        }
        const file = req.files.file;

        if (!file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        if (file.size > 5 * 1024 * 1024) { // Max 5MB
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File size exceeds 5MB limit" });
        }
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp') {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ msg: "File format is incorrect (JPG, PNG, WEBP allowed)" });
        }

        cloudinary.uploader.upload(file.tempFilePath, { folder: config.folder }, async (err, result) => {
            if (err) {
                console.error("Cloudinary Upload Error:", err);
                removeTmp(file.tempFilePath);
                return res.status(500).json({ msg: err.message || "Cloudinary upload failed" });
            }
            removeTmp(file.tempFilePath);
            res.json({ public_id: result.public_id, url: result.secure_url });
        });
    } catch (err) {
        console.error("Error in upload route:", err);
        return res.status(500).json({ msg: err.message });
    }
});

// Destroy route
router.post('/destroy', auth, authAdmin, async (req, res) => {
    try {
        await configureCloudinary();

        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ msg: "No images selected" });
        }
        cloudinary.uploader.destroy(public_id, async (err, result) => {
            if (err) {
                console.error("Cloudinary Destroy Error:", err);
                return res.status(500).json({ msg: err.message || "Cloudinary destroy failed" });
            }
            res.json({ msg: "Deleted Image" });
        });
    } catch (err) {
        console.error("Error in destroy route:", err);
        return res.status(500).json({ msg: err.message });
    }
});


// Remove temporary files
const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

module.exports = router;
