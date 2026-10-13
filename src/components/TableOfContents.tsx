"use client";

import * as React from "react";
import { ChevronDown, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

// Smooth-scroll to a heading (its scroll-margin keeps it clear of the sticky headers)
// and update the URL hash so the section can be shared.
function jumpTo(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  event.preventDefault();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function useActiveHeading(ids: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    // The active section is the last heading that has scrolled past the top ~30% of the viewport.
    const update = () => {
      const threshold = window.innerHeight * 0.3;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= threshold) current = heading.id;
        else break;
      }
      setActiveId(current);
    };

    const observer = new IntersectionObserver(update, { rootMargin: "0px 0px -70% 0px" });
    headings.forEach((heading) => observer.observe(heading));
    update();
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

/** Collapsible "On this page" box shown above the article on phones and tablets. */
export function MobileTableOfContents({ items }: TableOfContentsProps) {
  const detailsRef = React.useRef<HTMLDetailsElement>(null);

  return (
    <details
      ref={detailsRef}
      className="group lg:hidden mb-10 rounded-xl border border-border/60 bg-muted/40"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-primary" />
          On this page
          <span className="font-normal text-muted-foreground">({items.length} sections)</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <nav aria-label="Table of contents" className="border-t border-border/60 px-4 py-3">
        <ol className="space-y-1">
          {items.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  // Collapse first: closing afterwards shrinks the page above the
                  // target mid-scroll and leaves the heading off screen.
                  if (detailsRef.current) detailsRef.current.open = false;
                  jumpTo(event, item.id);
                }}
                className="flex gap-3 rounded-md px-2 py-1.5 text-sm leading-snug text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
              >
                <span className="w-5 shrink-0 text-right tabular-nums text-primary/70">{index + 1}.</span>
                <span className="min-w-0 break-words">{item.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

/** Sticky sidebar with active-section highlighting, shown on large screens. */
export function SidebarTableOfContents({ items }: TableOfContentsProps) {
  const ids = React.useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useActiveHeading(ids);

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pb-6"
    >
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
        <ListTree className="h-4 w-4 text-primary" />
        On this page
      </p>
      <ol className="space-y-0.5 border-l border-border">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => jumpTo(event, item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-3 pr-1 text-[13px] leading-snug transition-colors break-words",
                  isActive
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
