// Example usage of all API services
// This file demonstrates how to use all the mocked APIs

import { 
  authService, 
  ticketService, 
  metadataService, 
  getSignalRService,
  type TicketStatus,
  type TicketSeverity,
  type ApprovalStatus 
} from './index';

// ===== AUTH SERVICE EXAMPLES =====

export const authExamples = {
  async loginExample() {
    try {
      const accessToken = await authService.login({
        email: 'user@example.com',
        password: 'password123'
      });
      console.log('Login successful, token:', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async registerExample() {
    try {
      await authService.register({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'password123'
      });
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async getCurrentUserExample() {
    try {
      const user = await authService.getCurrentUser();
      console.log('Current user:', user);
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }
};

// ===== TICKET SERVICE EXAMPLES =====

export const ticketExamples = {
  async getTicketsExample() {
    try {
      const tickets = await ticketService.getTickets({
        status: 'Reported' as TicketStatus,
        pageNumber: 1,
        pageSize: 10
      });
      console.log('Tickets:', tickets);
      return tickets;
    } catch (error) {
      console.error('Get tickets failed:', error);
      throw error;
    }
  },

  async createTicketExample() {
    try {
      await ticketService.createTicket({
        title: 'Broken projector in room 101',
        description: 'The projector in room 101 is not working properly',
        severity: 'A' as TicketSeverity,
        roomId: 'room-id-123',
        facilityTypeId: 'facility-type-id-456',
        issueTypeIds: ['issue-type-id-789']
      });
      console.log('Ticket created successfully');
    } catch (error) {
      console.error('Create ticket failed:', error);
      throw error;
    }
  },

  async getStaffTicketsExample() {
    try {
      const assignedTickets = await ticketService.getStaffAssignedTickets({
        pageNumber: 1,
        pageSize: 5
      });
      console.log('Staff assigned tickets:', assignedTickets);
      return assignedTickets;
    } catch (error) {
      console.error('Get staff tickets failed:', error);
      throw error;
    }
  },

  async getReporterTicketsExample() {
    try {
      const reportedTickets = await ticketService.getReporterReportedTickets({
        status: 'InProgress' as TicketStatus,
        pageNumber: 1,
        pageSize: 10
      });
      console.log('Reporter tickets:', reportedTickets);
      return reportedTickets;
    } catch (error) {
      console.error('Get reporter tickets failed:', error);
      throw error;
    }
  }
};

// ===== APPROVAL WORKFLOW EXAMPLES =====

export const approvalExamples = {
  async requestOrderPartExample() {
    try {
      await ticketService.requestOrderPartApproval(
        {
          ticketId: 'ticket-id-123',
          requestedAmount: 250.00,
          reason: 'Need replacement LCD screen for projector'
        },
        'staff-id-456'
      );
      console.log('Order part approval requested');
    } catch (error) {
      console.error('Order part approval failed:', error);
      throw error;
    }
  },

  async reviewApprovalExample() {
    try {
      await ticketService.reviewTicketApproval({
        approvalId: 'approval-id-789',
        approvalStatus: 'Approved' as ApprovalStatus,
        reason: 'Budget approved for necessary repairs',
        userId: 'manager-id-123'
      });
      console.log('Approval reviewed successfully');
    } catch (error) {
      console.error('Review approval failed:', error);
      throw error;
    }
  },

  async requestCloseApprovalExample() {
    try {
      await ticketService.requestCloseApproval(
        {
          ticketId: 'ticket-id-123',
          reason: 'Resolved'
        },
        'staff-id-456'
      );
      console.log('Close approval requested');
    } catch (error) {
      console.error('Close approval failed:', error);
      throw error;
    }
  }
};

// ===== ODATA EXAMPLES =====

export const odataExamples = {
  async getODataMetadataExample() {
    try {
      const metadata = await ticketService.getODataMetadata();
      console.log('OData metadata:', metadata);
      return metadata;
    } catch (error) {
      console.error('Get OData metadata failed:', error);
      throw error;
    }
  },

  async getODataTicketsExample() {
    try {
      const tickets = await ticketService.getODataTickets(
        '$filter=status eq \'InProgress\'&$top=10&$skip=0'
      );
      console.log('OData tickets:', tickets);
      return tickets;
    } catch (error) {
      console.error('Get OData tickets failed:', error);
      throw error;
    }
  },

  async getODataTicketsCountExample() {
    try {
      const count = await ticketService.getODataTicketsCount(
        'status eq \'Reported\''
      );
      console.log('OData tickets count:', count);
      return count;
    } catch (error) {
      console.error('Get OData tickets count failed:', error);
      throw error;
    }
  }
};

// ===== METADATA SERVICE EXAMPLES =====

export const metadataExamples = {
  async getMetadataExample() {
    try {
      const metadata = await metadataService.getMetadata();
      console.log('Metadata:', metadata);
      return metadata;
    } catch (error) {
      console.error('Get metadata failed:', error);
      throw error;
    }
  },

  async getCampusesExample() {
    try {
      const campuses = await metadataService.getCampuses();
      console.log('Campuses:', campuses);
      return campuses;
    } catch (error) {
      console.error('Get campuses failed:', error);
      throw error;
    }
  },

  async getRoomsExample() {
    try {
      const rooms = await metadataService.getRooms('campus-id-123');
      console.log('Rooms:', rooms);
      return rooms;
    } catch (error) {
      console.error('Get rooms failed:', error);
      throw error;
    }
  }
};

// ===== SIGNALR EXAMPLES =====

export const signalRExamples = {
  async connectSignalRExample() {
    try {
      const signalRService = getSignalRService();
      
      // Setup event listeners
      signalRService.onTicketNotification((message) => {
        console.log('Ticket notification received:', message);
      });
      
      signalRService.onApprovalNotification((message) => {
        console.log('Approval notification received:', message);
      });
      
      // Connect to SignalR
      await signalRService.start();
      console.log('SignalR connected successfully');
      
      // Join user group
      await signalRService.joinUserGroup('user-id-123');
      console.log('Joined user group');
      
      // Join role group
      await signalRService.joinRoleGroup('Staff');
      console.log('Joined role group');
      
    } catch (error) {
      console.error('SignalR connection failed:', error);
      throw error;
    }
  }
};

// ===== COMPLETE WORKFLOW EXAMPLE =====

export const completeWorkflowExample = async () => {
  try {
    console.log('=== Starting complete workflow example ===');
    
    // 1. Login
    console.log('1. Logging in...');
    await authExamples.loginExample();
    
    // 2. Get current user
    console.log('2. Getting current user...');
    const user = await authExamples.getCurrentUserExample();
    
    // 3. Get metadata for dropdowns
    console.log('3. Getting metadata...');
    const metadata = await metadataExamples.getMetadataExample();
    
    // 4. Connect to SignalR
    console.log('4. Connecting to SignalR...');
    await signalRExamples.connectSignalRExample();
    
    // 5. Create a ticket (if user is Reporter)
    if (user.roles.includes('Reporter')) {
      console.log('5. Creating ticket...');
      await ticketExamples.createTicketExample();
    }
    
    // 6. Get tickets based on role
    if (user.roles.includes('Staff')) {
      console.log('6. Getting staff assigned tickets...');
      await ticketExamples.getStaffTicketsExample();
      
      // 7. Request order part approval
      console.log('7. Requesting order part approval...');
      await approvalExamples.requestOrderPartExample();
    } else if (user.roles.includes('Manager') || user.roles.includes('Administrator')) {
      console.log('6. Getting all tickets...');
      await ticketExamples.getTicketsExample();
      
      // 7. Review approval
      console.log('7. Reviewing approval...');
      await approvalExamples.reviewApprovalExample();
    } else if (user.roles.includes('Reporter')) {
      console.log('6. Getting reporter tickets...');
      await ticketExamples.getReporterTicketsExample();
    }
    
    // 8. Get OData information
    console.log('8. Getting OData tickets...');
    await odataExamples.getODataTicketsExample();
    
    console.log('=== Workflow completed successfully ===');
    
  } catch (error) {
    console.error('Workflow failed:', error);
    throw error;
  }
};