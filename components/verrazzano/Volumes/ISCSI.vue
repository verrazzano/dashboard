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
  name:       'ISCSI',
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
    },
  },
  data() {
    return {
      fetchInProgress: true,
      namespace:       this.namespacedObject.metadata?.namespace,
      allSecrets:      {},
      secrets:         [],
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
      <div class="col span-4">
        <LabeledInput
          :value="getField('iqn')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.iscsi.iqn')"
          @input="setField('iqn', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('lun')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.iscsi.lun')"
          @input="setNumberField('lun', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('targetPortal')"
          :mode="mode"
          required
          :label="t('verrazzano.config.fields.volumes.iscsi.targetPortal')"
          @input="setField('targetPortal', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('iscsiInterface')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.iscsiInterface')"
          @input="setField('iscsiInterface', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('fsType')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.fsType')"
          @input="setField('fsType', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('initiatorName')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.initiatorName')"
          @input="setField('initiatorName', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('chapAuthDiscovery')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.chapAuthDiscovery')"
          @input="setBooleanField('chapAuthDiscovery', $event)"
        />
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('chapAuthSession')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.chapAuthSession')"
          @input="setBooleanField('chapAuthSession', $event)"
        />
      </div>
      <div class="col span-4">
        <div class="spacer-tiny" />
        <Checkbox
          :value="getField('readOnly')"
          :mode="mode"
          :label="t('verrazzano.config.fields.volumes.iscsi.readOnly')"
          @input="setBooleanField('readOnly', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('secretRef.name')"
          :mode="mode"
          :options="secrets"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          :label="t('verrazzano.config.fields.volumes.iscsi.secretRefName')"
          @input="setField('secretRef.name', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <LabeledArrayList
        :value="getListField('portals')"
        :mode="mode"
        :value-label="t('verrazzano.config.fields.volumes.iscsi.portal')"
        :add-label="t('verrazzano.config.buttons.addTargetPortal')"
        @input="setFieldIfNotEmpty('portals', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
  .spacer-tiny {
    padding: 5px 0 0 0;
  }
</style>
