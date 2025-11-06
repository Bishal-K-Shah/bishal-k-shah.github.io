import { useDocumentHead } from '../hooks/useDocumentHead'
import ogImage from '../assets/og-image.png'

const SEOHead = ({ 
  title = "Bishal Shah - Full Stack Developer & Network Engineer", 
  description = "Full Stack Developer specializing in React, WordPress, and modern web technologies. Building scalable web applications and CMS solutions for businesses across Australia.",
  keywords = "Bishal Shah, Full Stack Developer, WordPress Developer, React Developer, Web Development, CMS Development, PHP, JavaScript, Node.js, Australian Motorcyclist, Adventure Rider Magazine, Walkabout Australia, Newtwork Security, Cloud Computing, Docker, AWS",
  image = `https://bishal-k-shah.github.io${ogImage}`,
  url = "https://bishal-k-shah.github.io/"
}) => {
  useDocumentHead({
    title,
    description,
    keywords,
    image,
    url,
    author: "Bishal Shah",
    robots: "noindex, nofollow",
    language: "en",
    revisitAfter: "7 days",
    type: "website",
    siteName: "Bishal Shah Portfolio",
    locale: "en_US"
  })

  return null
}

export default SEOHead