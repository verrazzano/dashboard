<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VSphereVolume',
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
    <div class="col span-3">
      <LabeledInput
        :value="getField('volumePath')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.vsphere.volumePath')"
        @input="setField('volumePath', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('storagePolicyID')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.vsphere.storagePolicyID')"
        @input="setField('storagePolicyID', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('storagePolicyName')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.vsphere.storagePolicyName')"
        @input="setField('storagePolicyName', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('fsType')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.vsphere.fsType')"
        @input="setField('fsType', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
