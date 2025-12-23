'use client';

import { LayoutGrid, ChevronRight, X, Tag as TagIcon, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categoryInfo } from '@/components/icons';
import { Category, CategoryTree, MAIN_CATEGORIES } from '@/types';
import { capitalize } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  selectedCategory: Category | 'All';
  selectedTag: string | null;
  categoryTree: CategoryTree;
  isMobileBrowseOpen: boolean;
  onMobileBrowseOpenChange: (open: boolean) => void;
  onCategoryClick: (category: Category | 'All') => void;
  onFilterUpdate: (category: string | 'All', tag: string | null) => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

export function CategoryTabs({
  selectedCategory,
  selectedTag,
  categoryTree,
  isMobileBrowseOpen,
  onMobileBrowseOpenChange,
  onCategoryClick,
  onFilterUpdate,
  onClearTag,
  onClearAll,
}: CategoryTabsProps) {
  const isNicheCategorySelected =
    selectedCategory !== 'All' && !MAIN_CATEGORIES.includes(selectedCategory);

  return (
    <div id="all-posts" className="flex flex-col items-center mb-8 scroll-mt-4">
      <div className="inline-flex flex-wrap justify-center gap-2 px-1 py-2 bg-muted/50 backdrop-blur-sm rounded-xl border border-border/50">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onCategoryClick('All')}
          className="rounded-lg h-9"
        >
          All Posts
        </Button>

        {/* Main Categories */}
        {MAIN_CATEGORIES.map((name) => {
          const Icon = categoryInfo[name]?.icon;
          return (
            <Button
              key={name}
              variant={selectedCategory === name ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onCategoryClick(name)}
              className="rounded-lg h-9"
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {capitalize(name)}
            </Button>
          );
        })}

        {/* Desktop Browse (Dropdown) */}
        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isNicheCategorySelected
                    ? 'bg-accent text-accent-foreground rounded-lg h-9'
                    : 'rounded-lg h-9'
                }
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
                Browse by Topic
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.keys(categoryTree)
                .sort()
                .map((cat) => {
                  const tags = categoryTree[cat];
                  const hasTags = tags && tags.length > 0;

                  if (hasTags) {
                    return (
                      <DropdownMenuSub key={cat}>
                        <DropdownMenuSubTrigger className="cursor-pointer group">
                          <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground">
                            {capitalize(cat)}
                          </span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-1">
                          <DropdownMenuItem
                            onClick={() => onFilterUpdate(cat, null)}
                            className="font-bold cursor-pointer"
                          >
                            {capitalize(cat)}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tags.map((tag) => (
                            <DropdownMenuItem
                              key={tag}
                              onClick={() => onFilterUpdate(cat, tag)}
                              className="cursor-pointer"
                            >
                              {capitalize(tag)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    );
                  }
                  return (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => onFilterUpdate(cat, null)}
                      className="cursor-pointer group"
                    >
                      <span className="group-focus:text-accent-foreground group-hover:text-accent-foreground">
                        {capitalize(cat)}
                      </span>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Browse (Sheet/Drawer) */}
        <div className="md:hidden">
          <Sheet open={isMobileBrowseOpen} onOpenChange={onMobileBrowseOpenChange}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={
                  isNicheCategorySelected
                    ? 'bg-accent text-accent-foreground rounded-lg h-9'
                    : 'rounded-lg h-9'
                }
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl p-0" aria-describedby={undefined}>
              <SheetHeader className="px-6 py-4 border-b">
                <SheetTitle className="text-left flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5" /> Browse Topics
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full p-4 pb-20">
                <Accordion type="single" collapsible className="w-full">
                  {Object.keys(categoryTree)
                    .sort()
                    .map((cat) => {
                      const tags = categoryTree[cat];
                      const hasTags = tags && tags.length > 0;
                      const Icon = categoryInfo[cat]?.icon || Hash;

                      if (hasTags) {
                        return (
                          <AccordionItem key={cat} value={cat} className="border-b-0 mb-2">
                            <AccordionTrigger className="hover:no-underline py-3 px-2 rounded-lg hover:bg-muted">
                              <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-semibold text-lg">{capitalize(cat)}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-2 pt-1 pl-4">
                              <div className="flex flex-col gap-2 border-l-2 border-muted pl-4">
                                <button
                                  onClick={() => onFilterUpdate(cat, null)}
                                  className="text-base font-bold text-left py-2 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                  View All {capitalize(cat)} <ChevronRight className="h-3 w-3" />
                                </button>
                                {tags.map((tag) => (
                                  <button
                                    key={tag}
                                    onClick={() => onFilterUpdate(cat, tag)}
                                    className="text-base text-muted-foreground text-left py-2 hover:text-primary transition-colors"
                                  >
                                    {capitalize(tag)}
                                  </button>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }

                      return (
                        <div key={cat} className="border-b-0 mb-2">
                          <button
                            onClick={() => onFilterUpdate(cat, null)}
                            className="flex w-full items-center justify-between py-3 px-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold text-lg">{capitalize(cat)}</span>
                            </div>
                          </button>
                        </div>
                      );
                    })}
                </Accordion>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters Feedback */}
      {(selectedTag || isNicheCategorySelected) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
          {isNicheCategorySelected && (
            <Badge
              variant="secondary"
              className="pl-3 pr-1 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors"
            >
              Category: {selectedCategory}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-2 hover:bg-transparent hover:text-primary"
                onClick={() => onFilterUpdate('All', null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedTag && (
            <Badge
              variant="secondary"
              className="pl-3 pr-1 py-1 text-sm bg-accent text-accent-foreground hover:bg-accent/80 hover:text-accent-foreground transition-colors"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {selectedTag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-2 hover:bg-transparent hover:text-accent-foreground"
                onClick={onClearTag}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground h-auto p-0 ml-2"
            onClick={onClearAll}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

