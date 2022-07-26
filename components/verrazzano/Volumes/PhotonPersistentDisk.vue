<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'PhotonPersistentDisk',
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
        :value="getField('pdID')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.photon.pdId')"
        @input="setField('pdID', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('fsType')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.photon.fsType')"
        @input="setField('fsType', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
