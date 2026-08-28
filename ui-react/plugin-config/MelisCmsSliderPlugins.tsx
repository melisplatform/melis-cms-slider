// Full-React config for the MelisCmsSlider plugin. Source lives in melis-cms-slider (this module),
// imported into melis-cms's SPA build and registered into the shared tab registry (PluginFormKit).
import { registerPluginTab, type PluginTabContext, TemplateField, RemoteSelectField } from '../../../melis-cms/ui-react/src/PluginFormKit'

/* ── Show slider ── template + slider ────────────────────────────────────── */
function ShowSliderProps({ ctx }: { ctx: PluginTabContext }) {
  return (<div>
    <TemplateField ctx={ctx} hint="Gabarit de rendu du slider." />
    <RemoteSelectField ctx={ctx} name="sliderId" label="Slider" hint="Le slider à afficher." />
  </div>)
}

/** Register the MelisCmsSlider plugin's native config tab(s). Called from melis-cms's PluginForms registry. */
export function registerMelisCmsSliderPlugins(): void {
  registerPluginTab('MelisCmsSliderShowSliderPlugin', { id: 'properties', title: 'Propriétés', icon: 'fa fa-cog', order: 0, Component: ShowSliderProps })
}
