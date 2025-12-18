"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Package, 
  FileCheck,
  ArrowRight,
  AlertCircle
} from "lucide-react"
import { TicketAssignmentDialog } from "./ticket-assignment-dialog"
import { TicketApprovalDialog } from "./ticket-approval-dialog"
import type { TicketResponse } from "@/types/ticket"
import { useAuth } from "@/lib/auth-context"

interface TicketWorkflowProps {
  ticket: TicketResponse
  onTicketUpdate?: (ticketId: string) => void
}

export function TicketWorkflow({ ticket, onTicketUpdate }: TicketWorkflowProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  // Define workflow steps based on ticket status
  const getWorkflowSteps = () => {
    const baseSteps = [
      {
        id: 'reported',
        title: 'Reported',
        status: 'completed',
        description: 'Ticket created by reporter',
        role: 'Reporter',
        actions: []
      }
    ]

    switch (ticket.status) {
      case 'Reported':
        return [
          ...baseSteps,
          {
            id: 'waiting-assignment',
            title: 'Waiting for Assignment',
            status: 'current',
            description: 'Manager needs to assign staff',
            role: 'Manager/Admin',
            actions: ['assign']
          }
        ]

      case 'WaitingForAssignment':
        return [
          ...baseSteps,
          {
            id: 'waiting-assignment',
            title: 'Waiting for Assignment',
            status: 'current',
            description: 'Manager needs to assign staff',
            role: 'Manager/Admin',
            actions: ['assign']
          }
        ]

      case 'Assigned':
        return [
          ...baseSteps,
          {
            id: 'assigned',
            title: 'Assigned to Staff',
            status: 'completed',
            description: `Assigned to ${ticket.assignedToUser?.userName || 'Staff'}`,
            role: 'Manager/Admin',
            actions: []
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            status: 'current',
            description: 'Staff working on the issue',
            role: 'Staff',
            actions: ['start-work', 'request-parts', 'update-progress']
          }
        ]

      case 'InProgress':
        return [
          ...baseSteps,
          {
            id: 'assigned',
            title: 'Assigned',
            status: 'completed',
            description: `Assigned to ${ticket.assignedToUser?.userName || 'Staff'}`,
            role: 'Manager/Admin',
            actions: []
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            status: 'current',
            description: 'Staff working on the issue',
            role: 'Staff',
            actions: ['request-parts', 'request-close', 'update-progress']
          }
        ]

      case 'WaitingForPartApproval':
        return [
          ...baseSteps,
          {
            id: 'assigned',
            title: 'Assigned',
            status: 'completed',
            description: `Assigned to ${ticket.assignedToUser?.userName || 'Staff'}`,
            role: 'Manager/Admin',
            actions: []
          },
          {
            id: 'in-progress',
            title: 'In Progress',
            status: 'completed',
            description: 'Staff working on the issue',
            role: 'Staff',
            actions: []
          },
          {
            id: 'waiting-part-approval',
            title: 'Waiting for Part Approval',
            status: 'current',
            description: 'Manager needs to approve parts request',
            role: 'Manager/Admin',
            actions: ['review-parts']
          }
        ]

      case 'WaitingForParts':
        return [
          ...baseSteps,
          {
            id: 'assigned',
            title: 'Assigned',
            status: 'completed',
            description: `Assigned to ${ticket.assignedToUser?.userName || 'Staff'}`,
            role: 'Manager/Admin',
            actions: []
          },
          {
            id: 'parts-approved',
            title: 'Parts Approved',
            status: 'completed',
            description: 'Waiting for parts delivery',
            role: 'Manager/Admin',
            actions: []
          },
          {
            id: 'waiting-parts',
            title: 'Waiting for Parts',
            status: 'current',
            description: 'Parts are being delivered',
            role: 'System',
            actions: []
          }
        ]

      case 'WaitingForCloseApproval':
        return [
          ...baseSteps,
          {
            id: 'work-completed',
            title: 'Work Completed',
            status: 'completed',
            description: 'Staff completed the work',
            role: 'Staff',
            actions: []
          },
          {
            id: 'waiting-close-approval',
            title: 'Waiting for Close Approval',
            status: 'current',
            description: 'Manager needs to approve closure',
            role: 'Manager/Admin',
            actions: ['review-close']
          }
        ]

      case 'Closed':
        return [
          ...baseSteps,
          {
            id: 'completed',
            title: 'Completed',
            status: 'completed',
            description: 'Ticket successfully resolved',
            role: 'Manager/Admin',
            actions: []
          }
        ]

      default:
        return baseSteps
    }
  }

  const steps = getWorkflowSteps()
  const currentStepData = steps.find(step => step.status === 'current')

  // Check if current user can perform actions
  const canPerformAction = (actionRole: string) => {
    if (!user) return false
    
    switch (actionRole) {
      case 'Reporter':
        return user.roles.includes('Reporter')
      case 'Staff':
        return user.roles.includes('Staff') && ticket.assignedToUserId === user.id
      case 'Manager/Admin':
        return user.roles.includes('Manager') || user.roles.includes('Administrator')
      default:
        return false
    }
  }

  const renderActionButtons = (actions: string[]) => {
    if (!currentStepData || !canPerformAction(currentStepData.role)) {
      return null
    }

    return (
      <div className="flex gap-2 flex-wrap mt-4">
        {actions.map((action) => {
          switch (action) {
            case 'assign':
              return (
                <TicketAssignmentDialog
                  key={action}
                  ticket={ticket}
                  onAssignmentComplete={(ticketId, staffId) => {
                    onTicketUpdate?.(ticketId)
                  }}
                  trigger={
                    <Button size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      Assign Staff
                    </Button>
                  }
                />
              )

            case 'request-parts':
              return (
                <TicketApprovalDialog
                  key={action}
                  ticket={ticket}
                  approvalType="order-part"
                  onApprovalComplete={(ticketId) => {
                    onTicketUpdate?.(ticketId)
                  }}
                  trigger={
                    <Button size="sm" variant="outline" className="gap-2">
                      <Package className="w-4 h-4" />
                      Request Parts
                    </Button>
                  }
                />
              )

            case 'request-close':
              return (
                <TicketApprovalDialog
                  key={action}
                  ticket={ticket}
                  approvalType="close"
                  onApprovalComplete={(ticketId) => {
                    onTicketUpdate?.(ticketId)
                  }}
                  trigger={
                    <Button size="sm" className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Request Close
                    </Button>
                  }
                />
              )

            case 'review-parts':
            case 'review-close':
              return (
                <TicketApprovalDialog
                  key={action}
                  ticket={ticket}
                  approvalType="review"
                  onApprovalComplete={(ticketId) => {
                    onTicketUpdate?.(ticketId)
                  }}
                  trigger={
                    <Button size="sm" variant="outline" className="gap-2">
                      <FileCheck className="w-4 h-4" />
                      Review Request
                    </Button>
                  }
                />
              )

            case 'start-work':
              return (
                <Button key={action} size="sm" variant="outline" className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Work
                </Button>
              )

            case 'update-progress':
              return (
                <Button key={action} size="sm" variant="outline" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Update Progress
                </Button>
              )

            default:
              return null
          }
        })}
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ticket Workflow</h3>
          <p className="text-sm text-muted-foreground">
            Track progress and manage ticket lifecycle
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step Icon */}
              <div className="flex flex-col items-center">
                {getStatusIcon(step.status)}
                {index < steps.length - 1 && (
                  <div className={`w-px h-12 mt-2 ${
                    step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                  }`} />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    step.status === 'current' ? 'text-blue-600' : 
                    step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h4>
                  <Badge variant={
                    step.status === 'current' ? 'default' :
                    step.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {step.role}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>

                {/* Action Buttons for Current Step */}
                {step.status === 'current' && renderActionButtons(step.actions)}
              </div>
            </div>
          ))}
        </div>

        {/* Current User Actions */}
        {currentStepData && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Next Action Required</span>
            </div>
            <p className="text-sm text-blue-800">
              {canPerformAction(currentStepData.role) ? (
                `You can perform the next action for this ticket.`
              ) : (
                `Waiting for ${currentStepData.role} to take action.`
              )}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}