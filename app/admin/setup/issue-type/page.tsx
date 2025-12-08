"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const mockIssueTypes = [
  { id: 1, name: "Bulb Burned", facilityType: "Projector", slaTime: 4, tickets: 12 },
  { id: 2, name: "No Signal", facilityType: "Projector", slaTime: 2, tickets: 8 },
  { id: 3, name: "Not Cooling", facilityType: "Air Conditioner", slaTime: 3, tickets: 15 },
  { id: 4, name: "Water Leak", facilityType: "Air Conditioner", slaTime: 5, tickets: 5 },
  { id: 5, name: "Low Speed", facilityType: "WiFi Router", slaTime: 1, tickets: 20 },
]

export default function IssueTypeManagementPage() {
  const [issues, setIssues] = useState(mockIssueTypes)
  const [newIssue, setNewIssue] = useState({ name: "", facilityType: "", slaTime: 2 })

  const getSLAColor = (hours: number) => {
    if (hours <= 1) return "bg-red-100 text-red-800"
    if (hours <= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issue Type Management</h1>
        <p className="text-slate-600">Define issue types and set SLA times</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Issue Types</CardTitle>
              <CardDescription>Configure issue categories and SLA times</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Issue Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Issue Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Issue Name</label>
                    <Input placeholder="e.g., Bulb Burned" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Facility Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="projector">Projector</SelectItem>
                        <SelectItem value="ac">Air Conditioner</SelectItem>
                        <SelectItem value="wifi">WiFi Router</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">SLA Time (hours)</label>
                    <Input type="number" placeholder="2" min="1" />
                  </div>
                  <Button className="w-full">Create Issue Type</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Name</TableHead>
                <TableHead>Facility Type</TableHead>
                <TableHead>SLA Time</TableHead>
                <TableHead className="text-right">Tickets</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.name}</TableCell>
                  <TableCell>{issue.facilityType}</TableCell>
                  <TableCell>
                    <Badge className={getSLAColor(issue.slaTime)}>
                      <Clock className="w-3 h-3 mr-1" />
                      {issue.slaTime}h
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{issue.tickets}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
