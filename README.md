# ClauseRadar – Contract Risk Highlighter

ClauseRadar is an automated legal text screening and contract risk analysis engine designed for students, freelancers, first-time job seekers, and tenants. It identifies predatory clauses—such as mandatory 2-year service bonds, 90-day notice periods, liquidated damages, unilateral wage deductions, and non-compete terms—before you sign.

---

## 🌟 Key Features

1. **Dual-Layer Analysis Engine**:
   - **Deterministic 10-Category Rule Engine**: Scans contracts for Service Bonds, Non-Compete Restrictions, Automatic Renewal, Unilateral Modification, Salary Deductions, Unpaid Notice Periods, Data Sharing & Surveillance, Termination Restrictions, Intellectual Property Transfer, and Disproportionate Indemnification.
   - **Gemini 3.8 Flash AI Enhancement**: Translates complex legal legalese into layman's terms, identifies contextual concerns, and generates tailored counter-proposals and clarification questions.
   - **Zero-Dependency Fallback**: Fully functional even if Gemini API or MongoDB credentials are not provided.

2. **Accurate Document Highlighter**:
   - Color-coded text highlighting: Red for Critical/High, Amber for Medium, Green for Low risk.
   - Interactive bidirectional sync: clicking a flagged clause in the sidebar scrolls to and highlights the text in the original document; clicking highlighted text jumps to the analysis card.
   - In-document text search and font scaling.

3. **Transparent Risk Scoring System (0–100)**:
   - Severity weights: Critical (10 pts), High (8 pts), Medium (5 pts), Low (2 pts).
   - Normalized scoring into four tiers: Low Risk (0–24), Moderate Risk (25–49), High Risk (50–74), and Very High Risk (75–100).

4. **Multi-Contract Side-by-Side Comparison**:
   - Compare two or more previously analyzed contracts side by side.
   - Matrix comparison of clauses across all 10 risk dimensions.
   - Automatic identification of lowest/highest risk and missing protections.

5. **Student & Freelancer Empowerment**:
   - Instant "Load Demo Internship Agreement" pre-packaged with 5 high-risk clauses for immediate testing.
   - Copyable negotiation questions and specific counter-proposals to send to recruiters.

6. **Print & PDF Report Export**:
   - Clean printable report layout with ClauseRadar letterhead, severity breakdown, and legal disclaimer.

---

## 🏗️ Architecture & Folder Structure

```
ClauseRadar/
├── server/
│   ├── config/
│   │   └── db.ts                   # Mongoose / Persistent JSON storage engine
│   ├── controllers/
│   │   ├── authController.ts       # JWT authentication & password reset
│   │   ├── contractController.ts   # PDF upload & text analysis
│   │   ├── analysisController.ts   # Report retrieval & dashboard stats
│   │   ├── comparisonController.ts # Multi-contract comparative matrix
│   │   └── userController.ts       # User profiles & password change
│   ├── data/
│   │   └── demoContract.ts         # High-risk sample internship agreement
│   ├── middleware/
│   │   └── authMiddleware.ts       # JWT authentication & optional guest auth
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── contractRoutes.ts
│   │   ├── analysisRoutes.ts
│   │   ├── comparisonRoutes.ts
│   │   └── userRoutes.ts
│   └── services/
│       ├── ruleEngine.ts           # 10-category regex & contextual detection engine
│       ├── riskScoring.ts          # 0-100 normalized risk score calculator
│       ├── pdfService.ts           # PDF text extraction & chunking
│       └── explanationService.ts   # Server-side Gemini 3.8 Flash integration
├── src/
│   ├── components/
│   │   ├── Navbar.tsx              # Responsive navigation & theme toggle
│   │   ├── Footer.tsx              # Legal disclaimer & platform links
│   │   ├── Sidebar.tsx             # Dashboard & workflow sidebar
│   │   ├── RiskScoreDial.tsx       # Animated circular SVG risk dial
│   │   ├── RiskScoreBadge.tsx      # Severity pills (Critical/High/Med/Low)
│   │   ├── DocumentViewer.tsx      # Contract text viewer with clause marks
│   │   └── ClauseCard.tsx          # Card with questions & counter-proposals
│   ├── context/
│   │   ├── AuthContext.tsx         # JWT state management
│   │   └── ThemeContext.tsx        # Light/Dark mode state
│   ├── pages/
│   │   ├── LandingPage.tsx         # Hero, interactive preview, features, FAQs
│   │   ├── LoginPage.tsx           # Sign in with demo credentials shortcut
│   │   ├── RegisterPage.tsx        # User registration
│   │   ├── ForgotPasswordPage.tsx  # Password reset flow
│   │   ├── DashboardPage.tsx       # Recharts pie & activity bar charts
│   │   ├── AnalyzePage.tsx         # PDF drag-and-drop & paste text input
│   │   ├── ReportPage.tsx          # Interactive split viewer & risk cards
│   │   ├── ComparePage.tsx         # Multi-contract comparison matrix
│   │   ├── HistoryPage.tsx         # Searchable, filterable audit log
│   │   └── ProfilePage.tsx         # Profile settings & password update
│   ├── services/
│   │   └── api.ts                  # Typed client API wrapper
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # React Router configuration
│   ├── index.css                   # Tailwind CSS v4 & print styles
│   └── main.tsx                    # React DOM entry point
├── server.ts                       # Express server + Vite middlewares (Port 3000)
├── .env.example                    # Environment variables template
├── package.json                    # Dependencies & scripts
└── README.md                       # Documentation
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Optional Gemini API key for plain-English AI explanations
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# JWT_SECRET: Secret for signing session tokens
JWT_SECRET="clauseradar-jwt-super-secret-key-2025"

# MONGODB_URI: Optional MongoDB Atlas connection string
# (If omitted, ClauseRadar automatically uses persistent file-backed JSON storage)
MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/clauseradar?retryWrites=true&w=majority"
```

---

## 🚀 Installation & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development Mode**:
   ```bash
   npm run dev
   ```
   Opens the unified Express + Vite development server at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 🧪 Testing Scenarios

- **Sample Demo Testing**: Go to `/analyze` and click **"Load Demo Internship Sample"**, then click **"Analyze Contract"** to see all 5 critical flags (2-year bond, 90-day notice, $3,500 exit penalty, salary deduction, non-compete) identified and highlighted.
- **PDF Upload**: Drag and drop any `.pdf` contract to verify page parsing and text extraction.
- **Contract Comparison**: Visit `/compare` and select 2 contracts to generate a side-by-side risk score matrix.
- **PDF Export**: In `/report/:id`, click **"Print / Save PDF"** to preview the print-optimized export.
- **User Authentication**: Register a new user at `/register`, log in at `/login`, and change password in `/profile`.

---

## ⚖️ Legal Disclaimer

ClauseRadar is an automated educational tool designed to screen contracts for common restrictive patterns. It does not provide legal advice, legal representation, or establish an attorney-client relationship. Always consult a qualified attorney for formal legal advice before signing binding legal agreements.
