<script>
import AffinityTab from '@/components/verrazzano/AffinityTab';
import Checkbox from '@/components/form/Checkbox';
import ContainersTab from '@/components/verrazzano/ContainersTab';
import HostAliasesTab from '@/components/verrazzano/HostAliasesTab';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import PodDNSConfig from '@/components/verrazzano/PodSpecTab/PodDNSConfig';
import PodSecurityContextTab from '@/components/verrazzano/PodSecurityContextTab';
import ReadinessGatesTab from '@/components/verrazzano/ReadinessGatesTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import Tolerations from '@/components/verrazzano/Tolerations';
import TopologySpreadConstraintsTab from '@/components/verrazzano/TopologySpreadConstraintsTab';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import VolumesTab from '@/components/verrazzano/VolumesTab';

import { SERVICE_ACCOUNT } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'PodSpecTab',
  components: {
    AffinityTab,
    Checkbox,
    ContainersTab,
    HostAliasesTab,
    LabeledInput,
    LabeledSelect,
    PodDNSConfig,
    PodSecurityContextTab,
    ReadinessGatesTab,
    TabDeleteButton,
    Tolerations,
    TopologySpreadConstraintsTab,
    TreeTab,
    VolumesTab,
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
    tabName: {
      type:     String,
      required: true,
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      loading:            true,
      fetchInProgress:    true,
      namespace:          this.namespacedObject.metadata?.name,
      allServiceAccounts: {},
      serviceAccounts:    [],
      treeTabName:        this.tabName,
      treeTabLabel:       this.tabLabel,
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
    },
    deleteTolerations() {
      this.setField('tolerations', undefined);
    },
    deletePodDNSConfig() {
      this.setField('dnsConfig', undefined);
    }
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.common.tabs.podSpec');
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
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #default>
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
    </template>
    <template #nestedTabs>
      <ContainersTab
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'containers')"
        @input="$emit('input', value)"
      />
      <ContainersTab
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        root-field-name="initContainers"
        :tab-name="createTabName(treeTabName, 'initContainers')"
        :tab-label="t('verrazzano.common.tabs.initContainers')"
        @input="$emit('input', value)"
      />
      <ContainersTab
        v-model="value"
        :mode="mode"
        root-field-name="ephemeralContainers"
        use-ephemeral-containers
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'ephemeralContainers')"
        :tab-label="t('verrazzano.common.tabs.ephemeralContainers')"
        @input="$emit('input', value)"
      />
      <VolumesTab
        :value="getListField('volumes')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'volumes')"
        @input="setFieldIfNotEmpty('volumes', $event)"
      />
      <AffinityTab
        :value="getField('affinity')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'affinity')"
        @input="setFieldIfNotEmpty('affinity', $event)"
      />
      <TopologySpreadConstraintsTab
        :value="getListField('topologySpreadConstraints')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'topologySpreadConstraints')"
        @input="setFieldIfNotEmpty('topologySpreadConstraints', $event)"
      />
      <ReadinessGatesTab
        :value="getListField('readinessGates')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'readinessGates')"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
      />
      <TreeTab :name="createTabName(treeTabName, 'tolerations')" :label="t('verrazzano.common.tabs.tolerations')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.tolerations')"
            :mode="mode"
            @click="deleteTolerations()"
          />
        </template>
        <template #default>
          <Tolerations
            v-model="value"
            :mode="mode"
            @input="$emit('input', value)"
          />
        </template>
      </TreeTab>
      <PodSecurityContextTab
        :value="getField('securityContext')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'securityContext')"
        @input="setFieldIfNotEmpty('securityContext', $event)"
      />
      <HostAliasesTab
        :value="getListField('hostAliases')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'hostAliases')"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />
      <TreeTab
        :name="createTabName(treeTabName, 'dnsConfig')"
        :label="t('verrazzano.common.tabs.podDNSConfig')"
      >
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.common.tabs.podDNSConfig')"
            :mode="mode"
            @click="deletePodDNSConfig()"
          />
        </template>
        <template #default>
          <PodDNSConfig
            :value="getField('dnsConfig')"
            :mode="mode"
            @input="setFieldIfNotEmpty('dnsConfig', $event)"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
