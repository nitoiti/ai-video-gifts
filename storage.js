// Video Storage Management
class VideoStorage {
    constructor() {
        this.storageKey = 'generated_videos';
        this.maxStorageSize = 50 * 1024 * 1024; // 50MB localStorage limit
    }

    // Save video to localStorage
    saveVideo(videoData) {
        try {
            const existingVideos = this.getVideos();
            const updatedVideos = [...existingVideos, videoData];
            
            // Remove oldest videos if storage is full
            while (this.getStorageSize() > this.maxStorageSize && updatedVideos.length > 0) {
                updatedVideos.shift(); // Remove oldest
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(updatedVideos));
            return true;
        } catch (error) {
            console.error('Storage save error:', error);
            return false;
        }
    }

    // Get all stored videos
    getVideos() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Storage get error:', error);
            return [];
        }
    }

    // Get storage size estimate
    getStorageSize() {
        try {
            const data = localStorage.getItem(this.storageKey) || '{}';
            return new Blob([data]).size;
        } catch (error) {
            return 0;
        }
    }

    // Clear old videos (cleanup)
    clearOldVideos(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
        const videos = this.getVideos();
        const now = Date.now();
        const filteredVideos = videos.filter(video => 
            (now - video.timestamp) < maxAge
        );
        
        if (filteredVideos.length > 0) {
            localStorage.setItem(this.storageKey, JSON.stringify(filteredVideos));
            console.log(`Cleared ${filteredVideos.length} old videos`);
        }
    }

    // Get video by ID
    getVideoById(id) {
        const videos = this.getVideos();
        return videos.find(video => video.id === id);
    }

    // Delete video by ID
    deleteVideo(id) {
        const videos = this.getVideos();
        const filteredVideos = videos.filter(video => video.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredVideos));
    }
}

// Export for use in main script
window.VideoStorage = VideoStorage;
