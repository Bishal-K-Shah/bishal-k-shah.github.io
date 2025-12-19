import React from 'react';
import { Post, CATEGORIES, CategoryInfo } from '@/types';
import CodeBlock from '@/components/CodeBlock';
import { categoryInfo } from '@/components/icons';

const posts: Post[] = [
  {
    slug: 'the-revival-of-classic-cars',
    title: 'The Revival of Classic Cars',
    date: '2024-07-15',
    category: 'Automobile',
    featuredImageId: 'classic-car',
    excerpt: 'Exploring the growing trend of restoring and modernizing classic automobiles. What fuels this passion?',
    content: (
      <>
        <p className="lead text-lg text-foreground/80 mb-6">
          In an age of electric vehicles and autonomous driving, a passionate community is looking back, breathing new life into the automotive legends of the past. The classic car revival is more than just a hobby; it's a cultural movement.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Why the Resurgence?</h2>
        <p className="mb-4">
          Several factors contribute to this trend. Nostalgia plays a huge role, with enthusiasts longing for the distinct designs and raw driving experiences of a bygone era. Additionally, classic cars are increasingly seen as tangible assets, an investment you can actually enjoy.
        </p>
        <p className="mb-4">
          The rise of "restomodding" — restoring a classic with modern parts — has also broadened the appeal. Imagine a '69 Mustang with the soul of a classic but the reliability, comfort, and performance of a modern sports car. This blend of old and new is captivating a new generation of car lovers.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Getting Started</h2>
        <p className="mb-4">
          Thinking of starting your own project? Here are some tips:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Start Small:</strong> Don't buy a complete rust bucket for your first project. Find a car that's running and has a solid frame.</li>
          <li><strong>Community is Key:</strong> Join online forums and local clubs. The knowledge and support from fellow enthusiasts are invaluable.</li>
          <li><strong>Budget Wisely:</strong> Restoration costs can spiral. Plan your budget carefully, and then add 30% for unexpected issues.</li>
        </ul>
        <p>
          The journey of a car restoration is as rewarding as the destination. It's a chance to learn, to create, and to preserve a piece of history.
        </p>
      </>
    ),
  },
  {
    slug: 'raspberry-pi-home-server',
    title: 'How to Setup a Raspberry Pi-Based Home Server',
    date: '2024-06-28',
    category: 'HomeLab',
    featuredImageId: 'raspberry-pi',
    excerpt: 'Turn a tiny, affordable Raspberry Pi into a powerful home server for file sharing, media streaming, and more.',
    content: (
      <>
        <p className="lead text-lg text-foreground/80 mb-6">
          A home server can revolutionize how you manage your digital life, and you don't need a bulky, power-hungry machine to do it. The humble Raspberry Pi is more than capable of handling a variety of server duties.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">What You'll Need</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Raspberry Pi 4 or 5 (4GB or more recommended)</li>
          <li>A good quality microSD card (32GB+)</li>
          <li>Power supply and a case with cooling</li>
          <li>An external hard drive for storage</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Install the Operating System</h2>
        <p className="mb-4">
          We'll use Raspberry Pi OS Lite (64-bit) for a lightweight, headless setup. Use the Raspberry Pi Imager to flash the OS to your microSD card. In the advanced settings, be sure to enable SSH, set a hostname, and configure your user account.
        </p>
        <CodeBlock>
          {`# After booting, connect via SSH
ssh your_username@your_hostname.local`}
        </CodeBlock>
        <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Install Docker & Portainer</h2>
        <p className="mb-4">
          Docker makes it incredibly easy to manage services in isolated containers. Portainer provides a nice web UI to manage your Docker environment.
        </p>
        <CodeBlock>
          {`# Install Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker your_username

# Install Portainer
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer \\
    --restart=always \\
    -v /var/run/docker.sock:/var/run/docker.sock \\
    -v portainer_data:/data \\
    portainer/portainer-ce:latest`}
        </CodeBlock>
        <p className="mt-4">
          Now you can access Portainer at <code>https://your_pi_ip:9443</code> and start deploying services like a Samba file share, a Plex media server, or a Pi-hole ad-blocker!
        </p>
      </>
    ),
  },
  {
    slug: '3d-printer-kit-guide',
    title: 'A Comprehensive Guide to 3D Printer Kits for Beginners',
    date: '2024-05-20',
    category: 'Technology',
    featuredImageId: '3d-printer',
    excerpt: 'Want to dive into 3D printing? Building from a kit is a rewarding way to learn the technology inside and out.',
    content: (
      <>
        <p className="lead text-lg text-foreground/80 mb-6">
          The world of 3D printing opens up a universe of creativity, allowing you to turn digital designs into physical objects. For beginners, assembling a printer from a kit is an excellent, hands-on introduction to the technology.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Why Choose a Kit?</h2>
        <p className="mb-4">
          Building a printer yourself provides an intimate understanding of how it works. This knowledge is invaluable when it comes to troubleshooting, upgrading, and getting the most out of your machine. Plus, it's often more affordable than buying a pre-assembled printer.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Top Beginner-Friendly Kits</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Creality Ender 3 V3 SE:</strong> A modern classic. It's affordable, has a huge community, and offers a fantastic balance of features like auto-leveling and a direct-drive extruder.</li>
          <li><strong>Prusa MINI+:</strong> While a bit more expensive, Prusa is renowned for quality, excellent documentation, and reliability. The assembly is straightforward and the results are consistently great.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">The Assembly Process</h2>
        <p className="mb-4">
          Most modern kits are semi-assembled and can be put together in just a few hours. The key is to be patient and methodical.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Follow the instructions carefully. Watch video guides if you get stuck.</li>
          <li>Ensure the frame is perfectly square and all bolts are tight. A wobbly frame is the number one cause of print quality issues.</li>
          <li>Take your time with cable management. A tidy setup is easier to work on later.</li>
        </ol>
        <p>
          Once built, you'll need to calibrate it. This process, known as "dialing in," involves leveling the bed, setting the Z-offset, and tuning your slicer settings. It's a learning curve, but mastering it is the key to perfect prints.
        </p>
      </>
    ),
  },
  {
    slug: 'art-of-soldering-guide',
    title: "The Art of Soldering: A Beginner's Guide",
    date: '2024-04-18',
    category: 'Electronics',
    featuredImageId: 'soldering-iron',
    excerpt: 'Master the fundamental skill of any electronics hobbyist. Learn the tools, techniques, and tips for perfect solder joints every time.',
    content: (
      <>
        <p className="lead text-lg text-foreground/80 mb-6">
          Soldering is the glue that holds the world of electronics together. It's a skill that seems intimidating at first, but with the right tools and a little practice, anyone can learn to make clean, reliable connections.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Essential Tools</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Soldering Iron:</strong> A temperature-controlled iron is a must. A good station like the Hakko FX-888D or a quality smart iron like the Pinecil will serve you well for years.</li>
          <li><strong>Solder:</strong> For electronics, use a lead-free (or 63/37 leaded if you're comfortable with the precautions) rosin-core solder with a diameter of 0.6-0.8mm.</li>
          <li><strong>Tip Cleaner:</strong> A brass sponge is much better for your iron's tip than a wet sponge.</li>
          <li><strong>Flux Pen:</strong> While solder has flux inside, adding extra flux makes everything flow much more smoothly.</li>
          <li><strong>Helping Hands:</strong> A tool with clips to hold your circuit board and components steady.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-8 mb-4">The Technique</h2>
        <p className="mb-4">
          The golden rule of soldering is to <strong>heat the joint, not the solder</strong>.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Make sure your iron tip is clean and tinned (coated with a thin layer of fresh solder).</li>
          <li>Place the iron tip so it touches both the component lead and the pad on the circuit board simultaneously.</li>
          <li>Hold for 1-2 seconds to heat up the joint.</li>
          <li>Introduce the solder to the opposite side of the joint (not the iron tip). It should melt and flow instantly, creating a shiny, volcano-shaped cone.</li>
          <li>Remove the solder first, then the iron. The whole process should take only 3-4 seconds.</li>
        </ol>
        <p>
          Practice on a cheap electronics kit. Learning to solder opens the door to repairing gadgets, building your own circuits, and bringing your electronic inventions to life.
        </p>
      </>
    ),
  },
   {
    slug: 'why-your-next-car-should-be-an-ev',
    title: 'Why Your Next Car Should Be an EV',
    date: '2024-03-22',
    category: 'Automobile',
    featuredImageId: 'modern-ev',
    excerpt: 'Beyond the environmental benefits, electric vehicles offer a superior driving experience and lower running costs. Is it time for you to make the switch?',
    content: (
      <>
        <p className="lead text-lg text-foreground/80 mb-6">
          Electric vehicles (EVs) are no longer a niche product for early adopters. They are rapidly becoming mainstream, and for good reason. If you're in the market for a new car, here's why an EV should be at the top of your list.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Instant Torque, Silent Power</h2>
        <p className="mb-4">
          The driving experience in an EV is fundamentally different—and better. The instant torque from the electric motor provides exhilarating, silent acceleration that even high-performance gasoline cars struggle to match. Merging onto a highway or zipping through city traffic becomes effortless and fun. The lack of engine noise and vibration creates a serene and refined cabin environment.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Lower Running Costs</h2>
        <p className="mb-4">
          Imagine never having to visit a gas station again. Charging an EV at home is significantly cheaper than filling up with gasoline. On average, you can expect to pay one-third to one-quarter of the cost per mile.
        </p>
        <p className="mb-4">
          Maintenance is another huge saving. EVs have far fewer moving parts than internal combustion engine (ICE) vehicles. There are no oil changes, spark plugs, timing belts, or exhaust systems to worry about. The primary maintenance items are tires, brakes (which last longer due to regenerative braking), and cabin air filters.
        </p>
        <h2 className="text-2xl font-bold mt-8 mb-4">Addressing the Concerns</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Range Anxiety:</strong> Modern EVs regularly offer 250-350 miles of range, more than enough for daily driving and most road trips. The public charging infrastructure is also growing exponentially.</li>
          <li><strong>Charging Time:</strong> While slower than a gas pump, home charging overnight handles 95% of your needs. On the road, DC fast chargers can add 150-200 miles of range in just 20-30 minutes.</li>
          <li><strong>Purchase Price:</strong> While upfront costs can be higher, government incentives and long-term savings on fuel and maintenance often make the total cost of ownership lower than a comparable gasoline car.</li>
        </ul>
        <p>
          Making the switch to an EV is a step into the future of transportation. It's a choice that's better for your wallet, the environment, and your driving enjoyment.
        </p>
      </>
    ),
  },
];

export const getPosts = () => {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBySlug = (slug: string) => {
  return posts.find((post) => post.slug === slug);
};

export const getCategories = (): string[] => {
  return CATEGORIES;
};

export const getCategoriesWithIcons = (): CategoryInfo[] => {
  return CATEGORIES.map(name => categoryInfo[name]);
}
