"use client"

import { useState } from "react"
import { AlertTriangle, Merge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const potentialDuplicates = [
  {
    pair: ["TK001", "TK002"],
    similarity: 95,
    room: "A101",
    facility: "Projector",
    timeDiff: "2h",
    issueType: "No Signal",
  },
  {
    pair: ["TK005", "TK008"],
    similarity: 87,
    room: "B202",
    facility: "AC",
    timeDiff: "30m",
    issueType: "Water Leak",
  },
  {
    pair: ["TK012", "TK015"],
    similarity: 92,
    room: "C303",
    facility: "WiFi",
    timeDiff: "1h 15m",
    issueType: "Low Speed",
  },
]

export default function DuplicateDetectionPage() {
  const [selectedPair, setSelectedPair] = useState<string[] | null>(null)

  const handleMerge = (pair: string[]) => {
    console.log(`Merging tickets: ${pair[0]} and ${pair[1]}`)
    setSelectedPair(null)
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "bg-red-100 text-red-800"
    if (similarity >= 80) return "bg-orange-100 text-orange-800"
    return "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Duplicate Detection</h1>
        <p className="text-slate-600">Identify and merge duplicate tickets</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Potential Duplicates</CardTitle>
              <CardDescription>Tickets that may be duplicates based on similarity analysis</CardDescription>
            </div>
            <Badge className="bg-red-100 text-red-800 text-base py-2 px-3">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {potentialDuplicates.length} Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket Pair</TableHead>
                <TableHead>Similarity</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Time Diff</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {potentialDuplicates.map((dup, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-medium">
                    {dup.pair[0]} + {dup.pair[1]}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSimilarityColor(dup.similarity)}>{dup.similarity}%</Badge>
                  </TableCell>
                  <TableCell>{dup.room}</TableCell>
                  <TableCell>{dup.issueType}</TableCell>
                  <TableCell>{dup.timeDiff}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedPair(dup.pair)}>
                          Compare
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Compare Tickets</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          {dup.pair.map((ticketId) => (
                            <Card key={ticketId}>
                              <CardContent className="pt-6 space-y-3 text-sm">
                                <div>
                                  <p className="text-slate-600">ID</p>
                                  <p className="font-mono font-medium">{ticketId}</p>
                                </div>
                                <div>
                                  <p className="text-slate-600">Room</p>
                                  <p>{dup.room}</p>
                                </div>
                                <div>
                                  <p className="text-slate-600">Issue</p>
                                  <p>{dup.issueType}</p>
                                </div>
                                <div>
                                  <p className="text-slate-600">Facility</p>
                                  <p>{dup.facility}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <Button onClick={() => handleMerge(dup.pair)} className="w-full mt-4">
                          <Merge className="w-4 h-4 mr-2" />
                          Merge These Tickets
                        </Button>
                      </DialogContent>
                    </Dialog>
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
