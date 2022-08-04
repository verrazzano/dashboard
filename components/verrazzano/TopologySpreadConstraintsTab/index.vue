<script>
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
    addTopologySpreadConstraint(topologyKey) {
      this.dynamicListAddChild({ topologyKey });
    },
    removeTopologySpreadConstraint(index) {
      // eslint-disable-next-line no-console
      console.log(`XXXXXX removeTopologySpreadConstraint(${ index })`);
      this.dynamicListDeleteChildByIndex(index);
      // eslint-disable-next-line no-console
      console.log('XXXXXX removeTopologySpreadConstraint after deleting child by index: ', JSON.stringify(this.dynamicListChildren));
    },
    deleteTopologySpreadConstraints() {
      // eslint-disable-next-line no-console
      console.log('XXXXXX deleteTopologySpreadConstraints before deleting children: ', JSON.stringify(this.dynamicListChildren));
      this.dynamicListClearChildrenList();
      // eslint-disable-next-line no-console
      console.log('XXXXXX deleteTopologySpreadConstraints after deleting children: ', JSON.stringify(this.dynamicListChildren));
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
        :element-name="t('verrazzano.common.tabs.topologySpreadConstraints')"
        :mode="mode"
        @click="deleteTopologySpreadConstraints()"
      />
    </template>
    <template #default>
      <AddNamedElement
        key-field-name="topologyKey"
        :mode="mode"
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
