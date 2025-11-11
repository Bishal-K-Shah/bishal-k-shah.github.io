import { motion } from 'framer-motion'

const Footer = () => {
  const socialLinks = [
    { icon: 'fab fa-github', href: 'https://github.com/bishal-k-shah', title: 'GitHub' },
    { icon: 'fab fa-linkedin', href: 'https://linkedin.com/in/bishal-k-shah', title: 'LinkedIn' },
    { icon: 'fab fa-twitter', href: 'https://twitter.com', title: 'Twitter' },
    { icon: 'fas fa-envelope', href: 'mailto:hello@bishalkshah.com.np', title: 'Email' }
  ]

  return (
    <footer>
      <motion.div 
        className="social-links"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {socialLinks.map((link, index) => (
          <motion.a 
            key={index}
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer"
            title={link.title}
            whileHover={{ 
              translateY: -3,
              color: "var(--gradient-start)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={link.icon}></i>
          </motion.a>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        &copy; 2025 Bishal Shah. All rights reserved.
      </motion.p>
    </footer>
  )
}

export default Footer