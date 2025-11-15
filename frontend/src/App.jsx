import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBlogs from "./pages/MyBlogs";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import ViewBlog from "./pages/ViewBlog";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/blog/:id" element={<ViewBlog />} />

                        {/* Private Routes */}
                        <Route
                            path="/my-blogs"
                            element={
                                <PrivateRoute>
                                    <MyBlogs />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <PrivateRoute>
                                    <CreateBlog />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/edit/:id"
                            element={
                                <PrivateRoute>
                                    <EditBlog />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
