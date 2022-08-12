<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import DynamicTabHelper from '@/mixins/verrazzano/dynamic-tab-helper';
import LabeledSelect from '@/components/form/LabeledSelect';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ReadinessGatesTab',
  components: {
    ArrayListGrouped,
    LabeledSelect,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [VerrazzanoHelper, DynamicTabHelper, DynamicListHelper],
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
  computed: {
    conditionTypeOptions() {
      return [
        { value: 'ContainersReady', label: this.t('verrazzano.common.types.conditionType.containersReady') },
        { value: 'Initialized', label: this.t('verrazzano.common.types.conditionType.initialized') },
        { value: 'PodScheduled', label: this.t('verrazzano.common.types.conditionType.podScheduled') },
        { value: 'Ready', label: this.t('verrazzano.common.types.conditionType.ready') },
      ];
    }
  },
  methods: {
    addReadinessGate() {
      this.dynamicListAddChild();
    },
    removeReadinessGate(index) {
      this.dynamicListDeleteChildByIndex(index);
    },
    updateReadinessGate(readinessGate, conditionType) {
      this.set(readinessGate, 'conditionType', conditionType);
      this.queueUpdate();
    },
    deleteReadinessGates() {
      this.dynamicListClearChildrenList();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.readinessGates');
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
        @click="deleteReadinessGates()"
      />
    </template>
    <template #default>
      <ArrayListGrouped
        :value="dynamicListChildren"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.common.buttons.addReadinessGate')"
        @add="addReadinessGate()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="!isView && dynamicListChildren.length > 0"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeReadinessGate(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #default="props">
          <div class="spacer-small" />
          <LabeledSelect
            :value="getDynamicTabField(props.row.value, 'conditionType')"
            :mode="mode"
            required
            :options="conditionTypeOptions"
            option-key="value"
            option-label="label"
            :placeholder="getNotSetPlaceholder(props.row.value, 'conditionType')"
            :label="t('verrazzano.common.fields.conditionType')"
            @input="updateReadinessGate(props.row.value, $event)"
          />
        </template>
      </ArrayListGrouped>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
