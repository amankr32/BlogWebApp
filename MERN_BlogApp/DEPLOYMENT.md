# MERN Blog - Deployment Guide

## Project Setup Complete ✅

Your MERN blog application is now production-ready. Follow these steps to deploy.

---

## Backend Deployment

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Environment variables configured

### Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `.env` with your values:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Strong random string (min 32 chars)
   - `NODE_ENV`: Set to `production`
   - `FRONTEND_URL`: Your frontend domain

3. **Build & Start**
   ```bash
   npm start
   ```

### Deployment Platforms
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **Render**: Create Web Service
- **Vercel/AWS**: Use Node.js runtime

---

## Frontend Deployment

### Prerequisites
- Node.js v18+
- npm/yarn

### Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Build Production**
   ```bash
   npm run build
   ```

3. **Preview Build Locally**
   ```bash
   npm run preview
   ```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy --prod --dir=dist`

### Deploy to Any Static Host
- Upload contents of `dist/` folder to:
  - AWS S3 + CloudFront
  - Cloudflare Pages
  - GitHub Pages
  - Any static hosting service

---

## Production Checklist

- ✅ CORS configured for frontend domain
- ✅ JWT authentication enabled
- ✅ Security headers added (X-Content-Type-Options, X-Frame-Options)
- ✅ Error handling with stack traces hidden in production
- ✅ Environment variables separated from code
- ✅ Build optimized with code splitting
- ✅ Console logs removed in production builds
- ✅ MongoDB connection configured

---

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/blogapp
JWT_SECRET=your_32+_character_secret_key
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

### Frontend (vite.config.js)
- Configure API base URL if needed
- Update environment in `.env` (if required)

---

## Verification

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

2. **API Routes**
   - `POST /api/auth/register` - Register user
   - `POST /api/auth/login` - Login user
   - `GET /api/auth/me` - Get profile (protected)
   - `GET /api/blogs` - Get all blogs
   - `GET /api/blogs/:slug` - Get single blog
   - `POST /api/blogs` - Create blog (protected)
   - `PUT /api/blogs/:id` - Update blog (protected)
   - `DELETE /api/blogs/:id` - Delete blog (protected)

---

## Common Issues & Fixes

### Frontend: Tailwind CSS Error
- ✅ **Fixed**: Changed `@utility` to `@layer base`

### Backend: Module Type Error
- ✅ **Fixed**: Changed `"type": "commonjs"` to `"type": "module"`

### CORS Issues
- Update `FRONTEND_URL` in backend `.env`
- Restart backend server

### MongoDB Connection Failed
- Verify IP whitelist in MongoDB Atlas
- Check connection string credentials
- Ensure network access is enabled

---

## Performance Optimization

### Frontend
- Code splitting enabled (vendor chunk)
- Terser minification active
- Console logs removed in production
- Source maps disabled

### Backend
- JSON payload limit: 10MB
- Request timeout handling
- Efficient database queries recommended
- Connection pooling via Mongoose

---

## Security Notes

⚠️ **Important**:
1. Never commit `.env` file to git
2. Use strong JWT secrets (32+ random characters)
3. Enable MongoDB IP whitelist
4. Use HTTPS in production
5. Implement rate limiting for APIs (recommended)
6. Validate all user inputs

---

## Support & Monitoring

- Monitor error logs in production
- Set up error tracking (e.g., Sentry)
- Use APM tools for performance monitoring
- Check backend health endpoint regularly

---

Ready to deploy! 🚀
