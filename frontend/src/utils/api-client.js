import axios from "axios";

// Axios instance for authenticated APIs: sends the login token on every request
const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["X-Auth-Header"] = token;
  return config;
});

// Token expired or invalid: clear the session and send the user back to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Readable message from an API error (the backend's error pages aren't JSON)
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  const data = error?.response?.data;
  if (data && typeof data === "object" && data.message) return data.message;
  if (error?.response?.status === 401) return "Your session has expired. Please log in again.";
  if (error?.response?.status === 404) return "Not found.";
  if (!error?.response) return "Can't reach the server. Check your connection.";
  return fallback;
}

export default apiClient;
