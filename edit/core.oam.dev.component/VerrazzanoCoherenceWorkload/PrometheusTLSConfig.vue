<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import SecretKeySelector from '@/components/verrazzano/SecretKeySelector';
import SecretOrConfigMapSelector from '@/components/verrazzano/SecretOrConfigMapSelector';

export default {
  name:       'PrometheusTLSConfig',
  components: {
    Checkbox,
    LabeledInput,
    SecretKeySelector,
    SecretOrConfigMapSelector,
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
      <div class="col span-6">
        <LabeledInput
          :value="getField('serverName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'serverName')"
          :label="t('verrazzano.coherence.fields.tlsConfig.serverName')"
          @input="setFieldIfNotEmpty('serverName', $event)"
        />
      </div>
      <div class="col span-6">
        <div class="spacer-small" />
        <Checkbox
          :value="getField('insecureSkipVerify')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.tlsConfig.insecureSkipVerify')"
          @input="setBooleanField('insecureSkipVerify', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('caFile')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'caFile')"
          :label="t('verrazzano.coherence.fields.tlsConfig.caFile')"
          @input="setFieldIfNotEmpty('caFile', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('certFile')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'certFile')"
          :label="t('verrazzano.coherence.fields.tlsConfig.certFile')"
          @input="setFieldIfNotEmpty('certFile', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('keyFile')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'keyFile')"
          :label="t('verrazzano.coherence.fields.tlsConfig.keyFile')"
          @input="setFieldIfNotEmpty('keyFile', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.tlsConfig.ca') }}</h4>
      <SecretOrConfigMapSelector
        :value="getField('ca')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('ca', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.tlsConfig.cert') }}</h4>
      <SecretOrConfigMapSelector
        :value="getField('cert')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('cert', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h4>{{ t('verrazzano.coherence.titles.tlsConfig.keySecret') }}</h4>
      <SecretKeySelector
        :value="getField('keySecret')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        @input="setFieldIfNotEmpty('keySecret', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
