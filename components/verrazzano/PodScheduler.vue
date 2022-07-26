<script>
// Added by Verrazzano
import Affinity from '@/components/verrazzano/Affinity';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { NODE } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'PodScheduler',
  components: {
    Affinity,
    KeyValue,
    LabeledInput,
    LabeledSelect,
  },
  mixins: [VerrazzanoHelper],
  props:  {
    value: {
      // This is the ServerPod object...
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    nodeSelectorTitle: {
      type:    String,
      default: ''
    },
    nodeAffinityTitle: {
      type:    String,
      default: ''
    },
    podAffinityTitle: {
      type:    String,
      default: ''
    }
  },
  data() {
    return {
      fetchInProgress: true,
      allNodes:        [],
      nodes:           []
    };
  },
  async fetch() {
    const requests = { nodes: this.$store.dispatch('cluster/findAll', { type: NODE }) };

    const hash = await allHash(requests);

    if (hash.nodes) {
      this.allNodes = hash.nodes;
    }
    this.fetchInProgress = false;
  },
  computed: {
    effectiveNodeSelectorTitle() {
      return this.nodeSelectorTitle || this.t('verrazzano.config.titles.podScheduler.nodeSelector');
    },
    effectiveNodeAffinityTitle() {
      return this.nodeAffinityTitle || this.t('verrazzano.config.titles.podScheduler.nodeAffinity');
    },
    effectivePodAffinityTitle() {
      return this.podAffinityTitle || this.t('verrazzano.config.titles.podScheduler.podAffinity');
    }
  },
  methods: {
    resetNodes() {
      if (!this.fetchInProgress) {
        this.nodes = this.allNodes;
      }
    }
  },
  watch: {
    fetchInProgress() {
      this.resetNodes();
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('schedulerName')"
          :mode="mode"
          :label="t('verrazzano.config.fields.podScheduler.schedulerName')"
          :placeholder="getNotSetPlaceholder(value, 'schedulerName')"
          @input="setField('schedulerName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('nodeName')"
          :mode="mode"
          :label="t('verrazzano.config.fields.podScheduler.nodeName')"
          :placeholder="getNotSetPlaceholder(value, 'nodeName')"
          :options="nodes"
          option-label="metadata.name"
          :reduce="node => node.metadata.name"
          @input="setField('nodeName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ effectiveNodeSelectorTitle }}</h4>
      <KeyValue
        :value="getField('nodeSelector')"
        :mode="mode"
        :add-label="t('verrazzano.config.buttons.addNodeSelector')"
        @input="setFieldIfNotEmpty('nodeSelector', $event)"
      />
    </div>
    <div class="spacer-small" />
    <div>
      <Affinity
        :value="getField('affinity')"
        :mode="mode"
        :node-affinity-title="nodeAffinityTitle"
        :pod-affinity-title="podAffinityTitle"
        @input="setFieldIfNotEmpty('affinity', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
