<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';

export default {
  name:       'IstioConfig',
  components: {
    Checkbox,
    LabeledInput
  },
  mixins: [NotSetPlaceholder],
  props:  {
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:     String,
      default: 'create'
    }
  },
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <Checkbox
        v-model="value.enabled"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.istio.enabled')"
      />
      <div class="spacer-tiny" />
      <Checkbox
        v-model="value.localhostBindingEnabled"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.istio.localhostBindingsEnabled')"
      />
    </div>
    <div class="col span-4">
      <LabeledInput
        v-model="value.readinessPort"
        type="number"
        min="0"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.istio.readinessPort')"
        :placeholder="getNotSetPlaceholder(value, 'readinessPort')"
      />
      <LabeledInput
        v-model="value.replicationChannelPort"
        type="number"
        min="0"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.istio.replicationChannelPort')"
        :placeholder="getNotSetPlaceholder(value, 'replicationChannelPort')"
      />
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 10px 0 0 0;
  }
</style>
