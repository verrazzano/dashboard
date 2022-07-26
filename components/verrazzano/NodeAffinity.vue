<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import LabeledSelect from '@/components/form/LabeledSelect';
import NodeSelectorTerm from '@/components/verrazzano/NodeSelectorTerm';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { NODE } from '@/config/types';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'NodeAffinity',
  components: {
    LabeledInput,
    ArrayListGrouped,
    LabeledSelect,
    NodeSelectorTerm,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    // value should be NodeAffinity
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    const {
      preferredDuringSchedulingIgnoredDuringExecution = [],
      requiredDuringSchedulingIgnoredDuringExecution = {}
    } = this.value;
    const { nodeSelectorTerms = [] } = requiredDuringSchedulingIgnoredDuringExecution;
    const allSelectorTerms = [...preferredDuringSchedulingIgnoredDuringExecution, ...nodeSelectorTerms].map((term) => {
      const neu = this.clone(term);

      neu._id = randomStr(4);
      if (term.preference) {
        Object.assign(neu, term.preference);
        delete neu.preference;
      }

      return neu;
    });

    return {
      allSelectorTerms,
      weightedNodeSelectorTerms: preferredDuringSchedulingIgnoredDuringExecution,
      defaultWeight:             1
    };
  },
  computed: {
    hasWeighted() {
      return !!this.weightedNodeSelectorTerms;
    },
    node() {
      return NODE;
    },
    affinityOptions() {
      return [this.t('workload.scheduling.affinity.preferred'), this.t('workload.scheduling.affinity.required')];
    }
  },
  methods: {
    update() {
      this.$nextTick(() => {
        const requiredDuringSchedulingIgnoredDuringExecution = { nodeSelectorTerms: [] };
        const preferredDuringSchedulingIgnoredDuringExecution = [] ;

        this.allSelectorTerms.forEach((term) => {
          if (term.weight) {
            const neuTerm = { ...term };
            const weight = Number(neuTerm.weight);

            delete neuTerm.weight;
            delete neuTerm._id;

            const neu = { weight, preference: neuTerm };

            preferredDuringSchedulingIgnoredDuringExecution.push(neu);
          } else {
            const neu = { ...term };

            delete neu._id;
            requiredDuringSchedulingIgnoredDuringExecution.nodeSelectorTerms.push(neu);
          }
        });

        this.setFieldIfNotEmpty('preferredDuringSchedulingIgnoredDuringExecution', preferredDuringSchedulingIgnoredDuringExecution);
        this.setFieldIfNotEmpty('requiredDuringSchedulingIgnoredDuringExecution', requiredDuringSchedulingIgnoredDuringExecution);
      });
    },
    changePriority(term) {
      if (term.weight) {
        this.$delete(term, 'weight');
      } else {
        this.$set(term, 'weight', 1);
      }
      this.queueUpdate();
    },
    changeWeight() {
      this.queueUpdate();
    },
    priorityDisplay(term) {
      return term.weight ? this.t('workload.scheduling.affinity.preferred') : this.t('workload.scheduling.affinity.required');
    },
    showNodeSelectorRemove() {
      return !this.isView && this.allSelectorTerms.length > 0;
    },
    removeNodeSelectorTerm(index) {
      this.allSelectorTerms.splice(index, 1);
      this.queueUpdate();
    },
    updateNodeSelectorTerm(neu) {
      this.$nextTick(() => {
        const existingRow = this.allSelectorTerms.find(row => row._id === neu._id);

        if (existingRow) {
          Object.assign(existingRow, neu);
        } else {
          this.allSelectorTerms.push(neu);
        }
        this.queueUpdate();
      });
    },
    addNodeSelectorTerm() {
      this.allSelectorTerms.push({ _id: randomStr(4) });
      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <div class="row" @input="update">
    <div class="col span-12">
      <ArrayListGrouped
        v-model="allSelectorTerms"
        class="mt-20"
        :mode="mode"
        :default-add-value="{}"
        :add-label="t('verrazzano.config.buttons.addNodeSelectorTerm')"
        @add="addNodeSelectorTerm()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showNodeSelectorRemove()"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeNodeSelectorTerm(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <div class="row">
            <div class="col span-6">
              <LabeledSelect
                :options="affinityOptions"
                :value="priorityDisplay(props.row.value)"
                :label="t('workload.scheduling.affinity.priority')"
                :mode="mode"
                @input="(changePriority(props.row.value))"
              />
            </div>
            <div v-if="props.row.value.weight" class="col span-6">
              <LabeledInput
                v-model="props.row.value.weight"
                :mode="mode"
                type="Number"
                min="1"
                max="100"
                :label="t('workload.scheduling.affinity.matchExpressions.weight')"
                @input="changeWeight"
              />
            </div>
          </div>
          <NodeSelectorTerm
            v-model="props.row.value"
            :mode="mode"
            class="col span-12 mt-20"
            @input="updateNodeSelectorTerm($event)"
          />
        </template>
      </ArrayListGrouped>
    </div>
  </div>
</template>

<style>
</style>
