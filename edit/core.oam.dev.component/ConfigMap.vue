<script>
// Added by Verrazzano
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import Labels from '@/components/verrazzano/Labels';
import OamComponentHelper from '@/mixins/verrazzano/oam-component-helper';
import Tab from '@/components/Tabbed/Tab';
import Tabbed from '@/components/Tabbed';

import { asciiLike } from '@/utils/string';
import { base64Encode, base64Decode } from '@/utils/crypto';

export default {
  name:       'ConfigMap',
  components: {
    KeyValue,
    LabeledInput,
    Labels,
    Tab,
    Tabbed,
  },
  mixins: [OamComponentHelper],
  props:  {
    value: {
      type:     Object,
      required: true,
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    const existingBinaryData = this.getWorkloadField('binaryData') || {};
    const data = this.getWorkloadField('data') || {};
    const decodedBinaryData = {};

    Object.keys(existingBinaryData).forEach((key) => {
      decodedBinaryData[key] = base64Decode(existingBinaryData[key]);
    });

    return { allData: { ...decodedBinaryData, ...data } };
  },
  methods:  {
    initSpec() {
      this.setField('spec', {
        workload: {
          apiVersion: this.configMapApiVersion,
          kind:       'ConfigMap',
          metadata:   { namespace: this.value.metadata.namespace },
        }
      });
    },
    isBinary(value) {
      return typeof value === 'string' && !asciiLike(value);
    },
  },
  created() {
    if (!this.value.spec?.workload) {
      this.initSpec();
    }
  },
  watch: {
    'metadata.namespace'(neu, old) {
      if (neu) {
        this.setWorkloadFieldIfNotEmpty('metadata.namespace', neu);
      }
    },
    allData(neu, old) {
      const data = {};
      const binaryData = {};

      Object.keys(neu).forEach((key) => {
        if (this.isBinary(neu[key])) {
          binaryData[key] = base64Encode(neu[key]);
        } else {
          data[key] = neu[key];
        }
      });

      this.setWorkloadFieldIfNotEmpty('binaryData', binaryData);
      this.setWorkloadFieldIfNotEmpty('data', data);
    }
  },
};
</script>

<template>
  <div>
    <Tabbed side-tabs>
      <Tab name="data" :label="t('configmap.tabs.data.label')" :weight="2">
        <div class="row">
          <div class="col span-6">
            <LabeledInput
              :value="getWorkloadField('metadata.name')"
              :mode="mode"
              required
              :placeholder="getWorkloadMetadataNotSetPlaceholder('name')"
              :label="t('verrazzano.common.fields.workloadConfigMapName')"
              @input="setWorkloadMetadataFieldIfNotEmpty('name', $event)"
            />
          </div>
        </div>
        <div class="spacer-small" />
        <KeyValue
          key="data"
          v-model="allData"
          :mode="mode"
          :protip="t('configmap.tabs.data.protip')"
          :initial-empty-row="true"
          :value-can-be-empty="true"
          :read-multiple="true"
          :read-accept="'*'"
        />
      </Tab>
      <Tab
        name="labels-and-annotations"
        label-key="generic.labelsAndAnnotations"
        :weight="-1"
      >
        <Labels
          default-container-class="labels-and-annotations-container"
          :value="value.spec.workload"
          :mode="mode"
          :display-side-by-side="false"
        />
      </Tab>
    </Tabbed>
  </div>
</template>

<style scoped>

</style>
