import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEFAULT_VARIABLES } from '@/types/campaign.types';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onSelect: (variableKey: string) => void;
  buttonText?: string;
}

export default function VariablePicker({
  onSelect,
  buttonText = '{{}}',
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredVariables = DEFAULT_VARIABLES.filter(
    v =>
      v.label.toLowerCase().includes(search.toLowerCase()) ||
      v.key.toLowerCase().includes(search.toLowerCase())
  );

  const contactVars = filteredVariables.filter(v => v.category === 'contact');
  const companyVars = filteredVariables.filter(v => v.category === 'company');

  const handleSelect = (key: string) => {
    onSelect(key);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className='relative' ref={dropdownRef}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1'
      >
        {buttonText}
        <ChevronDown className='w-3.5 h-3.5' />
      </Button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-border z-50'>
          {/* Search */}
          <div className='p-2 border-b border-border'>
            <Input
              type='text'
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search variables...'
              className='text-sm'
              autoFocus
            />
          </div>

          {/* Variable List */}
          <div className='max-h-80 overflow-y-auto py-2'>
            {contactVars.length > 0 && (
              <>
                <div className='px-3 py-1 text-xs font-semibold text-muted-foreground uppercase'>
                  Contact Fields
                </div>
                {contactVars.map(variable => (
                  <Button
                    key={variable.key}
                    variant='ghost'
                    onClick={() => handleSelect(variable.key)}
                    className='w-full justify-between px-3 py-2 text-left hover:bg-muted h-auto'
                  >
                    <div>
                      <div className='text-sm font-medium text-foreground'>
                        {variable.label}
                      </div>
                      <div className='text-xs text-muted-foreground font-mono'>
                        {`{{${variable.key}}}`}
                      </div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {variable.example}
                    </div>
                  </Button>
                ))}
              </>
            )}

            {companyVars.length > 0 && (
              <>
                <div className='px-3 py-1 text-xs font-semibold text-muted-foreground uppercase mt-2'>
                  Company Fields
                </div>
                {companyVars.map(variable => (
                  <Button
                    key={variable.key}
                    variant='ghost'
                    onClick={() => handleSelect(variable.key)}
                    className='w-full justify-between px-3 py-2 text-left hover:bg-muted h-auto'
                  >
                    <div>
                      <div className='text-sm font-medium text-foreground'>
                        {variable.label}
                      </div>
                      <div className='text-xs text-muted-foreground font-mono'>
                        {`{{${variable.key}}}`}
                      </div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {variable.example}
                    </div>
                  </Button>
                ))}
              </>
            )}

            {filteredVariables.length === 0 && (
              <div className='px-3 py-8 text-center text-sm text-muted-foreground'>
                No variables found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
