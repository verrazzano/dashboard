<script>
// Added by Verrazzano
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import OnlineUpdates from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/OnlineUpdates';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

import { CONFIG_MAP, SECRET } from '@/config/types';
import { allHash } from '@/utils/promise';

export default {
  name:       'ConfigurationModel',
  components: {
    LabeledInput,
    LabeledSelect,
    OnlineUpdates,
  },
  mixins: [WeblogicWorkloadHelper],
  props:  {
    value: {
      // model object
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
      namespace:     '',
      allSecrets:    {},
      allConfigMaps: {}
    };
  },
  async fetch() {
    this.allSecrets = {};

    const requests = { secrets: this.$store.dispatch('cluster/findAll', { type: SECRET }) };

    if (this.$store.getters['cluster/schemaFor'](CONFIG_MAP)) {
      requests.configMaps = this.$store.dispatch('cluster/findAll', { type: CONFIG_MAP });
    }

    const hash = await allHash(requests);

    if (hash.secrets) {
      this.sortObjectsByNamespace(hash.secrets, this.allSecrets);
    }
    if (hash.configMaps) {
      this.sortObjectsByNamespace(hash.configMaps, this.allConfigMaps);
    }
  },
  computed: {
    secrets() {
      const namespace = this.get(this.namespacedObject, 'metadata.namespace');

      return this.allSecrets[namespace] || [];
    },
    configMaps() {
      const namespace = this.get(this.namespacedObject, 'metadata.namespace');

      return this.allConfigMaps[namespace] || [];
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-4">
        <LabeledInput
          :value="getField('wdtInstallHome')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.wdtInstallHome')"
          :placeholder="getNotSetPlaceholder(value, 'wdtInstallHome')"
          @input="setField('wdtInstallHome', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledInput
          :value="getField('modelHome')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.modelHome')"
          :placeholder="getNotSetPlaceholder(value, 'modelHome')"
          @input="setField('modelHome', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('domainType')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.domainType')"
          :placeholder="getNotSetPlaceholder(value, 'domainType')"
          :options="[
            {
              value: 'WLS',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.domainType.wls')
            },
            {
              value: 'JRF',
              label: t('verrazzano.VerrazzanoWebLogicWorkload.config.values.types.domainType.jrf')
            },
          ]"
          :mode="mode"
          option-label="label"
          option-key="value"
          @input="setField('domainType', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div class="row">
      <div class="col span-4">
        <LabeledSelect
          :value="getField('runtimeEncryptionSecret')"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.runtimeEncryptionSecret')"
          :placeholder="getNotSetPlaceholder(value, 'runtimeEncryptionSecret')"
          :options="secrets"
          :mode="mode"
          option-label="metadata.name"
          :reduce="secret => secret.metadata.name"
          required
          @input="setField('runtimeEncryptionSecret', $event)"
        />
      </div>
      <div class="col span-4">
        <LabeledSelect
          :value="getField('configMap')"
          :mode="mode"
          :label="t('verrazzano.VerrazzanoWebLogicWorkload.config.fields.configuration.model.configMap')"
          :placeholder="getNotSetPlaceholder(value, 'configMap')"
          :options="configMaps"
          option-label="metadata.name"
          :reduce="configMap => configMap.metadata.name"
          @input="setField('configMap', $event)"
        />
      </div>
    </div>
    <div class="spacer-small" />
    <div>
      <h4>{{ t('verrazzano.VerrazzanoWebLogicWorkload.config.titles.onlineUpdates') }}</h4>
      <OnlineUpdates
        :value="getField('onlineUpdates')"
        :mode="mode"
        @input="setFieldIfNotEmpty('onlineUpdates', $event)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
