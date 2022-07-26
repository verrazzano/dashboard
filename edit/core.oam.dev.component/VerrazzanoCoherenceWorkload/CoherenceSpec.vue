<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import PersistenceSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PersistenceSpec';
import PortSpecWithSSL from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PortSpecWithSSL';
import WellKnownAddressSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/WellKnownAddressSpec';

export default {
  name:       'CoherenceSpec',
  components: {
    WellKnownAddressSpec,
    Checkbox,
    LabeledArrayList,
    LabeledInput,
    PersistenceSpec,
    PortSpecWithSSL,
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
          :value="getField('storageEnabled')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.storageEnabled')"
          @input="setBooleanField('storageEnabled', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('excludeFromWKA')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.excludeFromWKA')"
          @input="setBooleanField('excludeFromWKA', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('skipVersionCheck')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.skipVersionCheck')"
          @input="setBooleanField('skipVersionCheck', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('enableIpMonitor')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.enableIpMonitor')"
          @input="setBooleanField('enableIpMonitor', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('cacheConfig')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'cacheConfig')"
          :label="t('verrazzano.coherence.fields.cacheConfig')"
          @input="setFieldIfNotEmpty('cacheConfig', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('overrideConfig')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'overrideConfig')"
          :label="t('verrazzano.coherence.fields.overrideConfig')"
          @input="setFieldIfNotEmpty('overrideConfig', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('logLevel')"
          :mode="mode"
          type="Number"
          min="-1"
          max="9"
          :placeholder="getNotSetPlaceholder(value, 'logLevel')"
          :label="t('verrazzano.coherence.fields.logLevel')"
          @input="setNumberField('logLevel', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('localPort')"
          :mode="mode"
          type="Number"
          :min="minPortNumber"
          :max="maxPortNumber"
          :placeholder="getNotSetPlaceholder(value, 'localPort')"
          :label="t('verrazzano.coherence.fields.localPort')"
          @input="setNumberField('localPort', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('localPortAdjust')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'localPortAdjust')"
          :label="t('verrazzano.coherence.fields.localPortAdjust')"
          @input="setFieldIfNotEmpty('localPortAdjust', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('tracing.ratio')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'tracing.ratio')"
          :label="t('verrazzano.coherence.fields.tracingRatio')"
          @input="setFieldIfNotEmpty('tracing.ratio', $event)"
        />
      </div>
      <div class="col span-8">
        <LabeledArrayList
          :value="getListField('allowEndangeredForStatusHA')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.allowEndangeredForStatusHA')"
          :add-label="t('verrazzano.coherence.buttons.addAllowEndangeredForStatusHA')"
          @input="setFieldIfNotEmpty('allowEndangeredForStatusHA', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.persistence') }}</h3>
      <PersistenceSpec
        :value="getField('persistence')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('persistence', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.management') }}</h3>
      <PortSpecWithSSL
        :value="getField('management')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('management', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.metrics') }}</h3>
      <PortSpecWithSSL
        :value="getField('metrics')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('metrics', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.wka') }}</h3>
      <WellKnownAddressSpec
        :value="getField('wka')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('wka', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
