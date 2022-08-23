<script>
// Added by Verrazzano
import AffinityTab from '@/components/verrazzano/AffinityTab';
import AuxiliaryImagesTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImagesTab';
import ContainerResourcesTab from '@/components/verrazzano/ContainerResourcesTab';
import ContainersTab from '@/components/verrazzano/ContainersTab';
import ContainerSecurityContextTab from '@/components/verrazzano/ContainerSecurityContextTab';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import HostAliasesTab from '@/components/verrazzano/HostAliasesTab';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import LabelsTab from '@/components/verrazzano/LabelsTab';
import PodSecurityContextTab from '@/components/verrazzano/PodSecurityContextTab';
import ProbeTuningTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab/ProbeTuningTab';
import ReadinessGatesTab from '@/components/verrazzano/ReadinessGatesTab';
import ServerShutdownTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab/ServerShutdownTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';
import TolerationsTab from '@/components/verrazzano/TolerationsTab';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VolumeMountsTab from '@/components/verrazzano/VolumeMountsTab';
import VolumesTab from '@/components/verrazzano/VolumesTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { SERVICE_ACCOUNT, NODE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ServerPodTab',
  components: {
    AffinityTab,
    AuxiliaryImagesTab,
    ContainerResourcesTab,
    ContainersTab,
    ContainerSecurityContextTab,
    EnvironmentVariables,
    HostAliasesTab,
    KeyValue,
    LabeledInput,
    LabeledSelect,
    LabelsTab,
    PodSecurityContextTab,
    ProbeTuningTab,
    ReadinessGatesTab,
    ServerShutdownTab,
    TabDeleteButton,
    TolerationsTab,
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
    tabName: {
      type:     String,
      required: true
    },
    tabLabel: {
      type:    String,
      default: ''
    },
  },
  data() {
    return {
      treeTabName:        this.tabName,
      treeTabLabel:       this.tabLabel,
      fetchInProgress:    true,
      namespace:          this.namespacedObject.metadata?.namespace,
      allServiceAccounts: {},
      serviceAccounts:    [],
      allNodes:           [],
    };
  },
  async fetch() {
    this.allServiceAccounts = {};

    const requests = { nodes: this.$store.dispatch('management/findAll', { type: NODE }) };

    if (this.$store.getters['cluster/schemaFor'](SERVICE_ACCOUNT)) {
      requests.serviceAccounts = this.$store.dispatch('management/findAll', { type: SERVICE_ACCOUNT });
    }

    const hash = await allHash(requests);

    if (hash.nodes) {
      this.allNodes = hash.nodes;
    }

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
  },
  created() {
    if (!this.treeTabLabel) {
      this.treeTabLabel = this.t('verrazzano.weblogic.tabs.serverPod');
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
  <TreeTab :name="treeTabName" :label="treeTabLabel">
    <template #beside-header>
      <TabDeleteButton
        :element-name="treeTabLabel"
        :mode="mode"
        @click="$emit('delete', value)"
      />
    </template>
    <template #default>
      <div class="row">
        <div class="col span-4">
          <LabeledSelect
            :value="getField('serviceAccountName')"
            :options="serviceAccounts"
            :mode="mode"
            option-label="metadata.name"
            :reduce="serviceAccount => serviceAccount.metadata.name"
            :placeholder="getNotSetPlaceholder(value, 'serviceAccountName')"
            :label="t('verrazzano.common.fields.podSpec.serviceAccountName')"
            @input="setFieldIfNotEmpty('serviceAccountName', $event)"
          />
        </div>
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
          <LabeledSelect
            :value="getField('nodeName')"
            :mode="mode"
            :options="allNodes"
            option-label="metadata.name"
            :reduce="node => node.metadata.name"
            :placeholder="getNotSetPlaceholder(value, 'nodeName')"
            :label="t('verrazzano.common.fields.podSpec.nodeName')"
            @input="setField('nodeName', $event)"
          />
        </div>
      </div>
      <div class="spacer-small" />
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getField('priorityClassName')"
            :mode="mode"
            :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
            :label="t('verrazzano.common.fields.podSpec.priorityClassName')"
            @input="setFieldIfNotEmpty('priorityClassName', $event)"
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
            @input="setField('schedulerName', $event)"
          />
        </div>
      </div>
    </template>
    <template #nestedTabs>
      <LabelsTab
        :value="value"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'labels')"
        @input="$emit('input', value)"
      />

      <TreeTab :name="createTabName(treeTabName, 'envVariables')" :label="t('verrazzano.common.tabs.environmentVariables')">
        <EnvironmentVariables
          :value="value"
          :mode="mode"
          :namespaced-object="namespacedObject"
          :enable-env-from-options="false"
          @input="$emit('input', value)"
        />
      </TreeTab>

      <AuxiliaryImagesTab
        :value="getListField('auxiliaryImages')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(treeTabName, 'auxiliaryImages')"
        @input="setFieldIfNotEmpty('auxiliaryImages', $event)"
      />

      <ProbeTuningTab
        :value="getField('livenessProbe')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'livenessProbe')"
        :tab-label="t('verrazzano.common.tabs.livenessProbe')"
        @input="setFieldIfNotEmpty('livenessProbe', $event)"
        @delete="setField('livenessProbe', undefined)"
      />

      <ProbeTuningTab
        :value="getField('readinessProbe')"
        :mode="mode"
        is-readiness-probe
        :tab-name="createTabName(treeTabName, 'readinessProbe')"
        :tab-label="t('verrazzano.common.tabs.readinessProbe')"
        @input="setFieldIfNotEmpty('readinessProbe', $event)"
        @delete="setField('readinessProbe', undefined)"
      />

      <ServerShutdownTab
        :value="getField('shutdown')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'shutdown')"
        @input="setFieldIfNotEmpty('shutdown', $event)"
        @delete="setField('shutdown', undefined)"
      />

      <ContainerResourcesTab
        :value="getField('resources')"
        :mode="mode"
        :tab-name="createTabName(treeTabName, 'resources')"
        @input="setFieldIfNotEmpty('resources', $event)"
        @delete="setField('resources', undefined)"
      />

      <TreeTab :name="createTabName(treeTabName, 'nodeSelector')" :label="t('verrazzano.weblogic.tabs.nodeSelector')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.weblogic.tabs.nodeSelector')"
            :mode="mode"
            @click="setField('nodeSelector', undefined)"
          />
        </template>
        <template #default>
          <KeyValue
            :value="getField('nodeSelector')"
            :mode="mode"
            :add-label="t('verrazzano.common.buttons.addNodeSelector')"
            :read-allowed="false"
            @input="setFieldIfNotEmpty('nodeSelector', $event)"
          />
        </template>
      </TreeTab>

      <AffinityTab
        :value="getField('affinity')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'affinity')"
        @input="setFieldIfNotEmpty('affinity', $event)"
      />

      <HostAliasesTab
        :value="getListField('hostAliases')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'hostAliases')"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />

      <ReadinessGatesTab
        :value="getListField('readinessGates')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'readinessGates')"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
      />

      <ContainersTab
        :value="getListField('containers')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(tabName, 'containers')"
        @input="setFieldIfNotEmpty('containers', $event)"
      />

      <ContainersTab
        :value="getListField('initContainers')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(tabName, 'initContainers')"
        :tab-label="t('verrazzano.common.tabs.initContainers')"
        :type-label="t('verrazzano.common.tabs.initContainer')"
        @input="setFieldIfNotEmpty('initContainers', $event)"
      />

      <VolumesTab
        :value="getListField('volumes')"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabName(tabName, 'volumes')"
        @input="setFieldIfNotEmpty('volumes', $event)"
      />

      <VolumeMountsTab
        :value="getListField('volumeMounts')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'volumeMounts')"
        @input="setFieldIfNotEmpty('volumeMounts', $event)"
      />

      <TolerationsTab
        :value="getListField('tolerations')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'tolerations')"
        @input="setFieldIfNotEmpty('tolerations', $event)"
      />

      <PodSecurityContextTab
        :value="getField('podSecurityContext')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'podSecurityContext')"
        @input="setFieldIfNotEmpty('podSecurityContext', $event)"
        @delete="setField('podSecurityContext', undefined)"
      />

      <ContainerSecurityContextTab
        :value="getField('containerSecurityContext')"
        :mode="mode"
        :tab-name="createTabName(tabName, 'containerSecurityContext')"
        @input="setFieldIfNotEmpty('containerSecurityContext', $event)"
        @delete="setField('containerSecurityContext', undefined)"
      />
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../../verrazzano-styles.css";
</style>
