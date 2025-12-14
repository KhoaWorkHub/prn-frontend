'use client';

import { Badge } from '@/components/ui/badge';
import { TicketStatus } from '@/types/ticket';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Package, 
  XCircle,
  Eye,
  PlayCircle
} from 'lucide-react';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

const statusConfig: Record<TicketStatus, {
  label: string;
  color: string;
  icon: React.ElementType;
}> = {
  [TicketStatus.REPORTED]: {
    label: 'Reported',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: AlertCircle,
  },
  [TicketStatus.ASSIGNED]: {
    label: 'Assigned',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Eye,
  },
  [TicketStatus.REVIEWING]: {
    label: 'Reviewing',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  [TicketStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Wrench,
  },
  [TicketStatus.WAITING_FOR_PART_APPROVAL]: {
    label: 'Awaiting Approval',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  [TicketStatus.WAITING_FOR_PARTS]: {
    label: 'Waiting for Parts',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Package,
  },
  [TicketStatus.WAITING_FOR_CLOSE_APPROVAL]: {
    label: 'Pending Closure',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: PlayCircle,
  },
  [TicketStatus.CLOSED]: {
    label: 'Closed',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2,
  },
};

export function TicketStatusBadge({ status, className = '' }: TicketStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${className} font-medium px-3 py-1`}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {config.label}
    </Badge>
  );
}
