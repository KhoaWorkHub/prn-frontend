# Campus Helpdesk Frontend API Implementation

This document describes all the API services implemented in the frontend, aligned with the backend API structure.

## 📁 File Structure

```
lib/api/
├── index.ts              # Main exports and API bundle
├── config.ts             # API configuration and endpoints
├── client.ts             # Axios client with interceptors
├── auth.service.ts       # Authentication API calls
├── ticket.service.ts     # Ticket management API calls
├── metadata.service.ts   # Metadata/reference data API calls
├── signalr.service.ts    # SignalR real-time notifications
└── example-usage.ts      # Usage examples for all APIs

lib/hooks/
└── useSignalR.ts         # React hook for SignalR

types/
├── auth.ts               # Authentication types
└── ticket.ts             # Ticket and related types
```

## 🔐 Authentication APIs

### Auth Service (`authService`)

- **`login(credentials)`** - Login with email/password
- **`register(data)`** - Register new user account
- **`getCurrentUser()`** - Get current authenticated user
- **`refreshToken()`** - Refresh access token (uses httpOnly cookies)
- **`logout()`** - Logout and clear tokens

**Backend Alignment:**
- ✅ POST `/api/auth/login` - Returns access token as string
- ✅ POST `/api/auth/register` - Returns 201 on success
- ✅ GET `/api/auth/current-user` - Returns user object
- ✅ POST `/api/auth/refresh-token` - Reads refresh token from cookie
- ✅ POST `/api/auth/logout` - Clears refresh token cookie

## 🎫 Ticket APIs

### Ticket Service (`ticketService`)

#### Main CRUD Operations
- **`getTickets(params?)`** - Get tickets with filtering/pagination
- **`getTicketById(id)`** - Get single ticket details
- **`createTicket(data)`** - Create new ticket (Reporter only)

#### Role-Specific Endpoints
- **`getStaffAssignedTickets(params?)`** - Get staff's assigned tickets
- **`getStaffAssignedTicketById(ticketId)`** - Get specific assigned ticket
- **`getReporterReportedTickets(params?)`** - Get reporter's tickets
- **`getReporterReportedTicketById(ticketId)`** - Get specific reported ticket

#### Approval Workflow
- **`requestOrderPartApproval(request, staffId)`** - Request part approval
- **`reviewTicketApproval(request)`** - Review/approve requests (Manager)
- **`requestCloseApproval(request, userId)`** - Request close approval

#### OData Endpoints
- **`getODataMetadata()`** - Get OData service metadata (XML)
- **`getODataTickets(query?)`** - Query tickets via OData
- **`getODataTicketsCount(filter?)`** - Get ticket count via OData

**Backend Alignment:**
- ✅ GET `/api/tickets` - With X-Pagination header
- ✅ GET `/api/tickets/{id}` - Single ticket
- ✅ POST `/api/tickets` - Create ticket
- ✅ GET `/api/staff-assigned-tickets` - Staff tickets
- ✅ GET `/api/staff-assigned-tickets/{id}` - Staff ticket detail
- ✅ GET `/api/reporter-reported-tickets` - Reporter tickets
- ✅ GET `/api/reporter-reported-tickets/{id}` - Reporter ticket detail
- ✅ POST `/api/order-part-approval` - Order part workflow
- ✅ POST `/api/review` - Review approval (form-data)
- ✅ POST `/api/close-approval` - Close approval (form-data)
- ✅ GET `/odata/$metadata` - OData metadata
- ✅ GET `/odata/Tickets` - OData tickets
- ✅ GET `/odata/Tickets/$count` - OData count

## 📊 Metadata APIs

### Metadata Service (`metadataService`)

- **`getMetadata()`** - Get all metadata (campuses, rooms, facilities, issues)
- **`getDataRoot()`** - Get data service root
- **`getCampuses()`** - Get all campuses
- **`getRooms(campusId?)`** - Get rooms (optionally filtered by campus)
- **`getFacilityTypes()`** - Get all facility types
- **`getIssueTypes()`** - Get all issue types

**Backend Alignment:**
- ✅ GET `/data/$metadata` - Combined metadata response
- ✅ GET `/data` - Data service root
- ✅ Individual endpoints for each metadata type

## 🔄 SignalR Real-time Notifications

### SignalR Service (`SignalRService`)

#### Connection Management
- **`start()`** - Connect to SignalR hub
- **`stop()`** - Disconnect from hub
- **`connectionState`** - Get current connection state

#### Event Subscription
- **`onTicketNotification(callback)`** - Subscribe to ticket events
- **`onApprovalNotification(callback)`** - Subscribe to approval events
- **`onNotification(callback)`** - Subscribe to general notifications

#### Group Management
- **`joinUserGroup(userId)`** - Join user-specific group
- **`leaveUserGroup(userId)`** - Leave user-specific group
- **`joinRoleGroup(role)`** - Join role-based group

**Backend Alignment:**
- ✅ Hub URL: `/notificationHub`
- ✅ Role-based groups: `TICKET_OPERATORS`, `REPORTERS`, `STAFFS`
- ✅ User-specific groups: `USER_{userId}`
- ✅ JWT token authentication

### React Hook (`useSignalR`)

```typescript
const { connect, disconnect, isConnected } = useSignalR({
  user,
  autoConnect: true,
  onTicketNotification: (message) => { /* handle */ },
  onApprovalNotification: (message) => { /* handle */ },
});
```

## 📝 Type Definitions

### Core Types
- **`TicketResponse`** - Complete ticket object with nested relations
- **`CreateTicketRequest`** - Ticket creation payload
- **`TicketParameters`** - Query parameters for filtering
- **`ApprovalStatus`** - Pending, Approved, Rejected
- **`TicketStatus`** - All ticket states from backend enum

### Nested Types
- **`RoomResponse`**, **`CampusResponse`**, **`FacilityTypeResponse`**
- **`IssueTypeResponse`**, **`UserResponse`**
- **`TicketIssueResponse`**, **`TicketHistoryResponse`**

### OData Types
- **`ODataResponse<T>`** - Standard OData response format
- **`ODataCountResponse`** - OData count response

## 🚀 Usage Examples

### Basic Usage
```typescript
import { authService, ticketService, metadataService } from '@/lib/api';

// Login
const token = await authService.login({ email: 'user@example.com', password: 'password' });

// Get tickets
const tickets = await ticketService.getTickets({ status: 'Reported', pageNumber: 1 });

// Get metadata
const metadata = await metadataService.getMetadata();
```

### SignalR Usage
```typescript
import { useSignalR } from '@/lib/hooks/useSignalR';

const MyComponent = () => {
  const { connect, isConnected } = useSignalR({
    user,
    onTicketNotification: (message) => {
      console.log('New ticket event:', message);
    }
  });

  useEffect(() => {
    if (user) connect();
  }, [user, connect]);

  return <div>Connected: {isConnected}</div>;
};
```

### Complete Workflow
```typescript
import { completeWorkflowExample } from '@/lib/api/example-usage';

// Run complete workflow demo
await completeWorkflowExample();
```

## 🔧 Configuration

### Environment Variables
```typescript
// API_CONFIG in config.ts
const API_CONFIG = {
  BASE_URL: typeof window === 'undefined' ? 'http://34.169.143.69:8080' : '',
  TIMEOUT: 30000,
};
```

### Token Management
- **Access tokens** stored in localStorage
- **Refresh tokens** handled via httpOnly cookies
- **Automatic token refresh** via Axios interceptors
- **Automatic logout** on refresh failure

## ✅ Backend Compatibility

This implementation is fully compatible with your backend API structure:

1. **Endpoint URLs** match exactly (`/api/tickets`, `/api/auth/login`, etc.)
2. **Request/Response formats** align with C# models
3. **Enum values** match backend enums exactly
4. **Authentication flow** uses JWT + refresh token cookies
5. **SignalR groups** follow backend Hub logic
6. **OData endpoints** support standard OData queries
7. **Form data handling** for file uploads in approvals

## 📋 Next Steps

1. **Install SignalR package**: `npm install @microsoft/signalr`
2. **Import services** in your components
3. **Setup authentication** context with `authService`
4. **Use ticket services** in your ticket management pages
5. **Implement SignalR** for real-time updates
6. **Test with backend** by changing BASE_URL to your deployed API

All APIs are ready to work with your live backend at `http://34.169.143.69:8080`!