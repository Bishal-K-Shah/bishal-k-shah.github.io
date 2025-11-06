import { useEffect } from 'react'

/**
 * Custom hook for managing document head metadata
 * Compatible with React 19 and replaces react-helmet-async
 */
export const useDocumentHead = (metadata) => {
  useEffect(() => {
    const originalTitle = document.title
    const addedElements = []

    if (metadata.title) {
      document.title = metadata.title
    }

    const addMetaTag = (name, content, property = null) => {
      if (!content) return

      // Check if meta tag already exists
      const existingTag = property 
        ? document.querySelector(`meta[property="${property}"]`)
        : document.querySelector(`meta[name="${name}"]`)

      if (existingTag) {
        existingTag.setAttribute('content', content)
        return
      }

      // Create new meta tag
      const metaTag = document.createElement('meta')
      if (property) {
        metaTag.setAttribute('property', property)
      } else {
        metaTag.setAttribute('name', name)
      }
      metaTag.setAttribute('content', content)
      
      document.head.appendChild(metaTag)
      addedElements.push(metaTag)
    }

    // Add basic meta tags
    addMetaTag('description', metadata.description)
    addMetaTag('keywords', metadata.keywords)
    addMetaTag('author', metadata.author)
    addMetaTag('robots', metadata.robots)
    addMetaTag('language', metadata.language)
    addMetaTag('revisit-after', metadata.revisitAfter)

    // Add Open Graph meta tags
    addMetaTag(null, metadata.title, 'og:title')
    addMetaTag(null, metadata.description, 'og:description')
    addMetaTag(null, metadata.image, 'og:image')
    addMetaTag(null, metadata.url, 'og:url')
    addMetaTag(null, metadata.type || 'website', 'og:type')
    addMetaTag(null, metadata.siteName, 'og:site_name')
    addMetaTag(null, metadata.locale, 'og:locale')

    // Cleanup function
    return () => {
      document.title = originalTitle
      addedElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
    }
  }, [metadata])
}

export default useDocumentHead