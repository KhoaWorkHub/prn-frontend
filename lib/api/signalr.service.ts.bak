import * as signalR from '@microsoft/signalr';
import { API_CONFIG } from './config';
import { getToken } from './client';

export interface NotificationMessage {
  type: 'ticket_created' | 'ticket_updated' | 'ticket_assigned' | 'approval_request' | 'approval_response';
  ticketId?: string;
  message: string;
  timestamp: string;
  userId?: string;
  data?: any;
}

export class SignalRService {
  private connection: signalR.HubConnection;
  private isConnected = false;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_CONFIG.BASE_URL}/notificationHub`, {
        accessTokenFactory: () => {
          const token = getToken();
          return token || '';
        },
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.connection.onreconnecting(() => {
      console.log('SignalR: Attempting to reconnect...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR: Reconnected successfully');
      this.isConnected = true;
    });

    this.connection.onclose(() => {
      console.log('SignalR: Connection closed');
      this.isConnected = false;
    });
  }

  async start(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR: Connected successfully');
    } catch (error) {
      console.error('SignalR: Failed to connect', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.connection.stop();
      this.isConnected = false;
      console.log('SignalR: Disconnected successfully');
    } catch (error) {
      console.error('SignalR: Failed to disconnect', error);
    }
  }

  // Subscribe to ticket notifications
  onTicketNotification(callback: (message: NotificationMessage) => void): void {
    this.connection.on('TicketNotification', callback);
  }

  // Subscribe to approval notifications  
  onApprovalNotification(callback: (message: NotificationMessage) => void): void {
    this.connection.on('ApprovalNotification', callback);
  }

  // Subscribe to general notifications
  onNotification(callback: (message: NotificationMessage) => void): void {
    this.connection.on('Notification', callback);
  }

  // Join user-specific group
  async joinUserGroup(userId: string): Promise<void> {
    if (this.isConnected) {
      await this.connection.invoke('JoinUserGroup', userId);
    }
  }

  // Leave user-specific group
  async leaveUserGroup(userId: string): Promise<void> {
    if (this.isConnected) {
      await this.connection.invoke('LeaveUserGroup', userId);
    }
  }

  // Join role-based groups (based on backend logic)
  async joinRoleGroup(role: 'Reporter' | 'Staff' | 'Manager' | 'Administrator'): Promise<void> {
    if (this.isConnected) {
      const groupName = this.getRoleGroupName(role);
      await this.connection.invoke('JoinGroup', groupName);
    }
  }

  private getRoleGroupName(role: string): string {
    switch (role) {
      case 'Manager':
      case 'Administrator':
        return 'TICKET_OPERATORS';
      case 'Reporter':
        return 'REPORTERS';
      case 'Staff':
        return 'STAFFS';
      default:
        return 'GENERAL';
    }
  }

  // Remove all event listeners
  removeAllListeners(): void {
    this.connection.off('TicketNotification');
    this.connection.off('ApprovalNotification');
    this.connection.off('Notification');
  }

  get connectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let signalRService: SignalRService | null = null;

export const getSignalRService = (): SignalRService => {
  if (!signalRService) {
    signalRService = new SignalRService();
  }
  return signalRService;
};

// Cleanup function
export const cleanupSignalR = async (): Promise<void> => {
  if (signalRService) {
    await signalRService.stop();
    signalRService.removeAllListeners();
    signalRService = null;
  }
};