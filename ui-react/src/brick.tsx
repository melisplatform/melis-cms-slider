import SliderPage from './SliderPage'

declare global {
  interface Window {
    __melisRegisterBrick?: (b: { id: string; Component: unknown }) => void
  }
}

// id MUST match public/ui-react/brick.manifest.json
window.__melisRegisterBrick?.({ id: 'slider', Component: SliderPage })
