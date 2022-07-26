<script>
// Added by Verrazzano
import ActionJob from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceActions/ActionJob';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'CoherenceAction',
  components: {
    ActionJob,
    LabeledInput,
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
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.coherence.fields.actionName')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('probe.timeoutSeconds')"
          :mode="mode"
          type="Number"
          min="1"
          :placeholder="getNotSetPlaceholder(value, 'probe.timeoutSeconds')"
          :label="t('verrazzano.coherence.fields.actionProbeTimeoutSeconds')"
          @input="setFieldIfNotEmpty('probe.timeoutSeconds', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.actionJob') }}</h3>
      <ActionJob
        :value="getField('job')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('job', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
