<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TopologySpreadConstraint from '@/components/verrazzano/TopologySpreadConstraintsTab/TopologySpreadConstraint';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'TopologySpreadConstraintsTab',
  components: {
    AddNamedElement,
    TabDeleteButton,
    TopologySpreadConstraint,
    TreeTab,
  },
  mixins: [VerrazzanoHelper, DynamicListHelper],
  props:  {
    value: {
      type:    Array,
      default: () => ([])
    },
    mode: {
      type:    String,
      default: 'create'
    },
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    }
  },
  data() {
    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
    };
  },
  methods: {
    getDynamicListTabName(child) {
      return this.createTabName(this.treeTabName, child?.topologyKey);
    },
    addTopologySpreadConstraint(topologyKey) {
      this.dynamicListAddChild({ topologyKey });
    },
    removeTopologySpreadConstraint(index) {
      this.dynamicListDeleteChildByIndex(index);
    },
    deleteTopologySpreadConstraints() {
      this.dynamicListClearChildrenList();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.topologySpreadConstraints');
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
        @click="deleteTopologySpreadConstraints()"
      />
    </template>
    <template #default>
      <AddNamedElement
        :value="dynamicListChildren"
        :mode="mode"
        key-field-name="topologyKey"
        :add-type="t('verrazzano.common.tabs.topologySpreadConstraint')"
        :field-label="t('verrazzano.common.fields.topologyKey')"
        @input="addTopologySpreadConstraint($event)"
      />
    </template>
    <template #nestedTabs>
      <TreeTab
        v-for="(topologySpreadConstraint, idx) in dynamicListChildren"
        :key="topologySpreadConstraint._id"
        :name="createTabName(treeTabName, topologySpreadConstraint.topologyKey)"
        :label="topologySpreadConstraint.topologyKey"
      >
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.topologySpreadConstraint')"
            :mode="mode"
            @click="removeTopologySpreadConstraint(idx)"
          />
        </template>
        <template #default>
          <TopologySpreadConstraint
            :value="topologySpreadConstraint"
            :mode="mode"
            @input="dynamicListUpdate()"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
