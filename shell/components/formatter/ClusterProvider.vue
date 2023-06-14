<script>
export default {
  props: {
    row: {
      type:     Object,
      required: true
    },
  },
  data(props) {
    return {
      // The isImported getter on the provisioning cluster
      // model doesn't work for imported K3s clusters, in
      // which case it returns 'k3s' instead of 'imported.'
      // This is the workaround.
      // Added by Verrazzano Start
      isImported: props.row.mgmt?.providerForEmberParam === 'import',
      isManaged:  props.row.mgmt?.providerForEmberParam === 'managed'
      // Added by Verrazzano End
    };
  }
};
</script>

<template>
  <div>
    <template v-if="row.machineProvider">
      {{ row.machineProviderDisplay }}
    </template>
    <template v-else-if="row.isCustom">
      {{ t('cluster.provider.custom') }}
    </template>
    <template v-else-if="isImported">
      {{ t('cluster.provider.imported') }}
    </template>
    <!-- Added by Verrazzano Start -->
    <template v-else-if="isManaged">
      {{ t('cluster.provider.managed') }}
    </template>
    <!-- Added by Verrazzano End -->
    <div class="text-muted">
      {{ row.provisionerDisplay }}
    </div>
  </div>
</template>
