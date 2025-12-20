import React from 'react';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SocialShareProps = {
  url: string;
  title: string;
};

export function SocialShare({ url, title }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Share on X (Twitter)',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      colorClass: 'hover:text-sky-500 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30',
    },
    {
      name: 'Share on LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      colorClass: 'hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      name: 'Share on Reddit',
      icon: Share2,
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      colorClass: 'hover:text-orange-600 hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30',
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-muted-foreground/80 tracking-wide uppercase text-xs">Share</span>
      <TooltipProvider>
        <div className="flex gap-2">
          {shareLinks.map((link) => (
            <Tooltip key={link.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-9 w-9 rounded-full transition-all duration-300 ${link.colorClass}`}
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{link.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
