// Added by Verrazzano Start
// import { LEGACY } from '@shell/store/features';
// Added by Verrazzano End
import { DSL } from '@shell/store/type-map';

export const NAME = 'mcapps';

export function init(store) {
  const {
    // Added by Verrazzano Start
    // product,
    // Added by Verrazzano End
    basicType,
    virtualType,
  } = DSL(store, NAME);

  // Added by Verrazzano Start
  // product({
  //   icon:                  'marketplace',
  //   category:              'legacy',
  //   inStore:               'management',
  //   ifFeature:             LEGACY,
  //   removable:             false,
  //   showClusterSwitcher:   false,
  //   showWorkspaceSwitcher: false,
  // });
  // Added by Verrazzano End

  virtualType({
    labelKey:   'legacy.catalogs',
    name:       'mc-catalogs',
    group:      'Root',
    namespaced: false,
    weight:     111,
    icon:       'folder',
    route:      { name: 'c-cluster-mcapps-pages-page', params: { cluster: 'local', page: 'catalogs' } },
    exact:      true
  });

  virtualType({
    labelKey:   'legacy.globalDnsEntries',
    name:       'global-dns-entries',
    group:      'Root',
    namespaced: false,
    weight:     110,
    icon:       'folder',
    route:      { name: 'c-cluster-mcapps-pages-page', params: { cluster: 'local', page: 'global-dns-entries' } },
    exact:      true
  });

  virtualType({
    labelKey:   'legacy.globalDnsProviders',
    name:       'global-dns-providers',
    group:      'Root',
    namespaced: false,
    weight:     109,
    icon:       'folder',
    route:      { name: 'c-cluster-mcapps-pages-page', params: { cluster: 'local', page: 'global-dns-providers' } },
    exact:      true
  });

  basicType([
    'mc-catalogs',
    'global-dns-entries',
    'global-dns-providers',
  ]);
}
