# Portfolio - Bishal K Shah

Modern portfolio website showcasing professional projects, skills, and experience. Built with React, framer motion and Three.js for an interactive experience.

## Features

- Interactive 3D particle background
- Smooth page transitions and animations
- Dark/Light theme toggle with local storage
- Fully responsive design
- Working contact form (Formspree integration)
- Project showcase with category filtering
- Professional timeline
- SEO optimized

## Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Animations**: Framer Motion
- **Styling**: CSS3 with custom properties
- **Form Service**: Formspree
- **Hosting**: GitHub Pages

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The site will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

The production build will be generated in the `dist/` folder.

### Preview Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Skills.jsx
│   ├── Projects.jsx
│   ├── Timeline.jsx
│   ├── Services.jsx
│   ├── Contact.jsx
│   └── Footer.jsx
├── assets/             # Images and icons
│   ├── Icons/
│   └── projects/
├── hooks/              # Custom React hooks
└── App.jsx             # Main app component
```

## Configuration

### Theme Colors

Customize colors in `src/App.css`:

```css
:root {
  --gradient-start: #667eea;
  --gradient-end: #764ba2;
  --bg-primary: #0f0f23;
  --text-primary: #e0e0e0;
}
```

## 🚀 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Time**: <3s on standard connections
- **Accessibility**: WCAG 2.1 compliant

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues

## Contact

For questions or collaborations, reach out through the contact form on the website or via:
- Email: [Email](mailto:hello@bishalkshah.com.np)
- LinkedIn: [LinkedIn](https://linkedin.com/in/bishal-k-shah/)
- GitHub: [GitHub](https://github.com/bishal-k-shah)

---

Built with React, Three.js, and Framer Motion
