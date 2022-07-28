<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import ContainerPort from '@/components/verrazzano/ContainersTab/ContainerPortsTab/ContainerPort';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerPortsTab',
  components: {
    ArrayListGrouped,
    ContainerPort,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // parent object (e.g., container spec)
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: 'create'
    },
    tabName: {
      type:    String,
      default: ''
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    // eslint-disable-next-line no-console
    console.log('ZZZZZZZ ContainerPortsTab got value: ', JSON.stringify(this.value, null, 2));

    return {
      treeTabName:  this.tabName || 'ports',
      treeTabLabel: this.tabLabel,
    };
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.ports');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <ArrayListGrouped
      v-model="value.ports"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.common.buttons.addPort')"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('ports')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeProps.remove"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <ContainerPort
          v-model="props.row.value"
          :mode="mode"
        />
      </template>
    </ArrayListGrouped>
  </TreeTab>
</template>

<style scoped>

</style>
