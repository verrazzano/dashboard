<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';

export default {
  name:       'ApplicationSpec',
  components: {
    Checkbox,
    LabeledArrayList,
    LabeledInput,
  },
  mixins: [CoherenceWorkloadHelper],
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
    cloudNativeBuildPackEnabled() {
      const result = this.getField('cloudNativeBuildPack.enabled');

      return result ? Boolean(result) : false;
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('type')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'type')"
          :label="t('verrazzano.coherence.fields.applicationType')"
          @input="setFieldIfNotEmpty('type', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('main')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'main')"
          :label="t('verrazzano.coherence.fields.applicationMain')"
          @input="setFieldIfNotEmpty('main', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('workingDir')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'workingDir')"
          :label="t('verrazzano.common.fields.workingDir')"
          @input="setFieldIfNotEmpty('workingDir', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledArrayList
          :value="getListField('args')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.appArg')"
          :add-label="t('verrazzano.coherence.buttons.addAppArg')"
          @input="setFieldIfNotEmpty('args', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('springBootFatJar')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'springBootFatJar')"
          :label="t('verrazzano.coherence.fields.springBootFatJar')"
          @input="setFieldIfNotEmpty('springBootFatJar', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <div class="spacer-small" />
        <Checkbox
          :value="getField('cloudNativeBuildPack.enabled')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.cloudNativeBuildPack.enabled')"
          @input="setBooleanField('cloudNativeBuildPack.enabled', $event)"
        />
      </div>
      <div v-if="cloudNativeBuildPackEnabled" class="col span-6">
        <LabeledInput
          :value="getField('cloudNativeBuildPack.launcher')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'cloudNativeBuildPack.launcher')"
          :label="t('verrazzano.coherence.fields.cloudNativeBuildPack.launcher')"
          @input="setFieldIfNotEmpty('cloudNativeBuildPack.launcher', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
