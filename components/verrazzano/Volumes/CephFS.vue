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
  name:       'CephFS',
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
      <div class="col span-6">
        <LabeledInput
          :value="getField('path')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.cephfs.path')"
          @input="setField('path', $event)"
        />
      </div>
      <div class="col span-6">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.cephfs.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('user')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.cephfs.user')"
          @input="setField('user', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('secretRef.name')"
          :mode="mode"
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :label="t('verrazzano.config.fields.volumes.cephfs.secretRefName')"
          @input="setField('secretRef.name', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('secretFile')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.cephfs.secretFile')"
          @input="setField('secretFile', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <LabeledArrayList
        :value="getListField('monitors')"
        :mode="mode"
        :default-add-value="''"
        :value-label="t('verrazzano.config.fields.volumes.cephfs.monitor')"
        :add-label="t('verrazzano.config.buttons.addCephfsMonitor')"
        @input="setFieldIfNotEmpty('monitors', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
