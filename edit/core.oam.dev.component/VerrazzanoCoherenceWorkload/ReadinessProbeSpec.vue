<script>
// Added by Verrazzano
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import HttpGet from '@/components/verrazzano/HttpGet';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import ProbeTcpSocket from '@/components/verrazzano/ContainerProbe/ProbeTcpSocket';

export default {
  name:       'ReadinessProbeSpec',
  components: {
    HttpGet,
    LabeledArrayList,
    LabeledInput,
    ProbeTcpSocket,
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
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('initialDelaySeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.initialDelaySeconds')"
          @input="setNumberField('initialDelaySeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('timeoutSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.timeoutSeconds')"
          @input="setNumberField('timeoutSeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('periodSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :label="t('verrazzano.common.fields.containerProbe.periodSeconds')"
          @input="setNumberField('periodSeconds', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('failureThreshold')"
          :mode="mode"
          type="Number"
          min="1"
          :label="t('verrazzano.common.fields.containerProbe.failureThreshold')"
          @input="setNumberField('failureThreshold', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('successThreshold')"
          :mode="mode"
          type="Number"
          min="1"
          :label="t('verrazzano.common.fields.containerProbe.successThreshold')"
          @input="setNumberField('successThreshold', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.containerProbe.execCommands') }}</h4>
      <LabeledArrayList
        :value="getListField('exec.command')"
        :mode="mode"
        :value-label="t('verrazzano.common.fields.containerProbe.command')"
        :add-label="t('verrazzano.common.buttons.addExecCommand')"
        initial-empty-row
        @input="setFieldIfNotEmpty('exec.command', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.httpGet') }}</h4>
      <HttpGet
        :value="getField('httpGet')"
        :mode="mode"
        @input="setFieldIfNotEmpty('httpGet', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.common.titles.containerProbe.tcpSocket') }}</h4>
      <ProbeTcpSocket
        :value="getField('tcpSocket')"
        :mode="mode"
        @input="setFieldIfNotEmpty('tcpSocket', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
