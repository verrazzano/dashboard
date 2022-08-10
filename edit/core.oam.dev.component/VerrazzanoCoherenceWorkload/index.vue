<script>
// Added by Verrazzano
import AffinityTab from '@/components/verrazzano/AffinityTab';
import ApplicationSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ApplicationSpecTab';
import CoherenceActionsTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceActionsTab';
import CoherenceGeneralTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceGeneralTab';
import CoherenceSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/CoherenceSpecTab';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import ConfigMapVolumesTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ConfigMapVolumesTab';
import ContainerResourcesTab from '@/components/verrazzano/ContainerResourcesTab';
import ContainerSecurityContextTab from '@/components/verrazzano/ContainerSecurityContextTab';
import ContainersTab from '@/components/verrazzano/ContainersTab';
import EnvironmentVariables from '@/components/verrazzano/EnvironmentVariables';
import JVMSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/JVMSpecTab';
import Labels from '@/components/verrazzano/Labels';
import NamedPortsSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/NamedPortsSpecTab';
import NetworkSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/NetworkSpecTab';
import NodeSelector from '@/components/verrazzano/NodeSelector';
import PodSecurityContextTab from '@/components/verrazzano/PodSecurityContextTab';
import ProbeTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ProbeTab';
import ReadinessGatesTab from '@/components/verrazzano/ReadinessGatesTab';
import ReadinessProbeSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ReadinessProbeSpecTab';
import ScalingSpecTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/ScalingSpecTab';
import SecretVolumesTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/SecretVolumesTab';
import StartQuorumsTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/StartQuorumsTab';
import TolerationsTab from '@/components/verrazzano/TolerationsTab';
import TopologySpreadConstraintsTab from '@/components/verrazzano/TopologySpreadConstraintsTab';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import VolumeClaimTemplatesTab from '@/edit/core.oam.dev.component/VerrazzanoCoherenceWorkload/VolumeClaimTemplatesTab';
import VolumeMountsTab from '@/components/verrazzano/VolumeMountsTab';
import VolumesTab from '@/components/verrazzano/VolumesTab';
import TabDeleteButton from '@/components/verrazzano/TabDeleteButton';

export default {
  name:       'VerrazzanoCoherenceWorkload',
  components: {
    TabDeleteButton,
    AffinityTab,
    ApplicationSpecTab,
    CoherenceActionsTab,
    CoherenceGeneralTab,
    CoherenceSpecTab,
    ConfigMapVolumesTab,
    ContainerResourcesTab,
    ContainerSecurityContextTab,
    ContainersTab,
    EnvironmentVariables,
    JVMSpecTab,
    Labels,
    NamedPortsSpecTab,
    NetworkSpecTab,
    NodeSelector,
    PodSecurityContextTab,
    ProbeTab,
    ReadinessGatesTab,
    ReadinessProbeSpecTab,
    ScalingSpecTab,
    SecretVolumesTab,
    StartQuorumsTab,
    TolerationsTab,
    TopologySpreadConstraintsTab,
    TreeTab,
    TreeTabbed,
    VolumeClaimTemplatesTab,
    VolumeMountsTab,
    VolumesTab,
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
  <TreeTabbed>
    <template #nestedTabs>
      <CoherenceGeneralTab
        :value="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
        tab-name="general"
        @input="$emit('input', value)"
      />
      <CoherenceSpecTab
        :value="getWorkloadSpecField('coherence')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="coherence"
        @input="setWorkloadSpecFieldIfNotEmpty('coherence', $event)"
        @delete="setWorkloadSpecField('coherence', undefined)"
      />
      <ApplicationSpecTab
        :value="getWorkloadSpecField('application')"
        :mode="mode"
        tab-name="application"
        @input="setWorkloadSpecFieldIfNotEmpty('application', $event)"
        @delete="setWorkloadSpecField('application', undefined)"
      />
      <JVMSpecTab
        :value="getWorkloadSpecField('jvm')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="jvm"
        @input="setWorkloadSpecFieldIfNotEmpty('jvm', $event)"
        @delete="setWorkloadSpecField('jvm', undefined)"
      />
      <NamedPortsSpecTab
        :value="getWorkloadSpecListField('ports')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="ports"
        @input="setWorkloadSpecFieldIfNotEmpty('ports', $event)"
      />
      <ScalingSpecTab
        :value="getWorkloadSpecField('scaling')"
        :mode="mode"
        tab-name="scaling"
        @input="setWorkloadSpecFieldIfNotEmpty('scaling', $event)"
        @delete="setWorkloadSpecField('scaling', undefined)"
      />
      <ProbeTab
        :value="getWorkloadSpecField('suspendProbe')"
        :mode="mode"
        tab-name="suspendProbe"
        :tab-label="t('verrazzano.coherence.tabs.suspendProbe')"
        @input="setWorkloadSpecFieldIfNotEmpty('suspendProbe', $event)"
        @delete="setWorkloadSpecField('suspendProbe', undefined)"
      />
      <StartQuorumsTab
        :value="getWorkloadSpecListField('startQuorum')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="startQuorum"
        @input="setWorkloadSpecFieldIfNotEmpty('startQuorum', $event)"
      />
      <TreeTab name="envVars" :label="t('verrazzano.common.tabs.environmentVariables')" :show-header="false">
        <template #default>
          <EnvironmentVariables
            :value="workloadTemplateSpec"
            :mode="mode"
            :namespaced-object="value"
            :enable-env-from-options="false"
            @input="$emit('input', value)"
          />
        </template>
      </TreeTab>
      <TreeTab name="labels" :label="t('verrazzano.common.tabs.labelsAndAnnotations')">
        <template #default>
          <Labels
            :value="workloadTemplateSpec"
            :mode="mode"
            @input="$emit('input', value)"
          />
        </template>
      </TreeTab>
      <ContainersTab
        :value="getWorkloadSpecListField('initContainers')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="initContainers"
        :tab-label="t('verrazzano.common.tabs.initContainers')"
        @input="setWorkloadSpecFieldIfNotEmpty('initContainers', $event)"
      />
      <ContainersTab
        :value="getWorkloadSpecListField('sideCars')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="sideCars"
        :tab-label="t('verrazzano.coherence.tabs.sideCars')"
        @input="setWorkloadSpecFieldIfNotEmpty('sideCars', $event)"
      />
      <ConfigMapVolumesTab
        :value="getWorkloadSpecListField('configMapVolumes')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="configMapVolumes"
        @input="setWorkloadSpecFieldIfNotEmpty('configMapVolumes', $event)"
      />
      <SecretVolumesTab
        :value="getWorkloadSpecListField('secretVolumes')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="secretVolumes"
        @input="setWorkloadSpecFieldIfNotEmpty('secretVolumes', $event)"
      />
      <VolumesTab
        :value="getWorkloadSpecListField('volumes')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="volumes"
        @input="setWorkloadSpecFieldIfNotEmpty('volumes', $event)"
      />
      <VolumeClaimTemplatesTab
        :value="getWorkloadSpecListField('volumeClaimTemplates')"
        :mode="mode"
        tab-name="volumeClaimsTemplates"
        @input="setWorkloadSpecFieldIfNotEmpty('volumeClaimTemplates', $event)"
      />
      <VolumeMountsTab
        :value="getWorkloadSpecListField('volumeMounts')"
        :mode="mode"
        tab-name="volumeMounts"
        @input="setWorkloadSpecFieldIfNotEmpty('volumeMounts', $event)"
      />
      <ReadinessProbeSpecTab
        :value="getWorkloadSpecField('readinessProbe')"
        :mode="mode"
        is-readiness-probe
        tab-name="readinessProbe"
        :tab-label="t('verrazzano.common.tabs.readinessProbe')"
        @input="setWorkloadSpecFieldIfNotEmpty('readinessProbe', $event)"
        @delete="setWorkloadSpecField('readinessProbe', undefined)"
      />
      <ReadinessProbeSpecTab
        :value="getWorkloadSpecField('livenessProbe')"
        :mode="mode"
        tab-name="livenessProbe"
        :tab-label="t('verrazzano.common.tabs.livenessProbe')"
        @input="setWorkloadSpecFieldIfNotEmpty('livenessProbe', $event)"
        @delete="setWorkloadSpecField('livenessProbe', undefined)"
      />
      <ReadinessProbeSpecTab
        :value="getWorkloadSpecField('startupProbe')"
        :mode="mode"
        tab-name="startupProbe"
        :tab-label="t('verrazzano.common.tabs.startupProbe')"
        @input="setWorkloadSpecFieldIfNotEmpty('startupProbe', $event)"
        @delete="setWorkloadSpecField('startupProbe', undefined)"
      />
      <ReadinessGatesTab
        :value="getWorkloadSpecListField('readinessGates')"
        :mode="mode"
        tab-name="readinessGates"
        @input="setWorkloadSpecFieldIfNotEmpty('readinessGates', $event)"
      />
      <ContainerResourcesTab
        :value="getWorkloadSpecField('resources')"
        :mode="mode"
        tab-name="resources"
        @input="setWorkloadSpecFieldIfNotEmpty('resources', $event)"
        @delete="setWorkloadSpecField('resources', undefined)"
      />
      <AffinityTab
        :value="getWorkloadSpecField('affinity')"
        :mode="mode"
        tab-name="affinity"
        @input="setWorkloadSpecFieldIfNotEmpty('affinity', $event)"
        @delete="setWorkloadSpecField('affinity', undefined)"
      />
      <TreeTab name="nodeSelector" :label="t('verrazzano.coherence.tabs.nodeSelector')">
        <template #beside-header>
          <TabDeleteButton
            :element-name="t('verrazzano.coherence.tabs.nodeSelector')"
            :mode="mode"
            @click="setWorkloadSpecField('nodeSelector', undefined)"
          />
        </template>
        <template #default>
          <NodeSelector
            :value="getWorkloadSpecField('nodeSelector')"
            :mode="mode"
            @input="setWorkloadSpecFieldIfNotEmpty('nodeSelector', $event)"
          />
        </template>
      </TreeTab>
      <TolerationsTab
        :value="getWorkloadSpecListField('tolerations')"
        :mode="mode"
        tab-name="tolerations"
        @input="setWorkloadSpecFieldIfNotEmpty('tolerations', $event)"
      />
      <PodSecurityContextTab
        :value="getWorkloadSpecField('securityContext')"
        :mode="mode"
        tab-name="securityContext"
        @input="setWorkloadSpecFieldIfNotEmpty('securityContext', $event)"
        @delete="setWorkloadSpecField('securityContext', undefined)"
      />
      <ContainerSecurityContextTab
        :value="getWorkloadSpecField('containerSecurityContext')"
        :mode="mode"
        tab-name="containerSecurityContext"
        @input="setWorkloadSpecFieldIfNotEmpty('containerSecurityContext', $event)"
        @delete="setWorkloadSpecField('containerSecurityContext', undefined)"
      />
      <NetworkSpecTab
        :value="getWorkloadSpecField('network')"
        :mode="mode"
        tab-name="network"
        @input="setWorkloadSpecFieldIfNotEmpty('network', $event)"
        @delete="setWorkloadSpecField('network', undefined)"
      />
      <CoherenceActionsTab
        :value="getWorkloadSpecListField('actions')"
        :mode="mode"
        :namespaced-object="value"
        tab-name="actions"
        @input="setWorkloadSpecFieldIfNotEmpty('actions', $event)"
      />
      <TopologySpreadConstraintsTab
        :value="getWorkloadSpecListField('topologySpreadConstraints')"
        :mode="mode"
        tab-name="topologySpreadConstraints"
        @input="setWorkloadSpecFieldIfNotEmpty('topologySpreadConstraints', $event)"
      />
    </template>
  </TreeTabbed>
</template>

<style scoped>

</style>
