<script>
// Added by Verrazzano
import AffinityTab from '@/components/verrazzano/AffinityTab';
import AuxiliaryImages from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImages';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import ContainersTab from '@/components/verrazzano/ContainersTab';
import ContainerSecurityContextTab from '@/components/verrazzano/ContainerSecurityContextTab';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import HostAliasesTab from '@/components/verrazzano/HostAliasesTab';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/verrazzano/Labels';
import PodScheduler from '@/components/verrazzano/PodScheduler';
import PodSecurityContextTab from '@/components/verrazzano/PodSecurityContextTab';
import ProbeTuning from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ProbeTuning';
import ReadinessGatesTab from '@/components/verrazzano/ReadinessGatesTab';
import ServerShutdown from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerShutdown';
import Tolerations from '@/components/verrazzano/Tolerations';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VolumeMountsTab from '@/components/verrazzano/VolumeMountsTab';
import VolumesTab from '@/components/verrazzano/VolumesTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { SERVICE_ACCOUNT } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ServerPodTab',
  components: {
    AffinityTab,
    AuxiliaryImages,
    ContainerResources,
    ContainersTab,
    ContainerSecurityContextTab,
    EnvironmentVariables,
    HostAliasesTab,
    LabeledInput,
    LabeledSelect,
    Labels,
    PodScheduler,
    PodSecurityContextTab,
    ProbeTuning,
    ReadinessGatesTab,
    ServerShutdown,
    Tolerations,
    TreeTab,
    VolumeMountsTab,
    VolumesTab,
  },
  mixins: [WeblogicWorkloadHelper],
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
    navPrefix: {
      type:    String,
      default: undefined
    }
  },
  data() {
    return {
      fetchInProgress:    true,
      namespace:          this.namespacedObject.metadata?.namespace,
      allServiceAccounts: {},
      serviceAccounts:    [],
    };
  },
  async fetch() {
    this.allServiceAccounts = {};

    const requests = { };

    if (this.$store.getters['cluster/schemaFor'](SERVICE_ACCOUNT)) {
      requests.serviceAccounts = this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT });
    }

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
  watch: {
    fetchInProgress() {
      this.resetServiceAccounts();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetServiceAccounts();
    }
  },
};
</script>

<template>
  <TreeTab
    :label="t('verrazzano.weblogic.tabs.serverPod')"
    :name="createTabName(navPrefix, 'serverPod')"
  >
    <div class="row">
      <div class="col span-3">
        <LabeledSelect
          :value="getField('serviceAccountName')"
          :label="t('verrazzano.common.fields.podSpec.serviceAccountName')"
          :placeholder="getNotSetPlaceholder(value, 'serviceAccountName')"
          :options="serviceAccounts"
          :mode="mode"
          option-label="metadata.name"
          :reduce="serviceAccount => serviceAccount.metadata.name"
          @input="setFieldIfNotEmpty('serviceAccountName', $event)"
        />
      </div>
      <div class="col span-3">
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
      <div class="col span-3">
        <LabeledInput
          :value="getField('priorityClassName')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.priorityClassName')"
          :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
          @input="setFieldIfNotEmpty('priorityClassName', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('runtimeClassName')"
          :mode="mode"
          :label="t('verrazzano.common.fields.podSpec.runtimeClassName')"
          :placeholder="getNotSetPlaceholder(value, 'runtimeClassName')"
          @input="setFieldIfNotEmpty('runtimeClassName', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <Labels :value="value" :mode="mode" />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.scheduling') }}</h3>
      <PodScheduler
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.livenessProbe') }}</h3>
      <ProbeTuning
        :value="getField('livenessProbe')"
        :mode="mode"
        @input="setFieldIfNotEmpty('livenessProbe', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.readinessProbe') }}</h3>
      <ProbeTuning
        :value="getField('readinessProbe')"
        :mode="mode"
        is-readiness-probe
        @input="setFieldIfNotEmpty('readinessProbe', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.resources') }}</h3>
      <ContainerResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.weblogic.titles.serverPod.shutdown') }}</h3>
      <ServerShutdown
        :value="getField('shutdown')"
        :mode="mode"
        @input="setFieldIfNotEmpty('shutdown', $event)"
      />
    </div>

    <template #nestedTabs>
      <TreeTab
        :label="t('verrazzano.weblogic.tabs.envVariables')"
        :name="createTabName(navPrefix, 'envVariables')"
      >
        <EnvironmentVariables
          :value="value"
          :mode="mode"
          :namespaced-object="namespacedObject"
          :enable-env-from-options="false"
          @input="$emit('input', value)"
        />
      </TreeTab>

      <TreeTab
        :label="t('verrazzano.weblogic.tabs.auxiliaryImages')"
        :name="createTabName(navPrefix, 'auxiliaryImages')"
      >
        <AuxiliaryImages
          :value="value"
          :mode="mode"
          :namespaced-object="namespacedObject"
          @input="$emit('input', value)"
        />
      </TreeTab>

      <AffinityTab
        :value="getField('affinity')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'affinity')"
        @input="setFieldIfNotEmpty('affinity', $event)"
      />

      <HostAliasesTab
        :value="getListField('hostAliases')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'hostAliases')"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />

      <ReadinessGatesTab
        :value="getListField('readinessGates')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'readinessGates')"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
      />

      <ContainersTab
        :value="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(navPrefix, 'containers')"
        @input="$emit('input', value)"
      />

      <ContainersTab
        :value="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        root-field-name="initContainers"
        :tab-name="createTabName(navPrefix, 'initContainers')"
        :tab-label="t('verrazzano.common.tabs.initContainers')"
        :type-label="t('verrazzano.common.tabs.initContainer')"
        @input="$emit('input', value)"
      />

      <VolumesTab
        :value="getListField('volumes')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(navPrefix, 'volumes')"
        @input="setFieldIfNotEmpty('volumes', $event)"
      />

      <VolumeMountsTab
        :value="getListField('volumeMounts')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'volumeMounts')"
        @input="setFieldIfNotEmpty('volumeMounts', $event)"
      />

      <TreeTab :name="createTabName(navPrefix, 'tolerations')" :label="t('verrazzano.common.tabs.tolerations')">
        <Tolerations
          v-model="value"
          :mode="mode"
        />
      </TreeTab>

      <PodSecurityContextTab
        :value="getField('podSecurityContext')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'podSecurityContext')"
        @input="setFieldIfNotEmpty('podSecurityContext', $event)"
      />

      <ContainerSecurityContextTab
        :value="getField('containerSecurityContext')"
        :mode="mode"
        :tab-name="createTabName(navPrefix, 'containerSecurityContext')"
        @input="setFieldIfNotEmpty('containerSecurityContext', $event)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
