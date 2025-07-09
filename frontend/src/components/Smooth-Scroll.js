/**
 * 
 * @param {string} sectionId - 
 * @param {number} headerHeight - 
 */
export const scrollToSection = (sectionId, headerHeight = 80) => {
  if (sectionId === 'top') {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  } else {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    } else {
      console.warn(`Element with ID "${sectionId}" not found`);
    }
  }
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};