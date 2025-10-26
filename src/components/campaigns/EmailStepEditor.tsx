import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DEFAULT_VARIABLES, EmailStep } from '@/types/campaign.types';
import { Eye, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import VariablePicker from './VariablePicker';

interface Props {
  step: EmailStep;
  onUpdate: (updates: Partial<EmailStep>) => Promise<void>;
}

export default function EmailStepEditor({ step, onUpdate }: Props) {
  const [subject, setSubject] = useState(step.subject || '');
  const [body, setBody] = useState(step.body || '');
  const [showPreview, setShowPreview] = useState(false);
  const subjectInputRef = useRef<HTMLInputElement>(null);

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    onUpdate({ subject: value });
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    onUpdate({ body: value });
  };

  const insertVariable = (variable: string, target: 'subject' | 'body') => {
    const placeholder = `{{${variable}}}`;

    if (target === 'subject' && subjectInputRef.current) {
      const input = subjectInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue =
        subject.slice(0, start) + placeholder + subject.slice(end);
      setSubject(newValue);
      onUpdate({ subject: newValue });

      // Set cursor position after inserted variable
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(
          start + placeholder.length,
          start + placeholder.length
        );
      }, 0);
    } else if (target === 'body') {
      const newValue = body + placeholder;
      setBody(newValue);
      onUpdate({ body: newValue });
    }
  };

  const replaceVariablesWithExamples = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      const variable = DEFAULT_VARIABLES.find(v => v.key === key);
      return variable ? variable.example : `{{${key}}}`;
    });
  };

  return (
    <div className='h-full flex flex-col'>
      {/* Header */}
      <div className='px-8 py-6 border-b border-gray-200'>
        <div className='flex items-center justify-between mb-4'>
          <Input
            type='text'
            value={step.name}
            onChange={e => onUpdate({ name: e.target.value })}
            className='text-2xl font-semibold border-none focus:outline-none focus:ring-0 bg-transparent p-0 h-auto'
            placeholder='Email Step Name'
          />
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowPreview(!showPreview)}
            className='flex items-center gap-2'
          >
            <Eye className='w-4 h-4' />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Email Composer */}
      <div className='flex-1 overflow-y-auto px-8 py-6'>
        {!showPreview ? (
          <div className='max-w-3xl'>
            {/* Subject Line */}
            <div className='mb-6'>
              <Label className='block text-sm font-medium text-gray-700 mb-2'>
                Subject Line
              </Label>
              <div className='flex gap-2'>
                <Input
                  ref={subjectInputRef}
                  type='text'
                  value={subject}
                  onChange={e => handleSubjectChange(e.target.value)}
                  placeholder='Hi {{first_name}}, quick question about {{company}}'
                  className='flex-1'
                />
                <VariablePicker
                  onSelect={variable => insertVariable(variable, 'subject')}
                />
              </div>
              <p className='mt-1 text-xs text-gray-500'>
                Use {'{{'} and {'}}'} for personalization (e.g.,{' '}
                {'{{first_name}}'})
              </p>
            </div>

            {/* Email Body */}
            <div className='mb-6'>
              <div className='flex items-center justify-between mb-2'>
                <Label className='block text-sm font-medium text-gray-700'>
                  Email Body
                </Label>
                <Button
                  variant='outline'
                  size='sm'
                  className='bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 flex items-center gap-2'
                >
                  <Sparkles className='w-4 h-4' />
                  Compose with AI
                </Button>
              </div>

              {/* Rich Text Editor Toolbar */}
              <div className='border border-gray-300 rounded-t-md bg-gray-50 p-2 flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1.5 font-bold text-sm'
                >
                  B
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1.5 italic text-sm'
                >
                  I
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='p-1.5 underline text-sm'
                >
                  U
                </Button>
                <div className='w-px h-5 bg-gray-300 mx-1' />
                <Button variant='ghost' size='sm' className='p-1.5 text-sm'>
                  Link
                </Button>
                <Button variant='ghost' size='sm' className='p-1.5 text-sm'>
                  List
                </Button>
                <div className='flex-1' />
                <VariablePicker
                  onSelect={variable => insertVariable(variable, 'body')}
                  buttonText='Insert Variable'
                />
              </div>

              {/* Text Area */}
              <Textarea
                value={body}
                onChange={e => handleBodyChange(e.target.value)}
                placeholder='Hi {{first_name}},&#10;&#10;I hope this email finds you well...'
                rows={12}
                className='w-full border-t-0 rounded-b-md font-mono text-sm'
              />
            </div>

            {/* Send Settings */}
            <div className='border border-gray-200 rounded-lg p-4'>
              <h3 className='text-sm font-semibold text-gray-900 mb-3'>
                Send Settings
              </h3>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={step.send_as === 'business_hours'}
                  onChange={e =>
                    onUpdate({
                      send_as: e.target.checked
                        ? 'business_hours'
                        : 'immediate',
                    })
                  }
                  className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                />
                <span className='text-sm text-gray-700'>
                  Only send during business hours (9 AM - 5 PM)
                </span>
              </label>
            </div>
          </div>
        ) : (
          /* Email Preview */
          <div className='max-w-3xl'>
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              {/* Preview Header */}
              <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                <div className='text-xs text-gray-600 mb-1'>Subject:</div>
                <div className='font-semibold text-gray-900'>
                  {replaceVariablesWithExamples(subject)}
                </div>
              </div>

              {/* Preview Body */}
              <div className='p-6 bg-white'>
                <div className='prose prose-sm max-w-none'>
                  {body.split('\n').map((paragraph, i) => (
                    <p key={i} className='mb-3 last:mb-0'>
                      {replaceVariablesWithExamples(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
              <p className='text-sm text-blue-900'>
                📝 This is a preview with example data. Actual emails will use
                real contact information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
