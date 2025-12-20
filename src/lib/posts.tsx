import React from 'react';
import { Post, CATEGORIES, CategoryInfo } from '@/types';
import { categoryInfo } from '@/components/icons';

const posts: Post[] = [
  {
    slug: 'the-revival-of-classic-cars',
    title: 'The Revival of Classic Cars',
    date: '2024-07-15',
    category: 'Automobile',
    featuredImageId: 'classic-car',
    excerpt: 'Exploring the growing trend of restoring and modernizing classic automobiles. What fuels this passion?',
    content: `
In an age of electric vehicles and autonomous driving, a passionate community is looking back, breathing new life into the automotive legends of the past. The classic car revival is more than just a hobby; it's a cultural movement.

## Why the Resurgence?

Several factors contribute to this trend. Nostalgia plays a huge role, with enthusiasts longing for the distinct designs and raw driving experiences of a bygone era. Additionally, classic cars are increasingly seen as tangible assets, an investment you can actually enjoy.

The rise of "restomodding" — restoring a classic with modern parts — has also broadened the appeal. Imagine a '69 Mustang with the soul of a classic but the reliability, comfort, and performance of a modern sports car. This blend of old and new is captivating a new generation of car lovers.

## Getting Started

Thinking of starting your own project? Here are some tips:

- **Start Small:** Don't buy a complete rust bucket for your first project. Find a car that's running and has a solid frame.
- **Community is Key:** Join online forums and local clubs. The knowledge and support from fellow enthusiasts are invaluable.
- **Budget Wisely:** Restoration costs can spiral. Plan your budget carefully, and then add 30% for unexpected issues.

The journey of a car restoration is as rewarding as the destination. It's a chance to learn, to create, and to preserve a piece of history.
`,
  },
  {
    slug: 'raspberry-pi-home-server',
    title: 'How to Setup a Raspberry Pi-Based Home Server',
    date: '2024-06-28',
    category: 'HomeLab',
    featuredImageId: 'raspberry-pi',
    excerpt: 'Turn a tiny, affordable Raspberry Pi into a powerful home server for file sharing, media streaming, and more.',
    content: `
A home server can revolutionize how you manage your digital life, and you don't need a bulky, power-hungry machine to do it. The humble Raspberry Pi is more than capable of handling a variety of server duties.

## What You'll Need

- Raspberry Pi 4 or 5 (4GB or more recommended)
- A good quality microSD card (32GB+)
- Power supply and a case with cooling
- An external hard drive for storage

## Step 1: Install the Operating System

We'll use Raspberry Pi OS Lite (64-bit) for a lightweight, headless setup. Use the Raspberry Pi Imager to flash the OS to your microSD card. In the advanced settings, be sure to enable SSH, set a hostname, and configure your user account.

\`\`\`bash
# After booting, connect via SSH
ssh your_username@your_hostname.local
\`\`\`

## Step 2: Install Docker & Portainer

Docker makes it incredibly easy to manage services in isolated containers. Portainer provides a nice web UI to manage your Docker environment.

\`\`\`bash
# Install Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker your_username

# Install Portainer
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 --name portainer \\
    --restart=always \\
    -v /var/run/docker.sock:/var/run/docker.sock \\
    -v portainer_data:/data \\
    portainer/portainer-ce:latest
\`\`\`

Now you can access Portainer at \`https://your_pi_ip:9443\` and start deploying services like a Samba file share, a Plex media server, or a Pi-hole ad-blocker!
`,
  },
  {
    slug: '3d-printer-kit-guide',
    title: 'A Comprehensive Guide to 3D Printer Kits for Beginners',
    date: '2024-05-20',
    category: 'Technology',
    featuredImageId: '3d-printer',
    excerpt: 'Want to dive into 3D printing? Building from a kit is a rewarding way to learn the technology inside and out.',
    content: `
The world of 3D printing opens up a universe of creativity, allowing you to turn digital designs into physical objects. For beginners, assembling a printer from a kit is an excellent, hands-on introduction to the technology.

## Why Choose a Kit?

Building a printer yourself provides an intimate understanding of how it works. This knowledge is invaluable when it comes to troubleshooting, upgrading, and getting the most out of your machine. Plus, it's often more affordable than buying a pre-assembled printer.

## Top Beginner-Friendly Kits

- **Creality Ender 3 V3 SE:** A modern classic. It's affordable, has a huge community, and offers a fantastic balance of features like auto-leveling and a direct-drive extruder.
- **Prusa MINI+:** While a bit more expensive, Prusa is renowned for quality, excellent documentation, and reliability. The assembly is straightforward and the results are consistently great.

## The Assembly Process

Most modern kits are semi-assembled and can be put together in just a few hours. The key is to be patient and methodical.

1.  Follow the instructions carefully. Watch video guides if you get stuck.
2.  Ensure the frame is perfectly square and all bolts are tight. A wobbly frame is the number one cause of print quality issues.
3.  Take your time with cable management. A tidy setup is easier to work on later.

Once built, you'll need to calibrate it. This process, known as "dialing in," involves leveling the bed, setting the Z-offset, and tuning your slicer settings. It's a learning curve, but mastering it is the key to perfect prints.
`,
  },
  {
    slug: 'art-of-soldering-guide',
    title: "The Art of Soldering: A Beginner's Guide",
    date: '2024-04-18',
    category: 'Electronics',
    featuredImageId: 'soldering-iron',
    excerpt: 'Master the fundamental skill of any electronics hobbyist. Learn the tools, techniques, and tips for perfect solder joints every time.',
    content: `
Soldering is the glue that holds the world of electronics together. It's a skill that seems intimidating at first, but with the right tools and a little practice, anyone can learn to make clean, reliable connections.

## Essential Tools

- **Soldering Iron:** A temperature-controlled iron is a must. A good station like the Hakko FX-888D or a quality smart iron like the Pinecil will serve you well for years.
- **Solder:** For electronics, use a lead-free (or 63/37 leaded if you're comfortable with the precautions) rosin-core solder with a diameter of 0.6-0.8mm.
- **Tip Cleaner:** A brass sponge is much better for your iron's tip than a wet sponge.
- **Flux Pen:** While solder has flux inside, adding extra flux makes everything flow much more smoothly.
- **Helping Hands:** A tool with clips to hold your circuit board and components steady.

## The Technique

The golden rule of soldering is to **heat the joint, not the solder**.

1.  Make sure your iron tip is clean and tinned (coated with a thin layer of fresh solder).
2.  Place the iron tip so it touches both the component lead and the pad on the circuit board simultaneously.
3.  Hold for 1-2 seconds to heat up the joint.
4.  Introduce the solder to the opposite side of the joint (not the iron tip). It should melt and flow instantly, creating a shiny, volcano-shaped cone.
5.  Remove the solder first, then the iron. The whole process should take only 3-4 seconds.

Practice on a cheap electronics kit. Learning to solder opens the door to repairing gadgets, building your own circuits, and bringing your electronic inventions to life.
`,
  },
   {
    slug: 'why-your-next-car-should-be-an-ev',
    title: 'Why Your Next Car Should Be an EV',
    date: '2024-03-22',
    category: 'Automobile',
    featuredImageId: 'modern-ev',
    excerpt: 'Beyond the environmental benefits, electric vehicles offer a superior driving experience and lower running costs. Is it time for you to make the switch?',
    content: `
Electric vehicles (EVs) are no longer a niche product for early adopters. They are rapidly becoming mainstream, and for good reason. If you're in the market for a new car, here's why an EV should be at the top of your list.

## Instant Torque, Silent Power

The driving experience in an EV is fundamentally different—and better. The instant torque from the electric motor provides exhilarating, silent acceleration that even high-performance gasoline cars struggle to match. Merging onto a highway or zipping through city traffic becomes effortless and fun. The lack of engine noise and vibration creates a serene and refined cabin environment.

## Lower Running Costs

Imagine never having to visit a gas station again. Charging an EV at home is significantly cheaper than filling up with gasoline. On average, you can expect to pay one-third to one-quarter of the cost per mile.

Maintenance is another huge saving. EVs have far fewer moving parts than internal combustion engine (ICE) vehicles. There are no oil changes, spark plugs, timing belts, or exhaust systems to worry about. The primary maintenance items are tires, brakes (which last longer due to regenerative braking), and cabin air filters.

## Addressing the Concerns

- **Range Anxiety:** Modern EVs regularly offer 250-350 miles of range, more than enough for daily driving and most road trips. The public charging infrastructure is also growing exponentially.
- **Charging Time:** While slower than a gas pump, home charging overnight handles 95% of your needs. On the road, DC fast chargers can add 150-200 miles of range in just 20-30 minutes.
- **Purchase Price:** While upfront costs can be higher, government incentives and long-term savings on fuel and maintenance often make the total cost of ownership lower than a comparable gasoline car.

Making the switch to an EV is a step into the future of transportation. It's a choice that's better for your wallet, the environment, and your driving enjoyment.
`,
  },
  {
    slug: 'building-your-first-nas',
    title: 'Building Your First NAS: A Homelab Essential',
    date: '2024-07-18',
    category: 'HomeLab',
    featuredImageId: 'nas-setup',
    excerpt: 'Take control of your data by building a Network Attached Storage (NAS). We explore hardware choices and the best software options like TrueNAS and Unraid.',
    content: `
A Network Attached Storage (NAS) is the heart of any good homelab. It's a central repository for your files, backups, and media, accessible from any device on your network. Building your own is a rewarding project that offers more power and flexibility than off-the-shelf solutions.

## Hardware Considerations

You don't need a supercomputer. For a basic file and media server, consider:

- **Chassis:** A case with plenty of hard drive bays is crucial. The Fractal Design Node 304 or Node 804 are popular choices.
- **CPU/Motherboard:** A modern Intel Core i3 or AMD Ryzen 3 is more than enough. Look for a motherboard with plenty of SATA ports.
- **RAM:** 8GB is a good start, but 16GB is better, especially if you plan to use ZFS. Use ECC RAM for added data integrity if your platform supports it.
- **Hard Drives:** Start with at least two drives for redundancy. NAS-specific drives like WD Red or Seagate IronWolf are designed for 24/7 operation.

## Software: TrueNAS vs. Unraid

The two main contenders for home NAS operating systems are TrueNAS and Unraid.

**TrueNAS CORE/SCALE:** It's free, open-source, and built on the rock-solid ZFS filesystem. ZFS provides excellent data protection features like checksums, snapshots, and RAID-Z. However, expanding a ZFS pool can be less flexible than other solutions.

**Unraid:** It's a paid product but offers incredible flexibility. You can mix and match hard drives of different sizes and add new drives to your array one at a time. It also has excellent Docker and VM support through its user-friendly web interface.

Whichever you choose, a NAS will become an indispensable part of your digital life, safeguarding your data and serving your media needs.
`,
  },
  {
    slug: 'essential-linux-cli-commands',
    title: '10 Essential Linux Commands Every User Should Know',
    date: '2024-07-12',
    category: 'Technology',
    featuredImageId: 'linux-terminal',
    excerpt: 'Unlock the power of the Linux command line. These 10 commands are the foundation for efficient system navigation and management.',
    content: `
The command-line interface (CLI) is one of Linux's most powerful features. While it may seem daunting, mastering a few basic commands will dramatically improve your workflow. Here are 10 commands every Linux user should burn into their memory.

## The Essentials

1.  **\`ls\`** - List directory contents. Use \`ls -la\` to see a detailed, long-form listing of all files, including hidden ones.
2.  **\`cd\`** - Change directory. \`cd ~\` takes you to your home directory, \`cd ..\` goes up one level.
3.  **\`pwd\`** - Print working directory. Shows you exactly where you are in the filesystem.
4.  **\`mv\`** - Move or rename a file. \`mv oldname.txt newname.txt\` renames, while \`mv file.txt /path/to/other/dir/\` moves it.
5.  **\`cp\`** - Copy a file or directory. Use \`cp -r source_directory/ destination_directory/\` to copy directories recursively.
6.  **\`rm\`** - Remove files or directories. Be careful! Use \`rm -i\` for an interactive prompt before deleting. \`rm -rf directory/\` will forcefully remove a directory and its contents without asking.
7.  **\`grep\`** - Search for patterns in text. Example: \`grep "error" /var/log/syslog\` finds all lines containing "error" in the system log.
8.  **\`find\`** - Search for files and directories. \`find . -name "*.log"\` finds all files ending in .log in the current directory and subdirectories.
9.  **\`chmod\`** - Change file permissions. \`chmod +x script.sh\` makes a script executable.
10. **\`sudo\`** - Execute a command as the superuser (root). The key to performing administrative tasks.

Practice these commands, and you'll be well on your way to becoming a command-line pro.
`,
  },
  {
    slug: 'diy-oil-change-guide',
    title: 'DIY Basics: How to Perform an Oil Change',
    date: '2024-07-05',
    category: 'Automobile',
    featuredImageId: 'engine-bay',
    excerpt: 'Save money and get to know your car better. Our step-by-step guide to changing your own engine oil.',
    content: `
Changing your own oil is a fundamental rite of passage for any aspiring hobbyist mechanic. It's a simple, cost-effective task that helps you connect with your vehicle.

## Tools and Materials

- The correct type and amount of new engine oil (check your owner's manual).
- A new oil filter.
- A wrench to fit the drain plug.
- An oil filter wrench.
- A drain pan.
- Jack and jack stands for safety.
- Gloves and paper towels.

## Step-by-Step Guide

1.  **Warm Up the Engine:** Run the car for a few minutes to warm the oil, which helps it drain more easily.
2.  **Lift the Vehicle:** Safely lift the front of the car with a jack and secure it on jack stands. NEVER work under a car supported only by a jack.
3.  **Drain the Old Oil:** Place the drain pan under the oil pan's drain plug. Loosen the plug with a wrench and then finish removing it by hand. Let the oil drain completely.
4.  **Replace the Filter:** Locate the old oil filter. Use the filter wrench to loosen it, then unscrew it by hand. Be ready for some oil to spill. Before installing the new filter, apply a thin coat of new oil to the rubber gasket. Screw the new filter on hand-tight, then give it another quarter-turn with the wrench.
5.  **Refill with New Oil:** Reinstall the drain plug. Open the oil filler cap in the engine bay and pour in the new oil, using a funnel to avoid spills. Check the dipstick periodically to avoid overfilling.
6.  **Check Your Work:** Start the engine and let it run for a minute. Check for leaks around the drain plug and filter. Turn off the engine, wait a few minutes, and check the dipstick one last time, topping up if necessary.

Congratulations! You've just performed one of the most essential pieces of vehicle maintenance. Be sure to dispose of your old oil and filter responsibly at an auto parts store or recycling center.
`,
  },
  {
    slug: 'proxmox-vs-esxi-homelab',
    title: 'Proxmox vs. ESXi: Choosing a Hypervisor for Your Homelab',
    date: '2024-06-21',
    category: 'HomeLab',
    featuredImageId: 'server-rack',
    excerpt: 'The foundation of a virtualized homelab is the hypervisor. We compare the two titans: Proxmox and VMware ESXi.',
    content: `
When you want to run multiple operating systems on a single physical machine, you need a Type-1 hypervisor. For homelabbers, the choice usually boils down to two excellent options: Proxmox VE and VMware ESXi.

## Proxmox Virtual Environment (VE)

Proxmox is a completely free and open-source platform based on Debian Linux. It's beloved in the homelab community for its powerful features and lack of licensing restrictions.

- **Pros:** No cost, feature-rich web interface, supports both KVM-based VMs and LXC containers, built-in backup and clustering features, ZFS support out-of-the-box.
- **Cons:** Can have a steeper learning curve for beginners, community support model (paid support is optional).

## VMware ESXi

ESXi is the industry standard in enterprise virtualization. While many of its advanced features require expensive licenses, VMware offers a free tier that is more than adequate for most homelabs.

- **Pros:** Extremely stable and reliable, polished and mature interface, huge amount of enterprise documentation and knowledge available, broad hardware compatibility.
- **Cons:** The free license has limitations (e.g., max 8 vCPUs per VM), advanced features are locked behind a paywall, no easy built-in container solution like Proxmox.

## Which One is for You?

If you want a completely free, unrestricted, and highly customizable platform and are willing to learn, **Proxmox** is an unbeatable choice. It's the quintessential homelabber's tool.

If you are looking to learn skills for a career in IT, or if you prefer a more "it just works" experience and can live with the free-tier limitations, **ESXi** is a fantastic and professional-grade option.
`,
  },
  {
    slug: 'mechanical-keyboard-hobby',
    title: 'Down the Rabbit Hole: An Introduction to Mechanical Keyboards',
    date: '2024-06-14',
    category: 'Technology',
    featuredImageId: 'custom-keyboard',
    excerpt: 'The click, the clack, and the satisfying thock. Discover the world of custom mechanical keyboards and why it\'s such an addictive hobby.',
    content: `
What if the keyboard you type on every day could be a personalized work of art, perfectly tuned to your preferences? Welcome to the obsessive, wonderful world of custom mechanical keyboards.

## More Than Just a Keyboard

Unlike the mushy membrane keyboards most people are used to, mechanical keyboards use individual physical switches under each key. This provides superior tactile and auditory feedback, durability, and an endless potential for customization.

## The Holy Trinity: Switches, Keycaps, and Case

- **Switches:** The heart of the keyboard. They determine the feel and sound. They come in three main types: **Linear** (smooth), **Tactile** (with a bump), and **Clicky** (with a bump and an audible click). Popular brands include Cherry, Gateron, and Kailh.
- **Keycaps:** The plastic caps you press. They come in various profiles (shapes), materials (ABS or PBT plastic), and countless colorways. This is where you can truly express your personality.
- **Case & Plate:** The enclosure for the keyboard. Materials like aluminum, polycarbonate, and acrylic all affect the sound and feel of the keyboard, a concept known as "sound signature".

## Getting Started

The easiest way to start is with a "hot-swappable" keyboard. These boards have sockets that allow you to change switches easily without any soldering. A great entry-level hot-swap board is the Keychron V-series or the Glorious GMMK Pro.

From there, you can experiment with different switches, try out new keycaps, and even perform mods like lubricating switches or adding foam to the case to change the sound. It's a deep and rewarding hobby that makes the everyday act of typing a joy.
`,
  },
  {
    slug: 'self-hosting-with-docker',
    title: 'The Power of Self-Hosting with Docker',
    date: '2024-06-07',
    category: 'HomeLab',
    featuredImageId: 'docker-whale',
    excerpt: 'Learn how Docker containers can simplify deploying and managing applications on your home server, from media servers to cloud storage.',
    content: `
Self-hosting is about reclaiming control over your data and services. And the single most important tool for the modern self-hoster is Docker. It has revolutionized how we deploy and manage applications in a homelab.

## What is Docker?

Imagine you want to run a web application. Traditionally, you'd have to install a web server, a database, the application's language runtime, and all its dependencies directly onto your operating system. This can get messy and lead to conflicts.

Docker solves this by packaging an application and all its dependencies into a single, isolated unit called a "container." This container can run on any system that has Docker installed, regardless of the underlying OS. It's like a lightweight, portable virtual machine.

## Docker Compose: Your Best Friend

While you can manage containers one by one, the real power comes from Docker Compose. It's a tool that uses a simple YAML file to define and run multi-container applications.

Here is an example \`docker-compose.yml\` for running a Ghost blog:

\`\`\`yaml
version: '3.8'
services:
  ghost:
    image: ghost:latest
    restart: always
    ports:
      - "2368:2368"
    volumes:
      - ./ghost_content:/var/lib/ghost/content
    environment:
      url: http://localhost:2368
\`\`\`

With this file, a single command—\`docker-compose up -d\`—is all it takes to download the Ghost image and start the service. Updating is as simple as \`docker-compose pull\` and \`docker-compose up -d\`. This declarative approach makes managing even complex applications a breeze.

## Awesome Self-Hosted Apps to Try

- **Plex/Jellyfin:** Your personal Netflix.
- **Nextcloud:** Your personal Google Drive/Photos.
- **Pi-hole:** Network-wide ad blocking.
- **Home Assistant:** The ultimate smart home hub.
- **Vaultwarden:** A self-hosted Bitwarden password manager.
`,
  },
  {
    slug: 'diy-welding-for-mechanics',
    title: 'Introduction to Welding for the Hobbyist Mechanic',
    date: '2024-05-31',
    category: 'Automobile',
    featuredImageId: 'welding',
    excerpt: 'Take your fabrication and repair skills to the next level. A guide to choosing your first welder and learning the basics of MIG welding.',
    content: `
For a hobbyist mechanic, learning to weld is a superpower. It's the key to repairing rusty panels, fabricating custom brackets, and building exhaust systems. While it takes practice, the barrier to entry has never been lower.

## Choosing Your First Welder: MIG is King

For automotive work, a MIG (Metal Inert Gas) welder is the most versatile and easiest to learn. MIG welding uses a wire-feed gun that continuously feeds a consumable electrode wire, while shielding the weld pool with a gas.

Look for a 110V/120V machine from a reputable brand like Hobart, Lincoln, or Miller. These can handle most sheet metal and light fabrication tasks. You'll also need a gas bottle (usually a 75% Argon / 25% CO2 mix), a welding helmet, and gloves.

## The Four Pillars of a Good Weld

1.  **Cleanliness:** Your metal must be spotless. Grind away any paint, rust, or oil. Clean metal is the foundation of a strong weld.
2.  **Amperage (Wire Speed):** This is your "heat." Too cold, and the weld won't penetrate. Too hot, and you'll blow holes in the metal. Your welder will have a chart to give you starting points.
3.  **Stick-Out:** This is the length of wire protruding from the gun's tip. Aim for about 3/8 of an inch.
4.  **Travel Speed:** Move the gun at a steady pace. You should hear a consistent "crackling bacon" sound. If it's popping, you're too fast. If it's a loud hum, you're too slow.

Practice on scrap metal. Laying a bead on a flat plate, then moving to T-joints and butt joints. Welding is a skill built on muscle memory. Don't be discouraged by your first ugly welds—everyone starts there.
`,
  },
  {
    slug: 'restoring-retro-computers',
    title: 'Retro-Computing: Bringing Vintage Tech Back to Life',
    date: '2024-05-17',
    category: 'Electronics',
    featuredImageId: 'retro-computer',
    excerpt: 'The joy of vintage computers is undeniable. Learn about the common issues in restoring old tech, from capacitor plagues to yellowed plastic.',
    content: `
In a world of disposable technology, there's a growing movement to preserve and restore the computers of our youth. The hobby of retro-computing is part history, part engineering, and all nostalgia.

## The First Hurdle: Powering On

Before you even think of plugging in that 30-year-old computer, STOP. The most common point of failure in old electronics are the electrolytic capacitors. Over time, they dry out, leak, and fail, often taking other components with them.

"Recapping"—the process of replacing all the electrolytic capacitors on a motherboard and power supply—is the most important first step. It's a soldering-intensive job, but it's crucial for the long-term health of your machine.

## Common Restoration Tasks

- **Retr0brighting:** Old ABS plastic often turns a sickly yellow due to UV exposure. Retr0brighting is the process of using a hydrogen peroxide solution and UV light to reverse this chemical reaction and restore the original color.
- **Drive Repairs:** Floppy drives and old hard drives often suffer from dried-out grease and failing rubber belts. Disassembly, cleaning, and re-lubrication can often bring them back to life.
- **Battery Replacement:** Many old computers used a battery to maintain settings, and these are almost always dead and often leaking acid that destroys the motherboard. Removing and neutralizing the leakage is a top priority.

Restoring a vintage computer like a Commodore 64, an Apple II, or an old 486 PC is a journey back in time. The satisfaction of hearing that boot-up chime and seeing that command prompt is a unique and wonderful feeling.
`,
  },
  {
    slug: 'motorcycle-chain-maintenance',
    title: 'Motorcycle Maintenance: The Art of Chain Care',
    date: '2024-05-10',
    category: 'Automobile',
    featuredImageId: 'motorcycle-repair',
    excerpt: 'A clean, well-lubricated chain is crucial for a safe and smooth ride. Learn the simple steps to properly maintain your motorcycle\'s chain.',
    content: `
Your motorcycle's chain is its final drive, transferring all the engine's power to the rear wheel. Neglecting it is a recipe for poor performance, premature wear, and even danger. Proper chain maintenance is a quick and easy job that every rider should know.

## Clean, Lube, and Adjust

Chain maintenance comes down to three simple steps, ideally performed every 500 miles or so.

### 1. Cleaning

A dirty chain wears out faster. Use a dedicated chain cleaning fluid and a three-sided grunge brush. Put the bike on a rear stand, spray the cleaner onto the chain while rotating the rear wheel, and scrub all four sides. Wipe it dry with a rag.

### 2. Lubricating

Lubrication is best done when the chain is warm after a ride. Use a quality chain lube, not WD-40. As you rotate the rear wheel, spray the lube onto the inside of the chain, aiming for the O-rings or X-rings on the side plates. A little goes a long way; excess lube just flings off and makes a mess. Let it sit for a while to allow the carrier solvents to evaporate.

### 3. Adjusting

Your chain needs a specific amount of slack to account for suspension movement. Too tight, and it will strain your drivetrain. Too loose, and it could skip or come off. Check your owner's manual for the correct slack measurement (usually 1-1.5 inches).

To adjust, loosen the rear axle nut. Use the adjuster bolts on the swingarm to move the wheel back, making small, equal turns on each side. Check the alignment marks to ensure the wheel is straight. Once the slack is correct, tighten the axle nut to the specified torque.
`,
  },
  {
    slug: 'home-network-cabling-guide',
    title: 'Running Ethernet: A Hobbyist’s Guide to Cabling Your Home',
    date: '2024-05-03',
    category: 'HomeLab',
    featuredImageId: 'network-cables',
    excerpt: 'Wi-Fi is convenient, but nothing beats the speed and reliability of a wired connection. Learn the basics of running Ethernet cables throughout your house.',
    content: `
Wi-Fi is convenient, but for any serious homelab user, gamer, or media streamer, a wired network is non-negotiable. While running cables through your walls seems like a professional's job, it's a very manageable DIY project with the right tools and planning.

## Planning Your Runs

Before you drill a single hole, plan everything. Decide where you want your network drops. A central location, like a closet or basement, is the perfect spot for your "network hub" where your modem, router, and switch will live. This is where all your cable runs will terminate.

## Tools & Materials

- **Bulk Ethernet Cable:** Cat6 or Cat6a is the standard. Solid copper is a must for in-wall runs. Avoid "CCA" (Copper Clad Aluminum).
- **Keystone Jacks and Wall Plates:** These provide a clean, professional finish for your network drops.
- **Patch Panel:** This is where you'll terminate the cables at your network hub. It keeps everything organized.
- **Punch-Down Tool:** For connecting the wires to keystone jacks and the patch panel.
- **Fish Tape or Glow Rods:** Essential for pulling cables through walls and ceilings.

## The Process

1.  **Hub Setup:** Mount your patch panel in your chosen hub location.
2.  **Cutting Holes:** At each drop location, use a low-voltage mounting bracket as a template to cut a hole in the drywall.
3.  **Running the Cable:** This is the hardest part. Use fish tape to pull cables from the hub to each drop location. Go through the basement or attic whenever possible. Avoid running parallel to electrical wires to prevent interference.
4.  **Termination:** At the wall plate, strip the cable jacket, untwist the pairs, and use the punch-down tool to connect the wires to the keystone jack (follow the T568B color code). Do the same at the patch panel.
5.  **Testing:** Use a simple Ethernet cable tester to confirm all your connections are good before you plug in your expensive equipment.

Running your own cable is a game-changer, providing rock-solid connectivity for your entire home.
`,
  },
  {
    slug: 'common-vw-problems-guide',
    title: 'Das Auto, Das Headache? The 5 Most Common VW Gremlins',
    date: '2025-12-20',
    category: 'Automobile',
    featuredImageId: 'vw-check-engine-light',
    excerpt: 'From the infamous eternal check engine light to windows that have a mind of their own. Here is a survival guide to the most common Volkswagen quirks and failures.',
    content: `
## The Love-Hate Relationship

Volkswagen owners are a special breed. We love the solid "thunk" of the door, the precise German engineering, and the autobahn-tuned stability. But let’s be honest: owning a VW often feels like being in a relationship with someone who is incredibly fun but high-maintenance.

If you drive a Golf, Jetta, Passat, or Beetle, you’ve likely encountered a few "quirks" that are less "Das Auto" and more "Das Disaster." Here are the most notorious problems that plague the people’s car.

## 1. The "Check Engine" Light: Your New Co-Pilot

In the VW community, the Check Engine Light (CEL) isn't a warning system; it's a mood lamp. It’s widely joked that if your VW’s CEL turns off, you should pull over immediately because the bulb probably burned out.

**The Reality:**
While often triggered by minor emissions sensitivities (like a loose gas cap), the frequent illumination is usually due to:
*   **Ignition Coils:** A classic weak point. If your engine starts stuttering or misfiring, it’s likely a coil pack has packed it in.
*   **O2 Sensors:** These sensors fail with frustrating regularity, sending false data to the ECU and tanking your fuel economy.

## 2. Electrical Gremlins

German wiring is complex, precise, and apparently, biodegradable. Many VW owners report electrical issues that seem to defy logic.

*   **Possessed Windows:** The power window regulators are made with plastic clips that become brittle and snap. The result? Your window falls into the door frame and refuses to come back up—usually when it starts raining.
*   **Door Locks:** The microswitches inside the door lock modules are prone to failure. This leads to the car not knowing the door is open, which can cause the alarm to go off randomly or the interior lights to stay dark.

## 3. The DSG Transmission "Jerks"

The Direct-Shift Gearbox (DSG) is a marvel of engineering—when it works. It shifts faster than any human ever could. However, earlier models and neglected units are known for the "False Neutral" or the "Mechatronic Failure."

**Symptoms to Watch For:**
*   Jerky shifting at low speeds (the "kangaroo" effect).
*   A delay in engagement when shifting from Park to Drive.
*   **The Fix:** This is rarely cheap. It often involves replacing the **Mechatronic unit** (the brain of the transmission) or, minimally, performing a strict fluid flush every 40,000 miles.

## 4. The Water Pump Woes

On many TSI and TFSI engines, the water pump is the Achilles' heel. Unlike most cars where the pump is purely metal, VW often uses plastic impellers or housings.

Over time, heat cycles cause this plastic to crack or the impeller to separate from the shaft. The result is a sudden spike in engine temperature and a puddle of pink coolant on your driveway. If you are doing a timing belt job, *always* replace the water pump with a unit that has a metal impeller if available.

## 5. Oil Thirst and Carbon Buildup

Direct Injection (DI) is great for power and efficiency, but it comes with a cost. Because fuel is sprayed directly into the cylinder, it doesn't wash over the intake valves to clean them.

*   **Carbon Buildup:** Over time, sticky carbon deposits cake onto the intake valves, essentially choking the engine. You’ll feel a loss of power and rough idling. The only fix is a manual "walnut blast" cleaning.
*   **Oil Consumption:** Many 2.0T owners report their cars drinking oil like it’s Oktoberfest. Keeping a quart of synthetic 5W-40 in the trunk isn't just a precaution; it's a necessity.

## Verdict: Is It Worth It?

Despite the plastic water pumps and the moody electronics, we keep buying them. Why? Because when a VW is running right, the driving experience punches well above its weight class. Just make sure you have a good mechanic on speed dial—and maybe invest in an OBDII scanner.
`,
},
{
  slug: 'mastering-obsidian-second-brain',
  title: 'Stop Taking Notes, Start Building a Brain: Why Obsidian is the Endgame',
  date: '2025-08-14',
  category: 'Technology',
  featuredImageId: 'obsidian-graph-view',
  excerpt: 'Most note-taking apps are digital dumpsters. Obsidian is different. Discover how to turn your scattered thoughts into a connected web of knowledge using local Markdown and the power of backlinking.',
  content: `
## The Digital Dumpster Fire

We have all been there. You have a folder in Apple Notes called "Ideas." You have a Trello board from three years ago. You have seventeen "Untitled" Google Docs. You are capturing information, but you aren't *keeping* it. It goes in, and it never comes out.

Enter **Obsidian**. It isn’t just a note-taking app; it is an IDE for your thoughts. It promises something bold: to help you build a "Second Brain" that lasts forever. Here is why this purple crystal is taking over the productivity world.

## 1. It's Just Text (And That's Powerful)

The biggest trap in software is **Vendor Lock-in**. If Notion shuts down tomorrow, getting your data out is a nightmare.

Obsidian is different. It sits on top of a local folder on your computer. Every note is just a simple **Markdown (.md)** file. You can open them in Notepad, VS Code, or IA Writer. You own your data, not a cloud server. If Obsidian disappears in 2030, your knowledge base is still perfectly readable.

## 2. The Neural Network: Linking Your Thoughts

Most apps organize notes in folders. This is archaic. Does your brain put "Grandma's Birthday" in a folder structure? No, it associates it with "Cake," "November," and "Family."

Obsidian uses **Bidirectional Linking**. By simply typing \`[[Concept]]\`, you create a link to another note.
*   **The Magic:** When you open the "Concept" note, you can see every other note that referenced it (Backlinks).
*   **The Result:** You stop losing ideas. You start seeing connections between books you read, projects you are working on, and random shower thoughts.

## 3. The Graph View

This is the feature that gets everyone hooked. Obsidian generates a visual graph of your notes.
*   **Dots** are notes.
*   **Lines** are links.

At first, it looks like a constellation. After a few months, it looks like a galaxy. It is incredibly satisfying to watch your knowledge grow physically. It allows you to spot clusters of information you didn't realize were related—like noticing that your notes on *Architecture* overlap heavily with your notes on *User Interface Design*.

## 4. The Infinite Canvas

Introduced recently, the **Canvas** feature turns Obsidian into a spatial thinking tool. It’s like an infinite whiteboard where you can drag and drop your existing notes, PDFs, images, and web pages.

It is the ultimate tool for:
*   Plotting novels.
*   Mapping out complex software architecture.
*   Visualizing D&D campaigns.

## 5. Community Plugins: The Rabbit Hole

Obsidian out of the box is fast and minimal. But the community plugin store is where things get wild.
*   **Dataview:** Turn your notes into a database you can query like SQL.
*   **Excalidraw:** Draw diagrams directly inside your text files.
*   **Kanban:** Manage projects without leaving the app.

## The Learning Curve

Obsidian doesn't hold your hand. When you first open it, it's a blank black screen. It can be intimidating. But that blankness is a feature, not a bug. It demands that you design a system that works for *you*, rather than forcing you into a pre-made workflow.

Start simple. Make a daily note. Link it to a project. Watch the graph grow.
`,
}
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
