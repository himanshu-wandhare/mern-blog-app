# 📝 MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React, and Node.js. Users can create accounts, write blog posts with rich text formatting, upload featured images, and manage post visibility (public/private).

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Node.js](https://img.shields.io/badge/Node.js-v22+-brightgreen)
![React](https://img.shields.io/badge/React-v19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v8+-green)

---

## 🌟 Features

### Authentication & Authorization

-   ✅ User registration with email validation
-   ✅ Secure login with JWT tokens
-   ✅ Password hashing using bcrypt
-   ✅ Persistent authentication state
-   ✅ Protected routes for authenticated users
-   ✅ Automatic token refresh

### Blog Management

-   ✅ Create blog posts with rich text editor (Editor.js)
-   ✅ Edit existing blog posts
-   ✅ Delete blog posts with confirmation
-   ✅ Featured image upload via Cloudinary
-   ✅ Public/Private visibility options
-   ✅ Real-time content preview

### Content Creation

-   ✅ Rich text editor with multiple formatting options:
    -   Headers (H2, H3, H4)
    -   Paragraphs
    -   Ordered & Unordered lists
    -   Blockquotes with citations
    -   Bold, Italic, Underline text
    -   Hyperlinks
-   ✅ Image upload with size validation (max 5MB)
-   ✅ Responsive editor interface

### User Experience

-   ✅ Clean and modern UI with Tailwind CSS
-   ✅ Fully responsive design (mobile, tablet, desktop)
-   ✅ Loading states and spinners
-   ✅ Toast notifications for user feedback
-   ✅ Error handling with meaningful messages

### Blog Discovery

-   ✅ Public blog feed on homepage
-   ✅ Personal blog dashboard
-   ✅ Blog preview cards with excerpts
-   ✅ Author information display
-   ✅ Update timestamps

---

## 🚀 Live Demo

-   **Frontend**: [https://blog-frontend.com](https://blog-frontend.com)
-   **Backend API**: [https://blog-api.com](https://blog-api.com)

### Demo Credentials

```
Email: himanshuwandhare13@gmail.com
Password: pass123@
```

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| **React 19**        | UI library for building interactive interfaces |
| **React Router v7** | Client-side routing and navigation             |
| **Tailwind CSS**    | Utility-first CSS framework for styling        |
| **Editor.js**       | Block-style rich text editor                   |
| **Axios**           | HTTP client for API requests                   |
| **React Hot Toast** | Beautiful toast notifications                  |
| **Vite**            | Fast build tool and dev server                 |

### Backend

| Technology            | Purpose                           |
| --------------------- | --------------------------------- |
| **Node.js**           | JavaScript runtime environment    |
| **Express.js**        | Web application framework         |
| **MongoDB**           | NoSQL database                    |
| **Mongoose**          | MongoDB object modeling           |
| **JWT**               | Secure authentication tokens      |
| **Bcrypt.js**         | Password hashing                  |
| **Multer**            | File upload middleware            |
| **Cloudinary**        | Cloud-based image storage         |
| **Express Validator** | Input validation and sanitization |

### DevOps & Tools

-   **MongoDB Atlas** - Cloud database hosting
-   **Cloudinary** - Image CDN and storage
-   **Git & GitHub** - Version control
-   **Render/Vercel** - Deployment platforms
-   **Postman** - API testing
-   **VS Code** - Code editor

---

## 📦 Installation & Setup

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   MongoDB (local or Atlas)
-   Cloudinary account (free tier)
-   Git

### 1. Clone the Repository

```bash
git clone https://github.com/himanshu-wandhare/mern-blog-app.git
cd mern-blog-app
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Create Environment File

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mern-blog
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mern-blog?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Start Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Create Environment File

Create a `.env.development` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, create `.env.production`:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

#### Start Frontend Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will run on `http://localhost:3000`

### 4. Setup Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add them to your backend `.env` file

### 5. Setup MongoDB Atlas (Optional)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist your IP address (or use `0.0.0.0/0` for all)
5. Get connection string and add to `.env`

---

## 📁 Project Structure

```
mern-blog-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Blog.js               # Blog schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── blogs.js              # Blog CRUD routes
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   ├── BlogCard.jsx      # Blog preview card
│   │   │   └── PrivateRoute.jsx  # Protected route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Public blog feed
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── MyBlogs.jsx       # User's blogs
│   │   │   ├── CreateBlog.jsx    # Create new blog
│   │   │   ├── EditBlog.jsx      # Edit existing blog
│   │   │   └── ViewBlog.jsx      # View single blog
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # React entry point
│   │   ├── editor.css            # Editor styles
│   │   └── index.css             # Global styles
│   ├── .env.development
│   ├── .env.production
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔑 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/auth/register` | Register new user | No            |
| POST   | `/api/auth/login`    | Login user        | No            |
| GET    | `/api/auth/me`       | Get current user  | Yes           |

### Blogs

| Method | Endpoint              | Description          | Auth Required |
| ------ | --------------------- | -------------------- | ------------- |
| GET    | `/api/blogs/public`   | Get all public blogs | No            |
| GET    | `/api/blogs/my-blogs` | Get user's blogs     | Yes           |
| GET    | `/api/blogs/:id`      | Get single blog      | Conditional\* |
| POST   | `/api/blogs`          | Create new blog      | Yes           |
| PUT    | `/api/blogs/:id`      | Update blog          | Yes           |
| DELETE | `/api/blogs/:id`      | Delete blog          | Yes           |

\*Conditional: Private blogs require authentication and authorization

---

## 🎨 UI Screens

### 1. Home Page

-   Displays all public blog posts
-   Blog cards with featured images
-   Click to read full post

### 2. Login/Register

-   Clean authentication forms
-   Input validation
-   Error handling

### 3. My Blogs Dashboard

-   Grid of user's blogs (public & private)
-   Edit/Delete actions
-   Create new post button

### 4. Create/Edit Blog

-   Rich text editor (Editor.js)
-   Featured image upload
-   Visibility toggle (Public/Private)
-   Real-time preview

### 5. View Blog

-   Full blog post view
-   Author information
-   Publication date
-   Edit/Delete (if owner)

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

-   [ ] Register with valid email
-   [ ] Register with invalid email (should fail)
-   [ ] Register with short password (should fail)
-   [ ] Login with correct credentials
-   [ ] Login with wrong credentials (should fail)
-   [ ] Logout successfully
-   [ ] Access protected routes without login (should redirect)

#### Blog Creation

-   [ ] Create blog with all fields
-   [ ] Create blog without title (should fail)
-   [ ] Create blog without image (should fail)
-   [ ] Upload image > 5MB (should fail)
-   [ ] Create blog with rich text formatting
-   [ ] Create public blog
-   [ ] Create private blog

#### Blog Management

-   [ ] View public blogs on homepage
-   [ ] View own blogs in dashboard
-   [ ] Edit blog successfully
-   [ ] Delete blog with confirmation
-   [ ] Private blogs not visible to others
-   [ ] Public blogs visible to everyone

#### UI/UX

-   [ ] Responsive on mobile devices
-   [ ] Responsive on tablets
-   [ ] Toast notifications appear
-   [ ] Loading states display
-   [ ] Error messages are clear
-   [ ] Navigation works correctly

---

## 🐛 Known Issues & Limitations

### Current Known Issues

1. **Editor.js Inline Formatting**

    - Some complex inline HTML might not preserve perfectly on edit
    - **Workaround**: Re-apply formatting after editing
    - **Status**: Investigating better HTML-to-EditorJS conversion

2. **Image Upload**

    - Large images (4-5MB) may take time to upload
    - No progress indicator during upload
    - **Status**: Planning to add upload progress bar

3. **Mobile Editor**

    - Editor.js toolbar can be difficult to use on small screens
    - **Status**: Considering mobile-optimized editor alternatives

4. **Search Functionality**
    - No search feature for blogs yet
    - **Status**: Planned for v2.0

### Browser Compatibility

-   ✅ Chrome (recommended)
-   ✅ Firefox
-   ✅ Safari
-   ✅ Edge

---

## 🚀 Future Improvements

### High Priority

-   [ ] Blog search and filtering
-   [ ] Categories and tags
-   [ ] User profiles with bio and avatar
-   [ ] Comments on blog posts
-   [ ] Like/reaction system
-   [ ] Social media sharing buttons
-   [ ] Email notifications
-   [ ] Password reset functionality

### Medium Priority

-   [ ] Blog drafts auto-save
-   [ ] Image optimization on upload
-   [ ] Multiple image support in posts
-   [ ] Markdown support as alternative to Editor.js
-   [ ] Reading time estimation
-   [ ] Blog analytics (views, likes)
-   [ ] Follow/unfollow authors
-   [ ] Bookmarking posts

### Low Priority

-   [ ] Dark mode theme
-   [ ] Export blogs as PDF/Markdown
-   [ ] Collaborative editing
-   [ ] Blog scheduling
-   [ ] SEO meta tags editor
-   [ ] RSS feed
-   [ ] Admin dashboard
-   [ ] Moderation system

### Performance Enhancements

-   [ ] Implement pagination for blogs
-   [ ] Add Redis caching
-   [ ] Lazy loading for images
-   [ ] Code splitting for React components
-   [ ] Service worker for offline support
-   [ ] CDN for static assets

### Security Enhancements

-   [ ] Rate limiting on all endpoints
-   [ ] Two-factor authentication
-   [ ] reCAPTCHA on registration
-   [ ] Content Security Policy headers
-   [ ] XSS protection improvements
-   [ ] SQL injection prevention (already using Mongoose)

---

## 📚 Documentation

### Database Schema

#### User Model

```javascript
{
  name: String (required, max: 50),
  email: String (required, unique),
  password: String (required, hashed, min: 6),
  createdAt: Date (default: now)
}
```

#### Blog Model

```javascript
{
  title: String (required, max: 200),
  content: String (required, HTML),
  featuredImage: String (required, Cloudinary URL),
  visibility: String (enum: ['public', 'private'], default: 'public'),
  author: ObjectId (ref: 'User'),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

-   Follow the existing code style
-   Write meaningful commit messages
-   Update documentation as needed
-   Add tests for new features
-   Ensure all tests pass before submitting PR

---

## 👨‍💻 Author

**Himanshu Wandhare**

-   GitHub: [@himanshu-wandhare](https://github.com/himanshu-wandhare)
-   LinkedIn: [Himanshu Wandhare](https://linkedin.com/in/himanshu-wandhare-253107216)
-   Email: himanshuwandhare13@gmail.com
-   Portfolio: [himanshu-wandhare-portfolio.vercel.app](https://himanshu-wandhare-portfolio.vercel.app)

---

## 🙏 Acknowledgments

-   [Editor.js](https://editorjs.io/) for the amazing rich text editor
-   [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
-   [Cloudinary](https://cloudinary.com/) for image hosting
-   [MongoDB](https://www.mongodb.com/) for the database
-   [React](https://react.dev/) team for the incredible library

---

## 📞 Support

If you have any questions or need help with setup:

1. Check the [Issues](https://github.com/himanshu-wandhare/mern-blog-app/issues) page
2. Create a new issue with detailed description
3. Contact via email: himanshuwandhare13@gmail.com

---

## ⭐ Star History

If you find this project useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=himanshu-wandhare/mern-blog-app&type=Date)](https://star-history.com/#yourusername/mern-blog-app&Date)

---

## 📊 Project Status

![Development Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Last Commit](https://img.shields.io/github/last-commit/himanshu-wandhare/mern-blog-app)
![Issues](https://img.shields.io/github/issues/himanshu-wandhare/mern-blog-app)

---

**Made with ❤️ by Himanshu Wandhare**
