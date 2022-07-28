<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

export default {
  name:       'ContainerPort',
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
    },
  },
  computed: {
    protocolOptions() {
      return [
        { value: 'TCP', label: this.t('verrazzano.common.types.portProtocol.tcp') },
        { value: 'UDP', label: this.t('verrazzano.common.types.portProtocol.udp') },
        { value: 'SCTP', label: this.t('verrazzano.common.types.portProtocol.sctp') },
      ];
    },
  },
  created() {
    // eslint-disable-next-line no-console
    console.log('AAAAAAA ContainerPort for port: ', JSON.stringify(this.value));
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-2">
        <LabeledSelect
          :value="getField('protocol')"
          :mode="mode"
          :options="protocolOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.common.fields.container.ports.protocol')"
          @input="setField('protocol', $event)"
        />
      </div>
      <div class="col span-2">
        <LabeledInput
          :value="getField('containerPort')"
          :mode="mode"
          required
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :label="t('verrazzano.common.fields.container.ports.containerPort')"
          @input="setNumberField('containerPort', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('name')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.ports.name')"
          @input="setField('name', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('hostIP')"
          :mode="mode"
          :label="t('verrazzano.common.fields.container.ports.hostIP')"
          @input="setField('hostIP', $event)"
        />
      </div>
      <div class="col span-2">
        <LabeledInput
          :value="getField('hostPort')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :label="t('verrazzano.common.fields.container.ports.hostPort')"
          @input="setNumberField('hostPort', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
