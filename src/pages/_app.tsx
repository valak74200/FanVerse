import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ThemeProvider } from 'next-themes'
import '@/styles/animations.css'
import '@/app/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}