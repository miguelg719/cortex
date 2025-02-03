'use client'
import { RedocStandalone } from 'redoc'
import { useEffect, useState } from 'react'

export default function ApiDocs() {
  const [spec, setSpec] = useState(null)

  useEffect(() => {
    fetch('/api/openapi.json')
      .then(res => res.json())
      .then(data => setSpec(data))
  }, [])

  if (!spec) return <div>Loading...</div>

  return (
    <RedocStandalone
      spec={spec}
      options={{
        theme: {
          colors: {
            primary: {
              main: '#000000',
            },
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
          },
        },
        hideDownloadButton: true,
        disableSearch: false,
      }}
    />
  )
}
