const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Ensures an image URL is absolute and correctly points to the backend if it's a relative path.
 * @param {string} url - The image URL or relative path.
 * @returns {string} - The absolute image URL.
 */
export const getFullImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400x300?text=Car+Image';

    // Handle legacy localhost URLs in the database
    if (url.includes('localhost:3001')) {
        const path = url.split('localhost:3001')[1];
        const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        return `${cleanBaseUrl}${path}`;
    }

    // If it's already an absolute URL (starts with http or https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // If it's a relative path, prepend the API base URL
    // Ensure we don't have double slashes
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;

    return `${cleanBaseUrl}${cleanPath}`;
};
