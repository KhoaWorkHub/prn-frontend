# Campus Facility Helpdesk - Frontend

## 🎨 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Form Validation**: React Hook Form + Zod (ready to integrate)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/khoa123/Desktop/PRN232_ASSIGNMENT/prn-frontend
pnpm install
# or
npm install
```

### 2. Configure Environment
File `.env.local` đã được tạo với:
```
NEXT_PUBLIC_API_URL=http://34.169.143.69:8080
```

### 3. Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
prn-frontend/
├── app/                          # Next.js App Router
│   ├── auth/
│   │   └── login/               # Login page
│   ├── admin/                   # Manager dashboard
│   ├── staff/                   # Staff dashboard
│   ├── user/                    # Reporter dashboard
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Landing page
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── tickets/                 # Ticket-related components
│   ├── dashboard/               # Dashboard components
│   └── layout/                  # Layout components
│
├── lib/
│   ├── api/
│   │   ├── config.ts           # API endpoints configuration
│   │   ├── client.ts           # Axios instance với JWT interceptor
│   │   ├── auth.service.ts     # Authentication services
│   │   └── ticket.service.ts   # Ticket CRUD services
│   ├── auth-context.tsx        # Authentication context provider
│   └── utils.ts                # Utility functions
│
└── types/
    ├── auth.ts                  # Auth-related TypeScript types
    └── ticket.ts                # Ticket-related TypeScript types
```

---

## 🔐 Authentication Flow

### Setup Completed:
✅ **API Client** (`lib/api/client.ts`)
- Axios instance với base URL từ GCP
- Automatic JWT token injection vào headers
- Token refresh logic khi 401 Unauthorized
- Auto redirect to login khi token expired

✅ **Auth Context** (`lib/auth-context.tsx`)
- `login(credentials)` - Call API `/api/auth/login`
- `register(data)` - Call API `/api/auth/register`
- `logout()` - Clear tokens và redirect
- `user` state - Current logged-in user
- `isAuthenticated` - Boolean check

✅ **Auth Service** (`lib/api/auth.service.ts`)
- `authService.login()` - Returns JWT tokens
- `authService.register()` - Create new account
- `authService.getCurrentUser()` - Get user info
- `authService.logout()` - Logout

### Usage Example:
```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ username: 'admin', password: '123456' });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user?.username}</div>;
}
```

---

## 🎫 Ticket Management

### API Services

#### Ticket Service (`lib/api/ticket.service.ts`)

**Get Tickets với Filters & Pagination:**
```tsx
import { ticketService } from '@/lib/api/ticket.service';

const tickets = await ticketService.getTickets(
  {
    status: [TicketStatus.REPORTED, TicketStatus.ASSIGNED],
    severity: [TicketSeverity.HIGH],
    campusId: 'campus-id',
    search: 'broken chair',
  },
  {
    page: 1,
    size: 10,
    sort: 'createdAt:desc',
  }
);
```

**Create Ticket:**
```tsx
const newTicket = await ticketService.createTicket({
  title: 'Broken projector in Room 301',
  description: 'Projector not turning on',
  severity: TicketSeverity.HIGH,
  categoryId: 'cat-id',
  campusId: 'campus-id',
  roomId: 'room-id',
  location: 'Building A, Floor 3',
  attachments: [file1, file2], // File[]
});
```

**Assign Ticket (Manager):**
```tsx
await ticketService.assignTicket(ticketId, {
  assignedToId: 'staff-user-id',
});
```

**Update Progress (Staff):**
```tsx
await ticketService.updateProgress(ticketId, {
  status: TicketStatus.IN_PROGRESS,
  note: 'Started repairing the projector',
  attachments: [photo1, photo2],
});
```

**Approve Waiting For Parts (Manager):**
```tsx
await ticketService.approveWaitingForParts(ticketId);
```

**Approve Close Request (Manager):**
```tsx
await ticketService.approveClose(ticketId);
```

#### Manager Service
```tsx
import { managerService } from '@/lib/api/ticket.service';

// Get reported tickets
const reportedTickets = await managerService.getReportedTickets(filters, pagination);

// Get closed tickets
const closedTickets = await managerService.getClosedTickets(filters, pagination);
```

#### Staff Service
```tsx
import { staffService } from '@/lib/api/ticket.service';

// Get assigned tickets
const myTickets = await staffService.getAssignedTickets(filters, pagination);
```

---

## 🎨 TypeScript Types

### Ticket Types (`types/ticket.ts`)

```typescript
enum TicketStatus {
  REPORTED = 'Reported',
  ASSIGNED = 'Assigned',
  REVIEWING = 'Reviewing',
  IN_PROGRESS = 'InProgress',
  WAITING_FOR_PART_APPROVAL = 'WaitingForPartApproval',
  WAITING_FOR_PARTS = 'WaitingForParts',
  WAITING_FOR_CLOSE_APPROVAL = 'WaitingForCloseApproval',
  CLOSED = 'Closed',
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  severity: TicketSeverity;
  reporterId: string;
  assignedToId?: string;
  categoryId: string;
  campusId: string;
  createdAt: string;
  // ... more fields
}
```

### Auth Types (`types/auth.ts`)

```typescript
enum UserRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  STAFF = 'Staff',
  REPORTER = 'Reporter',
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  // ...
}
```

---

## 🎯 Next Steps - TODO

### 1. Update Login Page
Modify `app/auth/login/page.tsx` to use real API:
```tsx
import { useAuth } from '@/lib/auth-context';

const { login } = useAuth();

const handleLogin = async () => {
  await login({ username, password });
  // Auto redirect based on role in auth-context.tsx
};
```

### 2. Create Register Page
Create `app/auth/register/page.tsx` similar to login page.

### 3. Protected Routes
Create middleware or wrapper component:
```tsx
// components/protected-route.tsx
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) redirect('/auth/login');
  if (!allowedRoles.includes(user.roles[0])) return <Forbidden />;
  
  return children;
}
```

### 4. Reporter Dashboard
- **Create Ticket Form** with file upload
- **My Tickets List** với filters (status, date range)
- **Ticket Detail View** với history timeline

### 5. Manager Dashboard
- **Reported Tickets Queue** - View all status=Reported
- **Assign Modal** - Select staff from dropdown
- **Approval Actions** - Approve WaitingForParts, Approve Close
- **Closed Tickets History** - View all resolved tickets

### 6. Staff Dashboard
- **Assigned Tickets** - My assigned tickets
- **Acknowledge Button** - Change Assigned → Reviewing
- **Progress Updates** - Add notes, upload photos
- **Request Parts** - Request approval for parts
- **Request Close** - Submit close request với reason

### 7. Shared Components to Build

**Status Badge:**
```tsx
<TicketStatusBadge status={ticket.status} />
```

**Ticket Card:**
```tsx
<TicketCard
  ticket={ticket}
  onView={() => router.push(`/tickets/${ticket.id}`)}
/>
```

**Filter Panel:**
```tsx
<TicketFilters
  onFilterChange={(filters) => setFilters(filters)}
/>
```

**File Upload:**
```tsx
<FileUpload
  maxFiles={5}
  onFilesSelected={(files) => setAttachments(files)}
/>
```

---

## 🎨 UI/UX Guidelines

### Design System
- **Primary Color**: Blue gradient (from-blue-600 to-purple-600)
- **Success**: Green-600
- **Warning**: Yellow-600
- **Danger**: Red-600
- **Font**: Geist Sans (already configured)

### Status Colors
```tsx
const statusColors = {
  Reported: 'bg-blue-100 text-blue-700',
  Assigned: 'bg-purple-100 text-purple-700',
  Reviewing: 'bg-yellow-100 text-yellow-700',
  InProgress: 'bg-orange-100 text-orange-700',
  WaitingForParts: 'bg-gray-100 text-gray-700',
  Closed: 'bg-green-100 text-green-700',
};
```

### Responsive Breakpoints
- Mobile: `< 640px`
- Tablet: `640px - 1024px`
- Desktop: `> 1024px`

---

## 📝 Development Tips

### 1. API Error Handling
```tsx
try {
  await ticketService.createTicket(data);
  toast.success('Ticket created successfully');
} catch (error) {
  if (error.response?.status === 400) {
    toast.error(error.response.data.message);
  } else {
    toast.error('Something went wrong');
  }
}
```

### 2. Loading States
```tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await ticketService.createTicket(data);
  } finally {
    setLoading(false);
  }
};
```

### 3. Pagination Hook
```tsx
const [page, setPage] = useState(1);
const [tickets, setTickets] = useState<Ticket[]>([]);

useEffect(() => {
  const fetchTickets = async () => {
    const response = await ticketService.getTickets(filters, { page, size: 10 });
    setTickets(response.items);
  };
  fetchTickets();
}, [page, filters]);
```

---

## 🔧 Available Scripts

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

---

## 📚 Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)

---

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, backend đã enable `AllowAnyOrigin` rồi. Nhưng nếu vẫn lỗi, check:
1. API_URL trong `.env.local` đúng chưa
2. Backend container có chạy không: `docker ps`

### 401 Unauthorized
- Check token có được lưu trong localStorage không
- Check token expiry time
- Verify API endpoint `/api/auth/current-user` works

### Network Errors
```bash
# Test API connection
curl http://34.169.143.69:8080/swagger/index.html
```

---

## ✅ What's Already Done

✅ API client với JWT authentication
✅ Auth context provider
✅ Auth service (login, register, logout)
✅ Ticket service (CRUD, filters, pagination)
✅ Manager service (reported, closed tickets)
✅ Staff service (assigned tickets)
✅ TypeScript types for all models
✅ Environment configuration
✅ Root layout với AuthProvider
✅ UI components (shadcn/ui)

---

## 🎯 Your Mission

Bây giờ bạn cần:

1. **Integrate API vào existing pages** - Update login/register pages để call real API
2. **Build ticket creation form** - Form đẹp với validation và file upload
3. **Create dashboard layouts** - Reporter, Manager, Staff dashboards
4. **Implement ticket list** - với filters, sorting, pagination
5. **Build ticket detail page** - Show history timeline, actions
6. **Add shared components** - Status badge, ticket card, filter panel

---

## 💡 Code Examples Ready to Use

All service methods đã sẵn sàng, bạn chỉ cần import và dùng:

```tsx
import { useAuth } from '@/lib/auth-context';
import { ticketService, managerService, staffService } from '@/lib/api/ticket.service';
import { TicketStatus, TicketSeverity } from '@/types/ticket';
```

Happy coding! 🚀
