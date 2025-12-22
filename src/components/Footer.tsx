import Link from "next/link";
import { Github, Linkedin, Rss, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "RSS Feed", href: "/rss.xml", icon: Rss },
  ];

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/" },
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* About & Logo Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <span className="text-xl font-bold font-headline tracking-tight text-foreground">
                Hobbyist's Hideaway
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Exploring tech, code, and mechanical wonders. Your go-to resource for DIY projects and tutorials.
            </p>
             <div className="flex items-center space-x-3 mt-6">
              {socialLinks.map((link) => (
                <Link key={link.name} href={link.href} passHref>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="lg:col-span-2"></div>

          {/* Links Section */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-sm">Navigation</h4>
            <ul className="mt-4 space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div className="lg:col-span-4 bg-background/50 p-6 rounded-2xl border">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-primary" />
               Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mt-2">Get the latest posts delivered to your inbox.</p>
            <form className="mt-4 flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background" 
              />
              <Button type="submit" variant="default" className="px-4">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>

        </div>
      </div>
      <div className="border-t bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Hobbyist's Hideaway. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
