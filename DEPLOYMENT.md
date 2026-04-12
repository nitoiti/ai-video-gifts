# Deployment Instructions for Memory Video Gifts

## GitHub Repository
Your project is already uploaded to GitHub:
https://github.com/nitoiti/ai-video-gifts

## Vercel Deployment Steps

### 1. Go to Vercel
Visit https://vercel.com and sign in with your GitHub account.

### 2. Import Project
1. Click "Add New..." > "Project"
2. Import your GitHub repository: `nitoiti/ai-video-gifts`
3. Vercel will automatically detect it's a static site

### 3. Configure Settings
- **Framework Preset**: Other
- **Root Directory**: `./` (leave empty)
- **Build Command**: Not needed (static site)
- **Output Directory**: `./` (leave empty)
- **Environment Variables**: Not needed for static site

### 4. Deploy
Click "Deploy" and wait for deployment to complete.

### 5. Custom Domain
After deployment:
1. Go to project settings in Vercel
2. Click "Domains" 
3. Add your custom domain
4. Vercel will provide DNS records
5. Update DNS settings with your domain provider

## Alternative: Netlify Deployment
If you prefer Netlify:
1. Go to https://netlify.com
2. Sign in with GitHub
3. Drag and drop your project folder or connect GitHub
4. Add custom domain in site settings

## Current Project Status
- Static HTML website with Tailwind CSS
- YouTube video integration with custom sound controls
- Russian language content
- Single pricing package (420 MDL)
- Mobile responsive design
- Ready for deployment

## Post-Deployment Checklist
- [ ] Test YouTube video playback
- [ ] Test sound toggle functionality
- [ ] Test mobile responsiveness
- [ ] Test Stripe payment links (update URLs)
- [ ] Test all buttons and navigation
- [ ] Verify custom domain setup
