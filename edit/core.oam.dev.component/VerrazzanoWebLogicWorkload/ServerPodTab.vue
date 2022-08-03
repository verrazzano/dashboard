<script>
// Added by Verrazzano
import AuxiliaryImages from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImages';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import ContainersTab from '@/components/verrazzano/ContainersTab';
import ContainerSecurityContext from '@/components/verrazzano/ContainerSecurityContext';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import HostAliases from '@/components/verrazzano/HostAliases';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/verrazzano/Labels';
import PodScheduler from '@/components/verrazzano/PodScheduler';
import PodSecurityContext from '@/components/verrazzano/PodSecurityContext';
import ProbeTuning from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ProbeTuning';
import ReadinessGates from '@/components/verrazzano/ReadinessGates';
import ServerShutdown from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerShutdown';
import Tolerations from '@/components/verrazzano/Tolerations';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import VolumeMounts from '@/components/verrazzano/VolumeMounts';
import Volumes from '@/components/verrazzano/Volumes';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { SERVICE_ACCOUNT } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ServerPodTab',
  components: {
    AuxiliaryImages,
    ContainerResources,
    ContainersTab,
    ContainerSecurityContext,
    EnvironmentVariables,
    HostAliases,
    LabeledInput,
    LabeledSelect,
    Labels,
    PodScheduler,
    PodSecurityContext,
    ProbeTuning,
    ReadinessGates,
    ServerShutdown,
    Tolerations,
    TreeTab,
    VolumeMounts,
    Volumes,
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
      namespace:          '',
      allServiceAccounts: {},
    };
  },
  async fetch() {
    const requests = { };

    if (this.$store.getters['cluster/schemaFor'](SERVICE_ACCOUNT)) {
      requests.serviceAccounts = this.$store.dispatch('cluster/findAll', { type: SERVICE_ACCOUNT });
    }

    const hash = await allHash(requests);

    if (hash.serviceAccounts) {
      this.sortObjectsByNamespace(hash.serviceAccounts, this.allServiceAccounts);
    }
  },
  computed: {
    serviceAccounts() {
      const namespace = this.get(this.namespacedObject, 'metadata.namespace');

      return this.allServiceAccounts[namespace] || [];
    },
  },
};
</script>

<template>
  <TreeTab
    :label="t('verrazzano.weblogic.tabs.serverPod')"
    :name="createTabKey(navPrefix, 'serverPod')"
  >
    <div class="row">
      <div class="col span-3">
        <LabeledSelect
          :value="getField('serviceAccountName')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.serviceAccountName')"
          :placeholder="getNotSetPlaceholder(value, 'serviceAccountName')"
          :options="serviceAccounts"
          :mode="mode"
          option-label="metadata.name"
          :reduce="serviceAccount => serviceAccount.metadata.name"
          @input="setField('serviceAccountName', $event)"
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
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.restartPolicy')"
          @input="setField('restartPolicy', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('priorityClassName')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.priorityClassName')"
          :placeholder="getNotSetPlaceholder(value, 'priorityClassName')"
          @input="setField('priorityClassName', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('runtimeClassName')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.runtimeClassName')"
          :placeholder="getNotSetPlaceholder(value, 'runtimeClassName')"
          @input="setField('runtimeClassName', $event)"
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
      <h3>{{ t('verrazzano.weblogic.titles.serverPod.hostAliases') }}</h3>
      <HostAliases
        :value="getListField('hostAliases')"
        :mode="mode"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
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
      <h3>{{ t('verrazzano.common.titles.readinessGates') }}</h3>
      <ReadinessGates
        :value="getListField('readinessGates')"
        :mode="mode"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
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
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.tolerations') }}</h3>
      <Tolerations
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.volumes') }}</h3>
      <Volumes
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.volumeMounts') }}</h3>
      <VolumeMounts
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.podSecurityContext') }}</h3>
      <PodSecurityContext
        :value="getField('podSecurityContext')"
        :mode="mode"
        @input="setFieldIfNotEmpty('podSecurityContext', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.containerSecurityContext') }}</h3>
      <ContainerSecurityContext
        :value="getField('containerSecurityContext')"
        :mode="mode"
        @input="setFieldIfNotEmpty('containerSecurityContext', $event)"
      />
    </div>

    <template #nestedTabs>
      <TreeTab
        :label="t('verrazzano.weblogic.tabs.auxiliaryImages')"
        :name="createTabKey(navPrefix, 'auxiliaryImages')"
      >
        <AuxiliaryImages
          v-model="value"
          :mode="mode"
          :namespaced-object="namespacedObject"
        />
      </TreeTab>

      <ContainersTab
        :value="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="createTabKey(navPrefix, 'containers')"
        :tab-label="t('verrazzano.common.tabs.containers')"
        @input="$emit('input', value)"
      />

      <ContainersTab
        :value="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :add-button-label="t('verrazzano.common.buttons.addInitContainer')"
        root-field-name="initContainers"
        :tab-name="createTabKey(navPrefix, 'initContainers')"
        :tab-label="t('verrazzano.common.tabs.initContainers')"
        @input="$emit('input', value)"
      />

      <TreeTab
        :label="t('verrazzano.weblogic.tabs.envVariables')"
        :name="createTabKey(navPrefix, 'envVariables')"
      >
        <EnvironmentVariables
          v-model="value"
          :mode="mode"
          :namespaced-object="value"
          :enable-env-from-options="false"
        />
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
