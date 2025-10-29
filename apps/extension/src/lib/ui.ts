export const isSidePanel = window.location.pathname.includes('sidepanel.html')

export const sliceWord = (word: string, visibleFrontLetters = 5, visibleLastLetters = 5) => {
  if (word && word.length <= visibleFrontLetters + visibleLastLetters) return word
  return (
    word?.slice(0, visibleFrontLetters) +
    '...' +
    word?.slice(word.length - visibleLastLetters, word.length)
  )
}
