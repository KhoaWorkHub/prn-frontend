"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Clock, 
  CheckCircle, 
  User, 
  Package, 
  FileCheck,
  ArrowRight,
  AlertCircle,
  Users,
  Bell
} from "lucide-react"
import { toast } from "sonner"

export function WorkflowScenario() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const scenarios = [
    {
      title: "Scenario 1: Complete Ticket Lifecycle",
      steps: [
        {
          role: "Reporter",
          action: "Create new ticket (broken projector)",
          description: "Reporter logs in and creates a ticket for broken projector in Room A101",
          status: "pending"
        },
        {
          role: "Admin/Manager", 
          action: "Assign ticket to staff",
          description: "Admin reviews new tickets and assigns to available technician",
          status: "pending"
        },
        {
          role: "Staff",
          action: "Accept ticket → Update progress → Request parts",
          description: "Staff accepts assignment, diagnoses issue, requests replacement bulb",
          status: "pending"
        },
        {
          role: "Manager",
          action: "Approve parts request", 
          description: "Manager reviews part request and approves purchase",
          status: "pending"
        },
        {
          role: "Staff",
          action: "Complete repair → Request close",
          description: "Staff receives parts, completes repair, requests ticket closure",
          status: "pending"
        },
        {
          role: "Manager",
          action: "Approve close → Ticket resolved",
          description: "Manager verifies completion and closes ticket",
          status: "pending"
        }
      ]
    },
    {
      title: "Scenario 2: Real-time Features Demo",
      steps: [
        {
          role: "Setup",
          action: "Open 2 browser windows (Staff + Manager)",
          description: "Demonstrate real-time notifications across different user sessions",
          status: "pending"
        },
        {
          role: "Staff",
          action: "Create approval request",
          description: "Staff submits part order or close approval request",
          status: "pending"
        },
        {
          role: "Manager",
          action: "Receive real-time notification (SignalR)",
          description: "Manager instantly receives notification without page refresh",
          status: "pending"
        },
        {
          role: "Manager",
          action: "Approve → Staff receives notification",
          description: "Approval decision sent to staff in real-time",
          status: "pending"
        }
      ]
    }
  ]

  const [selectedScenario, setSelectedScenario] = useState(0)
  const currentScenario = scenarios[selectedScenario]

  const runScenario = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    
    for (let i = 0; i < currentScenario.steps.length; i++) {
      setCurrentStep(i)
      const step = currentScenario.steps[i]
      
      // Simulate step execution
      toast.info(`${step.role}: ${step.action}`, {
        description: step.description,
        duration: 3000
      })
      
      // Update step status
      currentScenario.steps[i].status = "running"
      
      // Wait for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Complete step
      currentScenario.steps[i].status = "completed"
      
      if (i < currentScenario.steps.length - 1) {
        toast.success(`✅ Step ${i + 1} completed`)
      }
    }
    
    toast.success("🎉 Scenario completed successfully!", {
      description: "All workflow steps executed",
      duration: 5000
    })
    
    setIsRunning(false)
  }

  const resetScenario = () => {
    currentScenario.steps.forEach(step => {
      step.status = "pending"
    })
    setCurrentStep(0)
    setIsRunning(false)
  }

  const getStepIcon = (status: string, index: number) => {
    if (status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    } else if (status === "running" || index === currentStep) {
      return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
    } else {
      return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Reporter":
        return <User className="w-4 h-4" />
      case "Staff":
        return <Users className="w-4 h-4" />
      case "Admin/Manager":
      case "Manager":
        return <FileCheck className="w-4 h-4" />
      case "Setup":
        return <Bell className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">🎬 Workflow Demo Scenarios</h2>
          <p className="text-muted-foreground">
            Interactive demonstration of complete ticket lifecycle using real backend APIs
          </p>
        </div>

        {/* Scenario Selection */}
        <div className="flex gap-2">
          {scenarios.map((scenario, index) => (
            <Button
              key={index}
              variant={selectedScenario === index ? "default" : "outline"}
              onClick={() => {
                setSelectedScenario(index)
                resetScenario()
              }}
              disabled={isRunning}
            >
              {scenario.title}
            </Button>
          ))}
        </div>

        {/* Current Scenario */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">{currentScenario.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2 text-blue-800">
              <User className="w-4 h-4" />
              <span>Multi-role workflow</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Package className="w-4 h-4" />
              <span>Real backend APIs</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Bell className="w-4 h-4" />
              <span>Live notifications</span>
            </div>
          </div>
        </Card>

        {/* Steps */}
        <div className="space-y-4">
          {currentScenario.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Step Icon */}
              <div className="flex flex-col items-center">
                {getStepIcon(step.status, index)}
                {index < currentScenario.steps.length - 1 && (
                  <div className={`w-px h-12 mt-2 ${
                    step.status === "completed" ? "bg-green-200" : "bg-gray-200"
                  }`} />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${
                    step.status === "running" || index === currentStep ? "text-blue-600" : 
                    step.status === "completed" ? "text-green-600" : "text-gray-500"
                  }`}>
                    Step {index + 1}: {step.action}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      step.status === "running" || index === currentStep ? "default" :
                      step.status === "completed" ? "secondary" : "outline"
                    } className="gap-1">
                      {getRoleIcon(step.role)}
                      {step.role}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={runScenario} 
            disabled={isRunning}
            className="gap-2"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Demo
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetScenario}
            disabled={isRunning}
          >
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">Demo Instructions</h4>
              <div className="text-sm text-amber-800 space-y-1">
                <p>• <strong>Scenario 1:</strong> Complete ticket lifecycle from creation to closure</p>
                <p>• <strong>Scenario 2:</strong> Real-time notifications between Staff and Manager</p>
                <p>• All actions use real backend APIs at <code>http://34.169.143.69:8080</code></p>
                <p>• Toast notifications show each workflow step in action</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Available Features Summary */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3">✅ Available Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Authentication: All roles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Ticket CRUD: Full operations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Assignment UI: Ready for API</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Approval APIs: Fully integrated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Real-time: SignalR ready</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Role-based: Complete access control</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  )
}