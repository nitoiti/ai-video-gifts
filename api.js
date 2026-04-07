// API Configuration
const API_CONFIG = {
    RUNWAYML: {
        BASE_URL: 'https://api.runwayml.com/v1',
        API_KEY: 'YOUR_RUNWAYML_API_KEY', // Will be replaced with actual key
        ENDPOINTS: {
            GENERATE_VIDEO: '/image_to_video',
            GET_STATUS: '/tasks/{task_id}'
        }
    },
    STORAGE: {
        BASE_URL: 'https://your-storage-bucket.com', // For uploaded files
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    }
};

// API Class for RunwayML Integration
class RunwayMLAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = API_CONFIG.RUNWAYML.BASE_URL;
    }

    async generateVideo(imageUrl, options = {}) {
        const payload = {
            image_url: imageUrl,
            model: 'gen3a_turbo', // RunwayML model for video generation
            watermark: false,
            duration: options.duration || 5, // 5 seconds default
            ratio: options.ratio || '16:9',
            prompt: options.prompt || 'Animate this photo with natural movements'
        };

        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.RUNWAYML.ENDPOINTS.GENERATE_VIDEO}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`RunwayML API Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            return {
                success: true,
                taskId: result.id,
                status: 'PENDING'
            };
        } catch (error) {
            console.error('RunwayML API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async getTaskStatus(taskId) {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.RUNWAYML.ENDPOINTS.GET_STATUS.replace('{task_id}', taskId)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`RunwayML Status Error: ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                status: result.status,
                videoUrl: result.output?.[0],
                progress: result.progress || 0
            };
        } catch (error) {
            console.error('RunwayML Status Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// File Upload Handler
class FileUploader {
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
            return {
                success: true,
                url: result.url,
                filename: result.filename
            };
        } catch (error) {
            console.error('Upload Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Video Generation Manager
class VideoGenerator {
    constructor() {
        this.api = new RunwayMLAPI(API_CONFIG.RUNWAYML.API_KEY);
        this.uploader = new FileUploader();
        this.activeTasks = new Map();
    }

    async processPhotos(files, options = {}) {
        const results = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Upload file
            showNotification(`Загружаем фото ${i + 1}...`, 'info');
            const uploadResult = await this.uploader.uploadFile(file);
            
            if (!uploadResult.success) {
                throw new Error(`Failed to upload photo ${i + 1}: ${uploadResult.error}`);
            }

            // Generate video
            showNotification(`Генерируем видео из фото ${i + 1}...`, 'info');
            const videoResult = await this.api.generateVideo(uploadResult.url, {
                duration: options.duration || 5,
                prompt: options.prompt || 'Create natural animation from this photo'
            });

            if (!videoResult.success) {
                throw new Error(`Failed to generate video ${i + 1}: ${videoResult.error}`);
            }

            // Store task for polling
            this.activeTasks.set(videoResult.taskId, {
                fileIndex: i,
                status: 'PENDING',
                progress: 0
            });

            results.push({
                taskId: videoResult.taskId,
                originalFile: file,
                uploadUrl: uploadResult.url,
                status: 'PENDING'
            });
        }

        return results;
    }

    async pollForResults(tasks, maxWaitTime = 300000) { // 5 minutes max
        const startTime = Date.now();
        const results = [];

        while (Date.now() - startTime < maxWaitTime) {
            let allCompleted = true;

            for (const task of tasks) {
                if (task.status === 'COMPLETED' || task.status === 'FAILED') {
                    continue;
                }

                allCompleted = false;
                
                // Check status
                const statusResult = await this.api.getTaskStatus(task.taskId);
                
                if (statusResult.success) {
                    task.status = statusResult.status;
                    task.progress = statusResult.progress;
                    
                    if (statusResult.status === 'COMPLETED' && statusResult.videoUrl) {
                        task.videoUrl = statusResult.videoUrl;
                        showNotification(`Видео ${task.fileIndex + 1} готово!`, 'success');
                    } else if (statusResult.status === 'FAILED') {
                        showNotification(`Ошибка генерации видео ${task.fileIndex + 1}`, 'error');
                    }
                }
            }

            // Update UI with progress
            updateProgressUI(tasks);

            if (allCompleted) {
                break;
            }

            // Wait 2 seconds before next poll
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        return tasks.filter(task => task.status === 'COMPLETED');
    }
}

// Progress UI Update
function updateProgressUI(tasks) {
    const progressContainer = document.getElementById('generation-progress');
    if (!progressContainer) return;

    let totalProgress = 0;
    tasks.forEach(task => {
        totalProgress += task.progress || 0;
    });
    
    const avgProgress = Math.round(totalProgress / tasks.length);
    
    progressContainer.innerHTML = `
        <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Генерация видео...</span>
                <span class="text-sm text-gray-600">${avgProgress}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-purple-600 h-2 rounded-full transition-all duration-300" style="width: ${avgProgress}%"></div>
            </div>
        </div>
    `;
}

// Initialize API Integration
const videoGenerator = new VideoGenerator();

// Export for use in main script
window.RunwayMLIntegration = {
    videoGenerator,
    API_CONFIG,
    processPhotos: (files, options) => videoGenerator.processPhotos(files, options),
    pollForResults: (tasks) => videoGenerator.pollForResults(tasks)
};
