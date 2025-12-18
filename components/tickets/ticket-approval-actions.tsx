"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Package, 
  CheckCircle, 
  UserCheck, 
  FileCheck,
  Settings,
  Clock,
  AlertCircle
} from "lucide-react"
import { TicketApprovalDialog } from "./ticket-approval-dialog"
import { TicketAssignmentDialog } from "./ticket-assignment-dialog"
import type { TicketResponse } from "@/types/ticket"
import type { User as UserType } from "@/types/auth"

interface TicketApprovalActionsProps {
  ticket: TicketResponse
  user: UserType | null
  onActionComplete: (ticketId: string) => void
}

export function TicketApprovalActions({ ticket, user, onActionComplete }: TicketApprovalActionsProps) {
  if (!user) return null

  const isAdmin = user.roles.includes('Administrator')
  const isManager = user.roles.includes('Manager')
  const isStaff = user.roles.includes('Staff') && ticket.assignedToUserId === user.id
  const isReporter = user.roles.includes('Reporter') && ticket.createdByUserId === user.id

  // Get available actions based on ticket status and user role
  const getAvailableActions = () => {
    const actions: Array<{
      id: string
      label: string
      icon: React.ReactNode
      variant: "default" | "outline" | "secondary"
      action: () => void
      description: string
    }> = []

    switch (ticket.status) {
      case 'Reported':
      case 'WaitingForAssignment':
        if (isAdmin || isManager) {
          actions.push({
            id: 'assign',
            label: 'Assign to Staff',
            icon: <UserCheck size={16} />,
            variant: 'default',
            action: () => {},
            description: 'Assign this ticket to available staff member'
          })
        }
        break

      case 'Assigned':
        if (isStaff) {
          actions.push(
            {
              id: 'request-parts',
              label: 'Request Parts',
              icon: <Package size={16} />,
              variant: 'outline',
              action: () => {},
              description: 'Submit request for replacement parts'
            },
            {
              id: 'request-close',
              label: 'Request Close',
              icon: <CheckCircle size={16} />,
              variant: 'default',
              action: () => {},
              description: 'Request approval to close this ticket'
            }
          )
        }
        break

      case 'InProgress':
        if (isStaff) {
          actions.push(
            {
              id: 'request-parts',
              label: 'Request Parts',
              icon: <Package size={16} />,
              variant: 'outline',
              action: () => {},
              description: 'Submit request for replacement parts'
            },
            {
              id: 'request-close',
              label: 'Request Close',
              icon: <CheckCircle size={16} />,
              variant: 'default',
              action: () => {},
              description: 'Request approval to close this ticket'
            }
          )
        }
        break

      case 'WaitingForPartApproval':
      case 'WaitingForCloseApproval':
        if (isAdmin || isManager) {
          actions.push({
            id: 'review-approval',
            label: 'Review Request',
            icon: <FileCheck size={16} />,
            variant: 'default',
            action: () => {},
            description: 'Review and approve/reject the pending request'
          })
        }
        break

      default:
        break
    }

    return actions
  }

  const actions = getAvailableActions()

  if (actions.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock size={20} />
          <div>
            <h3 className="font-medium">No Actions Available</h3>
            <p className="text-sm">
              {ticket.status === 'Closed' 
                ? 'This ticket has been closed'
                : 'Waiting for other roles to take action'
              }
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Available Actions</h3>
            <p className="text-sm text-muted-foreground">
              Actions you can perform on this ticket
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {action.icon}
                <div>
                  <h4 className="font-medium">{action.label}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
              
              {action.id === 'assign' && (
                <TicketAssignmentDialog
                  ticket={ticket}
                  onAssignmentComplete={(ticketId) => {
                    onActionComplete(ticketId)
                  }}
                  trigger={
                    <Button variant={action.variant}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  }
                />
              )}

              {action.id === 'request-parts' && (
                <TicketApprovalDialog
                  ticket={ticket}
                  approvalType="order-part"
                  onApprovalComplete={(ticketId) => {
                    onActionComplete(ticketId)
                  }}
                  trigger={
                    <Button variant={action.variant}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  }
                />
              )}

              {action.id === 'request-close' && (
                <TicketApprovalDialog
                  ticket={ticket}
                  approvalType="close"
                  onApprovalComplete={(ticketId) => {
                    onActionComplete(ticketId)
                  }}
                  trigger={
                    <Button variant={action.variant}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  }
                />
              )}

              {action.id === 'review-approval' && (
                <TicketApprovalDialog
                  ticket={ticket}
                  approvalType="review"
                  onApprovalComplete={(ticketId) => {
                    onActionComplete(ticketId)
                  }}
                  trigger={
                    <Button variant={action.variant}>
                      {action.icon}
                      <span className="ml-2">{action.label}</span>
                    </Button>
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Status Information */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-muted-foreground" />
            <span className="font-medium text-sm">Current Status</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{ticket.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {ticket.assignedToUser ? `Assigned to ${ticket.assignedToUser.userName}` : 'Unassigned'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}