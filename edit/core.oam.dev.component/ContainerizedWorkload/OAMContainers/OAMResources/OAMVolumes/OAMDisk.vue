<script>
// Added by Verrazzano
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'OAMDisk',
  components: {
    Checkbox,
    LabeledInput,
  },
  mixins: [ContainerizedWorkloadHelper],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create',
    },
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <LabeledInput
        :value="getField('required')"
        :mode="mode"
        required
        :placeholder="getNotSetPlaceholder(value, 'required')"
        :label="t('verrazzano.containerized.fields.requiredDisk')"
        @input="setFieldIfNotEmpty('required', $event)"
      />
    </div>
    <div class="col span-4">
      <div class="spacer-small" />
      <Checkbox
        :value="getField('ephemeral')"
        :mode="mode"
        :label="t('verrazzano.containerized.fields.ephemeral')"
        @input="setBooleanField('ephemeral', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
