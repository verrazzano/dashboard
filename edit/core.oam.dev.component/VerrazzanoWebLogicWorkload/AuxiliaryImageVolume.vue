<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';

export default {
  name:       'AuxiliaryImageVolume',
  components: { LabeledInput },
  mixins:     [NotSetPlaceholder],
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
  <div class="row">
    <div class="col span-3">
      <LabeledInput
        v-model="value.name"
        :mode="mode"
        required
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolume.name')"
        :placeholder="getNotSetPlaceholder(value, 'name')"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        v-model="value.mountPath"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolume.mountPath')"
        :placeholder="getNotSetPlaceholder(value, 'mountPath')"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        v-model="value.sizeLimit"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolume.sizeLimit')"
        :placeholder="getNotSetPlaceholder(value, 'sizeLimit')"
      />
    </div>
    <div class="col span-3">
      <LabeledInput
        v-model="value.medium"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.auxiliaryImageVolume.medium')"
        :placeholder="getNotSetPlaceholder(value, 'medium')"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
