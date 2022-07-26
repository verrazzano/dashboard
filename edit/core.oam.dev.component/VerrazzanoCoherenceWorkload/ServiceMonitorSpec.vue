<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import BasicAuth from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/BasicAuth';
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import KeyValue from '@/components/form/KeyValue';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import PrometheusRelabelConfig from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PrometheusRelabelConfig';
import PrometheusTLSConfig from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/PrometheusTLSConfig';
import SecretKeySelector from '@/components/verrazzano/SecretKeySelector';

export default {
  name:       'ServiceMonitorSpec',
  components: {
    ArrayListGrouped,
    BasicAuth,
    Checkbox,
    KeyValue,
    LabeledArrayList,
    LabeledInput,
    PrometheusRelabelConfig,
    PrometheusTLSConfig,
    SecretKeySelector,
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
    },
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
          :label="t('verrazzano.coherence.fields.serviceMonitor.enabled')"
          @input="setBooleanField('enabled', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('honorLabels')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.serviceMonitor.honorLabels')"
          @input="setBooleanField('honorLabels', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('honorTimestamps')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.serviceMonitor.honorTimestamps')"
          @input="setBooleanField('honorTimestamps', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('jobLabel')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'jobLabel')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.jobLabel')"
          @input="setFieldIfNotEmpty('jobLabel', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('sampleLimit')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'sampleLimit')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.sampleLimit')"
          @input="setBooleanField('sampleLimit', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledArrayList
          :value="getListField('targetLabels')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.serviceMonitor.targetLabel')"
          :add-label="t('verrazzano.coherence.buttons.addTargetLabel')"
          @input="setFieldIfNotEmpty('targetLabels', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledArrayList
          :value="getListField('podTargetLabels')"
          :mode="mode"
          :value-label="t('verrazzano.coherence.fields.serviceMonitor.podTargetLabel')"
          :add-label="t('verrazzano.coherence.buttons.addPodTargetLabel')"
          @input="setFieldIfNotEmpty('podTargetLabels', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-12">
        <KeyValue
          :value="getField('labels')"
          :mode="mode"
          :title="t('verrazzano.common.titles.labels')"
          :add-label="t('verrazzano.common.buttons.addLabel')"
          @input="setFieldIfNotEmpty('labels', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('path')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'path')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.path')"
          @input="setFieldIfNotEmpty('path', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('scheme')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'scheme')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.scheme')"
          @input="setFieldIfNotEmpty('scheme', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('proxyURL')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'proxyURL')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.proxyURL')"
          @input="setFieldIfNotEmpty('proxyURL', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-12">
        <KeyValue
          :value="getField('params')"
          :mode="mode"
          :title="t('verrazzano.coherence.titles.httpParams')"
          :add-label="t('verrazzano.coherence.buttons.addHttpParam')"
          @input="setFieldIfNotEmpty('params', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-6">
        <LabeledInput
          :value="getField('interval')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'interval')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.interval')"
          @input="setFieldIfNotEmpty('interval', $event)"
        />
      </div>
      <div class="col span-6">
        <LabeledInput
          :value="getField('scrapeTimeout')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'scrapeTimeout')"
          :label="t('verrazzano.coherence.fields.serviceMonitor.scrapeTimeout')"
          @input="setFieldIfNotEmpty('scrapeTimeout', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.serviceMonitor.tlsConfig') }}</h3>
      <PrometheusTLSConfig
        :value="getField('tlsConfig')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('tlsConfig', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.serviceMonitor.bearerTokenSettings') }}</h3>
      <div class="row">
        <div class="col span-6">
          <LabeledInput
            :value="getField('bearerTokenFile')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'bearerTokenFile')"
            :label="t('verrazzano.coherence.fields.namedPort.bearerTokenFile')"
            @input="setFieldIfNotEmpty('bearerTokenFile', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div>
        <h4>{{ t('verrazzano.coherence.titles.serviceMonitor.bearerTokenSecret') }}</h4>
        <SecretKeySelector
          :value="getField('bearerTokenSecret')"
          :mode="mode"
          :namespaced-object="namespacedObject"
          @input="setFieldIfNotEmpty('bearerTokenSecret', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.serviceMonitor.basicAuth') }}</h3>
      <BasicAuth
        :value="getField('basicAuth')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('basicAuth', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.serviceMonitor.metricsRelabelings') }}</h3>
      <ArrayListGrouped
        :value="getListField('metricRelabelings')"
        :default-add-value="{ }"
        :mode="mode"
        :add-label="t('verrazzano.coherence.buttons.addMetricRelabeling')"
        @input="setFieldIfNotEmpty('metricRelabelings', $event)"
      >
        <template #remove-button="removeProps">
          <button
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #default="props">
          <PrometheusRelabelConfig
            v-model="props.row.value"
            :mode="mode"
          />
        </template>
      </ArrayListGrouped>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.coherence.titles.serviceMonitor.relabelings') }}</h3>
      <ArrayListGrouped
        :value="getListField('relabelings')"
        :default-add-value="{ }"
        :mode="mode"
        :add-label="t('verrazzano.coherence.buttons.addRelabeling')"
        @input="setFieldIfNotEmpty('relabelings', $event)"
      >
        <template #remove-button="removeProps">
          <button
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #default="props">
          <PrometheusRelabelConfig
            v-model="props.row.value"
            :mode="mode"
          />
        </template>
      </ArrayListGrouped>
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
