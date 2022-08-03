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
    getRootFieldName() {
      return this.rootFieldName;
    },
    getChildNavKey(child) {
      return this.createTabKey(this.tabName, child.name);
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
        :value="children"
        :add-type="containerTypeLabel"
        key-field-name="name"
        :mode="mode"
        name-prefix="container"
        @input="addChild({ name: $event })"
      />
    </template>
    <template #nestedTabs>
      <ContainerTab
        v-for="container in children"
        :key="container._id"
        :value="container"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-label="container.name"
        :tab-name="getChildNavKey(container)"
        :type-label="containerTypeLabel"
        @input="queueUpdate"
        @delete="deleteChild($event)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
