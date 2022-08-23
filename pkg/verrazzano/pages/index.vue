<script>
// Added by Verrazzano

export default {
  name:   'VerrazzanoLanding',
  layout: 'plain',

  middleware({ redirect, route, store }) {
    const cluster = store.getters['currentCluster']?.id || 'local';

    return redirect({
      name:   'verrazzano-c-cluster-mcapps',
      params: {
        ...route.params,
        product:  'verrazzano',
        resource: 'clusters.verrazzano.io.MultiClusterApplicationConfiguration',
        cluster
      }
    });
  }
};
</script>
