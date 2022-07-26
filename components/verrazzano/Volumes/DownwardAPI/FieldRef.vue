<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'FieldRef',
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
    <div class="col span-6">
      <LabeledInput
        :value="getField('fieldPath')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.downwardApi.fieldPath')"
        @input="setField('fieldPath', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('apiVersion')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.downwardApi.apiVersion')"
        @input="setField('apiVersion', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
