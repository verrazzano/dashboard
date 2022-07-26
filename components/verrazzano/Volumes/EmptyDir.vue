<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'EmptyDir',
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
    }
  },
  computed: {
    mediumOptions() {
      return [
        { value: '', label: this.t('verrazzano.config.values.types.volumes.emptyDir.medium.notSet') },
        { value: 'Memory', label: this.t('verrazzano.config.values.types.volumes.emptyDir.medium.memory') },
      ];
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-6">
      <LabeledSelect
        :value="getField('medium')"
        :mode="mode"
        :options="mediumOptions"
        option-key="key"
        option-label="label"
        :label="t('verrazzano.config.fields.volumes.emptyDir.medium')"
        @input="setField('medium', $event)"
      />
    </div>
    <div class="col span-6">
      <LabeledInput
        :value="getField('sizeLimit')"
        :mode="mode"
        :label="t('verrazzano.config.fields.volumes.emptyDir.sizeLimit')"
        @input="setField('sizeLimit', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
