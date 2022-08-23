// Added by Verrazzano
import { DSL } from '@/store/type-map';
import { MANAGEMENT } from '@/config/types';
import {
  STATE,
  FEATURE_DESCRIPTION,
  RESTART,
  NAME_UNLINKED,
} from '@/config/table-headers';

export const NAME = 'verrazzano';

export function init(store) {
  const {
    product,
    basicType,
    configureType,
    virtualType,
    headers,
    hideBulkActions,
  } = DSL(store, NAME);

  product({
    ifHaveVerb:          'PUT',
    inStore:             'management',
    icon:                'vzlogo',
    removable:           false,
    showClusterSwitcher: false,
    category:            'verrazzano',
  });

  virtualType({
    labelKey:       'verrazzano.apps.label',
    name:           'apps',
    namespaced:     false,
    weight:         98,
    icon:           'folder',
    route:          {
      name:   'c-cluster-verrazzano-applications',
      params: { resource: 'core.oam.dev.applicationconfiguration' }
    }
  });

  virtualType({
    labelKey:       'verrazzano.multiClusterApps.label',
    name:           'mcapps',
    namespaced:     false,
    weight:         99,
    icon:           'folder',
    route:          {
      name:   'c-cluster-verrazzano-mcapps',
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
      name:   'c-cluster-verrazzano-components',
      params: { resource: 'core.oam.dev.component' }
    }
  });

  basicType([
    'apps',
    'mcapps',
    'components'
  ]);

  configureType(MANAGEMENT.SETTING, {
    isCreatable: false,
    isRemovable: false,
    showAge:     false,
    showState:   false,
    canYaml:     false,
  });

  configureType(MANAGEMENT.FEATURE, {
    isCreatable: false,
    isRemovable: false,
    showAge:     false,
    showState:   true,
    canYaml:     false,
  });

  headers(MANAGEMENT.FEATURE, [
    STATE,
    NAME_UNLINKED,
    FEATURE_DESCRIPTION,
    RESTART,
  ]);

  hideBulkActions(MANAGEMENT.FEATURE, true);
}
