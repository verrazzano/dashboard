<script>
// Added by Verrazzano
import AuxiliaryImages from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImages';
import ContainerProbe from '@/components/verrazzano/ContainerProbe';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import Containers from '@/components/verrazzano/Containers';
import ContainerSecurityContext from '@/components/verrazzano/ContainerSecurityContext';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import HostAliases from '@/components/verrazzano/HostAliases';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import Labels from '@/components/verrazzano/Labels';
import PodScheduler from '@/components/verrazzano/PodScheduler';
import PodSecurityContext from '@/components/verrazzano/PodSecurityContext';
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
  name:       'ServerPodTabs',
  components: {
    AuxiliaryImages,
    ContainerProbe,
    ContainerResources,
    Containers,
    ContainerSecurityContext,
    EnvironmentVariables,
    HostAliases,
    LabeledInput,
    LabeledSelect,
    Labels,
    PodScheduler,
    PodSecurityContext,
    ReadinessGates,
    // ServerPod,
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
    this.allServiceAccounts = {};

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
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.serverPod.restartPolicy')"
          :placeholder="getNotSetPlaceholder(value, 'restartPolicy')"
          :options="[
            {
              value: 'Always',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.always')
            },
            {
              value: 'OnFailure',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.onFailure')
            },
            {
              value: 'Never',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.restartPolicy.never')
            },
          ]"
          option-key="value"
          option-label="label"
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
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.scheduling') }}</h3>
      <PodScheduler
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.common.titles.serverPod.hostAliases') }}</h3>
      <HostAliases
        :value="getListField('hostAliases')"
        :mode="mode"
        @input="setFieldIfNotEmpty('hostAliases', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.livenessProbe') }}</h3>
      <ContainerProbe
        :value="getField('livenessProbe')"
        :mode="mode"
        is-wko-server-pod
        @input="setFieldIfNotEmpty('livenessProbe', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.readinessProbe') }}</h3>
      <ContainerProbe
        :value="getField('readinessProbe')"
        :mode="mode"
        is-readiness-probe
        is-wko-server-pod
        @input="setFieldIfNotEmpty('readinessProbe', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.readinessGates') }}</h3>
      <ReadinessGates
        :value="getListField('readinessGates')"
        :mode="mode"
        @input="setFieldIfNotEmpty('readinessGates', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.resources') }}</h3>
      <ContainerResources
        :value="getField('resources')"
        :mode="mode"
        @input="setFieldIfNotEmpty('resources', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.shutdown') }}</h3>
      <ServerShutdown
        :value="getField('shutdown')"
        :mode="mode"
        @input="setFieldIfNotEmpty('shutdown', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.tolerations') }}</h3>
      <Tolerations
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.volumes') }}</h3>
      <Volumes
        v-model="value"
        :mode="mode"
        :namespaced-object="namespacedObject"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.volumeMounts') }}</h3>
      <VolumeMounts
        v-model="value"
        :mode="mode"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.podSecurityContext') }}</h3>
      <PodSecurityContext
        :value="getField('podSecurityContext')"
        :mode="mode"
        @input="setFieldIfNotEmpty('podSecurityContext', $event)"
      />
    </div>
    <div class="spacer" />
    <div>
      <h3>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.serverPod.containerSecurityContext') }}</h3>
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

      <TreeTab
        :label="t('verrazzano.weblogic.tabs.containers')"
        :name="createTabKey(navPrefix, 'containers')"
      >
        <Containers
          v-model="value"
          :mode="mode"
          :namespaced-object="value"
        />
      </TreeTab>

      <TreeTab
        :label="t('verrazzano.weblogic.tabs.initContainers')"
        :name="createTabKey(navPrefix, 'initContainers')"
      >
        <Containers
          v-model="value"
          :mode="mode"
          :namespaced-object="value"
          :add-button-label="t('verrazzano.common.buttons.addInitContainer')"
          root-field-name="initContainers"
        />
      </TreeTab>

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
