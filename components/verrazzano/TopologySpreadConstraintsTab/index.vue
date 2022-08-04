<script>
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TopologySpreadConstraint from '@/components/verrazzano/TopologySpreadConstraintsTab/TopologySpreadConstraint';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'TopologySpreadConstraintsTab',
  components: {
    AddNamedElement,
    TabDeleteButton,
    TopologySpreadConstraint,
    TreeTab,
  },
  mixins: [VerrazzanoHelper],
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
    const topologySpreadConstraints = this.value.map((topologySpreadConstraint) => {
      const newTopologySpreadConstraint = this.clone(topologySpreadConstraint);

      newTopologySpreadConstraint._id = randomStr(4);
    });

    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
      topologySpreadConstraints,
    };
  },
  methods: {
    update() {
      const topologySpreadConstraints = [];

      this.topologySpreadConstraints.forEach((topologySpreadConstraint) => {
        const newTopologySpreadConstraint = this.clone(topologySpreadConstraint);

        delete newTopologySpreadConstraint._id;

        topologySpreadConstraints.push(newTopologySpreadConstraint);
      });

      this.$emit('input', topologySpreadConstraints);
    },
    addTopologySpreadConstraint(topologyKey) {
      this.topologySpreadConstraints.push({ _id: randomStr(4), topologyKey });
      this.queueUpdate();
    },
    removeTopologySpreadConstraint(index) {
      this.topologySpreadConstraints.splice(index, 1);
      this.queueUpdate();
    },
    deleteTopologySpreadConstraints() {
      this.topologySpreadConstraints.length = 0;
      this.queueUpdate();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.topologySpreadConstraints');
    }

    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        element-name="t('verrazzano.common.tabs.topologySpreadConstraints')"
        :mode="mode"
        @click="deleteTopologySpreadConstraints()"
      />
    </template>
    <template #default>
      <AddNamedElement
        key-field-name="topologyKey"
        :mode="mode"
        :add-type="t('verrazzano.common.tab.topologySpreadConstraint')"
        :field-label="t('verrazzano.common.fields.topologyKey')"
        @input="addTopologySpreadConstraint($event)"
      />
    </template>
    <template #nestedTabs>
      <TreeTab
        v-for="(topologySpreadConstraint, idx) in topologySpreadConstraints"
        :key="topologySpreadConstraint._id"
        :name="createTabKey(treeTabName, topologySpreadConstraint.topologyKey)"
        :label="topologySpreadConstraint.topologyKey"
      >
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tab.topologySpreadConstraint')"
            :mode="mode"
            @input="removeTopologySpreadConstraint(idx)"
          />
        </template>
        <template #default>
          <TopologySpreadConstraint
            :value="topologySpreadConstraint"
            :mode="mode"
            @input="queueUpdate()"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
