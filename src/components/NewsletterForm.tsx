'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojndnbp';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface NewsletterFormProps {
  variant?: 'default' | 'compact';
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showIcon?: boolean;
  /** Use when form is on a primary/dark background (e.g. Newsletter CTA) */
  onPrimaryBg?: boolean;
}

export function NewsletterForm({
  variant = 'default',
  className,
  inputClassName,
  buttonClassName,
  showIcon = true,
  onPrimaryBg = false,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setStatus('error');
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 py-2',
          'animate-in fade-in-0 zoom-in-95 duration-500',
          className
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 rounded-full px-4 py-2',
            onPrimaryBg
              ? 'bg-primary-foreground/10'
              : 'bg-primary/10'
          )}
        >
          <CheckCircle2
            className={cn(
              'h-5 w-5 shrink-0',
              onPrimaryBg ? 'text-green-300' : 'text-green-600 dark:text-green-400'
            )}
          />
          <p
            className={cn(
              'text-sm font-medium',
              onPrimaryBg ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            You&apos;re all set! Check your inbox.
          </p>
        </div>
        <p
          className={cn(
            'text-xs text-center',
            onPrimaryBg ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}
        >
          We&apos;ll send you the latest guides and project updates.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col sm:flex-row gap-3', variant === 'compact' && 'sm:gap-2', className)}
    >
      <Input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        required
        className={cn(
          'transition-opacity duration-200',
          status === 'loading' && 'opacity-70',
          inputClassName
        )}
      />
      <Button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'transition-all duration-200 shrink-0',
          status === 'loading' && 'cursor-not-allowed',
          buttonClassName
        )}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Subscribing...
          </>
        ) : (
          <>
            {showIcon && <Send className="h-4 w-4 mr-2" />}
            Subscribe
          </>
        )}
      </Button>
    </form>
  );
}
