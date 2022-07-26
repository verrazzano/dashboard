<script>
// Added by Verrazzano
import ContainerizedWorkloadHelper from '@/mixins/verrazzano/containerized-workload-helper';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import OAMContainers from '@/edit/core.oam.dev.component/ContainerizedWorkload/OAMContainers';
import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';

const TAB_WEIGHT_MAP = {
  general:    99,
  containers: 98,
};

export default {
  name:       'ContainerizedWorkload',
  components: {
    KeyValue,
    LabeledInput,
    LabeledSelect,
    OAMContainers,
    Tab,
    Tabbed,
  },
  mixins: [ContainerizedWorkloadHelper],
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
  computed: {
    archOptions() {
      return [
        { value: 'amd64', label: this.t('verrazzano.containerized.types.arch.amd64') },
        { value: 'arm64', label: this.t('verrazzano.containerized.types.arch.arm64') },
        { value: 'i386', label: this.t('verrazzano.containerized.types.arch.i386') },
        { value: 'arm', label: this.t('verrazzano.containerized.types.arch.arm') },
      ];
    },
    osTypeOptions() {
      return [
        { value: 'linux', label: this.t('verrazzano.containerized.types.osType.linux') },
        { value: 'windows', label: this.t('verrazzano.containerized.types.osType.windows') },
      ];
    }
  },
  methods:  {
    initSpec() {
      this.$set(this.value, 'spec', {
        workload: {
          apiVersion: this.oamContainerizedWorkloadApiVersion,
          kind:       'ContainerizedWorkload',
          metadata:   {},
          spec:       { containers: [] }
        }
      });
    },
  },
  created() {
    if (!this.workloadSpec) {
      this.initSpec();
    }
  },
};
</script>

<template>
  <Tabbed side-tabs>
    <Tab :label="t('verrazzano.common.tabs.general')" name="general" :weight="tabWeightMap['general']">
      <div class="row">
        <div class="col span-4">
          <LabeledInput
            :value="getWorkloadMetadataField('name')"
            :mode="mode"
            :disabled="!isCreate"
            :placeholder="getWorkloadMetadataNotSetPlaceholder('name')"
            :label="t('verrazzano.containerized.fields.workloadName')"
            @input="setWorkloadMetadataField('name', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getWorkloadSpecField('os')"
            :mode="mode"
            :options="osTypeOptions"
            option-key="value"
            option-label="label"
            :placeholder="getWorkloadSpecNotSetPlaceholder(value, 'os')"
            :label="t('verrazzano.containerized.fields.os')"
            @input="setWorkloadSpecFieldIfNotEmpty('os', $event)"
          />
        </div>
        <div class="col span-4">
          <LabeledSelect
            :value="getWorkloadSpecField('arch')"
            :mode="mode"
            :options="archOptions"
            option-key="value"
            option-label="label"
            :placeholder="getWorkloadSpecNotSetPlaceholder(value, 'arch')"
            :label="t('verrazzano.containerized.fields.arch')"
            @input="setWorkloadSpecFieldIfNotEmpty('arch', $event)"
          />
        </div>
      </div>
      <div class="spacer" />
      <div>
        <h3>{{ t('verrazzano.common.titles.labels') }}</h3>
        <KeyValue
          :value="getWorkloadMetadataField('labels')"
          :mode="mode"
          :add-label="t('verrazzano.common.buttons.addLabel')"
          :read-allowed="false"
          @input="setWorkloadMetadataFieldIfNotEmpty('labels', $event)"
        />
      </div>
      <div class="spacer" />
      <div>
        <h3>{{ t('verrazzano.common.titles.annotations') }}</h3>
        <KeyValue
          :value="getWorkloadMetadataField('annotations')"
          :mode="mode"
          :add-label="t('verrazzano.common.buttons.addAnnotation')"
          :read-allowed="false"
          @input="setWorkloadMetadataFieldIfNotEmpty('annotations', $event)"
        />
      </div>
    </Tab>
    <Tab :label="t('verrazzano.common.tabs.containers')" name="containers" :weight="tabWeightMap['containers']">
      <OAMContainers
        v-model="workloadSpec"
        :mode="mode"
        :namespaced-object="value"
      />
    </Tab>
  </Tabbed>
</template>

<style scoped>

</style>
