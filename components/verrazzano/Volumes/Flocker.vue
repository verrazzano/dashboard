<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'Flocker',
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
        :value="getField('datasetName')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.flocker.datasetName')"
        @input="setField('datasetName', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('datasetUUID')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.flocker.datasetUuid')"
        @input="setField('datasetUUID', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
