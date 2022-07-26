<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import CoherenceAction
  from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceActions/CoherenceAction';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';

import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'CoherenceActions',
  components: {
    ArrayListGrouped,
    CoherenceAction,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    // parent object (e.g., VerrazzanoCoherenceWorkload)
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  data() {
    const actions = (this.value.actions || []).map((action) => {
      const newAction = this.clone(action);

      newAction._id = randomStr(4);

      return newAction;
    });

    return { actions };
  },
  methods: {
    update() {
      const actions = [];

      this.actions.forEach((action) => {
        const newAction = this.clone(action);

        delete newAction._id;

        actions.push(newAction);
      });

      this.setFieldIfNotEmpty('actions', actions);
    },
    addAction() {
      this.actions.push({ _id: randomStr(4) });
    },
    removeAction(index) {
      this.actions.splice(index, 1);

      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <div>
    <ArrayListGrouped
      v-model="actions"
      :mode="mode"
      :default-add-value="{ }"
      :add-label="t('verrazzano.coherence.buttons.addAction')"
      @add="addAction()"
    >
      <template #remove-button="removeProps">
        <button
          v-if="showListRemoveButton('nodeSelectorTerms')"
          type="button"
          class="btn role-link close btn-sm"
          @click="removeAction(removeProps.i)"
        >
          <i class="icon icon-2x icon-x" />
        </button>
        <span v-else />
      </template>
      <template #default="props">
        <CoherenceAction
          v-model="props.row.value"
          :mode="mode"
          :namespaced-object="namespacedObject"
        />
      </template>
    </ArrayListGrouped>
  </div>
</template>

<style scoped>

</style>
