'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TicketStatusBadge } from './ticket-status-badge';
import { SeverityBadge } from './severity-badge';
import { Ticket } from '@/types/ticket';
import { 
  Calendar, 
  MapPin, 
  User, 
  Building2, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onView?: () => void;
  actions?: React.ReactNode;
  compact?: boolean;
}

export function TicketCard({ ticket, onView, actions, compact = false }: TicketCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 hover:border-l-blue-500 group">
      <CardHeader className={compact ? 'pb-3' : 'pb-4'}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-blue-600 transition-colors">
              {ticket.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {ticket.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <TicketStatusBadge status={ticket.status} />
            <SeverityBadge severity={ticket.severity} />
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'py-3' : 'py-4'}>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {/* Reporter */}
          {ticket.reporterName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="truncate">{ticket.reporterName}</span>
            </div>
          )}

          {/* Assigned To */}
          {ticket.assignedToName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 text-purple-500" />
              <span className="truncate">{ticket.assignedToName}</span>
            </div>
          )}

          {/* Campus */}
          {ticket.campusName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{ticket.campusName}</span>
            </div>
          )}

          {/* Location */}
          {ticket.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{ticket.location}</span>
            </div>
          )}

          {/* Created */}
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>

      {(onView || actions) && (
        <CardFooter className="flex items-center justify-between gap-2 pt-4">
          {onView && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onView}
              className="group/btn"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </CardFooter>
      )}
    </Card>
  );
}
