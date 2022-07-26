<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'JVMDebugSpec',
  components: {
    Checkbox,
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
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <div class="spacer-tiny" />
      <Checkbox
        :value="getField('enabled')"
        :mode="mode"
        :label="t('verrazzano.coherence.fields.jvmDebugEnabled')"
        @input="setBooleanField('enabled', $event)"
      />
      <div class="spacer-tiny" />
      <Checkbox
        :value="getField('suspend')"
        :mode="mode"
        :label="t('verrazzano.coherence.fields.jvmDebugSuspended')"
        @input="setBooleanField('suspend', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('attach')"
        :mode="mode"
        :placeholder="getNotSetPlaceholder(value, 'attach')"
        :label="t('verrazzano.coherence.fields.jvmDebugAttach')"
        @input="setFieldIfNotEmpty('attach', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('port')"
        :mode="mode"
        type="Number"
        :min="minPortNumber"
        :max="maxPortNumber"
        :placeholder="getNotSetPlaceholder(value, 'port')"
        :label="t('verrazzano.coherence.fields.jvmDebugPort')"
        @input="setNumberField('port', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
