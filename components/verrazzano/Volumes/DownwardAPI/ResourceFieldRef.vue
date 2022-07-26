<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ResourceFieldRef',
  components: {
    LabeledInput,
    LabeledSelect,
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
  computed: {
    resourceOptions() {
      return [
        { value: 'limits.cpu', label: this.t('verrazzano.config.values.types.volumes.downwardApi.cpuLimits') },
        { value: 'limits.memory', label: this.t('verrazzano.config.values.types.volumes.downwardApi.memoryLimits') },
        { value: 'requests.cpu', label: this.t('verrazzano.config.values.types.volumes.downwardApi.cpuRequests') },
        { value: 'requests.memory', label: this.t('verrazzano.config.values.types.volumes.downwardApi.memoryRequests') },
      ];
    },
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <LabeledInput
        :value="getField('containerName')"
        :mode="mode"
        required
        :label="t('verrazzano.config.fields.volumes.downwardApi.containerName')"
        @input="setField('containerName', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        :value="getField('divisor')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.downwardApi.divisor')"
        @input="setField('divisor', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledSelect
        :value="getField('resource')"
        :mode="mode"
        :options="resourceOptions"
        option-key="value"
        option-label="label"
        :label="t('verrazzano.config.fields.volumes.downwardApi.resource')"
        @input="setField('resource', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
