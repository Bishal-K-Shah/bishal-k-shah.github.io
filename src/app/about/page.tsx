import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Wrench, Terminal, Cpu } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Hobbyist's Hideaway, a sanctuary for makers, tinkers, and tech enthusiasts. Discover our mission to document journeys in tech, mechanics, and electronics.",
  openGraph: {
    title: "About | Hobbyist's Hideaway",
    description: "Learn more about Hobbyist's Hideaway, our mission, and the topics we cover.",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <section className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline text-primary">
          About Hobbyist's Hideaway
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A digital sanctuary for makers, tinkers, and tech enthusiasts.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="prose dark:prose-invert">
          <p className="text-lg leading-relaxed">
            Welcome to <strong>Hobbyist's Hideaway</strong>. This blog was born out of a passion for understanding how things work—whether it's the code powering a server, the mechanics of a vintage engine, or the precise art of soldering a circuit board.
          </p>
          <p className="text-lg leading-relaxed">
            Here, we don't just consume technology; we build it, break it, and fix it. Our mission is to document the journey of learning and to provide clear, practical guides that empower you to take control of your own hardware and software.
          </p>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-muted aspect-video flex items-center justify-center border border-border">
            {/* Placeholder for an about image if desired, using an icon for now */}
            <Wrench className="w-24 h-24 text-muted-foreground/20" />
        </div>
      </div>

      <h2 className="text-3xl font-bold font-headline mb-8 text-center">What We Cover</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Server className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">HomeLab</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Building private clouds, managing NAS storage, and self-hosting services with Docker and Proxmox.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Wrench className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Automobile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              DIY maintenance, classic car restoration, and understanding the mechanics of modern EVs.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Terminal className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Technology</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Linux command line mastery, mechanical keyboards, and software development guides.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Cpu className="w-6 h-6" />
            </div>
            <CardTitle className="text-xl">Electronics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Soldering techniques, repairing vintage computers, and building custom hardware projects.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mt-20 text-center bg-accent/10 rounded-2xl p-8 md:p-12">
        <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Have a project you're working on? Connect with us on social media and share your journey.
        </p>
        <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="px-4 py-1 text-sm">#Homelab</Badge>
            <Badge variant="secondary" className="px-4 py-1 text-sm">#DIY</Badge>
            <Badge variant="secondary" className="px-4 py-1 text-sm">#Maker</Badge>
        </div>
      </section>
    </div>
  );
}
