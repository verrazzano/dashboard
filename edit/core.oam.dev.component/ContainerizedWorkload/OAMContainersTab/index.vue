<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import OAMContainerTab from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainersTab/OAMContainerTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';

export default {
  name:       'OAMContainersTab',
  components: {
    AddNamedElement,
    OAMContainerTab,
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
  methods: {
    getDynamicListTabName(child) {
      return this.createTabName(this.treeTabName, child?.name);
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.containers');
    }
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.containers')"
        :mode="mode"
        @click="dynamicListClearChildrenList"
      />
    </template>
    <template #default>
      <AddNamedElement
        :value="dynamicListChildren"
        :mode="mode"
        key-field-name="name"
        :add-type="t('verrazzano.common.tabs.container')"
        @input="dynamicListAddChild({ name: $event })"
      />
    </template>
    <template #nestedTabs>
      <OAMContainerTab
        v-for="(container, idx) in dynamicListChildren"
        :key="container._id"
        :value="container"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, container.name)"
        :tab-label="container.name"
        @delete="dynamicListDeleteChildByIndex(idx)"
        @input="dynamicListUpdate()"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
