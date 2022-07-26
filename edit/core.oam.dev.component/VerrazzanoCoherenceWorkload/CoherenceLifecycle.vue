<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import ScalingSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ScalingSpec';
import StartQuorum from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/StartQuorum';

export default {
  name:       'CoherenceLifecycle',
  components: {
    Checkbox,
    KeyValue,
    LabeledInput,
    ScalingSpec,
    StartQuorum,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      // parent object (e.g., VerrazzanoCoherenceWorkload)
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
};
</script>

<template>
  <div>
    <div>
      <ScalingSpec
        :value="getField('scaling')"
        :mode="mode"
        @input="setFieldIfNotEmpty('scaling', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('suspendServicesOnShutdown')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.suspendServicesOnShutdown')"
          @input="setBooleanField('suspendServicesOnShutdown', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('resumeServicesOnStartup')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.resumeServicesOnStartup')"
          @input="setBooleanField('resumeServicesOnStartup', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('haBeforeUpdate')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.haBeforeUpdate')"
          @input="setBooleanField('haBeforeUpdate', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('suspendProbe.timeoutSeconds')"
          :mode="mode"
          type="Number"
          min="1"
          :placeholder="getNotSetPlaceholder(value, 'suspendProbe.timeoutSeconds')"
          :label="t('verrazzano.coherence.field.suspendProbeTimeoutSeconds')"
          @input="setNumberField('suspendProbe.timeoutSeconds', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('suspendServiceTimeout')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'suspendServiceTimeout')"
          :label="t('verrazzano.coherence.field.suspendServiceTimeout')"
          @input="setNumberField('suspendServiceTimeout', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <KeyValue
        :value="getField('autoResumeServices')"
        :mode="mode"
        :title="t('verrazzano.coherence.titles.autoResumeServices')"
        :add-label="t('verrazzano.coherence.buttons.addAutoResumeServiceSetting')"
        @input="setFieldIfNotEmpty('autoResumeServices', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.startQuorum') }}</h3>
      <StartQuorum
        :value="getField('startQuorum')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('startQuorum', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
