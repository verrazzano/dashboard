<script>
// Added by Verrazzano
import ObjectMetadataTab from '@/components/verrazzano/ObjectMetadataTab';
import PodSpecTab from '@/components/verrazzano/PodSpecTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'PodTemplateTab',
  components: {
    ObjectMetadataTab,
    PodSpecTab,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
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
      required: true,
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
      this.treeTabLabel = this.t('verrazzano.common.tabs.podTemplate');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="treeTabLabel"
        :mode="mode"
        @click="$emit('delete', value)"
      />
    </template>
    <template #nestedTabs>
      <ObjectMetadataTab
        :value="getField('metadata')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'metadata')"
        @input="setFieldIfNotEmpty('metadata', $event)"
        @delete="setField('metadata', undefined)"
      />
      <PodSpecTab
        :value="getField('spec')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'spec')"
        @input="setFieldIfNotEmpty('spec', $event)"
        @delete="setField('spec', undefined)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
