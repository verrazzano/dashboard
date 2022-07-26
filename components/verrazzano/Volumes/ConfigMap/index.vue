<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Checkbox from '@/components/form/Checkbox';
import ConfigMapItem from '@/components/verrazzano/Volumes/ConfigMap/ConfigMapItem';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { CONFIG_MAP } from '@/config/types';
import { allHash } from '@/utils/promise';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'ConfigMap',
  components: {
    ArrayListGrouped,
    Checkbox,
    ConfigMapItem,
    LabeledInput,
    LabeledSelect,
  },
  mixins: [VerrazzanoHelper],
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
    showDefaultMode: {
      type:    Boolean,
      default: true
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
        <div v-if="fetchInProgress">
          <span />
        </div>
        <div v-else>
          <LabeledSelect
            :value="getField('name')"
            :mode="mode"
            :options="configMaps"
            option-label="metadata.name"
            :reduce="configMap => configMap.metadata.name"
            :label="t('verrazzano.config.fields.volumes.configMap.name')"
            @input="setField('name', $event)"
          />
        </div>
      </div>
      <div v-if="showDefaultMode" class="col span-4">
        <LabeledInput
          :value="getField('defaultMode')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.configMap.defaultMode')"
          @input="setField('defaultMode', $event)"
        />
      </div>
      <div class="col span-4">
        <Checkbox
          :value="getField('optional')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.configMap.optional')"
          @input="setField('optional', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <ArrayListGrouped
        v-model="secretItems"
        :mode="mode"
        :default-add-value="{ }"
        :add-label="t('verrazzano.config.buttons.addSecretItem')"
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

</style>
