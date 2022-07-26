<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import TopologySpreadConstraint from '@/components/verrazzano/TopologySpreadConstraints/TopologySpreadConstraint';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'TopologySpreadConstraints',
  components: {
    ArrayListGrouped,
    TopologySpreadConstraint,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    // parent object (e.g., pod spec)
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    rootFieldName: {
      type:    String,
      default: 'topologySpreadConstraints'
    },
    addButtonLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    const topologySpreadConstraints = (this.value[this.rootFieldName] || []).map((constraint) => {
      const newConstraint = this.clone(constraint);

      newConstraint._id = randomStr(4);

      return newConstraint;
    });

    return {
      addButtonLabelText: this.addButtonLabel,
      topologySpreadConstraints
    };
  },
  methods: {
    update() {
      const topologySpreadConstraints = [];

      this.topologySpreadConstraints.forEach((constraint) => {
        const newConstraint = this.clone(constraint);

        delete newConstraint._id;

        topologySpreadConstraints.push(newConstraint);
      });

      this.setFieldIfNotEmpty(this.rootFieldName, topologySpreadConstraints);
    },
    addConstraint() {
      this.topologySpreadConstraints.push({ _id: randomStr(4) });
    },
    removeConstraint(index) {
      this.topologySpreadConstraints.splice(index, 1);

      this.queueUpdate();
    }
  },
  created() {
    if (!this.addButtonLabelText) {
      this.addButtonLabelText = this.t('verrazzano.common.buttons.addTopologySpreadConstraints');
    }

    this.queueUpdate = debounce(this.update, 500);
  }
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="value[rootFieldName]"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="addButtonLabelText"
      @add="addConstraint()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton(rootFieldName)"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeConstraint(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <TopologySpreadConstraint
          v-model="props.row.value"
          :mode="mode"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
