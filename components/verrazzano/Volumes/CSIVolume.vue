<script>
// Added by Verrazzano
import Checkbox from '@/components/form/Checkbox';
import KeyValue from '@/components/form/KeyValue';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';

import { SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'CSIVolume',
  components: {
    Checkbox,
    KeyValue,
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
    },
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
      <div class="col span-3">
        <LabeledInput
          :value="getField('driver')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.csi.driver')"
          required
          @input="setField('driver', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.csi.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
      <div class="col span-3">
        <LabeledSelect
          :value="getField('nodePublishSecretRef.name')"
          :mode="mode"
          :options="secrets"
          :label="t('verrazzano.config.fields.volumes.csi.nodePublishSecretName')"
          @input="setField('nodePublishSecretRef.name', $event)"
        />
      </div>
      <div class="col span-3">
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.csi.readOnly')"
          @input="setField('readOnly', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.config.titles.volumes.csiVolumeAttributes') }}</h4>
      <KeyValue
        :value="getField('volumeAttributes')"
        :mode="mode"
        :add-label="t('verrazzano.config.buttons.addVolumeAttribute')"
        @input="setFieldIfNotEmpty('volumeAttributes', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
