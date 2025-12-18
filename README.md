# 🌱 Community Allotment App - Your Personal Garden Companion! 

*Because planning a garden shouldn't be harder than growing tomatoes in winter!*

Welcome to your personal digital garden assistant. Plan your plot, get AI-powered advice, and learn proven growing techniques—all in one place.

## 🤖 AI-Generated Code Disclaimer

**This entire project was created using Claude Sonnet (Anthropic's AI assistant) via VS Code's agent mode.** Every line of code, configuration, test, and documentation was generated through AI assistance, demonstrating the current capabilities of AI-powered software development.

This serves as an example of what's possible when AI agents have access to development tools and can iterate on complex projects. The code quality, architecture decisions, and feature implementations represent the state of AI coding capabilities as of June 2025. I did guide the AI, as it does like to be a bit too creative at times, and too lazy at others, but the AI did the heavy lifting.

## 🎉 What Does This Thing Actually Do?

### 🗺️ Garden Planner
Design your perfect plot with our interactive garden planner:
- **Visual Grid Layout**: Plan your beds and see your garden come to life
- **Crop Management**: Track what you're growing and where
- **Smart Suggestions**: Get recommendations for filling gaps in your garden

### 🤖 Your New AI Garden Buddy
Think of it as having a horticultural genius in your pocket, except this one won't judge you for killing that "supposedly unkillable" succulent. Ask it anything:
- "Why are my tomatoes plotting against me?"
- "Is this normal plant behavior or should I call an exorcist?"
- "What's this green fuzzy stuff, and should I be worried?"

### 📚 Growing Guides
Learn proven techniques from our comprehensive guides:
- **Companion Planting**: Discover which plants thrive together
- **Composting**: Turn garden waste into black gold
- **Crop Rotation**: Keep your soil healthy year after year

## 🛠️ Built With Love (And Probably Too Much Coffee)

- **Next.js 15**: The latest and greatest from the Next.js team
- **React 19**: Cutting-edge React with all the new features
- **TypeScript**: For when JavaScript just isn't confusing enough
- **Tailwind CSS**: Making things pretty without the existential CSS crisis
- **Lucide Icons**: Tiny pictures that somehow make everything better
- **AI Integration**: The robot overlords, but for plants (powered by OpenAI)

## � Getting This Garden Party Started

*Warning: May cause excessive productivity and sudden urges to organize your tool shed*

1. **Grab the code** (it's free, unlike those expensive heritage seeds):

   ```bash
   git clone <repository-url>
   cd community-allotment
   ```

2. **Feed it dependencies** (like fertilizer, but for code):

   ```bash
   npm install --legacy-peer-deps
   ```

3. **Wake up the development server** (it's not a morning person):

   ```bash
   npm run dev
   ```

4. **Witness the magic**:
   
   Point your browser to `http://localhost:3000` and prepare to have your mind blown by the sheer beauty of organized allotment chaos!

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page with overview
│   ├── globals.css             # Global styles
│   ├── garden-planner/
│   │   └── page.tsx            # Interactive garden planning tool
│   ├── ai-advisor/
│   │   └── page.tsx            # AI-powered plant advice chat
│   ├── companion-planting/
│   │   └── page.tsx            # Companion planting guide
│   ├── composting/
│   │   └── page.tsx            # Composting guide
│   └── crop-rotation/
│       └── page.tsx            # Crop rotation guide
```

## 🎨 The Pretty Stuff (Design System)

*Because even gardening apps deserve to look gorgeous*

We've got colors! We've got components! We've got enough CSS classes to make your head spin faster than a composting tumbler!

### 🌈 Color Scheme
- **Primary Green**: Like fresh lettuce, but more digital
- **Earthy Grays**: For when you need that "sophisticated soil" vibe
- **Accent Colors**: Orange (carrots!), Blue (water!), Green (more plants!), Purple (eggplant!)

## 🏠 What Lives Where (Page Guide)

### Home Sweet Home (`/`)
Your digital allotment entrance hall. Includes a virtual welcome mat and everything you need to feel at home.

### Garden Planner (`/garden-planner`)
Your interactive plot planning tool. Design beds, place crops, and visualize your garden layout.

### Aitor - AI Garden Advisor (`/ai-advisor`)
Your personal garden guru that never sleeps, judges, or asks for payment in homegrown vegetables.

### Growing Guides
- **Companion Planting** (`/companion-planting`): Learn which plants help each other thrive
- **Composting** (`/composting`): Master the art of turning waste into garden gold
- **Crop Rotation** (`/crop-rotation`): Keep your soil healthy with smart rotation planning

## 🔮 Future Dreams and Schemes

*Because every good project needs unrealistic expectations*

### Coming Eventually™
- **Weather Integration**: So the AI can judge your watering schedule with actual meteorological data
- **Mobile App**: For when you need garden advice while standing in your actual allotment
- **Multi-language Support**: Because plants grow everywhere
- **Garden Data Persistence**: Cloud sync for your garden plans

### Pie-in-the-Sky Features
- **Plant Disease Photo Recognition**: Point, shoot, panic appropriately
- **Automated Seasonal Tips**: The AI becomes your personal garden calendar
- **Community Features**: Share plans and connect with fellow gardeners

## 🐛 Known Issues (The Hall of Shame)

- Sometimes the icons have commitment issues with the latest libraries
- A few forms are having an identity crisis about labels
- The linter occasionally throws temper tantrums about array keys
- Some community members still need help navigating the digital world

## 🤝 Want to Help Make This Less Ridiculous?

1. Fork it (the code, not your actual garden fork)
2. Branch it (again, the code)
3. Fix something or break something new
4. Test it (please, for the love of all things green)
5. Send us a pull request with your improvements

## 📜 License & Usage Policy

This project is **open source and free for personal, educational, and community use**.

### 🔑 **AI Token Setup**

The AI gardening advisor requires you to **bring your own ChatGPT API token**:

- 🎯 **No service costs** - you pay OpenAI directly for your AI usage
- 🔒 **Private tokens** - stored only in your browser session, never on servers
- ⚡ **Unlimited usage** - no artificial limits since you control your own costs
- 💰 **Cost transparency** - you see exactly what you pay (~$0.02-0.05 per query)

To set up:
1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add funds to your OpenAI account
3. Enter your API key in the AI Advisor settings
4. Start chatting with your AI garden expert!

### 📄 **License**

This project uses a **custom non-commercial license** for third parties - see the [LICENSE](./LICENSE) file for details.

**What this means for you:**

- ✅ Use it for your community allotment, garden club, or personal projects
- ✅ Learn from the code and improve your programming skills  
- ✅ Contribute improvements back to this project
- ✅ Modify and customize for your specific needs
- ✅ Educational and research use is allowed
- ❌ Commercial use by third parties is **not permitted** without a separate license

**Note:** The copyright holder retains full commercial rights. For commercial licensing inquiries, see the LICENSE file for contact information.

---

**Now go forth and grow things! Both plants and codebases! 🌿✨**

*P.S. - If this app actually helps organize your allotment community, we expect photos of the resulting garden chaos. The good kind of chaos.*
