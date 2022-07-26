<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import ConfigMapItem from '@/components/verrazzano/Volumes/ConfigMap/ConfigMapItem';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';

import { CONFIG_MAP } from '@/config/types';
import { allHash } from '@/utils/promise';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'ConfigMapVolumeSpec',
  components: {
    ArrayListGrouped,
    Checkbox,
    ConfigMapItem,
    LabeledInput,
    LabeledSelect,
  },
  mixins: [CoherenceWorkloadHelper],
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
  },
  data() {
    const { items = [] } = this.value;
    const secretItems = items.map((item) => {
      const newItem = this.clone(item);

      newItem._id = randomStr(4);

      return newItem;
    });

    return {
      fetchInProgress: true,
      namespace:       this.namespacedObject.metadata?.namespace,
      allConfigMaps:   {},
      configMaps:      [],
      secretItems,
    };
  },
  async fetch() {
    const requests = { configMaps: this.$store.dispatch('cluster/findAll', { type: CONFIG_MAP }) };

    const hash = await allHash(requests);

    if (hash.configMaps) {
      this.sortObjectsByNamespace(hash.configMaps, this.allConfigMaps);
    }
    this.fetchInProgress = false;
  },
  computed: {
    showItemRemoveButton() {
      return !this.isView && this.secretItems.length > 0;
    },
    keys() {
      const configMapName = this.getField('name');
      const keys = [];

      if (configMapName) {
        const configMap = this.configMaps.find(cm => cm.metadata?.name === configMapName);

        if (configMap && configMap.data) {
          keys.push(...Object.keys(configMap.data));
        }
      }

      return keys;
    }
  },
  methods: {
    update() {
      const items = [];

      this.secretItems.forEach((item) => {
        const newItem = this.clone(item);

        delete newItem._id;

        items.push(newItem);
      });
      this.setField('items', items);
    },
    getConfigMap() {
      const name = this.getField('name');

      return !this.fetchInProgress && name ? this.configMaps.find(configMap => configMap.metadata.name === name) : {};
    },
    resetConfigMaps() {
      if (!this.fetchInProgress) {
        this.configMaps = this.allConfigMaps[this.namespace] || [];
      }
    },
    addConfigMapItem() {
      this.secretItems.push({ _id: randomStr(4) });
      // No need to call queueUpdate() when adding an empty row...wait for row to be updated
    },
    removeConfigMapItem(index) {
      this.secretItems.splice(index, 1);
      this.queueUpdate();
    },
    updateConfigMapItem() {
      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
  watch: {
    fetchInProgress() {
      this.resetConfigMaps();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetConfigMaps();
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('name')"
          :mode="mode"
          required
          :options="configMaps"
          option-label="metadata.name"
          :reduce="configMap => configMap.metadata.name"
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.coherence.fields.configMapVolume.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('mountPath')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'mountPath')"
          :label="t('verrazzano.coherence.fields.configMapVolume.mountPath')"
          @input="setFieldIfNotEmpty('mountPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('volumeName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'volumeName')"
          :label="t('verrazzano.coherence.fields.configMapVolume.volumeName')"
          @input="setFieldIfNotEmpty('volumeName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.configMapVolume.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('optional')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.configMapVolume.optional')"
          @input="setBooleanField('optional', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPath')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subPath')"
          :label="t('verrazzano.coherence.fields.configMapVolume.subPath')"
          @input="setFieldIfNotEmpty('subPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPathExpr')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subPathExpr')"
          :label="t('verrazzano.coherence.fields.configMapVolume.subPathExpr')"
          @input="setFieldIfNotEmpty('subPathExpr', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('mountPropagation')"
          :mode="mode"
          :options="mountPropagationModeOptions"
          option-key="value"
          option-label="label"
          :placeholder="getNotSetPlaceholder(value, 'mountPropagation')"
          :label="t('verrazzano.common.fields.mountPropagationMode')"
          @input="setFieldIfNotEmpty('mountPropagation', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('defaultMode')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'defaultMode')"
          :label="t('verrazzano.coherence.fields.configMapVolume.defaultMode')"
          @input="setField('defaultMode', $event)"
        />
      </div>
    </div>
    <div class="spacer" />
    <div>
      <ArrayListGrouped
        v-model="secretItems"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.common.buttons.addSecretItem')"
        @add="addConfigMapItem()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showItemRemoveButton"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeConfigMapItem(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <ConfigMapItem
            v-model="props.row.value"
            :config-map="getConfigMap()"
            :mode="mode"
            @input="updateConfigMapItem()"
          />
        </template>
      </ArrayListGrouped>
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
