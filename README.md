# Gustavo.AI Scheduling Service

An intelligent AI-powered scheduling service that automates property service coordination through email and SMS communication.

## Features

- 🤖 **AI Communication Engine**: Automated email and SMS coordination
- 📅 **Calendar Integration**: Google Calendar, Outlook, Apple Calendar support
- 🏠 **Property Services**: Cleaning, repair, inspection, and maintenance scheduling
- 📱 **Multi-channel Communication**: Email and SMS support
- ⚡ **Real-time Updates**: Live status tracking and notifications
- 🔄 **Smart Coordination**: AI finds optimal meeting times across participants

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **AI**: OpenAI GPT-4 (planned)
- **Email**: Resend/SendGrid (planned)
- **SMS**: Twilio (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gustavo-ai-scheduling.git
cd gustavo-ai-scheduling
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

5. Set up the database:
```bash
# Run the database schema in your Supabase SQL editor
# Copy the contents of database-schema.sql
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── scheduling/
│   │   │   └── route.ts          # Scheduling API endpoints
│   │   ├── conversations/
│   │   │   └── route.ts          # AI conversation handling
│   │   └── calendar/
│   │       └── route.ts          # Calendar integration
│   ├── scheduling/
│   │   ├── page.tsx              # Scheduling interface
│   │   └── scheduling.module.css
│   ├── dashboard/
│   │   ├── page.tsx              # Admin dashboard
│   │   └── dashboard.module.css
│   └── globals.css
├── components/
│   ├── SchedulingForm.tsx        # Scheduling request form
│   ├── CalendarView.tsx          # Calendar display
│   └── ConversationView.tsx      # AI conversation display
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── ai.ts                    # AI communication logic
│   └── calendar.ts              # Calendar integration
└── types/
    └── index.ts                 # TypeScript type definitions
```

## Database Schema

The project uses a comprehensive database schema with the following tables:

- `scheduling_requests` - Main scheduling requests
- `ai_conversations` - AI conversation tracking
- `messages` - Individual messages in conversations
- `participant_availability` - Participant time preferences
- `calendar_integrations` - Calendar service connections
- `scheduled_events` - Final scheduled events

## API Endpoints

### Scheduling
- `POST /api/scheduling` - Create new scheduling request
- `GET /api/scheduling` - Get scheduling requests

### Conversations
- `POST /api/conversations` - Send AI message
- `GET /api/conversations` - Get conversation history

### Calendar
- `POST /api/calendar/connect` - Connect calendar service
- `GET /api/calendar/events` - Get calendar events

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Make sure to set all required environment variables in your Vercel project settings.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@gustavo.ai or create an issue in this repository.
