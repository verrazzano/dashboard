<script>
// Added by Verrazzano
import Affinity from '@/components/verrazzano/Affinity';
import Checkbox from '@/components/form/Checkbox';
import Containers from '@/components/verrazzano/Containers';
import HostAliases from '@/components/verrazzano/HostAliases';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import PodDNSConfig from '@/components/verrazzano/PodSpec/PodDNSConfig';
import PodSecurityContext from '@/components/verrazzano/PodSecurityContext';
import ReadinessGates from '@/components/verrazzano/ReadinessGates';
import Tolerations from '@/components/verrazzano/Tolerations';
import TopologySpreadConstraints from '@/components/verrazzano/TopologySpreadConstraints';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import Volumes from '@/components/verrazzano/Volumes';

import { SERVICE_ACCOUNT } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'PodSpec',
  components: {
    PodDNSConfig,
    Affinity,
    Checkbox,
    Containers,
    HostAliases,
    LabeledInput,
    LabeledSelect,
    PodSecurityContext,
    ReadinessGates,
    Tolerations,
    TopologySpreadConstraints,
    Volumes,
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
    namespacedObject: {
      type:     Object,
      required: true
    },
  },
  data() {
    return {
      loading:            true,
      fetchInProgress:    true,
      namespace:          this.namespacedObject.metadata?.name,
      allServiceAccounts: {},
      serviceAccounts:    [],
    };
  },
  async fetch() {
    const requests = { serviceAccounts: this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT }) };

    const hash = await allHash(requests);

    if (hash.serviceAccounts) {
      this.sortObjectsByNamespace(hash.serviceAccounts, this.allServiceAccounts);
    }
    this.fetchInProgress = false;
  },
  methods: {
    resetServiceAccounts() {
      if (!this.fetchInProgress) {
        this.serviceAccounts = this.allServiceAccounts[this.namespace] || [];
      }
    }
  },
  mounted() {
    this.loading = false;
  },
  watch: {
    fetchInProgress() {
      this.resetServiceAccounts();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetServiceAccounts();
    },
    'value.hostIPC'(neu, old) {
      if (!this.loading && neu) {
        this.setBooleanField('shareProcessNamespace', undefined);
      }
    },
    'value.shareProcessNamespace'(neu, old) {
      if (!this.loading && neu) {
        this.setBooleanField('hostIPC', undefined);
      }
    },
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('automountServiceAccountToken')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.automountServiceAccountToken')"
          @input="setBooleanField('automountServiceAccountToken', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('enableServiceLinks')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.enableServiceLinks')"
          @input="setBooleanField('enableServiceLinks', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('hostIPC')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.hostIPC')"
          @input="setBooleanField('hostIPC', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('hostNetwork')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.hostNetwork')"
          @input="setBooleanField('hostNetwork', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('hostPID')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.hostPID')"
          @input="setBooleanField('hostPID', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('setHostnameAsFQDN')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.setHostnameAsFQDN')"
          @input="setBooleanField('setHostnameAsFQDN', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('shareProcessNamespace')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.shareProcessNamespace')"
          @input="setBooleanField('shareProcessNamespace', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
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
      <div class="col span-4">
        <LabeledInput
          :value="getField('hostname')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'hostname')"
          :label="t('verrazzano.common.fields.podSpec.hostname')"
          @input="setFieldIfNotEmpty('hostname', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('nodeName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'nodeName')"
          :label="t('verrazzano.common.fields.podSpec.nodeName')"
          @input="setFieldIfNotEmpty('nodeName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('preemptionPolicy')"
          :mode="mode"
          :options="preemptionPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'preemptionPolicy')"
          :label="t('verrazzano.common.fields.podSpec.preemptionPolicy')"
          @input="setFieldIfNotEmpty('preemptionPolicy', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('priority')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'priority')"
          :label="t('verrazzano.common.fields.podSpec.priority')"
          @input="setNumberField('priority', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('priorityClassName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
          :label="t('verrazzano.common.fields.podSpec.priorityClassName')"
          @input="setFieldIfNotEmpty('priorityClassName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('restartPolicy')"
          :mode="mode"
          :options="restartPolicyOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'restartPolicy')"
          :label="t('verrazzano.common.fields.podSpec.restartPolicy')"
          @input="setFieldIfNotEmpty('restartPolicy', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('runtimeClassName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'runtimeClassName')"
          :label="t('verrazzano.common.fields.podSpec.runtimeClassName')"
          @input="setFieldIfNotEmpty('runtimeClassName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('schedulerName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'schedulerName')"
          :label="t('verrazzano.common.fields.podSpec.schedulerName')"
          @input="setFieldIfNotEmpty('schedulerName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('serviceAccountName')"
          :mode="mode"
          :options="serviceAccounts"
          option-label="metadata.name"
          :reduce="sa => sa.metadata.name"
          :placeholder="getNotSetPlaceholder(value, 'serviceAccountName')"
          :label="t('verrazzano.common.fields.podSpec.serviceAccountName')"
          @input="setFieldIfNotEmpty('serviceAccountName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subdomain')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subdomain')"
          :label="t('verrazzano.common.fields.podSpec.subdomain')"
          @input="setFieldIfNotEmpty('subdomain', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('terminationGracePeriodSeconds')"
          :mode="mode"
          type="Number"
          min="0"
          :placeholder="getNotSetPlaceholder(value, 'terminationGracePeriodSeconds')"
          :label="t('verrazzano.common.fields.podSpec.terminationGracePeriodSeconds')"
          @input="setNumberField('terminationGracePeriodSeconds', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.affinity') }}</h3>
      <Affinity
        :value="getField('affinity')"
        :mode="mode"
        @input="setFieldIfNotEmpty('affinity', $event)"
      />
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
      <h3>{{ t('verrazzano.common.titles.podSpec.containers') }}</h3>
      <Containers
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.initContainers') }}</h3>
      <Containers
        v-model="value"
        :mode="mode"
        root-field-name="initContainers"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.ephemeralContainers') }}</h3>
      <Containers
        v-model="value"
        :mode="mode"
        root-field-name="ephemeralContainers"
        use-ephemeral-containers
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.hostAliases') }}</h3>
      <HostAliases
        :value="getListField('hostAliases')"
        :mode="mode"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.readinessGates') }}</h3>
      <ReadinessGates
        :value="getListField('readinessGates')"
        :mode="mode"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.securityContext') }}</h3>
      <PodSecurityContext
        :value="getField('securityContext')"
        :mode="mode"
        @input="setFieldIfNotEmpty('securityContext', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.tolerations') }}</h3>
      <Tolerations
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.topologySpreadConstraints') }}</h3>
      <TopologySpreadConstraints
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSpec.volumes') }}</h3>
      <Volumes
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
      />
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
