'use client';

import { Badge } from '@/components/ui/badge';
import { TicketSeverity } from '@/types/ticket';
import { AlertTriangle, AlertCircle, Info, Flame } from 'lucide-react';

interface SeverityBadgeProps {
  severity: TicketSeverity;
  className?: string;
}

const severityConfig: Record<TicketSeverity, {
  label: string;
  color: string;
  icon: React.ElementType;
}> = {
  [TicketSeverity.LOW]: {
    label: 'Low',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Info,
  },
  [TicketSeverity.MEDIUM]: {
    label: 'Medium',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: AlertCircle,
  },
  [TicketSeverity.HIGH]: {
    label: 'High',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: AlertTriangle,
  },
  [TicketSeverity.CRITICAL]: {
    label: 'Critical',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: Flame,
  },
};

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
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
