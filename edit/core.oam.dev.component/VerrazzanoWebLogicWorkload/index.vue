<script>
// Added by Verrazzano
import AdminServerTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AdminServerTab';
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import AuxiliaryImageVolume from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/AuxiliaryImageVolume';
import ClustersTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ClustersTab';
import ConfigurationData from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ConfigurationData';
import FluentdSpecification from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/FluentdSpecification';
import WebLogicGeneralData from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/WebLogicGeneralData';
import ManagedServersTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ManagedServersTab';
import MonitoringExporter from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/MonitoringExporter';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import TreeTabbed from '@/components/verrazzano/TreeTabbed';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

const WKO_DOMAIN_VERSION = 'domain-v8';

export default {
  name:       'VerrazzanoWebLogicWorkload',
  components: {
    AdminServerTab,
    ArrayListGrouped,
    AuxiliaryImageVolume,
    ClustersTab,
    ConfigurationData,
    FluentdSpecification,
    ManagedServersTab,
    MonitoringExporter,
    ServerPodTab,
    ServerService,
    TreeTab,
    TreeTabbed,
    WebLogicGeneralData,
  },
  mixins: [WeblogicWorkloadHelper],
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
    return {
      configRoot: this.value,
      namespace:  '',
    };
  },
  computed: {
    isModelInImage() {
      return this.getWorkloadSpecField('domainHomeSourceType') === 'FromModel';
    },
  },
  methods:  {
    initSpec() {
      this.$set(this.configRoot, 'spec', {
        workload: {
          apiVersion: this.verrazzanoComponentApiVersion,
          kind:       'VerrazzanoWebLogicWorkload',
          spec:       {
            template: {
              metadata: { labels: { 'weblogic.resourceVersion': WKO_DOMAIN_VERSION } },
              spec:     { }
            }
          }
        }
      });
    },
  },
  created() {
    if (!this.configRoot.spec?.workload?.spec?.template) {
      this.initSpec();
    }
  },
};
</script>

<template>
  <TreeTabbed>
    <template #nestedTabs>
      <TreeTab :label="t('verrazzano.weblogic.tabs.general')" name="general">
        <WebLogicGeneralData :value="value" :mode="mode" />
      </TreeTab>

      <!-------------------------------------------------------------------------------------------------------
       |                                  Auxiliary Image Volumes Tab                                         |
       -------------------------------------------------------------------------------------------------------->

      <TreeTab :label="t('verrazzano.weblogic.tabs.auxiliaryImageVolumes')" name="auxiliaryImageVolumes">
        <ArrayListGrouped
          :value="getWorkloadSpecListField('auxiliaryImageVolumes')"
          :default-add-value="{ }"
          :mode="mode"
          :add-label="t('verrazzano.weblogic.buttons.addAuxiliaryImageVolume')"
          @input="setWorkloadSpecFieldIfNotEmpty('auxiliaryImageVolumes', $event)"
        >
          <template #remove-button="removeProps">
            <button
              v-if="showWorkloadSpecListRemoveButton('auxiliaryImageVolumes')"
              type="button"
              class="btn role-link close btn-sm"
              @click="removeProps.remove"
            >
              <i class="icon icon-2x icon-x" />
            </button>
            <span v-else />
          </template>
          <template #default="props">
            <div class="spacer-small" />
            <AuxiliaryImageVolume
              v-model="props.row.value"
              :mode="mode"
            />
          </template>
        </ArrayListGrouped>
      </TreeTab>

      <!-------------------------------------------------------------------------------------------------------
       |                                       Configuration Tab                                              |
       -------------------------------------------------------------------------------------------------------->
      <TreeTab :label="t('verrazzano.weblogic.tabs.configuration')" name="configuration">
        <ConfigurationData
          :value="getWorkloadSpecField('configuration')"
          :mode="mode"
          :is-model-in-image="isModelInImage"
          :namespaced-object="value"
          @input="setWorkloadSpecFieldIfNotEmpty('configuration', $event)"
        />
      </TreeTab>

      <!-------------------------------------------------------------------------------------------------------
       |                                         Server Pod Tabs                                              |
       -------------------------------------------------------------------------------------------------------->

      <ServerPodTab
        :value="getWorkloadSpecField('serverPod')"
        :mode="mode"
        :namespaced-object="value"
        @input="setWorkloadSpecFieldIfNotEmpty('serverPod', $event)"
      />

      <!-------------------------------------------------------------------------------------------------------
       |                                       Server Service Tab                                             |
       -------------------------------------------------------------------------------------------------------->

      <TreeTab :label="t('verrazzano.weblogic.tabs.serverService')" name="serverService">
        <ServerService
          :value="getWorkloadSpecField('serverService')"
          :mode="mode"
          @input="setWorkloadSpecFieldIfNotEmpty('serverService', $event)"
        />
      </TreeTab>

      <!-------------------------------------------------------------------------------------------------------
       |                                          Clusters Tab                                                |
       -------------------------------------------------------------------------------------------------------->

      <ClustersTab
        :value="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />

      <!-------------------------------------------------------------------------------------------------------
       |                                        Admin Server Tab                                              |
       -------------------------------------------------------------------------------------------------------->

      <AdminServerTab
        :value="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />

      <!-------------------------------------------------------------------------------------------------------
       |                                      Managed Servers Tab                                             |
       -------------------------------------------------------------------------------------------------------->

      <ManagedServersTab
        :value="workloadTemplateSpec"
        :mode="mode"
        :namespaced-object="value"
      />

      <!-------------------------------------------------------------------------------------------------------
       |                                          Fluentd Tab                                                 |
       -------------------------------------------------------------------------------------------------------->

      <TreeTab :label="t('verrazzano.weblogic.tabs.fluentd')" name="fluentd">
        <FluentdSpecification
          :value="getWorkloadSpecField('fluentdSpecification')"
          :mode="mode"
          :namespaced-object="value"
          @input="setWorkloadSpecFieldIfNotEmpty('fluentdSpecification', $event)"
        />
      </TreeTab>

      <!-------------------------------------------------------------------------------------------------------
       |                                    Monitoring Exporter Tab                                           |
       -------------------------------------------------------------------------------------------------------->

      <TreeTab :label="t('verrazzano.weblogic.tabs.monitoringExporter')" name="monitoringExporter">
        <MonitoringExporter
          :value="getWorkloadSpecField('monitoringExporter')"
          :mode="mode"
          @input="setWorkloadSpecFieldIfNotEmpty('monitoringExporter', $event)"
        />
      </TreeTab>
    </template>
  </TreeTabbed>
</template>

<style scoped>
</style>
