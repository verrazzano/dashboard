<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';

export default {
  name:       'ScalingSpec',
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
  },
  computed: {
    scalingPolicyOptions() {
      return [
        { value: 'Safe', label: this.t('verrazzano.coherence.types.scalingPolicy.safe') },
        { value: 'Parallel', label: this.t('verrazzano.coherence.types.scalingPolicy.parallel') },
        { value: 'ParallelUpSafeDown', label: this.t('verrazzano.coherence.types.scalingPolicy.parallelUpSafeDown') },
      ];
    },
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-6">
      <LabeledSelect
        :value="getField('policy')"
        :mode="mode"
        :options="scalingPolicyOptions"
        option-key="value"
        option-label="label"
        :placeholder="getNotSetPlaceholder(value, 'policy')"
        :label="t('verrazzano.coherence.fields.scalingSpec.policy')"
        @input="setFieldIfNotEmpty('policy', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('probe.timeoutSeconds')"
        :mode="mode"
        type="Number"
        min="1"
        :placeholder="getNotSetPlaceholder(value, 'probe.timeoutSeconds')"
        :label="t('verrazzano.coherence.fields.scalingSpec.probeTimeoutSeconds')"
        @input="setNumberField('probe.timeoutSeconds', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
