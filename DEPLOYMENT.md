# Deployment Guide - Gustavo.AI Scheduling Service

This guide will help you deploy the AI Scheduling Service to Vercel and set up all necessary integrations.

## Prerequisites

- GitHub account
- Vercel account
- Supabase account
- (Optional) OpenAI API key for AI features
- (Optional) Resend API key for email
- (Optional) Twilio credentials for SMS

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `gustavo-ai-scheduling` or your preferred name
3. Make it public or private (your choice)
4. **Don't** initialize with README, .gitignore, or license (we already have these)

## Step 2: Push Code to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/gustavo-ai-scheduling.git

# Push the code
git push -u origin main
```

## Step 3: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and create a new project
2. Once created, go to the SQL Editor
3. Copy the entire contents of `database-schema.sql` and run it
4. Go to Settings > API to get your project URL and anon key

## Step 4: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

## Step 5: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional Variables (for full functionality)
```env
# AI Features (OpenAI)
OPENAI_API_KEY=your_openai_api_key

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@gustavo.ai

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Step 6: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Step 7: Test the Deployment

1. Visit your deployed URL
2. Navigate to `/scheduling` to test the scheduling form
3. Navigate to `/dashboard` to view the admin dashboard
4. Test creating a scheduling request

## Step 8: Set Up Custom Domain (Optional)

1. In Vercel, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS settings as instructed by Vercel

## Environment Variables Setup Guide

### Supabase Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API
3. Copy the Project URL and anon key
4. Add to Vercel environment variables

### OpenAI Setup (Optional)
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add to Vercel environment variables

### Resend Setup (Optional)
1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add to Vercel environment variables

### Twilio Setup (Optional)
1. Sign up at [Twilio](https://twilio.com)
2. Get your Account SID and Auth Token
3. Get a phone number
4. Add all to Vercel environment variables

## Troubleshooting

### Build Errors
- Check that all environment variables are set correctly
- Ensure the database schema has been run in Supabase
- Check the build logs in Vercel for specific errors

### Database Connection Issues
- Verify your Supabase URL and anon key are correct
- Check that Row Level Security (RLS) policies are set up
- Ensure the database tables exist

### API Errors
- Check the browser console for client-side errors
- Check Vercel function logs for server-side errors
- Verify all required environment variables are set

## Next Steps

After successful deployment:

1. **Set up monitoring**: Add error tracking (Sentry, LogRocket)
2. **Add authentication**: Implement user authentication
3. **Enable AI features**: Add OpenAI integration for smart scheduling
4. **Add email/SMS**: Integrate Resend and Twilio for communication
5. **Calendar integration**: Add Google Calendar, Outlook integration
6. **Analytics**: Add usage analytics and reporting

## Support

If you encounter issues:
1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Check the [Vercel documentation](https://vercel.com/docs)
3. Check the [Supabase documentation](https://supabase.com/docs)
4. Create an issue in the GitHub repository

## Security Notes

- Never commit environment variables to Git
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor your Supabase usage and costs
- Set up proper RLS policies in Supabase for production 