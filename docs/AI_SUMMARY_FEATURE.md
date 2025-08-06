# AI Summary Feature

This feature adds AI-powered portfolio summarization using Google's Gemini AI model. It provides visitors with quick, professional summaries of your portfolio content.

## Features

- **Smart Summarization**: Uses Gemini 1.5 Flash model for concise, professional summaries
- **Multiple Integration Points**: Available in header and about sections
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Copy to Clipboard**: Easy sharing of generated summaries
- **Refresh Capability**: Generate new summaries on demand

## Setup

### 1. Get Google API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key for use in your environment variables

### 2. Environment Configuration

Add your Google API key to your `.env.local` file:

```bash
GOOGLE_API_KEY=your_google_api_key_here
```

### 3. Dependencies

The feature uses the following packages (already installed):

- `@google/generative-ai` - Google's Generative AI SDK
- `lucide-react` - Icons
- `motion` - Animations

## Components

### AiSummaryButton

A compact button component that shows/hides AI summaries inline.

**Usage:**

```tsx
import { AiSummaryButton } from "@/components/ai-summary-button";
import { extractPortfolioContent } from "@/utils/content-extractor";

<AiSummaryButton content={extractPortfolioContent()} className="ml-4" />;
```

### AiSummaryPanel

A full panel component for dedicated summary sections.

**Usage:**

```tsx
import { AiSummaryPanel } from "@/components/ai-summary-panel";
import { extractPortfolioContent } from "@/utils/content-extractor";

<AiSummaryPanel
  content={extractPortfolioContent()}
  title="Quick Overview"
  className="bg-muted/30"
/>;
```

## API Endpoint

The feature includes a Next.js API route at `/api/ai-summary` that:

- Accepts POST requests with content to summarize
- Uses Gemini 1.5 Flash model for generation
- Returns structured JSON responses
- Includes comprehensive error handling

## Content Extraction

The `extractPortfolioContent()` utility function:

- Safely decodes base64 encoded contact information
- Compiles comprehensive portfolio data
- Handles server-side rendering gracefully
- Returns formatted content suitable for AI processing

## Integration Points

### Header Integration

Added to the main header component for immediate visibility:

- Positioned next to the flip sentences
- Responsive design that adapts to screen size
- Maintains visual hierarchy

### About Section Integration

Integrated into the about panel as a dedicated summary section:

- Provides context-aware summaries
- Styled to match the overall design system
- Positioned for optimal user flow

## Customization

### Styling

All components use Tailwind CSS classes and can be customized via:

- `className` props
- CSS custom properties
- Tailwind configuration

### AI Prompt

Modify the prompt in `/api/ai-summary/route.ts` to adjust:

- Summary length and style
- Focus areas (technical skills, experience, etc.)
- Tone and language

### Content Selection

Update `extractPortfolioContent()` to include/exclude:

- Specific user data fields
- Additional context from other components
- Dynamic content based on user preferences

## Benefits for Portfolio Visitors

1. **Quick Overview**: Busy recruiters get instant insights
2. **Professional Summary**: AI-generated content maintains consistency
3. **Enhanced UX**: Interactive elements improve engagement
4. **Accessibility**: Provides alternative content consumption methods
5. **Modern Appeal**: Demonstrates technical innovation and AI integration

## Performance Considerations

- API calls are made on-demand only
- Responses are cached in component state
- Graceful loading states prevent UI blocking
- Error boundaries ensure app stability

## Security

- API key is server-side only
- Input sanitization prevents injection attacks
- Rate limiting can be added for production use
- CORS policies restrict unauthorized access
