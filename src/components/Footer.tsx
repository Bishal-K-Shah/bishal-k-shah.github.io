import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Rss, Send, Sparkles, Heart } from "lucide-react";
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Logo Column - Desktop only */}
          <div className="hidden lg:block lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Hobbyist's Hideaway Logo"
                width={120}
                height={120}
                className="h-32 w-32 object-contain"
              />
            </Link>
          </div>
          
          {/* Newsletter Signup - First on mobile for prominence */}
          <div className="order-1 lg:order-3 lg:col-span-4 bg-gradient-to-br from-primary/5 to-primary/10 p-5 sm:p-6 rounded-2xl border border-primary/20">
            <h4 className="font-semibold text-foreground flex items-center gap-2 text-base">
               <Sparkles className="h-5 w-5 text-primary" />
               Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mt-2">Get the latest posts delivered to your inbox.</p>
            <form className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-background h-11 sm:h-10" 
              />
              <Button type="submit" variant="default" className="h-11 sm:h-10 px-5 w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>

          {/* About Section */}
          <div className="order-2 lg:order-1 lg:col-span-4 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 group mb-3">
              <span className="text-xl font-bold font-headline tracking-tight text-foreground">
                Hobbyist's Hideaway
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto lg:mx-0">
              Exploring tech, code, and mechanical wonders. Your go-to resource for DIY projects and tutorials.
            </p>
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-5">
              {socialLinks.map((link) => (
                <Link key={link.name} href={link.href} passHref>
                  <Button variant="outline" size="icon" className="h-11 w-11 sm:h-9 sm:w-9 rounded-full">
                    <link.icon className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="sr-only">{link.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>


          {/* Links Section */}
          <div className="order-3 lg:order-2 lg:col-span-2 text-center lg:text-left">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-xs">Navigation</h4>
            <ul className="mt-4 flex flex-row justify-center lg:justify-start lg:flex-col gap-6 lg:gap-0 lg:space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
 
            <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
