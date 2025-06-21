<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Community Allotment Association App

This is a Next.js application for managing an allotment association community. The app includes:

## Key Features:

- **User Authentication & Subscriptions**: Users can subscribe to announcements
- **Admin Dashboard**: Admins can post and manage announcements
- **Announcement Types**: Deliveries (bark, woodchips, plants), orders, tips, and extensible for future types
- **AI Plant Advisor**: Integrated AI for plant advice, climate recommendations, and allotment-specific guidance
- **Calendar System**: Track events, seasonal tasks, and community activities
- **Modern UI**: Built with Tailwind CSS for responsive design

## Technology Stack:

- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- App Router for modern Next.js routing

## Prerequisites:

- Node.js 22+ installed
- npm package manager
- Tests with Playwright
- Git repository initialized and connected to GitHub
- **Playwright tests must pass**: Run `npm run test` to ensure all tests are passing before making changes
- Run `npm run dev` to start the development server on http://localhost:3000

## Code Conventions:

- Use TypeScript for all components and utilities
- Playwright tests need to be 100% success before pushing
- Test feedback should be clear, fast and reliable
- Prefer simple solutions over complex ones
- Don't be lazy and try to avoid unnecessary complexity
- Commit and push often
- Follow Next.js App Router patterns
- Use Tailwind CSS classes for styling
- Implement proper error handling and loading states
- Focus on accessibility and responsive design
- Use server components where possible for better performance

## AI Integration Guidelines:

- Prioritize plant-specific AI models when available
- Focus on allotment-relevant advice (vegetables, herbs, seasonal tasks)
- Include climate-specific recommendations
- Provide practical, actionable advice for gardeners
- BYO (Bring Your Own) OpenAI API key for AI features

## Database Considerations:

- Plan for user management and authentication
- Store announcement types and categories
- Track user subscriptions and preferences
- Use github as storage for announcements and other static data
- Consider seasonal task scheduling
- Plan for AI conversation history if needed
