<script>
// Added by Verrazzano
import LabeledSelect from '@/components/form/LabeledSelect';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'OpssConfiguration',
  components: { LabeledSelect },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
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
    return { allSecrets: [] };
  },
  async fetch() {
    this.allSecrets = {};

    const requests = { secrets: this.$store.dispatch('cluster/findAll', { type: SECRET }) };

    const hash = await allHash(requests);

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
  },
  computed: {
    secrets() {
      const namespace = this.get(this.namespacedObject, 'metadata.namespace');

      return this.allSecrets[namespace] || [];
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col span-4">
      <LabeledSelect
        :value="getField('walletFileSecret')"
        :mode="mode"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.opss.walletFileSecret')"
        :placeholder="getNotSetPlaceholder(value, 'walletFileSecret')"
        :options="secrets"
        option-label="metadata.name"
        :reduce="secret => secret.metadata.name"
        @input="setField('walletFileSecret', $event)"
      />
    </div>
    <div class="col span-4">
      <LabeledSelect
        :value="getField('walletPasswordSecret')"
        :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.opss.walletPasswordSecret')"
        :placeholder="getNotSetPlaceholder(value, 'walletPasswordSecret')"
        :options="secrets"
        :mode="mode"
        option-label="metadata.name"
        :reduce="secret => secret.metadata.name"
        @input="setField('walletPasswordSecret', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
