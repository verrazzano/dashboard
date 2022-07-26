<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import SSLSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/SSLSpec';

export default {
  name:       'PortSpecWithSSL',
  components: {
    Checkbox,
    LabeledInput,
    SSLSpec,
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
    namespacedObject: {
      type:     Object,
      required: true
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('enabled')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.portEnabled')"
          @input="setBooleanField('enabled', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('port')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :placeholder="getNotSetPlaceholder(value, 'port')"
          :label="t('verrazzano.common.fields.port')"
          @input="setNumberField('port', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <SSLSpec
        :value="getField('ssl')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('ssl', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
