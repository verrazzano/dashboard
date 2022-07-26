<script>
// Added by Verrazzano
import ArrayListGrouped from '@/components/form/ArrayListGrouped';
import Checkbox from '@/components/form/Checkbox';
import CoherenceWorkloadHelper from '@/mixins/verrazzano/coherence-workload-helper';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import SecretItem from '@/components/verrazzano/Volumes/Secret/SecretItem';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';
import { randomStr } from '@/utils/string';
import debounce from 'lodash/debounce';

export default {
  name:       'SecretVolumeSpec',
  components: {
    ArrayListGrouped,
    Checkbox,
    LabeledInput,
    LabeledSelect,
    SecretItem,
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
      allSecrets:      {},
      secrets:         [],
      secretItems,
    };
  },
  async fetch() {
    const requests = { secrets: this.$store.dispatch('cluster/findAll', { type: SECRET }) };

    const hash = await allHash(requests);

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    this.fetchInProgress = false;
  },
  computed: {
    showItemRemoveButton() {
      return !this.isView && this.secretItems.length > 0;
    },
    keys() {
      const secretName = this.getField('name');
      const keys = [];

      if (secretName) {
        const secret = this.secrets.find(secret => secret.metadata?.name === secretName);

        if (secret && secret.data) {
          keys.push(...Object.keys(secret.data));
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
    getSecret() {
      const name = this.getField('name');

      return !this.fetchInProgress && name ? this.secrets.find(secret => secret.metadata.name === name) : {};
    },
    resetSecrets() {
      if (!this.fetchInProgress) {
        this.secrets = this.allSecrets[this.namespace] || [];
      }
    },
    addSecretItem() {
      this.secretItems.push({ _id: randomStr(4) });
      // No need to call queueUpdate() when adding an empty row...wait for row to be updated
    },
    removeSecretItem(index) {
      this.secretItems.splice(index, 1);
      this.queueUpdate();
    },
    updateSecretItem() {
      this.queueUpdate();
    }
  },
  created() {
    this.queueUpdate = debounce(this.update, 500);
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
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
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :placeholder="getNotSetPlaceholder(value, 'name')"
          :label="t('verrazzano.coherence.fields.secretVolume.name')"
          @input="setFieldIfNotEmpty('name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('mountPath')"
          :mode="mode"
          required
          :placeholder="getNotSetPlaceholder(value, 'mountPath')"
          :label="t('verrazzano.coherence.fields.secretVolume.mountPath')"
          @input="setFieldIfNotEmpty('mountPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('volumeName')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'volumeName')"
          :label="t('verrazzano.coherence.fields.secretVolume.volumeName')"
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
          :label="t('verrazzano.coherence.fields.secretVolume.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('optional')"
          :mode="mode"
          :label="t('verrazzano.coherence.fields.secretVolume.optional')"
          @input="setBooleanField('optional', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPath')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subPath')"
          :label="t('verrazzano.coherence.fields.secretVolume.subPath')"
          @input="setFieldIfNotEmpty('subPath', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('subPathExpr')"
          :mode="mode"
          :placeholder="getNotSetPlaceholder(value, 'subPathExpr')"
          :label="t('verrazzano.coherence.fields.secretVolume.subPathExpr')"
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
          :label="t('verrazzano.coherence.fields.secretVolume.defaultMode')"
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
        @add="addSecretItem()"
      >
        <template #remove-button="removeProps">
          <button
            v-if="showItemRemoveButton"
            type="button"
            class="btn role-link close btn-sm"
            @click="removeSecretItem(removeProps.i)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
          <span v-else />
        </template>
        <template #default="props">
          <SecretItem
            v-model="props.row.value"
            :secret="getSecret()"
            :mode="mode"
            @input="updateSecretItem()"
          />
        </template>
      </ArrayListGrouped>
    </div>
  </div>
</template>

<style scoped>
  @import "../verrazzano-styles.css";
</style>
