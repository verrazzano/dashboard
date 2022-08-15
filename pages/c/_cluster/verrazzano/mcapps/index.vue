<script>
// Added by Verrazzano
import ResourceList from '@/components/ResourceList';

export default {
  name:       'MultiClusterAppsResourceList',
  components: { ResourceList },
  created() {
    this.$route.params['resource'] = 'clusters.verrazzano.io.MultiClusterApplicationConfiguration';
  }
};
</script>

<template>
  <ResourceList />
</template>
