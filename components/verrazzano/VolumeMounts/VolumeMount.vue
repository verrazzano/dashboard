<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'VolumeMount',
  components: {
    Checkbox,
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
    mountPropagationOptions() {
      return [
        { value: 'None', label: this.t('verrazzano.config.values.types.mountPropagation.none') },
        { value: 'HostToContainer', label: this.t('verrazzano.config.values.types.mountPropagation.hostToContainer') },
        { value: 'Bidirectional', label: this.t('verrazzano.config.values.types.mountPropagation.bidirectional') },
      ];
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumeMount.name')"
          @input="setField('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('mountPropagation')"
          :mode="mode"
          :options="mountPropagationOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumeMount.mountPropagation')"
          @input="setField('mountPropagation', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumeMount.readOnly')"
          @input="setField('readOnly', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('mountPath')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumeMount.mountPath')"
          @input="setField('mountPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPath')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumeMount.subPath')"
          @input="setField('subPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPathExpr')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumeMount.subPathExpr')"
          @input="setField('subPathExpr', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
