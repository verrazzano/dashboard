<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import OAMExtendedResources
  from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources/OAMExtendedResources';
import OAMVolumes from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers/OAMResources/OAMVolumes';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'OAMResources',
  components: {
    LabeledInput,
    OAMExtendedResources,
    OAMVolumes,
  },
  mixins: [VerrazzanoHelper],
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
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('cpu.required')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'cpu.required')"
          :label="t('verrazzano.containerized.fields.requiredCpu')"
          @input="setFieldIfNotEmpty('cpu.required', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('memory.required')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'memory.required')"
          :label="t('verrazzano.containerized.fields.requiredMemory')"
          @input="setFieldIfNotEmpty('memory.required', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('gpu.required')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'gpu.required')"
          :label="t('verrazzano.containerized.fields.requiredGpu')"
          @input="setFieldIfNotEmpty('gpu.required', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.containerized.titles.volumes') }}</h3>
      <OAMVolumes v-model="value" :mode="mode" />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.containerized.titles.extendedResources') }}</h3>
      <OAMExtendedResources v-model="value" :mode="mode" />
    </div>
  </div>
</template>

<style scoped>

</style>
