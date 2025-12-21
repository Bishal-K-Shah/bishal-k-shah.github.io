import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";

interface BreadcrumbProps {
  category: string;
  slug: string;
  title: string;
  className?: string;
}

export function Breadcrumb({ category, slug, title, className }: BreadcrumbProps) {
  const baseUrl = 'https://bishalkshah.com.np';
  
  // JSON-LD Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `${baseUrl}/?category=${encodeURIComponent(category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": `${baseUrl}/blog/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm text-muted-foreground overflow-hidden whitespace-nowrap mb-6", className)}>
        <Link href="/" className="flex items-center hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50 flex-shrink-0" />
        <Link 
          href={`/?category=${category}`} 
          className="hover:text-primary transition-colors font-medium"
        >
          {capitalize(category)}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground/50 flex-shrink-0" />
        <span className="text-foreground truncate font-medium max-w-[200px] sm:max-w-[400px]" title={title}>
          {title}
        </span>
      </nav>
    </>
  );
}
