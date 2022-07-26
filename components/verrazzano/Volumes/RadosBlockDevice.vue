<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import LabeledArrayList from '@/components/verrazzano/LabeledArrayList';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'RadosBlockDevice',
  components: {
    Checkbox,
    LabeledArrayList,
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
          :value="getField('image')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.rbd.image')"
          @input="setField('image', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.rbd.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('pool')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.rbd.pool')"
          @input="setField('pool', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-3">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.rbd.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('user')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.rbd.user')"
          @input="setField('user', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('keyring')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.rbd.keyring')"
          @input="setField('keyring', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('secretRef.name')"
          :mode="mode"
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :label="t('verrazzano.config.fields.volumes.rbd.secretRefName')"
          @input="setField('secretRef.name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <LabeledArrayList
        :value="getListField('monitors')"
        :mode="mode"
        :default-add-value="''"
        :value-label="t('verrazzano.config.fields.volumes.rbd.monitor')"
        :add-label="t('verrazzano.config.buttons.addCephMonitor')"
        @input="setFieldIfNotEmpty('monitors', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
