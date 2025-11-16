import { useState } from 'react';
import { motion } from 'motion/react';
import { User, LogOut, Sparkles, History } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface UserProfileProps {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onViewHistory?: () => void;
}

export function UserProfile({ user, onSignOut, onSignIn, onViewHistory }: UserProfileProps) {
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2"
      >
        <Button
          onClick={onSignIn}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-0 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
        >
          <User className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </motion.div>
    );
  }

  // Get initials from name
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="glass-card border border-primary/30 hover:bg-white/5 hover:border-primary/50 transition-all duration-300 gap-2 pr-4"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-white text-sm font-semibold">{initials}</span>
            </div>
            <span className="hidden sm:inline max-w-[150px] truncate">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-modal border-white/10 w-64" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-2 ring-primary/20">
                  <span className="text-white font-semibold">{initials}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">{user.name}</span>
                  <span className="text-xs text-muted-foreground font-normal truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          {onViewHistory && (
            <DropdownMenuItem
              onClick={onViewHistory}
              className="cursor-pointer text-primary focus:text-primary focus:bg-primary/10"
            >
              <History className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={onSignOut}
            className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}