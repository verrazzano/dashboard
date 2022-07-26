<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';

export default {
  name:       'AuxiliaryImage',
  components: {
    LabeledInput,
    LabeledSelect
  },
  mixins: [NotSetPlaceholder],
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
          v-model="value.image"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImage')"
          :placeholder="getNotSetPlaceholder(value, 'image')"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          v-model="value.imagePullPolicy"
          :mode="mode"
          :label="t('verrazzano.components.config.fields.imagePullPolicy')"
          :options="imagePullPolicyOptions"
          option-key="value"
          :placeholder="getNotSetPlaceholder(value, 'imagePullPolicy')"
        />
      </div>
    </div>
    <br />
    <div class="row">
      <div class="col span-3">
        <LabeledInput
          v-model="value.volume"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolumeReference')"
          :placeholder="getNotSetPlaceholder(value, 'volume')"
        />
      </div>
      <div class="col span-9">
        <LabeledInput
          v-model="value.command"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageCommand')"
          :placeholder="getNotSetPlaceholder(value, 'command')"
        />
      </div>
    </div>
  </div>
</template>
