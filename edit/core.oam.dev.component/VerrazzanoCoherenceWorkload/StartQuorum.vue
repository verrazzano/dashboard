<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';

import { NAMESPACE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'StartQuorum',
  components: {
    LabeledInput,
    LabeledSelect,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
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
    return {
      fetchInProgress: true,
      allNamespaces:   [],
    };
  },
  async fetch() {
    const requests = { namespaces: this.$store.dispatch('cluster/findAll', { type: NAMESPACE }) };

    const hash = await allHash(requests);

    this.allNamespaces = hash.namespaces;
    this.fetchInProgress = false;
  },
  computed: {
    namespaces() {
      return this.fetchInProgress ? [] : this.allNamespaces;
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <LabeledInput
        :value="getField('deployment')"
        :mode="mode"
        required
        :placeholder="getNotSetPlaceholder(value, 'deployment')"
        :label="t('verrazzano.coherence.fields.startQuorum.deployment')"
        @input="setFieldIfNotEmpty('deployment', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledSelect
        :value="getField('namespace')"
        :mode="mode"
        :options="namespaces"
        option-label="metadata.name"
        :reduce="namespace => namespace.metadata.name"
        :placeholder="getNotSetPlaceholder(value, 'deployment')"
        :label="t('verrazzano.coherence.fields.startQuorum.namespace')"
        @input="setFieldIfNotEmpty('namespace', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('podCount')"
        :mode="mode"
        type="Number"
        min="0"
        :placeholder="getNotSetPlaceholder(value, 'podCount')"
        :label="t('verrazzano.coherence.fields.startQuorum.podCount')"
        @input="setNumberField('podCount', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
