<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'AuxiliaryImage',
  components: {
    LabeledInput,
    LabeledSelect
  },
  mixins: [NotSetPlaceholder, VerrazzanoHelper],
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
  computed: {
    imagePullPolicyOptions() {
      return [
        {
          value: 'Always',
          label: this.t('verrazzano.common.types.imagePullPolicy.always')
        },
        {
          value: 'IfNeeded',
          label: this.t('verrazzano.common.types.imagePullPolicy.ifNeeded')
        },
        {
          value: 'Never',
          label: this.t('verrazzano.common.types.imagePullPolicy.never')
        },
      ];
    },
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-9">
        <LabeledInput
          :value="getField('image')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImage')"
          :placeholder="getNotSetPlaceholder(value, 'image')"
          @input="setFieldIfNotEmpty('image', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('imagePullPolicy')"
          :mode="mode"
          :label="t('verrazzano.components.config.fields.imagePullPolicy')"
          :options="imagePullPolicyOptions"
          option-key="value"
          :placeholder="getNotSetPlaceholder(value, 'imagePullPolicy')"
          @input="setFieldIfNotEmpty('imagePullPolicy', $event)"
        />
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          :value="getField('volume')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolumeReference')"
          :placeholder="getNotSetPlaceholder(value, 'volume')"
          @input="setFieldIfNotEmpty('volume', $event)"
        />
      </div>
      <div class="col span-9">
        <LabeledInput
          :value="getField('command')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageCommand')"
          :placeholder="getNotSetPlaceholder(value, 'command')"
          @input="setFieldIfNotEmpty('command', $event)"
        />
      </div>
    </div>
  </div>
</template>
