<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import ContainerTab from '@/components/verrazzano/ContainersTab/ContainerTab';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainersTab',
  components: {
    AddNamedElement,
    ContainerTab,
    TreeTab,
  },
  mixins: [VerrazzanoHelper, DynamicListHelper],
  props:  {
    value: {
      // parent object (e.g., pod spec)
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'containers'
    },
    useEphemeralContainers: {
      type:    Boolean,
      default: false
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
    typeLabel: {
      type:    String,
      default: ''
    },
  },
  methods: {
    getDynamicListRootFieldName() {
      return this.rootFieldName;
    },
    getDynamicListTabName(child) {
      return this.createTabName(this.tabName, child.name);
    },
  },
  computed: {
    treeTabLabel() {
      return this.tabLabel ? this.tabLabel : this.t('verrazzano.common.tabs.containers');
    },
    containerTypeLabel() {
      return this.typeLabel ? this.typeLabel : this.t('verrazzano.common.tabs.container');
    }
  },
};
</script>

<template>
  <TreeTab :name="tabName" :label="treeTabLabel">
    <template #default>
      <AddNamedElement
        :value="dynamicListChildren"
        :add-type="containerTypeLabel"
        key-field-name="name"
        :mode="mode"
        name-prefix="container"
        @input="dynamicListAddChild({ name: $event })"
      />
    </template>
    <template #nestedTabs>
      <ContainerTab
        v-for="container in dynamicListChildren"
        :key="container._id"
        :value="container"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-label="container.name"
        :tab-name="getDynamicListTabName(container)"
        :type-label="containerTypeLabel"
        @input="dynamicListUpdate"
        @delete="dynamicListDeleteChild($event)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
