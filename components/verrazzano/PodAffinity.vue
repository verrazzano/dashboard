<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import PodAffinityTerm from '@/components/verrazzano/PodAffinityTerm';
import RadioGroup from '@/components/form/RadioGroup';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { POD, NODE, NAMESPACE } from '@/config/types';
import { randomStr } from '@/utils/string';
import { sortBy } from '@/utils/sort';
import debounce from 'lodash/debounce';

export default {
  name:       'PodAffinity',
  components: {
    ArrayListGrouped,
    LabeledInput,
    LabeledSelect,
    PodAffinityTerm,
    RadioGroup,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    // affinity object
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    }
  },
  data() {
    const { podAffinity = {}, podAntiAffinity = {} } = this.value;
    const allAffinityTerms = [...(podAffinity.preferredDuringSchedulingIgnoredDuringExecution || []), ...(podAffinity.requiredDuringSchedulingIgnoredDuringExecution || [])].map((term) => {
      const out = this.clone(term);

      out._id = randomStr(4);
      out._anti = false;
      if (term.podAffinityTerm) {
        Object.assign(out, term.podAffinityTerm);
        delete out.podAffinityTerm;
      }

      return out;
    });
    const allAntiTerms = [...(podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution || []), ...(podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution || [])].map((term) => {
      const out = this.clone(term);

      out._id = randomStr(4);
      out._anti = true;
      if (term.podAffinityTerm) {
        Object.assign(out, term.podAffinityTerm);
        delete out.podAffinityTerm;
      }

      return out;
    });

    const allSelectorTerms = [...allAffinityTerms, ...allAntiTerms];

    return {
      allSelectorTerms,
      defaultWeight: 1
    };
  },
  computed: {
    pod() {
      return POD;
    },
    node() {
      return NODE;
    },
    allNamespaces() {
      const inStore = this.$store.getters['currentStore'](NAMESPACE);
      const choices = this.$store.getters[`${ inStore }/all`](NAMESPACE);
      const out = sortBy(choices.map((obj) => {
        return {
          label: obj.nameDisplay,
          value: obj.id,
        };
      }), 'label');

      return out;
    },
    showSelectorTermRemove() {
      return !this.isView && this.allSelectorTerms.length > 0;
    }
  },
  methods: {
    update() {
      const podAffinity = { requiredDuringSchedulingIgnoredDuringExecution: [], preferredDuringSchedulingIgnoredDuringExecution: [] };
      const podAntiAffinity = { requiredDuringSchedulingIgnoredDuringExecution: [], preferredDuringSchedulingIgnoredDuringExecution: [] };

      this.allSelectorTerms.forEach((term) => {
        const isAntiAffinity = term._anti;

        const neuTerm = { ...term };

        delete neuTerm._id;
        delete neuTerm._anti;

        if (isAntiAffinity) {
          if (neuTerm.weight) {
            const neu = { podAffinityTerm: neuTerm, weight: neuTerm.weight || this.defaultWeight };

            podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution.push(neu);
          } else {
            podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution.push(neuTerm);
          }
        } else if (term.weight) {
          const neu = { podAffinityTerm: neuTerm, weight: neuTerm.weight || this.defaultWeight };

          podAffinity.preferredDuringSchedulingIgnoredDuringExecution.push(neu);
        } else {
          podAffinity.requiredDuringSchedulingIgnoredDuringExecution.push(neuTerm);
        }
      });

      this.setFieldIfNotEmpty('podAffinity', podAffinity);
      this.setFieldIfNotEmpty('podAntiAffinity', podAntiAffinity);
    },
    addSelectorTerm() {
      this.allSelectorTerms.push({
        _id:   randomStr(4),
        _anti: false
      });
      this.queueUpdate();
    },
    removeSelectorTerm(index) {
      this.allSelectorTerms.splice(index, 1);
      this.queueUpdate();
    },
    changePriority(term, idx) {
      if (term.weight) {
        delete term.weight;
      } else {
        term.weight = this.defaultWeight;
      }
      this.$set(this.allSelectorTerms, idx, this.clone(term));
      this.queueUpdate();
    },
    priorityDisplay(term) {
      return term.weight ? this.t('workload.scheduling.affinity.preferred') : this.t('workload.scheduling.affinity.required');
    },
    changeNamespaceMode(term, idx) {
      if (term.namespaces) {
        term.namespaces = null;
      } else {
        this.$set(term, 'namespaces', []);
      }
      this.$set(this.allSelectorTerms, idx, term);
    },
    updateNamespaces(term, namespaces) {
      this.$set(term, 'namespaces', namespaces);
    },
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
};
</script>

<template>
  <div :style="{'width':'100%'}" class="row" @input="queueUpdate">
    <div class="col span-12">
      <ArrayListGrouped
        v-model="allSelectorTerms"
        class="mt-20"
        :default-add-value="{ }"
        :mode="mode"
        :add-label="t('verrazzano.config.buttons.addPodAffinityTerm')"
        @add="addSelectorTerm()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showSelectorTermRemove"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeSelectorTerm(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <div class="spacer-small" />
          <div class="row mt-20 mb-20">
            <div class="col span-6">
              <LabeledSelect
                :value="props.row.value._anti ?t('workload.scheduling.affinity.antiAffinityOption') :t('workload.scheduling.affinity.affinityOption') "
                :mode="mode"
                :options="[t('workload.scheduling.affinity.affinityOption'),t('workload.scheduling.affinity.antiAffinityOption')]"
                :label="t('workload.scheduling.affinity.type')"
                @input="$set(props.row.value, '_anti', !props.row.value._anti)"
              />
            </div>
            <div class="col span-6">
              <LabeledSelect
                :value="priorityDisplay(props.row.value)"
                :mode="mode"
                :options="[t('workload.scheduling.affinity.preferred'),t('workload.scheduling.affinity.required')]"
                :label="t('workload.scheduling.affinity.priority')"
                @input="changePriority(props.row.value, props.i)"
              />
            </div>
          </div>
          <div class="spacer-small"></div>
          <div class="row">
            <div class="col span-6">
              <LabeledInput
                :value="get(props.row.value, 'topologyKey')"
                :mode="mode"
                required
                :label="t('workload.scheduling.affinity.topologyKey.label')"
                :placeholder="t('workload.scheduling.affinity.topologyKey.placeholder')"
                @input="set(props.row.value, 'topologyKey', $event)"
              />
            </div>
            <div v-if="priorityDisplay(props.row.value) === 'Preferred'" class="col span-6">
              <LabeledInput
                v-model.number="props.row.value.weight"
                :mode="mode"
                type="number"
                min="1"
                max="100"
                :label="t('workload.scheduling.affinity.weight.label')"
                :placeholder="t('workload.scheduling.affinity.weight.placeholder')"
              />
            </div>
          </div>
          <div class="spacer" />
          <div class="row">
            <RadioGroup
              :options="[false, true]"
              :labels="[t('workload.scheduling.affinity.thisPodNamespace'),t('workload.scheduling.affinity.matchExpressions.inNamespaces'),]"
              :name="`namespaces-${props.row.value._id}`"
              :mode="mode"
              :value="!!props.row.value.namespaces"
              @input="changeNamespaceMode(props.row.value, props.i)"
            />
          </div>
          <div class="spacer"></div>
          <div v-if="!!props.row.value.namespaces || !!get(props.row.value, 'namespaces')" class="row mb-20">
            <LabeledSelect
              :value="get(props.row.value, 'namespaces')"
              :mode="mode"
              :multiple="true"
              :taggable="true"
              :options="allNamespaces"
              :label="t('workload.scheduling.affinity.matchExpressions.inNamespaces')"
              @input="set(props.row.value, 'namespaces', $event)"
            />
          </div>
          <div class="spacer"></div>
          <div>
            <h3>{{ t('verrazzano.config.titles.podAffinity.labelSelector') }}</h3>
            <PodAffinityTerm
              :value="get(props.row.value, 'labelSelector')"
              :mode="mode"
              @input="set(props.row.value, 'labelSelector', $event)"
            />
          </div>
          <div class="spacer" />
          <div>
            <h3>{{ t('verrazzano.config.titles.podAffinity.namespaceSelector') }}</h3>
            <PodAffinityTerm
              :value="get(props.row.value, 'namespaceSelector')"
              :mode="mode"
              @input="set(props.row.value, 'namespaceSelector', $event)"
            />
          </div>
        </template>
      </ArrayListGrouped>
    </div>
  </div>
</template>

<style scoped>

</style>
