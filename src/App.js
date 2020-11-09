import React, { useState, useLayoutEffect } from 'react'
import MainContent from './MainContent/MainContent'
import Header from './Header/Header'
import Context from './boot/context'

const App = () => {
  function useWindowSize () {
    const [size, setSize] = useState([0, 0])
    useLayoutEffect(() => {
      function updateSize () {
        setSize([window.innerWidth, window.innerHeight])
      }
      window.addEventListener('resize', updateSize)
      updateSize()
      return () => window.removeEventListener('resize', updateSize)
    }, [])
    return size
  }

  const [width, height] = useWindowSize()

  return (
    <Context.Provider value={{ width, height }}>
      <div className='App'>
        <Header />
        <MainContent />
      </div>
    </Context.Provider>
  )
}

export default App
