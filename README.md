# VentureLens — Startup Due Diligence & Investment Intelligence Platform

VentureLens is a modern, responsive, full-stack investment intelligence and due diligence SaaS platform connecting startup founders with venture capital investors.

---

## 🚀 Live Services

- **Frontend URL**: [http://localhost:5173](http://localhost:5173) (Vite Dev Server)
- **Backend REST API**: [http://localhost:8080](http://localhost:8080) (Spring Boot 3.4.1 / Java 21)
- **Database**: MySQL 8.0 (`venturelens_db` on `localhost:3306`)

---

## 🔑 Default Credentials

For quick local testing and evaluation, the platform includes pre-seeded accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **Platform Administrator** | `admin@venturelens.com` | `Admin@12345` | Global oversight, analytics, account activation/deactivation |
| **Startup Founder** | `aman@startup.com` | `123456` | TechNova (FinTech, Seed, \$5M Target) |
| **Startup Founder (New)** | `elena.test@nexuspay.com` | `Password@123` | NexusPay Global (FinTech, Series A, \$3.5M Target) |
| **Venture Investor** | `rahul@gmail.com` | `123456` | Sharma Ventures (FinTech focus) |
| **Venture Investor (New)** | `victoria.thorne@apexcap.com` | `Password@123` | Apex Horizon Capital (FinTech focus) |

*(You can also use the 1-click **"Demo 1-Click Credentials"** buttons directly on the `/login` page).*

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS 3 (custom dark-purple fintech SaaS theme)
- **Icons**: Lucide React
- **Analytics Visualizations**: Recharts (Pie/Donut charts, Area charts, Bar charts)
- **HTTP Client**: Axios with automatic JWT Bearer interceptor

### Backend
- **Language**: Java 21 LTS
- **Framework**: Spring Boot 3.4.1
- **Persistence**: Spring Data JPA & Hibernate
- **Security**: Spring Security with BCrypt password hashing & HMAC-SHA256 Token authentication
- **Validation**: Jakarta Validation API (`@Valid`, `@NotBlank`, `@Size`, etc.)
- **Build Tool**: Apache Maven 3.9

### Database & Storage
- **Database**: MySQL 8.0 (`venturelens_db`)
- **Pitch Deck Storage**: Local secure filesystem storage under `backend/uploads/pitch_decks/` with mime-type validation (PDF, PPT, PPTX up to 50 MB) and authenticated streaming.

---

## 📂 Project Architecture

```
venturelens/
├── backend/
│   ├── pom.xml
│   ├── uploads/pitch_decks/           # Secure pitch deck storage directory
│   └── src/main/
│       ├── java/com/venturelens/
│       │   ├── VentureLensApplication.java
│       │   ├── config/                # SecurityConfig, GlobalExceptionHandler
│       │   ├── controller/            # Startup, Investor, Saved, Meeting, PitchDeck, Admin, Auth
│       │   ├── dto/                   # Requests, Responses, Dashboard DTOs, Analytics DTOs
│       │   ├── entity/                # Startup, Investor, SavedStartup, MeetingRequest, PitchDeck, Admin
│       │   ├── repository/            # Spring Data JPA Repositories
│       │   ├── security/              # TokenService, JwtAuthFilter, UserPrincipal
│       │   └── service/               # Core business services & DataSeederService
│       └── resources/
│           └── application.properties # MySQL & multipart upload configurations
├── database/
│   └── venturelens_schema.sql         # Relational MySQL schema & constraints
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js                 # Dev server configuration with backend API proxy
│   ├── tailwind.config.js             # Dark purple & fintech theme extensions
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                    # Routing & ProtectedRoute role guards
│       ├── index.css                  # Custom scrollbars, glassmorphism, glowing accents
│       ├── api/client.js              # Axios instance & API client endpoints
│       ├── context/AuthContext.jsx    # Session management & user state
│       ├── components/                # Navbar, Sidebar, Footer, Modal, StatCard, Badge, ConfirmDialog
│       └── pages/
│           ├── LandingPage.jsx        # Public hero, workflow, features, role sections, CTA
│           ├── LoginPage.jsx          # Role selector tabs & 1-click demo logins
│           ├── SignupPage.jsx         # Founder & Investor registration
│           ├── startup/               # Dashboard, Profile, PitchDeck, MeetingRequestsModal
│           ├── investor/              # Dashboard, Discovery, SavedStartups, Meetings, Modals
│           └── admin/                 # Dashboard, Startups, Investors, Meetings, Analytics
├── test_workflow.ps1                  # 12-step end-to-end integration test suite
└── README.md
```

---

## 📊 Database Schema (`venturelens_db`)

The relational database enforces data integrity, foreign keys, and unique constraints:

1. **`startups`**: `id`, `founder_name`, `email` (UNIQUE), `password` (BCrypt), `company_name`, `category`, `funding_stage`, `target_money`, `yearly_revenue`, `monthly_expenses`, `is_active`, `created_at`.
2. **`investors`**: `id`, `investor_name`, `email` (UNIQUE), `password` (BCrypt), `firm_name`, `interested_category`, `is_active`, `created_at`.
3. **`saved_startups`**: `id`, `investor_id` (FK), `startup_id` (FK), `created_at`. Unique constraint on `(investor_id, startup_id)`.
4. **`meeting_requests`**: `id`, `investor_id` (FK), `startup_id` (FK), `message`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`), `created_at`, `updated_at`.
5. **`pitch_decks`**: `id`, `startup_id` (FK, UNIQUE), `original_file_name`, `file_type`, `file_size`, `storage_path`, `uploaded_at`.
6. **`admins`**: `id`, `name`, `email` (UNIQUE), `password` (BCrypt), `role`, `created_at`.

---

## 🌐 Application Routes

| Category | Route | Description |
|---|---|---|
| **Public** | `/` | Marketing landing page with hero, workflow, feature highlights, and footer |
| | `/login` | Unified authentication page for Founders, Investors, and Admins |
| | `/signup` | Registration with role selection (Startup Founder / Investor) |
| **Startup** | `/dashboard` | Founder overview with 7 core stats & **View Meeting Requests** modal |
| | `/dashboard/profile` | Real-time profile management (Company, Category, Stage, Financials) |
| | `/dashboard/pitch-deck` | Drag-and-drop pitch deck upload (PDF, PPT, PPTX up to 50MB) |
| **Investor** | `/investor` | Portfolio overview (Available Startups, Saved, Sent, Accepted Meetings) |
| | `/investor/startups` | Card-based Discovery with search, category & stage filters, details, and meeting requests |
| | `/investor/saved` | Private bookmarked watchlist with remove confirmation |
| | `/investor/meetings` | Outbound meeting tracker with live status updates (Pending / Accepted / Rejected) |
| **Admin** | `/admin` | Executive KPI overview cards and capital summaries |
| | `/admin/startups` | Startup accounts table with pitch deck access and active/inactive toggle |
| | `/admin/investors` | Investor firm roster with activity stats and active/inactive toggle |
| | `/admin/meetings` | Real-time meeting request monitoring across all parties |
| | `/admin/analytics` | Dynamic Recharts visualizations (Categories, Statuses, Registrations, Activity) |

---

## 🔒 Security & Authorization Highlights

- **Ownership Verification**: All protected endpoints verify that the authenticated principal either owns the requested resource (`userId` match) or possesses the `ROLE_ADMIN` authority.
- **Data Isolation**: Investors cannot alter startup details; startups cannot impersonate investors; non-admins cannot access administrator endpoints.
- **Password Protection**: Passwords are saved exclusively as salted BCrypt hashes and omitted from all JSON responses (`@JsonProperty(access = WRITE_ONLY)`).
- **Destructive Operation Confirmations**: Confirmation modals (`ConfirmDialog`) precede destructive actions such as account deactivation or bookmark removals.

---

## 🤖 Future Scope — AI Diligence Readiness

In strict compliance with Master Prompt Section 12:
- Automated machine learning scoring is withheld from generating synthetic figures.
- The platform displays:
  - **AI Score**: `Not Assessed`
  - **Risk Level**: `NOT ASSESSED`
- The architecture is modular and ready for pluggable AI pitch deck analysis and multi-factor risk assessment services.

---

## 🏃 Running the Application Locally

### 1. Database Setup
Ensure MySQL is running on port 3306 with credentials matching `backend/src/main/resources/application.properties` (default: user `root`, password `root`):
```sql
CREATE DATABASE IF NOT EXISTS venturelens_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Import schema:
```powershell
Get-Content database\venturelens_schema.sql | mysql -u root -proot
```

### 2. Backend Startup
```powershell
cd backend
mvn clean package -DskipTests
java -jar target/venturelens-backend-1.0.0.jar
```
*Tomcat will start on `http://localhost:8080`.*

### 3. Frontend Startup
```powershell
cd frontend
npm install
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your browser.*

### 4. Running the Automated Test Suite
To verify all 12 key integration workflows:
```powershell
powershell -ExecutionPolicy Bypass -File test_workflow.ps1
```
