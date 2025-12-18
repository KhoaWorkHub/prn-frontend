// Temporary placeholder to fix build error - no actual signalR import
// TODO: Install @microsoft/signalr and implement proper SignalR service

import { toast } from 'sonner'

class SignalRService {
  // Placeholder implementation
  private connection: any = null

  async start() {
    console.log('SignalR service placeholder - not implemented')
  }

  async stop() {
    console.log('SignalR service placeholder - not implemented')
  }

  on(event: string, callback: (data: any) => void) {
    console.log('SignalR on placeholder - not implemented')
  }

  off(event: string, callback?: (data: any) => void) {
    console.log('SignalR off placeholder - not implemented')
  }
}

let signalRInstance: SignalRService | null = null

export function getSignalRService(): SignalRService {
  if (!signalRInstance) {
    signalRInstance = new SignalRService()
  }
  return signalRInstance
}

export function cleanupSignalR(): void {
  if (signalRInstance) {
    signalRInstance.stop()
    signalRInstance = null
  }
}

export interface NotificationMessage {
  type: string
  message: string
  data?: any
}