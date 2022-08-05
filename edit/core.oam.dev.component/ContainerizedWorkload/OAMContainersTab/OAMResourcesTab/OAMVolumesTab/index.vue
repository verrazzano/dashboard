<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import OAMVolumeTab
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainersTab/OAMResourcesTab/OAMVolumesTab/OAMVolumeTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'OAMVolumesTab',
  components: {
    AddNamedElement,
    OAMVolumeTab,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [ContainerizedWorkloadHelper, DynamicListHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create',
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
  methods: {
    getDynamicListTabName(child) {
      return this.createTabName(this.treeTabName, child?.name);
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.volumes');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.volumes')"
        :mode="mode"
        @click="dynamicListClearChildrenList"
      />
    </template>
    <template #default>
      <AddNamedElement
        :value="dynamicListChildren"
        :mode="mode"
        key-field-name="name"
        :add-type="t('verrazzano.common.tabs.volume')"
        @input="dynamicListAddChild({ name: $event })"
      />
    </template>
    <template #nestedTabs>
      <OAMVolumeTab
        v-for="(volume, idx) in dynamicListChildren"
        :key="volume._id"
        :value="volume"
        :mode="mode"
        :tab-name="createTabName(treeTabName, volume.name)"
        :tab-label="volume.name"
        @input="dynamicListUpdate"
        @delete="dynamicListDeleteChildByIndex(idx)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
