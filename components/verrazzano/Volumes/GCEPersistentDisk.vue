<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'GCEPersistentDisk',
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
    <div class="col span-3">
      <LabeledInput
        :value="getField('pdName')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.gce.pdName')"
        @input="setField('pdName', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('fsType')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.gce.fsType')"
        @input="setField('fsType', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('partition')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.gce.partition')"
        @input="setNumberField('partition', $event)"
      />
    </div>
    <div class="col span-3">
      <Checkbox
        :value="getField('readOnly')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.gce.readOnly')"
        @input="setBooleanField('readOnly', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
