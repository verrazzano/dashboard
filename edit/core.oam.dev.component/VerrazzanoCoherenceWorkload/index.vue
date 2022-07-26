<script>
// Added by Verrazzano
import Affinity from '@/components/verrazzano/Affinity';
import ApplicationSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ApplicationSpec';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Checkbox from '@/components/form/Checkbox';
import CoherenceActions from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceActions';
import CoherenceGeneralData from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceGeneralData';
import CoherenceLifecycle from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceLifecycle';
import CoherenceSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceSpec';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import ConfigMapVolumeSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ConfigMapVolumeSpec';
import ContainerResources from '@/components/verrazzano/ContainerResources';
import Containers from '@/components/verrazzano/Containers';
import ContainerSecurityContext from '@/components/verrazzano/ContainerSecurityContext';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import JVMSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/JVMSpec';
import Labels from '@/components/form/Labels';
import NamedPortSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/NamedPortSpec';
import NetworkSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/NetworkSpec';
import NodeSelector from '@/components/verrazzano/NodeSelector';
import PodSecurityContext from '@/components/verrazzano/PodSecurityContext';
import ReadinessGates from '@/components/verrazzano/ReadinessGates';
import ReadinessProbeSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ReadinessProbeSpec';
import SecretVolumeSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/SecretVolumeSpec';
import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';
import Tolerations from '@/components/verrazzano/Tolerations';
import TopologySpreadConstraints from '@/components/verrazzano/TopologySpreadConstraints';
import Volumes from '@/components/verrazzano/Volumes';
import VolumeClaimTemplateSpec from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/VolumeClaimTemplateSpec';
import VolumeMounts from '@/components/verrazzano/VolumeMounts';

const TAB_WEIGHT_MAP = {
  general:                   99,
  env:                       98,
  coherence:                 97,
  app:                       96,
  jvm:                       95,
  ports:                     94,
  lifecycle:                 93,
  initContainers:            92,
  sideCars:                  91,
  configMapVolumes:          90,
  secretVolumes:             89,
  volumes:                   88,
  volumeClaimTemplates:      87,
  volumeMounts:              86,
  readinessProbe:            85,
  livenessProbe:             84,
  startupProbe:              83,
  readinessGates:            82,
  actions:                   81,
  resources:                 80,
  affinity:                  79,
  nodeSelector:              78,
  tolerations:               77,
  topologySpreadConstraints: 76,
  network:                   75,
  podSecurity:               74,
  containerSecurity:         73,
};

export default {
  name:       'VerrazzanoCoherenceWorkload',
  components: {
    Affinity,
    ApplicationSpec,
    ArrayListGrouped,
    Checkbox,
    CoherenceActions,
    CoherenceGeneralData,
    CoherenceLifecycle,
    CoherenceSpec,
    ConfigMapVolumeSpec,
    ContainerResources,
    Containers,
    ContainerSecurityContext,
    EnvironmentVariables,
    JVMSpec,
    Labels,
    NamedPortSpec,
    NetworkSpec,
    NodeSelector,
    PodSecurityContext,
    ReadinessGates,
    ReadinessProbeSpec,
    SecretVolumeSpec,
    Tab,
    Tabbed,
    Tolerations,
    TopologySpreadConstraints,
    VolumeClaimTemplateSpec,
    VolumeMounts,
    Volumes,
  },
  mixins: [CoherenceWorkloadHelper],
  props:  {
    value: {
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    return { tabWeightMap: TAB_WEIGHT_MAP };
  },
  methods:  {
    initSpec() {
      this.$set(this.value, 'spec', {
        workload: {
          apiVersion: this.verrazzanoComponentApiVersion,
          kind:       'VerrazzanoCoherenceWorkload',
          spec:       {
            template: {
              metadata: { },
              spec:     { }
            }
          }
        }
      });
    },
  },
  created() {
    if (!this.value.spec?.workload?.spec?.template) {
      this.initSpec();
    }
  },
};
</script>

<template>
  <Tabbed side-tabs>
    <Tab :label="t('verrazzano.common.tabs.general')" name="general" :weight="tabWeightMap['general']">
      <CoherenceGeneralData :value="workloadTemplateSpec" :mode="mode" />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.env')" name="env" :weight="tabWeightMap['env']" :show-header="false">
      <div>
        <h3>{{ t('verrazzano.common.titles.envVars') }}</h3>
        <EnvironmentVariables
          v-model="workloadTemplateSpec"
          :mode="mode"
          :enable-env-from-options="false"
          :namespaced-object="value"
        />
        <div class="spacer-small" />
        <div class="row">
          <div class="col span-6">
            <Checkbox
              :value="getWorkloadSpecField('enableServiceLinks')"
              :mode="mode"
              :label="t('verrazzano.common.titles.podSped.enableServiceLinks')"
              @input="setBooleanField('enableServiceLinks', $event)"
            />
          </div>
        </div>
        <div class="spacer" />
        <Labels v-model="workloadTemplateSpec" :mode="mode" />
      </div>
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.coherence')" name="coherence" :weight="tabWeightMap['coherence']">
      <CoherenceSpec
        :value="getWorkloadSpecField('coherence')"
        :mode="mode"
        :namespaced-object="value"
        @input="setWorkloadSpecFieldIfNotEmpty('coherence', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.application')" name="application" :weight="tabWeightMap['app']">
      <ApplicationSpec
        :value="getWorkloadSpecField('application')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('application', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.jvm')" name="jvm" :weight="tabWeightMap['jvm']">
      <JVMSpec
        :value="getWorkloadSpecField('jvm')"
        :mode="mode"
        :namespaced-object="value"
        @input="setWorkloadSpecFieldIfNotEmpty('jvm', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.ports')" name="ports" :weight="tabWeightMap['ports']">
      <ArrayListGrouped
        :value="getWorkloadSpecListField('ports')"
        :default-add-value="{ }"
        :mode="mode"
        :add-label="t('verrazzano.coherence.buttons.addPort')"
        @input="setWorkloadSpecFieldIfNotEmpty('ports', $event)"
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
          <NamedPortSpec
            v-model="props.row.value"
            :mode="mode"
            :namespaced-object="value"
          />
        </template>
      </ArrayListGrouped>
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.lifecycle')" name="lifecycle" :weight="tabWeightMap['lifecycle']">
      <CoherenceLifecycle
        v-model="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />
    </Tab>
    <Tab :label="t('verrazzano.common.tabs.initContainers')" name="initContainers" :weight="tabWeightMap['initContainers']">
      <Containers
        v-model="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
        root-field-name="initContainers"
        :add-button-label="t('verrazzano.common.buttons.addInitContainer')"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.sideCars')" name="sideCars" :weight="tabWeightMap['sideCars']">
      <Containers
        v-model="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
        root-field-name="sideCars"
        :add-button-label="t('verrazzano.coherence.buttons.addSidecarContainer')"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.configMapVolumes')" name="configMapVolumes" :weight="tabWeightMap['configMapVolumes']">
      <ArrayListGrouped
        v-model="workloadTemplateSpec.configMapVolumes"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.coherence.buttons.addConfigMapVolume')"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showWorkloadSpecListRemoveButton('configMapVolumes')"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <ConfigMapVolumeSpec
            v-model="props.row.value"
            :mode="mode"
            :namespaced-object="value"
          />
        </template>
      </ArrayListGrouped>
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.secretVolumes')" name="secretVolumes" :weight="tabWeightMap['secretVolumes']">
      <ArrayListGrouped
        v-model="workloadTemplateSpec.secretVolumes"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.coherence.buttons.addSecretVolume')"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showWorkloadSpecListRemoveButton('secretVolumes')"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <SecretVolumeSpec
            v-model="props.row.value"
            :mode="mode"
            :namespaced-object="value"
          />
        </template>
      </ArrayListGrouped>
    </Tab>
    <Tab :label="t('verrazzano.common.tabs.volumes')" name="volumes" :weight="tabWeightMap['volumes']">
      <Volumes
        v-model="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.volumeClaimTemplates')" name="volumeClaimTemplates" :weight="tabWeightMap['volumeClaimTemplates']">
      <ArrayListGrouped
        v-model="workloadTemplateSpec.volumeClaimTemplates"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.coherence.buttons.addVolumeClaimTemplate')"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showWorkloadSpecListRemoveButton('volumeClaimTemplates')"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeProps.remove"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <VolumeClaimTemplateSpec
            v-model="props.row.value"
            :mode="mode"
            :namespaced-object="value"
          />
        </template>
      </ArrayListGrouped>
    </Tab>
    <Tab :label="t('verrazzano.common.tabs.volumeMounts')" name="volumeMounts" :weight="tabWeightMap['volumeMounts']">
      <VolumeMounts v-model="workloadTemplateSpec" :mode="mode" />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.readinessProbe')" name="readinessProbe" :weight="tabWeightMap['readinessProbe']">
      <ReadinessProbeSpec
        :value="getWorkloadSpecField('readinessProbe')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('readinessProbe', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.livenessProbe')" name="livenessProbe" :weight="tabWeightMap['livenessProbe']">
      <ReadinessProbeSpec
        :value="getWorkloadSpecField('livenessProbe')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('livenessProbe', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.startupProbe')" name="startupProbe" :weight="tabWeightMap['startupProbe']">
      <ReadinessProbeSpec
        :value="getWorkloadSpecField('startupProbe')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('startupProbe', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.readinessGates')" name="readinessGates" :weight="tabWeightMap['readinessGates']">
      <ReadinessGates
        :value="getWorkloadSpecListField('readinessGates')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('readinessGates', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.actions')" name="actions" :weight="tabWeightMap['actions']">
      <CoherenceActions
        v-model="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.resources')" name="resources" :weight="tabWeightMap['resources']">
      <ContainerResources
        :value="getWorkloadSpecField('resources')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('resources', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.affinity')" name="affinity" :weight="tabWeightMap['affinity']">
      <Affinity
        :value="getWorkloadSpecField('affinity')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('affinity', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.nodeSelector')" name="nodeSelector" :weight="tabWeightMap['nodeSelector']">
      <NodeSelector
        :value="getWorkloadSpecField('nodeSelector')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('nodeSelector', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.tolerations')" name="tolerations" :weight="tabWeightMap['tolerations']">
      <Tolerations
        v-model="workloadTemplateSpec"
        :mode="mode"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.topologySpreadConstraints')" name="topologySpreadConstraints" :weight="tabWeightMap['topologySpreadConstraints']">
      <TopologySpreadConstraints
        v-model="workloadTemplateSpec"
        :mode="mode"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.network')" name="network" :weight="tabWeightMap['network']">
      <NetworkSpec
        :value="getWorkloadSpecField('network')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('network', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.podSecurity')" name="podSecurity" :weight="tabWeightMap['podSecurity']">
      <PodSecurityContext
        :value="getWorkloadSpecField('securityContext')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('securityContext', $event)"
      />
    </Tab>
    <Tab :label="t('verrazzano.coherence.tabs.containerSecurity')" name="containerSecurity" :weight="tabWeightMap['containerSecurity']">
      <ContainerSecurityContext
        :value="getWorkloadSpecField('containerSecurityContext')"
        :mode="mode"
        @input="setWorkloadSpecFieldIfNotEmpty('containerSecurityContext', $event)"
      />
    </Tab>
  </Tabbed>
</template>

<style scoped>

</style>
