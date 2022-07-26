<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ServiceAccountToken',
  components: { LabeledInput },
  mixins:     [VerrazzanoHelper],
  props:      {
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
      <LabeledInput
        :value="getField('path')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.projected.path')"
        @input="setField('path', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('audience')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.projected.audience')"
        @input="setField('audience', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('expirationSeconds')"
        :mode="mode"
        type="Number"
        min="600"
        :label="t('verrazzano.config.fields.volumes.projected.expirationSeconds')"
        @input="setNumberField('expirationSeconds', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
