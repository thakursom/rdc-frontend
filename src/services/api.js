// services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

let authToken = null;

export const setToken = (token) => {
    authToken = token;
};

export const clearToken = () => {
    authToken = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
};

export const apiRequest = async (endpoint, method = "GET", body = null, auth = false, isBinary = false) => {
    const headers = {};

    if (auth && authToken) {
        headers["authorization"] = `Bearer ${authToken}`;
    }

    const isFormData = body instanceof FormData;
    const options = { method, headers };

    if (method !== "GET" && body) {
        options.body = isFormData ? body : JSON.stringify(body);
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        
        // Handle binary responses (Excel files)
        if (isBinary) {
            if (!response.ok) {
                // Try to get error message from response
                const errorText = await response.text();
                throw new Error(`Export failed: ${errorText || response.statusText}`);
            }
            
            const blob = await response.blob();
            
            // Check if it's actually an error (server might return JSON error)
            if (blob.type === 'application/json' || blob.size < 100) {
                const text = await blob.text();
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Export failed');
                } catch {
                    throw new Error(text || 'Export failed');
                }
            }
            
            return blob;
        }
        
        // Handle JSON responses
        const data = await response.json();

        if (data.message === "Token expired" || response.status === 401) {
            clearToken();
        }

        return { success: response.ok, data };
    } catch (error) {
        console.error("API Error:", error);
        
        if (isBinary) {
            throw error;
        }
        
        return { success: false, data: { message: error.message || "Server Error" } };
    }
};

// Add these new functions for download tracking
export const startExport = async (params) => {
    try {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== false) {
                const paramValue = typeof value === 'boolean' ? value.toString() : value;
                queryParams.append(key, paramValue);
            }
        });
        
        const response = await apiRequest(
            `/revenueReports/export/start?${queryParams.toString()}`,
            "GET",
            null,
            true
        );
        
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const checkExportStatus = async (downloadId) => {
    try {
        const response = await apiRequest(
            `/revenueReports/export/status/${downloadId}`,
            "GET",
            null,
            true
        );
        
        return response;
    } catch (error) {
        return { success: false, message: error.message };
    }
};