import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[50],
      main: blue[700]
    }
  },
  typography: {
    fontFamily: ['"Roboto"'].join(',')
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
