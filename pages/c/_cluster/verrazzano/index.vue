<script>
// Added by Verrazzano
export default {
  layout: 'plain',

  middleware({ redirect, route, _store } ) {
    return redirect({
      name:   'c-cluster-verrazzano-applications',
      params: {
        ...route.params,
        product:  'verrazzano',
        resource: 'core.oam.dev.applicationconfiguration',
      }
    });
  }
};
</script>
