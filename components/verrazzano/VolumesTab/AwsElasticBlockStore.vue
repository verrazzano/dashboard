<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'AwsElasticBlockStore',
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
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-3">
      <LabeledInput
        :value="getField('volumeID')"
        :mode="mode"
        :placeholder="getNotSetPlaceholder(value, 'volumeID')"
        :label="t('verrazzano.common.fields.volumes.awsElasticBlockStore.volumeId')"
        required
        @input="setFieldIfNotEmpty('volumeID', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('fsType')"
        :mode="mode"
        :placeholder="getNotSetPlaceholder(value, 'fsType')"
        :label="t('verrazzano.common.fields.volumes.awsElasticBlockStore.fsType')"
        @input="setFieldIfNotEmpty('fsType', $event)"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        :value="getField('partition')"
        :mode="mode"
        type="Number"
        min="0"
        :placeholder="getNotSetPlaceholder(value, 'partition')"
        :label="t('verrazzano.common.fields.volumes.awsElasticBlockStore.partition')"
        @input="setNumberField('partition', $event)"
      />
    </div>
    <div class="col span-3">
      <Checkbox
        :value="getField('readOnly')"
        :mode="mode"
        :label="t('verrazzano.common.fields.volumes.awsElasticBlockStore.readOnly')"
        @input="setBooleanField('readOnly', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
