# AI Email Agent System

> An AI-powered multi-agent email marketing platform that researches customers, analyzes competitors and trends, generates high-converting email copy, performs automated QA, and creates production-ready Klaviyo HTML emails.

---

## 🚀 Overview

The **AI Email Agent System** is a multi-agent AI platform built for **e-commerce email marketing workflows**.

Instead of relying on a single AI prompt to generate an email, the system uses multiple specialized AI agents for:

* Campaign briefing
* Initial copy generation
* Audience research
* Competitor research
* Trend research
* Research synthesis
* Email copywriting
* Copy QA
* Email design
* Design QA
* Human approval
* Klaviyo-ready HTML export

The complete workflow is designed to take a campaign from a simple brief to a final production-ready email.

### Core Workflow

```text
Campaign Brief
      ↓
Creative Brief Agent
      ↓
Initial Copy
      ↓
┌──────────────────────────────┐
│       Parallel Research      │
│                              │
│  Audience Research           │
│  Competitor Research         │
│  Trend Research              │
└──────────────┬───────────────┘
               ↓
        Research Synthesis
               ↓
      5 Copy Variations
               ↓
           Copy QA
               ↓
        Human Selection
               ↓
        Email Designer
               ↓
          Design QA
               ↓
        Human Approval
               ↓
      Klaviyo HTML Export
```

---

# ✨ Features

## 🤖 Multi-Agent AI Architecture

The platform uses specialized AI agents, with each agent responsible for a specific part of the email creation process.

### Agents

| Agent                     | Responsibility                                                   |
| ------------------------- | ---------------------------------------------------------------- |
| Brief Agent               | Converts campaign information into a structured creative brief   |
| Initial Copy Agent        | Creates the initial pre-research email                           |
| Audience Research Agent   | Researches customer pain points, language and buying motivations |
| Competitor Research Agent | Analyzes competitor positioning, offers and messaging            |
| Trend Research Agent      | Finds current trends, hooks and cultural signals                 |
| Synthesis Agent           | Combines research into actionable marketing insights             |
| Copywriting Agent         | Generates multiple research-informed email variations            |
| Copy QA Agent             | Scores and evaluates generated copy                              |
| Designer Agent            | Converts approved copy into responsive HTML email                |
| Design QA Agent           | Reviews the final email for quality and compatibility            |

---

# 🔎 Audience Research

The Audience Research Agent investigates real customer conversations and feedback.

Research can include sources such as:

* Reddit
* Amazon reviews
* Quora
* YouTube
* Facebook
* TikTok
* Instagram
* Trustpilot
* Online forums
* Google search results
* Pinterest
* Product reviews

The agent looks for:

* Customer pain points
* Purchase motivations
* Objections
* Customer language
* Emotional triggers
* Desired outcomes
* Alternatives
* Trust signals
* Common complaints

The objective is to understand **how customers actually think and talk**, rather than relying only on generic marketing assumptions.

---

# 🕵️ Competitor Research

The Competitor Research Agent analyzes the competitive landscape.

It looks for:

* Competitor messaging
* Promotional offers
* Email angles
* Subject-line patterns
* CTAs
* Positioning
* Social proof
* Customer objections
* Market gaps
* Differentiation opportunities

This allows the copywriting process to be based on both **customer insight and competitive intelligence**.

---

# 📈 Trend Research

The Trend Research Agent looks for recent market and cultural signals.

It analyzes:

* Trending topics
* Content formats
* Current hooks
* Seasonal opportunities
* Audience language
* Viral content structures
* Cultural moments
* Recent e-commerce trends

The goal is to identify opportunities that can make the campaign more relevant and timely.

---

# 🧠 Research Synthesis

The three research streams are combined by the **Synthesis Agent**.

```text
Audience Research
        +
Competitor Research
        +
Trend Research
        ↓
Research Synthesis
        ↓
Master Marketing Insights
```

The synthesis process extracts:

* Top customer pain points
* Primary purchase triggers
* Strongest marketing angles
* Competitive gaps
* Recommended tone
* Power words
* Social proof opportunities
* Urgency strategies
* Unique hooks
* Subject-line directions

---

# ✍️ AI Copywriting

After research, the Copywriting Agent generates **five different email variations**.

Each variation follows a different strategic direction.

### 1. Pain-Led

Focuses on the customer's biggest validated problem.

### 2. Benefit-Led

Focuses on the transformation or outcome the customer wants.

### 3. Social-Proof-Led

Uses credibility and customer validation.

### 4. Urgency-Led

Uses relevant urgency or scarcity mechanisms.

### 5. Curiosity / Story-Led

Uses curiosity, storytelling and customer language to generate interest.

The system can also compare:

```text
Initial AI Copy
      ↓
Research
      ↓
Research-Informed Copy
```

This makes it possible to see how research changes the original marketing hypothesis.

---

# 🧪 Automated Copy QA

Every generated copy variation is evaluated by the Copy QA Agent.

The QA process evaluates factors such as:

* Subject-line strength
* Hook quality
* Value proposition clarity
* CTA effectiveness
* Brand tone
* Audience resonance
* Conversion potential

The system generates scores and recommendations and identifies the strongest variations.

The user then gets a **human review checkpoint** before the copy moves into the design stage.

---

# 🎨 AI Email Designer

After the user selects the preferred copy, the Designer Agent converts it into a complete HTML email.

The generated email is designed for e-commerce email marketing and includes:

* Responsive layout
* Mobile-friendly design
* Inline CSS
* CTA buttons
* Product-focused sections
* Brand header
* Footer
* Unsubscribe functionality
* Klaviyo merge tags

Example:

```liquid
{{ first_name|default:'there' }}
```

and:

```liquid
{{unsubscribe_link}}
```

---

# 📱 Responsive Email Design

The generated emails are structured around a common email width of approximately **600px** and are designed to work across desktop and mobile email clients.

The design process prioritizes:

* Clear visual hierarchy
* Strong CTA visibility
* Mobile readability
* Simple layouts
* Conversion-focused sections
* Email-client compatibility

---

# 🔬 Design QA

Before the email can be finalized, the Design QA Agent reviews the generated HTML.

It checks:

* Mobile responsiveness
* CTA visibility
* Inline CSS
* Unsubscribe link
* Klaviyo merge tags
* Subject/content consistency
* Spam-risk language
* Image alt text
* Brand consistency
* Conversion potential

The QA output includes information such as:

```text
Overall Score
Approval Status
Issues
Warnings
Positives
Spam Risk
Mobile Ready
Klaviyo Ready
Required Fixes
Summary
```

---

# 👤 Human-in-the-Loop

The system is intentionally designed with human approval checkpoints.

AI handles:

* Research
* Analysis
* Copy generation
* Copy scoring
* Email design
* Design QA

Humans remain responsible for:

* Selecting the final copy
* Reviewing generated designs
* Requesting revisions
* Approving the final campaign

### Copy Approval

```text
AI generates 5 variations
        ↓
Copy QA
        ↓
Top variations
        ↓
Human selects copy
```

### Design Approval

```text
HTML generation
        ↓
Design QA
        ↓
Email preview
        ↓
Human review
        ↓
Final approval
```

---

# 🔄 Campaign Revisions

Users can request revisions after reviewing the AI-generated content.

Supported revision stages include:

```text
Copy Revision
Design Revision
```

The revision feedback is passed back into the AI workflow so the campaign can be improved without starting from scratch.

---

# 📁 Project Management

Campaigns are organized inside projects.

Each project can contain:

* Project name
* Brand
* Niche
* Goals
* Campaigns
* Campaign history
* Campaign status

This makes the system suitable for managing multiple e-commerce brands and campaigns.

---

# 🔐 Authentication & Authorization

The application uses JWT-based authentication.

It supports two primary roles:

### Admin

Admins can:

* Create projects
* Create campaigns
* Manage users
* Assign workspace access
* Activate/deactivate users
* Delete users

### Member

Members can access only the workspaces assigned to them.

---

# ⚡ Real-Time Agent Progress

Long-running AI operations use **Server-Sent Events (SSE)**.

The frontend can receive progress updates as different agents complete their work.

Example workflow events:

```text
brief
initial_copy
research
synthesis
copy
copyQA
checkpoint1
design
designQA
checkpoint2
complete
```

This allows users to see which stage of the AI workflow is currently running.

---

# 🏗️ Architecture

```text
                    ┌────────────────────┐
                    │      Frontend      │
                    │ HTML/CSS/JS        │
                    └─────────┬──────────┘
                              │
                         REST + SSE
                              │
                              ▼
                    ┌────────────────────┐
                    │   Express Server   │
                    ├────────────────────┤
                    │ Authentication     │
                    │ Projects           │
                    │ Campaigns          │
                    │ Users              │
                    │ Workspaces         │
                    └─────────┬──────────┘
                              │
              ┌───────────────┴────────────────┐
              │                                │
              ▼                                ▼
      ┌───────────────┐                ┌────────────────┐
      │    MongoDB    │                │   AI Agents    │
      │   Mongoose    │                ├────────────────┤
      └───────────────┘                │ Brief          │
                                       │ Research       │
                                       │ Synthesis      │
                                       │ Copywriting    │
                                       │ Copy QA        │
                                       │ Designer       │
                                       │ Design QA      │
                                       └───────┬────────┘
                                               │
                                               ▼
                                      ┌──────────────────┐
                                      │ Anthropic Claude │
                                      │       API        │
                                      └──────────────────┘
```

---

# 🛠️ Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* CORS
* dotenv

## AI

* Anthropic Claude API
* Claude Sonnet
* Anthropic web search
* Multi-agent orchestration
* Structured AI outputs

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Server-Sent Events
* Local Storage

## Email

* HTML Email
* Responsive Email Design
* Inline CSS
* Klaviyo Merge Tags

---

# 📂 Project Structure

```text
my-email-AI-agents/
│
├── agents/
│   ├── briefAgent.js
│   ├── copyQAAgent.js
│   ├── copywritingAgent.js
│   ├── designQAAgent.js
│   ├── designerAgent.js
│   ├── orchestrator.js
│   ├── researchAgents.js
│   └── synthesisAgent.js
│
├── db/
│   ├── connection.js
│   ├── models.js
│   └── seed.js
│
├── middleware/
│   └── auth.js
│
├── knowledge/
│   ├── copywriting.txt
│   ├── design.txt
│   └── swipeFile.txt
│
├── routers/
│   ├── auth.js
│   ├── campaigns.js
│   ├── projects.js
│   └── users.js
│
├── utils/
│   ├── claude.js
│   └── knowledge.js
│
├── public/
│   ├── index.html
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
└── .env
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd my-email-AI-agents
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key

PORT=3000

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/email_agents

JWT_SECRET=your_long_random_secret

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

> ⚠️ Never commit your `.env` file or API keys to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules/
```

---

# 🗄️ Database Setup

Initialize the database and default workspace configuration:

```bash
npm run setup
```

The seed process creates the initial workspace configuration and admin account using the environment variables.

### Available Workspaces

```text
Email Marketing
Status: Active
```

```text
Website Design
Status: Coming Soon
```

---

# ▶️ Running the Application

Start the application with:

```bash
npm start
```

The application will be available at:

```text
http://localhost:3000
```

Open the URL in your browser.

---

# 🧑‍💻 Campaign Example

A DTC skincare brand wants to promote a Vitamin C Serum.

The marketer provides:

```text
Brand:
Nova Skin

Product:
Vitamin C Serum

Audience:
US skincare customers

Goal:
Generate first-time purchases

Offer:
20% OFF

Email Type:
Promotional
```

The system then automatically:

```text
1. Creates a structured campaign brief
2. Generates an initial email
3. Researches the target audience
4. Researches competitors
5. Researches current trends
6. Synthesizes the research
7. Generates 5 email angles
8. Runs copy QA
9. Presents the strongest variations
10. Waits for human copy selection
11. Generates the email design
12. Runs design QA
13. Waits for human approval
14. Exports the final HTML
```

---

# 🔌 API Endpoints

## Authentication

### Login

```http
POST /api/auth/login
```

Example:

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

---

## Fields

### Get accessible fields

```http
GET /api/fields
```

Requires authentication.

---

## Projects

### Get Projects

```http
GET /api/projects?field_id=<FIELD_ID>
```

### Search Projects

```http
GET /api/projects?field_id=<FIELD_ID>&search=<QUERY>
```

### Get Project

```http
GET /api/projects/:id
```

### Create Project

```http
POST /api/projects
```

Example:

```json
{
  "name": "Nova Skin",
  "brand": "Nova Skin",
  "niche": "Skincare",
  "goals": "Increase repeat purchases",
  "field_id": "FIELD_ID"
}
```

### Delete Project

```http
DELETE /api/projects/:id
```

---

# 📧 Campaign API

### Run Campaign Workflow

```http
POST /api/campaigns/run
```

This endpoint starts the multi-agent workflow and streams progress using Server-Sent Events.

### Generate Design

```http
POST /api/campaigns/design
```

### Get Campaign

```http
GET /api/campaigns/:id
```

### Approve Campaign

```http
POST /api/campaigns/:id/approve
```

### Request Revision

```http
POST /api/campaigns/:id/revision
```

Supported revision types:

```text
copy
design
```

---

# 👥 User Management

Admin-only endpoints:

```http
GET    /api/users
GET    /api/users/fields
POST   /api/users
PUT    /api/users/:id/fields
PUT    /api/users/:id/toggle
DELETE /api/users/:id
```

---

# 📚 Knowledge Base

The project includes a lightweight knowledge base:

```text
knowledge/
├── copywriting.txt
├── design.txt
└── swipeFile.txt
```

These files provide additional context to the AI agents.

This makes it possible to improve the system's marketing knowledge without rewriting the entire application.

---

# 🔒 Security

The application uses:

### Password Hashing

```text
bcryptjs
```

### Authentication

```text
JWT
```

### Environment Variables

```text
dotenv
```

### Role-Based Authorization

```text
admin
member
```

Sensitive credentials should always remain inside environment variables.

---

# ⚠️ Production Considerations

Before deploying the application to production, consider adding:

* API rate limiting
* Stronger input validation
* HTTPS
* Secure authentication storage
* Production CORS configuration
* Error monitoring
* AI request retry logic
* AI timeout handling
* Search failure handling
* Usage and AI-cost monitoring
* Database indexes
* Email-client compatibility testing
* Production email rendering tests
* Stronger permission management

---

# 🐛 Known Setup Issue

The current project structure contains:

```text
routers/
```

However, `server.js` imports routes using:

```javascript
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import campaignRoutes from './routes/campaigns.js';
import userRoutes from './routes/users.js';
```

If your directory is named `routers`, update the imports to:

```javascript
import authRoutes from './routers/auth.js';
import projectRoutes from './routers/projects.js';
import campaignRoutes from './routers/campaigns.js';
import userRoutes from './routers/users.js';
```

Alternatively, rename the directory:

```bash
mv routers routes
```

---

# 🚀 Future Improvements

## AI

* Persistent brand memory
* Brand voice training
* Research caching
* Competitor monitoring
* Automated offer analysis
* Historical campaign analysis
* Performance-based AI optimization

## Email Marketing

* Klaviyo API integration
* Direct campaign publishing
* Automated flow generation
* A/B test generation
* Subject-line testing
* Segment recommendations
* Lifecycle email generation

## Analytics

* Open-rate tracking
* Click-through-rate tracking
* Revenue attribution
* Campaign performance comparison
* AI-generated performance insights

## Agency Features

* Client accounts
* Client approval portals
* Team collaboration
* Client comments
* Task management
* Campaign templates
* Brand asset libraries
* AI usage tracking
* Cost monitoring

---

# 🎯 Why This Project?

Traditional AI email generation often follows:

```text
Prompt → AI → Email
```

This project uses a more structured approach:

```text
Research
   ↓
Strategy
   ↓
Copy
   ↓
QA
   ↓
Human Review
   ↓
Design
   ↓
QA
   ↓
Human Approval
   ↓
Production HTML
```

The goal is to combine **AI automation with research, specialization, quality control, and human judgment**.

---

# 📌 Project Status

```text
🟢 Email Marketing       Active
🟢 AI Research           Active
🟢 AI Copywriting        Active
🟢 Copy QA               Active
🟢 Email Design          Active
🟢 Design QA             Active
🟢 Klaviyo HTML          Active
🟢 Authentication        Active
🟢 Project Management    Active
🟢 Team Management       Active

🟡 Website Design        Coming Soon
```

---

# 📄 License

Add your preferred license here.

For example:

```text
MIT License
```

or:

```text
This project is proprietary software.
All rights reserved.
```

---

# 👨‍💻 Author

**AI Email Agent System**

Built for AI-powered e-commerce email marketing automation.

```text
Research → Strategy → Copy → QA → Design → Approval → Export
```
