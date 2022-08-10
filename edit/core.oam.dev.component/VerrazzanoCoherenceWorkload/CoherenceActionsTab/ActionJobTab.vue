<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import JobSpecTab from '@/components/verrazzano/JobSpecTab';
import Labels from '@/components/verrazzano/Labels';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'ActionJobTab',
  components: {
    JobSpecTab,
    Labels,
    TreeTab,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
    };
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.coherence.tabs.actions');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #nestedTabs>
      <TreeTab :name="createTabName(treeTabName, 'labels')" :label="t('verrazzano.common.tabs.labelsAndAnnotations')">
        <Labels
          :value="value"
          :mode="mode"
          @input="$emit('input', value)"
        />
      </TreeTab>
      <JobSpecTab
        :value="getField('spec')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'jobSpec')"
        @input="setFieldIfNotEmpty('spec', $event)"
        @delete="setField('spec', undefined)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
