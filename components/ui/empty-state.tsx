'use client';

import { FileQuestion, Inbox, PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'inbox' | 'search' | 'package';
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  inbox: Inbox,
  search: FileQuestion,
  package: PackageX,
};

export function EmptyState({ 
  title, 
  description, 
  icon = 'inbox', 
  action 
}: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
