<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ProbeTuning',
  components: { LabeledInput },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    isReadinessProbe: {
      type:    Boolean,
      default: false
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('initialDelaySeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.initialDelaySeconds')"
          @input="setNumberField('initialDelaySeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('periodSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.periodSeconds')"
          @input="setNumberField('periodSeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('timeoutSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.timeoutSeconds')"
          @input="setNumberField('timeoutSeconds', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('failureThreshold')"
          :mode="mode"
          type="Number"
          min="1"
          :label="t('verrazzano.common.fields.containerProbe.failureThreshold')"
          @input="setNumberField('failureThreshold', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('successThreshold')"
          :mode="mode"
          type="Number"
          min="1"
          :disabled="!isReadinessProbe"
          :label="t('verrazzano.common.fields.containerProbe.successThreshold')"
          @input="setNumberField('successThreshold', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
