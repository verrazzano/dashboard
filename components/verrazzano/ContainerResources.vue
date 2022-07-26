<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerResources',
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
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('requests.cpu')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.requestCpu')"
          @input="setField('requests.cpu', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('requests.memory')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.requestMemory')"
          @input="setField('requests.memory', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('requests.ephemeral-storage')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.requestEphemeralStorage')"
          @input="setField('requests.ephemeral-storage', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('limits.cpu')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.limitCpu')"
          @input="setField('limits.cpu', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('limits.memory')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.limitMemory')"
          @input="setField('limits.memory', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('limits.ephemeral-storage')"
          :mode="mode"
          :label="t('verrazzano.config.fields.containerResources.limitEphemeralStorage')"
          @input="setField('limits.ephemeral-storage', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
