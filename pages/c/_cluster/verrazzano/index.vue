<script>
// Added by Verrazzano
export default {
  layout: 'plain',

  middleware({ redirect, route, _store } ) {
    return redirect({
      name:   'c-cluster-verrazzano-mcapps',
      params: {
        ...route.params,
        product:  'verrazzano',
        resource: 'clusters.verrazzano.io.MultiClusterApplicationConfiguration',
      }
    });
  }
};
</script>
