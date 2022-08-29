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

// global, not scoped
<style lang='scss'>
  .icon-vzlogo:before {
    background-image: url('../assets/images/verrazzano-logo.svg');
    background-position: center;
    background-repeat: no-repeat;
    color: transparent;
    content: "\ea2a";
  }
</style>
