// Simple Express.js Server for File Upload and API Proxy
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and WEBP are allowed.'), false);
        }
    }
});

// Upload endpoint
app.post('/api/upload', upload.array('files', 3), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No files uploaded' 
            });
        }

        if (req.files.length !== 3) {
            return res.status(400).json({ 
                success: false, 
                error: 'Exactly 3 photos required' 
            });
        }

        const uploadedFiles = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        }));

        res.json({
            success: true,
            files: uploadedFiles,
            message: 'Files uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Proxy endpoint for RunwayML API
app.post('/api/runwayml', async (req, res) => {
    try {
        const { imageUrl, options } = req.body;
        
        if (!imageUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Image URL is required' 
            });
        }

        // Your actual RunwayML API key should be stored in environment variables
        const RUNWAYML_API_KEY = process.env.RUNWAYML_API_KEY || 'YOUR_RUNWAYML_API_KEY';
        
        const response = await fetch('https://api.runwayml.com/v1/image_to_video', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RUNWAYML_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_url: imageUrl,
                model: 'gen3a_turbo',
                watermark: false,
                duration: options.duration || 5,
                ratio: options.ratio || '16:9',
                prompt: options.prompt || 'Animate this photo with natural movements'
            })
        });

        if (!response.ok) {
            throw new Error(`RunwayML API Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        
        res.json({
            success: true,
            taskId: result.id,
            status: 'PENDING',
            message: 'Video generation started'
        });

    } catch (error) {
        console.error('RunwayML proxy error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Check task status
app.get('/api/runwayml/status/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        const RUNWAYML_API_KEY = process.env.RUNWAYML_API_KEY || 'YOUR_RUNWAYML_API_KEY';
        
        const response = await fetch(`https://api.runwayml.com/v1/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${RUNWAYML_API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`RunwayML Status Error: ${response.status}`);
        }

        const result = await response.json();
        
        res.json({
            success: true,
            status: result.status,
            videoUrl: result.output?.[0],
            progress: result.progress || 0
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Upload directory: ./uploads`);
    console.log(`🔗 API endpoints:`);
    console.log(`   POST /api/upload - Upload photos`);
    console.log(`   POST /api/runwayml - Generate video via RunwayML`);
    console.log(`   GET  /api/runwayml/status/:taskId - Check video status`);
    console.log(`   GET  /api/health - Health check`);
});
