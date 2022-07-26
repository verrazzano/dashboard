<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'PortworxVolume',
  components: {
    Checkbox,
    LabeledInput,
  },
  mixins: [VerrazzanoHelper],
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
      <LabeledInput
        :value="getField('volumeID')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.portworx.volumeId')"
        @input="setField('volumeID', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('fsType')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.portworx.fsType')"
        @input="setField('volumeID', $event)"
      />
    </div>
    <div class="col span-4">
      <Checkbox
        :value="getField('readOnly')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.portworx.readOnly')"
        @input="setField('readOnly', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
