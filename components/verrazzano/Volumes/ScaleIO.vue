<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ScaleIO',
  components: {
    Checkbox,
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
    }
  },
  data() {
    return {
      fetchInProgress: true,
      namespace:       this.namespacedObject.metadata?.namespace,
      allSecrets:      {},
      secrets:         []
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
    storageModeOptions() {
      return [
        { value: 'ThinProvisioned', label: this.t('verrazzano.config.values.types.volumes.scaleIO.storageMode.thin') },
        { value: 'ThickProvisioned', label: this.t('verrazzano.config.values.types.volumes.scaleIO.storageMode.thick') },
      ];
    }
  },
  methods: {
    resetSecrets() {
      if (!this.fetchInProgress) {
        this.secrets = this.allSecrets[this.namespace] || [];
      }
    }
  },
  watch: {
    fetchInProgress() {
      this.resetSecrets();
    },
    'namespacedObject.metadata.namespace'(neu, old) {
      this.namespace = neu;
      this.resetSecrets();
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('gateway')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.scaleIO.gateway')"
          @input="setField('gateway', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('system')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.scaleIO.system')"
          @input="setField('system', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('secretRef.name')"
          :mode="mode"
          required
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :label="t('verrazzano.config.fields.volumes.scaleIO.secretRefName')"
          @input="setField('secretRef.name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('volumeName')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.volumeName')"
          @input="setField('volumeName', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('storageMode')"
          :mode="mode"
          :options="storageModeOptions"
          option-key="value"
          option-label="label"
          :label="t('verrazzano.config.fields.volumes.scaleIO.storageMode')"
          @input="setField('storageMode', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('sslEnabled')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.sslEnabled')"
          @input="setBooleanField('sslEnabled', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('protectionDomain')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.protectionDomain')"
          @input="setField('protectionDomain', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('storagePool')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.scaleIO.storagePool')"
          @input="setField('storagePool', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
