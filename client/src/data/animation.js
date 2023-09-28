// for modal backdrop motionframer
export const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

export const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0
  },
  visible: {
    y: '25%',
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500
    }
  }
};
