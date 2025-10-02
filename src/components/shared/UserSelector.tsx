import React, { useState, useEffect, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, Users, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface UserSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showUnassignOption?: boolean;
  excludeUsers?: string[];
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select user...",
  disabled = false,
  className,
  showUnassignOption = true,
  excludeUsers = []
}) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, role, is_active')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => !excludeUsers.includes(user.id));
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.full_name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  }, [users, searchTerm, excludeUsers]);

  const selectedUser = users.find(user => user.id === value);

  const handleSelect = (userId: string) => {
    onValueChange(userId);
    setOpen(false);
  };

  const handleUnassign = () => {
    onValueChange('');
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled || loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sidebar-primary"></div>
              Loading users...
            </div>
          ) : selectedUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                {selectedUser.full_name.split(' ').map(namePart => namePart[0]).join('').toUpperCase()}
              </div>
              <span className="truncate">{selectedUser.full_name}</span>
              <Badge variant="secondary" className="text-xs">
                {selectedUser.role}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search users..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {searchTerm ? 'No users found.' : 'No users available.'}
            </CommandEmpty>
            
            {showUnassignOption && (
              <CommandGroup>
                <CommandItem
                  value="unassign"
                  onSelect={handleUnassign}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span>Unassign</span>
                </CommandItem>
              </CommandGroup>
            )}
            
            <CommandGroup>
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.id}
                  onSelect={() => handleSelect(user.id)}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                    {user.full_name.split(' ').map(namePart => namePart[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{user.full_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
