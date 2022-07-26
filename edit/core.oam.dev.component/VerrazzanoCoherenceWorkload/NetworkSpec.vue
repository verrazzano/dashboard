<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import HostAliases from '@/components/verrazzano/HostAliases';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import PodDNSConfig from '@/components/verrazzano/PodSpec/PodDNSConfig';

export default {
  name:       'NetworkSpec',
  components: {
    Checkbox,
    HostAliases,
    LabeledInput,
    LabeledSelect,
    PodDNSConfig,
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
      <div class="col span-3">
        <Checkbox
          :value="getField('hostNetwork')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.hostNetwork')"
          @input="setBooleanField('hostNetwork', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('setHostnameAsFQDN')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.setHostnameAsFQDN')"
          @input="setBooleanField('setHostnameAsFQDN', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('hostname')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'hostname')"
          :label="t('verrazzano.common.fields.podSpec.hostname')"
          @input="setFieldIfNotEmpty('hostname', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('subdomain')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subdomain')"
          :label="t('verrazzano.common.fields.podSpec.subdomain')"
          @input="setFieldIfNotEmpty('subdomain', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('dnsPolicy')"
          :mode="mode"
          :options="dnsPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'dnsPolicy')"
          :label="t('verrazzano.common.fields.podSpec.dnsPolicy')"
          @input="setFieldIfNotEmpty('dnsPolicy', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.dnsConfig') }}</h3>
      <PodDNSConfig
        :value="getField('dnsConfig')"
        :mode="mode"
        @input="setFieldIfNotEmpty('dnsConfig', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.hostAliases') }}</h3>
      <HostAliases
        :value="getField('hostAliases')"
        :mode="mode"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
