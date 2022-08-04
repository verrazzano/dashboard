<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import DynamicTabHelper from '@/mixins/verrazzano/dynamic-tab-helper';
import LabeledSelect from '@/components/form/LabeledSelect';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'ReadinessGatesTab',
  components: {
    ArrayListGrouped,
    LabeledSelect,
    TabDeleteButton,
    TreeTab,
  },
  mixins: [VerrazzanoHelper, DynamicTabHelper],
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
    const readinessGates = this.value.map((readinessGate) => {
      const newReadinessGate = this.clone(readinessGate);

      newReadinessGate._id = randomStr(4);

      return newReadinessGate;
    });

    return {
      treeTabName:  this.tabName,
      treeTabLabel: this.tabLabel,
      readinessGates,
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
    update() {
      const readinessGates = [];

      this.readinessGates.forEach((readinessGate) => {
        const newReadinessGate = this.clone(readinessGate);

        delete newReadinessGate._id;
        readinessGates.push(newReadinessGate);
      });
      this.$emit('input', readinessGates);
    },
    addReadinessGate() {
      this.readinessGates.push({ _id: randomStr(4) });
    },
    removeReadinessGate(index) {
      this.readinessGates.splice(index, 1);
      this.queueUpdate();
    },
    updateReadinessGate(readinessGate, conditionType) {
      this.set(readinessGate, 'conditionType', conditionType);
      this.queueUpdate();
    },
    deleteReadinessGates() {
      this.readinessGates.length = 0;
      this.queueUpdate();
    },
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.readinessGates');
    }

    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="t('verrazzano.common.tabs.readinessGates')"
        :mode="mode"
        @click="deleteReadinessGates()"
      />
    </template>
    <template #default>
      <ArrayListGrouped
        :value="readinessGates"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.common.buttons.addReadinessGate')"
        @add="addReadinessGate()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="!isView && readinessGates.length > 0"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeReadinessGate(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #default="props">
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
