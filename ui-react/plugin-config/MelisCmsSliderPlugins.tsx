// Full-React config for the MelisCmsSlider plugin. Source lives in melis-cms-slider (this module),
// imported into melis-cms's SPA build and registered into the shared tab registry (PluginFormKit).
import { registerPluginTab, type PluginTabContext, TemplateField, RemoteSelectField } from '../../../melis-cms/ui-react/src/PluginFormKit'
import { peLang } from '../../../melis-cms/ui-react/src/page-editor-i18n'

const L = ({
  fr: {
    tabProperties: 'Propriétés',
    templateHint: 'Gabarit de rendu du slider.',
    slider: 'Slider',
    sliderHint: 'Le slider à afficher.',
  },
  en: {
    tabProperties: 'Properties',
    templateHint: 'Render template of the slider.',
    slider: 'Slider',
    sliderHint: 'The slider to display.',
  },
} as const)[peLang()]

/* ── Show slider ── template + slider ────────────────────────────────────── */
function ShowSliderProps({ ctx }: { ctx: PluginTabContext }) {
  return (<div>
    <TemplateField ctx={ctx} hint={L.templateHint} />
    <RemoteSelectField ctx={ctx} name="sliderId" label={L.slider} hint={L.sliderHint} />
  </div>)
}

/** Register the MelisCmsSlider plugin's native config tab(s). Called from melis-cms's PluginForms registry. */
export function registerMelisCmsSliderPlugins(): void {
  registerPluginTab('MelisCmsSliderShowSliderPlugin', { id: 'properties', title: L.tabProperties, icon: 'fa fa-cog', order: 0, Component: ShowSliderProps })
}
