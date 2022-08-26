import { createVerrazzanoRoute, rootVerrazzanoRoute } from '../utils/custom-routing';

export function init($plugin: any, store: any) {
  const {
    product,
    basicType,
    virtualType,
  } = $plugin.DSL(store, $plugin.name);

  product({
    ifHaveVerb:          'PUT',
    inStore:             'management',
    icon:                'vzlogo',
    removable:           false,
    showClusterSwitcher: false,
    to:                  rootVerrazzanoRoute(),
    category:            'verrazzano',
  });

  virtualType({
    labelKey:       'verrazzano.apps.label',
    name:           'apps',
    namespaced:     false,
    weight:         98,
    icon:           'folder',
    route:          createVerrazzanoRoute('c-cluster-applications',
      { resource: 'core.oam.dev.applicationconfiguration' }
    )
  });

  virtualType({
    labelKey:       'verrazzano.multiClusterApps.label',
    name:           'mcapps',
    namespaced:     false,
    weight:         99,
    icon:           'folder',
    route:          {
      name:   'verrazzano-c-cluster-mcapps',
      params: { resource: 'clusters.verrazzano.io.MultiClusterApplicationConfiguration' }
    }
  });

  virtualType({
    labelKey:       'verrazzano.components.label',
    name:           'components',
    namespaced:     false,
    weight:         97,
    icon:           'folder',
    route:          {
      name:   'verrazzano-c-cluster-components',
      params: { resource: 'core.oam.dev.component' }
    }
  });

  basicType([
    'apps',
    'mcapps',
    'components'
  ]);

  // configureType(MANAGEMENT.SETTING, {
  //   isCreatable: false,
  //   isRemovable: false,
  //   showAge:     false,
  //   showState:   false,
  //   canYaml:     false,
  // });
  //
  // configureType(MANAGEMENT.FEATURE, {
  //   isCreatable: false,
  //   isRemovable: false,
  //   showAge:     false,
  //   showState:   true,
  //   canYaml:     false,
  // });
  //
  // headers(MANAGEMENT.FEATURE, [
  //   STATE,
  //   NAME_UNLINKED,
  //   FEATURE_DESCRIPTION,
  //   RESTART,
  // ]);
  //
  // hideBulkActions(MANAGEMENT.FEATURE, true);
}
