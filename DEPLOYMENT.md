# DevBytes Deployment Guide

## GitHub Setup

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it `devbytes-news-app`
   - Make it public or private as desired
   - Don't initialize with README (we already have one)

2. **Connect Replit to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/devbytes-news-app.git
   git branch -M main
   git add .
   git commit -m "Initial commit: DevBytes tech news app"
   git push -u origin main
   ```

## Environment Variables for Deployment

Make sure to set these environment variables in your deployment platform:

```
GNEWS_API_KEY=your_gnews_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```

## Replit Deployment (Recommended)

1. **Using Replit Deployments**:
   - Click the "Deploy" button in your Replit interface
   - Choose "Autoscale" for automatic scaling
   - Your app will be deployed to a `.replit.app` domain
   - Environment variables are automatically included

2. **Custom Domain** (Optional):
   - In deployment settings, you can add your own domain
   - Follow DNS configuration instructions

## Alternative Deployment Options

### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

### Railway
1. Connect GitHub repository
2. Railway will auto-detect the Node.js app
3. Add environment variables in Railway dashboard

### Render
1. Connect GitHub repository
2. Choose "Web Service"
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables

## Important Notes

- **API Limits**: GNews free tier has daily request limits
- **Caching**: App includes smart caching to optimize API usage
- **Rate Limiting**: Built-in protection against hitting API limits
- **Environment Variables**: Required for news API and AI features

## Production Checklist

- [ ] GitHub repository created and connected
- [ ] Environment variables configured
- [ ] Deployment platform chosen
- [ ] Custom domain configured (optional)
- [ ] SSL certificate enabled (usually automatic)
- [ ] API keys secured and not exposed in client code