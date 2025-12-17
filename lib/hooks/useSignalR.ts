'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getSignalRService, cleanupSignalR, type NotificationMessage } from '../api/signalr.service';
import type { User } from '@/types/auth';

export interface UseSignalROptions {
  user?: User | null;
  autoConnect?: boolean;
  onTicketNotification?: (message: NotificationMessage) => void;
  onApprovalNotification?: (message: NotificationMessage) => void;
  onGeneralNotification?: (message: NotificationMessage) => void;
}

export const useSignalR = (options: UseSignalROptions = {}) => {
  const {
    user,
    autoConnect = true,
    onTicketNotification,
    onApprovalNotification,
    onGeneralNotification,
  } = options;

  const signalRServiceRef = useRef(getSignalRService());
  const isConnectedRef = useRef(false);

  const connect = useCallback(async () => {
    const service = signalRServiceRef.current;
    
    try {
      if (!service.connected) {
        await service.start();
        
        // Join user-specific group if user is available
        if (user?.id) {
          await service.joinUserGroup(user.id);
        }
        
        // Join role-based groups
        if (user?.roles && user.roles.length > 0) {
          const primaryRole = user.roles[0]; // Use first role as primary
          await service.joinRoleGroup(primaryRole);
        }
        
        isConnectedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      isConnectedRef.current = false;
    }
  }, [user]);

  const disconnect = useCallback(async () => {
    const service = signalRServiceRef.current;
    
    try {
      if (service.connected) {
        // Leave user-specific group
        if (user?.id) {
          await service.leaveUserGroup(user.id);
        }
        
        await service.stop();
        isConnectedRef.current = false;
      }
    } catch (error) {
      console.error('Failed to disconnect from SignalR:', error);
    }
  }, [user]);

  // Setup event listeners
  useEffect(() => {
    const service = signalRServiceRef.current;

    if (onTicketNotification) {
      service.onTicketNotification(onTicketNotification);
    }

    if (onApprovalNotification) {
      service.onApprovalNotification(onApprovalNotification);
    }

    if (onGeneralNotification) {
      service.onNotification(onGeneralNotification);
    }

    // Cleanup function
    return () => {
      service.removeAllListeners();
    };
  }, [onTicketNotification, onApprovalNotification, onGeneralNotification]);

  // Auto-connect when user is available and autoConnect is true
  useEffect(() => {
    if (autoConnect && user && !isConnectedRef.current) {
      connect();
    }
  }, [autoConnect, user, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnectedRef.current) {
        disconnect();
      }
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected: isConnectedRef.current,
    connectionState: signalRServiceRef.current.connectionState,
  };
};

// Hook for simpler notification handling
export const useNotifications = (user?: User | null) => {
  const notifications = useRef<NotificationMessage[]>([]);

  const addNotification = useCallback((message: NotificationMessage) => {
    notifications.current = [message, ...notifications.current].slice(0, 50); // Keep last 50
  }, []);

  const clearNotifications = useCallback(() => {
    notifications.current = [];
  }, []);

  const { connect, disconnect, isConnected, connectionState } = useSignalR({
    user,
    onTicketNotification: addNotification,
    onApprovalNotification: addNotification,
    onGeneralNotification: addNotification,
  });

  return {
    notifications: notifications.current,
    addNotification,
    clearNotifications,
    connect,
    disconnect,
    isConnected,
    connectionState,
  };
};