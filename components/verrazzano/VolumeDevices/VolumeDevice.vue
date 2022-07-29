<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VolumeDevice',
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
        :value="getField('name')"
        :mode="mode"
        required
        :label="t('verrazzano.common.fields.volumeDevice.name')"
        @input="setField('name', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('devicePath')"
        :mode="mode"
        required
        :label="t('verrazzano.common.fields.volumeDevice.devicePath')"
        @input="setField('devicePath', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
