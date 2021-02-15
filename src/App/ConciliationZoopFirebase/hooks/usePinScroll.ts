import { useState } from 'react'

export const usePinScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const handleScrollPosition = () => {
    /*if (scrollPosition) {
      window.scrollTo(0, scrollPosition);
    }*/
    window.scrollTo(0, document.body.scrollHeight)
  }

  // store position in sessionStorage
  const handleClickScrollPosition = () => {
    setScrollPosition(window.pageYOffset)
  }

  return { handleScrollPosition }
}
export default usePinScroll
